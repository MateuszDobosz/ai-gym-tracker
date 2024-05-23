import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { saltAndHashPassword } from "@/utils/password";
import { Provider } from "next-auth/providers";
import { getUserByEmailAndPassword } from "./server/actions/users.action";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        let user = null;

        const { email, password } = await signInSchema.parseAsync(credentials);
        // const hashPassword = await saltAndHashPassword(password);
        user = await getUserByEmailAndPassword(email, password);

        if (!user) {
          throw new Error("User not found.");
        }

        return user;
      } catch (error) {
        if (error instanceof ZodError) {
          // Return `null` to indicate that the credentials are invalid
          return null;
        }
      }
    },
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: { ...session.user, id: token.sub },
      };
    },
  },
  providers,
  secret: process.env.AUTH_SECRET,
});
