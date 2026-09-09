export interface NvidiaModelsConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export type MessageContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | MessageContentPart[];
}

export class NvidiaModelsError extends Error {
  statusCode?: number;
  code?: string;
  retryAfter?: number;

  constructor(message: string, statusCode?: number, code?: string, retryAfter?: number) {
    super(message);
    this.name = "NvidiaModelsError";
    this.statusCode = statusCode;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

/**
 * Client for NVIDIA NIM API endpoint with vision & fast-model fallback
 */
export class NvidiaModelsClient {
  private apiKey: string;
  private endpoint: string;
  private model: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(config: NvidiaModelsConfig = {}) {
    this.apiKey =
      config.apiKey ||
      process.env.NVIDIA_API_KEY ||
      process.env.NVIDIA_BUILD_API_KEY ||
      "";
    this.endpoint =
      config.endpoint ||
      process.env.NVIDIA_API_ENDPOINT ||
      "https://integrate.api.nvidia.com/v1";
    this.model =
      config.model ||
      process.env.NVIDIA_API_MODEL ||
      "meta/llama-3.2-11b-vision-instruct";
    this.timeoutMs = config.timeoutMs || 15000;
    this.maxRetries = config.maxRetries ?? 1;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Directly analyze an image using NVIDIA Vision Multimodal Model
   */
  public async analyzeImage(
    base64Image: string,
    mimeType = "image/jpeg",
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const imageUrl = base64Image.startsWith("data:")
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    const messages: ChatMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: imageUrl } },
      ],
    });

    try {
      return await this.callWithRetry(messages, this.model);
    } catch (primaryErr: unknown) {
      const fallbackVision = "meta/llama-3.2-90b-vision-instruct";
      if (this.model !== fallbackVision) {
        console.warn(`Primary vision model (${this.model}) failed, attempting fallback to ${fallbackVision}:`, primaryErr);
        try {
          return await this.callWithRetry(messages, fallbackVision, 0, 15000);
        } catch (fallbackErr: unknown) {
          console.error(`Fallback vision model (${fallbackVision}) also failed:`, fallbackErr);
        }
      }
      throw primaryErr;
    }
  }

  /**
   * Send a text completion request with automatic retry and fallback
   */
  public async analyzeText(
    prompt: string,
    systemPrompt?: string
  ): Promise<string> {
    const messages: ChatMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    messages.push({
      role: "user",
      content: prompt,
    });

    try {
      return await this.callWithRetry(messages, this.model);
    } catch (primaryErr: unknown) {
      const fallbackModel = "deepseek-ai/deepseek-v4-flash-0731";
      if (this.model !== fallbackModel) {
        console.warn(`Primary model (${this.model}) failed, falling back to ${fallbackModel}:`, primaryErr);
        try {
          return await this.callWithRetry(messages, fallbackModel, 0, 15000);
        } catch (fallbackErr: unknown) {
          console.error(`Fallback model (${fallbackModel}) also failed:`, fallbackErr);
        }
      }
      throw primaryErr;
    }
  }

  private async callWithRetry(
    messages: ChatMessage[],
    model: string,
    attempt = 0,
    customTimeoutMs?: number
  ): Promise<string> {
    const url = `${this.endpoint.replace(/\/$/, "")}/chat/completions`;
    const timeout = customTimeoutMs || this.timeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.1,
          max_tokens: 2048,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorJson: { error?: { message?: string; code?: string }; detail?: string } = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore
        }

        const errorMessage =
          errorJson.error?.message ||
          errorJson.detail ||
          errorText ||
          `HTTP ${response.status} ${response.statusText}`;

        // Rate Limit (429) -> Check Retry-After or wait 3s
        if (response.status === 429 && attempt < this.maxRetries) {
          const retryAfterHeader = response.headers.get("retry-after");
          const waitMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 3000;
          await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 2000)));
          return this.callWithRetry(messages, model, attempt + 1, customTimeoutMs);
        }

        // Server Error (5xx) -> Exponential backoff retry
        if (response.status >= 500 && attempt < this.maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.callWithRetry(messages, model, attempt + 1, customTimeoutMs);
        }

        throw new NvidiaModelsError(
          `NVIDIA API error (${response.status}): ${errorMessage}`,
          response.status,
          errorJson.error?.code
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new NvidiaModelsError("Empty response from NVIDIA model", 500);
      }

      return content;
    } catch (err: unknown) {
      clearTimeout(timer);

      if (err instanceof NvidiaModelsError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new NvidiaModelsError(`Request timed out after ${Math.round(timeout / 1000)} seconds`, 408, "TIMEOUT");
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      throw new NvidiaModelsError(`Failed to connect to NVIDIA API: ${message}`, 500);
    }
  }
}
