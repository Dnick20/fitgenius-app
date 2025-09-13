#!/usr/bin/env node

// Meal Flow Bot - Phase 3
// Creates structured meal selection flow: Breakfast → Lunch → Dinner → Snacks

import fs from 'fs';

class MealFlowBot {
  constructor() {
    this.botName = 'Meal Flow Bot';
    this.startTime = Date.now();
  }

  async execute() {
    console.log(`🤖 ${this.botName} Starting...`);
    
    try {
      await this.createMealFlowComponent();
      await this.updateMealDatabase();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`✅ ${this.botName} completed in ${duration}s`);
      return { success: true, duration };
    } catch (error) {
      console.error(`❌ ${this.botName} failed:`, error.message);
      throw error;
    }
  }

  async createMealFlowComponent() {
    console.log('  🍽️ Creating structured meal flow component...');
    
    const mealFlowComponent = `import React, { useState, useEffect } from 'react';

const MealFlowSelector = ({ onComplete, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: initialData.breakfast || null,
    lunch: initialData.lunch || null,
    dinner: initialData.dinner || null,
    snack: initialData.snack || null
  });
  
  const steps = [
    { key: 'breakfast', title: 'Start Your Day', emoji: '🌅', color: 'from-yellow-500 to-orange-500' },
    { key: 'lunch', title: 'Midday Fuel', emoji: '☀️', color: 'from-orange-500 to-red-500' },
    { key: 'dinner', title: 'Evening Nourishment', emoji: '🌙', color: 'from-purple-500 to-indigo-500' },
    { key: 'snack', title: 'Perfect Snack', emoji: '🥨', color: 'from-green-500 to-emerald-500' }
  ];

  const mealOptions = {
    breakfast: [
      { id: 1, name: 'Greek Yogurt Bowl', calories: 250, protein: 20, carbs: 30, fat: 8 },
      { id: 2, name: 'Avocado Toast', calories: 300, protein: 12, carbs: 35, fat: 18 },
      // ... more options
    ],
    lunch: [
      { id: 1, name: 'Quinoa Salad', calories: 400, protein: 15, carbs: 45, fat: 20 },
      { id: 2, name: 'Grilled Chicken Wrap', calories: 450, protein: 35, carbs: 40, fat: 15 },
      // ... more options  
    ],
    dinner: [
      { id: 1, name: 'Salmon & Vegetables', calories: 500, protein: 40, carbs: 25, fat: 28 },
      { id: 2, name: 'Turkey Meatballs', calories: 420, protein: 35, carbs: 30, fat: 18 },
      // ... more options
    ],
    snack: [
      { id: 1, name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fat: 16 },
      { id: 2, name: 'Apple with Peanut Butter', calories: 200, protein: 8, carbs: 25, fat: 10 },
      // ... more options
    ]
  };

  const selectMeal = (meal) => {
    const stepKey = steps[currentStep].key;
    setSelectedMeals(prev => ({
      ...prev,
      [stepKey]: meal
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(selectedMeals);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const currentMealType = currentStepData.key;
  const selectedMeal = selectedMeals[currentMealType];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all \${
                index <= currentStep 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                  : 'bg-gray-600 text-gray-300'
              }\`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={\`flex-1 h-1 mx-4 rounded \${
                  index < currentStep ? 'bg-emerald-500' : 'bg-gray-600'
                }\`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <p className="text-gray-400">Step {currentStep + 1} of {steps.length}</p>
        </div>
      </div>

      {/* Current Step */}
      <div className="text-center mb-8">
        <div className={\`text-6xl mb-4 inline-block p-4 rounded-2xl bg-gradient-to-r \${currentStepData.color} bg-opacity-20\`}>
          {currentStepData.emoji}
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {currentStepData.title}
        </h2>
        <p className="text-gray-300 capitalize">
          Choose your {currentMealType}
        </p>
      </div>

      {/* Meal Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mealOptions[currentMealType]?.map(meal => (
          <div
            key={meal.id}
            onClick={() => selectMeal(meal)}
            className={\`p-4 rounded-xl border-2 cursor-pointer transition-all \${
              selectedMeal?.id === meal.id
                ? 'border-emerald-500 bg-emerald-500/20'
                : 'border-white/20 bg-white/10 hover:bg-white/20'
            }\`}
          >
            <h3 className="font-semibold text-white mb-2">{meal.name}</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>🔥 {meal.calories} calories</p>
              <p>💪 {meal.protein}g protein</p>
              <div className="flex justify-between">
                <span>🌾 {meal.carbs}g carbs</span>
                <span>🥑 {meal.fat}g fat</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <button
          onClick={nextStep}
          disabled={!selectedMeal}
          className={\`px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed \${
            currentStep === steps.length - 1
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          }\`}
        >
          {currentStep === steps.length - 1 ? 'Complete Plan' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default MealFlowSelector;`;

    fs.writeFileSync('./src/components/MealFlowSelector.jsx', mealFlowComponent);
    console.log('  ✅ Meal flow component created');
  }

  async updateMealDatabase() {
    console.log('  📊 Updating meal database with structured categories...');
    
    const mealDatabase = `// Enhanced Meal Database with Structured Flow
export const MEAL_DATABASE = {
  breakfast: [
    { id: 'b1', name: 'Greek Yogurt Parfait', calories: 250, protein: 20, carbs: 30, fat: 8, description: 'Creamy yogurt with berries and granola' },
    { id: 'b2', name: 'Avocado Toast', calories: 300, protein: 12, carbs: 35, fat: 18, description: 'Whole grain toast with fresh avocado' },
    { id: 'b3', name: 'Protein Smoothie Bowl', calories: 280, protein: 25, carbs: 28, fat: 10, description: 'Blended fruits with protein powder' },
    { id: 'b4', name: 'Overnight Oats', calories: 320, protein: 15, carbs: 45, fat: 12, description: 'Oats soaked with milk and toppings' },
    { id: 'b5', name: 'Egg White Scramble', calories: 200, protein: 24, carbs: 8, fat: 8, description: 'Fluffy egg whites with vegetables' }
  ],
  lunch: [
    { id: 'l1', name: 'Quinoa Power Bowl', calories: 400, protein: 15, carbs: 45, fat: 20, description: 'Quinoa with roasted vegetables' },
    { id: 'l2', name: 'Grilled Chicken Wrap', calories: 450, protein: 35, carbs: 40, fat: 15, description: 'Lean chicken in whole wheat wrap' },
    { id: 'l3', name: 'Mediterranean Salad', calories: 380, protein: 18, carbs: 25, fat: 25, description: 'Fresh greens with feta and olives' },
    { id: 'l4', name: 'Turkey & Hummus Bowl', calories: 420, protein: 30, carbs: 35, fat: 18, description: 'Sliced turkey with creamy hummus' },
    { id: 'l5', name: 'Veggie Stir-fry', calories: 350, protein: 12, carbs: 50, fat: 14, description: 'Colorful vegetables with brown rice' }
  ],
  dinner: [
    { id: 'd1', name: 'Baked Salmon Filet', calories: 500, protein: 40, carbs: 25, fat: 28, description: 'Omega-rich salmon with sweet potato' },
    { id: 'd2', name: 'Lean Beef Stir-fry', calories: 480, protein: 38, carbs: 30, fat: 22, description: 'Tender beef with mixed vegetables' },
    { id: 'd3', name: 'Chicken Breast Dinner', calories: 420, protein: 45, carbs: 25, fat: 15, description: 'Grilled chicken with quinoa' },
    { id: 'd4', name: 'Vegetarian Curry', calories: 380, protein: 15, carbs: 50, fat: 18, description: 'Protein-rich lentil curry' },
    { id: 'd5', name: 'Turkey Meatballs', calories: 440, protein: 35, carbs: 30, fat: 20, description: 'Lean turkey with marinara sauce' }
  ],
  snack: [
    { id: 's1', name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 8, fat: 16, description: 'Almonds, walnuts, and cashews' },
    { id: 's2', name: 'Apple & Peanut Butter', calories: 200, protein: 8, carbs: 25, fat: 10, description: 'Crisp apple with natural PB' },
    { id: 's3', name: 'Protein Bar', calories: 220, protein: 20, carbs: 25, fat: 8, description: 'Convenient protein-packed bar' },
    { id: 's4', name: 'Greek Yogurt Cup', calories: 150, protein: 15, carbs: 18, fat: 3, description: 'Creamy plain Greek yogurt' },
    { id: 's5', name: 'Trail Mix', calories: 190, protein: 5, carbs: 20, fat: 12, description: 'Nuts, seeds, and dried fruit' }
  ]
};

export const getMealsByType = (type) => MEAL_DATABASE[type] || [];
export const getAllMeals = () => Object.values(MEAL_DATABASE).flat();`;

    fs.writeFileSync('./src/data/meals.js', mealDatabase);
    console.log('  ✅ Meal database updated with structured flow');
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const bot = new MealFlowBot();
  bot.execute().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default MealFlowBot;