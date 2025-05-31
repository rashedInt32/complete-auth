import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { db } from "./lib/db";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationbyUserId,
} from "./data/two-facgtor-confirmation";
import { deleteTwoFactorToken } from "./data/two-factor-token";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      // TODO: Adde 2FA auth
      if (existingUser.isTwoFactorEnable) {
        console.log({ existingUer: existingUser });
        const twoFactorConfirmation = await getTwoFactorConfirmationbyUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }
      return true;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
    async session({ token, session }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
