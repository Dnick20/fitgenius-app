import React, { useState } from 'react';
import { Calendar, ChefHat, Dumbbell, Clock, Flame, Target, Users, CheckCircle, Plus, ArrowLeft, ArrowRight } from 'lucide-react';
import { calculateUniversalNutrition, formatNutritionDisplay } from '../utils/nutritionCalculator';

const WeeklyPlan = ({ userProfile, onClose }) => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [completedItems, setCompletedItems] = useState(new Set());

  // Get universal nutrition data
  const nutrition = calculateUniversalNutrition(userProfile);
  const nutritionDisplay = formatNutritionDisplay(nutrition);
  
  const dailyCalories = nutrition.dailyCalories;
  const dailyProtein = nutrition.dailyProtein;
  
  // Use universal meal distribution
  const mealCalories = nutrition.mealDistribution;
  const mealProtein = nutrition.proteinDistribution;

  // Get meals from localStorage (selected from Meals page) or use defaults
  const getWeeklyMealPlan = () => {
    const savedMeals = JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    // Default/fallback meals if no selections made
    const defaultMeals = {
      breakfast: [
        'Greek Yogurt Parfait', 'Avocado Toast', 'Protein Smoothie', 'Oatmeal Bowl',
        'Veggie Scramble', 'Overnight Oats', 'Breakfast Quinoa'
      ],
      lunch: [
        'Grilled Chicken Salad', 'Quinoa Buddha Bowl', 'Turkey Wrap', 'Mediterranean Bowl',
        'Salmon & Vegetables', 'Lentil Soup', 'Tuna Poke Bowl'
      ],
      dinner: [
        'Baked Salmon', 'Chicken Stir-fry', 'Turkey Meatballs', 'Veggie Pasta',
        'Grilled Steak', 'Fish Tacos', 'Stuffed Bell Peppers'
      ],
      snack: [
        'Apple & Almonds', 'Greek Yogurt', 'Protein Bar', 'Hummus & Veggies',
        'Trail Mix', 'Cottage Cheese', 'Berries & Nuts'
      ]
    };

    return days.map((day, dayIndex) => {
      const dayMeals = mealTypes.map((type, typeIndex) => {
        // Try to find a saved meal for this day and meal type
        const savedMeal = savedMeals.find(meal => 
          meal.category === type && 
          Math.floor(savedMeals.indexOf(meal) / mealTypes.length) === dayIndex % Math.ceil(savedMeals.length / mealTypes.length)
        );

        if (savedMeal) {
          return {
            type,
            name: savedMeal.name,
            calories: savedMeal.calories || mealCalories[type],
            protein: savedMeal.protein || mealProtein[type],
            time: type === 'breakfast' ? '8:00 AM' :
                  type === 'lunch' ? '12:30 PM' :
                  type === 'dinner' ? '6:30 PM' : '3:00 PM',
            isSelected: true // Mark as selected from meals page
          };
        }

        // Use default meal if no saved selection
        return {
          type,
          name: defaultMeals[type][(dayIndex + typeIndex) % defaultMeals[type].length],
          calories: mealCalories[type],
          protein: mealProtein[type],
          time: type === 'breakfast' ? '8:00 AM' :
                type === 'lunch' ? '12:30 PM' :
                type === 'dinner' ? '6:30 PM' : '3:00 PM',
          isSelected: false // Default meal
        };
      });

      return { day, meals: dayMeals };
    });
  };

  // Get workouts from localStorage (selected from Workouts page) or use defaults
  const getWeeklyWorkoutPlan = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem('weeklyWorkoutPlan') || '[]');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Default workouts based on user goals
    const defaultWorkouts = {
      lose_weight: [
        { name: 'HIIT Cardio', duration: '25 mins', type: 'cardio', calories: '300-400' },
        { name: 'Upper Body Strength', duration: '30 mins', type: 'strength', calories: '200-300' },
        { name: 'Full Body HIIT', duration: '35 mins', type: 'mixed', calories: '350-450' },
        { name: 'Lower Body Power', duration: '40 mins', type: 'strength', calories: '250-350' },
        { name: 'Cardio Dance', duration: '45 mins', type: 'cardio', calories: '400-500' },
        { name: 'Total Body Burn', duration: '30 mins', type: 'mixed', calories: '300-400' },
        { name: 'Active Recovery', duration: '20 mins', type: 'recovery', calories: '100-150' }
      ],
      gain_muscle: [
        { name: 'Chest & Triceps', duration: '50 mins', type: 'strength', calories: '250-350' },
        { name: 'Back & Biceps', duration: '45 mins', type: 'strength', calories: '250-350' },
        { name: 'Leg Day', duration: '60 mins', type: 'strength', calories: '300-450' },
        { name: 'Shoulders & Core', duration: '40 mins', type: 'strength', calories: '200-300' },
        { name: 'Full Body Power', duration: '50 mins', type: 'strength', calories: '300-400' },
        { name: 'Cardio & Abs', duration: '30 mins', type: 'mixed', calories: '250-350' },
        { name: 'Rest & Stretch', duration: '15 mins', type: 'recovery', calories: '50-100' }
      ]
    };

    const defaultPlan = defaultWorkouts[userProfile?.goal] || defaultWorkouts.lose_weight;
    
    return days.map((day, index) => {
      // Try to find a saved workout for this day
      const savedWorkout = savedWorkouts[index] || savedWorkouts[index % savedWorkouts.length];
      
      if (savedWorkout) {
        return {
          day,
          workout: {
            name: savedWorkout.name,
            duration: savedWorkout.duration || savedWorkout.estimatedDuration || '30 mins',
            type: savedWorkout.category || savedWorkout.type || 'mixed',
            calories: savedWorkout.caloriesBurned || '200-300',
            time: index < 5 ? '6:00 AM' : '9:00 AM',
            isSelected: true // Mark as selected from workouts page
          }
        };
      }

      // Use default workout if no saved selection
      return {
        day,
        workout: {
          ...defaultPlan[index],
          time: index < 5 ? '6:00 AM' : '9:00 AM',
          isSelected: false // Default workout
        }
      };
    });
  };

  const weeklyMeals = getWeeklyMealPlan();
  const weeklyWorkouts = getWeeklyWorkoutPlan();

  const toggleComplete = (itemId) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const getWeekDates = (weekOffset = 0) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Start from Monday
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates(currentWeek);
  const totalCaloriesPerDay = dailyCalories;
  const totalProteinPerDay = dailyProtein;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
              Weekly Meal & Workout Plan
            </h1>
            <p className="text-gray-300">Your personalized 7-day fitness journey</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <p className="text-white font-semibold">
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
              {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
            <p className="text-sm text-gray-400">
              {currentWeek === 0 ? 'This Week' : currentWeek > 0 ? `${currentWeek} week${currentWeek > 1 ? 's' : ''} ahead` : `${Math.abs(currentWeek)} week${Math.abs(currentWeek) > 1 ? 's' : ''} ago`}
            </p>
          </div>
          <button
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Help Text and Actions */}
      <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10 mb-8 flex items-center justify-between">
        <div className="text-sm text-gray-300">
          <span className="text-green-400">★</span> Selected meals from Meals page • 
          <span className="text-blue-400 ml-2">★</span> Selected workouts from Workouts page
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem('weeklyMealPlan');
            localStorage.removeItem('weeklyWorkoutPlan');
            // Force re-render by updating state
            setCompletedItems(new Set());
          }}
          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
        >
          Clear Selections
        </button>
      </div>

      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Daily Calories</p>
              <p className="text-xl font-bold text-white">{totalCaloriesPerDay}</p>
            </div>
            <Flame className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Daily Protein</p>
              <p className="text-xl font-bold text-white">{totalProteinPerDay}g</p>
            </div>
            <Target className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Weekly Workouts</p>
              <p className="text-xl font-bold text-white">7</p>
            </div>
            <Dumbbell className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Meal Prep</p>
              <p className="text-xl font-bold text-white">28</p>
            </div>
            <ChefHat className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-xl font-bold text-white">{completedItems.size}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weeklyMeals.map((dayData, dayIndex) => {
          const workoutData = weeklyWorkouts[dayIndex];
          const date = weekDates[dayIndex];
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={dayData.day}
              className={`bg-black/40 backdrop-blur-xl rounded-2xl border shadow-2xl p-4 ${
                isToday ? 'border-orange-500/50 bg-orange-500/5' : 'border-white/20'
              }`}
            >
              {/* Day Header */}
              <div className="text-center mb-4">
                <h3 className={`font-semibold ${isToday ? 'text-orange-400' : 'text-white'}`}>
                  {dayData.day}
                </h3>
                <p className="text-xs text-gray-400">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                {isToday && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full mx-auto mt-1"></div>
                )}
              </div>

              {/* Workout */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-300 flex items-center">
                    <Dumbbell className="w-3 h-3 mr-1" />
                    Workout
                  </h4>
                  <button
                    onClick={() => toggleComplete(`workout-${dayIndex}`)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <CheckCircle className={`w-4 h-4 ${
                      completedItems.has(`workout-${dayIndex}`) 
                        ? 'text-green-400 fill-current' 
                        : 'text-gray-400'
                    }`} />
                  </button>
                </div>
                <div className={`rounded-lg p-3 mb-2 ${workoutData.workout.isSelected ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5'}`}>
                  <div className="flex items-center">
                    <p className="text-white text-sm font-medium">{workoutData.workout.name}</p>
                    {workoutData.workout.isSelected && <span className="ml-1 text-xs text-blue-400">★</span>}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{workoutData.workout.time}</span>
                    <span>{workoutData.workout.duration}</span>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 flex items-center mb-2">
                  <ChefHat className="w-3 h-3 mr-1" />
                  Meals ({totalCaloriesPerDay} cal • {totalProteinPerDay}g protein)
                </h4>
                <div className="space-y-2">
                  {dayData.meals.map((meal, mealIndex) => {
                    const mealId = `meal-${dayIndex}-${mealIndex}`;
                    return (
                      <div key={mealIndex} className={`rounded-lg p-2 ${meal.isSelected ? 'bg-green-500/10 border border-green-500/20' : 'bg-white/5'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <p className="text-white text-xs font-medium">{meal.name}</p>
                              {meal.isSelected && <span className="ml-1 text-xs text-green-400">★</span>}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span className="capitalize">{meal.type}</span>
                              <span>{meal.calories} cal • {meal.protein}g protein</span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleComplete(mealId)}
                            className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                          >
                            <CheckCircle className={`w-3 h-3 ${
                              completedItems.has(mealId) 
                                ? 'text-green-400 fill-current' 
                                : 'text-gray-400'
                            }`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Summary */}
      <div className="mt-8 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Weekly Goals & Tips
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-orange-400 mb-2">This Week's Focus</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Stay consistent with your meal timing</li>
              <li>• Drink 8 glasses of water daily</li>
              <li>• Complete all scheduled workouts</li>
              <li>• Get 7-9 hours of sleep each night</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-400 mb-2">Success Tips</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Prep meals on Sunday for the week</li>
              <li>• Set workout reminders on your phone</li>
              <li>• Track your progress daily</li>
              <li>• Celebrate small wins along the way</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlan;