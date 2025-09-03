import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  Calendar, 
  Target, 
  Clock, 
  ShoppingCart,
  ChefHat,
  Utensils,
  Coffee,
  Apple
} from "lucide-react";
import { motion } from "framer-motion";
import ShoppingList from "./ShoppingList";

const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: ChefHat,
  snack: Apple
};

export default function MealPlanDetails({ plan, onClose }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [showShoppingList, setShowShoppingList] = useState(false);

  const getMealsByDay = (day) => {
    return plan.meals?.filter(meal => meal.day === day) || [];
  };

  const getDayTotals = (day) => {
    const dayMeals = getMealsByDay(day);
    return dayMeals.reduce((totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.protein || 0),
      carbs: totals.carbs + (meal.carbs || 0),
      fat: totals.fat + (meal.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  if (showShoppingList) {
    return <ShoppingList plan={plan} onClose={() => setShowShoppingList(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden glass-card border-0 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
                <ChefHat className="w-6 h-6" />
                {plan.name}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  {plan.duration_days} days
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">
                  <Target className="w-3 h-3 mr-1" />
                  {Math.round(plan.total_calories_per_day)} cal/day
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShoppingList(true)}
                  className="rounded-xl"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shopping List
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from({ length: plan.duration_days }, (_, i) => i + 1).map(day => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className={`rounded-xl ${selectedDay === day ? 'bg-emerald-500 hover:bg-emerald-600' : 'hover:bg-emerald-50'}`}
                  >
                    Day {day}
                  </Button>
                ))}
              </div>

              {/* Day Totals */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{Math.round(getDayTotals(selectedDay).calories)}</p>
                  <p className="text-sm text-slate-600">Calories</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{Math.round(getDayTotals(selectedDay).protein)}g</p>
                  <p className="text-sm text-slate-600">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{Math.round(getDayTotals(selectedDay).carbs)}g</p>
                  <p className="text-sm text-slate-600">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{Math.round(getDayTotals(selectedDay).fat)}g</p>
                  <p className="text-sm text-slate-600">Fat</p>
                </div>
              </div>
            </div>

            {/* Meals for Selected Day */}
            <div className="space-y-6">
              {getMealsByDay(selectedDay).map((meal, index) => {
                const IconComponent = mealTypeIcons[meal.meal_type] || Utensils;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card border border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-lg capitalize">
                            <IconComponent className="w-5 h-5 text-emerald-500" />
                            {meal.meal_type} - {meal.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {meal.prep_time && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {meal.prep_time} min
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {meal.calories} cal
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Ingredients:</h4>
                            <ul className="text-sm text-slate-600 space-y-1">
                              {meal.ingredients?.map((ingredient, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-emerald-500 mt-1">•</span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-700 mb-2">Instructions:</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{meal.instructions}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <span>Protein: {meal.protein}g</span>
                          <span>Carbs: {meal.carbs}g</span>
                          <span>Fat: {meal.fat}g</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {getMealsByDay(selectedDay).length === 0 && (
              <div className="text-center py-8">
                <ChefHat className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No meals planned for Day {selectedDay}</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}