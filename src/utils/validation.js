// Input validation utilities

export const validateProfile = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (formData.name && formData.name.length > 50) {
    errors.name = 'Name must be less than 50 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Age validation
  const age = parseInt(formData.age);
  if (!formData.age || isNaN(age)) {
    errors.age = 'Age is required';
  } else if (age < 13 || age > 120) {
    errors.age = 'Age must be between 13 and 120';
  }

  // Height validation (in cm)
  const height = parseFloat(formData.height);
  if (!formData.height || isNaN(height)) {
    errors.height = 'Height is required';
  } else if (height < 100 || height > 250) {
    errors.height = 'Height must be between 100cm and 250cm';
  }

  // Weight validation (in lbs)
  const weight = parseFloat(formData.weight);
  if (!formData.weight || isNaN(weight)) {
    errors.weight = 'Weight is required';
  } else if (weight < 50 || weight > 600) {
    errors.weight = 'Weight must be between 50 lbs and 600 lbs';
  }

  // Goal weight validation
  if (formData.goalWeight) {
    const goalWeight = parseFloat(formData.goalWeight);
    if (isNaN(goalWeight) || goalWeight < 50 || goalWeight > 600) {
      errors.goalWeight = 'Goal weight must be between 50 lbs and 600 lbs';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateMealInput = (meal) => {
  const errors = {};

  if (!meal.name || meal.name.trim().length < 2) {
    errors.name = 'Meal name is required';
  }

  const calories = parseInt(meal.calories);
  if (!meal.calories || isNaN(calories) || calories < 0 || calories > 5000) {
    errors.calories = 'Calories must be between 0 and 5000';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateWorkoutInput = (workout) => {
  const errors = {};

  if (!workout.name || workout.name.trim().length < 2) {
    errors.name = 'Exercise name is required';
  }

  if (workout.sets) {
    const sets = parseInt(workout.sets);
    if (isNaN(sets) || sets < 1 || sets > 20) {
      errors.sets = 'Sets must be between 1 and 20';
    }
  }

  if (workout.reps) {
    const reps = parseInt(workout.reps);
    if (isNaN(reps) || reps < 1 || reps > 100) {
      errors.reps = 'Reps must be between 1 and 100';
    }
  }

  if (workout.duration) {
    const duration = parseInt(workout.duration);
    if (isNaN(duration) || duration < 1 || duration > 600) {
      errors.duration = 'Duration must be between 1 and 600 minutes';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .slice(0, 1000); // Limit length
};

// Format and validate numbers
export const parseNumber = (value, min = 0, max = Infinity, defaultValue = 0) => {
  const num = parseFloat(value);
  if (isNaN(num)) return defaultValue;
  return Math.max(min, Math.min(max, num));
};