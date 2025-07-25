'use server';

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDB from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable in your .env file');
}

export async function signupUser(formData: FormData) {
  await connectToDB();

  try {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    if (!username || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (password.length < 8) {
      return { success: false, message: 'Password must be at least 8 characters long' };
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return { success: false, message: 'User with that email or username already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true, message: 'User created successfully' };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal Server Error' };
  }
}

export async function loginUser(formData: FormData) {
  await connectToDB();

  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

    // In a real application, you would set the cookie here using `cookies().set()`
    // For now, we'll just return the token (though this is not secure for client-side handling)
    return { success: true, message: 'Login successful', token };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'Internal Server Error' };
  }
}
