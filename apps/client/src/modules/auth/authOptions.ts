import prisma from "@/db";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Your email address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Invalid credentials");
        }

        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
        } catch (e) {
          console.error(e);
          throw Error("Internal server error. Please try again later");
        }
        if (!user) {
          throw new Error("Invalid credentials");
        }
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
};
