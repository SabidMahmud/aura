// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      isOnboardingComplete: boolean
      username?: string
      timezone?: string
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    isOnboardingComplete?: boolean
    username?: string
    timezone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isOnboardingComplete: boolean
    username?: string
    timezone?: string
  }
}