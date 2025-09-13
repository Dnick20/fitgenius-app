// Enhanced Meal Database with Structured Flow
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
export const getAllMeals = () => Object.values(MEAL_DATABASE).flat();