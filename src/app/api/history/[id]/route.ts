import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  let userId: string | null = null;

  try {
    userId = (await auth()).userId;
  } catch (error) {
    console.error("[history/:id] auth unavailable", error);
    return Response.json({ error: "History is temporarily unavailable." }, { status: 503 });
  }

  if (!userId) return Response.json({ error: "This review is not available." }, { status: 404 });

  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "This review is not available." }, { status: 404 });
  }

  try {
    const rows = await db<{
      id: number;
      original_decision: string;
      status: string;
      created_at: string;
      review_data: { review?: unknown } | null;
    }>`
      SELECT d.id, d.original_decision, d.status, d.created_at, r.review_data
      FROM decisions d
      LEFT JOIN LATERAL (
        SELECT review_data
        FROM reviews
        WHERE decision_id = d.id
        ORDER BY created_at DESC
        LIMIT 1
      ) r ON true
      WHERE d.id = ${id} AND d.user_id = ${userId}
      LIMIT 1
    `;

    const record = rows[0];
    if (!record || !record.review_data?.review) {
      return Response.json({ error: "This review is not available." }, { status: 404 });
    }

    return Response.json({
      id: record.id,
      decision: record.original_decision,
      status: record.status,
      created_at: record.created_at,
      review: record.review_data.review,
    });
  } catch (error) {
    console.error("[history/:id] unavailable", error);
    return Response.json({ error: "This review could not be loaded." }, { status: 503 });
  }
}
