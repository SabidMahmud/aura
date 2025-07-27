// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, confirmPassword, name } = await request.json();

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, username, and password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Username validation
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username can only contain letters, numbers, and underscores' 
        },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, message: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: 'This username is already taken' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
      name: name || username,
      isOnboardingComplete: false,
      timezone: 'UTC',
      isActive: true,
    });

    // Return user data (excluding password)
    const userData = {
      id: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
      name: newUser.name,
      isOnboardingComplete: newUser.isOnboardingComplete,
      timezone: newUser.timezone
    };

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userData
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, message: `This ${field} is already taken` },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}