import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import GroceryIntelligenceBot from './bots/GroceryIntelligenceBot';
import AppSyncBot from './bots/AppSyncBot';

const FitGeniusApp = () => {
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

  // App sync bot instance
  const [syncBot] = useState(() => new AppSyncBot());

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
      // Add more days...
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
      'chicken breast': 0.25, 'ground turkey': 0.25, 'salmon fillet': 0.25,
      'ground beef': 0.25, 'steak': 0.33, 'pork chops': 0.25, 'white fish': 0.25,
      'eggs': 2, 'greek yogurt': 1, 'quinoa': 0.25, 'brown rice': 0.25,
      'oats': 0.5, 'broccoli': 0.5, 'spinach': 2, 'mixed greens': 2,
      'avocado': 0.5, 'banana': 1, 'berries': 0.5, 'almonds': 0.25,
      'olive oil': 1, 'milk': 0.5, 'cheese': 0.25
    };
    return amounts[ingredient.toLowerCase()] || 1;
  };

  // Get ingredient unit
  const getIngredientUnit = (ingredient) => {
    const units = {
      'chicken breast': 'lb', 'ground turkey': 'lb', 'salmon fillet': 'lb',
      'ground beef': 'lb', 'steak': 'lb', 'pork chops': 'lb', 'white fish': 'lb',
      'eggs': 'dozen', 'greek yogurt': 'cup', 'quinoa': 'cup', 'brown rice': 'cup',
      'oats': 'cup', 'broccoli': 'lb', 'spinach': 'bunch', 'mixed greens': 'bag',
      'avocado': 'each', 'banana': 'each', 'berries': 'cup', 'almonds': 'cup',
      'olive oil': 'tbsp', 'milk': 'gallon', 'cheese': 'cup'
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
      
      // Sync with web app
      await syncBot.syncPricingData(analysis.analysis.pricingAnalysis);
    } catch (error) {
      console.error('Failed to load pricing data:', error);
      Alert.alert('Error', 'Failed to load pricing data. Please try again.');
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
  const savePreferences = async (preferences) => {
    try {
      const currentPrefs = {
        peopleCount,
        userZipcode,
        selectedStore,
        inventory,
        purchaseHistory,
        ...preferences
      };
      await AsyncStorage.setItem('fitgenius_preferences', JSON.stringify(currentPrefs));
      await syncBot.syncUserPreferences(currentPrefs);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  // Load user preferences
  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem('fitgenius_preferences');
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="basket" size={32} color="#ff6b35" style={styles.headerIcon} />
          <View>
            <Text style={styles.headerTitle}>FitGenius Grocery</Text>
            <Text style={styles.headerSubtitle}>Smart weekly meal planning</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Week Selector */}
        <View style={styles.weekSelector}>
          <TouchableOpacity 
            style={styles.weekArrow}
            onPress={() => setCurrentWeek(currentWeek - 1)}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.weekDisplay}>
            <Text style={styles.weekTitle}>
              {formatWeekDisplay(currentWeekDates)}
            </Text>
            <Text style={styles.weekSubtitle}>
              {currentWeek === 0 ? 'This Week' : 
               currentWeek === 1 ? 'Next Week' : 
               currentWeek === -1 ? 'Last Week' : 
               `Week ${currentWeek > 0 ? '+' : ''}${currentWeek}`}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.weekArrow}
            onPress={() => setCurrentWeek(currentWeek + 1)}
          >
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {/* People Count */}
          <View style={styles.controlCard}>
            <Text style={styles.controlLabel}>
              <Ionicons name="people" size={14} color="#9ca3af" /> People
            </Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>{peopleCount}</Text>
              <TouchableOpacity 
                style={styles.counterButton}
                onPress={() => setPeopleCount(peopleCount + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Zipcode */}
          <TouchableOpacity 
            style={styles.controlCard}
            onPress={() => {
              setTempZipcode(userZipcode);
              setShowZipcodeModal(true);
            }}
          >
            <Text style={styles.controlLabel}>
              <Ionicons name="location" size={14} color="#9ca3af" /> Zipcode
            </Text>
            <View style={styles.settingValue}>
              <Text style={styles.settingText}>{userZipcode || 'Set Location'}</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {/* Store Selection */}
          <TouchableOpacity 
            style={styles.controlCard}
            onPress={() => {
              setTempStore(selectedStore);
              setShowStoreModal(true);
            }}
          >
            <Text style={styles.controlLabel}>
              <Ionicons name="storefront" size={14} color="#9ca3af" /> Store
            </Text>
            <View style={styles.settingValue}>
              <Text style={styles.settingText}>
                {selectedStore === 'cheapest' ? 'Cheapest' :
                 selectedStore === 'walmart' ? 'Walmart' :
                 selectedStore === 'kroger' ? 'Kroger' :
                 selectedStore === 'wholefoods' ? 'Whole Foods' :
                 'Choose Store'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Grocery List by Category */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              <Ionicons name="basket" size={20} color="#ff6b35" /> Weekly Grocery List ({groceryList.length} items)
            </Text>
            
            {checkedItems.size > 0 && (
              <TouchableOpacity
                style={styles.shoppingListButton}
                onPress={() => setShowShoppingList(!showShoppingList)}
              >
                <Ionicons name="list" size={16} color="#ffffff" style={{marginRight: 4}} />
                <Text style={styles.shoppingListButtonText}>
                  {showShoppingList ? 'Show Full List' : `Shopping List (${checkedItems.size})`}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {loadingPrices && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ff6b35" />
              <Text style={styles.loadingText}>Loading prices...</Text>
            </View>
          )}

          {/* Shopping List View */}
          {showShoppingList && (
            <View style={styles.shoppingListContainer}>
              <Text style={styles.shoppingListTitle}>
                🛒 Shopping List - Organized by Store Layout
              </Text>
              
              {(() => {
                const organizedShopping = organizeShoppingListByAisle();
                const aisleCount = Object.keys(organizedShopping).length;
                
                if (aisleCount === 0) {
                  return (
                    <Text style={styles.emptyShoppingText}>
                      Select items from your grocery list to create a shopping list
                    </Text>
                  );
                }
                
                return (
                  <ScrollView style={styles.shoppingScrollView}>
                    {Object.entries(organizedShopping).map(([aisle, items]) => (
                      <View key={aisle} style={styles.aisleSection}>
                        <View style={styles.aisleHeader}>
                          <Text style={styles.aisleTitle}>📍 {aisle}</Text>
                          <View style={styles.aisleCounter}>
                            <Text style={styles.aisleCounterText}>
                              {items.length} item{items.length > 1 ? 's' : ''}
                            </Text>
                          </View>
                        </View>
                        
                        {items.map((item, index) => {
                          let walmartPrice, krogerPrice, wholefoodsPrice;
                          
                          if (pricingData) {
                            walmartPrice = pricingData.walmart?.itemPrices?.find(p => p.name === item.name);
                            krogerPrice = pricingData.kroger?.itemPrices?.find(p => p.name === item.name);
                            wholefoodsPrice = pricingData.wholefoods?.itemPrices?.find(p => p.name === item.name);
                          }
                          
                          return (
                            <View key={index} style={styles.shoppingItem}>
                              <View style={styles.shoppingItemContent}>
                                <View style={styles.shoppingItemInfo}>
                                  <Text style={styles.shoppingItemName}>
                                    ✅ {item.name} - {item.amount.toFixed(2)} {item.unit}
                                  </Text>
                                  
                                  {/* Price Comparison for Shopping List */}
                                  {pricingData && (
                                    <View style={styles.shoppingPriceContainer}>
                                      {walmartPrice && (
                                        <Text style={styles.walmartPrice}>
                                          Walmart: ${walmartPrice.price.toFixed(2)}
                                        </Text>
                                      )}
                                      {krogerPrice && (
                                        <Text style={styles.krogerPrice}>
                                          Kroger: ${krogerPrice.price.toFixed(2)}
                                        </Text>
                                      )}
                                      {wholefoodsPrice && (
                                        <Text style={styles.wholefoodsPrice}>
                                          Whole Foods: ${wholefoodsPrice.price.toFixed(2)}
                                        </Text>
                                      )}
                                    </View>
                                  )}
                                </View>
                                
                                <TouchableOpacity
                                  style={styles.checkButton}
                                  onPress={() => toggleChecked(item.name)}
                                >
                                  <Ionicons name="checkmark" size={20} color="#22c55e" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    ))}
                  </ScrollView>
                );
              })()}
            </View>
          )}

          {!showShoppingList && categoryOrder.map(category => {
            const items = groupedGroceries[category];
            if (!items || items.length === 0) return null;

            return (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({items.length})
                </Text>
                
                {items.map((item, index) => {
                  const isChecked = checkedItems.has(item.name);
                  let walmartPrice, krogerPrice, wholefoodsPrice;
                  
                  if (pricingData) {
                    walmartPrice = pricingData.walmart?.itemPrices?.find(p => p.name === item.name);
                    krogerPrice = pricingData.kroger?.itemPrices?.find(p => p.name === item.name);
                    wholefoodsPrice = pricingData.wholefoods?.itemPrices?.find(p => p.name === item.name);
                  }

                  return (
                    <View key={`${category}-${index}`} style={[styles.listItem, isChecked && styles.checkedItem]}>
                      <View style={styles.itemHeader}>
                        <TouchableOpacity
                          style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                          onPress={() => toggleChecked(item.name)}
                        >
                          {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </TouchableOpacity>
                        
                        <View style={styles.itemInfo}>
                          <View style={styles.itemNameRow}>
                            <Text style={[styles.itemName, isChecked && styles.strikethrough]}>
                              {item.name} - {item.amount.toFixed(2)} {item.unit}
                            </Text>
                            {item.inInventory && (
                              <View style={styles.inventoryBadge}>
                                <Ionicons name="home" size={10} color="#10b981" />
                                <Text style={styles.inventoryText}>Have {item.inventoryAmount.toFixed(1)}</Text>
                              </View>
                            )}
                          </View>
                          
                          {/* Price Comparison */}
                          {pricingData && (
                            <View style={styles.priceContainer}>
                              {walmartPrice && (
                                <Text style={styles.priceText}>
                                  <Text style={styles.storeWalmart}>Walmart:</Text> ${walmartPrice.price.toFixed(2)}
                                </Text>
                              )}
                              {krogerPrice && (
                                <Text style={styles.priceText}>
                                  <Text style={styles.storeKroger}>Kroger:</Text> ${krogerPrice.price.toFixed(2)}
                                </Text>
                              )}
                              {wholefoodsPrice && (
                                <Text style={styles.priceText}>
                                  <Text style={styles.storeWholefoods}>Whole Foods:</Text> ${wholefoodsPrice.price.toFixed(2)}
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Store Totals */}
        {pricingData && (
          <View style={styles.totalsContainer}>
            <Text style={styles.totalsTitle}>
              <Ionicons name="cash" size={18} color="#10b981" /> Store Totals
            </Text>
            <View style={styles.totalsGrid}>
              {Object.entries(pricingData).map(([store, data]) => (
                <View key={store} style={[
                  styles.totalCard,
                  store === 'walmart' && styles.walmartCard,
                  store === 'kroger' && styles.krogerCard,
                  store === 'wholefoods' && styles.wholefoodsCard
                ]}>
                  <Text style={styles.totalStoreName}>{data.name}</Text>
                  <Text style={styles.totalAmount}>${data.total.toFixed(2)}</Text>
                  {data.deliveryFee > 0 && (
                    <Text style={styles.totalDelivery}>
                      +${data.deliveryFee} delivery
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Zipcode Modal */}
      <Modal visible={showZipcodeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Your Zipcode</Text>
            <TextInput
              style={styles.modalInput}
              value={tempZipcode}
              onChangeText={setTempZipcode}
              placeholder="Enter zipcode"
              placeholderTextColor="#6b7280"
              keyboardType="numeric"
              maxLength={5}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setShowZipcodeModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSave}
                onPress={updateZipcode}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Store Selection Modal */}
      <Modal visible={showStoreModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Store Preference</Text>
            {[
              { key: 'cheapest', label: 'Cheapest Items' },
              { key: 'walmart', label: 'Walmart' },
              { key: 'kroger', label: 'Kroger' },
              { key: 'wholefoods', label: 'Whole Foods' }
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[styles.storeOption, tempStore === option.key && styles.storeOptionSelected]}
                onPress={() => setTempStore(option.key)}
              >
                <Text style={[styles.storeOptionText, tempStore === option.key && styles.storeOptionTextSelected]}>
                  {option.label}
                </Text>
                {tempStore === option.key && <Ionicons name="checkmark" size={20} color="#ff6b35" />}
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => setShowStoreModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonSave}
                onPress={updateStore}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d44',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  weekArrow: {
    padding: 8,
  },
  weekDisplay: {
    flex: 1,
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  weekSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
    marginTop: 2,
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  controlCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    fontWeight: '500',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 8,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkedItem: {
    opacity: 0.6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  itemInfo: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  inventoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  inventoryText: {
    color: '#10b981',
    fontSize: 10,
    marginLeft: 2,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  priceText: {
    color: '#fff',
    fontSize: 11,
  },
  storeWalmart: {
    color: '#3b82f6',
  },
  storeKroger: {
    color: '#f59e0b',
  },
  storeWholefoods: {
    color: '#10b981',
  },
  totalsContainer: {
    margin: 16,
    marginTop: 20,
  },
  totalsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  totalsGrid: {
    gap: 10,
  },
  totalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
  },
  walmartCard: {
    borderColor: 'rgba(59, 130, 246, 0.3)',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  krogerCard: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  wholefoodsCard: {
    borderColor: 'rgba(16, 185, 129, 0.3)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  totalStoreName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalAmount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalDelivery: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  storeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  storeOptionSelected: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderWidth: 1,
    borderColor: '#ff6b35',
  },
  storeOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  storeOptionTextSelected: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSave: {
    flex: 1,
    backgroundColor: '#ff6b35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Shopping List Styles
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shoppingListButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shoppingListButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  shoppingListContainer: {
    marginBottom: 16,
  },
  shoppingListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 16,
  },
  emptyShoppingText: {
    color: '#9ca3af',
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14,
  },
  shoppingScrollView: {
    maxHeight: 400,
  },
  aisleSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aisleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  aisleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b35',
  },
  aisleCounter: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aisleCounterText: {
    color: '#ff6b35',
    fontSize: 11,
    fontWeight: '600',
  },
  shoppingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  shoppingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shoppingItemInfo: {
    flex: 1,
  },
  shoppingItemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  shoppingPriceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  walmartPrice: {
    color: '#60a5fa',
    fontSize: 12,
    marginRight: 12,
  },
  krogerPrice: {
    color: '#fb923c',
    fontSize: 12,
    marginRight: 12,
  },
  wholefoodsPrice: {
    color: '#34d399',
    fontSize: 12,
    marginRight: 12,
  },
  checkButton: {
    padding: 8,
  },
});

export default FitGeniusApp;