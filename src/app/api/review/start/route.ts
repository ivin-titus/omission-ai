import { aiGenerateObject } from "@/lib/ai";
import { db } from "@/lib/db";
import { z } from "zod";

const requestSchema = z.object({
  decision: z.string().trim().min(10, "Describe the decision in a little more detail.").max(4000),
});

const analysisSchema = z.object({
  understanding: z.string().min(1),
  assumptions: z.array(z.string()),
  missing_information: z.array(z.string()),
  clarification_questions: z.array(z.string()).min(1).max(3),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please describe the decision you want to review." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Please describe a decision to review." },
      { status: 400 },
    );
  }

  const decision = parsed.data.decision;

  try {
    const result = await aiGenerateObject({
      system: `You are Omission AI, a calm and intellectually honest decision reviewer.
Do not recommend a decision yet. Understand the user's situation, expose assumptions,
identify missing information, and ask only the 1 to 3 questions that most reduce uncertainty.
Be specific to the user's decision, concise, respectful, and never motivational.
Return only the requested structured object. Never invent facts or confidence scores.`,
      prompt: `Review this decision before any recommendation exists:\n\n<decision>\n${decision}\n</decision>`,
      schema: analysisSchema,
      name: "initial_decision_analysis",
      description: "Initial understanding, assumptions, missing information, and targeted questions.",
    });

    let decisionId: number | null = null;
    let persistence: "saved" | "unavailable" = "unavailable";

    try {
      const rows = await db<{ id: number }>`
        INSERT INTO decisions (user_id, original_decision, status)
        VALUES (${null}, ${decision}, ${"clarifying"})
        RETURNING id
      `;
      decisionId = rows[0]?.id ?? null;
      persistence = decisionId === null ? "unavailable" : "saved";
    } catch (error) {
      console.error("[review/start] persistence unavailable", error);
    }

    return Response.json({ decisionId, analysis: result.output, persistence });
  } catch (error) {
    console.error("[review/start] analysis failed", error);
    return Response.json(
      { error: "The review could not be started. Please retry; no data has been lost." },
      { status: 503 },
    );
  }
}
