// lib/auth.ts (or src/auth.ts)
import { NextAuthOptions } from 'next-auth';
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
      ispasswordexist?: boolean; //field to check if password exists
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
              username: user.email?.split('@')[0].replace(/[^a-zA-Z0-9_]/g, ''),
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

    // Replace your jwt callback with this EXACT version:

    async jwt({ token, user, trigger }) {
      console.log('🔥 JWT CALLBACK TRIGGERED');
      console.log('Trigger:', trigger);
      console.log('Has user object:', !!user);
      console.log('Token ID:', token.id);
      console.log('Current token onboarding status:', token.isOnboardingComplete);

      // Initial sign-in: user object is available
      if (user) {
        console.log('🔥 Initial login - setting token from user object');
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? null;
        token.image = user.image ?? null;
        token.username = user.username ?? undefined;
        token.isOnboardingComplete = user.isOnboardingComplete ?? false;
        token.timezone = user.timezone ?? undefined;

        console.log('✅ Initial token set - isOnboardingComplete:', token.isOnboardingComplete);
      }

      // 🚨 CRITICAL FIX: Only fetch fresh data when explicitly triggered by update()
      if (trigger === 'update') {
        console.log('🔄 UPDATE TRIGGER DETECTED - Fetching fresh user data from database');

        try {
          await dbConnect();
          const dbUser = await User.findById(token.id);

          if (dbUser) {
            console.log('📊 Fresh user data from DB:', {
              id: dbUser._id.toString(),
              isOnboardingComplete: dbUser.isOnboardingComplete
            });

            // Update ALL token fields with fresh database data
            token.name = dbUser.name ?? null;
            token.username = dbUser.username ?? null;
            token.isOnboardingComplete = dbUser.isOnboardingComplete ?? false;
            token.timezone = dbUser.timezone ?? null;
            token.image = dbUser.avatar ?? null;
            token.email = dbUser.email;

            console.log('✅ Token updated with fresh data - isOnboardingComplete:', token.isOnboardingComplete);
          } else {
            console.error('❌ User not found in database during update trigger');
          }
        } catch (error) {
          console.error('❌ Error fetching fresh user data during update:', error);
        }
      }

      console.log('🔥 Final token onboarding status:', token.isOnboardingComplete);
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
        session.user.ispasswordexist = !!token.password; // Check if password exists
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