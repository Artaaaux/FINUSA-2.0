export interface NvidiaModelsConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  backupApiKey?: string;
  backupEndpoint?: string;
  backupModel?: string;
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
   * Many vision models (Llama 3.2 Vision, Gemma, Qwen) attend to instructions better when
   * inlined with the user message when an image is attached.
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
 * Universal OpenAI-compatible client supporting NVIDIA NIM and 3rd party providers (MecutinAI, OpenRouter, etc.)
 * with automatic backup failover.
 */
export class NvidiaModelsClient {
  private apiKey: string;
  private endpoint: string;
  private model: string;
  private backupApiKey: string;
  private backupEndpoint: string;
  private backupModel: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(config: NvidiaModelsConfig = {}) {
    this.apiKey =
      config.apiKey ||
      process.env.NVIDIA_API_KEY ||
      process.env.NVIDIA_BUILD_API_KEY ||
      process.env.AI_API_KEY ||
      "";
    this.endpoint =
      config.endpoint ||
      process.env.NVIDIA_API_ENDPOINT ||
      process.env.AI_API_ENDPOINT ||
      "https://integrate.api.nvidia.com/v1";
    this.model =
      config.model ||
      process.env.NVIDIA_VISION_MODEL ||
      process.env.NVIDIA_API_MODEL ||
      process.env.AI_VISION_MODEL ||
      DEFAULT_VISION_MODEL;

    // Backup AI Provider (MecutinAI / OpenRouter / etc.)
    this.backupApiKey =
      config.backupApiKey ||
      process.env.BACKUP_AI_API_KEY ||
      process.env.MECUTIN_API_KEY ||
      "";
    this.backupEndpoint =
      config.backupEndpoint ||
      process.env.BACKUP_AI_API_ENDPOINT ||
      process.env.MECUTIN_API_ENDPOINT ||
      "https://mecutinai.com/api/v1";
    this.backupModel =
      config.backupModel ||
      process.env.BACKUP_AI_MODEL ||
      process.env.MECUTIN_VISION_MODEL ||
      "qwen3.8-flash";

    this.timeoutMs = config.timeoutMs || 45000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  public isConfigured(): boolean {
    return Boolean(
      (this.apiKey && this.apiKey.trim().length > 0) ||
      (this.backupApiKey && this.backupApiKey.trim().length > 0)
    );
  }

  public hasBackupConfigured(): boolean {
    return Boolean(this.backupApiKey && this.backupApiKey.trim().length > 0);
  }

  /**
   * Resolves the best active vision model
   */
  public resolveVisionModel(endpoint = this.endpoint, model = this.model): string {
    const candidate = model?.trim();
    const isNvidia = endpoint.includes("nvidia.com");

    if (isNvidia) {
      if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate) || LEGACY_WEAK_VISION_MODELS.has(candidate)) {
        if (candidate && candidate !== DEFAULT_VISION_MODEL) {
          console.warn(
            `[AIClient] Configured model '${candidate}' is sunset/weak on NVIDIA NIM. Auto-migrating to '${DEFAULT_VISION_MODEL}'.`
          );
        }
        return DEFAULT_VISION_MODEL;
      }
      return candidate;
    }

    // Custom or 3rd-party provider (e.g. MecutinAI)
    return candidate || "qwen3.8-flash";
  }

  /**
   * Resolves the best active text model
   */
  public resolveTextModel(endpoint = this.endpoint, model = this.model): string {
    const candidate = (process.env.NVIDIA_TEXT_MODEL || model)?.trim();
    const isNvidia = endpoint.includes("nvidia.com");

    if (isNvidia) {
      if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate) || LEGACY_WEAK_VISION_MODELS.has(candidate)) {
        if (candidate && candidate !== DEFAULT_TEXT_MODEL) {
          console.warn(
            `[AIClient] Configured text model '${candidate}' is sunset/weak on NVIDIA NIM. Auto-migrating to '${DEFAULT_TEXT_MODEL}'.`
          );
        }
        return DEFAULT_TEXT_MODEL;
      }
      return candidate;
    }

    return candidate || "qwen3.8-flash";
  }

  /**
   * Directly analyze an image using Multimodal Vision Model with auto-failover
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
      const isTimeout =
        primaryErr instanceof NvidiaModelsError &&
        (primaryErr.code === "TIMEOUT" || primaryErr.statusCode === 408);

      // If NVIDIA NIM primary failed, attempt 90B on NIM if not a timeout
      if (this.endpoint.includes("nvidia.com") && !isTimeout && activeVisionModel !== FALLBACK_VISION_MODEL) {
        console.warn(
          `Primary vision model (${activeVisionModel}) failed, attempting NIM fallback to ${FALLBACK_VISION_MODEL}:`,
          primaryErr
        );
        try {
          return await this.callWithRetry(messages, FALLBACK_VISION_MODEL, {
            ...callOpts,
            timeoutMs: Math.max(50000, timeoutMs || 45000),
            maxRetries: 0,
          });
        } catch (fallbackErr: unknown) {
          console.error(`NIM fallback vision model (${FALLBACK_VISION_MODEL}) also failed:`, fallbackErr);
        }
      }
      throw primaryErr;
    }
  }

  /**
   * Send a text completion request with automatic retry and failover
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
      if (this.endpoint.includes("nvidia.com") && activeTextModel !== FALLBACK_VISION_MODEL) {
        console.warn(
          `Primary model (${activeTextModel}) failed, falling back to NIM ${FALLBACK_VISION_MODEL}:`,
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

  /**
   * Main dispatch with automatic multi-provider failover
   */
  private async callWithRetry(
    messages: ChatMessage[],
    model: string,
    opts: { jsonMode?: boolean; maxTokens?: number; timeoutMs?: number; maxRetries?: number } = {},
    attempt = 0
  ): Promise<string> {
    // 1. If primary key is absent but backup is configured, invoke backup directly
    if (!this.apiKey && this.hasBackupConfigured()) {
      return this.executeChatCompletion(
        this.backupEndpoint,
        this.backupApiKey,
        this.backupModel,
        messages,
        opts,
        attempt
      );
    }

    // 2. Try Primary Provider
    try {
      return await this.executeChatCompletion(
        this.endpoint,
        this.apiKey,
        model,
        messages,
        opts,
        attempt
      );
    } catch (primaryErr: unknown) {
      // 3. If Primary Provider fails and Backup Provider is configured, failover to Backup!
      if (this.hasBackupConfigured()) {
        console.warn(
          `[AIClient] Primary provider (${this.endpoint}) failed with: ${
            primaryErr instanceof Error ? primaryErr.message : String(primaryErr)
          }. Failing over to Backup Provider (${this.backupEndpoint} - ${this.backupModel})...`
        );
        try {
          return await this.executeChatCompletion(
            this.backupEndpoint,
            this.backupApiKey,
            this.backupModel,
            messages,
            { ...opts, maxRetries: 1 }
          );
        } catch (backupErr: unknown) {
          console.error(`[AIClient] Backup provider (${this.backupEndpoint}) also failed:`, backupErr);
        }
      }
      throw primaryErr;
    }
  }

  /**
   * Raw HTTP call to any OpenAI-compatible /chat/completions endpoint
   */
  private async executeChatCompletion(
    endpoint: string,
    apiKey: string,
    model: string,
    messages: ChatMessage[],
    opts: { jsonMode?: boolean; maxTokens?: number; timeoutMs?: number; maxRetries?: number } = {},
    attempt = 0
  ): Promise<string> {
    const url = `${endpoint.replace(/\/$/, "")}/chat/completions`;
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
          Authorization: `Bearer ${apiKey}`,
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

        // If response_format is rejected by endpoint (e.g. certain 3rd party models), retry without it
        if (jsonMode && response.status === 400 && errorText.includes("response_format")) {
          const fallbackRes = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
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
          return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
        }

        // Server Error (5xx) -> Exponential backoff retry
        if (response.status >= 500 && attempt < maxRetries) {
          const backoffMs = (attempt + 1) * 1500;
          console.warn(
            `[AIClient] Server error ${response.status} from '${model}' at '${endpoint}' (attempt ${attempt + 1}/${maxRetries + 1}). Retrying in ${backoffMs}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
        }

        // Model Gone / EOL (410) or Not Found (404) -> Auto-switch to proven fallback model on NIM
        if (endpoint.includes("nvidia.com") && (response.status === 410 || response.status === 404) && model !== FALLBACK_VISION_MODEL) {
          console.warn(
            `[AIClient] Model '${model}' returned HTTP ${response.status} (${errorMessage}). Auto-switching to '${FALLBACK_VISION_MODEL}'.`
          );
          return this.executeChatCompletion(endpoint, apiKey, FALLBACK_VISION_MODEL, messages, opts, 0);
        }

        throw new NvidiaModelsError(
          `AI API error (${response.status}) at ${endpoint}: ${errorMessage}`,
          response.status,
          errorJson.error?.code
        );
      }

      const data = await response.json();
      clearTimeout(timer);
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new NvidiaModelsError("Empty response from AI model", 500);
      }

      return content;
    } catch (err: unknown) {
      clearTimeout(timer);

      if (err instanceof NvidiaModelsError) {
        throw err;
      }

      if (err instanceof Error && err.name === "AbortError") {
        throw new NvidiaModelsError(`Request to ${endpoint} timed out after ${Math.round(timeout / 1000)} seconds`, 408, "TIMEOUT");
      }

      if (attempt < maxRetries) {
        const backoffMs = (attempt + 1) * 1500;
        console.warn(
          `[AIClient] Network error during request to ${endpoint} (attempt ${attempt + 1}/${maxRetries + 1}): ${
            err instanceof Error ? err.message : String(err)
          }. Retrying in ${backoffMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      throw new NvidiaModelsError(`Failed to connect to AI API at ${endpoint}: ${message}`, 500);
    }
  }
}
