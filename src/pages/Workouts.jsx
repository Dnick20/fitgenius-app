import React, { useState } from 'react';
import { Dumbbell, Play, Clock, Target, Plus, CheckCircle, RotateCcw, Flame, Trophy, Timer, Filter, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { WORKOUT_DATABASE, getWorkoutsByCategory, getWorkoutCategories } from '../data/workouts';

const Workouts = ({ userProfile, onContinue, nextPageName, isLastPage }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [showCalorieBonus, setShowCalorieBonus] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [showWeeklyPlanUpdate, setShowWeeklyPlanUpdate] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  // Get all categories from the database
  const categories = getWorkoutCategories();
  
  // Get workouts based on selected category and user preferences
  const getWorkouts = () => {
    let workouts = [];
    
    if (selectedCategory === 'all') {
      // Get workouts from user's preferred categories or all if no preferences
      const userWorkoutTypes = userProfile?.workoutTypes || [];
      if (userWorkoutTypes.length > 0) {
        userWorkoutTypes.forEach(type => {
          if (categories.includes(type)) {
            workouts.push(...getWorkoutsByCategory(type));
          }
        });
      } else {
        // Show all workouts if no preferences
        categories.forEach(category => {
          workouts.push(...getWorkoutsByCategory(category));
        });
      }
    } else {
      workouts = getWorkoutsByCategory(selectedCategory);
    }

    // Filter by difficulty if selected
    if (selectedDifficulty !== 'all') {
      workouts = workouts.filter(workout => workout.difficulty === selectedDifficulty);
    }

    // For 75 Hard users, prioritize 75hard category and longer duration workouts
    if (userProfile?.is75Hard) {
      workouts = workouts.filter(workout => 
        workout.duration >= 45 || selectedCategory === '75hard'
      );
    }

    return workouts;
  };

  const filteredWorkouts = getWorkouts();

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
    setIsWorkoutActive(true);
  };

  const completeExercise = () => {
    const newCompleted = [...completedExercises, currentExercise];
    setCompletedExercises(newCompleted);
    
    if (activeWorkout?.exercises && currentExercise < activeWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      // Workout complete - calculate burned calories
      const avgCalories = activeWorkout?.calories || Math.floor(Math.random() * 200) + 200;
      setBurnedCalories(avgCalories);
      setShowCalorieBonus(true);
      setIsWorkoutActive(false);
    }
  };

  const restartWorkout = () => {
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
    setIsWorkoutActive(true);
  };

  const toggleWorkoutSelection = (workout) => {
    const isSelected = selectedWorkouts.some(w => w.id === workout.id);
    if (isSelected) {
      setSelectedWorkouts(selectedWorkouts.filter(w => w.id !== workout.id));
    } else {
      setSelectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  const addToWeeklyPlan = () => {
    // This would integrate with the weekly plan component
    const existingPlan = JSON.parse(localStorage.getItem('weeklyWorkoutPlan') || '[]');
    const updatedPlan = [...existingPlan, ...selectedWorkouts.map(workout => ({
      ...workout,
      scheduledFor: 'user-selected',
      addedDate: new Date().toISOString()
    }))];
    
    localStorage.setItem('weeklyWorkoutPlan', JSON.stringify(updatedPlan));
    setShowWeeklyPlanUpdate(true);
    setSelectedWorkouts([]);
    
    setTimeout(() => setShowWeeklyPlanUpdate(false), 3000);
  };

  const exitWorkout = () => {
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
    setBurnedCalories(0);
    setShowCalorieBonus(false);
  };

  const addCalorieBonus = () => {
    setShowCalorieBonus(false);
    alert(`Added ${burnedCalories} calories to your daily allowance! You can now eat an extra ${burnedCalories} calories today.`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      hiit: '🔥',
      yoga: '🧘‍♀️',
      running: '🏃‍♂️',
      biking: '🚴‍♂️',
      swimming: '🏊‍♂️',
      walking: '🚶‍♂️',
      '75hard': '💪',
      cardio: '❤️',
      strength_upper: '💪',
      strength_lower: '🦵',
      core: '⭐',
      mixed_functional: '🎯',
      low_impact: '🌿'
    };
    return iconMap[category] || '🏋️‍♂️';
  };

  const toggleCardExpansion = (workoutId) => {
    setExpandedCards(prev => ({
      ...prev,
      [workoutId]: !prev[workoutId]
    }));
  };

  if (activeWorkout) {
    // Active workout view (simplified version since we don't have exercise arrays in new format)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{activeWorkout.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{activeWorkout.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <Flame className="w-4 h-4 mr-1" />
                  <span>{activeWorkout.calories} calories</span>
                </div>
              </div>
            </div>
            <button
              onClick={exitWorkout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{activeWorkout.name}</h2>
          <p className="text-gray-300 mb-6">{activeWorkout.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 rounded-xl p-4">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{activeWorkout.duration} min</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-white font-semibold">{activeWorkout.calories} cal</p>
            </div>
          </div>
          <button
            onClick={completeExercise}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center mx-auto"
          >
            <CheckCircle className="w-6 h-6 mr-2" />
            Complete Workout
          </button>
        </div>

        {/* Calorie Bonus Modal */}
        {showCalorieBonus && (
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 shadow-2xl text-center mt-6">
            <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
            <p className="text-gray-300 mb-4">You burned approximately <span className="text-orange-400 font-bold">{burnedCalories} calories</span></p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={addCalorieBonus}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Bonus Calories
              </button>
              <button
                onClick={exitWorkout}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Back to Workouts
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Workout Library
          </h1>
          <p className="text-gray-300">
            {filteredWorkouts.length} workouts across {categories.length} categories
          </p>
        </div>
      </div>

      {/* Selected Workouts Summary */}
      {selectedWorkouts.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-400/30 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold">Selected Workouts ({selectedWorkouts.length})</h3>
              <p className="text-gray-300 text-sm">
                {selectedWorkouts.map(w => w.name).join(', ')}
              </p>
            </div>
            <button
              onClick={addToWeeklyPlan}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Add to Weekly Plan
            </button>
          </div>
        </div>
      )}

      {/* Success notification */}
      {showWeeklyPlanUpdate && (
        <div className="bg-green-500/10 border border-green-400/30 p-4 rounded-xl mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="text-green-400 font-semibold">Workouts added to your weekly plan!</span>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center ${
                  selectedCategory === category
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2">
          {['all', 'Low', 'Medium', 'High'].map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Linear Workout Cards */}
      <div className="space-y-4">
        {filteredWorkouts.map(workout => {
          const isExpanded = expandedCards[workout.id];
          const isSelected = selectedWorkouts.some(w => w.id === workout.id);
          
          return (
            <div
              key={workout.id}
              className="linear-card bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <div className="linear-card-content">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">
                      <span className="text-2xl">{getCategoryIcon(selectedCategory === 'all' ? 
                        Object.keys(WORKOUT_DATABASE).find(cat => 
                          WORKOUT_DATABASE[cat].some(w => w.id === workout.id)
                        ) : selectedCategory
                      )}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-2">{workout.name}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{workout.description}</p>
                      
                      {/* Workout Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center text-blue-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{workout.duration} min</span>
                        </div>
                        <div className="flex items-center text-orange-400">
                          <Flame className="w-4 h-4 mr-1" />
                          <span>~{workout.calories} cal</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(workout.difficulty)}`}>
                          {workout.difficulty}
                        </div>
                        {workout.equipment && workout.equipment !== 'None' && (
                          <div className="flex items-center text-gray-400">
                            <Dumbbell className="w-4 h-4 mr-1" />
                            <span className="text-xs">{workout.equipment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCardExpansion(workout.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white font-medium mb-2">Workout Details</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Duration: {workout.duration} minutes</div>
                          <div>Difficulty: {workout.difficulty}</div>
                          <div>Calories: ~{workout.calories}</div>
                          {workout.equipment && <div>Equipment: {workout.equipment}</div>}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white font-medium mb-2">Perfect For</h4>
                        <div className="text-sm text-gray-300">
                          {workout.difficulty === 'Low' && 'Beginners, recovery days, gentle exercise'}
                          {workout.difficulty === 'Medium' && 'Regular fitness routine, building strength'}
                          {workout.difficulty === 'High' && 'Advanced athletes, intense challenges'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="linear-card-footer">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleWorkoutSelection(workout)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center ${
                        isSelected
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isSelected ? 'Selected' : 'Add to Plan'}
                    </button>
                    
                    <button
                      onClick={() => startWorkout(workout)}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </button>
                  </div>

                  {/* Workout Rating/Favorites (placeholder) */}
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No workouts found for the selected filters.</p>
        </div>
      )}

      {/* Continue Button */}
      {!isLastPage && onContinue && nextPageName && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue to {nextPageName} →
          </button>
        </div>
      )}
    </div>
  );
};

export default Workouts;