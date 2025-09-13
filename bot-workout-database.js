#!/usr/bin/env node

// Workout Database Bot - Phase 2
// Generates 165+ workouts across 11 categories (15 each)

import fs from 'fs';

class WorkoutDatabaseBot {
  constructor() {
    this.botName = 'Workout Database Bot';
    this.startTime = Date.now();
  }

  async execute() {
    console.log(`🤖 ${this.botName} Starting...`);
    
    try {
      await this.generateWorkoutDatabase();
      await this.createDatabaseMigration();
      
      const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`✅ ${this.botName} completed in ${duration}s`);
      return { success: true, duration };
    } catch (error) {
      console.error(`❌ ${this.botName} failed:`, error.message);
      throw error;
    }
  }

  async generateWorkoutDatabase() {
    console.log('  🏋️ Generating 165+ workout database...');
    
    const workoutDatabase = {
      cardio: this.generateCardioWorkouts(),
      strength: this.generateStrengthWorkouts(),
      flexibility: this.generateFlexibilityWorkouts(),
      hiit: this.generateHIITWorkouts(),
      yoga: this.generateYogaWorkouts(),
      pilates: this.generatePilatesWorkouts(),
      crossfit: this.generateCrossfitWorkouts(),
      martial_arts: this.generateMartialArtsWorkouts(),
      swimming: this.generateSwimmingWorkouts(),
      cycling: this.generateCyclingWorkouts(),
      outdoor: this.generateOutdoorWorkouts()
    };

    const dbContent = `// Generated Workout Database - 165+ workouts
export const WORKOUT_DATABASE = ${JSON.stringify(workoutDatabase, null, 2)};

export const getWorkoutsByCategory = (category) => {
  return WORKOUT_DATABASE[category] || [];
};

export const getAllWorkouts = () => {
  return Object.values(WORKOUT_DATABASE).flat();
};`;

    fs.writeFileSync('./src/data/workouts.js', dbContent);
    console.log('  ✅ Workout database generated with 165+ workouts');
  }

  generateCardioWorkouts() {
    return [
      { id: 'c1', name: 'Interval Running', duration: 30, difficulty: 'Medium', calories: 300, description: 'Alternating high and low intensity running' },
      { id: 'c2', name: 'Jump Rope HIIT', duration: 20, difficulty: 'High', calories: 250, description: 'High-intensity jump rope intervals' },
      { id: 'c3', name: 'Stair Climbing', duration: 25, difficulty: 'Medium', calories: 200, description: 'Continuous stair climbing workout' },
      { id: 'c4', name: 'Burpee Challenge', duration: 15, difficulty: 'High', calories: 180, description: 'Progressive burpee workout' },
      { id: 'c5', name: 'Boxing Cardio', duration: 35, difficulty: 'High', calories: 400, description: 'Boxing-inspired cardio workout' },
      { id: 'c6', name: 'Dance Cardio', duration: 40, difficulty: 'Low', calories: 250, description: 'Fun dance-based cardio' },
      { id: 'c7', name: 'Rowing Machine', duration: 25, difficulty: 'Medium', calories: 275, description: 'Full-body rowing workout' },
      { id: 'c8', name: 'Sprint Intervals', duration: 20, difficulty: 'High', calories: 300, description: 'Short burst sprint training' },
      { id: 'c9', name: 'Step-Up Cardio', duration: 30, difficulty: 'Medium', calories: 220, description: 'Step platform cardio workout' },
      { id: 'c10', name: 'Mountain Climbers', duration: 15, difficulty: 'High', calories: 200, description: 'Intense mountain climber sets' },
      { id: 'c11', name: 'Elliptical HIIT', duration: 35, difficulty: 'Medium', calories: 320, description: 'Elliptical high-intensity intervals' },
      { id: 'c12', name: 'Shadow Boxing', duration: 25, difficulty: 'Medium', calories: 280, description: 'Boxing movements without equipment' },
      { id: 'c13', name: 'Plyometric Circuit', duration: 30, difficulty: 'High', calories: 350, description: 'Explosive jumping movements' },
      { id: 'c14', name: 'Cardio Kickboxing', duration: 45, difficulty: 'Medium', calories: 400, description: 'Kickboxing-based cardio workout' },
      { id: 'c15', name: 'Battle Ropes', duration: 20, difficulty: 'High', calories: 300, description: 'Battle rope conditioning' }
    ];
  }

  generateStrengthWorkouts() {
    return [
      { id: 's1', name: 'Push Day Upper', duration: 45, difficulty: 'Medium', description: 'Chest, shoulders, triceps focus' },
      { id: 's2', name: 'Pull Day Upper', duration: 45, difficulty: 'Medium', description: 'Back and biceps focus' },
      { id: 's3', name: 'Leg Day Power', duration: 50, difficulty: 'High', description: 'Comprehensive leg workout' },
      { id: 's4', name: 'Full Body Strength', duration: 60, difficulty: 'Medium', description: 'Complete body strength training' },
      { id: 's5', name: 'Core Destroyer', duration: 30, difficulty: 'High', description: 'Intense core strengthening' },
      { id: 's6', name: 'Deadlift Focus', duration: 40, difficulty: 'High', description: 'Deadlift variations and accessories' },
      { id: 's7', name: 'Squat Mastery', duration: 40, difficulty: 'High', description: 'Squat patterns and variations' },
      { id: 's8', name: 'Bench Press Power', duration: 35, difficulty: 'Medium', description: 'Bench press and chest accessories' },
      { id: 's9', name: 'Functional Strength', duration: 45, difficulty: 'Medium', description: 'Real-world movement patterns' },
      { id: 's10', name: 'Olympic Lifting', duration: 50, difficulty: 'High', description: 'Clean and jerk, snatch focus' },
      { id: 's11', name: 'Bodyweight Strength', duration: 35, difficulty: 'Medium', description: 'No equipment strength training' },
      { id: 's12', name: 'Powerlifting Prep', duration: 55, difficulty: 'High', description: 'Competition preparation workout' },
      { id: 's13', name: 'Hypertrophy Focus', duration: 50, difficulty: 'Medium', description: 'Muscle building emphasis' },
      { id: 's14', name: 'Strength Endurance', duration: 40, difficulty: 'Medium', description: 'High rep strength training' },
      { id: 's15', name: 'Compound Movements', duration: 45, difficulty: 'High', description: 'Multi-joint exercise focus' }
    ];
  }

  // Optimized generation methods (abbreviated for space)
  generateFlexibilityWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `f${i+1}`,
      name: ['Morning Stretch', 'Deep Flexibility', 'Post-Workout Recovery'][i % 3],
      duration: 20 + (i * 2),
      difficulty: ['Low', 'Medium'][i % 2],
      description: 'Flexibility and mobility focused routine'
    }));
  }

  generateHIITWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `h${i+1}`,
      name: `HIIT Circuit ${i+1}`,
      duration: 15 + (i * 2),
      difficulty: 'High',
      calories: 200 + (i * 20),
      description: 'High-intensity interval training'
    }));
  }

  generateYogaWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `y${i+1}`,
      name: ['Vinyasa Flow', 'Hatha Yoga', 'Power Yoga'][i % 3],
      duration: 30 + (i * 3),
      difficulty: ['Low', 'Medium', 'High'][i % 3],
      description: 'Yoga practice for strength and flexibility'
    }));
  }

  generatePilatesWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `p${i+1}`,
      name: `Pilates Session ${i+1}`,
      duration: 25 + (i * 2),
      difficulty: ['Medium', 'High'][i % 2],
      description: 'Core-focused pilates workout'
    }));
  }

  generateCrossfitWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `cf${i+1}`,
      name: `WOD ${i+1}`,
      duration: 20 + (i * 2),
      difficulty: 'High',
      calories: 300 + (i * 25),
      description: 'CrossFit workout of the day'
    }));
  }

  generateMartialArtsWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `ma${i+1}`,
      name: ['Karate Training', 'MMA Conditioning', 'Taekwondo'][i % 3],
      duration: 35 + (i * 2),
      difficulty: ['Medium', 'High'][i % 2],
      description: 'Martial arts training session'
    }));
  }

  generateSwimmingWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `sw${i+1}`,
      name: `Swimming Workout ${i+1}`,
      duration: 30 + (i * 3),
      difficulty: ['Low', 'Medium', 'High'][i % 3],
      description: 'Pool-based cardiovascular workout'
    }));
  }

  generateCyclingWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `cy${i+1}`,
      name: ['Road Cycling', 'Mountain Biking', 'Indoor Cycling'][i % 3],
      duration: 40 + (i * 4),
      difficulty: ['Medium', 'High'][i % 2],
      description: 'Cycling-based cardiovascular training'
    }));
  }

  generateOutdoorWorkouts() {
    return Array.from({length: 15}, (_, i) => ({
      id: `o${i+1}`,
      name: ['Trail Running', 'Park Workout', 'Hiking'][i % 3],
      duration: 45 + (i * 3),
      difficulty: ['Low', 'Medium', 'High'][i % 3],
      description: 'Outdoor fitness activity'
    }));
  }

  async createDatabaseMigration() {
    console.log('  📊 Creating database migration...');
    
    const migration = `-- Workout Database Migration
-- Generated by Workout Database Bot

CREATE TABLE IF NOT EXISTS workouts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration INTEGER,
  difficulty TEXT,
  calories INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view workouts" ON workouts
  FOR SELECT USING (true);`;

    fs.writeFileSync('./database/migrations/003_create_workouts.sql', migration);
    console.log('  ✅ Database migration created');
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const bot = new WorkoutDatabaseBot();
  bot.execute().then(() => process.exit(0)).catch(() => process.exit(1));
}

export default WorkoutDatabaseBot;