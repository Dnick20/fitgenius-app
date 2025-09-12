import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, Calendar, Target, Activity, Zap } from 'lucide-react';
import { Button, Box, Heading, Text } from '@primer/react';

const WeightLossCalculator = ({ userProfile }) => {
  // Get current weight from progress entries if available
  const getCurrentWeight = () => {
    const savedProgress = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    return savedProgress.length > 0 
      ? savedProgress[0].weight 
      : (userProfile?.weightLbs || userProfile?.current_weight || 150);
  };

  // Calculate goal weight based on deficit and timeline (3 months default)
  const calculateGoalWeight = (currentWeight, dailyDeficit, monthsTimeline = 3) => {
    // Calculate expected weight loss: (deficit × 7 days × weeks) ÷ 3500 calories per pound
    const weeksTimeline = monthsTimeline * 4.33;
    const totalCalorieDeficit = dailyDeficit * 7 * weeksTimeline;
    const expectedWeightLoss = totalCalorieDeficit / 3500;
    return Math.round(currentWeight - expectedWeightLoss);
  };

  // Load saved calculator settings from localStorage
  const loadSavedSettings = () => {
    const saved = localStorage.getItem('weightLossCalculatorSettings');
    const currentWeight = getCurrentWeight();
    
    if (saved) {
      const savedData = JSON.parse(saved);
      // Recalculate goal weight if deficit changed
      if (!savedData.goalWeightLocked) {
        savedData.goalWeight = calculateGoalWeight(currentWeight, savedData.dailyDeficit, savedData.monthsTimeline || 3);
      }
      savedData.currentWeight = currentWeight; // Always use most recent weight
      return savedData;
    }
    
    const defaultDeficit = 400;
    const defaultMonths = 3;
    
    return {
      currentWeight: currentWeight,
      goalWeight: calculateGoalWeight(currentWeight, defaultDeficit, defaultMonths),
      age: userProfile?.age || 30,
      height: (userProfile?.height_feet * 12 + userProfile?.height_inches) || 66,
      gender: userProfile?.gender || 'female',
      activityLevel: userProfile?.activity_level || 'moderate',
      dailyDeficit: defaultDeficit,
      monthsTimeline: defaultMonths,
      goalWeightLocked: false // Allow manual override
    };
  };

  const [inputs, setInputs] = useState(loadSavedSettings());
  const [results, setResults] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Update current weight when component mounts or user profile changes
  useEffect(() => {
    const currentWeight = getCurrentWeight();
    setInputs(prev => {
      if (prev.currentWeight !== currentWeight) {
        const newInputs = { ...prev, currentWeight };
        // Recalculate goal weight if not locked
        if (!prev.goalWeightLocked) {
          newInputs.goalWeight = calculateGoalWeight(currentWeight, prev.dailyDeficit, prev.monthsTimeline);
        }
        return newInputs;
      }
      return prev;
    });
  }, [userProfile]);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const calculateBMR = (weight, height, age, gender) => {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
      return 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age + 5;
    } else {
      return 10 * (weight * 0.453592) + 6.25 * (height * 2.54) - 5 * age - 161;
    }
  };

  const calculateResults = () => {
    const { currentWeight, goalWeight, age, height, gender, activityLevel, dailyDeficit, monthsTimeline } = inputs;
    
    // Basic validations
    if (currentWeight <= goalWeight) {
      setResults({
        error: "Current weight must be greater than goal weight for weight loss calculation."
      });
      return;
    }

    // Calculate BMR and TDEE (maintenance calories)
    const bmr = calculateBMR(currentWeight, height, age, gender);
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Calculate target calories: TDEE - deficit (should always be less than TDEE)
    const minimumCalories = gender === 'male' ? 1500 : 1200;
    const maxSafeDeficit = tdee - minimumCalories;
    const actualDeficit = Math.min(dailyDeficit, maxSafeDeficit);
    const targetCalories = Math.max(tdee - actualDeficit, minimumCalories);
    
    // Weight loss calculations - use the timeline approach
    const totalWeightToLose = currentWeight - goalWeight;
    
    // If user selected a timeline, calculate required deficit for that timeline
    const weeksInTimeline = monthsTimeline * 4.33;
    const requiredWeeklyLoss = totalWeightToLose / weeksInTimeline;
    const requiredDailyDeficit = (requiredWeeklyLoss * 3500) / 7;
    
    // Use actual deficit for calculations (what's achievable)
    const weeklyWeightLoss = (actualDeficit * 7) / 3500;
    const actualWeeksToGoal = totalWeightToLose / weeklyWeightLoss;
    const actualMonthsToGoal = actualWeeksToGoal / 4.33;
    
    // Calculate target date based on actual timeline
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (actualWeeksToGoal * 7));
    
    // Exercise needed if deficit is reduced due to safety minimums
    const exerciseCaloriesNeeded = dailyDeficit - actualDeficit;
    
    // Protein calculation: 0.8-1.0g per lb of GOAL weight (not current weight)
    // For obese individuals, use goal weight to avoid overestimating protein needs
    const proteinMultiplier = 0.9; // Use middle of 0.8-1.0 range
    const proteinGrams = Math.round(goalWeight * proteinMultiplier);
    
    // Calculate remaining macros after protein
    const proteinCalories = proteinGrams * 4;
    const remainingCalories = targetCalories - proteinCalories;
    
    // Distribute remaining calories: 45% carbs, 35% fats (roughly)
    const carbCalories = remainingCalories * 0.45;
    const fatCalories = remainingCalories * 0.35;
    
    const carbGrams = carbCalories / 4;
    const fatGrams = fatCalories / 9;

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee), // Add TDEE to results
      maintenanceCalories: Math.round(tdee), // Keep for compatibility 
      targetCalories: Math.round(targetCalories),
      actualDeficit: Math.round(actualDeficit),
      requiredDailyDeficit: Math.round(requiredDailyDeficit),
      totalWeightToLose: Number(totalWeightToLose.toFixed(1)),
      weeklyWeightLoss: Number(weeklyWeightLoss.toFixed(2)),
      requiredWeeklyLoss: Number(requiredWeeklyLoss.toFixed(2)),
      weeksToGoal: Math.ceil(actualWeeksToGoal),
      monthsToGoal: Number(actualMonthsToGoal.toFixed(1)),
      selectedTimelineMonths: monthsTimeline,
      targetDate: targetDate.toLocaleDateString(),
      exerciseCaloriesNeeded: Math.max(0, Math.round(exerciseCaloriesNeeded)),
      macros: {
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbGrams),
        fat: Math.round(fatGrams)
      },
      // Add timeline consistency check
      timelineMatches: Math.abs(actualMonthsToGoal - monthsTimeline) < 0.5
    });
  };

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const handleInputChange = (field, value) => {
    setInputs(prev => {
      const newInputs = { ...prev, [field]: value };
      
      // Auto-calculate goal weight when deficit or timeline changes (unless manually locked)
      if (!prev.goalWeightLocked && (field === 'dailyDeficit' || field === 'monthsTimeline')) {
        newInputs.goalWeight = calculateGoalWeight(
          prev.currentWeight, 
          field === 'dailyDeficit' ? value : prev.dailyDeficit,
          field === 'monthsTimeline' ? value : prev.monthsTimeline
        );
      }
      
      // If user manually changes goal weight, lock it
      if (field === 'goalWeight') {
        newInputs.goalWeightLocked = true;
      }
      
      return newInputs;
    });
    setIsSaved(false); // Mark as unsaved when changes are made
  };

  const saveSettings = () => {
    // Save calculator settings
    localStorage.setItem('weightLossCalculatorSettings', JSON.stringify(inputs));
    
    // Update user's daily calorie target based on the calculator results
    if (results && results.targetCalories) {
      const existingProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const updatedProfile = {
        ...existingProfile,
        daily_calorie_target: results.targetCalories,
        calorie_deficit: inputs.dailyDeficit,
        target_timeline_months: inputs.monthsTimeline,
        calculator_goal_weight: inputs.goalWeight
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      // Trigger profile update if callback is provided
      if (userProfile?.onUpdate) {
        userProfile.onUpdate(updatedProfile);
      }
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Show saved message for 2 seconds
  };

  const resetSettings = () => {
    const currentWeight = getCurrentWeight();
    const defaultDeficit = 400;
    const defaultMonths = 3;
    
    const defaults = {
      currentWeight: currentWeight,
      goalWeight: calculateGoalWeight(currentWeight, defaultDeficit, defaultMonths),
      age: userProfile?.age || 30,
      height: (userProfile?.height_feet * 12 + userProfile?.height_inches) || 66,
      gender: userProfile?.gender || 'female',
      activityLevel: userProfile?.activity_level || 'moderate',
      dailyDeficit: defaultDeficit,
      monthsTimeline: defaultMonths,
      goalWeightLocked: false
    };
    setInputs(defaults);
    localStorage.removeItem('weightLossCalculatorSettings');
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calculator className="w-6 h-6 text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-white">Weight Loss Calculator</h2>
        </div>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="primary"
            size="small"
            onClick={saveSettings}
          >
            {isSaved ? '✓ Saved' : 'Save Settings'}
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={resetSettings}
          >
            Reset
          </Button>
        </Box>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Current Weight (lbs)</label>
          <input
            type="number"
            value={inputs.currentWeight}
            onChange={(e) => handleInputChange('currentWeight', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Goal Weight (lbs) {!inputs.goalWeightLocked && <span className="text-xs text-purple-400">(Auto-calculated)</span>}
          </label>
          <div className="relative">
            <input
              type="number"
              value={inputs.goalWeight}
              onChange={(e) => handleInputChange('goalWeight', Number(e.target.value))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
            {inputs.goalWeightLocked && (
              <button
                onClick={() => handleInputChange('goalWeightLocked', false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300"
              >
                Unlock
              </button>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
          <input
            type="number"
            value={inputs.age}
            onChange={(e) => handleInputChange('age', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Height (inches)</label>
          <input
            type="number"
            value={inputs.height}
            onChange={(e) => handleInputChange('height', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
          <select
            value={inputs.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
          <select
            value={inputs.activityLevel}
            onChange={(e) => handleInputChange('activityLevel', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light Activity</option>
            <option value="moderate">Moderate Activity</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Target Timeline</label>
          <select
            value={inputs.monthsTimeline}
            onChange={(e) => handleInputChange('monthsTimeline', Number(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:border-purple-500 focus:outline-none"
          >
            <option value={1}>1 Month</option>
            <option value={2}>2 Months</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={9}>9 Months</option>
            <option value={12}>1 Year</option>
          </select>
        </div>
      </div>

      {/* Calorie Deficit Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Daily Calorie Deficit: {inputs.dailyDeficit} calories
        </label>
        <input
          type="range"
          min="200"
          max="1000"
          step="50"
          value={inputs.dailyDeficit}
          onChange={(e) => handleInputChange('dailyDeficit', Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Conservative (200)</span>
          <span>Moderate (400)</span>
          <span>Aggressive (1000)</span>
        </div>
      </div>

      {/* Goal Weight Calculation Display */}
      {!inputs.goalWeightLocked && (
        <div className="mb-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
          <div className="flex items-center mb-2">
            <Target className="w-4 h-4 text-purple-400 mr-2" />
            <h3 className="text-sm font-semibold text-purple-400">Goal Weight Auto-Calculation</h3>
          </div>
          <div className="text-xs text-gray-300">
            <div>Current Weight: <span className="text-white font-medium">{inputs.currentWeight} lbs</span></div>
            <div>Daily Deficit: <span className="text-white font-medium">{inputs.dailyDeficit} calories</span></div>
            <div>Timeline: <span className="text-white font-medium">{inputs.monthsTimeline} month{inputs.monthsTimeline > 1 ? 's' : ''}</span></div>
            <div className="mt-1 pt-1 border-t border-purple-500/20">
              Expected Loss: <span className="text-purple-300 font-medium">
                {((inputs.dailyDeficit * 7 * inputs.monthsTimeline * 4.33) / 3500).toFixed(1)} lbs
              </span>
            </div>
            <div className="text-purple-200 font-semibold">
              Goal Weight: {inputs.goalWeight} lbs
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && !results.error && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">BMR</h3>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{results.bmr}</div>
              <div className="text-xs text-gray-400">calories/day</div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 p-4 rounded-xl border border-indigo-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">TDEE</h3>
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">{results.tdee}</div>
              <div className="text-xs text-gray-400">maintenance</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Target Calories</h3>
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{results.targetCalories}</div>
              <div className="text-xs text-gray-400">TDEE - {results.actualDeficit}</div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Weekly Loss</h3>
                <TrendingDown className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{results.weeklyWeightLoss}</div>
              <div className="text-xs text-gray-400">lbs/week</div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-300">Time to Goal</h3>
                <Calendar className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{results.monthsToGoal}</div>
              <div className="text-xs text-gray-400">
                {results.timelineMatches ? 'matches target' : `vs ${results.selectedTimelineMonths} selected`}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white/10 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Weight Loss Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-400">{results.totalWeightToLose} lbs</div>
                <div className="text-sm text-gray-300">Total to Lose</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{results.weeksToGoal} weeks</div>
                <div className="text-sm text-gray-300">Calculated Timeline</div>
                <div className="text-xs text-gray-400">({results.monthsToGoal} months)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">{results.targetDate}</div>
                <div className="text-sm text-gray-300">Target Date</div>
              </div>
            </div>
            
            {/* Timeline Mismatch Warning */}
            {!results.timelineMatches && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 mr-2">⚠️</span>
                  <span className="text-yellow-400 font-semibold text-sm">Timeline Mismatch</span>
                </div>
                <div className="text-xs text-gray-300">
                  <div>Selected timeline: <span className="text-white">{results.selectedTimelineMonths} months</span></div>
                  <div>Calculated timeline: <span className="text-white">{results.monthsToGoal} months</span></div>
                  <div className="mt-2 text-yellow-200">
                    To achieve your goal in {results.selectedTimelineMonths} months, you would need a {Math.round(results.requiredDailyDeficit)} calorie daily deficit 
                    (currently {results.actualDeficit}).
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Macronutrients */}
          <div className="bg-white/10 p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Daily Macronutrient Targets</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-400">{results.macros.protein}g</div>
                <div className="text-sm text-gray-300">Protein</div>
                <div className="text-xs text-gray-400">0.9g per lb goal weight</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-400">{results.macros.carbs}g</div>
                <div className="text-sm text-gray-300">Carbs</div>
                <div className="text-xs text-gray-400">~45% remaining calories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{results.macros.fat}g</div>
                <div className="text-sm text-gray-300">Fat</div>
                <div className="text-xs text-gray-400">~35% remaining calories</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-center text-gray-400">
              Protein calculated based on goal weight ({inputs.goalWeight} lbs) to optimize for lean body mass preservation
            </div>
          </div>

          {/* Exercise Recommendation */}
          {results.exerciseCaloriesNeeded > 0 && (
            <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
              <div className="flex items-center mb-2">
                <Zap className="w-5 h-5 text-orange-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Additional Exercise Needed</h3>
              </div>
              <p className="text-gray-300 mb-2">
                To achieve your desired deficit safely, you need to burn an additional {results.exerciseCaloriesNeeded} calories per day through exercise.
              </p>
              <div className="text-sm text-orange-200">
                💡 This could be 30-45 minutes of moderate cardio or 20-30 minutes of high-intensity training.
              </div>
            </div>
          )}
        </div>
      )}

      {results && results.error && (
        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
          <p className="text-red-400">{results.error}</p>
        </div>
      )}
    </div>
  );
};

export default WeightLossCalculator;