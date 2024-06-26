"use server";

import { db } from "@/drizzle/db";
import { workoutSessions } from "@/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { addWorkoutSessionSchema, finishWorkoutSessionSchema } from "@/lib/zod";
import { eq } from "drizzle-orm";

export const createSafeWorkoutSession = actionClient(
  addWorkoutSessionSchema,
  async ({ userId }) => {
    const workoutSession = await db
      .insert(workoutSessions)
      .values({ userId })
      .returning();

    return workoutSession[0];
  },
);

export const finishSafeWorkoutSession = actionClient(
  finishWorkoutSessionSchema,
  async ({ sessionId }) => {
    const updatedId = await db
      .update(workoutSessions)
      .set({
        sessionEnd: new Date(),
      })
      .where(eq(workoutSessions.id, sessionId))
      .returning({ id: workoutSessions.id });
    return updatedId[0];
  },
);
