import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const UserDataContext = createContext();

// Custom hook to use the context
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

// Provider component
export const UserDataProvider = ({ children }) => {
  // Initialize user data from localStorage
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  // Initialize progress entries from localStorage
  const [progressEntries, setProgressEntries] = useState(() => {
    const saved = localStorage.getItem('progressEntries');
    return saved ? JSON.parse(saved) : [];
  });

  // Initialize selected meals from localStorage
  const [selectedMeals, setSelectedMeals] = useState(() => {
    const saved = localStorage.getItem('selectedMeals');
    return saved ? JSON.parse(saved) : [];
  });

  // Initialize selected workouts from localStorage
  const [selectedWorkouts, setSelectedWorkouts] = useState(() => {
    const saved = localStorage.getItem('selectedWorkouts');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync userData to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userProfile', JSON.stringify(userData));
    }
  }, [userData]);

  // Sync progress entries to localStorage
  useEffect(() => {
    localStorage.setItem('progressEntries', JSON.stringify(progressEntries));
  }, [progressEntries]);

  // Sync selected meals to localStorage
  useEffect(() => {
    localStorage.setItem('selectedMeals', JSON.stringify(selectedMeals));
  }, [selectedMeals]);

  // Sync selected workouts to localStorage
  useEffect(() => {
    localStorage.setItem('selectedWorkouts', JSON.stringify(selectedWorkouts));
  }, [selectedWorkouts]);

  // Single source of truth for current weight
  const getCurrentWeight = () => {
    // Priority 1: Most recent progress entry
    if (progressEntries.length > 0) {
      const sortedEntries = [...progressEntries].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      return parseFloat(sortedEntries[0].weight);
    }
    
    // Priority 2: User profile weight in lbs
    if (userData?.weightLbs) {
      return parseFloat(userData.weightLbs);
    }
    
    // Priority 3: Convert from kg if available
    if (userData?.weight) {
      return Math.round(userData.weight * 2.20462);
    }
    
    // Default fallback
    return 150;
  };

  // Single source of truth for goal weight
  const getGoalWeight = () => {
    // Priority 1: Goal weight in lbs
    if (userData?.goalWeightLbs) {
      return parseFloat(userData.goalWeightLbs);
    }
    
    // Priority 2: Convert from kg if available
    if (userData?.goalWeight) {
      return Math.round(userData.goalWeight * 2.20462);
    }
    
    // Priority 3: Calculate based on goal
    const currentWeight = getCurrentWeight();
    if (userData?.goal === 'lose_weight' || userData?.fitness_goal === 'lose_weight') {
      return currentWeight - 10; // Default 10 lbs loss
    } else if (userData?.goal === 'gain_muscle' || userData?.fitness_goal === 'gain_muscle') {
      return currentWeight + 10; // Default 10 lbs gain
    }
    
    return currentWeight; // Maintain weight
  };

  // Update weight from progress entry
  const updateWeight = (newWeight) => {
    // Create new progress entry
    const newEntry = {
      date: new Date().toISOString(),
      weight: parseFloat(newWeight),
      timestamp: Date.now()
    };
    
    // Update progress entries
    const updatedEntries = [newEntry, ...progressEntries];
    setProgressEntries(updatedEntries);
    
    // Update user profile with new weight
    if (userData) {
      const updatedUser = {
        ...userData,
        weightLbs: parseFloat(newWeight),
        currentWeight: parseFloat(newWeight)
      };
      setUserData(updatedUser);
    }
  };

  // Add a new progress entry
  const addProgressEntry = (entry) => {
    const newEntry = {
      ...entry,
      date: entry.date || new Date().toISOString(),
      timestamp: Date.now()
    };
    
    const updatedEntries = [newEntry, ...progressEntries];
    setProgressEntries(updatedEntries);
    
    // If the entry includes weight, update the profile
    if (entry.weight) {
      updateWeight(entry.weight);
    }
  };

  // Update user profile
  const updateUserProfile = (updates) => {
    const updatedUser = {
      ...userData,
      ...updates
    };
    setUserData(updatedUser);
  };

  // Clear all data (for logout)
  const clearAllData = () => {
    setUserData(null);
    setProgressEntries([]);
    setSelectedMeals([]);
    setSelectedWorkouts([]);
    localStorage.removeItem('userProfile');
    localStorage.removeItem('progressEntries');
    localStorage.removeItem('selectedMeals');
    localStorage.removeItem('selectedWorkouts');
  };

  // Context value
  const value = {
    // Data
    userData,
    progressEntries,
    selectedMeals,
    selectedWorkouts,
    
    // Computed values
    currentWeight: getCurrentWeight(),
    goalWeight: getGoalWeight(),
    
    // Actions
    setUserData,
    updateUserProfile,
    addProgressEntry,
    updateWeight,
    setProgressEntries,
    setSelectedMeals,
    setSelectedWorkouts,
    clearAllData,
    
    // Helper functions
    getCurrentWeight,
    getGoalWeight
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserDataContext;