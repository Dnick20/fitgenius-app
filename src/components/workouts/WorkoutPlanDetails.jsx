import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { X, Dumbbell, Zap, TrendingUp, Clock } from 'lucide-react';

export default function WorkoutPlanDetails({ plan, onClose }) {
  const [selectedDay, setSelectedDay] = useState(plan.workouts?.[0]?.day || 1);

  const getWorkoutByDay = (day) => {
    return plan.workouts?.find(w => w.day === day);
  };
  
  const uniqueDays = Array.from(new Set(plan.workouts?.map(w => w.day))).sort();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card border-0 shadow-2xl" onClick={e => e.stopPropagation()}>
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Dumbbell className="w-6 h-6" /> {plan.name}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Badge className="bg-blue-100 text-blue-700 capitalize">
              <Zap className="w-3 h-3 mr-1" />
              {plan.workout_type}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 capitalize">
              <TrendingUp className="w-3 h-3 mr-1" />
              {plan.difficulty_level}
            </Badge>
            <Badge variant="outline">
              {plan.duration_weeks} weeks
            </Badge>
          </div>
        </CardHeader>
        <div className="overflow-auto max-h-[calc(90vh-80px)]">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {uniqueDays.map(day => (
                <Button key={day} variant={selectedDay === day ? "default" : "outline"} size="sm" onClick={() => setSelectedDay(day)} className={selectedDay === day ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50"}>
                  Day {day}
                </Button>
              ))}
            </div>
            
            {getWorkoutByDay(selectedDay) ? (
              <div>
                <h3 className="text-xl font-bold mb-4">{getWorkoutByDay(selectedDay).name}</h3>
                <div className="space-y-3">
                  {getWorkoutByDay(selectedDay).exercises?.map((ex, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                      <p className="font-semibold text-slate-800 flex-1">{ex.name}</p>
                      <div className="flex items-center gap-4 mt-2 md:mt-0">
                        <Badge variant="secondary">{ex.sets} sets</Badge>
                        <Badge variant="secondary">{ex.reps} reps</Badge>
                        <Badge variant="secondary"><Clock className="w-3 h-3 mr-1"/>{ex.rest_seconds}s rest</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p>No workout scheduled for this day.</p>}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}