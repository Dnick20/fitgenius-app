import React, { useState } from 'react';

function SimpleApp() {
  const [currentView, setCurrentView] = useState('welcome');
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: 'lose_weight',
    activityLevel: 'moderate'
  });

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
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
                Create Your Profile
              </h2>
              <p className="text-gray-300">Let's set up your personalized fitness journey!</p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="70"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({...profileData, weight: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    placeholder="175"
                    value={profileData.height}
                    onChange={(e) => setProfileData({...profileData, height: e.target.value})}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fitness Goal</label>
                <select 
                  value={profileData.fitnessGoal}
                  onChange={(e) => setProfileData({...profileData, fitnessGoal: e.target.value})}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="lose_weight">Lose Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="get_fit">Get Fit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
                <select 
                  value={profileData.activityLevel}
                  onChange={(e) => setProfileData({...profileData, activityLevel: e.target.value})}
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
            
            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentView('welcome')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-4 rounded-xl transition-all duration-300"
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  console.log('Profile completed - going to dashboard');
                  setCurrentView('dashboard');
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

  if (currentView === 'dashboard') {
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
                Welcome back, {profileData.name || 'Demo User'}! 💪
              </h1>
              <p className="text-gray-300 text-lg">Here's your fitness journey overview</p>
            </header>

            {/* Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Current Weight */}
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Current Weight</h3>
                  <span className="text-emerald-400">🎯</span>
                </div>
                <div className="text-2xl font-bold text-white">{profileData.weight || '75'} kg</div>
                <p className="text-emerald-400 text-sm">-2.3 kg from start</p>
              </div>

              {/* Goal Progress */}
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Goal Progress</h3>
                  <span className="text-blue-400">🏆</span>
                </div>
                <div className="text-2xl font-bold text-white">32%</div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>

              {/* Daily Calories */}
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Daily Calories</h3>
                  <span className="text-orange-400">🔥</span>
                </div>
                <div className="text-2xl font-bold text-white">2200</div>
                <p className="text-sm text-gray-400">Target per day</p>
              </div>

              {/* Energy Level */}
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-300">Energy Level</h3>
                  <span className="text-yellow-400">⚡</span>
                </div>
                <div className="text-2xl font-bold text-white">8.2/10</div>
                <p className="text-sm text-gray-400">Average this week</p>
              </div>
            </div>

            {/* AI Actions */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">🍽️</span> AI Meal Plan
                </h2>
                <p className="text-gray-300 mb-4">Get personalized nutrition for {profileData.fitnessGoal?.replace('_', ' ') || 'your goals'}</p>
                <button 
                  onClick={() => alert('AI Meal Plan feature coming soon!')}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Generate Meal Plan
                </button>
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-3">💪</span> AI Workout Plan
                </h2>
                <p className="text-gray-300 mb-4">Get {profileData.activityLevel || 'moderate'} intensity workouts tailored to your level</p>
                <button 
                  onClick={() => alert('AI Workout Plan feature coming soon!')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl transition-all duration-300"
                >
                  Generate Workout Plan
                </button>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentView('welcome')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
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
              console.log('Get Started clicked - changing to profile view');
              setCurrentView('profile');
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Get Started
          </button>
          <button 
            onClick={() => {
              console.log('Demo clicked - changing to dashboard view');
              setCurrentView('dashboard');
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

export default SimpleApp;