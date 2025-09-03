// Authentication Service
// In production, this would connect to a backend API

const AUTH_KEY = 'fitgenius_auth';
const USERS_KEY = 'fitgenius_users';

// Initialize storage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getCurrentUser = () => {
  const auth = localStorage.getItem(AUTH_KEY);
  return auth ? JSON.parse(auth) : null;
};

const setCurrentUser = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

// Authentication functions
export const signUp = async (userData) => {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return {
        success: false,
        error: 'An account with this email already exists'
      };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      password: btoa(userData.password), // Basic encoding (use proper hashing in production)
      createdAt: new Date().toISOString(),
      profile: {
        name: userData.name,
        email: userData.email,
        age: userData.age,
        gender: userData.gender,
        height: userData.height,
        weight: userData.weight,
        activityLevel: userData.activityLevel,
        goal: userData.goal,
        goalWeight: userData.goalWeight
      }
    };
    
    // Remove sensitive data from session
    const sessionUser = { ...newUser };
    delete sessionUser.password;
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(sessionUser);
    
    return {
      success: true,
      user: sessionUser
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to create account. Please try again.'
    };
  }
};

export const signIn = async (email, password) => {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Check password
    if (atob(user.password) !== password) {
      return {
        success: false,
        error: 'Invalid email or password'
      };
    }
    
    // Create session
    const sessionUser = { ...user };
    delete sessionUser.password;
    setCurrentUser(sessionUser);
    
    return {
      success: true,
      user: sessionUser
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to sign in. Please try again.'
    };
  }
};

export const signOut = () => {
  localStorage.removeItem(AUTH_KEY);
  return { success: true };
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const getAuthUser = () => {
  return getCurrentUser();
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    users[userIndex].profile = {
      ...users[userIndex].profile,
      ...profileData
    };
    
    saveUsers(users);
    
    // Update session if it's the current user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.profile = users[userIndex].profile;
      setCurrentUser(currentUser);
    }
    
    return {
      success: true,
      user: users[userIndex]
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to update profile'
    };
  }
};

// Password reset (simplified for demo)
export const resetPassword = async (email) => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return {
      success: false,
      error: 'No account found with this email'
    };
  }
  
  // In production, this would send an email
  return {
    success: true,
    message: 'Password reset instructions have been sent to your email'
  };
};