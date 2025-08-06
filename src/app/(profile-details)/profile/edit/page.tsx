"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/ui/NavBar";
import EditProfileForm from "@/components/profile/EditProfielForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

// Define the type for the user's profile data that can be edited
interface EditableProfile {
  name: string;
  username: string;
  timezone: string;
  email: string;
  avatar?: string;
}

// Define the type for the full user data from API
interface UserData extends EditableProfile {
  googleId?: string;
  _id: string;
  goals?: string[];
  metrics?: string[];
  activities?: string[];
  isOnboardingComplete?: boolean;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  isPasswordExist?: boolean; // field to check if password exists
}

const EditProfilePage = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<EditableProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch current profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/user/profile");
        const result = await response.json();

        console.log("=== FULL API RESPONSE ===");
        console.log("Response status:", response.status);
        console.log("Full result object:", JSON.stringify(result, null, 2));
        console.log(
          "result.data keys:",
          result.data ? Object.keys(result.data) : "no data"
        );
        console.log("=== END API RESPONSE ===");

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch profile data");
        }

        if (result.success) {
          const userData: UserData = result.data;
          console.log("Raw API Response:", result);
          console.log("User Data:", userData);
          console.log("Has googleId?", userData.googleId);
          console.log("GoogleId value:", userData.googleId);
          setUserData(userData);

          // Set the editable profile data
          const { name, username, timezone, email, avatar } = userData;
          setProfile({
            name,
            username: username || "",
            timezone,
            email,
            avatar,
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  // Handle profile update from the form component
  const handleProfileUpdate = (updatedProfile: EditableProfile) => {
    setProfile(updatedProfile);
  };

  // Determine if user is an OAuth user (has googleId, no password)
  // const isEmailPasswordUser = isPasswordExist && ;
  // console.log('Is Email/Password User:', isEmailPasswordUser);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white shadow-lg rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Profile
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors hover:bg-gray-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </button>
          </div>

          {profile && (
            <div className="space-y-12">
              {/* Profile Information Form */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Profile Information
                </h2>
                <EditProfileForm
                  profile={profile}
                  onProfileUpdate={handleProfileUpdate}
                />
              </div>

              {/* Change Password Section - Only for email/password users */}
              {userData && userData.isPasswordExist ? (
                <ChangePasswordForm />
              ) : userData?.googleId ? (
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Password
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      You signed in with Google, so your password is managed by
                      Google. You can change it in your{" "}
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline hover:text-blue-900"
                      >
                        Google Account settings
                      </a>
                      .
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
