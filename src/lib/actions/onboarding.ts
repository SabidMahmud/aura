'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Metric from '@/models/Metric';
import Tag from '@/models/Tag';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

const metricsSchema = z.object({
  metrics: z.array(z.string()).min(1, 'Please add at least one metric.'),
});

export async function saveMetrics(prevState: any, formData: FormData) {
  console.log('[saveMetrics] Function called.');
  const validatedFields = metricsSchema.safeParse({
    metrics: formData.getAll('metrics'),
  });

  if (!validatedFields.success) {
    console.error('[saveMetrics] Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.error('[saveMetrics] No user session found.');
    return { errors: { _form: ['User not authenticated.'] } };
  }

  await dbConnect();
  try {
    // Delete existing metrics for the user to prevent duplicates on re-submission
    await Metric.deleteMany({ userId: session.user.id });

    const newMetrics = validatedFields.data.metrics.map(name => ({
      userId: session.user.id,
      name: name.trim(),
    }));
    await Metric.insertMany(newMetrics);
    console.log('[saveMetrics] Metrics saved successfully for user:', session.user.id);
  } catch (error) {
    console.error('[saveMetrics] Error saving metrics:', error);
    return { errors: { _form: ['Failed to save metrics.'] } };
  }

  return { success: true };
}

const tagsSchema = z.object({
  tags: z.array(z.string()).min(1, 'Please add at least one tag.'),
});

export async function saveTags(prevState: any, formData: FormData) {
  console.log('[saveTags] Function called.');
  const validatedFields = tagsSchema.safeParse({
    tags: formData.getAll('tags'),
  });

  if (!validatedFields.success) {
    console.error('[saveTags] Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.error('[saveTags] No user session found.');
    return { errors: { _form: ['User not authenticated.'] } };
  }

  await dbConnect();
  try {
    // Delete existing tags for the user to prevent duplicates on re-submission
    await Tag.deleteMany({ userId: session.user.id });

    const newTags = validatedFields.data.tags.map(name => ({
      userId: session.user.id,
      name: name.trim(),
    }));
    await Tag.insertMany(newTags);
    console.log('[saveTags] Tags saved successfully for user:', session.user.id);

    // Update onboarding.json to mark onboarding as complete for this user
    const onboardingFilePath = process.cwd() + '/src/onboarding.json';
    let onboardingData: { [key: string]: { onboardingComplete: boolean } } = {};
    try {
      const fileContent = await fs.readFile(onboardingFilePath, 'utf-8');
      onboardingData = JSON.parse(fileContent);
    } catch (readError) {
      console.warn('[saveTags] onboarding.json not found or empty, creating new one.', readError);
    }

    onboardingData[session.user.id] = { onboardingComplete: true };
    await fs.writeFile(onboardingFilePath, JSON.stringify(onboardingData, null, 2));
    console.log('[saveTags] onboarding.json updated for user:', session.user.id);

  } catch (error) {
    console.error('[saveTags] Error saving tags or updating onboarding.json:', error);
    return { errors: { _form: ['Failed to save tags or complete onboarding.'] } };
  }

  console.log('[saveTags] Redirecting to /profile.');
  redirect('/profile');
}
