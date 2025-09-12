import React, { useState, useEffect } from 'react';
import { ShoppingCart, Users, MapPin, TrendingDown, DollarSign, Check, ChevronLeft, ChevronRight, Settings, Home } from 'lucide-react';
import GroceryIntelligenceBot from '../bots/GroceryIntelligenceBot';

const GroceryList = ({ userProfile }) => {
  const [peopleCount, setPeopleCount] = useState(1); // Default to 1
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [userZipcode, setUserZipcode] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [pricingData, setPricingData] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  
  // Week cycling state
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  
  // Settings modals
  const [showZipcodeModal, setShowZipcodeModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [tempZipcode, setTempZipcode] = useState('');
  const [tempStore, setTempStore] = useState('');
  
  // Inventory tracking
  const [inventory, setInventory] = useState({});
  const [purchaseHistory, setPurchaseHistory] = useState({});
  
  // Shopping list state
  const [showShoppingList, setShowShoppingList] = useState(false);
  
  // Store layout mapping for organizing shopping lists by aisle
  const storeAisleMap = {
    // Produce section
    'Banana': 'Produce (Aisle 1)',
    'Berries': 'Produce (Aisle 1)', 
    'Spinach': 'Produce (Aisle 1)',
    'Mixed Greens': 'Produce (Aisle 1)',
    'Cherry Tomatoes': 'Produce (Aisle 1)',
    'Cucumber': 'Produce (Aisle 1)',
    'Lettuce': 'Produce (Aisle 1)',
    'Tomato': 'Produce (Aisle 1)',
    'Avocado': 'Produce (Aisle 1)',
    'Bell Peppers': 'Produce (Aisle 1)',
    'Onion': 'Produce (Aisle 1)',
    'Green Beans': 'Produce (Aisle 1)',
    'Broccoli': 'Produce (Aisle 1)',
    'Carrots': 'Produce (Aisle 1)',
    'Sweet Potato': 'Produce (Aisle 1)',
    'Garlic': 'Produce (Aisle 1)',
    'Lemon': 'Produce (Aisle 1)',
    
    // Meat & Seafood
    'Chicken Breast': 'Meat & Seafood (Aisle 2)',
    'Ground Turkey': 'Meat & Seafood (Aisle 2)',
    'Ground Beef': 'Meat & Seafood (Aisle 2)',
    'Pork Chops': 'Meat & Seafood (Aisle 2)',
    'Salmon Fillet': 'Meat & Seafood (Aisle 2)',
    'Tuna': 'Meat & Seafood (Aisle 2)',
    
    // Dairy & Eggs
    'Greek Yogurt': 'Dairy & Eggs (Aisle 3)',
    'Milk': 'Dairy & Eggs (Aisle 3)',
    'Almond Milk': 'Dairy & Eggs (Aisle 3)',
    'Cheese': 'Dairy & Eggs (Aisle 3)',
    'Eggs': 'Dairy & Eggs (Aisle 3)',
    
    // Pantry & Dry Goods
    'Granola': 'Pantry & Dry Goods (Aisle 4-5)',
    'Quinoa': 'Pantry & Dry Goods (Aisle 4-5)',
    'Brown Rice': 'Pantry & Dry Goods (Aisle 4-5)',
    'Oats': 'Pantry & Dry Goods (Aisle 4-5)',
    'Whole Wheat Tortilla': 'Pantry & Dry Goods (Aisle 4-5)',
    'Pasta': 'Pantry & Dry Goods (Aisle 4-5)',
    
    // Nuts & Condiments
    'Almonds': 'Nuts & Condiments (Aisle 6)',
    'Peanut Butter': 'Nuts & Condiments (Aisle 6)',
    'Olive Oil': 'Nuts & Condiments (Aisle 6)',
    'Honey': 'Nuts & Condiments (Aisle 6)',
  };

  // Multiple week meal plans
  const weeklyMealPlans = {
    0: {
      Monday: {
        breakfast: { name: 'Greek Yogurt Parfait', ingredients: ['Greek Yogurt', 'Berries', 'Granola', 'Honey', 'Almonds'] },
        lunch: { name: 'Grilled Chicken Salad', ingredients: ['Chicken Breast', 'Mixed Greens', 'Cherry Tomatoes', 'Cucumber', 'Olive Oil', 'Lemon'] },
        dinner: { name: 'Salmon with Quinoa', ingredients: ['Salmon Fillet', 'Quinoa', 'Broccoli', 'Sweet Potato', 'Garlic'] }
      },
      Tuesday: {
        breakfast: { name: 'Protein Smoothie', ingredients: ['Banana', 'Spinach', 'Almond Milk', 'Peanut Butter'] },
        lunch: { name: 'Turkey Wrap', ingredients: ['Ground Turkey', 'Whole Wheat Tortilla', 'Lettuce', 'Tomato', 'Avocado'] },
        dinner: { name: 'Chicken Stir Fry', ingredients: ['Chicken Breast', 'Broccoli', 'Bell Peppers', 'Onion', 'Olive Oil'] }
      },
      Wednesday: {
        breakfast: { name: 'Scrambled Eggs', ingredients: ['Eggs', 'Spinach', 'Cheese', 'Milk'] },
        lunch: { name: 'Tuna Salad', ingredients: ['Tuna', 'Mixed Greens', 'Cherry Tomatoes', 'Cucumber'] },
        dinner: { name: 'Beef & Vegetables', ingredients: ['Ground Beef', 'Sweet Potato', 'Green Beans', 'Onion'] }
      },
      Thursday: {
        breakfast: { name: 'Oatmeal Bowl', ingredients: ['Oats', 'Banana', 'Almonds', 'Milk', 'Honey'] },
        lunch: { name: 'Chicken Salad Wrap', ingredients: ['Chicken Breast', 'Whole Wheat Tortilla', 'Lettuce', 'Tomato'] },
        dinner: { name: 'Pork & Rice', ingredients: ['Pork Chops', 'Brown Rice', 'Broccoli', 'Carrots'] }
      },
      Friday: {
        breakfast: { name: 'Greek Yogurt Bowl', ingredients: ['Greek Yogurt', 'Granola', 'Berries'] },
        lunch: { name: 'Quinoa Salad', ingredients: ['Quinoa', 'Black Beans', 'Bell Peppers', 'Corn', 'Lime'] },
        dinner: { name: 'Fish & Vegetables', ingredients: ['White Fish', 'Asparagus', 'Sweet Potato', 'Lemon'] }
      },
      Saturday: {
        breakfast: { name: 'Pancakes', ingredients: ['Flour', 'Eggs', 'Milk', 'Berries', 'Maple Syrup'] },
        lunch: { name: 'Chicken Bowl', ingredients: ['Chicken Breast', 'Brown Rice', 'Black Beans', 'Avocado'] },
        dinner: { name: 'Pasta Night', ingredients: ['Pasta', 'Ground Turkey', 'Marinara Sauce', 'Cheese'] }
      },
      Sunday: {
        breakfast: { name: 'Egg Benedict', ingredients: ['Eggs', 'English Muffin', 'Spinach', 'Cheese'] },
        lunch: { name: 'Soup & Salad', ingredients: ['Chicken Broth', 'Vegetables', 'Mixed Greens'] },
        dinner: { name: 'Steak Dinner', ingredients: ['Steak', 'Potatoes', 'Green Beans', 'Mushrooms'] }
      }
    },
    1: {
      Monday: {
        breakfast: { name: 'Avocado Toast', ingredients: ['Bread', 'Avocado', 'Eggs', 'Tomato', 'Lime'] },
        lunch: { name: 'Mediterranean Bowl', ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Olives', 'Feta Cheese'] },
        dinner: { name: 'Chicken Teriyaki', ingredients: ['Chicken Breast', 'Rice', 'Broccoli', 'Teriyaki Sauce', 'Sesame Seeds'] }
      },
      Tuesday: {
        breakfast: { name: 'Chia Pudding', ingredients: ['Chia Seeds', 'Almond Milk', 'Vanilla', 'Berries', 'Maple Syrup'] },
        lunch: { name: 'Caesar Salad', ingredients: ['Romaine Lettuce', 'Chicken Breast', 'Parmesan Cheese', 'Croutons', 'Caesar Dressing'] },
        dinner: { name: 'Beef Stir Fry', ingredients: ['Beef Strips', 'Bell Peppers', 'Snow Peas', 'Ginger', 'Soy Sauce'] }
      },
      Wednesday: {
        breakfast: { name: 'Smoothie Bowl', ingredients: ['Frozen Berries', 'Banana', 'Protein Powder', 'Coconut', 'Granola'] },
        lunch: { name: 'Turkey Sandwich', ingredients: ['Turkey', 'Bread', 'Lettuce', 'Tomato', 'Mayo'] },
        dinner: { name: 'Salmon Tacos', ingredients: ['Salmon', 'Tortillas', 'Cabbage', 'Lime', 'Cilantro'] }
      },
      Thursday: {
        breakfast: { name: 'French Toast', ingredients: ['Bread', 'Eggs', 'Milk', 'Cinnamon', 'Syrup'] },
        lunch: { name: 'Veggie Wrap', ingredients: ['Tortilla', 'Hummus', 'Bell Peppers', 'Carrots', 'Spinach'] },
        dinner: { name: 'Pork Tenderloin', ingredients: ['Pork Tenderloin', 'Sweet Potatoes', 'Green Beans', 'Rosemary'] }
      },
      Friday: {
        breakfast: { name: 'Breakfast Burrito', ingredients: ['Eggs', 'Tortilla', 'Cheese', 'Bell Peppers', 'Salsa'] },
        lunch: { name: 'Sushi Bowl', ingredients: ['Rice', 'Tuna', 'Avocado', 'Cucumber', 'Nori'] },
        dinner: { name: 'Pizza Night', ingredients: ['Pizza Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni', 'Basil'] }
      },
      Saturday: {
        breakfast: { name: 'Waffles', ingredients: ['Waffle Mix', 'Eggs', 'Milk', 'Strawberries', 'Whipped Cream'] },
        lunch: { name: 'BLT Sandwich', ingredients: ['Bacon', 'Lettuce', 'Tomato', 'Bread', 'Mayo'] },
        dinner: { name: 'Lamb Chops', ingredients: ['Lamb Chops', 'Potatoes', 'Asparagus', 'Mint', 'Garlic'] }
      },
      Sunday: {
        breakfast: { name: 'Breakfast Bowl', ingredients: ['Oats', 'Yogurt', 'Nuts', 'Honey', 'Fruit'] },
        lunch: { name: 'Chicken Quesadilla', ingredients: ['Chicken', 'Tortilla', 'Cheese', 'Peppers', 'Onions'] },
        dinner: { name: 'Sunday Roast', ingredients: ['Beef Roast', 'Carrots', 'Potatoes', 'Onions', 'Herbs'] }
      }
    }
  };

  // Get week dates for display
  const getWeekDates = (weekOffset) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Get Monday of current week
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Format week display
  const formatWeekDisplay = (dates) => {
    if (dates.length === 0) return 'This Week';
    const start = dates[0];
    const end = dates[6];
    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}`;
    } else {
      return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
    }
  };

  // Organize checked items by store aisle for shopping list
  const organizeShoppingListByAisle = () => {
    const checkedGroceryItems = groceryList.filter(item => checkedItems.has(item.name));
    const organizedByAisle = {};
    
    checkedGroceryItems.forEach(item => {
      const aisle = storeAisleMap[item.name] || 'Other Items';
      if (!organizedByAisle[aisle]) {
        organizedByAisle[aisle] = [];
      }
      organizedByAisle[aisle].push(item);
    });
    
    // Sort aisles by typical store layout order
    const aisleOrder = [
      'Produce (Aisle 1)',
      'Meat & Seafood (Aisle 2)', 
      'Dairy & Eggs (Aisle 3)',
      'Pantry & Dry Goods (Aisle 4-5)',
      'Nuts & Condiments (Aisle 6)',
      'Other Items'
    ];
    
    const sortedAisles = {};
    aisleOrder.forEach(aisle => {
      if (organizedByAisle[aisle]) {
        sortedAisles[aisle] = organizedByAisle[aisle];
      }
    });
    
    return sortedAisles;
  };

  // Generate consolidated grocery list from weekly plan with inventory check
  const generateGroceryListFromWeeklyPlan = () => {
    const consolidatedIngredients = {};
    const currentPlan = weeklyMealPlans[currentWeek] || weeklyMealPlans[0];
    
    // Process each day of the week
    Object.values(currentPlan).forEach(day => {
      Object.values(day).forEach(meal => {
        meal.ingredients.forEach(ingredient => {
          const key = ingredient.toLowerCase();
          const baseAmount = getIngredientAmount(ingredient) * peopleCount;
          const inventoryAmount = inventory[key] || 0;
          const neededAmount = Math.max(0, baseAmount - inventoryAmount);
          
          if (consolidatedIngredients[key]) {
            consolidatedIngredients[key].amount += neededAmount;
            consolidatedIngredients[key].totalNeeded += baseAmount;
          } else {
            consolidatedIngredients[key] = {
              name: ingredient,
              amount: neededAmount,
              totalNeeded: baseAmount,
              unit: getIngredientUnit(ingredient),
              category: categorizeIngredient(ingredient),
              inInventory: inventoryAmount > 0,
              inventoryAmount: inventoryAmount
            };
          }
        });
      });
    });

    return Object.values(consolidatedIngredients).filter(item => item.amount > 0);
  };

  // Group grocery list by category
  const groupGroceriesByCategory = (groceries) => {
    const grouped = {};
    groceries.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  // Get ingredient amount based on typical serving sizes
  const getIngredientAmount = (ingredient) => {
    const amounts = {
      // Proteins
      'chicken breast': 0.25, 'ground turkey': 0.25, 'salmon fillet': 0.25,
      'ground beef': 0.25, 'steak': 0.33, 'pork chops': 0.25, 'white fish': 0.25,
      'tuna': 1, 'turkey': 0.25,
      
      // Dairy & Eggs
      'eggs': 2, 'greek yogurt': 1, 'milk': 0.5, 'cheese': 0.25, 'almond milk': 1,
      
      // Grains
      'quinoa': 0.25, 'brown rice': 0.25, 'oats': 0.5, 'whole wheat tortilla': 2, 'pasta': 0.25,
      
      // Vegetables
      'broccoli': 0.5, 'spinach': 2, 'mixed greens': 2, 'cherry tomatoes': 1,
      'cucumber': 0.5, 'lettuce': 1, 'tomato': 1, 'bell peppers': 1, 'onion': 0.5,
      'green beans': 0.5, 'carrots': 0.5, 'sweet potato': 0.5, 'garlic': 0.1,
      
      // Fruits
      'avocado': 0.5, 'banana': 1, 'berries': 0.5, 'lemon': 0.5,
      
      // Nuts & Others
      'almonds': 0.25, 'peanut butter': 0.25, 'granola': 0.5, 'honey': 0.25,
      
      // Oils & Condiments  
      'olive oil': 1
    };
    return amounts[ingredient.toLowerCase()] || 1;
  };

  // Get ingredient unit
  const getIngredientUnit = (ingredient) => {
    const units = {
      // Proteins
      'chicken breast': 'lb', 'ground turkey': 'lb', 'salmon fillet': 'lb',
      'ground beef': 'lb', 'steak': 'lb', 'pork chops': 'lb', 'white fish': 'lb',
      'tuna': 'can', 'turkey': 'lb',
      
      // Dairy & Eggs
      'eggs': 'dozen', 'greek yogurt': 'cup', 'milk': 'gallon', 'cheese': 'cup', 
      'almond milk': 'carton',
      
      // Grains
      'quinoa': 'cup', 'brown rice': 'cup', 'oats': 'cup', 'whole wheat tortilla': 'pack', 
      'pasta': 'box',
      
      // Vegetables
      'broccoli': 'lb', 'spinach': 'bunch', 'mixed greens': 'bag', 'cherry tomatoes': 'pint',
      'cucumber': 'each', 'lettuce': 'head', 'tomato': 'each', 'bell peppers': 'each', 
      'onion': 'each', 'green beans': 'lb', 'carrots': 'lb', 'sweet potato': 'lb', 
      'garlic': 'bulb',
      
      // Fruits
      'avocado': 'each', 'banana': 'each', 'berries': 'cup', 'lemon': 'each',
      
      // Nuts & Others
      'almonds': 'cup', 'peanut butter': 'jar', 'granola': 'cup', 'honey': 'jar',
      
      // Oils & Condiments  
      'olive oil': 'bottle'
    };
    return units[ingredient.toLowerCase()] || 'each';
  };

  // Helper function to categorize ingredients
  const categorizeIngredient = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('pork') || 
        lowerName.includes('turkey') || lowerName.includes('salmon') || lowerName.includes('fish') ||
        lowerName.includes('protein') || lowerName.includes('meat') || lowerName.includes('tuna') ||
        lowerName.includes('steak') || lowerName.includes('eggs') || lowerName.includes('lamb')) {
      return 'protein';
    } else if (lowerName.includes('oil') || lowerName.includes('butter') || lowerName.includes('avocado')) {
      return 'oils';
    } else if (lowerName.includes('cheese') || lowerName.includes('milk') || lowerName.includes('yogurt')) {
      return 'dairy';
    } else if (lowerName.includes('tomato') || lowerName.includes('spinach') || lowerName.includes('pepper') ||
               lowerName.includes('onion') || lowerName.includes('cucumber') || lowerName.includes('broccoli') ||
               lowerName.includes('vegetable') || lowerName.includes('greens') || lowerName.includes('lettuce') ||
               lowerName.includes('carrots') || lowerName.includes('beans') || lowerName.includes('asparagus') ||
               lowerName.includes('mushrooms') || lowerName.includes('potatoes') || lowerName.includes('cabbage')) {
      return 'vegetables';
    } else if (lowerName.includes('banana') || lowerName.includes('berry') || lowerName.includes('apple') ||
               lowerName.includes('lemon') || lowerName.includes('fruit') || lowerName.includes('lime') ||
               lowerName.includes('strawberries')) {
      return 'fruits';
    } else if (lowerName.includes('rice') || lowerName.includes('quinoa') || lowerName.includes('oats') ||
               lowerName.includes('bread') || lowerName.includes('pasta') || lowerName.includes('tortilla') ||
               lowerName.includes('flour') || lowerName.includes('muffin') || lowerName.includes('granola') ||
               lowerName.includes('dough') || lowerName.includes('waffle')) {
      return 'grains';
    } else if (lowerName.includes('almond') || lowerName.includes('nut') || lowerName.includes('seed') ||
               lowerName.includes('peanut') || lowerName.includes('coconut')) {
      return 'nuts';
    } else if (lowerName.includes('salt') || lowerName.includes('pepper') || lowerName.includes('garlic') ||
               lowerName.includes('herb') || lowerName.includes('spice') || lowerName.includes('rosemary') ||
               lowerName.includes('basil') || lowerName.includes('mint') || lowerName.includes('cilantro')) {
      return 'spices';
    } else {
      return 'condiments';
    }
  };

  // Load pricing data for grocery list
  const loadPricingData = async () => {
    if (groceryList.length === 0) return;
    
    setLoadingPrices(true);
    try {
      const bot = new GroceryIntelligenceBot();
      const analysis = await bot.execute(groceryList, userZipcode);
      setPricingData(analysis.analysis.pricingAnalysis);
    } catch (error) {
      console.error('Failed to load pricing data:', error);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Toggle item checked state and update inventory
  const toggleChecked = (itemName) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
        // Remove from inventory when unchecked
        setInventory(prevInventory => {
          const newInventory = { ...prevInventory };
          delete newInventory[itemName.toLowerCase()];
          return newInventory;
        });
      } else {
        newSet.add(itemName);
        // Add to inventory when checked
        const item = groceryList.find(g => g.name === itemName);
        if (item) {
          setInventory(prevInventory => ({
            ...prevInventory,
            [itemName.toLowerCase()]: item.amount
          }));
          
          // Update purchase history
          setPurchaseHistory(prevHistory => ({
            ...prevHistory,
            [itemName.toLowerCase()]: {
              amount: item.amount,
              unit: item.unit,
              purchaseDate: new Date().toISOString(),
              weekId: currentWeek
            }
          }));
        }
      }
      return newSet;
    });
  };

  // Save user preferences
  const savePreferences = (preferences) => {
    try {
      const currentPrefs = {
        peopleCount,
        userZipcode,
        selectedStore,
        inventory,
        purchaseHistory,
        ...preferences
      };
      localStorage.setItem('fitgenius_preferences', JSON.stringify(currentPrefs));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  // Load user preferences
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('fitgenius_preferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setPeopleCount(prefs.peopleCount || 1);
        setUserZipcode(prefs.userZipcode || '');
        setSelectedStore(prefs.selectedStore || '');
        setInventory(prefs.inventory || {});
        setPurchaseHistory(prefs.purchaseHistory || {});
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  // Update zipcode
  const updateZipcode = () => {
    setUserZipcode(tempZipcode);
    savePreferences({ userZipcode: tempZipcode });
    setShowZipcodeModal(false);
  };

  // Update store selection
  const updateStore = () => {
    setSelectedStore(tempStore);
    savePreferences({ selectedStore: tempStore });
    setShowStoreModal(false);
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    setCurrentWeekDates(getWeekDates(currentWeek));
  }, [currentWeek]);

  useEffect(() => {
    const newGroceryList = generateGroceryListFromWeeklyPlan();
    setGroceryList(newGroceryList);
    savePreferences({ peopleCount });
  }, [peopleCount, currentWeek, inventory]);

  useEffect(() => {
    if (groceryList.length > 0 && userZipcode) {
      loadPricingData();
    }
  }, [groceryList, userZipcode]);

  const groupedGroceries = groupGroceriesByCategory(groceryList);
  const categoryOrder = ['protein', 'dairy', 'vegetables', 'fruits', 'grains', 'nuts', 'oils', 'spices', 'condiments'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-orange-400 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-white">FitGenius Grocery</h1>
              <p className="text-gray-400">Smart weekly meal planning</p>
            </div>
          </div>
        </div>

        {/* Week Selector */}
        <div className="bg-indigo-600 rounded-xl p-4 mb-6 flex items-center justify-between">
          <button 
            onClick={() => setCurrentWeek(currentWeek - 1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {formatWeekDisplay(currentWeekDates)}
            </div>
            <div className="text-indigo-200 text-sm">
              {currentWeek === 0 ? 'This Week' : 
               currentWeek === 1 ? 'Next Week' : 
               currentWeek === -1 ? 'Last Week' : 
               `Week ${currentWeek > 0 ? '+' : ''}${currentWeek}`}
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* People Count */}
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              People Count
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-l-lg transition-colors"
              >
                -
              </button>
              <span className="bg-white/10 text-white px-4 py-2 min-w-[60px] text-center">
                {peopleCount}
              </span>
              <button 
                onClick={() => setPeopleCount(peopleCount + 1)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-r-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Zipcode */}
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Zipcode
            </label>
            <button
              onClick={() => {
                setTempZipcode(userZipcode);
                setShowZipcodeModal(true);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-left hover:bg-white/20 transition-colors flex items-center justify-between"
            >
              <span>{userZipcode || 'Set Location'}</span>
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Store Selection */}
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2" />
              Store Selection
            </label>
            <button
              onClick={() => {
                setTempStore(selectedStore);
                setShowStoreModal(true);
              }}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-left hover:bg-white/20 transition-colors flex items-center justify-between"
            >
              <span>
                {selectedStore === 'cheapest' ? 'Cheapest' :
                 selectedStore === 'walmart' ? 'Walmart' :
                 selectedStore === 'kroger' ? 'Kroger' :
                 selectedStore === 'wholefoods' ? 'Whole Foods' :
                 'Choose Store'}
              </span>
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grocery List by Category */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-orange-400" />
            Weekly Grocery List ({groceryList.length} items)
          </h2>
          
          {checkedItems.size > 0 && (
            <button
              onClick={() => setShowShoppingList(!showShoppingList)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {showShoppingList ? 'Show Full List' : `Shopping List (${checkedItems.size})`}
            </button>
          )}
        </div>

        {loadingPrices && (
          <div className="text-center py-4">
            <div className="text-gray-400">Loading prices...</div>
          </div>
        )}

        {/* Shopping List View */}
        {showShoppingList && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-green-400 mb-4">
              🛒 Shopping List - Organized by Store Layout
            </h3>
            
            {(() => {
              const organizedShopping = organizeShoppingListByAisle();
              const aisleCount = Object.keys(organizedShopping).length;
              
              if (aisleCount === 0) {
                return (
                  <div className="text-gray-400 text-center py-4">
                    Select items from your grocery list to create a shopping list
                  </div>
                );
              }
              
              return (
                <div className="space-y-6">
                  {Object.entries(organizedShopping).map(([aisle, items]) => (
                    <div key={aisle} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-lg font-medium text-orange-400 mb-3 flex items-center">
                        📍 {aisle}
                        <span className="ml-2 bg-orange-400/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                          {items.length} item{items.length > 1 ? 's' : ''}
                        </span>
                      </h4>
                      
                      <div className="space-y-2">
                        {items.map((item, index) => {
                          let walmartPrice, krogerPrice, wholefoodsPrice;
                          
                          if (pricingData) {
                            walmartPrice = pricingData.walmart?.itemPrices?.find(p => p.name === item.name);
                            krogerPrice = pricingData.kroger?.itemPrices?.find(p => p.name === item.name);
                            wholefoodsPrice = pricingData.wholefoods?.itemPrices?.find(p => p.name === item.name);
                          }
                          
                          return (
                            <div key={index} className="bg-white/5 rounded p-3 border-l-4 border-green-500">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-white">
                                    ✅ {item.name} - {item.amount.toFixed(2)} {item.unit}
                                  </div>
                                  
                                  {/* Price Comparison for Shopping List */}
                                  {pricingData && (
                                    <div className="flex items-center space-x-4 mt-1 text-sm">
                                      {walmartPrice && (
                                        <span className="text-blue-400">
                                          Walmart: ${walmartPrice.price.toFixed(2)}
                                        </span>
                                      )}
                                      {krogerPrice && (
                                        <span className="text-orange-400">
                                          Kroger: ${krogerPrice.price.toFixed(2)}
                                        </span>
                                      )}
                                      {wholefoodsPrice && (
                                        <span className="text-green-400">
                                          Whole Foods: ${wholefoodsPrice.price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                <button
                                  onClick={() => toggleChecked(item.name)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Mark as completed"
                                >
                                  <Check className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {!showShoppingList && categoryOrder.map(category => {
          const items = groupedGroceries[category];
          if (!items || items.length === 0) return null;

          return (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-orange-400 mb-4 capitalize">
                {category} ({items.length} items)
              </h3>
              
              <div className="space-y-3">
                {items.map((item, index) => {
                  const isChecked = checkedItems.has(item.name);
                  let walmartPrice, krogerPrice, wholefoodsPrice;
                  
                  if (pricingData) {
                    walmartPrice = pricingData.walmart?.itemPrices?.find(p => p.name === item.name);
                    krogerPrice = pricingData.kroger?.itemPrices?.find(p => p.name === item.name);
                    wholefoodsPrice = pricingData.wholefoods?.itemPrices?.find(p => p.name === item.name);
                  }

                  return (
                    <div key={`${category}-${index}`} className={`bg-white/5 rounded-lg p-4 border border-white/10 transition-all ${
                      isChecked ? 'opacity-60' : 'hover:bg-white/10'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <button
                            onClick={() => toggleChecked(item.name)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1 ${
                              isChecked
                                ? 'bg-green-500 border-green-500'
                                : 'border-white/30 hover:border-green-400'
                            }`}
                          >
                            {isChecked && <Check className="w-4 h-4 text-white" />}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`font-medium text-white ${isChecked ? 'line-through' : ''}`}>
                                {item.name} - {item.amount.toFixed(2)} {item.unit}
                              </div>
                              {item.inInventory && (
                                <div className="flex items-center bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                                  <Home className="w-3 h-3 mr-1" />
                                  Have {item.inventoryAmount.toFixed(1)}
                                </div>
                              )}
                            </div>
                            
                            {/* Price Comparison */}
                            {pricingData && (
                              <div className="flex items-center space-x-6 mt-2 text-sm">
                                {walmartPrice && (
                                  <span className="text-blue-400">
                                    Walmart: <span className="font-medium">${walmartPrice.price.toFixed(2)}</span>
                                  </span>
                                )}
                                {krogerPrice && (
                                  <span className="text-orange-400">
                                    Kroger: <span className="font-medium">${krogerPrice.price.toFixed(2)}</span>
                                  </span>
                                )}
                                {wholefoodsPrice && (
                                  <span className="text-green-400">
                                    Whole Foods: <span className="font-medium">${wholefoodsPrice.price.toFixed(2)}</span>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Store Totals */}
      {pricingData && (
        <div className="mt-8 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Store Totals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(pricingData).map(([store, data]) => (
              <div
                key={store}
                className={`p-4 rounded-lg border ${
                  store === 'walmart' ? 'bg-blue-500/10 border-blue-400/30' :
                  store === 'kroger' ? 'bg-orange-500/10 border-orange-400/30' :
                  'bg-green-500/10 border-green-400/30'
                }`}
              >
                <div className="text-white font-semibold mb-2">{data.name}</div>
                <div className="text-2xl font-bold text-white">${data.total.toFixed(2)}</div>
                {data.deliveryFee > 0 && (
                  <div className="text-xs text-gray-400">
                    Includes ${data.deliveryFee} delivery
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zipcode Modal */}
      {showZipcodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Set Your Zipcode</h3>
            <input
              type="text"
              value={tempZipcode}
              onChange={(e) => setTempZipcode(e.target.value)}
              placeholder="Enter zipcode"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              maxLength={5}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowZipcodeModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateZipcode}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Selection Modal */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-96">
            <h3 className="text-xl font-semibold text-white mb-4">Choose Store Preference</h3>
            <div className="space-y-2 mb-4">
              {[
                { key: 'cheapest', label: 'Cheapest Items' },
                { key: 'walmart', label: 'Walmart' },
                { key: 'kroger', label: 'Kroger' },
                { key: 'wholefoods', label: 'Whole Foods' }
              ].map(option => (
                <button
                  key={option.key}
                  onClick={() => setTempStore(option.key)}
                  className={`w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between ${
                    tempStore === option.key 
                      ? 'bg-orange-500/20 border border-orange-500 text-orange-400' 
                      : 'bg-white/5 hover:bg-white/10 text-white'
                  }`}
                >
                  <span>{option.label}</span>
                  {tempStore === option.key && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStoreModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateStore}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroceryList;