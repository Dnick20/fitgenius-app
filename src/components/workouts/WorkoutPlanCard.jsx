import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Dumbbell, Eye, Trash2, Zap, Clock, TrendingUp } from 'lucide-react';

export default function WorkoutPlanCard({ plan, onView, onDelete }) {
  return (
    <motion.div whileHover={{ y: -5, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }} className="h-full">
      <Card className="glass-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {plan.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
                  <Zap className="w-3 h-3 mr-1" />
                  {plan.workout_type}
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 capitalize">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {plan.difficulty_level}
                </Badge>
              </div>
            </div>
            <Dumbbell className="w-8 h-8 text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Duration</span>
              <span className="font-medium">{plan.duration_weeks} weeks</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mt-1">
              <span>Workouts</span>
              <span className="font-medium">{plan.workouts?.length} sessions</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button onClick={(e) => { e.stopPropagation(); onView(); }} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Eye className="w-4 h-4 mr-2" />
              View Workout
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}