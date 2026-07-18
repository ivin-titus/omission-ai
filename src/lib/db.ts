import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";

const rawSql = neon(env.DATABASE_URL);

let connectionCheck: Promise<void> | undefined;

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}

export async function checkDatabaseConnection(timeoutMs = 10_000) {
  try {
    await withTimeout(rawSql`select 1 as ok`, timeoutMs, "[db] DATABASE_URL connection check");
    console.info("[db] DATABASE_URL connection check passed");
  } catch (error) {
    console.error("[db] DATABASE_URL connection check failed", error);
    throw error;
  }
}

async function ensureDatabaseConnection() {
  connectionCheck ??= checkDatabaseConnection();
  await connectionCheck;
}

export async function db<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) {
  await ensureDatabaseConnection();
  return rawSql(strings, ...values) as Promise<T[]>;
}

export { rawSql };
