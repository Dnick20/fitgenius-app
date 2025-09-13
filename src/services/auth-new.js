// New Authentication Service using PostgreSQL Database
import DatabaseService from './DatabaseService';

// Sign up function
export const signUp = async (userData) => {
  try {
    const result = await DatabaseService.signUp(userData);
    
    if (result.success) {
      // Store token and user data
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('userProfile', JSON.stringify(result.user.profile));
      
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
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    const result = await DatabaseService.signIn(email, password);
    
    if (result.success) {
      return {
        success: true,
        user: result.user
      };
    } else {
      return {
        success: false,
        error: result.error || 'Invalid credentials'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

// Sign out function
export const signOut = () => {
  return DatabaseService.signOut();
};

// Check if authenticated
export const isAuthenticated = () => {
  return DatabaseService.isAuthenticated();
};

// Get current user
export const getAuthUser = () => {
  return DatabaseService.getCurrentUser();
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const result = await DatabaseService.update('users', userId, {
      profile: profileData,
      updated_at: new Date().toISOString()
    });
    
    // Update localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      success: true,
      user: { profile: profileData }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Password reset (placeholder - would need email service in production)
export const resetPassword = async (email) => {
  // In production, this would trigger an email with reset link
  return {
    success: true,
    message: 'Password reset instructions have been sent to your email'
  };
};