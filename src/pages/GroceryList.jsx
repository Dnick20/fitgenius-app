import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Check, X, Users, Calendar, Search, Filter } from 'lucide-react';

const GroceryList = ({ userProfile }) => {
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [servings, setServings] = useState(4);
  const [days, setDays] = useState(7);
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Static meal options for demonstration
  const staticMealOptions = [
    { id: 1, name: 'Grilled Chicken Salad', category: 'lunch', ingredients: [
      { name: 'Chicken Breast', amount: 200, unit: 'g', category: 'protein' },
      { name: 'Mixed Greens', amount: 100, unit: 'g', category: 'vegetables' },
      { name: 'Cherry Tomatoes', amount: 150, unit: 'g', category: 'vegetables' },
      { name: 'Cucumber', amount: 1, unit: 'piece', category: 'vegetables' },
      { name: 'Olive Oil', amount: 15, unit: 'ml', category: 'oils' },
      { name: 'Lemon', amount: 1, unit: 'piece', category: 'fruits' }
    ]},
    { id: 2, name: 'Salmon with Quinoa', category: 'dinner', ingredients: [
      { name: 'Salmon Fillet', amount: 150, unit: 'g', category: 'protein' },
      { name: 'Quinoa', amount: 80, unit: 'g', category: 'grains' },
      { name: 'Broccoli', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Sweet Potato', amount: 150, unit: 'g', category: 'vegetables' },
      { name: 'Garlic', amount: 2, unit: 'cloves', category: 'spices' }
    ]},
    { id: 3, name: 'Greek Yogurt Parfait', category: 'breakfast', ingredients: [
      { name: 'Greek Yogurt', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Berries', amount: 100, unit: 'g', category: 'fruits' },
      { name: 'Granola', amount: 30, unit: 'g', category: 'grains' },
      { name: 'Honey', amount: 15, unit: 'ml', category: 'sweeteners' },
      { name: 'Almonds', amount: 20, unit: 'g', category: 'nuts' }
    ]},
    { id: 4, name: 'Turkey Wrap', category: 'lunch', ingredients: [
      { name: 'Turkey Slices', amount: 100, unit: 'g', category: 'protein' },
      { name: 'Whole Wheat Tortilla', amount: 1, unit: 'piece', category: 'grains' },
      { name: 'Lettuce', amount: 50, unit: 'g', category: 'vegetables' },
      { name: 'Tomato', amount: 1, unit: 'medium', category: 'vegetables' },
      { name: 'Avocado', amount: 0.5, unit: 'piece', category: 'fruits' },
      { name: 'Hummus', amount: 30, unit: 'g', category: 'condiments' }
    ]},
    { id: 5, name: 'Protein Smoothie', category: 'snack', ingredients: [
      { name: 'Protein Powder', amount: 30, unit: 'g', category: 'supplements' },
      { name: 'Banana', amount: 1, unit: 'piece', category: 'fruits' },
      { name: 'Spinach', amount: 30, unit: 'g', category: 'vegetables' },
      { name: 'Almond Milk', amount: 250, unit: 'ml', category: 'dairy' },
      { name: 'Peanut Butter', amount: 15, unit: 'g', category: 'nuts' }
    ]}
  ];

  // Get meals from weekly plan and format them for the grocery list
  const getWeeklyPlanMeals = () => {
    const weeklyMealPlan = JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]');
    return weeklyMealPlan.map(meal => ({
      ...meal,
      // Convert ingredient strings to structured format if needed
      ingredients: meal.ingredients ? meal.ingredients.map(ingredientText => {
        const parsedIngredient = parseIngredientText(ingredientText);
        return {
          name: parsedIngredient.name,
          amount: parsedIngredient.amount,
          unit: parsedIngredient.unit,
          category: parsedIngredient.category
        };
      }) : []
    }));
  };

  // Combine static meals with weekly plan meals
  const mealOptions = [
    ...staticMealOptions,
    ...getWeeklyPlanMeals()
  ];

  const categories = [
    'all', 'protein', 'vegetables', 'fruits', 'grains', 'dairy', 'nuts', 'oils', 'spices', 'condiments', 'supplements', 'sweeteners'
  ];

  const generateGroceryList = () => {
    const consolidatedIngredients = {};

    // Process manually selected meals from the grocery list interface
    selectedMeals.forEach(mealId => {
      const meal = mealOptions.find(m => m.id === mealId);
      if (meal && meal.ingredients) {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.name;
          if (consolidatedIngredients[key]) {
            consolidatedIngredients[key].totalAmount += ingredient.amount * servings * (days / 7);
          } else {
            consolidatedIngredients[key] = {
              ...ingredient,
              totalAmount: ingredient.amount * servings * (days / 7)
            };
          }
        });
      }
    });

    // Process meals from weekly meal plan
    const weeklyMealPlan = JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]');
    weeklyMealPlan.forEach(meal => {
      if (meal.ingredients) {
        meal.ingredients.forEach(ingredientText => {
          // Parse ingredient text (e.g., "6oz grilled chicken breast")
          const parsedIngredient = parseIngredientText(ingredientText);
          const key = parsedIngredient.name;
          
          if (consolidatedIngredients[key]) {
            consolidatedIngredients[key].totalAmount += parsedIngredient.amount;
          } else {
            consolidatedIngredients[key] = {
              ...parsedIngredient,
              totalAmount: parsedIngredient.amount
            };
          }
        });
      }
    });

    const list = Object.values(consolidatedIngredients).map((item, index) => ({
      id: index + 1,
      name: item.name,
      amount: Math.ceil(item.totalAmount * 10) / 10,
      unit: item.unit,
      category: item.category,
      checked: false,
      source: item.source || 'manual' // Track where ingredient came from
    }));

    setGroceryList(list);
    setCheckedItems(new Set());
  };

  // Helper function to parse ingredient text into structured data
  const parseIngredientText = (ingredientText) => {
    // Extract amount and unit from strings like "6oz chicken breast" or "1/2 cup quinoa"
    const amountMatch = ingredientText.match(/^(\d+(?:\/\d+)?|\d*\.?\d+)\s*(\w+)?/);
    let amount = 1;
    let unit = 'piece';
    let name = ingredientText;

    if (amountMatch) {
      // Handle fractions like "1/2"
      if (amountMatch[1].includes('/')) {
        const [numerator, denominator] = amountMatch[1].split('/');
        amount = parseFloat(numerator) / parseFloat(denominator);
      } else {
        amount = parseFloat(amountMatch[1]) || 1;
      }
      
      if (amountMatch[2]) {
        unit = amountMatch[2];
        // Remove the amount and unit from the name
        name = ingredientText.replace(amountMatch[0], '').trim();
      }
    }

    // Categorize ingredients
    const category = categorizeIngredient(name);

    return {
      name: name,
      amount: amount,
      unit: unit,
      category: category,
      source: 'weekly-plan'
    };
  };

  // Helper function to categorize ingredients
  const categorizeIngredient = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork') || 
        lowerName.includes('turkey') || lowerName.includes('salmon') || lowerName.includes('fish') ||
        lowerName.includes('protein') || lowerName.includes('meat')) {
      return 'protein';
    } else if (lowerName.includes('oil') || lowerName.includes('butter') || lowerName.includes('avocado')) {
      return 'oils';
    } else if (lowerName.includes('cheese') || lowerName.includes('milk') || lowerName.includes('yogurt')) {
      return 'dairy';
    } else if (lowerName.includes('tomato') || lowerName.includes('spinach') || lowerName.includes('pepper') ||
               lowerName.includes('onion') || lowerName.includes('cucumber') || lowerName.includes('broccoli') ||
               lowerName.includes('vegetable')) {
      return 'vegetables';
    } else if (lowerName.includes('banana') || lowerName.includes('berry') || lowerName.includes('apple') ||
               lowerName.includes('lemon') || lowerName.includes('fruit')) {
      return 'fruits';
    } else if (lowerName.includes('rice') || lowerName.includes('quinoa') || lowerName.includes('oats') ||
               lowerName.includes('bread') || lowerName.includes('pasta') || lowerName.includes('tortilla')) {
      return 'grains';
    } else if (lowerName.includes('almond') || lowerName.includes('nut') || lowerName.includes('seed')) {
      return 'nuts';
    } else if (lowerName.includes('salt') || lowerName.includes('pepper') || lowerName.includes('garlic') ||
               lowerName.includes('herb') || lowerName.includes('spice')) {
      return 'spices';
    } else {
      return 'condiments';
    }
  };

  const toggleMealSelection = (mealId) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const toggleItemCheck = (itemId) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
  };

  const clearCheckedItems = () => {
    const uncheckedItems = groceryList.filter(item => !checkedItems.has(item.id));
    setGroceryList(uncheckedItems);
    setCheckedItems(new Set());
  };

  const filteredGroceryList = groceryList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedItems = filteredGroceryList.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const getCategoryIcon = (category) => {
    const icons = {
      protein: '🥩',
      vegetables: '🥬',
      fruits: '🍎',
      grains: '🌾',
      dairy: '🥛',
      nuts: '🥜',
      oils: '🫒',
      spices: '🧄',
      condiments: '🍯',
      supplements: '💊',
      sweeteners: '🍯'
    };
    return icons[category] || '🛒';
  };

  useEffect(() => {
    // Always generate grocery list on component mount and when dependencies change
    // This will include weekly planned meals even if no meals are manually selected
    generateGroceryList();
  }, [selectedMeals, servings, days]);

  // Load weekly planned meals automatically on component mount
  useEffect(() => {
    const weeklyMealPlan = JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]');
    if (weeklyMealPlan.length > 0) {
      // Auto-select weekly plan meals in the grocery list interface
      const weeklyMealIds = weeklyMealPlan.map(meal => meal.id);
      setSelectedMeals(prev => {
        const combined = [...new Set([...prev, ...weeklyMealIds])]; // Remove duplicates
        return combined;
      });
      generateGroceryList();
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ShoppingCart className="w-8 h-8 text-orange-400 mr-3" />
          <h1 className="text-3xl font-bold text-white">Grocery List Generator</h1>
        </div>
        <p className="text-gray-400">Generate smart grocery lists based on your meal plans</p>
      </div>

      {/* Weekly Plan Integration Info */}
      {JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]').length > 0 && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-blue-400 font-semibold">Weekly Plan Integration</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Your grocery list automatically includes ingredients from {JSON.parse(localStorage.getItem('weeklyMealPlan') || '[]').length} meals in your weekly plan. 
            Items marked with "Weekly Plan" badges are from your scheduled meals.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Meal Selection */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Select Meals</h2>
          
          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Servings
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold px-4">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Days
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDays(Math.max(1, days - 1))}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-semibold px-4">{days}</span>
                <button
                  onClick={() => setDays(days + 1)}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Meal Options */}
          <div className="space-y-3">
            {mealOptions.map(meal => (
              <div
                key={meal.id}
                onClick={() => toggleMealSelection(meal.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMeals.includes(meal.id)
                    ? 'bg-orange-500/20 border-orange-400 text-orange-300'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{meal.name}</h3>
                      {meal.scheduledFor && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-400/30">
                          Weekly Plan
                        </span>
                      )}
                      {meal.isAIGenerated && (
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-400/30">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70 capitalize">{meal.category}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMeals.includes(meal.id) 
                      ? 'bg-orange-500 border-orange-500' 
                      : 'border-gray-500'
                  }`}>
                    {selectedMeals.includes(meal.id) && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Grocery List */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Grocery List</h2>
            {checkedItems.size > 0 && (
              <button
                onClick={clearCheckedItems}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
              >
                Clear Checked ({checkedItems.size})
              </button>
            )}
          </div>

          {groceryList.length > 0 && (
            <>
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-orange-400"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grouped Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                      <span className="mr-2">{getCategoryIcon(category)}</span>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h3>
                    <div className="space-y-2 ml-6">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                            checkedItems.has(item.id)
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                          onClick={() => toggleItemCheck(item.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              checkedItems.has(item.id) 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-500'
                            }`}>
                              {checkedItems.has(item.id) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={checkedItems.has(item.id) ? 'line-through' : ''}>
                                {item.name}
                              </span>
                              {item.source === 'weekly-plan' && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-400/30">
                                  Weekly Plan
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-semibold">
                            {item.amount} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-lg border border-orange-400/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-300">Total Items:</span>
                  <span className="text-white font-semibold">{groceryList.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-orange-300">Checked:</span>
                  <span className="text-green-400 font-semibold">{checkedItems.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-blue-300">From Weekly Plan:</span>
                  <span className="text-blue-400 font-semibold">
                    {groceryList.filter(item => item.source === 'weekly-plan').length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-purple-300">Manually Added:</span>
                  <span className="text-purple-400 font-semibold">
                    {groceryList.filter(item => item.source === 'manual').length}
                  </span>
                </div>
              </div>
            </>
          )}

          {groceryList.length === 0 && selectedMeals.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No meals selected</h3>
              <p className="text-gray-500 text-sm">Select meals to generate your grocery list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroceryList;