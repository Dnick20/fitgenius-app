import React, { useState } from "react";
import { MealPlan } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Clock, X } from "lucide-react";
import { motion } from "framer-motion";

export default function MealPlanGenerator({ profile, onPlanGenerated, onCancel }) {
  const [formData, setFormData] = useState({
    duration: 7,
    focus: 'balanced',
    cookingTime: 'moderate',
    mealPrep: false
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const allergiesText = (profile.allergies || [])
        .map(a => `- ${a.name}: ${a.status.replace('_', ' ')}`)
        .join('\\n');

      const prompt = `Act as a creative and knowledgeable Sous Chef. Create a detailed ${formData.duration}-day meal plan for a person with these specifications:

**Personal Profile:**
- Goal: ${profile.fitness_goal}
- Daily calorie target: ${profile.daily_calorie_target || 'around 2000'} kcal
- Macronutrient targets: ${profile.protein_target}g Protein, ${profile.carb_target}g Carbs, ${profile.fat_target}g Fat
- Dietary Preferences: ${profile.dietary_preferences?.join(', ') || 'none'}

**Critical Allergy Information:**
${allergiesText || '- No specific allergies listed.'}

**Meal Plan Requirements:**
- Focus: ${formData.focus}
- Cooking Time: ${formData.cookingTime}
- Meal Prep Friendly: ${formData.mealPrep ? 'yes' : 'no'}

**Your Task:**
Create a comprehensive, delicious, and varied meal plan. For each day, provide Breakfast, Lunch, Dinner, and 1-2 Snacks.

**JSON Output Format (Strict):**
For each meal, ensure "meal_type" is one of these exact lowercase strings: "breakfast", "lunch", "dinner", "snack".
The entire response must be a single JSON object matching the provided schema.`;

      const result = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            duration_days: { type: "number" },
            total_calories_per_day: { type: "number" },
            meals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  meal_type: { type: "string" },
                  name: { type: "string" },
                  ingredients: { type: "array", items: { type: "string" } },
                  instructions: { type: "string" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                  prep_time: { type: "number" }
                }
              }
            },
            shopping_list: { type: "array", items: { type: "string" } },
            dietary_tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Sanitize meal types to ensure they match the entity schema enum (lowercase)
      const sanitizedMeals = (result.meals || []).map(meal => ({
        ...meal,
        meal_type: meal.meal_type ? meal.meal_type.toLowerCase() : 'snack' // Default to 'snack' if missing
      })).filter(meal => ["breakfast", "lunch", "dinner", "snack"].includes(meal.meal_type)); // Filter out any invalid meal types

      const mealPlanData = {
        name: result.name || `${formData.focus} Meal Plan`,
        duration_days: formData.duration,
        total_calories_per_day: result.total_calories_per_day || profile.daily_calorie_target || 2000,
        meals: sanitizedMeals,
        shopping_list: result.shopping_list || [],
        dietary_tags: result.dietary_tags || []
      };

      const savedPlan = await MealPlan.create(mealPlanData);

      onPlanGenerated(savedPlan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="mb-8"
    >
      <Card className="glass-card border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              Generate AI Meal Plan
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Plan Duration</Label>
              <Select 
                value={formData.duration.toString()} 
                onValueChange={(value) => setFormData({...formData, duration: parseInt(value)})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">1 Week</SelectItem>
                  <SelectItem value="14">2 Weeks</SelectItem>
                  <SelectItem value="30">1 Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus">Plan Focus</Label>
              <Select
                value={formData.focus}
                onValueChange={(value) => setFormData({...formData, focus: value})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced Nutrition</SelectItem>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Building</SelectItem>
                  <SelectItem value="high_protein">High Protein</SelectItem>
                  <SelectItem value="low_carb">Low Carb</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cooking-time">Cooking Time</Label>
              <Select
                value={formData.cookingTime}
                onValueChange={(value) => setFormData({...formData, cookingTime: value})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick">Quick (15-30 min)</SelectItem>
                  <SelectItem value="moderate">Moderate (30-45 min)</SelectItem>
                  <SelectItem value="elaborate">Elaborate (45+ min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meal-prep">Meal Prep Style</Label>
              <Select
                value={formData.mealPrep ? 'yes' : 'no'}
                onValueChange={(value) => setFormData({...formData, mealPrep: value === 'yes'})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Daily Fresh Cooking</SelectItem>
                  <SelectItem value="yes">Meal Prep Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={generateMealPlan}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating Your Meal Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}