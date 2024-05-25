"use server";

import { db } from "@/drizzle/db";
import { exercises } from "@/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { addExerciseSchema } from "@/lib/zod";
import { ilike } from "drizzle-orm";

export const findOrCreateSafeExercise = actionClient(
  addExerciseSchema,
  async ({ name }) => {
    const exerciseFound = await findExercise(name);
    if (exerciseFound) return exerciseFound;

    const exercise = await db.insert(exercises).values({ name }).returning();

    return exercise[0];
  },
);

const findExercise = async (name: string) => {
  const exercise = await db
    .select()
    .from(exercises)
    .where(ilike(exercises.name, name));

  return exercise[0];
};
