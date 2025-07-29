// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

// Correct type declarations to allow `null` for all optional fields
declare module 'next-auth' {
  interface Profile {
    picture?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    isOnboardingComplete?: boolean;
    timezone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      username?: string | null;
      isOnboardingComplete?: boolean;
      timezone?: string | null;
    };
  }

  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    username?: string | null;
    isOnboardingComplete?: boolean;
    timezone?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          await dbConnect();
          const user = await User.findOne({ email: credentials.email });
          if (!user || !user.password) { // Also check if user.password exists
            return null;
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          user.lastLoginAt = new Date();
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name ?? null,
            image: user.avatar ?? null,
            username: user.username ?? null,
            isOnboardingComplete: user.isOnboardingComplete ?? false,
            timezone: user.timezone ?? null,
          };

        } catch (error) {
          // Log the error for debugging purposes
          console.error("Authorize Error:", error);
          // Return null to indicate failure
          return null;
        }
      }
    })
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await dbConnect();

        try {
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            if (!existingUser.googleId) {
              existingUser.googleId = user.id;
            }
            existingUser.lastLoginAt = new Date();
            await existingUser.save();

            user.id = existingUser._id.toString();
            user.isOnboardingComplete = existingUser.isOnboardingComplete;
            user.timezone = existingUser.timezone;
            user.username = existingUser.username;
            user.image = existingUser.avatar ?? user.image;
          } else {
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              googleId: user.id,
              avatar: profile?.picture ?? user.image,
              lastLoginAt: new Date(),
              timezone: 'UTC',
              isOnboardingComplete: false
            });

            user.id = newUser._id.toString();
            user.isOnboardingComplete = false;
            user.timezone = 'UTC';
            user.image = newUser.avatar ?? null;
          }

          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }

      return true;
    },

    // jwt callback
    async jwt({ token, user, trigger, session }) {
      // If it's the initial sign-in, the 'user' object is available.
      // We use its ID to fetch the definitive user data from the DB.
      if (user) {
        await dbConnect();
        const dbUser = await User.findById(user.id);

        if (dbUser) {
          // console.log('Fresh DB user status in JWT:', dbUser.isOnboardingComplete);
          token.isOnboardingComplete = dbUser.isOnboardingComplete; // This is the crucial line
          // console.log('Token onboarding status AFTER assignment:', token.isOnboardingComplete); 
    
        }

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name ?? null;
          token.image = dbUser.avatar ?? null;
          token.username = dbUser.username ?? null;
          // ✅ This is the crucial change: Use the fresh data from the database
          token.isOnboardingComplete = dbUser.isOnboardingComplete;
          token.timezone = dbUser.timezone ?? null;
        }
      }

      // This part for updating the session 
      if (trigger === 'update' && session) {
        await dbConnect();
        const dbUser = await User.findById(token.id);
        if (dbUser) {
          token.name = dbUser.name ?? null;
          token.username = dbUser.username ?? null;
          token.isOnboardingComplete = dbUser.isOnboardingComplete ?? false;
          token.timezone = dbUser.timezone ?? null;
          token.image = dbUser.avatar ?? null;
        }
      }

      // console.log('Final token object being returned:', token); 

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email ?? ''; // Fallback to empty string
        session.user.name = token.name ?? null; // Fallback to null
        session.user.image = typeof token.image === 'string' ? token.image : null;
        session.user.username = token.username ?? null; // Fallback to null
        session.user.isOnboardingComplete = token.isOnboardingComplete ?? false; // Fallback to false
        session.user.timezone = token.timezone ?? null; // Fallback to null
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    newUser: '/register',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };