// src/components/profile/EditProfielForm.tsx

'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Clock, Save, AlertCircle, Loader2, Camera } from 'lucide-react';
import TimezoneSelector from '@/components/ui/TimezoneSelector';

// Define the type for the user's profile data that can be edited
interface EditableProfile {
  name: string;
  username: string;
  timezone: string;
  email: string;
  avatar?: string;
}

interface EditProfileFormProps {
  profile: EditableProfile;
  onProfileUpdate: (updatedProfile: EditableProfile) => void;
}

const EditProfileForm = ({ profile, onProfileUpdate }: EditProfileFormProps) => {
  const [formData, setFormData] = useState<EditableProfile>(profile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      let avatarUrl = formData.avatar;

      if (avatarFile) {
        const response = await fetch(`/api/avatar/upload?filename=${avatarFile.name}`, {
          method: 'POST',
          body: avatarFile,
        });

        if (!response.ok) {
          throw new Error('Failed to upload avatar');
        }

        const newBlob = await response.json();
        avatarUrl = newBlob.url;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          timezone: formData.timezone,
          avatar: avatarUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      if (result.success) {
        setSuccess('Profile updated successfully!');
        const updatedProfile = { ...formData, avatar: avatarUrl };
        onProfileUpdate(updatedProfile);
        setTimeout(() => {
          router.push('/profile');
          router.refresh();
        }, 1500);
      } else {
        throw new Error(result.message || 'An unknown error occurred');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Field */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image
            src={avatarPreview || '/default-avatar.svg'}
            alt="Avatar Preview"
            width={96}
            height={96}
            className="rounded-full object-cover w-24 h-24 bg-gray-200"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{formData.name}</h2>
          <p className="text-gray-500">@{formData.username || 'username'}</p>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
          />
        </div>
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 sm:text-sm">@</span>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 pl-7 pr-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
          />
        </div>
      </div>

      {/* Email Field (Read-only) */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            readOnly
            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-100 pl-10 pr-3 py-2 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
          />
        </div>
      </div>

      {/* Timezone Field */}
      <div className="space-y-2">
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
          Timezone
        </label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <TimezoneSelector
            id="timezone"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="block w-full appearance-none rounded-md border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
          />
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-emerald-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;