"use server";

import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema } from "@/lib/zod";
// import { saltAndHashPassword } from "@/utils/password";
import { and, eq } from "drizzle-orm";

export const getUserByEmailAndPassword = async (
  email: string,
  password: string,
) => {
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)));
  return user[0];
};

export const findUserByEmail = async (email: string) => {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));
  return user[0];
};

export const createSafeUser = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const userFound = await findUserByEmail(email);
    if (userFound) return null;
    // const hashPassword = await saltAndHashPassword(password);
    const user = await db
      .insert(users)
      .values({ email, password })
      .returning({ insertedId: users.id });
    return user[0];
  });
