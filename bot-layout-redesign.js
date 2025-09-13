#!/usr/bin/env node

// Layout Redesign Bot - Phase 1
// Redesigns Weekly Plan with timeline layout and better spacing

import fs from 'fs';
import path from 'path';

class LayoutRedesignBot {
  constructor() {
    this.botName = 'Layout Redesign Bot';
    this.version = '1.0.0';
    this.startTime = Date.now();
  }

  async execute() {
    console.log(`🤖 ${this.botName} v${this.version} Starting...`);
    
    try {
      // Step 1: Redesign WeeklyPlan.jsx with timeline layout
      await this.redesignWeeklyPlan();
      
      // Step 2: Create timeline CSS components
      await this.createTimelineStyles();
      
      // Step 3: Update responsive grid system
      await this.updateGridSystem();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`✅ ${this.botName} completed in ${duration}s`);
      
      return { success: true, duration };
    } catch (error) {
      console.error(`❌ ${this.botName} failed:`, error.message);
      throw error;
    }
  }

  async redesignWeeklyPlan() {
    console.log('  📝 Redesigning WeeklyPlan.jsx with timeline layout...');
    
    const weeklyPlanPath = './src/components/WeeklyPlan.jsx';
    const newWeeklyPlan = `import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const WeeklyPlan = ({ userProfile }) => {
  const [selectedMeals, setSelectedMeals] = useState({
    monday: { breakfast: null, lunch: null, dinner: null, snack: null },
    tuesday: { breakfast: null, lunch: null, dinner: null, snack: null },
    wednesday: { breakfast: null, lunch: null, dinner: null, snack: null },
    thursday: { breakfast: null, lunch: null, dinner: null, snack: null },
    friday: { breakfast: null, lunch: null, dinner: null, snack: null },
    saturday: { breakfast: null, lunch: null, dinner: null, snack: null },
    sunday: { breakfast: null, lunch: null, dinner: null, snack: null }
  });
  
  const [selectedWorkouts, setSelectedWorkouts] = useState({
    monday: null, tuesday: null, wednesday: null, thursday: null,
    friday: null, saturday: null, sunday: null
  });
  
  const [mealOptions, setMealOptions] = useState({
    breakfast: [], lunch: [], dinner: [], snack: []
  });
  
  const [workoutOptions, setWorkoutOptions] = useState({
    cardio: [], strength: [], flexibility: [], hiit: [], yoga: [],
    pilates: [], crossfit: [], martial_arts: [], swimming: [], cycling: [], outdoor: []
  });

  const [currentMealStep, setCurrentMealStep] = useState('breakfast');
  const [currentDay, setCurrentDay] = useState('monday');
  const [showMealSelector, setShowMealSelector] = useState(false);
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const mealSteps = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    loadMealOptions();
    loadWorkoutOptions();
  }, []);

  const loadMealOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('name');
      
      if (!error && data) {
        const categorized = {
          breakfast: data.filter(m => m.category === 'breakfast'),
          lunch: data.filter(m => m.category === 'lunch'),
          dinner: data.filter(m => m.category === 'dinner'),
          snack: data.filter(m => m.category === 'snack')
        };
        setMealOptions(categorized);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const loadWorkoutOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('name');
      
      if (!error && data) {
        const categorized = data.reduce((acc, workout) => {
          if (!acc[workout.category]) acc[workout.category] = [];
          acc[workout.category].push(workout);
          return acc;
        }, {});
        setWorkoutOptions(categorized);
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const MealTimeline = () => (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-3">🍽️</span>
          Weekly Meal Plan
        </h3>
        <button
          onClick={() => setShowMealSelector(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Plan Meals
        </button>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {days.map(day => (
          <div key={day} className="border-l-4 border-emerald-500 pl-6 pb-4">
            <h4 className="text-lg font-semibold text-white capitalize mb-2">{day}</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {mealSteps.map(mealType => (
                <div key={mealType} className="bg-white/10 rounded-lg p-3 min-h-[80px]">
                  <div className="text-sm font-medium text-gray-300 mb-2 capitalize">{mealType}</div>
                  {selectedMeals[day][mealType] ? (
                    <div className="text-white text-sm">
                      <div className="font-medium">{selectedMeals[day][mealType].name}</div>
                      <div className="text-emerald-400 text-xs">{selectedMeals[day][mealType].calories} cal</div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">No {mealType} selected</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const WorkoutTimeline = () => (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-3">💪</span>
          Weekly Workout Plan
        </h3>
        <button
          onClick={() => setShowWorkoutSelector(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          Plan Workouts
        </button>
      </div>

      {/* Timeline View */}
      <div className="space-y-4">
        {days.map(day => (
          <div key={day} className="border-l-4 border-orange-500 pl-6 pb-4">
            <h4 className="text-lg font-semibold text-white capitalize mb-2">{day}</h4>
            <div className="bg-white/10 rounded-lg p-4 min-h-[100px]">
              {selectedWorkouts[day] ? (
                <div className="text-white">
                  <div className="font-medium text-lg mb-2">{selectedWorkouts[day].name}</div>
                  <div className="text-orange-400 text-sm mb-2">{selectedWorkouts[day].category} • {selectedWorkouts[day].duration} min</div>
                  <div className="text-gray-300 text-sm">{selectedWorkouts[day].description}</div>
                </div>
              ) : (
                <div className="text-gray-400 italic">No workout planned</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
          Weekly Meal & Workout Plan
        </h2>
        <p className="text-gray-300">Plan your week for optimal results</p>
      </div>

      {/* Timeline Layout */}
      <div className="space-y-8">
        <MealTimeline />
        <WorkoutTimeline />
      </div>

      {/* Meal Selector Modal */}
      {showMealSelector && (
        <MealPlanModal 
          onClose={() => setShowMealSelector(false)}
          selectedMeals={selectedMeals}
          setSelectedMeals={setSelectedMeals}
          mealOptions={mealOptions}
        />
      )}

      {/* Workout Selector Modal */}
      {showWorkoutSelector && (
        <WorkoutPlanModal
          onClose={() => setShowWorkoutSelector(false)}
          selectedWorkouts={selectedWorkouts}
          setSelectedWorkouts={setSelectedWorkouts}
          workoutOptions={workoutOptions}
        />
      )}
    </div>
  );
};

// Meal Planning Modal Component
const MealPlanModal = ({ onClose, selectedMeals, setSelectedMeals, mealOptions }) => {
  const [currentStep, setCurrentStep] = useState('breakfast');
  const [currentDay, setCurrentDay] = useState('monday');
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const steps = ['breakfast', 'lunch', 'dinner', 'snack'];

  const selectMeal = (meal) => {
    setSelectedMeals(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [currentStep]: meal
      }
    }));
  };

  const nextStep = () => {
    const currentStepIndex = steps.indexOf(currentStep);
    const currentDayIndex = days.indexOf(currentDay);
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    } else if (currentDayIndex < days.length - 1) {
      setCurrentDay(days[currentDayIndex + 1]);
      setCurrentStep('breakfast');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Plan {currentStep} for {currentDay}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mealOptions[currentStep]?.map(meal => (
              <div key={meal.id} 
                   onClick={() => selectMeal(meal)}
                   className="bg-white/10 hover:bg-emerald-500/20 border border-white/20 rounded-lg p-4 cursor-pointer transition-all">
                <h4 className="font-medium text-white mb-2">{meal.name}</h4>
                <p className="text-emerald-400 text-sm mb-2">{meal.calories} calories</p>
                <p className="text-gray-300 text-sm">{meal.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={onClose} className="bg-white/10 text-white px-6 py-2 rounded-lg">
              Cancel
            </button>
            <button onClick={nextStep} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg">
              {currentStep === 'snack' && currentDay === 'sunday' ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Workout Planning Modal Component  
const WorkoutPlanModal = ({ onClose, selectedWorkouts, setSelectedWorkouts, workoutOptions }) => {
  const [currentDay, setCurrentDay] = useState('monday');
  const [selectedCategory, setSelectedCategory] = useState('cardio');
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const categories = Object.keys(workoutOptions);

  const selectWorkout = (workout) => {
    setSelectedWorkouts(prev => ({
      ...prev,
      [currentDay]: workout
    }));
  };

  const nextDay = () => {
    const currentIndex = days.indexOf(currentDay);
    if (currentIndex < days.length - 1) {
      setCurrentDay(days[currentIndex + 1]);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-white/20 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Plan workout for {currentDay}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={\`px-4 py-2 rounded-lg capitalize transition-all \${
                  selectedCategory === category 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }\`}
              >
                {category.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {workoutOptions[selectedCategory]?.map(workout => (
              <div key={workout.id} 
                   onClick={() => selectWorkout(workout)}
                   className="bg-white/10 hover:bg-orange-500/20 border border-white/20 rounded-lg p-4 cursor-pointer transition-all">
                <h4 className="font-medium text-white mb-2">{workout.name}</h4>
                <p className="text-orange-400 text-sm mb-2">{workout.duration} minutes • {workout.difficulty}</p>
                <p className="text-gray-300 text-sm mb-2">{workout.description}</p>
                <div className="text-xs text-gray-400">
                  {workout.exercises?.slice(0, 3).map(ex => ex.name).join(', ')}
                  {workout.exercises?.length > 3 && '...'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={onClose} className="bg-white/10 text-white px-6 py-2 rounded-lg">
              Cancel
            </button>
            <button onClick={nextDay} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
              {currentDay === 'sunday' ? 'Finish' : 'Next Day'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlan;`;

    fs.writeFileSync(weeklyPlanPath, newWeeklyPlan);
    console.log('  ✅ WeeklyPlan.jsx redesigned with timeline layout');
  }

  async createTimelineStyles() {
    console.log('  🎨 Creating timeline CSS components...');
    
    const timelineStylesPath = './src/styles/timeline.css';
    const timelineStyles = `/* Timeline Components */
.timeline-container {
  position: relative;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  padding-bottom: 1.5rem;
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.timeline-item:hover {
  border-left-width: 6px;
}

.timeline-item-meal {
  border-left-color: #10b981; /* emerald-500 */
}

.timeline-item-workout {
  border-left-color: #f97316; /* orange-500 */
}

.timeline-marker {
  position: absolute;
  left: -0.75rem;
  top: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.timeline-marker-meal {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.timeline-marker-workout {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
}

/* Responsive Timeline */
@media (max-width: 768px) {
  .timeline-item {
    padding-left: 1.5rem;
    border-left-width: 3px;
  }
  
  .timeline-marker {
    left: -0.625rem;
    width: 1.25rem;
    height: 1.25rem;
    font-size: 0.625rem;
  }
}

/* Linear Layout Cards */
.linear-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.linear-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.linear-card-expandable {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.linear-card-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.linear-card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Grid Improvements */
.responsive-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}`;

    fs.writeFileSync(timelineStylesPath, timelineStyles);
    console.log('  ✅ Timeline CSS components created');
  }

  async updateGridSystem() {
    console.log('  📐 Updating responsive grid system...');
    
    // Update main CSS file to include timeline styles
    const mainCssPath = './src/index.css';
    const importStatement = '\n@import "./styles/timeline.css";\n';
    
    try {
      let mainCss = fs.readFileSync(mainCssPath, 'utf8');
      if (!mainCss.includes('timeline.css')) {
        mainCss += importStatement;
        fs.writeFileSync(mainCssPath, mainCss);
      }
      console.log('  ✅ Grid system updated');
    } catch (error) {
      console.log('  ⚠️  Main CSS file not found, timeline styles included in component');
    }
  }
}

// Execute bot if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const bot = new LayoutRedesignBot();
  bot.execute()
    .then(result => {
      console.log('Bot execution completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Bot execution failed:', error);
      process.exit(1);
    });
}

export default LayoutRedesignBot;