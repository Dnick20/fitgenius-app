import React, { useState } from 'react';
import { Utensils, Clock, Users, Heart, Plus, Search, Filter, CheckCircle, ChefHat, Flame, Star, Sparkles, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { MEAL_DATABASE, getMealsByType, getMealCategories, searchMeals, filterMealsByCalories, filterMealsByProtein } from '../data/meals';

const Meals = ({ userProfile, onContinue, nextPageName, isLastPage }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedMeals, setSavedMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [showWeeklyPlanUpdate, setShowWeeklyPlanUpdate] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [mealRepetition, setMealRepetition] = useState(2);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [calorieRange, setCalorieRange] = useState({ min: '', max: '' });
  const [proteinFilter, setProteinFilter] = useState('');

  // Get all meal categories
  const categories = getMealCategories();

  // Get filtered meals based on selected filters
  const getFilteredMeals = () => {
    let meals = [];
    
    // Get meals by category
    if (selectedCategory === 'all') {
      categories.forEach(category => {
        meals.push(...getMealsByType(category));
      });
    } else {
      meals = getMealsByType(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      meals = searchMeals(searchQuery).filter(meal => 
        selectedCategory === 'all' || 
        getMealsByType(selectedCategory).some(m => m.id === meal.id)
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty !== 'all') {
      meals = meals.filter(meal => meal.difficulty === selectedDifficulty);
    }

    // Apply calorie range filter
    if (calorieRange.min || calorieRange.max) {
      const min = parseInt(calorieRange.min) || 0;
      const max = parseInt(calorieRange.max) || 10000;
      meals = filterMealsByCalories(min, max).filter(meal =>
        selectedCategory === 'all' ||
        getMealsByType(selectedCategory).some(m => m.id === meal.id)
      );
    }

    // Apply protein filter
    if (proteinFilter) {
      const minProtein = parseInt(proteinFilter);
      meals = filterMealsByProtein(minProtein).filter(meal =>
        selectedCategory === 'all' ||
        getMealsByType(selectedCategory).some(m => m.id === meal.id)
      );
    }

    return meals;
  };

  const filteredMeals = getFilteredMeals();

  const toggleMealSelection = (meal) => {
    const isSelected = selectedMeals.some(m => m.id === meal.id);
    if (isSelected) {
      setSelectedMeals(selectedMeals.filter(m => m.id !== meal.id));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const addMealsToWeeklyPlan = () => {
    const existingPlan = JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]');
    
    const repeatedMeals = [];
    selectedMeals.forEach(meal => {
      for (let i = 0; i < mealRepetition; i++) {
        repeatedMeals.push({
          ...meal,
          id: `${meal.id}_repeat_${i}`,
          originalId: meal.id,
          repetitionIndex: i + 1,
          scheduledFor: 'user-selected',
          addedDate: new Date().toISOString(),
          repetitionCount: mealRepetition
        });
      }
    });
    
    const updatedPlan = [...existingPlan, ...repeatedMeals];
    localStorage.setItem('weeklyMealPlan', JSON.stringify(updatedPlan));
    
    setShowWeeklyPlanUpdate(true);
    setSelectedMeals([]);
    
    setTimeout(() => setShowWeeklyPlanUpdate(false), 3000);
  };

  const toggleCardExpansion = (mealId) => {
    setExpandedCards(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍽️',
      snacks: '🍎'
    };
    return iconMap[category] || '🍴';
  };

  const getMealCategoryFromId = (mealId) => {
    for (const category of categories) {
      if (getMealsByType(category).some(meal => meal.id === mealId)) {
        return category;
      }
    }
    return 'meal';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Meal Library
          </h1>
          <p className="text-gray-300">
            {filteredMeals.length} healthy meals across {categories.length} categories
          </p>
        </div>
      </div>

      {/* Selected Meals Summary */}
      {selectedMeals.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-400/30 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-emerald-400 font-semibold">Selected Meals ({selectedMeals.length})</h3>
              <p className="text-gray-300 text-sm">
                {selectedMeals.map(m => m.name).join(', ')}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <label className="text-sm text-gray-300">
                  Repeat each meal:
                  <select 
                    value={mealRepetition} 
                    onChange={(e) => setMealRepetition(parseInt(e.target.value))}
                    className="ml-2 bg-white/10 text-white rounded px-2 py-1"
                  >
                    <option value={1}>1x per week</option>
                    <option value={2}>2x per week</option>
                    <option value={3}>3x per week</option>
                    <option value={4}>4x per week</option>
                  </select>
                </label>
              </div>
            </div>
            <button
              onClick={addMealsToWeeklyPlan}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
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
          <span className="text-green-400 font-semibold">Meals added to your weekly plan!</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
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
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Difficulty</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Calorie Range */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Calories (min)</label>
            <input
              type="number"
              placeholder="Min calories"
              value={calorieRange.min}
              onChange={(e) => setCalorieRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Calories (max)</label>
            <input
              type="number"
              placeholder="Max calories"
              value={calorieRange.max}
              onChange={(e) => setCalorieRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2"
            />
          </div>

          {/* Protein Filter */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Min Protein (g)</label>
            <input
              type="number"
              placeholder="Min protein"
              value={proteinFilter}
              onChange={(e) => setProteinFilter(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg text-white px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Linear Meal Cards */}
      <div className="space-y-4">
        {filteredMeals.map(meal => {
          const isExpanded = expandedCards[meal.id];
          const isSelected = selectedMeals.some(m => m.id === meal.id);
          const mealCategory = getMealCategoryFromId(meal.id);
          
          return (
            <div
              key={meal.id}
              className="linear-card bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <div className="linear-card-content">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/10 rounded-xl p-3 flex-shrink-0">
                      <span className="text-2xl">{getCategoryIcon(mealCategory)}</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-2">{meal.name}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{meal.description}</p>
                      
                      {/* Meal Stats */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center text-orange-400">
                          <Flame className="w-4 h-4 mr-1" />
                          <span>{meal.calories} cal</span>
                        </div>
                        <div className="flex items-center text-blue-400">
                          <span className="font-bold mr-1">P:</span>
                          <span>{meal.protein}g</span>
                        </div>
                        <div className="flex items-center text-green-400">
                          <span className="font-bold mr-1">C:</span>
                          <span>{meal.carbs}g</span>
                        </div>
                        <div className="flex items-center text-yellow-400">
                          <span className="font-bold mr-1">F:</span>
                          <span>{meal.fat}g</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{meal.prepTime} min</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(meal.difficulty)}`}>
                          {meal.difficulty}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleCardExpansion(meal.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white font-medium mb-2">Nutritional Info</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Calories:</span>
                            <span className="text-orange-400 font-semibold">{meal.calories}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Protein:</span>
                            <span className="text-blue-400 font-semibold">{meal.protein}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carbs:</span>
                            <span className="text-green-400 font-semibold">{meal.carbs}g</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fat:</span>
                            <span className="text-yellow-400 font-semibold">{meal.fat}g</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white font-medium mb-2">Meal Details</h4>
                        <div className="space-y-1 text-sm text-gray-300">
                          <div>Prep Time: {meal.prepTime} minutes</div>
                          <div>Servings: {meal.servings}</div>
                          <div>Difficulty: {meal.difficulty}</div>
                          <div>Category: {mealCategory.charAt(0).toUpperCase() + mealCategory.slice(1)}</div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-3">
                        <h4 className="text-white font-medium mb-2">Perfect For</h4>
                        <div className="text-sm text-gray-300">
                          {meal.difficulty === 'Easy' && 'Quick meals, beginners, busy schedules'}
                          {meal.difficulty === 'Medium' && 'Weekend cooking, moderate skill level'}
                          {meal.difficulty === 'Hard' && 'Special occasions, advanced cooking'}
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
                      onClick={() => toggleMealSelection(meal)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/50'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isSelected ? 'Selected' : 'Add to Plan'}
                    </button>
                  </div>

                  {/* Meal Rating */}
                  <div className="flex items-center text-gray-400">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">4.{Math.floor(Math.random() * 4) + 5}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No meals found matching your filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSelectedDifficulty('all');
              setCalorieRange({ min: '', max: '' });
              setProteinFilter('');
            }}
            className="mt-4 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
          >
            Clear All Filters
          </button>
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

export default Meals;