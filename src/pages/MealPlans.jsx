import React, { useState, useEffect } from "react";
import { MealPlan, UserProfile } from "@/entities/all";
import { User } from "@/entities/User";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed react-router-dom import - using internal navigation
// import { createPageUrl } from "@/utils";
import { Utensils, Plus, ChefHat } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";

import MealPlanGenerator from "../components/meals/MealPlanGenerator";
import MealPlanCard from "../components/meals/MealPlanCard";
import MealPlanDetails from "../components/meals/MealPlanDetails";

export default function MealPlans() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const profiles = await UserProfile.filter({ created_by: userData.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
      }

      const plans = await MealPlan.filter({ created_by: userData.email }, '-created_date');
      setMealPlans(plans);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanGenerated = (newPlan) => {
    setMealPlans(prev => [newPlan, ...prev]);
    setShowGenerator(false);
    setSelectedPlan(newPlan);
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      await MealPlan.delete(planToDelete.id);
      setMealPlans(prev => prev.filter(p => p.id !== planToDelete.id));
      setPlanToDelete(null);
    } catch (error) {
      console.error("Error deleting meal plan:", error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <ChefHat className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-4">Complete Your Profile First</h1>
          <p className="text-gray-300 mb-6">We need your fitness profile to create personalized meal plans.</p>
          <button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
            Complete Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-emerald-400" />
                Meal Plans
              </h1>
              <p className="text-gray-300 text-lg">AI-generated nutrition plans tailored to your goals</p>
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 flex items-center self-start md:self-auto"
            >
              <Plus className="mr-2 w-5 h-5" />
              Generate New Plan
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showGenerator && (
            <MealPlanGenerator
              profile={profile}
              onPlanGenerated={handlePlanGenerated}
              onCancel={() => setShowGenerator(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedPlan && (
            <MealPlanDetails
              plan={selectedPlan}
              onClose={() => setSelectedPlan(null)}
            />
          )}
        </AnimatePresence>

        {!showGenerator && !selectedPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {mealPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MealPlanCard
                    plan={plan}
                    onView={() => setSelectedPlan(plan)}
                    onDelete={() => setPlanToDelete(plan)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {mealPlans.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-12"
              >
                <ChefHat className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Meal Plans Yet</h3>
                <p className="text-gray-300 mb-6 text-center max-w-md">
                  Generate your first personalized meal plan based on your fitness goals and dietary preferences.
                </p>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Create First Plan
                </button>
              </motion.div>
            )}
          </div>
        )}

        <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the "{planToDelete?.name}" meal plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePlan} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}