import React, { useState } from 'react';
import { Target, Weight, Flame, TrendingUp, Calendar, Trophy, Heart, Zap, ArrowRight, Utensils, Dumbbell, User, Activity, Calculator, ChevronLeft, ChevronRight, MessageCircle, Loader } from 'lucide-react';
import OpenAIService from './services/openai';
import { validateProfile, sanitizeInput } from './utils/validation';

// Profile Setup Component
const ProfileSetup = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    goal: 'lose_weight',
    goalWeight: ''
  });

  const handleInputChange = (field, value) => {
    // Sanitize input and update
    const sanitized = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitized }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const stepFields = {
      1: ['name', 'email', 'age', 'gender'],
      2: ['height', 'weight'],
      3: ['activityLevel', 'goal']
    };
    
    const validation = validateProfile(formData);
    const currentStepErrors = {};
    
    stepFields[step].forEach(field => {
      if (validation.errors[field]) {
        currentStepErrors[field] = validation.errors[field];
      }
    });
    
    setErrors(currentStepErrors);
    return Object.keys(currentStepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    const validation = validateProfile(formData);
    if (validation.isValid) {
      onComplete(formData);
    } else {
      setErrors(validation.errors);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
          Create Your Profile
        </h2>
        <p className="text-gray-300">Step {step} of 3 - Let's personalize your fitness journey</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500" style={{width: `${(step/3)*100}%`}}></div>
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full p-4 bg-white/10 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-4 bg-white/10 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="25"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Physical Stats */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="175"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="70"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (light exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
              <option value="active">Active (hard exercise 6-7 days/week)</option>
              <option value="very_active">Very Active (physical job + exercise)</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Goals */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">Primary Goal</label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'lose_weight', label: 'Lose Weight', icon: '📉' },
                { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪' },
                { value: 'maintain', label: 'Maintain Weight', icon: '⚖️' },
                { value: 'get_fit', label: 'Get Fit', icon: '🏃' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleInputChange('goal', goal.value)}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                    formData.goal === goal.value
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {(formData.goal === 'lose_weight' || formData.goal === 'gain_muscle') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={formData.goalWeight}
                onChange={(e) => handleInputChange('goalWeight', e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="65"
              />
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all duration-300"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        
        <div className="flex-1"></div>
        
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && (!formData.name || !formData.email || !formData.age)) ||
              (step === 2 && (!formData.height || !formData.weight))
            }
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!formData.goal}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calculator className="w-4 h-4" />
            Complete Setup
          </button>
        )}
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState('welcome'); // welcome, profile, dashboard
  const [userProfile, setUserProfile] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  console.log('App render - currentView:', currentView, 'userProfile:', userProfile);
  
  // Handle sign in - simplified
  const handleSignIn = (profile) => {
    console.log('handleSignIn called with profile:', profile);
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  // Calculate daily calories based on activity level
  const calculateDailyCalories = (bmr, activityLevel) => {
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return Math.round(bmr * activityMultipliers[activityLevel]);
  };

  // Handle profile setup completion
  const handleProfileSetup = (profileData) => {
    const bmr = calculateBMR(
      profileData.weight, 
      profileData.height, 
      profileData.age, 
      profileData.gender
    );
    const dailyCalories = calculateDailyCalories(bmr, profileData.activityLevel);
    
    const completeProfile = {
      ...profileData,
      bmr,
      dailyCalories,
      startWeight: profileData.weight,
      currentWeight: profileData.weight,
      joinDate: new Date().toISOString()
    };
    
    setUserProfile(completeProfile);
    setCurrentView('dashboard');
  };

  // AI Integration Functions
  const handleGetMealPlan = async () => {
    setAiLoading(true);
    try {
      const result = await OpenAIService.getMealRecommendations(userProfile);
      setAiResponse({
        type: 'meal',
        title: 'Your Personalized Meal Plan',
        content: result.success ? result.data : result.fallback
      });
      setShowAiModal(true);
    } catch (error) {
      console.error('Error getting meal plan:', error);
      setAiResponse({
        type: 'error',
        title: 'Error',
        content: 'Sorry, there was an error generating your meal plan. Please try again later.'
      });
      setShowAiModal(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetWorkoutPlan = async () => {
    setAiLoading(true);
    try {
      const result = await OpenAIService.getWorkoutRecommendations(userProfile);
      setAiResponse({
        type: 'workout',
        title: 'Your Personalized Workout Plan',
        content: result.success ? result.data : result.fallback
      });
      setShowAiModal(true);
    } catch (error) {
      console.error('Error getting workout plan:', error);
      setAiResponse({
        type: 'error',
        title: 'Error',
        content: 'Sorry, there was an error generating your workout plan. Please try again later.'
      });
      setShowAiModal(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAskAI = async () => {
    setAiLoading(true);
    try {
      const result = await OpenAIService.askFitnessAI(
        `I'm a ${userProfile.age}-year-old ${userProfile.gender} trying to ${userProfile.goal}. I'm ${userProfile.height}cm tall and weigh ${userProfile.weight}kg. What's the most important advice you can give me for achieving my goals?`,
        userProfile
      );
      setAiResponse({
        type: 'advice',
        title: 'AI Coach Advice',
        content: result.success ? result.data : 'Sorry, I cannot provide advice at the moment. Please ensure you have a stable internet connection and try again.'
      });
      setShowAiModal(true);
    } catch (error) {
      console.error('Error getting AI advice:', error);
      setAiResponse({
        type: 'error',
        title: 'Error',
        content: 'Sorry, there was an error getting AI advice. Please try again later.'
      });
      setShowAiModal(true);
    } finally {
      setAiLoading(false);
    }
  };

  // Profile Setup View
  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-2xl px-6">
          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-4">
              Create Your Profile
            </h2>
            <p className="text-gray-300 mb-6">Let's set up your personalized fitness journey!</p>
            
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('welcome')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-4 rounded-xl transition-all duration-300"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  handleProfileSetup({
                    name: 'New User',
                    email: 'user@example.com',
                    age: 25,
                    gender: 'male',
                    height: 175,
                    weight: 70,
                    activityLevel: 'moderate',
                    goal: 'lose_weight',
                    goalWeight: 65
                  });
                }}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
              >
                Complete Setup →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Beautiful welcome screen with Tailwind
  if (currentView === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>
        
        <div className="relative z-20 text-center max-w-2xl px-6">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <span className="text-4xl">🏋️</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-4">
              FitGenius
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your AI-powered fitness companion that transforms your workout experience with personalized training and nutrition guidance.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                console.log('GET STARTED CLICKED - Opening Profile Setup');
                setCurrentView('profile');
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              🚀 Get Started
            </button>
            <button 
              onClick={() => {
                console.log('DEMO CLICKED - Signing in with demo data');
                handleSignIn({ 
                  name: 'Demo User', 
                  email: 'demo@example.com', 
                  weight: 75, 
                  startWeight: 77.3, 
                  currentWeight: 75, 
                  height: 175, 
                  age: 30, 
                  gender: 'male', 
                  activityLevel: 'moderate', 
                  dailyCalories: 2200, 
                  bmr: 1800, 
                  goalWeight: 70, 
                  goal: 'lose_weight' 
                });
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Try Demo Version
            </button>
            <p className="text-sm text-gray-400 mt-4 text-center">No signup required • Full access to all features</p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View - show when user is logged in
  if (currentView === 'dashboard' && userProfile) {
    console.log('Rendering Dashboard for user:', userProfile.name);
    
    const startWeight = userProfile.startWeight || userProfile.weight;
  const currentWeight = userProfile.currentWeight || userProfile.weight;
  const goalWeight = userProfile.goalWeight || userProfile.weight - 10;
  const weightChange = currentWeight - startWeight;
  const goalProgress = Math.max(0, Math.min(100, Math.round(((startWeight - currentWeight) / Math.abs(startWeight - goalWeight)) * 100))) || 0;
  
  const stats = {
    currentWeight,
    goalWeight,
    weightChange,
    goalProgress,
    dailyCalories: userProfile.dailyCalories,
    workoutsThisWeek: userProfile.workoutsThisWeek || 4,
    avgEnergyLevel: userProfile.avgEnergyLevel || 8.2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
              Welcome back, {userProfile.name}! 💪
            </h1>
            <p className="text-gray-300 text-lg">Here's your fitness journey overview</p>
          </header>

          {/* Progress Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Weight */}
            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
                <Target className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.currentWeight} lbs</div>
              <p className={`text-sm ${stats.weightChange < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.weightChange < 0 ? '' : '+'}{stats.weightChange} lbs from start
              </p>
            </div>

            {/* Goal Progress */}
            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Goal Progress</h3>
                <Trophy className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.goalProgress}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: `${stats.goalProgress}%`}}></div>
              </div>
            </div>

            {/* Daily Calories */}
            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Daily Calories</h3>
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.dailyCalories}</div>
              <p className="text-sm text-gray-400">Target per day</p>
            </div>

            {/* Energy Level */}
            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Energy Level</h3>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.avgEnergyLevel}/10</div>
              <p className="text-sm text-gray-400">Average this week</p>
            </div>
          </div>

          {/* Main Content Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Today's Plan */}
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-400" />
                <h2 className="text-xl font-bold text-white">Today's Plan</h2>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
                  <h4 className="font-semibold text-emerald-400 mb-2">Morning Workout</h4>
                  <p className="text-white">Full Body Strength Training</p>
                  <p className="text-gray-400 text-sm">45 min • Upper body focus</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <h4 className="font-semibold text-purple-400 mb-2">Meal Plan</h4>
                  <p className="text-white">High Protein, Balanced</p>
                  <p className="text-gray-400 text-sm">{stats.dailyCalories} calories • 140g protein</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleGetMealPlan}
                    disabled={aiLoading}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? <Loader className="mr-2 w-4 h-4 animate-spin" /> : <Utensils className="mr-2 w-4 h-4" />}
                    AI Meal Plan
                  </button>
                  <button 
                    onClick={handleGetWorkoutPlan}
                    disabled={aiLoading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? <Loader className="mr-2 w-4 h-4 animate-spin" /> : <Dumbbell className="mr-2 w-4 h-4" />}
                    AI Workout Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-orange-400">Update Weight</h4>
                      <p className="text-gray-300 text-sm">Log your current weight</p>
                    </div>
                    <Weight className="w-5 h-5 text-orange-400" />
                  </div>
                </button>

                <button className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all duration-300 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-400">Progress Photos</h4>
                      <p className="text-gray-300 text-sm">Capture your transformation</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-400" />
                  </div>
                </button>

                <button 
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-purple-400">AI Coach</h4>
                      <p className="text-gray-300 text-sm">{aiLoading ? 'Getting advice...' : 'Get personalized advice'}</p>
                    </div>
                    {aiLoading ? <Loader className="w-5 h-5 text-purple-400 animate-spin" /> : <MessageCircle className="w-5 h-5 text-purple-400" />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setUserProfile(null);
                setCurrentView('welcome');
              }}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* AI Response Modal */}
      {showAiModal && aiResponse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                {aiResponse.title}
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300"
              >
                <span className="text-white text-lg">&times;</span>
              </button>
            </div>
            
            <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {aiResponse.content}
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  }

  // Default return - should not reach here
  return <div>Loading...</div>;
}

export default App;