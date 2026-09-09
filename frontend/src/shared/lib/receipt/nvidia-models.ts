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

export const DEFAULT_VISION_MODEL = "meta/llama-3.2-11b-vision-instruct";
export const DEFAULT_TEXT_MODEL = "meta/llama-3.2-11b-vision-instruct";

// Models known to be EOL/sunset on NVIDIA NIM or text-only (cannot accept image_url)
export const SUNSET_OR_NON_VISION_MODELS = new Set([
  "meta/llama-3.1-70b-instruct",
  "meta/llama-3.1-8b-instruct",
  "meta/llama-3.1-405b-instruct",
  "meta/llama-3-70b-instruct",
  "meta/llama-3-8b-instruct",
  "mistralai/mixtral-8x7b-instruct-v0.1",
  "microsoft/phi-3-vision-128k-instruct", // 404 on current NIM
  "nvidia/neva-22b", // 404 on current NIM
]);

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
      process.env.NVIDIA_VISION_MODEL ||
      process.env.NVIDIA_API_MODEL ||
      DEFAULT_VISION_MODEL;
    this.timeoutMs = config.timeoutMs || 45000;
    this.maxRetries = config.maxRetries ?? 1;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Resolves the best active vision model, automatically migrating deprecated or text-only models
   */
  public resolveVisionModel(): string {
    const candidate = this.model?.trim();
    if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate)) {
      if (candidate && candidate !== DEFAULT_VISION_MODEL) {
        console.warn(
          `[NvidiaModelsClient] Configured model '${candidate}' is sunset/EOL or does not support vision. Auto-migrating to '${DEFAULT_VISION_MODEL}'.`
        );
      }
      return DEFAULT_VISION_MODEL;
    }
    return candidate;
  }

  /**
   * Resolves the best active text model, automatically migrating deprecated models
   */
  public resolveTextModel(): string {
    const candidate = (process.env.NVIDIA_API_MODEL || this.model)?.trim();
    if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate)) {
      if (candidate && candidate !== DEFAULT_TEXT_MODEL) {
        console.warn(
          `[NvidiaModelsClient] Configured text model '${candidate}' is sunset/EOL. Auto-migrating to '${DEFAULT_TEXT_MODEL}'.`
        );
      }
      return DEFAULT_TEXT_MODEL;
    }
    return candidate;
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

    const activeVisionModel = this.resolveVisionModel();

    try {
      return await this.callWithRetry(messages, activeVisionModel);
    } catch (primaryErr: unknown) {
      if (activeVisionModel !== DEFAULT_VISION_MODEL) {
        console.warn(
          `Primary vision model (${activeVisionModel}) failed, attempting fallback to ${DEFAULT_VISION_MODEL}:`,
          primaryErr
        );
        try {
          return await this.callWithRetry(messages, DEFAULT_VISION_MODEL, 0, 45000);
        } catch (fallbackErr: unknown) {
          console.error(`Fallback vision model (${DEFAULT_VISION_MODEL}) also failed:`, fallbackErr);
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

    const activeTextModel = this.resolveTextModel();

    try {
      return await this.callWithRetry(messages, activeTextModel);
    } catch (primaryErr: unknown) {
      if (activeTextModel !== DEFAULT_TEXT_MODEL) {
        console.warn(
          `Primary model (${activeTextModel}) failed, falling back to ${DEFAULT_TEXT_MODEL}:`,
          primaryErr
        );
        try {
          return await this.callWithRetry(messages, DEFAULT_TEXT_MODEL, 0, 25000);
        } catch (fallbackErr: unknown) {
          console.error(`Fallback model (${DEFAULT_TEXT_MODEL}) also failed:`, fallbackErr);
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

        // Model Gone / EOL (410) or Not Found (404) -> Auto-switch to default proven model
        if ((response.status === 410 || response.status === 404) && model !== DEFAULT_VISION_MODEL) {
          console.warn(
            `[NvidiaModelsClient] Model '${model}' returned HTTP ${response.status} (${errorMessage}). Auto-switching to '${DEFAULT_VISION_MODEL}'.`
          );
          return this.callWithRetry(messages, DEFAULT_VISION_MODEL, 0, customTimeoutMs);
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
