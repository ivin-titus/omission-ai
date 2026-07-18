import { z } from "zod";

const optionalSecret = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().min(1).optional(),
);

const requiredSecret = z
  .string({ error: "is required" })
  .trim()
  .min(1, "cannot be empty");

const envSchema = z
  .object({
    DATABASE_URL: requiredSecret,
    OPENAI_API_KEY: optionalSecret,
    GOOGLE_GENERATIVE_AI_API_KEY: optionalSecret,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalSecret,
    CLERK_SECRET_KEY: optionalSecret,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: optionalSecret.default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: optionalSecret.default("/sign-up"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: optionalSecret.default("/"),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: optionalSecret.default("/"),
  })
  .superRefine((env, ctx) => {
    if (!env.OPENAI_API_KEY && !env.GOOGLE_GENERATIVE_AI_API_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["OPENAI_API_KEY"],
        message: "OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is required",
      });
    }

    if (!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"],
        message: "is required with CLERK_SECRET_KEY",
      });
    }

    if (!env.CLERK_SECRET_KEY) {
      ctx.addIssue({
        code: "custom",
        path: ["CLERK_SECRET_KEY"],
        message: "is required with NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
      });
    }
  });

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(`[env] Invalid server configuration:\n${details}`);
    throw new Error("Invalid server configuration. Check the logs above.");
  }

  return parsed.data;
}

export const env = loadEnv();

export const aiKeys = {
  hasOpenAI: Boolean(env.OPENAI_API_KEY),
  hasGoogle: Boolean(env.GOOGLE_GENERATIVE_AI_API_KEY),
};
