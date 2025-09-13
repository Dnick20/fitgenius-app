// Supabase Authentication Service for FitGenius
import SupabaseService from './SupabaseService';

// Sign up function
export const signUp = async (userData) => {
  try {
    const result = await SupabaseService.signUp(
      userData.email,
      userData.password,
      userData.profile || {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        heightFeet: userData.heightFeet,
        heightInches: userData.heightInches,
        weightLbs: userData.weightLbs,
        goalWeightLbs: userData.goalWeightLbs,
        activityLevel: userData.activityLevel,
        goal: userData.goal,
        workoutTypes: userData.workoutTypes,
        is75Hard: userData.is75Hard
      }
    );
    
    if (result.success) {
      // Store user data in localStorage for quick access
      localStorage.setItem('userProfile', JSON.stringify(result.user));
      
      return {
        success: true,
        user: result.user
      };
    } else {
      return {
        success: false,
        error: result.error || 'Signup failed'
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    const result = await SupabaseService.signIn(email, password);
    
    if (result.success) {
      // Store user data in localStorage for quick access
      localStorage.setItem('userProfile', JSON.stringify(result.profile?.profile || {}));
      
      return {
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          profile: result.profile?.profile || {}
        }
      };
    } else {
      return {
        success: false,
        error: result.error || 'Invalid credentials'
      };
    }
  } catch (error) {
    console.error('Signin error:', error);
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

// Sign out function
export const signOut = () => {
  localStorage.removeItem('userProfile');
  return SupabaseService.signOut();
};

// Check if authenticated
export const isAuthenticated = async () => {
  return await SupabaseService.isAuthenticated();
};

// Get current user
export const getAuthUser = async () => {
  const user = await SupabaseService.getCurrentUser();
  if (user) {
    return {
      id: user.id,
      email: user.email,
      profile: user.profile?.profile || {}
    };
  }
  return null;
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Update in Supabase
    const { data, error } = await SupabaseService.supabase
      .from('user_profiles')
      .update({
        profile: profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      success: true,
      user: { profile: profileData }
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    const { error } = await SupabaseService.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};