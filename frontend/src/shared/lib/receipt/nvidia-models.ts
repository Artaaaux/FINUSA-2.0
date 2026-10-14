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

export interface AnalyzeOptions {
  /** Request strict JSON output via response_format (default: true) */
  jsonMode?: boolean;
  /**
   * Merge the system prompt into the user message instead of sending a separate system role.
   * Many vision models (Llama 3.2 Vision, Gemma) ignore or mishandle a system role when an image
   * is attached, so this defaults to true for image requests.
   */
  inlineSystemPrompt?: boolean;
  maxTokens?: number;
  timeoutMs?: number;
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
export const FALLBACK_VISION_MODEL = "meta/llama-3.2-90b-vision-instruct";
export const DEFAULT_TEXT_MODEL = DEFAULT_VISION_MODEL;

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

export const LEGACY_WEAK_VISION_MODELS = new Set<string>([]);

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
    this.maxRetries = config.maxRetries ?? 2;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  /**
   * Resolves the best active vision model, automatically migrating deprecated, weak or text-only models
   */
  public resolveVisionModel(): string {
    const candidate = this.model?.trim();
    if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate) || LEGACY_WEAK_VISION_MODELS.has(candidate)) {
      if (candidate && candidate !== DEFAULT_VISION_MODEL) {
        console.warn(
          `[NvidiaModelsClient] Configured model '${candidate}' is sunset/weak or does not support vision. Auto-migrating to '${DEFAULT_VISION_MODEL}'.`
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
    const candidate = (process.env.NVIDIA_TEXT_MODEL || this.model)?.trim();
    if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate) || LEGACY_WEAK_VISION_MODELS.has(candidate)) {
      if (candidate && candidate !== DEFAULT_TEXT_MODEL) {
        console.warn(
          `[NvidiaModelsClient] Configured text model '${candidate}' is sunset/weak. Auto-migrating to '${DEFAULT_TEXT_MODEL}'.`
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
    systemPrompt?: string,
    options: AnalyzeOptions = {}
  ): Promise<string> {
    const { jsonMode = true, inlineSystemPrompt = true, maxTokens, timeoutMs } = options;
    const imageUrl = base64Image.startsWith("data:")
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    const messages: ChatMessage[] = [];

    if (systemPrompt && !inlineSystemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    const userText =
      systemPrompt && inlineSystemPrompt
        ? `${systemPrompt}\n\n---\nTASK:\n${prompt}`
        : prompt;

    // Image first, then instructions: vision models attend to the image better in this order
    messages.push({
      role: "user",
      content: [
        { type: "image_url", image_url: { url: imageUrl } },
        { type: "text", text: userText },
      ],
    });

    const activeVisionModel = this.resolveVisionModel();
    const callOpts = { jsonMode, maxTokens, timeoutMs };

    try {
      return await this.callWithRetry(messages, activeVisionModel, callOpts);
    } catch (primaryErr: unknown) {
      if (activeVisionModel !== FALLBACK_VISION_MODEL) {
        console.warn(
          `Primary vision model (${activeVisionModel}) failed, attempting fallback to ${FALLBACK_VISION_MODEL}:`,
          primaryErr
        );
        try {
          return await this.callWithRetry(messages, FALLBACK_VISION_MODEL, {
            ...callOpts,
            timeoutMs: Math.max(50000, timeoutMs || 45000),
            maxRetries: 0,
          });
        } catch (fallbackErr: unknown) {
          console.error(`Fallback vision model (${FALLBACK_VISION_MODEL}) also failed:`, fallbackErr);
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
    systemPrompt?: string,
    options: AnalyzeOptions = {}
  ): Promise<string> {
    const { jsonMode = true, maxTokens, timeoutMs } = options;
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
    const callOpts = { jsonMode, maxTokens, timeoutMs };

    try {
      return await this.callWithRetry(messages, activeTextModel, callOpts);
    } catch (primaryErr: unknown) {
      if (activeTextModel !== FALLBACK_VISION_MODEL) {
        console.warn(
          `Primary model (${activeTextModel}) failed, falling back to ${FALLBACK_VISION_MODEL}:`,
          primaryErr
        );
        try {
          return await this.callWithRetry(messages, FALLBACK_VISION_MODEL, { ...callOpts, maxRetries: 0 });
        } catch (fallbackErr: unknown) {
          console.error(`Fallback model (${FALLBACK_VISION_MODEL}) also failed:`, fallbackErr);
        }
      }
      throw primaryErr;
    }
  }

  private async callWithRetry(
    messages: ChatMessage[],
    model: string,
    opts: { jsonMode?: boolean; maxTokens?: number; timeoutMs?: number; maxRetries?: number } = {},
    attempt = 0
  ): Promise<string> {
    const url = `${this.endpoint.replace(/\/$/, "")}/chat/completions`;
    const timeout = opts.timeoutMs || this.timeoutMs;
    const maxRetries = opts.maxRetries ?? this.maxRetries;
    const jsonMode = opts.jsonMode ?? true;
    const maxTokens = opts.maxTokens || 2048;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const baseBody = {
      model,
      messages,
      temperature: 0.1,
      max_tokens: maxTokens,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(
          jsonMode ? { ...baseBody, response_format: { type: "json_object" } } : baseBody
        ),
        signal: controller.signal,
      });

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

        // If response_format is rejected by endpoint, retry without it
        if (jsonMode && response.status === 400 && errorText.includes("response_format")) {
          const fallbackRes = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(baseBody),
            signal: controller.signal,
          });
          if (fallbackRes.ok) {
            const fbData = await fallbackRes.json();
            clearTimeout(timer);
            return fbData.choices?.[0]?.message?.content || "";
          }
        }

        clearTimeout(timer);

        // Rate Limit (429) -> Check Retry-After or wait 3s
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfterHeader = response.headers.get("retry-after");
          const waitMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 3000;
          await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 2000)));
          return this.callWithRetry(messages, model, opts, attempt + 1);
        }

        // Server Error (5xx) -> Exponential backoff retry (e.g. 1.5s, 3s)
        if (response.status >= 500 && attempt < maxRetries) {
          const backoffMs = (attempt + 1) * 1500;
          console.warn(
            `[NvidiaModelsClient] Server error ${response.status} from model '${model}' (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${backoffMs}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.callWithRetry(messages, model, opts, attempt + 1);
        }

        // Model Gone / EOL (410) or Not Found (404) -> Auto-switch to proven fallback model
        if ((response.status === 410 || response.status === 404) && model !== FALLBACK_VISION_MODEL) {
          console.warn(
            `[NvidiaModelsClient] Model '${model}' returned HTTP ${response.status} (${errorMessage}). Auto-switching to '${FALLBACK_VISION_MODEL}'.`
          );
          return this.callWithRetry(messages, FALLBACK_VISION_MODEL, opts, 0);
        }

        throw new NvidiaModelsError(
          `NVIDIA API error (${response.status}): ${errorMessage}`,
          response.status,
          errorJson.error?.code
        );
      }

      const data = await response.json();
      clearTimeout(timer);
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

      // Transient network or connection drops (e.g. socket reset, fetch failed)
      if (attempt < maxRetries) {
        const backoffMs = (attempt + 1) * 1500;
        console.warn(
          `[NvidiaModelsClient] Network error during request (attempt ${attempt + 1}/${maxRetries + 1}): ${
            err instanceof Error ? err.message : String(err)
          }. Retrying in ${backoffMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return this.callWithRetry(messages, model, opts, attempt + 1);
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      throw new NvidiaModelsError(`Failed to connect to NVIDIA API: ${message}`, 500);
    }
  }
}
