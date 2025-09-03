// Backend proxy server for OpenAI API calls
// This server should be deployed separately from your frontend

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/api/', limiter);

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-side API key
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Meal recommendations endpoint
app.post('/api/meal-recommendations', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

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
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
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

    res.json({
      success: true,
      data: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get meal recommendations',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Workout recommendations endpoint
app.post('/api/workout-recommendations', async (req, res) => {
  try {
    const { userProfile } = req.body;
    
    if (!userProfile) {
      return res.status(400).json({ error: 'User profile is required' });
    }

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
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
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

    res.json({
      success: true,
      data: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get workout recommendations',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// General fitness AI chat endpoint
app.post('/api/fitness-chat', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
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

    res.json({
      success: true,
      data: response.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process question',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FitGenius backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});