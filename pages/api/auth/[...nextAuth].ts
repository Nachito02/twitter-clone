import  NextAuth  from "next-auth/next";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/libs/prismadb";
import bcrypt from 'bcrypt'


export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      async authorize(crendentials) {
        if(!crendentials?.email || !crendentials?.password) {
            throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
            where: {
                email:crendentials.email
            }
        });

        if(!user || !user?.hashedPassword){
            throw new Error('Invalid credentials')
        }

        const isCorrectPassowrd = await bcrypt.compare(
            crendentials.password, user.hashedPassword
        )

        if(!isCorrectPassowrd) {
            throw new Error('Invalid Credentials')
        }

        return user
      }
    }),
  ],

  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt'
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET
});
