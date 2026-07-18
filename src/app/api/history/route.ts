import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  let userId: string | null = null;

  try {
    userId = (await auth()).userId;
  } catch (error) {
    console.error("[history] auth unavailable", error);
    return Response.json({ history: [], available: false });
  }

  if (!userId) {
    return Response.json({ history: [], available: false });
  }

  try {
    const history = await db<{
      id: number;
      original_decision: string;
      status: string;
      created_at: string;
    }>`
      SELECT id, original_decision, status, created_at
      FROM decisions
      WHERE user_id = ${userId}
        AND EXISTS (
          SELECT 1 FROM reviews
          WHERE reviews.decision_id = decisions.id
        )
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return Response.json({ history, available: true });
  } catch (error) {
    console.error("[history] unavailable", error);
    return Response.json({ history: [], available: false });
  }
}
