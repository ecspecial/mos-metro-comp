import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import prisma from "./prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextApiRequest } from "next";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
console.log('NEXTAUTH_SECRET', NEXTAUTH_SECRET)

type CombineRequest = Request & NextApiRequest;

export const authOptions = (req: CombineRequest): NextAuthOptions => ({
    adapter: PrismaAdapter(prisma as any),
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.login || !credentials.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        login: credentials.login,
                    },
                });

                if (!user) {
                    throw new Error("This login is not registered");
                }

                const passwordMatch = await compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error("Incorrect password");
                }

                console.log('LOG IN SUCCESS')
                return {
                    id: user.id.toString(), // Convert id to string
                    login: user.login,
                    role: user.role,
                };
            }
        }),
    ],
    callbacks: {
      async jwt({ token, user, session, trigger }) {
        if (user) {
          // console.log('jwt',token, user)
          token.id = user.id;
          token.login = user.login;
          token.role = user.role;
        }
      
        if (trigger === "update" && session?.user) {
          // If anywhere in the code await update({ user: { ...session?.user, role: role } }); add params below
          console.log('token.login', token.login);
          console.log('session.login', session.user.login);
          token.role = session.user.role;
        }
      
        return token;
      },
      async session({ session, token }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            login: token.login,
            role: token.role,
          }
        };
      },
    },
    // secret: NEXTAUTH_SECRET,
});