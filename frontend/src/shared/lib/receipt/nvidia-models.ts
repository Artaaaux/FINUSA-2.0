export interface NvidiaModelsConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
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
 * Client for NVIDIA NIM API endpoint with automatic fast-model fallback
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
      "meta/llama-3.1-70b-instruct";
    this.timeoutMs = config.timeoutMs || 25000;
    this.maxRetries = config.maxRetries ?? 1;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Send a completion request with automatic retry and rate-limiting handling
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
      // If primary model failed or timed out, and primary was not already 8b, fallback to fast 8B model
      const fallbackModel = "meta/llama-3.1-8b-instruct";
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
          response_format: { type: "json_object" },
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        let errorJson: { error?: { message?: string; code?: string } } = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch {
          // ignore
        }

        const errorMessage = errorJson.error?.message || errorText || `HTTP ${response.status} ${response.statusText}`;

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
