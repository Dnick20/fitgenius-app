/**
 * AI Sous Chef Bot - Intelligent Meal Planning System
 * Uses ChatGPT-style logic for personalized meal generation
 */

import OpenAI from 'openai';

class SousChefBot {
  constructor(apiKey = process.env.REACT_APP_OPENAI_API_KEY) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // For development - use backend proxy in production
    });
  }

  /**
   * Generate a comprehensive meal plan based on user profile and preferences
   */
  async generateMealPlan(profile, preferences) {
    const {
      fitness_goal,
      daily_calorie_target,
      protein_target,
      carb_target,
      fat_target,
      dietary_preferences = [],
      allergies = [],
      body_type,
      activity_level
    } = profile;

    const {
      duration,
      focus,
      cookingTime,
      mealPrep,
      cuisinePreference = 'varied',
      budget = 'moderate'
    } = preferences;

    // Build comprehensive prompt for ChatGPT
    const systemPrompt = `You are an expert AI Sous Chef and nutritionist specializing in personalized meal planning. 
    You have deep knowledge of:
    - Nutritional science and macro/micronutrient balance
    - Culinary techniques from various cuisines
    - Food allergies and dietary restrictions
    - Meal prep strategies and time-saving techniques
    - Budget-conscious shopping and seasonal ingredients
    
    Your goal is to create delicious, nutritionally optimized meal plans that are practical and enjoyable.`;

    const userPrompt = `Create a detailed ${duration}-day meal plan with the following requirements:

    CLIENT PROFILE:
    - Fitness Goal: ${fitness_goal}
    - Body Type: ${body_type}
    - Activity Level: ${activity_level}
    - Daily Targets: ${daily_calorie_target} calories, ${protein_target}g protein, ${carb_target}g carbs, ${fat_target}g fat
    
    DIETARY REQUIREMENTS:
    - Preferences: ${dietary_preferences.join(', ') || 'none'}
    - Allergies/Restrictions: ${this.formatAllergies(allergies)}
    - Focus: ${focus}
    - Cooking Time: ${cookingTime}
    - Meal Prep Friendly: ${mealPrep ? 'Yes - provide batch cooking instructions' : 'No - fresh daily meals'}
    - Cuisine Preference: ${cuisinePreference}
    - Budget: ${budget}
    
    SPECIAL INSTRUCTIONS:
    1. For ${body_type} body type, prioritize:
       - Ectomorph: Higher carb ratio, frequent meals, calorie-dense foods
       - Mesomorph: Balanced macros, moderate portions, variety
       - Endomorph: Lower carb ratio, higher protein, metabolism-boosting foods
    
    2. Activity level adjustments:
       - Pre/post workout meal timing recommendations
       - Hydration reminders
       - Recovery nutrition focus
    
    3. Each meal should include:
       - Exact portion sizes
       - Prep and cooking times
       - Make-ahead tips
       - Substitution options
       - Leftover usage strategies
    
    4. Shopping list organization:
       - Group by store sections
       - Include quantities
       - Note seasonal alternatives
       - Budget-saving tips
    
    Please provide the meal plan in the following JSON format:
    {
      "name": "Descriptive plan name",
      "duration_days": number,
      "total_calories_per_day": number,
      "meal_prep_schedule": "Weekly prep instructions",
      "meals": [
        {
          "day": number,
          "meal_type": "breakfast|lunch|dinner|snack",
          "name": "Recipe name",
          "description": "Brief description",
          "ingredients": ["ingredient with quantity"],
          "instructions": "Step-by-step instructions",
          "prep_time": minutes,
          "cook_time": minutes,
          "calories": number,
          "protein": grams,
          "carbs": grams,
          "fat": grams,
          "fiber": grams,
          "meal_prep_tips": "Storage and reheating instructions",
          "variations": ["Alternative options"],
          "timing": "Best time to eat relative to workouts"
        }
      ],
      "shopping_list": {
        "proteins": ["item: quantity"],
        "produce": ["item: quantity"],
        "grains": ["item: quantity"],
        "dairy": ["item: quantity"],
        "pantry": ["item: quantity"],
        "spices": ["item: quantity"]
      },
      "weekly_prep_guide": {
        "sunday": ["Prep tasks"],
        "wednesday": ["Mid-week prep"]
      },
      "nutrition_tips": ["Personalized tips based on goals"],
      "hydration_plan": "Daily water intake recommendation",
      "supplement_suggestions": ["Optional supplements based on goals"]
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      const mealPlan = JSON.parse(completion.choices[0].message.content);
      
      // Post-process and validate the meal plan
      return this.validateAndEnhanceMealPlan(mealPlan, profile);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      // Fallback to alternative generation method
      return this.generateFallbackMealPlan(profile, preferences);
    }
  }

  /**
   * Generate recipe variations based on available ingredients
   */
  async generateRecipeVariations(meal, availableIngredients, restrictions) {
    const prompt = `Given this meal: ${meal.name}
    Original ingredients: ${meal.ingredients.join(', ')}
    Available substitutes: ${availableIngredients.join(', ')}
    Restrictions: ${restrictions.join(', ')}
    
    Provide 3 variations that maintain similar nutritional profile but use different ingredients.
    Focus on flavor variety and seasonal options.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a creative chef specializing in recipe adaptation." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      });

      return this.parseRecipeVariations(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error generating variations:", error);
      return [];
    }
  }

  /**
   * Smart shopping list organization by store layout
   */
  async organizeShoppingList(items, storeName, location) {
    const prompt = `Organize this shopping list for ${storeName} in ${location}:
    Items: ${items.join(', ')}
    
    Group by store sections in the most efficient shopping route.
    Include aisle numbers if known for common items.
    Note which items are likely on sale this season.
    Suggest budget alternatives for expensive items.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a shopping optimization expert familiar with grocery store layouts." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return this.parseShoppingOrganization(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error organizing shopping list:", error);
      return this.basicShoppingOrganization(items);
    }
  }

  /**
   * Generate snack suggestions based on workout intensity and timing
   */
  async generatePostWorkoutSnack(workout, profile, timeOfDay) {
    const prompt = `Recommend a post-workout snack for:
    Workout: ${workout.type} for ${workout.duration} minutes at ${workout.intensity}/10 intensity
    Calories burned: ${workout.calories_burned}
    Time of day: ${timeOfDay}
    User goals: ${profile.fitness_goal}
    Dietary preferences: ${profile.dietary_preferences?.join(', ')}
    
    Provide a snack that:
    1. Optimizes recovery based on workout intensity
    2. Fits within daily macro targets
    3. Can be prepared quickly
    4. Considers the time until next meal
    5. Accounts for body type: ${profile.body_type}`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a sports nutritionist specializing in post-workout recovery." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 500
      });

      return this.parseSnackSuggestion(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error generating snack:", error);
      return this.getDefaultPostWorkoutSnack(workout.intensity);
    }
  }

  /**
   * Meal timing optimization based on workout schedule
   */
  async optimizeMealTiming(meals, workoutSchedule, profile) {
    const prompt = `Optimize meal timing for:
    Daily meals: ${meals.map(m => m.name).join(', ')}
    Workout schedule: ${JSON.stringify(workoutSchedule)}
    Body type: ${profile.body_type}
    Goal: ${profile.fitness_goal}
    
    Provide specific timing recommendations for each meal relative to workouts.
    Consider pre-workout fuel, post-workout recovery, and overnight fasting.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a nutrition timing specialist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 800
      });

      return this.parseMealTiming(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error optimizing meal timing:", error);
      return this.getDefaultMealTiming(profile.body_type);
    }
  }

  // Helper methods
  formatAllergies(allergies) {
    if (!allergies || allergies.length === 0) return 'None';
    return allergies.map(a => {
      if (a.status === 'exclude') return `NO ${a.name}`;
      if (a.status === 'cooked_only') return `${a.name} (cooked only)`;
      return a.name;
    }).join(', ');
  }

  validateAndEnhanceMealPlan(plan, profile) {
    // Ensure all meals meet macro targets
    const dailyTotals = this.calculateDailyTotals(plan.meals);
    
    // Adjust portions if needed
    if (Math.abs(dailyTotals.calories - profile.daily_calorie_target) > 100) {
      plan = this.adjustPortions(plan, profile.daily_calorie_target);
    }

    // Add meal prep batch cooking instructions
    if (!plan.meal_prep_schedule) {
      plan.meal_prep_schedule = this.generateMealPrepSchedule(plan.meals);
    }

    // Add hydration recommendations
    plan.hydration_plan = this.calculateHydration(profile);

    return plan;
  }

  calculateDailyTotals(meals) {
    const dailyMeals = {};
    meals.forEach(meal => {
      if (!dailyMeals[meal.day]) {
        dailyMeals[meal.day] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
      dailyMeals[meal.day].calories += meal.calories || 0;
      dailyMeals[meal.day].protein += meal.protein || 0;
      dailyMeals[meal.day].carbs += meal.carbs || 0;
      dailyMeals[meal.day].fat += meal.fat || 0;
    });
    return dailyMeals;
  }

  adjustPortions(plan, targetCalories) {
    const adjustmentRatio = targetCalories / plan.total_calories_per_day;
    plan.meals.forEach(meal => {
      meal.calories = Math.round(meal.calories * adjustmentRatio);
      meal.protein = Math.round(meal.protein * adjustmentRatio);
      meal.carbs = Math.round(meal.carbs * adjustmentRatio);
      meal.fat = Math.round(meal.fat * adjustmentRatio);
    });
    plan.total_calories_per_day = targetCalories;
    return plan;
  }

  generateMealPrepSchedule(meals) {
    const schedule = {
      sunday: [
        "Batch cook proteins for the week",
        "Chop vegetables for 3 days",
        "Prepare overnight oats for weekday breakfasts",
        "Make homemade dressings and sauces"
      ],
      wednesday: [
        "Refresh vegetable prep",
        "Cook grains for remaining meals",
        "Prepare snack portions"
      ]
    };
    return schedule;
  }

  calculateHydration(profile) {
    const baseWater = profile.current_weight * 0.5; // oz per day
    const activityBonus = profile.activity_level === 'very_active' ? 20 : 
                          profile.activity_level === 'moderately_active' ? 12 : 0;
    return `${Math.round(baseWater + activityBonus)} oz daily, add 16oz per hour of exercise`;
  }

  // Fallback methods for API failures
  generateFallbackMealPlan(profile, preferences) {
    console.log("Using fallback meal generation");
    // Implement rule-based meal plan generation as backup
    return {
      name: "Balanced Nutrition Plan",
      duration_days: preferences.duration,
      total_calories_per_day: profile.daily_calorie_target,
      meals: this.generateBasicMeals(profile, preferences),
      shopping_list: this.generateBasicShoppingList(),
      nutrition_tips: this.getBasicNutritionTips(profile)
    };
  }

  generateBasicMeals(profile, preferences) {
    // Rule-based meal generation based on body type and goals
    const meals = [];
    const mealsPerDay = 4; // breakfast, lunch, dinner, snack
    
    for (let day = 1; day <= preferences.duration; day++) {
      meals.push(...this.getDayMeals(day, profile, preferences));
    }
    
    return meals;
  }

  getDayMeals(day, profile, preferences) {
    // Generate meals based on body type patterns
    const bodyTypePatterns = {
      ectomorph: {
        breakfast: { calorieRatio: 0.3, carbRatio: 0.5, proteinRatio: 0.25 },
        lunch: { calorieRatio: 0.3, carbRatio: 0.4, proteinRatio: 0.3 },
        dinner: { calorieRatio: 0.25, carbRatio: 0.35, proteinRatio: 0.35 },
        snack: { calorieRatio: 0.15, carbRatio: 0.4, proteinRatio: 0.3 }
      },
      mesomorph: {
        breakfast: { calorieRatio: 0.25, carbRatio: 0.4, proteinRatio: 0.3 },
        lunch: { calorieRatio: 0.35, carbRatio: 0.35, proteinRatio: 0.35 },
        dinner: { calorieRatio: 0.3, carbRatio: 0.3, proteinRatio: 0.4 },
        snack: { calorieRatio: 0.1, carbRatio: 0.3, proteinRatio: 0.4 }
      },
      endomorph: {
        breakfast: { calorieRatio: 0.25, carbRatio: 0.25, proteinRatio: 0.4 },
        lunch: { calorieRatio: 0.35, carbRatio: 0.25, proteinRatio: 0.4 },
        dinner: { calorieRatio: 0.3, carbRatio: 0.2, proteinRatio: 0.45 },
        snack: { calorieRatio: 0.1, carbRatio: 0.2, proteinRatio: 0.5 }
      }
    };

    const pattern = bodyTypePatterns[profile.body_type] || bodyTypePatterns.mesomorph;
    
    // Generate specific meals based on patterns
    return Object.entries(pattern).map(([mealType, ratios]) => ({
      day,
      meal_type: mealType,
      name: this.getMealName(mealType, profile.dietary_preferences),
      calories: Math.round(profile.daily_calorie_target * ratios.calorieRatio),
      protein: Math.round(profile.protein_target * ratios.proteinRatio),
      carbs: Math.round(profile.carb_target * ratios.carbRatio),
      fat: Math.round(profile.fat_target * (1 - ratios.proteinRatio - ratios.carbRatio)),
      ingredients: this.getIngredients(mealType, profile.dietary_preferences),
      instructions: "Prepare according to preferences",
      prep_time: 15
    }));
  }

  getMealName(mealType, preferences) {
    // Generate appropriate meal names based on type and preferences
    const mealOptions = {
      breakfast: ["Power Protein Bowl", "Energy Oatmeal", "Scrambled Success"],
      lunch: ["Grilled Chicken Salad", "Quinoa Power Bowl", "Lean Turkey Wrap"],
      dinner: ["Salmon & Vegetables", "Lean Beef Stir-Fry", "Grilled Chicken & Rice"],
      snack: ["Protein Shake", "Greek Yogurt Parfait", "Mixed Nuts & Fruit"]
    };
    
    return mealOptions[mealType][Math.floor(Math.random() * mealOptions[mealType].length)];
  }

  getIngredients(mealType, preferences) {
    // Return basic ingredients based on meal type
    const baseIngredients = {
      breakfast: ["eggs", "oats", "berries", "greek yogurt"],
      lunch: ["chicken breast", "mixed greens", "quinoa", "vegetables"],
      dinner: ["lean protein", "brown rice", "steamed vegetables", "olive oil"],
      snack: ["protein powder", "almonds", "apple", "peanut butter"]
    };
    
    return baseIngredients[mealType] || [];
  }

  generateBasicShoppingList() {
    return {
      proteins: ["Chicken breast: 2 lbs", "Salmon: 1 lb", "Eggs: 1 dozen"],
      produce: ["Mixed greens: 2 bags", "Broccoli: 2 heads", "Bell peppers: 4"],
      grains: ["Brown rice: 1 bag", "Quinoa: 1 bag", "Oats: 1 container"],
      dairy: ["Greek yogurt: 1 large container", "Cottage cheese: 1 container"],
      pantry: ["Olive oil: 1 bottle", "Almonds: 1 bag", "Protein powder: 1 container"]
    };
  }

  getBasicNutritionTips(profile) {
    const tips = {
      ectomorph: [
        "Eat frequently - aim for 5-6 smaller meals",
        "Include calorie-dense foods like nuts and avocados",
        "Don't skip pre and post-workout nutrition"
      ],
      mesomorph: [
        "Maintain consistent meal timing",
        "Balance macros at each meal",
        "Focus on whole foods over supplements"
      ],
      endomorph: [
        "Prioritize protein and vegetables",
        "Limit refined carbohydrates",
        "Consider intermittent fasting if appropriate"
      ]
    };
    
    return tips[profile.body_type] || tips.mesomorph;
  }

  parseRecipeVariations(content) {
    // Parse AI response into structured variations
    try {
      return JSON.parse(content);
    } catch {
      // Fallback parsing logic
      return [];
    }
  }

  parseShoppingOrganization(content) {
    // Parse AI response into organized shopping list
    try {
      return JSON.parse(content);
    } catch {
      return this.basicShoppingOrganization([]);
    }
  }

  basicShoppingOrganization(items) {
    // Basic organization by category
    return {
      sections: [
        { name: "Produce", items: items.filter(i => i.includes('vegetable') || i.includes('fruit')) },
        { name: "Proteins", items: items.filter(i => i.includes('chicken') || i.includes('beef')) },
        { name: "Dairy", items: items.filter(i => i.includes('milk') || i.includes('yogurt')) },
        { name: "Pantry", items: items.filter(i => !i.includes('vegetable') && !i.includes('meat')) }
      ]
    };
  }

  parseSnackSuggestion(content) {
    // Parse AI snack suggestion
    try {
      return JSON.parse(content);
    } catch {
      return {
        name: "Recovery Snack",
        calories: 200,
        protein: 20,
        preparation: "Mix protein powder with water and have with a banana"
      };
    }
  }

  getDefaultPostWorkoutSnack(intensity) {
    if (intensity > 7) {
      return {
        name: "High-Intensity Recovery Shake",
        calories: 300,
        protein: 25,
        carbs: 35,
        preparation: "Blend protein powder, banana, and almond milk"
      };
    }
    return {
      name: "Light Recovery Snack",
      calories: 150,
      protein: 15,
      carbs: 20,
      preparation: "Greek yogurt with berries"
    };
  }

  parseMealTiming(content) {
    // Parse meal timing recommendations
    try {
      return JSON.parse(content);
    } catch {
      return this.getDefaultMealTiming('mesomorph');
    }
  }

  getDefaultMealTiming(bodyType) {
    const timings = {
      ectomorph: {
        breakfast: "Within 30 minutes of waking",
        lunch: "Every 3-4 hours after breakfast",
        dinner: "2-3 hours before bed",
        snacks: "Between meals and post-workout"
      },
      mesomorph: {
        breakfast: "Within 1 hour of waking",
        lunch: "4-5 hours after breakfast",
        dinner: "3-4 hours before bed",
        snacks: "Post-workout only"
      },
      endomorph: {
        breakfast: "Can delay if intermittent fasting",
        lunch: "Largest meal of the day",
        dinner: "Light, 4 hours before bed",
        snacks: "Minimal, protein-focused"
      }
    };
    
    return timings[bodyType] || timings.mesomorph;
  }
}

export default SousChefBot;