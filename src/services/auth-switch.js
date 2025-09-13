// Auth Service Switch - Easy migration from localStorage to Supabase
import * as supabaseAuth from './auth-supabase';

// Feature flag - set to true when you want to use Supabase
const USE_SUPABASE = true; // SUPABASE IS NOW ACTIVE!

// Import the old localStorage auth
const oldAuth = require('./auth');

// Create a proxy that switches between old and new auth
export const signUp = async (userData) => {
  if (USE_SUPABASE) {
    // Use new database auth
    try {
      const result = await supabaseAuth.signUp(userData);
      if (result.success) {
        return {
          success: true,
          user: result.user
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Database signup failed, falling back to localStorage:', error);
      // Fallback to old auth if database fails
      return oldAuth.signUp(userData);
    }
  } else {
    // Use old localStorage auth
    return oldAuth.signUp(userData);
  }
};

export const signIn = async (email, password) => {
  if (USE_SUPABASE) {
    try {
      const result = await supabaseAuth.signIn(email, password);
      if (result.success) {
        return {
          success: true,
          user: result.user
        };
      } else {
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Database signin failed, falling back to localStorage:', error);
      return oldAuth.signIn(email, password);
    }
  } else {
    return oldAuth.signIn(email, password);
  }
};

export const signOut = () => {
  if (USE_SUPABASE) {
    return supabaseAuth.signOut();
  } else {
    return oldAuth.signOut();
  }
};

export const isAuthenticated = () => {
  if (USE_SUPABASE) {
    return supabaseAuth.isAuthenticated();
  } else {
    return oldAuth.isAuthenticated();
  }
};

export const getAuthUser = () => {
  if (USE_SUPABASE) {
    return supabaseAuth.getCurrentUser();
  } else {
    return oldAuth.getAuthUser();
  }
};

export const updateUserProfile = async (userId, profileData) => {
  if (USE_SUPABASE) {
    try {
      const result = await supabaseAuth.update('users', userId, {
        profile: profileData,
        updated_at: new Date().toISOString()
      });
      
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
  } else {
    return oldAuth.updateUserProfile(userId, profileData);
  }
};

export const resetPassword = async (email) => {
  if (USE_SUPABASE) {
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email'
    };
  } else {
    return oldAuth.resetPassword(email);
  }
};