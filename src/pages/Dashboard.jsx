import React from 'react';
import { Target, Weight, Activity, TrendingUp, Zap, Heart, Calendar, Trophy, Droplets, Coffee } from 'lucide-react';
import WeightLossCalculator from '../components/WeightLossCalculator';
import { calculateUniversalNutrition, formatNutritionDisplay } from '../utils/nutritionCalculator';
import { GlassCard } from '../components/glass/GlassCard';

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

  // Get universal nutrition data
  const nutrition = calculateUniversalNutrition(userProfile);
  const nutritionDisplay = formatNutritionDisplay(nutrition);

  // Calculate BMI
  const calculateBMI = () => {
    if (!userProfile.height || !userProfile.weight) return 0;
    const heightInM = userProfile.height / 100;
    return (userProfile.weight / (heightInM * heightInM)).toFixed(1);
  };

  // Note: Exercise recommendation functions kept for potential future use
  // but currently not displayed in the UI

  // Use consistent weight data sources with Progress page
  const getUserCurrentWeight = () => {
    // First check saved progress entries
    const savedProgress = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    if (savedProgress.length > 0) {
      return savedProgress[0].weight;
    }
    
    // Then check userProfile for weightLbs (from account creation)
    if (userProfile?.weightLbs) {
      return parseFloat(userProfile.weightLbs);
    }
    
    // Check localStorage for saved profile
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.weightLbs) {
      return parseFloat(savedProfile.weightLbs);
    }
    
    // Use nutrition calculator as fallback
    return nutrition.currentWeight;
  };

  const getUserGoalWeight = () => {
    // Check userProfile for goalWeightLbs (from account creation)
    if (userProfile?.goalWeightLbs) {
      return parseFloat(userProfile.goalWeightLbs);
    }
    
    // Check localStorage for saved profile
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile.goalWeightLbs) {
      return parseFloat(savedProfile.goalWeightLbs);
    }
    
    // Fallback: convert from kg or calculate default
    if (userProfile?.goalWeight || savedProfile?.goalWeight) {
      return Math.round((userProfile?.goalWeight || savedProfile?.goalWeight) * 2.20462);
    }
    
    return getUserCurrentWeight() - 10; // Default to 10 lbs loss
  };

  // Calculate weight loss timeline
  const calculateWeightLossTimeline = () => {
    if (!userProfile.goalWeight || userProfile.goal !== 'lose_weight') return null;
    
    const currentWeightLbs = currentWeight;
    const goalWeightLbs = goalWeight;
    const weightToLose = currentWeightLbs - goalWeightLbs;
    
    if (weightToLose <= 0) return null;
    
    // Moderate weight loss: 400 calorie deficit = 0.8 lbs per week  
    const weeksToGoal = Math.ceil(weightToLose / 0.8);
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
  const bmr = nutrition.bmr;
  const dailyCalories = nutrition.dailyCalories;
  const weightLossTimeline = calculateWeightLossTimeline();
  const proteinNeeds = nutrition.dailyProtein;
  const waterNeeds = nutrition.dailyWater;

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
        <GlassCard intensity="strong" className="p-6 glass-blue" hover>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
            <Weight className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{currentWeight} lbs</div>
          <div className="text-xs text-gray-400">Goal: {goalWeight} lbs</div>
        </GlassCard>

        {/* BMI */}
        <GlassCard intensity="strong" className="p-6 glass-green" hover>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">BMI</h3>
            <Activity className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{bmi}</div>
          <div className={`text-xs ${bmiCategory.color}`}>
            {bmiCategory.text}
          </div>
        </GlassCard>

        {/* Daily Calories */}
        <GlassCard intensity="strong" className="p-6" hover>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Calories</h3>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{dailyCalories}</div>
          <div className="text-xs text-gray-400">
            {nutritionDisplay.bmrText} • {nutritionDisplay.deficitText}
          </div>
        </GlassCard>

        {/* Goal */}
        <GlassCard intensity="strong" className="p-6 glass-orange" hover>
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
        </GlassCard>

        {/* Protein Needs */}
        <GlassCard intensity="strong" className="p-6" hover>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Protein</h3>
            <Coffee className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{proteinNeeds}g</div>
          <div className="text-xs text-gray-400">
            Recommended intake
          </div>
        </GlassCard>

        {/* Water Needs */}
        <GlassCard intensity="strong" className="p-6" hover>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Daily Water</h3>
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">{waterNeeds}</div>
          <div className="text-xs text-gray-400">
            glasses (8oz each) • {waterNeeds >= 16 ? '1 gallon' : 'Half gallon'}
            {userProfile.is75Hard && (
              <div className="text-purple-400 font-semibold">75 Hard: 1 gallon</div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Weight Loss Timeline */}
      {weightLossTimeline && (
        <GlassCard intensity="strong" className="p-6 glass-purple mb-8 glass-glow">
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
              Using our moderate weight loss approach (400 calorie daily deficit), you'll lose approximately 0.8 lbs per week at a sustainable pace.
            </p>
          </div>
        </GlassCard>
      )}


      {/* Weight Loss Calculator */}
      <WeightLossCalculator userProfile={userProfile} />

      {/* Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassCard intensity="strong" className="p-6">
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
        </GlassCard>

        <GlassCard intensity="strong" className="p-6">
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
        </GlassCard>
      </div>

      {/* Recommendations */}
      <GlassCard intensity="strong" className="p-6">
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
      </GlassCard>
    </div>
  );
};

export default Dashboard;