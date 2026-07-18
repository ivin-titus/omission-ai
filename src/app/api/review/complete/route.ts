import { aiGenerateObject } from "@/lib/ai";
import { db } from "@/lib/db";
import { z } from "zod";

const requestSchema = z.object({
  decision: z.string().trim().min(10).max(4000),
  answers: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(1000),
        answer: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(3),
  decisionId: z.number().int().positive().nullable().optional(),
});

const reviewSchema = z.object({
  situation: z.string().min(1),
  evidence: z.array(z.string()),
  assumptions: z.array(z.string()),
  blind_spots: z.array(z.string()),
  unknowns: z.array(z.string()),
  recommended_validation: z.array(z.string()),
  next_step: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Please answer the review questions before continuing." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Please answer every review question." },
      { status: 400 },
    );
  }

  const { decision, answers, decisionId } = parsed.data;

  try {
    const result = await aiGenerateObject({
      system: `You are Omission AI completing a structured decision review.
Use only the decision and the user's answers. Be calm, precise, and intellectually honest.
Separate known evidence from assumptions, surface non-obvious blind spots and unknowns,
then give concrete validation steps and one immediate next step. Do not decide for the user,
do not invent facts, do not use confidence scores, and do not write generic motivational advice.
Return only the requested structured object.`,
      prompt: `Original decision:\n<decision>\n${decision}\n</decision>\n\nClarification answers:\n${answers
        .map(({ question, answer }, index) => `${index + 1}. Question: ${question}\nAnswer: ${answer}`)
        .join("\n\n")}`,
      schema: reviewSchema,
      name: "final_decision_review",
      description: "A concise structured review that exposes omissions before commitment.",
    });

    let persistence: "saved" | "unavailable" = "unavailable";

    if (decisionId) {
      try {
        await db`
          INSERT INTO reviews (decision_id, review_data)
          VALUES (${decisionId}, ${JSON.stringify({ decision, answers, review: result.output })}::jsonb)
        `;
        await db`
          UPDATE decisions
          SET status = ${"complete"}
          WHERE id = ${decisionId}
        `;
        persistence = "saved";
      } catch (error) {
        console.error("[review/complete] persistence unavailable", error);
      }
    }

    return Response.json({ review: result.output, persistence });
  } catch (error) {
    console.error("[review/complete] review failed", error);
    return Response.json(
      { error: "The review could not be completed. Please retry; no data has been lost." },
      { status: 503 },
    );
  }
}
