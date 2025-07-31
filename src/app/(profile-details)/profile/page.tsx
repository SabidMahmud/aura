// /app/profile/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { User, Mail, Clock, Target, Activity, Edit3, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/ui/NavBar';

// Type definitions matching the API response
interface ProfileStats {
    totalGoals: number;
    totalMetrics: number;
    totalActivities: number;
    daysActive: number;
    accountAge: number;
}

interface ActivityWithCategory {
    name: string;
    category: string;
    frequency?: string;
}

interface ProfileData {
    id: string;
    name: string;
    email: string;
    username?: string;
    avatar?: string;
    timezone: string;
    displayName: string;
    joinDate: string;
    lastLoginAt?: string;
    isActive: boolean;
    isOnboardingComplete: boolean;
    goals: string[];
    metrics: string[];
    activities: ActivityWithCategory[];
    stats: ProfileStats;
    accountInfo: {
        status: 'Active' | 'Inactive';
        planType: string;
        notificationsEnabled: boolean;
        privacyLevel: 'Public' | 'Private';
        termsAccepted: boolean;
        privacyPolicyAccepted: boolean;
    };
}

const ProfilePage = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/user/profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies for authentication
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Failed to fetch profile');
                }

                if (result.success) {
                    setProfile(result.data);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getCategoryColor = (category: string) => {
        // Add the index signature here
        const colors: { [key: string]: string } = {
            'Fitness': 'bg-emerald-100 text-emerald-700',
            'Learning': 'bg-blue-100 text-blue-700',
            'Education': 'bg-purple-100 text-purple-700',
            'Wellness': 'bg-rose-100 text-rose-700',
            'General': 'bg-gray-100 text-gray-700'
        };
        // The || operator correctly handles cases where the category isn't in the object.
        return colors[category] || 'bg-gray-100 text-gray-700';
    };
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatLastLogin = (dateString?: string) => {
        if (!dateString) return 'Never';

        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInHours < 48) return 'Yesterday';
        return formatDate(dateString);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mx-auto mb-4"></div>
                    <p className="text-amber-700 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Profile</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // No profile data
    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No profile data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl font-bold">
                                    {profile.avatar ? (
                                        <Image src={profile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        getInitials(profile.displayName)
                                    )}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-2 border-white ${profile.isActive ? 'bg-emerald-500' : 'bg-gray-400'} rounded-full`}></div>
                            </div>

                            {/* Basic Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.displayName}</h1>
                                <div className="flex flex-col gap-2 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        <span>{profile.email}</span>
                                    </div>
                                    {profile.username && (
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            <span>@{profile.username}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{profile.timezone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Member since {formatDate(profile.joinDate)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => router.push('/profile/edit')}
                            className="flex items-center gap-2 rounded-md bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                        >
                            <Edit3 className="w-4 h-4" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Goals', value: profile.stats.totalGoals, icon: Target },
                        { label: 'Activities', value: profile.stats.totalActivities, icon: Activity },
                        { label: 'Metrics', value: profile.stats.totalMetrics, icon: User },
                        { label: 'Days Active', value: profile.stats.daysActive, icon: Calendar }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <stat.icon className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    <p className="text-sm text-gray-600">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Goals Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">My Goals</h2>
                        </div>
                        {profile.goals.length > 0 ? (
                            <div className="space-y-3">
                                {profile.goals.map((goal, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <p className="text-gray-700">{goal}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No goals set yet. Start by adding some goals!</p>
                        )}
                    </div>

                    {/* Activities Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Activity className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">My Activities</h2>
                        </div>
                        {profile.activities.length > 0 ? (
                            <div className="space-y-3">
                                {profile.activities.map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                            <div>
                                                <p className="font-medium text-gray-800">{activity.name}</p>
                                                {activity.frequency && (
                                                    <p className="text-sm text-gray-500">{activity.frequency}</p>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(activity.category)}`}>
                                            {activity.category}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No activities added yet. Start tracking your activities!</p>
                        )}
                    </div>
                </div>

                {/* Account Information Section */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600">Account Status</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.accountInfo.status === 'Active'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {profile.accountInfo.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600">Plan Type</span>
                                <span className="text-gray-800 font-medium">{profile.accountInfo.planType}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Last Login</span>
                                <span className="text-gray-800">{formatLastLogin(profile.lastLoginAt)}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600">Onboarding</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.isOnboardingComplete
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {profile.isOnboardingComplete ? 'Complete' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-600">Notifications</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.accountInfo.notificationsEnabled
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {profile.accountInfo.notificationsEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Privacy</span>
                                <span className="text-gray-800 font-medium">{profile.accountInfo.privacyLevel} Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;