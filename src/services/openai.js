import OpenAI from 'openai';

// Check if API key is configured
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const isConfigured = apiKey && apiKey !== 'your_actual_api_key_here';

// Initialize OpenAI client only if API key is available
const openai = isConfigured ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // WARNING: Only for development. In production, use backend proxy
}) : null;

// Helper to check if OpenAI is available
function checkOpenAIAvailable() {
  if (!isConfigured || !openai) {
    return {
      available: false,
      message: 'OpenAI API key not configured. Please add your API key to the .env file.'
    };
  }
  return { available: true };
}

/**
 * Get AI-powered meal recommendations
 */
export async function getMealRecommendations(userProfile) {
  const check = checkOpenAIAvailable();
  if (!check.available) {
    return {
      success: false,
      error: check.message,
      fallback: generateFallbackMealPlan(userProfile)
    };
  }
  
  try {
    const prompt = `
      As an AI nutrition coach, create a personalized meal plan for:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height}cm
      - Weight: ${userProfile.weight}kg
      - Goal: ${userProfile.goal}
      - Activity Level: ${userProfile.activityLevel}
      - Daily Calories: ${userProfile.dailyCalories}
      - BMR: ${userProfile.bmr}
      
      Provide a detailed daily meal plan with:
      1. Breakfast, lunch, dinner, and 2 snacks
      2. Calorie counts for each meal that total ${userProfile.dailyCalories} calories
      3. Macro breakdown (protein, carbs, fats)
      4. Simple preparation instructions
      5. Shopping list
      
      Format the response in a clear, structured way with exact calorie counts.
    `;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are FitGenius AI, an expert nutrition coach specializing in personalized meal planning. Provide accurate calorie counts and practical meal suggestions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    // Error logged internally - removed console.error for production
    return {
      success: false,
      error: error.message,
      fallback: generateFallbackMealPlan(userProfile)
    };
  }
}

/**
 * Get AI-powered workout recommendations
 */
export async function getWorkoutRecommendations(userProfile) {
  const check = checkOpenAIAvailable();
  if (!check.available) {
    return {
      success: false,
      error: check.message,
      fallback: generateFallbackWorkoutPlan(userProfile)
    };
  }
  
  try {
    const prompt = `
      As an AI fitness coach, create a personalized workout plan for:
      - Name: ${userProfile.name}
      - Age: ${userProfile.age}
      - Gender: ${userProfile.gender}
      - Height: ${userProfile.height}cm
      - Weight: ${userProfile.weight}kg
      - Goal: ${userProfile.goal}
      - Activity Level: ${userProfile.activityLevel}
      
      Create a weekly workout plan that includes:
      1. 4-5 day workout split appropriate for their goal
      2. Specific exercises with sets and reps
      3. Rest periods between sets
      4. Warm-up and cool-down routines
      5. Progressive overload recommendations
      6. Recovery tips
      
      Assume basic gym equipment is available (dumbbells, barbells, machines).
      Make it challenging but achievable for their fitness level.
    `;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are FitGenius AI, an expert fitness coach specializing in personalized training programs. Create safe, effective, and progressive workout plans.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    // Error logged internally - removed console.error for production
    return {
      success: false,
      error: error.message,
      fallback: generateFallbackWorkoutPlan(userProfile)
    };
  }
}

/**
 * General AI chat for fitness questions
 */
export async function askFitnessAI(question, context = {}) {
  const check = checkOpenAIAvailable();
  if (!check.available) {
    return {
      success: false,
      error: check.message
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are FitGenius AI, a knowledgeable fitness and nutrition coach. Provide helpful, accurate, and motivating advice.'
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return {
      success: true,
      data: response.choices[0].message.content
    };
  } catch (error) {
    // Error logged internally - removed console.error for production
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test OpenAI connection
 */
export async function testOpenAIConnection() {
  const check = checkOpenAIAvailable();
  if (!check.available) {
    return {
      success: false,
      error: check.message
    };
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Say "FitGenius AI is connected and ready!" if you can read this.'
        }
      ],
      max_tokens: 50
    });

    return {
      success: true,
      message: response.choices[0].message.content
    };
  } catch (error) {
    // Connection test failed - error handled in return value
    return {
      success: false,
      error: error.message
    };
  }
}

// Fallback functions
function generateFallbackMealPlan(userProfile) {
  const isWeightLoss = userProfile.fitness_goal === 'weight_loss';
  const dailyCalories = isWeightLoss ? 1800 : 2400;
  
  return `
    **Fallback Meal Plan** (AI temporarily unavailable)
    
    Daily Calorie Target: ${dailyCalories} calories
    
    **Breakfast (${Math.round(dailyCalories * 0.25)} cal)**
    - Oatmeal with berries and protein powder
    - 2 eggs with whole grain toast
    
    **Lunch (${Math.round(dailyCalories * 0.35)} cal)**
    - Grilled chicken salad with quinoa
    - Mixed vegetables and olive oil dressing
    
    **Dinner (${Math.round(dailyCalories * 0.30)} cal)**
    - Salmon with sweet potato
    - Steamed broccoli
    
    **Snacks (${Math.round(dailyCalories * 0.10)} cal)**
    - Greek yogurt with nuts
    - Protein shake
    
    *Note: This is a generic plan. AI recommendations will be more personalized.*
  `;
}

function generateFallbackWorkoutPlan(userProfile) {
  const bodyType = userProfile.body_type || 'mesomorph';
  
  return `
    **Fallback Workout Plan** (AI temporarily unavailable)
    
    **${bodyType.charAt(0).toUpperCase() + bodyType.slice(1)} Training Program**
    
    **Monday - Upper Body**
    - Push-ups: 3 sets x 15 reps
    - Dumbbell rows: 3 sets x 12 reps
    - Shoulder press: 3 sets x 10 reps
    
    **Tuesday - Lower Body**
    - Squats: 4 sets x 15 reps
    - Lunges: 3 sets x 12 each leg
    - Calf raises: 3 sets x 20 reps
    
    **Wednesday - HIIT Cardio**
    - 20 minutes interval training
    
    **Thursday - Core & Abs**
    - Planks: 3 sets x 60 seconds
    - Russian twists: 3 sets x 20 reps
    - Leg raises: 3 sets x 15 reps
    
    **Friday - Full Body**
    - Burpees: 3 sets x 10 reps
    - Mountain climbers: 3 sets x 20 reps
    - Jump squats: 3 sets x 15 reps
    
    *Note: This is a generic plan. AI recommendations will be more personalized.*
  `;
}

export default {
  getMealRecommendations,
  getWorkoutRecommendations,
  askFitnessAI,
  testOpenAIConnection
};