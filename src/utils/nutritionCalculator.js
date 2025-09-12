// Universal nutrition calculation system
// Centralized logic for daily calories and protein throughout the app

export const calculateUniversalNutrition = (userProfile) => {
  if (!userProfile) {
    return {
      dailyCalories: 1800,
      dailyProtein: 120,
      bmr: 1500
    };
  }

  // Check if user has saved calculator settings first
  const savedUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  
  // Calculate BMR using Mifflin-St Jeor Equation
  const calculateBMR = () => {
    if (!userProfile.age || !userProfile.height || !userProfile.weight || !userProfile.gender) {
      return 1500; // Default BMR
    }
    
    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
    } else {
      bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
    }
    
    return Math.round(bmr);
  };

  // Get current weight from progress entries or profile
  const getCurrentWeight = () => {
    const savedProgress = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    if (savedProgress.length > 0) {
      return savedProgress[0].weight; // Most recent progress entry
    }
    return userProfile?.weightLbs || Math.round((userProfile?.weight || 68) * 2.20462);
  };

  // Calculate daily calorie needs - prioritize calculator settings
  const calculateDailyCalories = () => {
    // If calculator settings exist and have been saved, use the target calories
    if (savedUserProfile.daily_calorie_target) {
      return savedUserProfile.daily_calorie_target;
    }
    
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9
    };
    
    const multiplier = activityMultipliers[userProfile.activityLevel] || 1.55;
    let maintenanceCalories = bmr * multiplier;
    
    // Apply goal-based adjustments
    if (userProfile.goal === 'lose_weight') {
      let targetCalories = maintenanceCalories - 400; // 400 calorie daily deficit
      
      // Safety minimum: Don't go below 1,200 calories for women or 1,500 for men
      const minimumCalories = userProfile.gender === 'male' ? 1500 : 1200;
      targetCalories = Math.max(targetCalories, minimumCalories);
      
      return Math.round(targetCalories);
    } else if (userProfile.goal === 'gain_muscle') {
      return Math.round(maintenanceCalories + 300); // 300 calorie surplus for muscle gain
    }
    
    return Math.round(maintenanceCalories);
  };

  // Calculate protein needs based on goal weight (0.8-1.0g per lb of goal weight)
  const calculateProteinNeeds = () => {
    // Get goal weight from saved calculator settings or profile
    const calculatorGoalWeight = savedUserProfile.calculator_goal_weight;
    const profileGoalWeight = userProfile?.goalWeightLbs || Math.round((userProfile?.goalWeight || 70) * 2.20462);
    
    // Use calculator goal weight if available, otherwise use profile goal weight
    const goalWeightLbs = calculatorGoalWeight || profileGoalWeight;
    
    // For weight loss: use 0.9g per lb of goal weight (middle of 0.8-1.0 range)
    // This is more appropriate for people with obesity to avoid overestimating protein needs
    const proteinMultiplier = 0.9;
    return Math.round(goalWeightLbs * proteinMultiplier);
  };

  // Calculate water needs based on weight
  const calculateWaterNeeds = () => {
    const currentWeightLbs = getCurrentWeight();
    
    // Weight-based water recommendations:
    // 1 gallon (16 cups) for anyone over 300 lbs
    // Half gallon (8 cups) for anyone under 300 lbs
    let waterNeeds;
    if (currentWeightLbs >= 300) {
      waterNeeds = 16; // 1 gallon = 16 cups (8oz each)
    } else {
      waterNeeds = 8; // Half gallon = 8 cups (8oz each)
    }
    
    // 75 Hard requires a gallon of water regardless of weight
    if (userProfile.is75Hard) {
      waterNeeds = 16;
    }
    
    return waterNeeds;
  };

  const bmr = calculateBMR();
  const dailyCalories = calculateDailyCalories();
  const dailyProtein = calculateProteinNeeds();
  const dailyWater = calculateWaterNeeds();

  // Calculate calorie deficit for context
  const calorieDeficit = savedUserProfile.calorie_deficit || 400;

  // Distribute calories across meals (standard distribution)
  const mealDistribution = {
    breakfast: Math.round(dailyCalories * 0.25), // 25%
    lunch: Math.round(dailyCalories * 0.35),     // 35%
    dinner: Math.round(dailyCalories * 0.30),    // 30%
    snack: Math.round(dailyCalories * 0.10)      // 10%
  };

  // Distribute protein across meals
  const proteinDistribution = {
    breakfast: Math.round(dailyProtein * 0.25), // 25%
    lunch: Math.round(dailyProtein * 0.35),     // 35%
    dinner: Math.round(dailyProtein * 0.30),    // 30%
    snack: Math.round(dailyProtein * 0.10)      // 10%
  };

  return {
    // Main nutrition targets
    dailyCalories,
    dailyProtein,
    dailyWater,
    bmr,
    calorieDeficit,
    
    // Meal distributions
    mealDistribution,
    proteinDistribution,
    
    // Context info
    currentWeight: getCurrentWeight(),
    usingCalculatorSettings: !!savedUserProfile.daily_calorie_target,
    
    // Helper function to get nutrition summary
    getNutritionSummary: () => ({
      calories: dailyCalories,
      protein: dailyProtein,
      water: dailyWater,
      bmr: bmr,
      deficit: calorieDeficit
    })
  };
};

// Helper function to format nutrition display
export const formatNutritionDisplay = (nutrition) => {
  return {
    dailyCalories: `${nutrition.dailyCalories}`,
    dailyProtein: `${nutrition.dailyProtein}g`,
    dailyWater: `${nutrition.dailyWater} glasses`,
    bmrText: `BMR: ${nutrition.bmr} cal`,
    deficitText: nutrition.usingCalculatorSettings 
      ? 'Calculator settings' 
      : `${nutrition.calorieDeficit} cal deficit`
  };
};

export default calculateUniversalNutrition;