import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeSleepScore } from "@/lib/sleep-score";

const PostSchema = z.object({
  age: z.enum(["10-13", "14-17", "18-25", "26+"]),
  sleepHours: z.number().min(0).max(24),
  bedtime: z.string().min(1),
  wakeup: z.string().min(1),
  wakeups: z.boolean(),
  mood: z.enum(["awful", "bad", "okay", "good", "perfect"]),
  stressLevel: z.number().min(0).max(10),
  consistency: z.enum(["very", "mostly", "sometimes", "rarely"]),
  caffeineLate: z.boolean(),
  screensLate: z.boolean(),
  exerciseRegular: z.boolean(),
});

// Read schema is lenient with defaults so legacy rows (without age/wakeups) still parse.
const ReadSchema = z.object({
  age: z.enum(["10-13", "14-17", "18-25", "26+"]).default("18-25"),
  sleepHours: z.number().min(0).max(24),
  bedtime: z.string().min(1),
  wakeup: z.string().min(1),
  wakeups: z.boolean().default(false),
  mood: z.enum(["awful", "bad", "okay", "good", "perfect"]),
  stressLevel: z.number().min(0).max(10),
  consistency: z.enum(["very", "mostly", "sometimes", "rarely"]),
  caffeineLate: z.boolean(),
  screensLate: z.boolean(),
  exerciseRegular: z.boolean(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ results: [] });
  }
  const rows = await prisma.sleepResult.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    results: rows.map((r) => {
      const answers = ReadSchema.parse(JSON.parse(r.answersJson));
      return {
        id: r.id,
        createdAt: r.createdAt.toISOString(),
        answers,
        score: computeSleepScore(answers),
      };
    }),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = z.object({ answers: PostSchema }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const answers = parsed.data.answers;
  const score = computeSleepScore(answers);

  const created = await prisma.sleepResult.create({
    data: {
      userId: session.user.id,
      score: score.score,
      focus: score.focus,
      fatigue: score.fatigue,
      consistency: score.consistency,
      sleepHours: answers.sleepHours,
      bedtime: answers.bedtime,
      wakeup: answers.wakeup,
      mood: answers.mood,
      caffeineLate: answers.caffeineLate,
      screensLate: answers.screensLate,
      exerciseRegular: answers.exerciseRegular,
      stressLevel: answers.stressLevel,
      answersJson: JSON.stringify(answers),
    },
  });
  return NextResponse.json({ id: created.id });
}
