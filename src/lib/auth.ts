// @ts-nocheck
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export const authOptions : any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
        name: "credentials",
        credentials: {
            branchName: { label: "branch name", type: "text", placeholder: ""},
            password: { label: "Password", type: "password", }
        },
        async authorize(credentials) {

          // console.log(credentials)
          if(!credentials?.branchName || !credentials.password){
            return null
          }
          // console.log(JSON.stringify(credentials))
          const user = await prisma.user.findUnique({
            where: {
              branchName: credentials.branchName
            }
          })

          console.log(user)

          if(!user){
            throw new Error("Invalid Credentials")
          }
          // const hashedPass = hashPassword(credentials.password)
          const passwordMatched = await bcrypt.compare(credentials.password, user.password)
          if(!passwordMatched){
            throw new Error("Invalid Credentials")
          }
          // console.log(user)
          return user
          },
    })
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user id and role to the token object
      if (user) {
        token.id = user.id;
        token.branchName = user.branchName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add id and role to the session object
      if (token) {
        session.user.id = token.id;
        session.user.branchName = token.branchName;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
}