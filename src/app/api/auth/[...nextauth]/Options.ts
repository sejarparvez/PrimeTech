import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

const prisma = new PrismaClient();

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

console.log(githubClientId);

if (!githubClientId || !githubClientSecret) {
  throw new Error("GitHub credentials are missing.");
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        email: { label: "email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log(credentials.email);
        if (!user) {
          return null;
        }
        if (user.password) {
          const passwordMatch = await bcrypt.compareSync(
            credentials.password,
            user.password
          );
          if (!passwordMatch) {
            return null;
          }
        }

        return user;
      },
    }),
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],

  session: {
    strategy: "jwt" as "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
