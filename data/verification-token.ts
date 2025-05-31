import to from "await-to-js";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const getVerificationTokenByEmail = async (email: string) => {
  const [_, verificationToken] = await to(
    db.verificationToken.findFirst({
      where: { email },
    }),
  );
  return verificationToken;
};

export const getVerificationTokenByToken = async (token: string) => {
  const [_, verificationToken] = await to(
    db.verificationToken.findUnique({
      where: { token },
    }),
  );

  return verificationToken;
};

export const deleteVerificationToken = async (id: string) => {
  await db.verificationToken.delete({
    where: { id },
  });
};

export const createVerificationToken = async (email: string) => {
  return await db.verificationToken.create({
    data: {
      email,
      token: uuidv4(),
      expires: new Date(new Date().getTime() + 3600 * 1000),
    },
  });
};
