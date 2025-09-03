import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Target, Activity, Scale } from 'lucide-react';

const ProfileSetup = ({ userProfile, onComplete }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    current_weight: userProfile?.current_weight || '',
    goal_weight: userProfile?.goal_weight || '',
    height_feet: userProfile?.height_feet || '',
    height_inches: userProfile?.height_inches || '',
    age: userProfile?.age || '',
    gender: userProfile?.gender || '',
    body_type: userProfile?.body_type || '',
    activity_level: userProfile?.activity_level || '',
    fitness_goal: userProfile?.fitness_goal || '',
    available_equipment: userProfile?.available_equipment || [],
    dietary_preferences: userProfile?.dietary_preferences || [],
    allergies: userProfile?.allergies || []
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleComplete = async () => {
    // Calculate daily calorie target based on profile
    const dailyCalories = calculateDailyCalories(profileData);
    
    const completeProfile = {
      ...userProfile,
      ...profileData,
      daily_calorie_target: dailyCalories,
      initial_weight: profileData.current_weight
    };
    
    onComplete(completeProfile);
  };

  const calculateDailyCalories = (data) => {
    // Basic BMR calculation (Harris-Benedict equation)
    const weight = parseFloat(data.current_weight) || 150;
    const heightInInches = (parseInt(data.height_feet) || 5) * 12 + (parseInt(data.height_inches) || 8);
    const age = parseInt(data.age) || 25;
    
    let bmr;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * weight * 0.453592) + (4.799 * heightInInches * 2.54) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight * 0.453592) + (3.098 * heightInInches * 2.54) - (4.330 * age);
    }
    
    // Activity multiplier
    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extremely_active': 1.9
    };
    
    const multiplier = activityMultipliers[data.activity_level] || 1.55;
    let tdee = bmr * multiplier;
    
    // Adjust for fitness goal
    if (data.fitness_goal === 'weight_loss') {
      tdee -= 500; // 500 calorie deficit
    } else if (data.fitness_goal === 'muscle_gain') {
      tdee += 300; // 300 calorie surplus
    }
    
    return Math.round(tdee);
  };

  const bodyTypes = [
    { value: 'ectomorph', label: 'Ectomorph', description: 'Naturally lean, fast metabolism' },
    { value: 'mesomorph', label: 'Mesomorph', description: 'Athletic build, gains muscle easily' },
    { value: 'endomorph', label: 'Endomorph', description: 'Broader frame, slower metabolism' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly_active', label: 'Lightly Active', description: '1-3 days per week' },
    { value: 'moderately_active', label: 'Moderately Active', description: '3-5 days per week' },
    { value: 'very_active', label: 'Very Active', description: '6-7 days per week' },
    { value: 'extremely_active', label: 'Extremely Active', description: 'Professional athlete level' }
  ];

  const fitnessGoals = [
    { value: 'weight_loss', label: 'Weight Loss', description: 'Lose body fat and tone up' },
    { value: 'muscle_gain', label: 'Muscle Gain', description: 'Build lean muscle mass' },
    { value: 'maintenance', label: 'Maintenance', description: 'Stay healthy and fit' },
    { value: 'athletic_performance', label: 'Athletic Performance', description: 'Improve strength and endurance' }
  ];

  const equipment = [
    'dumbbells', 'barbell', 'resistance_bands', 'kettlebells', 'pull_up_bar', 
    'yoga_mat', 'treadmill', 'stationary_bike', 'bodyweight', 'gym_membership'
  ];

  const dietaryOptions = [
    'balanced', 'low_carb', 'high_protein', 'vegetarian', 'vegan', 
    'keto', 'paleo', 'mediterranean', 'intermittent_fasting'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-300">Let's personalize your fitness experience</p>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-orange-400" />
              Basic Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Current Weight (lbs)</label>
                <input
                  type="number"
                  value={profileData.current_weight}
                  onChange={(e) => handleInputChange('current_weight', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Goal Weight (lbs)</label>
                <input
                  type="number"
                  value={profileData.goal_weight}
                  onChange={(e) => handleInputChange('goal_weight', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="140"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Height (feet)</label>
                <input
                  type="number"
                  value={profileData.height_feet}
                  onChange={(e) => handleInputChange('height_feet', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Inches</label>
                <input
                  type="number"
                  value={profileData.height_inches}
                  onChange={(e) => handleInputChange('height_inches', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="25"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-4">
                {['male', 'female'].map(gender => (
                  <button
                    key={gender}
                    onClick={() => handleInputChange('gender', gender)}
                    className={`p-3 rounded-xl border transition-all ${
                      profileData.gender === gender
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!profileData.current_weight || !profileData.goal_weight || !profileData.gender}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-orange-400" />
              Fitness Profile
            </h2>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Body Type</label>
              <div className="space-y-2">
                {bodyTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleInputChange('body_type', type.value)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      profileData.body_type === type.value
                        ? 'bg-orange-500/20 border-orange-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">{type.label}</div>
                    <div className="text-sm opacity-75">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Activity Level</label>
              <div className="space-y-2">
                {activityLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => handleInputChange('activity_level', level.value)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      profileData.activity_level === level.value
                        ? 'bg-orange-500/20 border-orange-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-sm opacity-75">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white/10 border border-white/20 text-gray-300 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!profileData.body_type || !profileData.activity_level}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-400" />
              Goals & Preferences
            </h2>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Primary Fitness Goal</label>
              <div className="space-y-2">
                {fitnessGoals.map(goal => (
                  <button
                    key={goal.value}
                    onClick={() => handleInputChange('fitness_goal', goal.value)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      profileData.fitness_goal === goal.value
                        ? 'bg-orange-500/20 border-orange-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">{goal.label}</div>
                    <div className="text-sm opacity-75">{goal.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Available Equipment (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {equipment.map(item => (
                  <button
                    key={item}
                    onClick={() => handleMultiSelect('available_equipment', item)}
                    className={`p-2 rounded-lg border text-sm transition-all ${
                      profileData.available_equipment.includes(item)
                        ? 'bg-orange-500/20 border-orange-500 text-white'
                        : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white/10 border border-white/20 text-gray-300 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!profileData.fitness_goal}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Setup
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileSetup;