// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();
          
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          }).select('+password');
          
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await User.findByIdAndUpdate(user._id, {
            lastLoginAt: new Date()
          });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.username,
            image: user.avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          // Check if user exists
          const existingUser = await User.findOne({ 
            $or: [
              { email: user.email },
              { googleId: account.providerAccountId }
            ]
          });

          if (existingUser) {
            // Update existing user with Google info if not already set
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              existingUser.avatar = user.image;
              existingUser.name = user.name;
              existingUser.lastLoginAt = new Date();
              await existingUser.save();
            } else {
              // Just update last login
              await User.findByIdAndUpdate(existingUser._id, {
                lastLoginAt: new Date()
              });
            }
          } else {
            // Create new user
            await User.create({
              email: user.email,
              googleId: account.providerAccountId,
              name: user.name,
              avatar: user.image,
              isOnboardingComplete: false,
              lastLoginAt: new Date(),
            });
          }
        } catch (error) {
          console.error('Google sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      // Fetch fresh user data on each token refresh
      if (token.email) {
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.isOnboardingComplete = dbUser.isOnboardingComplete;
            token.username = dbUser.username;
            token.timezone = dbUser.timezone;
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.isOnboardingComplete = token.isOnboardingComplete as boolean;
        session.user.username = token.username as string;
        session.user.timezone = token.timezone as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to profile after successful login
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/profile`;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
    },
    async signOut({  }) {
      console.log(`User signed out`);
    }
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };