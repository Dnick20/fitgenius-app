import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Calendar, ChefHat, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function MealPlanCard({ plan, onView, onDelete }) {
  return (
    <motion.div
      whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      className="h-full"
    >
      <Card 
        className="glass-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {plan.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  {plan.duration_days} days
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Target className="w-3 h-3 mr-1" />
                  {Math.round(plan.total_calories_per_day)} cal/day
                </Badge>
              </div>
            </div>
            <ChefHat className="w-8 h-8 text-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-600 font-medium mb-2">Dietary Tags</p>
              <div className="flex flex-wrap gap-1">
                {(plan.dietary_tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs capitalize">
                    {tag.replace(/_/g, ' ')}
                  </Badge>
                ))}
                {(plan.dietary_tags?.length || 0) > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{plan.dietary_tags.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm text-slate-600 font-medium mb-1">Meal Coverage</p>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{plan.meals?.length || 0} meals planned</span>
                <span>{Math.round((plan.meals?.length || 0) / (plan.duration_days || 1))} meals/day</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
             <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="w-4 h-4"/>
             </Button>
             <Button onClick={(e) => { e.stopPropagation(); onView(); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg">
                <Eye className="w-4 h-4 mr-2"/>
                View Plan
             </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}