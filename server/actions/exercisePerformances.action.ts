"use server";

import { db } from "@/drizzle/db";
import {
  exercisePerformances,
  exercises,
  workoutSessions,
} from "@/drizzle/schema";
import anthropic from "@/lib/anthropic";
import { actionClient } from "@/lib/safe-action";
import {
  addExercisePerformanceSchema,
  workoutSessionIdSchema,
} from "@/lib/zod";
import { WorkoutResult } from "@/types/workout-result";
import { eq } from "drizzle-orm";

export const createSafeExercisePerformance = actionClient(
  addExercisePerformanceSchema,
  async ({ exerciseId, sessionId, weight, reps }) => {
    const exercisePerformance = await db
      .insert(exercisePerformances)
      .values({ exerciseId, sessionId, weight, reps })
      .returning();

    return exercisePerformance[0];
  },
);

export const getExercisePerformance = async (id: string) => {
  const exs = await db
    .select()
    .from(exercisePerformances)
    .leftJoin(
      workoutSessions,
      eq(exercisePerformances.sessionId, workoutSessions.id),
    )
    .leftJoin(exercises, eq(exercisePerformances.exerciseId, exercises.id))
    // .leftJoin(user,eq(workoutSession.userId,user.id))
    .where(eq(exercisePerformances.sessionId, id));
  const normalizedExs = exs.map((exs) => {
    return {
      exercise: exs.exercises?.name,
      reps: exs.exercisePerformances.reps,
      weight: exs.exercisePerformances.weight,
    };
  });
  const exsString = normalizedExs
    .map((ex) => {
      let parts = [];
      if (ex.exercise !== undefined) parts.push(`cwiczenie: ${ex.exercise}`);
      if (ex.reps !== null) parts.push(`powtorzenia: ${ex.reps}`);
      if (ex.weight !== null) parts.push(`waga: ${ex.weight}`);
      return parts.join(", ");
    })
    .join(" ... ");

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a gym training expert tasked to evaluate training, you must give a score of this training in 0-100 points, how many hours are needed to rest  and give an assessment of the training. here is training: ${exsString}.
        Use JSON format with the keys “points”, “hoursToRest”, and “assessment”.
        `,
      },
    ],
  });
  const parsedMessage = JSON.parse(msg.content[0].text) as WorkoutResult;

  return parsedMessage;
};
