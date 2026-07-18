import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
  Output,
  generateText,
  type LanguageModel,
} from "ai";
import { aiKeys } from "@/lib/env";

type AiProviderName = "openai" | "google";

type AiProvider = {
  name: AiProviderName;
  modelId: string;
  model: LanguageModel;
};

type GenerateTextOptions = Omit<Parameters<typeof generateText>[0], "model">;
type GenerateObjectOptions = Omit<
  Parameters<typeof generateText>[0],
  "model" | "output"
> & {
  schema: Parameters<typeof Output.object>[0]["schema"];
  name?: string;
  description?: string;
};

const GOOGLE_MODEL_ID = "gemini-3.1-flash-lite-preview";
const GOOGLE_LIMITS = {
  rpm: 15,
  rpd: 500,
};

const googleUsage = {
  minute: [] as number[],
  day: [] as number[],
};

let googleReservationQueue = Promise.resolve();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pruneUsage(now: number) {
  const minuteAgo = now - 60_000;
  const dayAgo = now - 24 * 60 * 60_000;

  googleUsage.minute = googleUsage.minute.filter((timestamp) => timestamp > minuteAgo);
  googleUsage.day = googleUsage.day.filter((timestamp) => timestamp > dayAgo);
}

async function reserveGoogleCapacity() {
  const reservation = googleReservationQueue.then(async () => {
    while (true) {
      const now = Date.now();
      pruneUsage(now);

      if (googleUsage.day.length >= GOOGLE_LIMITS.rpd) {
        throw new Error(
          `Google AI daily limit reached (${GOOGLE_LIMITS.rpd} requests per 24 hours)`,
        );
      }

      if (googleUsage.minute.length < GOOGLE_LIMITS.rpm) {
        googleUsage.minute.push(now);
        googleUsage.day.push(now);
        return;
      }

      const waitMs = googleUsage.minute[0] + 60_000 - now;
      console.warn(
        `[ai] Google RPM limit reached (${GOOGLE_LIMITS.rpm}/minute). Waiting ${waitMs}ms before retrying.`,
      );
      await sleep(waitMs);
    }
  });

  googleReservationQueue = reservation.catch(() => undefined);
  await reservation;
}

function createAiError(scope: string, provider: string, error: unknown) {
  const cause = error instanceof Error ? error : undefined;
  const message =
    cause?.message ?? (typeof error === "string" ? error : "Unknown AI error");

  return new Error(`[ai] ${scope} on ${provider}: ${message}`, {
    cause,
  });
}

function getProviders(): AiProvider[] {
  const providers: AiProvider[] = [];

  if (aiKeys.hasOpenAI) {
    providers.push({
      name: "openai",
      modelId: "gpt-5-mini",
      model: openai("gpt-5-mini"),
    });
  }

  if (aiKeys.hasGoogle) {
    providers.push({
      name: "google",
      modelId: GOOGLE_MODEL_ID,
      model: google(GOOGLE_MODEL_ID),
    });
  }

  return providers;
}

async function withProviderFallback<T>(
  run: (provider: AiProvider) => Promise<T>,
): Promise<T> {
  const providers = getProviders();
  let lastError: unknown;

  for (const [index, provider] of providers.entries()) {
    try {
      if (provider.name === "google") {
        await reserveGoogleCapacity();
      }

      console.info(`[ai] Using ${provider.name} (${provider.modelId})`);
      return await run(provider);
    } catch (error) {
      lastError = error;
      console.error(`[ai] ${provider.name} (${provider.modelId}) failed`, error);

      const nextProvider = providers[index + 1];
      if (nextProvider) {
        console.warn(
          `[ai] Temporarily falling back to ${nextProvider.name} (${nextProvider.modelId})`,
        );
      }
    }
  }

  throw createAiError("all providers failed", "available providers", lastError);
}

export function getAIProviderOrder() {
  return getProviders().map(({ name, modelId }) => ({ name, modelId }));
}

export function aiGenerateText(options: GenerateTextOptions): ReturnType<typeof generateText> {
  return withProviderFallback((provider) =>
    generateText({
      ...options,
      model: provider.model,
      onError(error: unknown) {
        console.error(
          `[ai] generateText error on ${provider.name} (${provider.modelId})`,
          error,
        );
      },
    } as Parameters<typeof generateText>[0]),
  ) as ReturnType<typeof generateText>;
}

export function aiGenerateObject(options: GenerateObjectOptions): ReturnType<typeof generateText> {
  const { schema, name, description, ...rest } = options;

  return withProviderFallback((provider) =>
    generateText({
      ...rest,
      model: provider.model,
      output: Output.object({
        schema,
        name,
        description,
      }),
      onError(error: unknown) {
        console.error(
          `[ai] generateObject error on ${provider.name} (${provider.modelId})`,
          error,
        );
      },
    } as Parameters<typeof generateText>[0]),
  ) as ReturnType<typeof generateText>;
}
