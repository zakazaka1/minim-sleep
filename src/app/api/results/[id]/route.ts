import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeSleepScore } from "@/lib/sleep-score";

const AnswersSchema = z.object({
  sleepHours: z.number().min(0).max(24),
  bedtime: z.string().min(1),
  wakeup: z.string().min(1),
  mood: z.enum(["awful", "bad", "okay", "good", "perfect"]),
  stressLevel: z.number().min(0).max(10),
  consistency: z.enum(["very", "mostly", "sometimes", "rarely"]),
  caffeineLate: z.boolean(),
  screensLate: z.boolean(),
  exerciseRegular: z.boolean(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const row = await prisma.sleepResult.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const answers = AnswersSchema.parse(JSON.parse(row.answersJson));
  return NextResponse.json({
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    answers,
    score: computeSleepScore(answers),
  });
}
