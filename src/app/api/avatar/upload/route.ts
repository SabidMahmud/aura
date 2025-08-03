
// src/app/api/avatar/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return new NextResponse('Missing filename or request body', { status: 400 });
  }

  // Construct a unique path for the blob
  const blobPath = `avatars/${session.user.id}-${filename}`;

  try {
    const blob = await put(blobPath, request.body, {
      access: 'public',
    });

    // Connect to DB to update user's avatar URL
    await dbConnect();
    await User.findByIdAndUpdate(session.user.id, { avatar: blob.url });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
