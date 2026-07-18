import { neon } from "@neondatabase/serverless";
import { env } from "@/lib/env";

const rawSql = neon(env.DATABASE_URL);

let connectionCheck: Promise<void> | undefined;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
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
  if (!connectionCheck) {
    const check = checkDatabaseConnection();
    connectionCheck = check;
    void check.catch(() => {
      // A transient outage must not poison every later request handled by this warm instance.
      if (connectionCheck === check) connectionCheck = undefined;
    });
  }
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
