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
   * Inlined system prompts are far better attended by multimodal models (Qwen, Llama, DeepSeek).
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
 * High-performance Dual-Provider AI Client with Fast Failover.
 * Primary: MecutinAI (qwen3.8-flash) - Ultra fast (1-3s)
 * Failover: NVIDIA NIM (meta/llama-3.2-11b-vision-instruct) - Resilient backup
 */
export class NvidiaModelsClient {
  public primaryApiKey: string;
  public primaryEndpoint: string;
  public primaryModel: string;

  public backupApiKey: string;
  public backupEndpoint: string;
  public backupModel: string;

  private primaryTimeoutMs: number;
  private backupTimeoutMs: number;
  private maxRetries: number;

  constructor(config: NvidiaModelsConfig = {}) {
    // Detect if custom Primary (MecutinAI) is configured
    const hasCustomPrimary = Boolean(
      config.apiKey ||
      process.env.PRIMARY_AI_API_KEY ||
      process.env.MECUTIN_API_KEY
    );

    if (hasCustomPrimary) {
      // Primary: MecutinAI
      this.primaryApiKey =
        config.apiKey ||
        process.env.PRIMARY_AI_API_KEY ||
        process.env.MECUTIN_API_KEY ||
        "";
      this.primaryEndpoint =
        config.endpoint ||
        process.env.PRIMARY_AI_API_ENDPOINT ||
        process.env.MECUTIN_API_ENDPOINT ||
        "https://mecutinai.com/api/v1";
      this.primaryModel =
        config.model ||
        process.env.PRIMARY_AI_MODEL ||
        process.env.MECUTIN_VISION_MODEL ||
        "qwen3.8-flash";

      // Backup: NVIDIA NIM
      this.backupApiKey =
        config.backupApiKey ||
        process.env.BACKUP_AI_API_KEY ||
        process.env.NVIDIA_API_KEY ||
        "";
      this.backupEndpoint =
        config.backupEndpoint ||
        process.env.BACKUP_AI_API_ENDPOINT ||
        process.env.NVIDIA_API_ENDPOINT ||
        "https://integrate.api.nvidia.com/v1";
      this.backupModel =
        config.backupModel ||
        process.env.BACKUP_AI_MODEL ||
        process.env.NVIDIA_VISION_MODEL ||
        process.env.NVIDIA_API_MODEL ||
        DEFAULT_VISION_MODEL;
    } else {
      // Default: NVIDIA NIM is Primary
      this.primaryApiKey =
        config.apiKey ||
        process.env.NVIDIA_API_KEY ||
        process.env.NVIDIA_BUILD_API_KEY ||
        "";
      this.primaryEndpoint =
        config.endpoint ||
        process.env.NVIDIA_API_ENDPOINT ||
        "https://integrate.api.nvidia.com/v1";
      this.primaryModel =
        config.model ||
        process.env.NVIDIA_VISION_MODEL ||
        process.env.NVIDIA_API_MODEL ||
        DEFAULT_VISION_MODEL;

      // Backup: MecutinAI or custom backup if configured
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
    }

    // Fast primary timeout (18s) to guarantee plenty of headroom for backup failover without hitting 60s gateway timeout
    this.primaryTimeoutMs = 18000;
    this.backupTimeoutMs = 25000;
    this.maxRetries = config.maxRetries ?? 1;
  }

  public isConfigured(): boolean {
    return Boolean(
      (this.primaryApiKey && this.primaryApiKey.trim().length > 0) ||
      (this.backupApiKey && this.backupApiKey.trim().length > 0)
    );
  }

  public hasBackupConfigured(): boolean {
    return Boolean(this.backupApiKey && this.backupApiKey.trim().length > 0);
  }

  public resolveVisionModel(endpoint: string, model: string): string {
    const candidate = model?.trim();
    const isNvidia = endpoint.includes("nvidia.com");

    if (isNvidia) {
      if (!candidate || SUNSET_OR_NON_VISION_MODELS.has(candidate) || LEGACY_WEAK_VISION_MODELS.has(candidate)) {
        if (candidate && candidate !== DEFAULT_VISION_MODEL) {
          console.warn(
            `[AIClient] Model '${candidate}' is sunset/weak on NVIDIA NIM. Migrating to '${DEFAULT_VISION_MODEL}'.`
          );
        }
        return DEFAULT_VISION_MODEL;
      }
      return candidate;
    }

    // MecutinAI / OpenAI-compatible provider
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
    const { jsonMode = true, inlineSystemPrompt = true, maxTokens } = options;
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

    return await this.dispatchWithFailover(messages, { jsonMode, maxTokens });
  }

  /**
   * Send a text completion request with automatic retry and failover
   */
  public async analyzeText(
    prompt: string,
    systemPrompt?: string,
    options: AnalyzeOptions = {}
  ): Promise<string> {
    const { jsonMode = true, maxTokens } = options;
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

    return await this.dispatchWithFailover(messages, { jsonMode, maxTokens });
  }

  /**
   * Dispatches request to Primary Provider, and on ANY failure immediately falls over to Backup Provider
   */
  private async dispatchWithFailover(
    messages: ChatMessage[],
    opts: { jsonMode?: boolean; maxTokens?: number } = {}
  ): Promise<string> {
    const primaryActiveModel = this.resolveVisionModel(this.primaryEndpoint, this.primaryModel);
    const backupActiveModel = this.resolveVisionModel(this.backupEndpoint, this.backupModel);

    // 1. If Primary API key is missing but Backup is configured, jump straight to Backup
    if (!this.primaryApiKey && this.hasBackupConfigured()) {
      console.info(`[AIClient] Primary key not set, invoking Backup (${this.backupEndpoint} - ${backupActiveModel}) directly.`);
      return await this.executeChatCompletion(
        this.backupEndpoint,
        this.backupApiKey,
        backupActiveModel,
        messages,
        { ...opts, timeoutMs: this.backupTimeoutMs, maxRetries: 1 }
      );
    }

    // 2. Try Primary Provider (Fast timeout: 18s)
    const started = Date.now();
    try {
      console.info(`[AIClient] Attempting Primary AI: ${this.primaryEndpoint} (${primaryActiveModel})...`);
      const result = await this.executeChatCompletion(
        this.primaryEndpoint,
        this.primaryApiKey,
        primaryActiveModel,
        messages,
        { ...opts, timeoutMs: this.primaryTimeoutMs, maxRetries: 0 }
      );
      console.info(`[AIClient] Primary AI succeeded in ${Date.now() - started}ms.`);
      return result;
    } catch (primaryErr: unknown) {
      const elapsed = Date.now() - started;
      const errMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);

      console.warn(
        `[AIClient] Primary AI (${this.primaryEndpoint} - ${primaryActiveModel}) failed after ${elapsed}ms: ${errMsg}`
      );

      // 3. Failover to Backup Provider (NVIDIA NIM)
      if (this.hasBackupConfigured()) {
        console.warn(
          `[AIClient] ⚡ Instantly failing over to Backup AI: ${this.backupEndpoint} (${backupActiveModel})...`
        );
        try {
          const backupStarted = Date.now();
          const backupResult = await this.executeChatCompletion(
            this.backupEndpoint,
            this.backupApiKey,
            backupActiveModel,
            messages,
            { ...opts, timeoutMs: this.backupTimeoutMs, maxRetries: 1 }
          );
          console.info(`[AIClient] Backup AI succeeded in ${Date.now() - backupStarted}ms.`);
          return backupResult;
        } catch (backupErr: unknown) {
          const backupErrMsg = backupErr instanceof Error ? backupErr.message : String(backupErr);
          console.error(`[AIClient] Backup AI (${this.backupEndpoint}) also failed: ${backupErrMsg}`);
        }
      }

      // If both failed or backup not configured, throw original primary error
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
    const timeout = opts.timeoutMs || this.primaryTimeoutMs;
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

        // If response_format is rejected by endpoint, retry immediately without response_format
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

        // Rate Limit (429) -> Check Retry-After
        if (response.status === 429 && attempt < maxRetries) {
          const retryAfterHeader = response.headers.get("retry-after");
          const waitMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : 2000;
          await new Promise((resolve) => setTimeout(resolve, Math.max(waitMs, 1500)));
          return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
        }

        // Server Error (5xx) -> Quick backoff retry if retries left
        if (response.status >= 500 && attempt < maxRetries) {
          const backoffMs = (attempt + 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
        }

        throw new NvidiaModelsError(
          `API error (${response.status}) from ${endpoint}: ${errorMessage}`,
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
        throw new NvidiaModelsError(
          `Request to ${endpoint} timed out after ${Math.round(timeout / 1000)} seconds`,
          408,
          "TIMEOUT"
        );
      }

      if (attempt < maxRetries) {
        const backoffMs = (attempt + 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return this.executeChatCompletion(endpoint, apiKey, model, messages, opts, attempt + 1);
      }

      const message = err instanceof Error ? err.message : "Unknown error";
      throw new NvidiaModelsError(`Connection to ${endpoint} failed: ${message}`, 500);
    }
  }
}
