import { prisma } from "@/lib/dbConfig";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";


const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) {
                return false;
            }

            const now = new Date();

            let existingUser = await prisma.user.findUnique({
                where: {
                    email: user.email,
                },
            });

            if (!existingUser) {
                existingUser = await prisma.user.create({
                    data: {
                        userName: user.name,
                        email: user.email,
                        plan: "FREE",
                        totalLinks: 100,
                        linksUsed: 0,
                        totalLinksCreated: 0,
                        totalQr: 30,
                        qrUsed: 0,
                        totalQrCreated: 0,
                        provider: "GOOGLE",
                        cycleStart: now,
                        cycleEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                    }
                });
            }

            return true;
        },

        async jwt({ token, user }) {

            if (user?.email) {

                const dbUser = await prisma.user.findUnique({
                    where: {
                        email: user.email,
                    },
                });

                token.customToken = jwt.sign(
                    {
                        userId: dbUser?.id,
                        email: dbUser?.email,
                    },
                    process.env.NEXTAUTH_SECRET!,
                    {
                        expiresIn: "7d",
                    }
                );
            }

            return token;
        },

        async session({ session, token }) {

            session.customToken = token.customToken as string;

            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };