// lib/api/auth.ts

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  user?: T;
  data?: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface UpdateProfileData {
  name?: string;
  username?: string;
  avatar?: string;
  timezone?: string;
}

// Login user via API
export async function loginUser(data: LoginData): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Login API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Register user via API
export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Register API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Get user profile
export async function getUserProfile(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get profile API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Update user profile
export async function updateUserProfile(data: UpdateProfileData): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Update profile API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Delete user account
export async function deleteUserAccount(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Delete account API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Get onboarding status
export async function getOnboardingStatus(): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/onboarding', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get onboarding status API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Complete onboarding
export async function completeOnboarding(data?: any): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Complete onboarding API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}

// Update onboarding data
export async function updateOnboardingData(data: any): Promise<ApiResponse> {
  try {
    const response = await fetch('/api/user/onboarding', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Update onboarding API call error:', error);
    return {
      success: false,
      message: 'Network error occurred'
    };
  }
}