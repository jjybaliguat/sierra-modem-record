import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: {
      /** The user's postal address. */
      id: string,
      name: string,
      email: string,
      photo: string,
      role: UserRole
      company: Company
    } & DefaultSession["user"];
  }

  interface User {
    id: string,
    name: string,
    email: string,
    photo: string,
    role: UserRole
    company: Company
  }

  interface Company {
    name: string,
    address: string,
    contact: string
  }

  export enum UserRole {
    ADMIN = "ADMIN",
    DEVELOPER = "DEVELOPER",
  }
}