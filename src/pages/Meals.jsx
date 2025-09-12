import React, { useState } from 'react';
import { Utensils, Clock, Users, Heart, Plus, Search, Filter, CheckCircle, ChefHat, Flame, Star, Sparkles, Zap } from 'lucide-react';
import { calculateUniversalNutrition, formatNutritionDisplay } from '../utils/nutritionCalculator';

const Meals = ({ userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedMeals, setSavedMeals] = useState([]);
  const [showRecipe, setShowRecipe] = useState(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showAllergiesSelector, setShowAllergiesSelector] = useState(false);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [showWeeklyPlanUpdate, setShowWeeklyPlanUpdate] = useState(false);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [aiMealRequirements, setAiMealRequirements] = useState({
    mealType: 'lunch',
    calories: '',
    dietary: 'none',
    cuisine: 'any',
    cookTime: '30'
  });
  const [generatedMeal, setGeneratedMeal] = useState(null);
  const [generatingMeal, setGeneratingMeal] = useState(false);

  // Top 15 common food allergies
  const commonAllergies = [
    { id: 'milk', name: 'Milk/Dairy', keywords: ['milk', 'dairy', 'cheese', 'yogurt', 'butter', 'cream', 'lactose'] },
    { id: 'eggs', name: 'Eggs', keywords: ['egg', 'eggs', 'mayonnaise', 'mayo'] },
    { id: 'peanuts', name: 'Peanuts', keywords: ['peanut', 'peanuts', 'peanut butter'] },
    { id: 'tree_nuts', name: 'Tree Nuts', keywords: ['almond', 'walnut', 'cashew', 'pecan', 'pistachio', 'hazelnut', 'macadamia'] },
    { id: 'shellfish', name: 'Shellfish', keywords: ['shrimp', 'crab', 'lobster', 'oyster', 'clam', 'scallop', 'crawfish'] },
    { id: 'fish', name: 'Fish', keywords: ['salmon', 'tuna', 'cod', 'mackerel', 'sardine', 'anchovy', 'fish'] },
    { id: 'wheat', name: 'Wheat', keywords: ['wheat', 'flour', 'bread', 'pasta', 'cereal', 'crackers'] },
    { id: 'soy', name: 'Soy', keywords: ['soy', 'soybean', 'tofu', 'soy sauce', 'tempeh', 'miso'] },
    { id: 'sesame', name: 'Sesame', keywords: ['sesame', 'tahini', 'sesame oil', 'sesame seeds'] },
    { id: 'gluten', name: 'Gluten', keywords: ['gluten', 'wheat', 'barley', 'rye', 'bread', 'pasta'] },
    { id: 'corn', name: 'Corn', keywords: ['corn', 'cornstarch', 'corn syrup', 'corn oil'] },
    { id: 'sulfites', name: 'Sulfites', keywords: ['sulfite', 'wine', 'dried fruit'] },
    { id: 'nightshades', name: 'Nightshades', keywords: ['tomato', 'potato', 'eggplant', 'pepper', 'paprika'] },
    { id: 'coconut', name: 'Coconut', keywords: ['coconut', 'coconut oil', 'coconut milk'] },
    { id: 'mustard', name: 'Mustard', keywords: ['mustard', 'mustard seed'] }
  ];

  const toggleAllergy = (allergyId) => {
    setSelectedAllergies(prev => 
      prev.includes(allergyId) 
        ? prev.filter(id => id !== allergyId)
        : [...prev, allergyId]
    );
  };

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
    const updatedPlan = [...existingPlan, ...selectedMeals.map(meal => ({
      ...meal,
      scheduledFor: 'user-selected',
      addedDate: new Date().toISOString()
    }))];
    
    localStorage.setItem('weeklyMealPlan', JSON.stringify(updatedPlan));
    setShowWeeklyPlanUpdate(true);
    setSelectedMeals([]);
    
    setTimeout(() => setShowWeeklyPlanUpdate(false), 3000);
  };

  const checkMealForAllergies = (meal) => {
    if (selectedAllergies.length === 0) return false;
    
    const ingredients = meal.ingredients?.join(' ').toLowerCase() || '';
    const description = meal.description?.toLowerCase() || '';
    const name = meal.name?.toLowerCase() || '';
    const searchText = `${ingredients} ${description} ${name}`;
    
    return selectedAllergies.some(allergyId => {
      const allergy = commonAllergies.find(a => a.id === allergyId);
      return allergy?.keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  };

  // Sample meal data based on user goals
  const getMealsForGoal = (goal) => {
    const meals = {
      lose_weight: [
        {
          id: 1,
          name: 'Greek Chicken Bowl',
          category: 'lunch',
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 18,
          prepTime: '15 mins',
          servings: 1,
          difficulty: 'Easy',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
          description: 'Fresh Mediterranean flavors with lean protein',
          ingredients: [
            '6oz grilled chicken breast',
            '1/2 cup quinoa',
            '1/4 cup cucumber, diced',
            '2 tbsp feta cheese',
            '2 tbsp Greek yogurt',
            '1 tbsp olive oil',
            'Fresh herbs (dill, parsley)'
          ],
          instructions: [
            'Cook quinoa according to package directions',
            'Grill chicken breast until cooked through',
            'Dice cucumber and mix with herbs',
            'Assemble bowl with quinoa base',
            'Top with chicken, cucumber mix, feta',
            'Drizzle with yogurt and olive oil'
          ]
        },
        {
          id: 2,
          name: 'Veggie Scramble',
          category: 'breakfast',
          calories: 280,
          protein: 18,
          carbs: 12,
          fat: 16,
          prepTime: '10 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Protein-packed breakfast with colorful vegetables',
          ingredients: [
            '3 large eggs',
            '1/4 cup bell peppers, diced',
            '1/4 cup spinach',
            '2 tbsp onion, diced',
            '1 tbsp olive oil',
            'Salt and pepper to taste'
          ],
          instructions: [
            'Heat olive oil in non-stick pan',
            'Sauté onions and peppers until soft',
            'Add spinach and cook until wilted',
            'Beat eggs and pour into pan',
            'Scramble until eggs are cooked through',
            'Season with salt and pepper'
          ]
        },
        {
          id: 31,
          name: 'Cauliflower Rice Stir-Fry',
          category: 'dinner',
          calories: 320,
          protein: 28,
          carbs: 18,
          fat: 16,
          prepTime: '20 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Low-carb vegetable stir-fry with lean protein',
          ingredients: [
            '5oz chicken breast, diced',
            '2 cups cauliflower rice',
            '1/2 cup mixed vegetables',
            '2 tbsp olive oil',
            '2 tbsp soy sauce',
            '1 clove garlic, minced',
            '1 tsp ginger'
          ],
          instructions: [
            'Heat oil in large pan over medium-high heat',
            'Cook chicken until golden, about 6 minutes',
            'Add garlic and ginger, cook 30 seconds',
            'Add vegetables, cook 3 minutes',
            'Add cauliflower rice and soy sauce',
            'Stir-fry for 4-5 minutes until heated through',
            'Serve immediately'
          ]
        },
        {
          id: 32,
          name: 'Zucchini Noodle Salad',
          category: 'lunch',
          calories: 280,
          protein: 22,
          carbs: 12,
          fat: 18,
          prepTime: '15 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Fresh, light salad with spiralized zucchini',
          ingredients: [
            '2 medium zucchini, spiralized',
            '4oz grilled chicken breast',
            '1/4 cup cherry tomatoes',
            '2 tbsp pine nuts',
            '2 tbsp pesto',
            '1 tbsp lemon juice',
            '2 tbsp parmesan cheese'
          ],
          instructions: [
            'Spiralize zucchini into noodles',
            'Slice chicken into strips',
            'Halve cherry tomatoes',
            'Mix pesto with lemon juice',
            'Toss zucchini noodles with dressing',
            'Top with chicken, tomatoes, and pine nuts',
            'Finish with parmesan cheese'
          ]
        },
        {
          id: 33,
          name: 'Turkey Meatball Bowl',
          category: 'dinner',
          calories: 380,
          protein: 32,
          carbs: 22,
          fat: 20,
          prepTime: '25 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Lean turkey meatballs with fresh vegetables',
          ingredients: [
            '5oz ground turkey (93% lean)',
            '1/4 cup breadcrumbs',
            '1 egg white',
            '1 cup baby spinach',
            '1/2 cup quinoa, cooked',
            '1/4 cup marinara sauce',
            '1 tbsp olive oil'
          ],
          instructions: [
            'Mix turkey, breadcrumbs, and egg white',
            'Form into 8 small meatballs',
            'Heat oil in pan, cook meatballs 12 minutes',
            'Warm marinara sauce',
            'Serve meatballs over quinoa and spinach',
            'Top with marinara sauce',
            'Season with herbs if desired'
          ]
        },
        {
          id: 34,
          name: 'Coconut Chia Pudding',
          category: 'breakfast',
          calories: 320,
          protein: 12,
          carbs: 18,
          fat: 24,
          prepTime: '10 mins + overnight',
          servings: 1,
          difficulty: 'Easy',
          description: 'Creamy, nutritious pudding perfect for meal prep',
          ingredients: [
            '3 tbsp chia seeds',
            '1 cup unsweetened coconut milk',
            '1 tbsp maple syrup',
            '1/2 tsp vanilla extract',
            '1/4 cup berries',
            '1 tbsp sliced almonds',
            '1 tsp coconut flakes'
          ],
          instructions: [
            'Mix chia seeds, coconut milk, maple syrup, vanilla',
            'Whisk well and let sit 5 minutes',
            'Whisk again to prevent clumping',
            'Refrigerate overnight or at least 4 hours',
            'Stir before serving',
            'Top with berries, almonds, and coconut',
            'Enjoy chilled'
          ]
        },
        {
          id: 35,
          name: 'Asian Lettuce Wraps',
          category: 'lunch',
          calories: 290,
          protein: 26,
          carbs: 15,
          fat: 16,
          prepTime: '20 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Light, flavorful wraps with ground turkey',
          ingredients: [
            '5oz ground turkey (93% lean)',
            '8 butter lettuce leaves',
            '1/4 cup water chestnuts, diced',
            '2 green onions, chopped',
            '1 tbsp sesame oil',
            '2 tbsp soy sauce',
            '1 tsp sriracha',
            '1 tsp ginger, minced'
          ],
          instructions: [
            'Heat sesame oil in large pan',
            'Cook turkey until browned, 6-8 minutes',
            'Add ginger, cook 1 minute',
            'Stir in soy sauce, sriracha, water chestnuts',
            'Cook 2 more minutes',
            'Remove from heat, add green onions',
            'Serve in lettuce cups'
          ]
        },
        {
          id: 36,
          name: 'Baked Cod with Vegetables',
          category: 'dinner',
          calories: 340,
          protein: 38,
          carbs: 20,
          fat: 12,
          prepTime: '30 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Flaky white fish with roasted vegetables',
          ingredients: [
            '6oz cod fillet',
            '1 cup broccoli florets',
            '1/2 cup cherry tomatoes',
            '1/4 cup red onion, sliced',
            '2 tbsp olive oil',
            '1 lemon, juiced and zested',
            '1 tsp garlic powder',
            'Salt and pepper to taste'
          ],
          instructions: [
            'Preheat oven to 400°F',
            'Toss vegetables with 1 tbsp oil and seasonings',
            'Place on baking sheet, roast 15 minutes',
            'Season cod with lemon juice, zest, garlic powder',
            'Add cod to pan with vegetables',
            'Drizzle with remaining oil',
            'Bake 12-15 minutes until fish flakes easily'
          ]
        }
      ],
      gain_muscle: [
        {
          id: 3,
          name: 'Protein Power Smoothie',
          category: 'snack',
          calories: 520,
          protein: 42,
          carbs: 45,
          fat: 18,
          prepTime: '5 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'High-protein smoothie perfect for post-workout',
          ingredients: [
            '1 scoop whey protein powder',
            '1 banana',
            '1 cup whole milk',
            '2 tbsp peanut butter',
            '1 tbsp honey',
            '1/2 cup oats',
            'Ice cubes'
          ],
          instructions: [
            'Add all ingredients to blender',
            'Blend until smooth and creamy',
            'Add ice for desired consistency',
            'Pour into large glass and enjoy'
          ]
        },
        {
          id: 4,
          name: 'Steak & Sweet Potato',
          category: 'dinner',
          calories: 650,
          protein: 48,
          carbs: 35,
          fat: 28,
          prepTime: '25 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Classic muscle-building combination',
          ingredients: [
            '8oz sirloin steak',
            '1 medium sweet potato',
            '1 cup broccoli',
            '2 tbsp butter',
            '1 tbsp olive oil',
            'Garlic powder, salt, pepper'
          ],
          instructions: [
            'Bake sweet potato at 400°F for 45 minutes',
            'Season steak with salt, pepper, garlic powder',
            'Heat olive oil in cast iron pan',
            'Sear steak 4-5 minutes per side',
            'Steam broccoli until tender',
            'Serve steak with sweet potato and vegetables'
          ]
        },
        {
          id: 37,
          name: 'Mass Gainer Smoothie Bowl',
          category: 'breakfast',
          calories: 720,
          protein: 45,
          carbs: 65,
          fat: 28,
          prepTime: '10 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'High-calorie breakfast bowl for muscle building',
          ingredients: [
            '2 scoops whey protein powder',
            '1 large banana',
            '1 cup whole milk',
            '2 tbsp peanut butter',
            '1/4 cup oats',
            '1 tbsp chia seeds',
            '1/4 cup granola',
            '2 tbsp honey'
          ],
          instructions: [
            'Blend protein powder, banana, milk, peanut butter',
            'Add oats and chia seeds, blend again',
            'Pour into bowl',
            'Top with granola',
            'Drizzle with honey',
            'Enjoy immediately'
          ]
        },
        {
          id: 38,
          name: 'Loaded Chicken Wrap',
          category: 'lunch',
          calories: 680,
          protein: 48,
          carbs: 52,
          fat: 26,
          prepTime: '15 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Protein-packed wrap with plenty of calories',
          ingredients: [
            '8oz grilled chicken breast',
            '1 large whole wheat tortilla',
            '1/4 cup hummus',
            '1/4 avocado, sliced',
            '1/4 cup shredded cheese',
            '2 tbsp ranch dressing',
            '1/4 cup mixed greens',
            '1/4 cup chickpeas'
          ],
          instructions: [
            'Warm tortilla in microwave 30 seconds',
            'Spread hummus across tortilla',
            'Add chicken, avocado, cheese',
            'Drizzle with ranch dressing',
            'Add greens and chickpeas',
            'Roll tightly and secure with toothpick',
            'Cut in half and serve'
          ]
        },
        {
          id: 39,
          name: 'Power Pasta Bowl',
          category: 'dinner',
          calories: 750,
          protein: 52,
          carbs: 78,
          fat: 22,
          prepTime: '25 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'High-carb pasta dish for muscle building',
          ingredients: [
            '2 cups whole wheat pasta',
            '6oz ground turkey (93% lean)',
            '1/2 cup marinara sauce',
            '1/4 cup mozzarella cheese',
            '2 tbsp olive oil',
            '1/4 cup sun-dried tomatoes',
            '2 tbsp pine nuts',
            '1/4 cup basil leaves'
          ],
          instructions: [
            'Cook pasta according to package directions',
            'Brown turkey in olive oil, 8-10 minutes',
            'Add marinara sauce, simmer 5 minutes',
            'Drain pasta, combine with turkey sauce',
            'Add sun-dried tomatoes and pine nuts',
            'Top with mozzarella and basil',
            'Serve hot'
          ]
        },
        {
          id: 40,
          name: 'Muscle-Building Oatmeal',
          category: 'breakfast',
          calories: 580,
          protein: 32,
          carbs: 68,
          fat: 18,
          prepTime: '10 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Protein-rich oatmeal for morning fuel',
          ingredients: [
            '1 cup old-fashioned oats',
            '1 scoop vanilla protein powder',
            '1 1/2 cups whole milk',
            '1 large banana, sliced',
            '2 tbsp almond butter',
            '1 tbsp maple syrup',
            '1/4 cup berries',
            '1 tbsp chopped walnuts'
          ],
          instructions: [
            'Cook oats with milk according to package',
            'Stir in protein powder while hot',
            'Add half the banana and almond butter',
            'Drizzle with maple syrup',
            'Top with remaining banana, berries, walnuts',
            'Mix well and serve warm'
          ]
        },
        {
          id: 41,
          name: 'Post-Workout Recovery Bowl',
          category: 'snack',
          calories: 520,
          protein: 38,
          carbs: 45,
          fat: 20,
          prepTime: '5 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Perfect post-workout nutrition combination',
          ingredients: [
            '1 cup Greek yogurt (plain)',
            '1 scoop chocolate protein powder',
            '1 medium banana',
            '2 tbsp granola',
            '1 tbsp honey',
            '1/4 cup berries',
            '1 tbsp chopped almonds'
          ],
          instructions: [
            'Mix Greek yogurt with protein powder',
            'Slice banana',
            'Layer yogurt mixture in bowl',
            'Top with banana slices and berries',
            'Sprinkle granola and almonds',
            'Drizzle with honey',
            'Eat within 30 minutes post-workout'
          ]
        },
        {
          id: 42,
          name: 'High-Protein Pizza',
          category: 'dinner',
          calories: 680,
          protein: 44,
          carbs: 58,
          fat: 28,
          prepTime: '20 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Protein-packed pizza for muscle building',
          ingredients: [
            '1 whole wheat naan bread',
            '1/4 cup pizza sauce',
            '1/2 cup mozzarella cheese',
            '4oz grilled chicken breast, diced',
            '2 tbsp parmesan cheese',
            '1/4 cup bell peppers',
            '2 tbsp olive oil',
            'Italian herbs'
          ],
          instructions: [
            'Preheat oven to 425°F',
            'Brush naan with olive oil',
            'Spread pizza sauce evenly',
            'Add mozzarella and diced chicken',
            'Top with bell peppers and parmesan',
            'Bake 12-15 minutes until cheese melts',
            'Sprinkle with Italian herbs before serving'
          ]
        }
      ],
      maintain: [
        {
          id: 5,
          name: 'Balanced Buddha Bowl',
          category: 'lunch',
          calories: 480,
          protein: 22,
          carbs: 45,
          fat: 24,
          prepTime: '20 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Perfectly balanced nutrients in one delicious bowl',
          ingredients: [
            '1/2 cup brown rice',
            '4oz grilled tofu',
            '1/4 avocado',
            '1/2 cup roasted chickpeas',
            '1 cup mixed greens',
            '2 tbsp tahini dressing',
            'Sesame seeds for topping'
          ],
          instructions: [
            'Cook brown rice according to package',
            'Grill tofu until golden on both sides',
            'Roast chickpeas with olive oil and spices',
            'Arrange rice, greens, and toppings in bowl',
            'Drizzle with tahini dressing',
            'Sprinkle with sesame seeds'
          ]
        },
        {
          id: 43,
          name: 'Mediterranean Quinoa Salad',
          category: 'lunch',
          calories: 450,
          protein: 18,
          carbs: 52,
          fat: 20,
          prepTime: '20 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Fresh Mediterranean flavors with quinoa',
          ingredients: [
            '3/4 cup cooked quinoa',
            '1/4 cup cucumber, diced',
            '1/4 cup cherry tomatoes',
            '2 tbsp feta cheese',
            '2 tbsp olives',
            '2 tbsp olive oil',
            '1 tbsp lemon juice',
            'Fresh herbs'
          ],
          instructions: [
            'Cool cooked quinoa completely',
            'Dice cucumber and halve tomatoes',
            'Whisk olive oil with lemon juice',
            'Mix quinoa with vegetables',
            'Add feta and olives',
            'Toss with dressing',
            'Garnish with fresh herbs'
          ]
        },
        {
          id: 44,
          name: 'Breakfast Burrito',
          category: 'breakfast',
          calories: 520,
          protein: 24,
          carbs: 48,
          fat: 26,
          prepTime: '15 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Hearty breakfast wrap with eggs and vegetables',
          ingredients: [
            '2 large eggs',
            '1 large whole wheat tortilla',
            '1/4 cup black beans',
            '1/4 cup shredded cheese',
            '1/4 avocado, sliced',
            '2 tbsp salsa',
            '1 tbsp olive oil',
            '1/4 cup bell peppers'
          ],
          instructions: [
            'Heat oil in pan, sauté peppers 3 minutes',
            'Scramble eggs until just set',
            'Warm tortilla in microwave',
            'Add eggs, beans, cheese to tortilla',
            'Top with avocado and salsa',
            'Roll tightly, tucking in sides',
            'Cut in half and serve immediately'
          ]
        },
        {
          id: 45,
          name: 'Baked Salmon with Rice',
          category: 'dinner',
          calories: 490,
          protein: 36,
          carbs: 45,
          fat: 18,
          prepTime: '25 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Perfectly baked salmon with seasoned rice',
          ingredients: [
            '5oz salmon fillet',
            '1/2 cup brown rice, cooked',
            '1 cup steamed broccoli',
            '1 tbsp olive oil',
            '1 lemon, sliced',
            '1 tsp garlic powder',
            '1 tsp dried herbs',
            'Salt and pepper'
          ],
          instructions: [
            'Preheat oven to 400°F',
            'Season salmon with garlic powder and herbs',
            'Place on baking sheet with lemon slices',
            'Drizzle with olive oil',
            'Bake 15-18 minutes until flaky',
            'Steam broccoli until tender',
            'Serve salmon over rice with broccoli'
          ]
        },
        {
          id: 46,
          name: 'Energy Smoothie Bowl',
          category: 'snack',
          calories: 380,
          protein: 20,
          carbs: 45,
          fat: 16,
          prepTime: '10 mins',
          servings: 1,
          difficulty: 'Easy',
          description: 'Nutrient-packed smoothie bowl for sustained energy',
          ingredients: [
            '1/2 cup Greek yogurt',
            '1/2 banana',
            '1/2 cup berries',
            '1 tbsp almond butter',
            '1/4 cup granola',
            '1 tbsp chia seeds',
            '1/2 cup almond milk',
            '1 tsp honey'
          ],
          instructions: [
            'Blend yogurt, banana, berries, almond milk',
            'Pour into bowl',
            'Top with granola and chia seeds',
            'Add almond butter',
            'Drizzle with honey',
            'Enjoy immediately'
          ]
        },
        {
          id: 47,
          name: 'Chicken and Sweet Potato',
          category: 'dinner',
          calories: 520,
          protein: 40,
          carbs: 42,
          fat: 18,
          prepTime: '35 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Balanced meal with lean protein and complex carbs',
          ingredients: [
            '6oz chicken thigh, boneless',
            '1 medium sweet potato',
            '1 cup green beans',
            '2 tbsp olive oil',
            '1 tsp paprika',
            '1 tsp garlic powder',
            '1/2 tsp cumin',
            'Salt and pepper'
          ],
          instructions: [
            'Preheat oven to 425°F',
            'Cut sweet potato into cubes',
            'Toss with 1 tbsp oil and seasonings',
            'Roast 20 minutes',
            'Season chicken with spices',
            'Sear in remaining oil, 6 minutes per side',
            'Steam green beans until crisp-tender'
          ]
        },
        {
          id: 48,
          name: 'Veggie-Packed Omelet',
          category: 'breakfast',
          calories: 420,
          protein: 28,
          carbs: 18,
          fat: 26,
          prepTime: '15 mins',
          servings: 1,
          difficulty: 'Medium',
          description: 'Protein-rich omelet loaded with fresh vegetables',
          ingredients: [
            '3 large eggs',
            '1/4 cup mushrooms, sliced',
            '1/4 cup spinach',
            '1/4 cup bell peppers',
            '1/4 cup cheese',
            '2 tbsp olive oil',
            '1 tbsp chives',
            'Salt and pepper'
          ],
          instructions: [
            'Heat 1 tbsp oil in non-stick pan',
            'Sauté mushrooms and peppers 3 minutes',
            'Add spinach, cook until wilted',
            'Beat eggs with salt and pepper',
            'Pour eggs over vegetables',
            'Add cheese to one half',
            'Fold omelet and slide onto plate'
          ]
        }
      ]
    };
    
    return meals[goal] || meals.maintain;
  };

  // Get universal nutrition data
  const nutrition = calculateUniversalNutrition(userProfile);
  const nutritionDisplay = formatNutritionDisplay(nutrition);

  // Include user-generated meals from localStorage
  const userGeneratedMeals = JSON.parse(localStorage.getItem('userGeneratedMeals') || '[]');
  
  const allMeals = [
    ...getMealsForGoal('lose_weight'),
    ...getMealsForGoal('gain_muscle'),
    ...getMealsForGoal('maintain'),
    ...userGeneratedMeals
  ];

  // Filter meals based on category, search, and allergies
  const filteredMeals = allMeals.filter(meal => {
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const hasAllergy = checkMealForAllergies(meal);
    return matchesCategory && matchesSearch && !hasAllergy;
  });

  const saveMeal = (mealId) => {
    if (!savedMeals.includes(mealId)) {
      setSavedMeals([...savedMeals, mealId]);
    }
  };

  const removeSavedMeal = (mealId) => {
    setSavedMeals(savedMeals.filter(id => id !== mealId));
  };

  // AI Meal Generation Function (simulated)
  const generateAIMeal = async () => {
    setGeneratingMeal(true);
    
    // Calculate target calories based on user profile if not specified
    const targetCalories = aiMealRequirements.calories || calculateMealCalories();
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Calculate macros based on user goals and preferences
    const calories = parseInt(targetCalories);
    const protein = calculateMealProtein(calories);
    
    // Adjust other macros based on goals and 75 Hard
    let carbPercentage = 0.40; // Default 40%
    let fatPercentage = 0.35;  // Default 35%
    
    if (userProfile?.goal === 'lose_weight') {
      carbPercentage = 0.35; // Lower carbs for weight loss
      fatPercentage = 0.35;
    } else if (userProfile?.goal === 'gain_muscle') {
      carbPercentage = 0.45; // Higher carbs for muscle building
      fatPercentage = 0.20;
    } else if (userProfile?.is75Hard) {
      carbPercentage = 0.35; // Moderate carbs for 75 Hard
      fatPercentage = 0.35;
    }
    
    const carbs = Math.round((calories * carbPercentage) / 4); // 4 calories per gram
    const fat = Math.round((calories * fatPercentage) / 9); // 9 calories per gram

    // Generate a meal based on requirements (this would normally call ChatGPT API)
    const aiGeneratedMeal = {
      id: Date.now(),
      name: generateMealName(aiMealRequirements),
      category: aiMealRequirements.mealType,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      prepTime: `${aiMealRequirements.cookTime} mins`,
      servings: 1,
      difficulty: 'Medium',
      description: `AI-generated ${aiMealRequirements.cuisine} ${aiMealRequirements.mealType} tailored to your ${userProfile?.goal?.replace('_', ' ')} goal${userProfile?.is75Hard ? ' (75 Hard compatible)' : ''}`,
      ingredients: generateIngredients(aiMealRequirements),
      instructions: generateInstructions(aiMealRequirements),
      isAIGenerated: true
    };
    
    // Save AI-generated meal to user's profile permanently
    const existingGeneratedMeals = JSON.parse(localStorage.getItem('userGeneratedMeals') || '[]');
    existingGeneratedMeals.push(aiGeneratedMeal);
    localStorage.setItem('userGeneratedMeals', JSON.stringify(existingGeneratedMeals));
    
    setGeneratedMeal(aiGeneratedMeal);
    setGeneratingMeal(false);
  };

  const calculateMealCalories = () => {
    if (!userProfile) return 400;
    
    // Use universal nutrition distribution
    const mealDistribution = nutrition.mealDistribution;
    return mealDistribution[aiMealRequirements.mealType] || Math.round(nutrition.dailyCalories * 0.25);
  };

  // Calculate protein needs for meals
  const calculateMealProtein = (calories) => {
    // Use universal protein distribution
    const proteinDistribution = nutrition.proteinDistribution;
    return proteinDistribution[aiMealRequirements.mealType] || Math.round(nutrition.dailyProtein * 0.25);
  };

  const generateMealName = (requirements) => {
    const prefixes = {
      breakfast: ['Energizing', 'Morning', 'Power', 'Fresh'],
      lunch: ['Satisfying', 'Hearty', 'Balanced', 'Gourmet'],
      dinner: ['Comfort', 'Wholesome', 'Savory', 'Delicious'],
      snack: ['Quick', 'Protein', 'Healthy', 'Energy']
    };
    
    const cuisineWords = {
      italian: ['Tuscan', 'Mediterranean', 'Roma'],
      asian: ['Zen', 'Fusion', 'Garden'],
      american: ['Classic', 'Homestyle', 'Rustic'],
      mexican: ['Fiesta', 'Cantina', 'Salsa'],
      any: ['Gourmet', 'Fusion', 'Chef\'s']
    };
    
    const prefix = prefixes[requirements.mealType][Math.floor(Math.random() * prefixes[requirements.mealType].length)];
    const cuisineWord = cuisineWords[requirements.cuisine] || cuisineWords.any;
    const word = cuisineWord[Math.floor(Math.random() * cuisineWord.length)];
    
    return `${prefix} ${word} ${requirements.mealType.charAt(0).toUpperCase() + requirements.mealType.slice(1)}`;
  };

  const generateIngredients = (requirements) => {
    const goal = userProfile?.goal;
    const is75Hard = userProfile?.is75Hard;
    
    // Goal-specific ingredient selections
    const ingredientsByGoal = {
      lose_weight: {
        breakfast: ['3 egg whites + 1 whole egg', '1 slice ezekiel bread', '1/4 avocado', 'Spinach', 'Bell peppers'],
        lunch: ['6oz lean chicken breast', '2 cups mixed greens', '1/3 cup quinoa', '1 tbsp olive oil', 'Cherry tomatoes'],
        dinner: ['5oz white fish or tilapia', '2 cups steamed broccoli', '1/2 cup sweet potato', 'Lemon', 'Fresh herbs'],
        snack: ['1 apple', '1 tbsp almond butter', 'Celery sticks']
      },
      gain_muscle: {
        breakfast: ['3 whole eggs', '1/2 cup oats', '1 banana', '1 scoop protein powder', '1 tbsp peanut butter'],
        lunch: ['8oz lean beef or chicken', '1 cup jasmine rice', '1/2 cup black beans', 'Mixed vegetables', 'Avocado'],
        dinner: ['6oz salmon', '1.5 cups quinoa', '1 cup roasted vegetables', 'Olive oil', 'Nuts'],
        snack: ['Greek yogurt', '1/4 cup granola', 'Berries', 'Honey']
      },
      maintain: {
        breakfast: ['2 eggs', '1 slice whole grain toast', '1/2 avocado', 'Tomato', 'Spinach'],
        lunch: ['5oz grilled chicken', '1 cup brown rice', '1 cup mixed vegetables', '1 tbsp olive oil'],
        dinner: ['5oz fish', '1/2 cup quinoa', '1 cup roasted vegetables', 'Herbs', 'Lemon'],
        snack: ['1/4 cup mixed nuts', '1 piece fruit']
      }
    };

    // 75 Hard modifications - emphasize whole, unprocessed foods
    if (is75Hard) {
      const cleanIngredients = {
        breakfast: ['3 whole eggs', 'Sweet potato hash', 'Spinach', 'Bell peppers', 'Avocado'],
        lunch: ['Grass-fed lean protein', 'Large mixed salad', 'Sweet potato', 'Olive oil', 'Raw vegetables'],
        dinner: ['Wild-caught fish', 'Steamed vegetables', 'Quinoa', 'Fresh herbs', 'Coconut oil'],
        snack: ['Raw almonds', 'Fresh berries', 'Coconut flakes']
      };
      return cleanIngredients[requirements.mealType] || cleanIngredients.lunch;
    }
    
    const goalIngredients = ingredientsByGoal[goal] || ingredientsByGoal.maintain;
    return goalIngredients[requirements.mealType] || goalIngredients.lunch;
  };

  const generateInstructions = (requirements) => {
    const baseInstructions = [
      'Preheat cooking surface or oven to appropriate temperature',
      'Prepare all ingredients according to dietary preferences'
    ];

    const goalSpecificInstructions = [];
    
    if (userProfile?.goal === 'lose_weight') {
      goalSpecificInstructions.push(
        'Use cooking spray or minimal oil to reduce calories',
        'Steam or grill protein to avoid excess fats',
        'Include plenty of fiber-rich vegetables for satiety',
        'Portion control: use smaller plates and measure servings'
      );
    } else if (userProfile?.goal === 'gain_muscle') {
      goalSpecificInstructions.push(
        'Cook protein thoroughly - aim for 25-30g per serving',
        'Include complex carbs for sustained energy',
        'Add healthy fats like olive oil or nuts for calories',
        'Consider post-workout timing for optimal muscle recovery'
      );
    } else {
      goalSpecificInstructions.push(
        'Balance protein, carbs, and fats in each serving',
        'Cook vegetables to retain maximum nutrients',
        'Use moderate amounts of healthy cooking oils'
      );
    }

    const finishingInstructions = [];
    
    if (userProfile?.is75Hard) {
      finishingInstructions.push(
        'Ensure all ingredients are whole and unprocessed (75 Hard compliant)',
        'Avoid artificial sweeteners and preservatives',
        'Season with natural herbs and spices only'
      );
    } else {
      finishingInstructions.push('Season to taste with your preferred spices');
    }

    finishingInstructions.push(
      'Combine ingredients according to cuisine style',
      'Serve immediately while fresh',
      'Enjoy your personalized, goal-specific meal!'
    );

    return [...baseInstructions, ...goalSpecificInstructions, ...finishingInstructions];
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'Hard': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🥜';
      default: return '🍴';
    }
  };

  if (showRecipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => setShowRecipe(null)}
          className="mb-6 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          ← Back to Meals
        </button>

        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
          {/* Recipe Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{getCategoryIcon(showRecipe.category)}</span>
                <h1 className="text-3xl font-bold text-white">{showRecipe.name}</h1>
              </div>
              <p className="text-gray-300 mb-4">{showRecipe.description}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{showRecipe.prepTime}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{showRecipe.servings} serving{showRecipe.servings > 1 ? 's' : ''}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(showRecipe.difficulty)}`}>
                  {showRecipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-500/10 to-pink-500/10 p-4 rounded-xl border border-orange-500/20 text-center">
              <div className="text-2xl font-bold text-white">{showRecipe.calories}</div>
              <div className="text-xs text-gray-400">Calories</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
              <div className="text-2xl font-bold text-white">{showRecipe.protein}g</div>
              <div className="text-xs text-gray-400">Protein</div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/20 text-center">
              <div className="text-2xl font-bold text-white">{showRecipe.carbs}g</div>
              <div className="text-xs text-gray-400">Carbs</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 p-4 rounded-xl border border-purple-500/20 text-center">
              <div className="text-2xl font-bold text-white">{showRecipe.fat}g</div>
              <div className="text-xs text-gray-400">Fat</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ChefHat className="w-5 h-5 mr-2" />
                Ingredients
              </h3>
              <div className="space-y-2">
                {showRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start bg-white/5 p-3 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Instructions</h3>
              <div className="space-y-3">
                {showRecipe.instructions.map((step, index) => (
                  <div key={index} className="flex items-start bg-white/5 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Recipe Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => savedMeals.includes(showRecipe.id) ? removeSavedMeal(showRecipe.id) : saveMeal(showRecipe.id)}
              className={`px-8 py-3 rounded-xl font-semibold transition-colors flex items-center mx-auto ${
                savedMeals.includes(showRecipe.id)
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90'
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${savedMeals.includes(showRecipe.id) ? 'fill-current' : ''}`} />
              {savedMeals.includes(showRecipe.id) ? 'Saved to Favorites' : 'Save Recipe'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Meal Plans & Recipes
          </h1>
          <p className="text-gray-300">
            Nutritious meals tailored for your {userProfile?.goal?.replace('_', ' ')} goal
          </p>
        </div>
        <button
          onClick={() => setShowAIGenerator(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          AI Meal Generator
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search meals and recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        
        <div className="flex space-x-2">
          {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-3 rounded-xl font-medium transition-colors capitalize flex items-center ${
                selectedCategory === category
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {category !== 'all' && <span className="mr-1">{getCategoryIcon(category)}</span>}
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAllergiesSelector(!showAllergiesSelector)}
            className={`px-4 py-3 rounded-xl font-medium transition-colors flex items-center ${
              selectedAllergies.length > 0
                ? 'bg-red-500/20 text-red-400'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Allergies {selectedAllergies.length > 0 && `(${selectedAllergies.length})`}
          </button>
        </div>
      </div>

      {/* Allergies Selector */}
      {showAllergiesSelector && (
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-white/20 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select Your Allergies</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {commonAllergies.map(allergy => (
              <button
                key={allergy.id}
                onClick={() => toggleAllergy(allergy.id)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedAllergies.includes(allergy.id)
                    ? 'bg-red-500/20 text-red-400 border border-red-400'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {allergy.name}
              </button>
            ))}
          </div>
          {selectedAllergies.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <p className="text-yellow-400 text-sm">
                ⚠️ Meals containing these allergens will be filtered out from your results.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Meals */}
      {selectedMeals.length > 0 && (
        <div className="bg-green-500/10 border border-green-400/30 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 font-semibold">Selected Meals ({selectedMeals.length})</h3>
              <p className="text-gray-300 text-sm">
                {selectedMeals.map(m => m.name).join(', ')}
              </p>
            </div>
            <button
              onClick={addMealsToWeeklyPlan}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
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

      {/* Quick Stats */}
      {userProfile && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Daily Calories</p>
                <p className="text-xl font-bold text-white">{nutritionDisplay.dailyCalories}</p>
                <p className="text-xs text-gray-500">{nutritionDisplay.deficitText}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Protein Goal</p>
                <p className="text-xl font-bold text-white">{nutritionDisplay.dailyProtein}</p>
                <p className="text-xs text-gray-500">Based on activity level</p>
              </div>
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold">P</div>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Saved Recipes</p>
                <p className="text-xl font-bold text-white">{savedMeals.length}</p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available Meals</p>
                <p className="text-xl font-bold text-white">{filteredMeals.length}</p>
              </div>
              <Utensils className="w-8 h-8 text-green-400" />
            </div>
          </div>
        </div>
      )}

      {/* AI Meal Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                  AI Meal Generator
                </h2>
                <button
                  onClick={() => setShowAIGenerator(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Meal Type</label>
                  <select
                    value={aiMealRequirements.mealType}
                    onChange={(e) => setAiMealRequirements({...aiMealRequirements, mealType: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Calories (optional)</label>
                  <input
                    type="number"
                    value={aiMealRequirements.calories}
                    onChange={(e) => setAiMealRequirements({...aiMealRequirements, calories: e.target.value})}
                    placeholder={`Suggested: ${calculateMealCalories()}`}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dietary Preferences</label>
                  <select
                    value={aiMealRequirements.dietary}
                    onChange={(e) => setAiMealRequirements({...aiMealRequirements, dietary: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="none">No restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten-free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine Style</label>
                  <select
                    value={aiMealRequirements.cuisine}
                    onChange={(e) => setAiMealRequirements({...aiMealRequirements, cuisine: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="any">Any cuisine</option>
                    <option value="american">American</option>
                    <option value="italian">Italian</option>
                    <option value="asian">Asian</option>
                    <option value="mexican">Mexican</option>
                    <option value="mediterranean">Mediterranean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Cook Time</label>
                  <select
                    value={aiMealRequirements.cookTime}
                    onChange={(e) => setAiMealRequirements({...aiMealRequirements, cookTime: e.target.value})}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={generateAIMeal}
                  disabled={generatingMeal}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                >
                  {generatingMeal ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Meal
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAIGenerator(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated AI Meal Display */}
      {generatedMeal && (
        <div className="mb-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
              AI Generated Meal
            </h2>
            <button
              onClick={() => setGeneratedMeal(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{generatedMeal.name}</h3>
                <p className="text-sm text-purple-400 capitalize">{generatedMeal.category} • AI Generated</p>
              </div>
              <button
                onClick={() => saveMeal(generatedMeal.id)}
                className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/30 transition-colors"
              >
                Save Recipe
              </button>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{generatedMeal.description}</p>
            
            <div className="grid grid-cols-4 gap-2 text-xs mb-4">
              <div className="text-center">
                <div className="text-orange-400 font-semibold">{generatedMeal.calories}</div>
                <div className="text-gray-500">cal</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold">{generatedMeal.protein}g</div>
                <div className="text-gray-500">protein</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-semibold">{generatedMeal.carbs}g</div>
                <div className="text-gray-500">carbs</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-semibold">{generatedMeal.fat}g</div>
                <div className="text-gray-500">fat</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleMealSelection(generatedMeal)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  selectedMeals.some(m => m.id === generatedMeal.id)
                    ? 'bg-green-500/20 text-green-400 border border-green-400'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {selectedMeals.some(m => m.id === generatedMeal.id) ? 'Selected' : 'Add to Plan'}
              </button>
              <button
                onClick={() => setShowRecipe(generatedMeal)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                View Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meals Grid - Compact Design with Expandable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMeals.map(meal => {
          const isExpanded = expandedMeal === meal.id;
          
          return (
            <div 
              key={meal.id} 
              className={`bg-gradient-to-br from-gray-900/80 via-purple-900/40 to-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden transition-all duration-500 group cursor-pointer ${
                isExpanded 
                  ? 'md:col-span-2 lg:col-span-2 xl:col-span-2 shadow-2xl border-orange-500/50 scale-105 z-10 relative' 
                  : 'hover:shadow-2xl hover:scale-102'
              }`}
              onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
            >
              {/* Compact Header with Image Icon */}
              <div className="relative p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isExpanded ? 'w-16 h-16' : 'w-12 h-12'
                    }`}>
                      <div className={`transition-all duration-300 ${isExpanded ? 'text-4xl' : 'text-2xl'}`}>
                        {getCategoryIcon(meal.category)}
                      </div>
                    </div>
                    
                    {/* Title and Category */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-white group-hover:text-orange-300 transition-colors ${
                        isExpanded ? 'text-2xl' : 'text-lg truncate'
                      }`}>
                        {meal.name}
                      </h3>
                      <p className={`text-gray-400 capitalize ${isExpanded ? 'text-base' : 'text-sm'}`}>
                        {meal.category}
                      </p>
                      {isExpanded && (
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{meal.prepTime}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{meal.servings} serving{meal.servings > 1 ? 's' : ''}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(meal.difficulty)}`}>
                            {meal.difficulty}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savedMeals.includes(meal.id) ? removeSavedMeal(meal.id) : saveMeal(meal.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Heart className={`w-4 h-4 ${savedMeals.includes(meal.id) ? 'fill-current text-pink-400' : 'text-gray-400 hover:text-pink-300'}`} />
                  </button>
                </div>
              </div>
              
              {/* Description */}
              <div className="px-4 pb-3">
                <p className={`text-gray-300 leading-relaxed ${
                  isExpanded ? 'text-base' : 'text-sm line-clamp-2'
                }`}>
                  {meal.description}
                </p>
              </div>
              
              {/* Nutrition Grid */}
              <div className="px-4 pb-3">
                <div className={`grid text-center transition-all duration-300 ${
                  isExpanded ? 'grid-cols-4 gap-4' : 'grid-cols-4 gap-3'
                }`}>
                  <div className={`bg-orange-500/10 rounded-lg transition-all duration-300 ${
                    isExpanded ? 'p-4' : 'p-2'
                  }`}>
                    <div className={`text-orange-400 font-bold ${isExpanded ? 'text-2xl' : 'text-sm'}`}>
                      {meal.calories}
                    </div>
                    <div className={`text-gray-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>cal</div>
                  </div>
                  <div className={`bg-blue-500/10 rounded-lg transition-all duration-300 ${
                    isExpanded ? 'p-4' : 'p-2'
                  }`}>
                    <div className={`text-blue-400 font-bold ${isExpanded ? 'text-2xl' : 'text-sm'}`}>
                      {meal.protein}g
                    </div>
                    <div className={`text-gray-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>protein</div>
                  </div>
                  <div className={`bg-green-500/10 rounded-lg transition-all duration-300 ${
                    isExpanded ? 'p-4' : 'p-2'
                  }`}>
                    <div className={`text-green-400 font-bold ${isExpanded ? 'text-2xl' : 'text-sm'}`}>
                      {meal.carbs}g
                    </div>
                    <div className={`text-gray-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>carbs</div>
                  </div>
                  <div className={`bg-purple-500/10 rounded-lg transition-all duration-300 ${
                    isExpanded ? 'p-4' : 'p-2'
                  }`}>
                    <div className={`text-purple-400 font-bold ${isExpanded ? 'text-2xl' : 'text-sm'}`}>
                      {meal.fat}g
                    </div>
                    <div className={`text-gray-500 ${isExpanded ? 'text-sm' : 'text-xs'}`}>fat</div>
                  </div>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 animate-fadeIn">
                  {/* Ingredients Preview */}
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2 flex items-center">
                      <ChefHat className="w-4 h-4 mr-2" />
                      Key Ingredients
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {meal.ingredients?.slice(0, 6).map((ingredient, index) => (
                        <div key={index} className="flex items-center bg-white/5 p-2 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-300 truncate">{ingredient}</span>
                        </div>
                      )) || (
                        <div className="col-span-2 text-gray-400 text-center py-2">
                          Ingredients not available
                        </div>
                      )}
                    </div>
                    {meal.ingredients?.length > 6 && (
                      <p className="text-gray-400 text-xs mt-2 text-center">
                        +{meal.ingredients.length - 6} more ingredients
                      </p>
                    )}
                  </div>
                  
                  {/* Additional Info */}
                  {meal.isAIGenerated && (
                    <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center text-purple-400 text-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Generated Recipe - Tailored to your goals
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Time and Difficulty - Only show if not expanded */}
              {!isExpanded && (
                <div className="px-4 pb-3 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{meal.prepTime}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(meal.difficulty)}`}>
                    {meal.difficulty}
                  </span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="px-4 pb-4">
                <div className={`flex transition-all duration-300 ${isExpanded ? 'gap-3' : 'gap-2'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMealSelection(meal);
                    }}
                    className={`flex-1 rounded-lg font-medium transition-all flex items-center justify-center ${
                      isExpanded ? 'py-3 px-4 text-base' : 'py-2 px-3 text-sm'
                    } ${
                      selectedMeals.some(m => m.id === meal.id)
                        ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Plus className={`mr-1 ${isExpanded ? 'w-4 h-4' : 'w-3 h-3'}`} />
                    {selectedMeals.some(m => m.id === meal.id) ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRecipe(meal);
                    }}
                    className={`flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center ${
                      isExpanded ? 'py-3 px-4 text-base' : 'py-2 px-3 text-sm'
                    }`}
                  >
                    <ChefHat className={`mr-1 ${isExpanded ? 'w-4 h-4' : 'w-3 h-3'}`} />
                    {isExpanded ? 'Full Recipe' : 'Recipe'}
                  </button>
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedMeal(null);
                      }}
                      className="px-4 py-3 bg-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/20 transition-colors text-base"
                    >
                      Collapse
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMeals.length === 0 && (
        <div className="text-center py-12">
          <Utensils className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No meals found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Meals;