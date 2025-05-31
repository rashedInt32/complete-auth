"use server";

import bcrypt from "bcryptjs";
import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken,
} from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schema";
import { z } from "zod";
import { db } from "@/lib/db";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) return { error: "No token found  " };

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Missing token" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "email does not exist" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await deletePasswordResetToken(existingToken.id);

  return { success: "password updated!" };
};
