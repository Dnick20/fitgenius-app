// Meal Generator Bot - Automatically populates meals database
import SupabaseService from './src/services/SupabaseService.js';

const mealDatabase = {
  breakfast: [
    { name: "Greek Yogurt Parfait", calories: 320, protein: 18, carbs: 45, fat: 8, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"], 
      description: "Layered yogurt with fresh berries and crunchy granola" },
    { name: "Avocado Toast", calories: 280, protein: 8, carbs: 35, fat: 15, prep_time: 10, cook_time: 2, servings: 1, 
      ingredients: ["Whole grain bread", "Avocado", "Lemon juice", "Salt", "Red pepper flakes"], 
      description: "Smashed avocado on toasted whole grain bread" },
    { name: "Protein Smoothie Bowl", calories: 385, protein: 25, carbs: 52, fat: 12, prep_time: 8, cook_time: 0, servings: 1, 
      ingredients: ["Protein powder", "Frozen banana", "Spinach", "Almond milk", "Chia seeds", "Fresh fruit"], 
      description: "Thick smoothie bowl topped with fresh fruits and seeds" },
    { name: "Overnight Oats", calories: 310, protein: 12, carbs: 58, fat: 6, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Maple syrup", "Vanilla extract"], 
      description: "No-cook oats prepared the night before" },
    { name: "Veggie Scramble", calories: 245, protein: 18, carbs: 8, fat: 16, prep_time: 5, cook_time: 8, servings: 1, 
      ingredients: ["Eggs", "Bell peppers", "Spinach", "Mushrooms", "Onion", "Olive oil"], 
      description: "Fluffy scrambled eggs with sautéed vegetables" },
    { name: "Breakfast Quinoa Bowl", calories: 340, protein: 14, carbs: 58, fat: 8, prep_time: 10, cook_time: 15, servings: 1, 
      ingredients: ["Quinoa", "Almond milk", "Banana", "Nuts", "Cinnamon"], 
      description: "Warm quinoa porridge with banana and nuts" },
    { name: "Chia Pudding", calories: 295, protein: 10, carbs: 35, fat: 14, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Chia seeds", "Coconut milk", "Vanilla", "Maple syrup", "Fresh berries"], 
      description: "Creamy chia seed pudding with berries" },
    { name: "Banana Protein Pancakes", calories: 365, protein: 22, carbs: 48, fat: 10, prep_time: 5, cook_time: 10, servings: 1, 
      ingredients: ["Banana", "Eggs", "Protein powder", "Oats", "Cinnamon"], 
      description: "Fluffy protein-packed pancakes made with banana" },
    { name: "Breakfast Burrito", calories: 420, protein: 24, carbs: 38, fat: 20, prep_time: 10, cook_time: 8, servings: 1, 
      ingredients: ["Whole wheat tortilla", "Scrambled eggs", "Black beans", "Cheese", "Salsa", "Avocado"], 
      description: "Protein-rich burrito with eggs and beans" },
    { name: "Acai Bowl", calories: 340, protein: 8, carbs: 68, fat: 9, prep_time: 10, cook_time: 0, servings: 1, 
      ingredients: ["Acai puree", "Banana", "Granola", "Coconut flakes", "Fresh berries"], 
      description: "Antioxidant-rich acai bowl with tropical toppings" },
    { name: "Steel Cut Oatmeal", calories: 285, protein: 10, carbs: 54, fat: 5, prep_time: 5, cook_time: 20, servings: 1, 
      ingredients: ["Steel cut oats", "Water", "Milk", "Cinnamon", "Apple", "Walnuts"], 
      description: "Hearty steel cut oats with apple and walnuts" },
    { name: "Breakfast Smoothie", calories: 275, protein: 15, carbs: 45, fat: 6, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Protein powder", "Banana", "Berries", "Spinach", "Almond milk"], 
      description: "Nutrient-packed smoothie with greens and protein" }
  ],
  
  lunch: [
    { name: "Grilled Chicken Salad", calories: 385, protein: 35, carbs: 22, fat: 18, prep_time: 15, cook_time: 12, servings: 1, 
      ingredients: ["Chicken breast", "Mixed greens", "Cherry tomatoes", "Cucumber", "Olive oil", "Balsamic vinegar"], 
      description: "Fresh salad with perfectly grilled chicken breast" },
    { name: "Quinoa Buddha Bowl", calories: 425, protein: 18, carbs: 65, fat: 12, prep_time: 20, cook_time: 15, servings: 1, 
      ingredients: ["Quinoa", "Roasted vegetables", "Chickpeas", "Avocado", "Tahini dressing"], 
      description: "Colorful bowl with quinoa and roasted vegetables" },
    { name: "Turkey Wrap", calories: 340, protein: 28, carbs: 35, fat: 12, prep_time: 10, cook_time: 0, servings: 1, 
      ingredients: ["Whole wheat tortilla", "Turkey breast", "Lettuce", "Tomato", "Hummus"], 
      description: "Lean turkey wrap with fresh vegetables" },
    { name: "Mediterranean Bowl", calories: 410, protein: 20, carbs: 45, fat: 18, prep_time: 15, cook_time: 10, servings: 1, 
      ingredients: ["Brown rice", "Grilled chicken", "Olives", "Feta cheese", "Cucumber", "Tzatziki"], 
      description: "Mediterranean-inspired bowl with Greek flavors" },
    { name: "Salmon & Vegetables", calories: 445, protein: 32, carbs: 25, fat: 24, prep_time: 10, cook_time: 18, servings: 1, 
      ingredients: ["Salmon fillet", "Broccoli", "Sweet potato", "Olive oil", "Lemon"], 
      description: "Baked salmon with colorful roasted vegetables" },
    { name: "Lentil Soup", calories: 295, protein: 18, carbs: 48, fat: 5, prep_time: 15, cook_time: 25, servings: 2, 
      ingredients: ["Red lentils", "Vegetables", "Vegetable broth", "Spices"], 
      description: "Hearty and nutritious lentil soup" },
    { name: "Tuna Poke Bowl", calories: 380, protein: 28, carbs: 45, fat: 10, prep_time: 15, cook_time: 10, servings: 1, 
      ingredients: ["Sushi-grade tuna", "Brown rice", "Edamame", "Cucumber", "Seaweed", "Sriracha mayo"], 
      description: "Fresh tuna poke bowl with Asian flavors" },
    { name: "Chicken Caesar Salad", calories: 395, protein: 33, carbs: 18, fat: 22, prep_time: 15, cook_time: 10, servings: 1, 
      ingredients: ["Grilled chicken", "Romaine lettuce", "Parmesan cheese", "Caesar dressing", "Croutons"], 
      description: "Classic Caesar salad with grilled chicken" },
    { name: "Veggie Burger Bowl", calories: 365, protein: 16, carbs: 52, fat: 12, prep_time: 10, cook_time: 8, servings: 1, 
      ingredients: ["Plant-based patty", "Mixed greens", "Sweet potato fries", "Avocado", "Chipotle sauce"], 
      description: "Plant-based burger deconstructed in a bowl" },
    { name: "Shrimp Stir Fry", calories: 325, protein: 25, carbs: 35, fat: 10, prep_time: 15, cook_time: 8, servings: 1, 
      ingredients: ["Shrimp", "Mixed vegetables", "Brown rice", "Ginger", "Soy sauce"], 
      description: "Quick and healthy shrimp stir fry" },
    { name: "Greek Chicken Pita", calories: 355, protein: 30, carbs: 32, fat: 14, prep_time: 10, cook_time: 12, servings: 1, 
      ingredients: ["Chicken breast", "Pita bread", "Greek yogurt", "Cucumber", "Red onion", "Oregano"], 
      description: "Mediterranean chicken pita with tzatziki" },
    { name: "Black Bean Quesadilla", calories: 385, protein: 18, carbs: 48, fat: 15, prep_time: 10, cook_time: 6, servings: 1, 
      ingredients: ["Whole wheat tortilla", "Black beans", "Cheese", "Bell peppers", "Onion", "Salsa"], 
      description: "Protein-rich quesadilla with black beans" }
  ],
  
  dinner: [
    { name: "Baked Salmon", calories: 485, protein: 38, carbs: 28, fat: 26, prep_time: 10, cook_time: 20, servings: 1, 
      ingredients: ["Salmon fillet", "Asparagus", "Wild rice", "Lemon", "Herbs"], 
      description: "Perfectly baked salmon with asparagus and wild rice" },
    { name: "Chicken Stir-fry", calories: 395, protein: 32, carbs: 42, fat: 12, prep_time: 15, cook_time: 12, servings: 1, 
      ingredients: ["Chicken breast", "Mixed vegetables", "Brown rice", "Sesame oil", "Ginger"], 
      description: "Colorful chicken stir-fry with fresh vegetables" },
    { name: "Turkey Meatballs", calories: 425, protein: 35, carbs: 38, fat: 16, prep_time: 20, cook_time: 25, servings: 1, 
      ingredients: ["Ground turkey", "Whole wheat pasta", "Marinara sauce", "Herbs"], 
      description: "Lean turkey meatballs with whole wheat pasta" },
    { name: "Veggie Pasta", calories: 365, protein: 15, carbs: 68, fat: 8, prep_time: 15, cook_time: 15, servings: 1, 
      ingredients: ["Whole wheat pasta", "Zucchini", "Bell peppers", "Cherry tomatoes", "Olive oil", "Basil"], 
      description: "Light pasta with fresh seasonal vegetables" },
    { name: "Grilled Steak", calories: 525, protein: 42, carbs: 25, fat: 28, prep_time: 10, cook_time: 15, servings: 1, 
      ingredients: ["Lean steak", "Sweet potato", "Green beans", "Garlic", "Herbs"], 
      description: "Perfectly grilled steak with roasted vegetables" },
    { name: "Fish Tacos", calories: 385, protein: 28, carbs: 45, fat: 12, prep_time: 15, cook_time: 10, servings: 2, 
      ingredients: ["White fish", "Corn tortillas", "Cabbage slaw", "Avocado", "Lime", "Cilantro"], 
      description: "Fresh fish tacos with cabbage slaw" },
    { name: "Stuffed Bell Peppers", calories: 345, protein: 22, carbs: 38, fat: 14, prep_time: 20, cook_time: 35, servings: 1, 
      ingredients: ["Bell peppers", "Ground turkey", "Brown rice", "Onion", "Cheese"], 
      description: "Colorful bell peppers stuffed with turkey and rice" },
    { name: "Teriyaki Chicken", calories: 445, protein: 35, carbs: 48, fat: 12, prep_time: 15, cook_time: 18, servings: 1, 
      ingredients: ["Chicken thighs", "Brown rice", "Broccoli", "Teriyaki sauce", "Sesame seeds"], 
      description: "Glazed teriyaki chicken with steamed vegetables" },
    { name: "Beef and Vegetable Curry", calories: 425, protein: 30, carbs: 45, fat: 16, prep_time: 20, cook_time: 30, servings: 2, 
      ingredients: ["Lean beef", "Mixed vegetables", "Coconut milk", "Curry spices", "Brown rice"], 
      description: "Aromatic curry with tender beef and vegetables" },
    { name: "Pork Tenderloin", calories: 465, protein: 38, carbs: 32, fat: 20, prep_time: 15, cook_time: 25, servings: 1, 
      ingredients: ["Pork tenderloin", "Roasted potatoes", "Brussels sprouts", "Apple", "Herbs"], 
      description: "Juicy pork tenderloin with roasted fall vegetables" },
    { name: "Shrimp Scampi", calories: 385, protein: 26, carbs: 45, fat: 12, prep_time: 10, cook_time: 12, servings: 1, 
      ingredients: ["Shrimp", "Whole wheat pasta", "Garlic", "White wine", "Parsley", "Lemon"], 
      description: "Classic shrimp scampi with garlic and herbs" },
    { name: "Vegetarian Chili", calories: 295, protein: 16, carbs: 52, fat: 6, prep_time: 15, cook_time: 45, servings: 3, 
      ingredients: ["Mixed beans", "Tomatoes", "Bell peppers", "Onion", "Chili spices"], 
      description: "Hearty vegetarian chili packed with protein" }
  ],
  
  snack: [
    { name: "Apple & Almonds", calories: 195, protein: 6, carbs: 25, fat: 11, prep_time: 2, cook_time: 0, servings: 1, 
      ingredients: ["Apple", "Raw almonds"], 
      description: "Fresh apple slices with crunchy almonds" },
    { name: "Greek Yogurt", calories: 150, protein: 15, carbs: 18, fat: 4, prep_time: 1, cook_time: 0, servings: 1, 
      ingredients: ["Greek yogurt", "Honey"], 
      description: "Protein-rich Greek yogurt with a touch of honey" },
    { name: "Protein Bar", calories: 220, protein: 20, carbs: 24, fat: 6, prep_time: 0, cook_time: 0, servings: 1, 
      ingredients: ["Protein bar"], 
      description: "Convenient protein bar for on-the-go nutrition" },
    { name: "Hummus & Veggies", calories: 165, protein: 6, carbs: 18, fat: 8, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Hummus", "Carrots", "Cucumber", "Bell peppers"], 
      description: "Creamy hummus with fresh vegetable sticks" },
    { name: "Trail Mix", calories: 185, protein: 5, carbs: 18, fat: 12, prep_time: 0, cook_time: 0, servings: 1, 
      ingredients: ["Mixed nuts", "Dried fruit", "Dark chocolate chips"], 
      description: "Energy-boosting trail mix with nuts and dried fruit" },
    { name: "Cottage Cheese Bowl", calories: 145, protein: 14, carbs: 12, fat: 5, prep_time: 3, cook_time: 0, servings: 1, 
      ingredients: ["Cottage cheese", "Fresh berries", "Cinnamon"], 
      description: "Creamy cottage cheese topped with fresh berries" },
    { name: "Berries & Nuts", calories: 175, protein: 4, carbs: 22, fat: 9, prep_time: 2, cook_time: 0, servings: 1, 
      ingredients: ["Mixed berries", "Walnuts"], 
      description: "Antioxidant-rich berries with heart-healthy walnuts" },
    { name: "Rice Cakes with Avocado", calories: 155, protein: 4, carbs: 18, fat: 8, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Brown rice cakes", "Avocado", "Sea salt", "Lime juice"], 
      description: "Crispy rice cakes topped with creamy avocado" },
    { name: "Protein Smoothie", calories: 185, protein: 18, carbs: 22, fat: 4, prep_time: 5, cook_time: 0, servings: 1, 
      ingredients: ["Protein powder", "Banana", "Almond milk", "Ice"], 
      description: "Quick protein smoothie for post-workout recovery" },
    { name: "Hard-Boiled Eggs", calories: 125, protein: 12, carbs: 2, fat: 8, prep_time: 2, cook_time: 8, servings: 1, 
      ingredients: ["Eggs", "Salt", "Pepper"], 
      description: "Simple hard-boiled eggs with seasoning" },
    { name: "Cheese & Crackers", calories: 165, protein: 8, carbs: 15, fat: 9, prep_time: 2, cook_time: 0, servings: 1, 
      ingredients: ["Whole grain crackers", "Cheese slices"], 
      description: "Classic combination of cheese and whole grain crackers" },
    { name: "Energy Balls", calories: 145, protein: 5, carbs: 18, fat: 7, prep_time: 15, cook_time: 0, servings: 3, 
      ingredients: ["Dates", "Oats", "Nut butter", "Chia seeds"], 
      description: "No-bake energy balls with natural sweetness" }
  ]
};

async function addMealsToDatabase() {
  console.log('🤖 Meal Generator Bot Starting...');
  
  for (const [category, meals] of Object.entries(mealDatabase)) {
    console.log(`\n📂 Adding ${category} meals...`);
    
    for (const meal of meals) {
      try {
        const mealData = {
          name: meal.name,
          meal_type: category,
          category: category,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          prep_time: meal.prep_time,
          cook_time: meal.cook_time,
          servings: meal.servings,
          ingredients: meal.ingredients,
          nutrition: {
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat
          },
          description: meal.description
        };
        
        await SupabaseService.addMeal(mealData);
        console.log(`✅ Added: ${meal.name}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`⚠️ Skipping ${meal.name}: ${error.message}`);
      }
    }
  }
  
  console.log('\n🎉 Meal Generator Bot Complete!');
  console.log(`📊 Total meals added: ${Object.values(mealDatabase).flat().length}`);
}

// Run the bot
addMealsToDatabase().catch(console.error);