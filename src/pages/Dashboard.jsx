import React from 'react';
import { Target, Weight, Activity, TrendingUp, Zap, Heart, Calendar, Trophy, Droplets, Coffee } from 'lucide-react';

const Dashboard = ({ userProfile, onNavigate }) => {
  if (!userProfile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate BMI
  const calculateBMI = () => {
    if (!userProfile.height || !userProfile.weight) return 0;
    const heightInM = userProfile.height / 100;
    return (userProfile.weight / (heightInM * heightInM)).toFixed(1);
  };

  // Calculate BMR (Basal Metabolic Rate)
  const calculateBMR = () => {
    if (!userProfile.age || !userProfile.height || !userProfile.weight || !userProfile.gender) return 0;
    
    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 88.362 + (13.397 * userProfile.weight) + (4.799 * userProfile.height) - (5.677 * userProfile.age);
    } else {
      bmr = 447.593 + (9.247 * userProfile.weight) + (3.098 * userProfile.height) - (4.330 * userProfile.age);
    }
    
    return Math.round(bmr);
  };

  // Calculate daily calorie needs with 700 calorie weekly deficit
  const calculateDailyCalories = () => {
    const bmr = calculateBMR();
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      extra: 1.9
    };
    
    const multiplier = activityMultipliers[userProfile.activityLevel] || 1.55;
    let dailyCalories = bmr * multiplier;
    
    // Adjust based on goal with 700 calorie weekly deficit (100 calories per day)
    if (userProfile.goal === 'lose_weight') {
      dailyCalories -= 100; // 100 calorie daily deficit for 700 weekly deficit
    } else if (userProfile.goal === 'gain_muscle') {
      dailyCalories += 300; // 300 calorie surplus for muscle gain
    }
    
    return Math.round(dailyCalories);
  };

  // Use consistent weight data sources with Progress page
  const getUserCurrentWeight = () => {
    const savedProgress = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    if (savedProgress.length > 0) {
      return savedProgress[0].weight; // Most recent progress entry
    }
    return userProfile?.weightLbs || Math.round((userProfile?.weight || 68) * 2.20462); // Convert from kg to lbs
  };

  const getUserGoalWeight = () => {
    return userProfile?.goalWeightLbs || Math.round((userProfile?.goalWeight || getUserCurrentWeight() - 10) * 2.20462);
  };

  // Calculate protein recommendations
  const calculateProteinNeeds = () => {
    if (!userProfile.weight) return 0;
    const weightInKg = userProfile.weight;
    
    // Protein needs based on activity level and goals
    let proteinMultiplier = 0.8; // Sedentary baseline
    
    if (userProfile.activityLevel === 'light') proteinMultiplier = 1.0;
    else if (userProfile.activityLevel === 'moderate') proteinMultiplier = 1.2;
    else if (userProfile.activityLevel === 'active') proteinMultiplier = 1.4;
    else if (userProfile.activityLevel === 'extra') proteinMultiplier = 1.6;
    
    // Increase for muscle building goals or 75 Hard
    if (userProfile.goal === 'gain_muscle' || userProfile.is75Hard) {
      proteinMultiplier += 0.2;
    }
    
    return Math.round(weightInKg * proteinMultiplier);
  };

  // Calculate water recommendations
  const calculateWaterNeeds = () => {
    if (!userProfile.weight) return 8;
    const weightInKg = userProfile.weight;
    
    // Base water needs: 35ml per kg body weight
    let waterNeeds = Math.round((weightInKg * 35) / 240); // Convert to 8oz glasses
    
    // Add extra for activity
    if (userProfile.activityLevel === 'active' || userProfile.activityLevel === 'extra') {
      waterNeeds += 2;
    }
    
    // 75 Hard requires a gallon of water (16 cups)
    if (userProfile.is75Hard) {
      waterNeeds = 16;
    }
    
    return Math.max(waterNeeds, 8); // Minimum 8 glasses
  };

  // Calculate weight loss timeline
  const calculateWeightLossTimeline = () => {
    if (!userProfile.goalWeight || userProfile.goal !== 'lose_weight') return null;
    
    const currentWeightLbs = currentWeight;
    const goalWeightLbs = goalWeight;
    const weightToLose = currentWeightLbs - goalWeightLbs;
    
    if (weightToLose <= 0) return null;
    
    // 700 calorie weekly deficit = 0.2 lbs per week (3500 calories = 1 pound)
    const weeksToGoal = Math.ceil(weightToLose / 0.2);
    const monthsToGoal = Math.ceil(weeksToGoal / 4.33);
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (weeksToGoal * 7));
    
    return {
      weightToLose,
      weeksToGoal,
      monthsToGoal,
      targetDate: targetDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  // Calculate all values
  const currentWeight = getUserCurrentWeight();
  const goalWeight = getUserGoalWeight();
  const bmi = calculateBMI();
  const bmr = calculateBMR();
  const dailyCalories = calculateDailyCalories();
  const weightLossTimeline = calculateWeightLossTimeline();
  const proteinNeeds = calculateProteinNeeds();
  const waterNeeds = calculateWaterNeeds();

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-400' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-400' };
    return { text: 'Obese', color: 'text-red-400' };
  };

  const bmiCategory = getBMICategory(bmi);

  const getGoalDescription = (goal) => {
    const goals = {
      lose_weight: 'Lose Weight',
      gain_muscle: 'Gain Muscle',
      maintain: 'Maintain Weight',
      improve_fitness: 'Improve Fitness'
    };
    return goals[goal] || 'Improve Health';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
          Welcome back, {userProfile.name}! 💪
        </h1>
        <p className="text-gray-300 text-lg">Here's your personalized fitness overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {/* Current Weight */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
            <Weight className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{currentWeight} lbs</div>
          <div className="text-xs text-gray-400">Goal: {goalWeight} lbs</div>
        </div>

        {/* BMI */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">BMI</h3>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{bmi}</div>
          <div className={`text-xs ${bmiCategory.color}`}>
            {bmiCategory.text}
          </div>
        </div>

        {/* Daily Calories */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Calories</h3>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{dailyCalories}</div>
          <div className="text-xs text-gray-400">
            BMR: {bmr} cal • 700 weekly deficit
          </div>
        </div>

        {/* Goal */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Goal</h3>
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{getGoalDescription(userProfile.goal)}</div>
          <div className="text-xs text-gray-400 capitalize">
            {userProfile.activityLevel} activity
            {userProfile.is75Hard && (
              <div className="text-purple-400 font-semibold mt-1">75 Hard Challenge</div>
            )}
          </div>
        </div>

        {/* Protein Needs */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Protein</h3>
            <Coffee className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{proteinNeeds}g</div>
          <div className="text-xs text-gray-400">
            Recommended intake
          </div>
        </div>

        {/* Water Needs */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Water</h3>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{waterNeeds}</div>
          <div className="text-xs text-gray-400">
            glasses (8oz each)
            {userProfile.is75Hard && (
              <div className="text-purple-400 font-semibold">1 gallon for 75 Hard</div>
            )}
          </div>
        </div>
      </div>

      {/* Weight Loss Timeline */}
      {weightLossTimeline && (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/20 shadow-2xl mb-8">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-purple-400 mr-2" />
            <h3 className="text-xl font-bold text-white">Your Weight Loss Journey</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{weightLossTimeline.weightToLose} lbs</div>
              <div className="text-sm text-gray-300">To Lose</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{weightLossTimeline.weeksToGoal} weeks</div>
              <div className="text-sm text-gray-300">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{weightLossTimeline.monthsToGoal} months</div>
              <div className="text-sm text-gray-300">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">{weightLossTimeline.targetDate}</div>
              <div className="text-sm text-gray-300">Target Date</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded-xl">
            <p className="text-sm text-gray-300 text-center">
              Based on a healthy 700-calorie weekly deficit (100 calories per day), you'll lose approximately 0.2 lbs per week.
            </p>
          </div>
        </div>
      )}

      {/* Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Your Profile</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Age:</span>
              <span className="text-white font-semibold">{userProfile.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Gender:</span>
              <span className="text-white font-semibold capitalize">{userProfile.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Height:</span>
              <span className="text-white font-semibold">
                {userProfile.heightFeet && userProfile.heightInches 
                  ? `${userProfile.heightFeet}'${userProfile.heightInches}"`
                  : `${Math.floor(userProfile.height / 2.54 / 12)}'${Math.round((userProfile.height / 2.54) % 12)}"`
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Activity Level:</span>
              <span className="text-white font-semibold capitalize">{userProfile.activityLevel.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate && onNavigate('weekly-plan')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Weekly Plan
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('workouts')}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Workout
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('meals')}
              className="w-full bg-blue-500/20 text-blue-300 py-3 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              View Meal Plan
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('progress')}
              className="w-full bg-green-500/20 text-green-300 py-3 rounded-xl font-semibold hover:bg-green-500/30 transition-colors flex items-center justify-center"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Track Progress
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
        <div className="flex items-center mb-4">
          <Trophy className="w-6 h-6 text-yellow-400 mr-2" />
          <h3 className="text-xl font-bold text-white">Personalized Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 p-4 rounded-xl border border-orange-500/20">
            <h4 className="font-semibold text-white mb-2">Nutrition Focus</h4>
            <p className="text-gray-300 text-sm">
              {userProfile.goal === 'lose_weight' && 'Focus on a caloric deficit with balanced macros.'}
              {userProfile.goal === 'gain_muscle' && 'Increase protein intake to support muscle growth.'}
              {userProfile.goal === 'maintain' && 'Maintain current caloric intake with balanced nutrition.'}
              {userProfile.goal === 'improve_fitness' && 'Fuel your workouts with proper pre/post nutrition.'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 rounded-xl border border-blue-500/20">
            <h4 className="font-semibold text-white mb-2">Workout Style</h4>
            <p className="text-gray-300 text-sm">
              {userProfile.goal === 'lose_weight' && 'Combine cardio with strength training for best results.'}
              {userProfile.goal === 'gain_muscle' && 'Focus on progressive overload with compound movements.'}
              {userProfile.goal === 'maintain' && 'Mix strength training with cardio for overall health.'}
              {userProfile.goal === 'improve_fitness' && 'Varied workouts to improve all aspects of fitness.'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-4 rounded-xl border border-green-500/20">
            <h4 className="font-semibold text-white mb-2">Recovery</h4>
            <p className="text-gray-300 text-sm">
              Aim for 7-9 hours of sleep and include rest days in your routine. Stay hydrated and consider light stretching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;