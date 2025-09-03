import React, { useState } from 'react';
import { WorkoutPlan } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion } from 'framer-motion';
import { Sparkles, X, Zap, Apple } from 'lucide-react';
import WorkoutIntelligenceBot from '@/bots/WorkoutIntelligenceBot';

const BEACHBODY_PROGRAMS = [
  { id: 'p90x', name: 'P90X Style - Extreme Home Fitness', description: 'Intense 90-day program with varied daily workouts' },
  { id: 'insanity', name: 'Insanity Style - Max Interval Training', description: 'High-intensity cardio and plyometric workouts' },
  { id: '21dayfix', name: '21 Day Fix Style - Simple Fitness', description: 'Quick 30-minute workouts with portion control focus' },
  { id: 't25', name: 'Focus T25 Style - 25 Min Workouts', description: 'Maximum results in minimal time' },
  { id: 'p90x3', name: 'P90X3 Style - 30 Min Power', description: 'Condensed but intense 30-minute workouts' },
  { id: 'piyo', name: 'PiYo Style - Pilates Yoga Fusion', description: 'Strength and flexibility with cardio elements' },
  { id: 'cize', name: 'Cize Style - Dance Workouts', description: 'Fun dance-based cardio routines' },
  { id: 'hammer', name: 'Hammer & Chisel Style - Strength Focus', description: 'Heavy lifting and sculpting workouts' },
  { id: 'core', name: 'Core De Force Style - MMA Inspired', description: 'Mixed martial arts inspired training' },
  { id: 'shift', name: 'Shift Shop Style - Strength & Agility', description: 'Progressive strength and speed training' },
  { id: '80day', name: '80 Day Obsession Style - Timed Nutrition', description: 'Periodized training with nutrition timing' },
  { id: 'mbf', name: 'Morning Meltdown Style - Metabolic', description: 'High-energy metabolic conditioning' },
  { id: 'liift4', name: 'LIIFT4 Style - Lift & HIIT', description: '4-day lifting program with HIIT cardio' },
  { id: 'transform', name: 'Transform 20 Style - Quick Burns', description: '20-minute high-intensity workouts' },
  { id: 'mm100', name: 'Muscle Burns Fat Style - Strength', description: 'Progressive strength training program' },
  { id: 'bodi', name: 'Bodi Style - Functional Fitness', description: 'Real-world functional movement patterns' },
  { id: 'fire', name: 'Fire & Flow Style - Yoga Power', description: 'Dynamic yoga with strength elements' },
  { id: '645', name: '645 Style - Functional Training', description: 'Athletic performance and functional strength' },
  { id: 'control', name: 'Control Freak Style - Portion & Fitness', description: 'Controlled movements with nutrition focus' },
  { id: 'job1', name: 'Job 1 Style - Bodybuilding Prep', description: 'Competition-level bodybuilding training' }
];

export default function WorkoutPlanGenerator({ profile, onPlanGenerated, onCancel }) {
  const [formData, setFormData] = useState({
    duration: 4,
    difficulty: 'intermediate',
    beachbodyProgram: '',
    goals: profile?.fitness_goals || 'general_fitness'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [workoutBot] = useState(() => new WorkoutIntelligenceBot());

  const generateWorkoutPlan = async () => {
    setIsGenerating(true);
    try {
      const selectedProgram = BEACHBODY_PROGRAMS.find(p => p.id === formData.beachbodyProgram);
      
      // Use WorkoutIntelligenceBot to generate a comprehensive workout plan
      const planData = await workoutBot.generateWorkoutPlan({
        profile: {
          body_type: profile?.body_type || 'mesomorph',
          fitness_level: formData.difficulty,
          goals: formData.goals,
          age: profile?.age || 30,
          weight: profile?.weight || 70,
          height: profile?.height || 170,
          activity_level: profile?.activity_level || 'moderate'
        },
        preferences: {
          duration_weeks: formData.duration,
          beachbody_program: selectedProgram?.id,
          program_name: selectedProgram?.name,
          workout_style: selectedProgram?.description
        }
      });

      const savedPlan = await WorkoutPlan.create(planData);
      onPlanGenerated(savedPlan);
    } catch (error) {
      console.error("Error generating workout plan:", error);
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
              <Sparkles className="w-6 h-6 text-blue-500" />
              Generate Workout Plan
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
                  <SelectItem value="2">2 Weeks</SelectItem>
                  <SelectItem value="4">4 Weeks</SelectItem>
                  <SelectItem value="8">8 Weeks</SelectItem>
                  <SelectItem value="12">12 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({...formData, difficulty: value})}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">BeachBody Style Program</Label>
            <Select
              value={formData.beachbodyProgram}
              onValueChange={(value) => setFormData({...formData, beachbodyProgram: value})}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Choose a program style..." />
              </SelectTrigger>
              <SelectContent>
                {BEACHBODY_PROGRAMS.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.beachbodyProgram && (
              <p className="text-sm text-slate-600 mt-2">
                {BEACHBODY_PROGRAMS.find(p => p.id === formData.beachbodyProgram)?.description}
              </p>
            )}
          </div>

          <div className="pt-4">
            <Button
              onClick={generateWorkoutPlan}
              disabled={isGenerating || !formData.beachbodyProgram}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating Workout Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  Generate Workout Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}