// Workout Generator Bot - Automatically populates workouts database
import SupabaseService from './src/services/SupabaseService.js';

const workoutDatabase = {
  cardio: [
    { name: "HIIT Cardio Blast", type: "cardio", difficulty: "intermediate", duration: 25, calories: 350, 
      exercises: [
        { name: "Jumping Jacks", duration: "45 seconds", rest: "15 seconds" },
        { name: "High Knees", duration: "45 seconds", rest: "15 seconds" },
        { name: "Burpees", duration: "30 seconds", rest: "30 seconds" },
        { name: "Mountain Climbers", duration: "45 seconds", rest: "15 seconds" }
      ],
      description: "High-intensity interval training to boost metabolism" },
    { name: "Cardio Dance Party", type: "cardio", difficulty: "beginner", duration: 30, calories: 285, 
      exercises: [
        { name: "Basic Step Touch", duration: "2 minutes", rest: "30 seconds" },
        { name: "Arm Circles", duration: "1 minute", rest: "30 seconds" },
        { name: "Side Steps", duration: "2 minutes", rest: "30 seconds" },
        { name: "Hip Swings", duration: "1 minute", rest: "30 seconds" }
      ],
      description: "Fun dance-based cardio workout for all fitness levels" },
    { name: "Treadmill Intervals", type: "cardio", difficulty: "intermediate", duration: 35, calories: 425, 
      exercises: [
        { name: "Warm-up Walk", duration: "5 minutes", intensity: "moderate" },
        { name: "Sprint Intervals", duration: "1 minute", rest: "2 minutes", rounds: 8 },
        { name: "Cool-down Walk", duration: "5 minutes", intensity: "easy" }
      ],
      description: "Structured treadmill workout with sprint intervals" },
    { name: "Cycling Endurance", type: "cardio", difficulty: "intermediate", duration: 45, calories: 485, 
      exercises: [
        { name: "Easy Pace", duration: "10 minutes", intensity: "moderate" },
        { name: "Moderate Pace", duration: "20 minutes", intensity: "vigorous" },
        { name: "Hill Climbs", duration: "10 minutes", intensity: "high" },
        { name: "Recovery", duration: "5 minutes", intensity: "easy" }
      ],
      description: "Endurance-focused cycling workout with varied intensity" },
    { name: "Boxing Cardio", type: "cardio", difficulty: "advanced", duration: 40, calories: 525, 
      exercises: [
        { name: "Shadow Boxing", duration: "3 minutes", rest: "1 minute", rounds: 6 },
        { name: "Jump Rope", duration: "2 minutes", rest: "1 minute", rounds: 4 },
        { name: "Heavy Bag", duration: "3 minutes", rest: "1 minute", rounds: 3 }
      ],
      description: "High-intensity boxing workout for cardio and coordination" },
    { name: "Stair Climbing", type: "cardio", difficulty: "beginner", duration: 20, calories: 245, 
      exercises: [
        { name: "Steady Climb", duration: "5 minutes", intensity: "moderate" },
        { name: "Double Steps", duration: "2 minutes", rest: "1 minute", rounds: 3 },
        { name: "Side Steps", duration: "3 minutes", intensity: "moderate" },
        { name: "Cool Down", duration: "3 minutes", intensity: "easy" }
      ],
      description: "Simple stair climbing workout for cardiovascular health" },
    { name: "Swimming Laps", type: "cardio", difficulty: "intermediate", duration: 40, calories: 385, 
      exercises: [
        { name: "Freestyle Laps", duration: "15 minutes", intensity: "moderate" },
        { name: "Backstroke", duration: "10 minutes", intensity: "moderate" },
        { name: "Kick Board", duration: "10 minutes", intensity: "vigorous" },
        { name: "Cool Down Swim", duration: "5 minutes", intensity: "easy" }
      ],
      description: "Full-body swimming workout with multiple strokes" },
    { name: "Rowing Machine", type: "cardio", difficulty: "intermediate", duration: 30, calories: 355, 
      exercises: [
        { name: "Steady State", duration: "10 minutes", intensity: "moderate" },
        { name: "Power Intervals", duration: "30 seconds", rest: "90 seconds", rounds: 8 },
        { name: "Cool Down Row", duration: "5 minutes", intensity: "easy" }
      ],
      description: "Low-impact rowing workout for full-body cardio" },
    { name: "Elliptical HIIT", type: "cardio", difficulty: "beginner", duration: 25, calories: 295, 
      exercises: [
        { name: "Warm Up", duration: "5 minutes", intensity: "easy" },
        { name: "High Intensity", duration: "1 minute", rest: "2 minutes", rounds: 5 },
        { name: "Cool Down", duration: "5 minutes", intensity: "easy" }
      ],
      description: "Beginner-friendly HIIT workout on elliptical machine" },
    { name: "Running Intervals", type: "cardio", difficulty: "advanced", duration: 35, calories: 465, 
      exercises: [
        { name: "Warm Up Jog", duration: "5 minutes", intensity: "easy" },
        { name: "Sprint", duration: "30 seconds", rest: "90 seconds", rounds: 10 },
        { name: "Cool Down Walk", duration: "5 minutes", intensity: "easy" }
      ],
      description: "High-intensity running intervals for advanced fitness" },
    { name: "Low Impact Cardio", type: "cardio", difficulty: "beginner", duration: 30, calories: 225, 
      exercises: [
        { name: "Marching in Place", duration: "3 minutes", intensity: "moderate" },
        { name: "Arm Swings", duration: "2 minutes", intensity: "moderate" },
        { name: "Step Touches", duration: "3 minutes", intensity: "moderate" },
        { name: "Seated Cardio", duration: "5 minutes", intensity: "moderate" }
      ],
      description: "Joint-friendly cardio workout for beginners" },
    { name: "Kickboxing Fitness", type: "cardio", difficulty: "intermediate", duration: 35, calories: 415, 
      exercises: [
        { name: "Jab-Cross Combo", duration: "2 minutes", rest: "30 seconds", rounds: 4 },
        { name: "Front Kicks", duration: "1 minute", rest: "30 seconds", rounds: 6 },
        { name: "Hook Punches", duration: "2 minutes", rest: "30 seconds", rounds: 3 }
      ],
      description: "Martial arts inspired cardio workout" }
  ],
  
  strength: [
    { name: "Upper Body Power", type: "strength", difficulty: "intermediate", duration: 45, calories: 285, 
      exercises: [
        { name: "Push-ups", sets: 3, reps: 12, rest: "60 seconds" },
        { name: "Pull-ups", sets: 3, reps: 8, rest: "90 seconds" },
        { name: "Dumbbell Press", sets: 3, reps: 10, rest: "60 seconds" },
        { name: "Rows", sets: 3, reps: 12, rest: "60 seconds" }
      ],
      description: "Complete upper body strength training routine" },
    { name: "Lower Body Strength", type: "strength", difficulty: "intermediate", duration: 50, calories: 325, 
      exercises: [
        { name: "Squats", sets: 4, reps: 15, rest: "90 seconds" },
        { name: "Deadlifts", sets: 3, reps: 10, rest: "120 seconds" },
        { name: "Lunges", sets: 3, reps: 12, rest: "60 seconds" },
        { name: "Calf Raises", sets: 3, reps: 15, rest: "45 seconds" }
      ],
      description: "Comprehensive lower body strength workout" },
    { name: "Full Body Circuit", type: "strength", difficulty: "beginner", duration: 35, calories: 245, 
      exercises: [
        { name: "Bodyweight Squats", sets: 3, reps: 10, rest: "45 seconds" },
        { name: "Modified Push-ups", sets: 3, reps: 8, rest: "45 seconds" },
        { name: "Plank", sets: 3, duration: "30 seconds", rest: "45 seconds" },
        { name: "Glute Bridges", sets: 3, reps: 12, rest: "45 seconds" }
      ],
      description: "Beginner-friendly full body strength routine" },
    { name: "Core Crusher", type: "strength", difficulty: "intermediate", duration: 25, calories: 185, 
      exercises: [
        { name: "Plank", sets: 3, duration: "45 seconds", rest: "30 seconds" },
        { name: "Russian Twists", sets: 3, reps: 20, rest: "30 seconds" },
        { name: "Bicycle Crunches", sets: 3, reps: 16, rest: "30 seconds" },
        { name: "Dead Bug", sets: 3, reps: 10, rest: "30 seconds" }
      ],
      description: "Targeted core strengthening workout" },
    { name: "Dumbbell Total Body", type: "strength", difficulty: "intermediate", duration: 40, calories: 295, 
      exercises: [
        { name: "Dumbbell Thrusters", sets: 3, reps: 12, rest: "60 seconds" },
        { name: "Dumbbell Rows", sets: 3, reps: 10, rest: "60 seconds" },
        { name: "Dumbbell Lunges", sets: 3, reps: 12, rest: "60 seconds" },
        { name: "Dumbbell Press", sets: 3, reps: 10, rest: "60 seconds" }
      ],
      description: "Complete workout using only dumbbells" },
    { name: "Bodyweight Basics", type: "strength", difficulty: "beginner", duration: 30, calories: 195, 
      exercises: [
        { name: "Wall Push-ups", sets: 3, reps: 10, rest: "45 seconds" },
        { name: "Chair Squats", sets: 3, reps: 12, rest: "45 seconds" },
        { name: "Modified Plank", sets: 3, duration: "20 seconds", rest: "45 seconds" },
        { name: "Standing Marches", sets: 3, reps: 10, rest: "30 seconds" }
      ],
      description: "No-equipment strength workout for beginners" },
    { name: "Powerlifting Basics", type: "strength", difficulty: "advanced", duration: 60, calories: 385, 
      exercises: [
        { name: "Barbell Squats", sets: 4, reps: 6, rest: "180 seconds" },
        { name: "Deadlifts", sets: 4, reps: 5, rest: "180 seconds" },
        { name: "Bench Press", sets: 4, reps: 6, rest: "180 seconds" },
        { name: "Overhead Press", sets: 3, reps: 8, rest: "120 seconds" }
      ],
      description: "Heavy compound movements for strength building" },
    { name: "Functional Movement", type: "strength", difficulty: "intermediate", duration: 35, calories: 265, 
      exercises: [
        { name: "Turkish Get-ups", sets: 3, reps: 5, rest: "90 seconds" },
        { name: "Farmer's Walks", sets: 3, duration: "30 seconds", rest: "60 seconds" },
        { name: "Single Leg Deadlifts", sets: 3, reps: 8, rest: "60 seconds" },
        { name: "Bear Crawls", sets: 3, duration: "20 seconds", rest: "45 seconds" }
      ],
      description: "Real-world movement patterns for functional strength" },
    { name: "Resistance Band Workout", type: "strength", difficulty: "beginner", duration: 30, calories: 175, 
      exercises: [
        { name: "Band Pull-aparts", sets: 3, reps: 15, rest: "45 seconds" },
        { name: "Band Squats", sets: 3, reps: 12, rest: "45 seconds" },
        { name: "Band Rows", sets: 3, reps: 12, rest: "45 seconds" },
        { name: "Band Chest Press", sets: 3, reps: 10, rest: "45 seconds" }
      ],
      description: "Portable resistance band strength training" },
    { name: "Kettlebell Flow", type: "strength", difficulty: "intermediate", duration: 35, calories: 315, 
      exercises: [
        { name: "Kettlebell Swings", sets: 4, reps: 20, rest: "60 seconds" },
        { name: "Goblet Squats", sets: 3, reps: 12, rest: "60 seconds" },
        { name: "KB Clean & Press", sets: 3, reps: 8, rest: "90 seconds" },
        { name: "KB Windmills", sets: 3, reps: 6, rest: "60 seconds" }
      ],
      description: "Dynamic kettlebell workout for strength and power" },
    { name: "Calisthenics Advanced", type: "strength", difficulty: "advanced", duration: 45, calories: 335, 
      exercises: [
        { name: "Pistol Squats", sets: 3, reps: 8, rest: "90 seconds" },
        { name: "Archer Push-ups", sets: 3, reps: 6, rest: "90 seconds" },
        { name: "L-sits", sets: 3, duration: "15 seconds", rest: "90 seconds" },
        { name: "Muscle-ups", sets: 3, reps: 3, rest: "120 seconds" }
      ],
      description: "Advanced bodyweight strength movements" },
    { name: "Isometric Holds", type: "strength", difficulty: "beginner", duration: 25, calories: 145, 
      exercises: [
        { name: "Wall Sit", sets: 3, duration: "30 seconds", rest: "60 seconds" },
        { name: "Plank Hold", sets: 3, duration: "30 seconds", rest: "45 seconds" },
        { name: "Glute Bridge Hold", sets: 3, duration: "20 seconds", rest: "45 seconds" },
        { name: "Superman Hold", sets: 3, duration: "15 seconds", rest: "45 seconds" }
      ],
      description: "Static strength holds for muscle endurance" }
  ],
  
  flexibility: [
    { name: "Morning Yoga Flow", type: "flexibility", difficulty: "beginner", duration: 20, calories: 85, 
      exercises: [
        { name: "Cat-Cow Stretch", duration: "2 minutes", intensity: "gentle" },
        { name: "Downward Dog", duration: "1 minute", intensity: "moderate" },
        { name: "Child's Pose", duration: "2 minutes", intensity: "gentle" },
        { name: "Sun Salutation", rounds: 3, intensity: "moderate" }
      ],
      description: "Gentle morning yoga routine to start your day" },
    { name: "Deep Stretch Session", type: "flexibility", difficulty: "intermediate", duration: 30, calories: 125, 
      exercises: [
        { name: "Pigeon Pose", duration: "2 minutes each side", intensity: "deep" },
        { name: "Seated Forward Fold", duration: "3 minutes", intensity: "deep" },
        { name: "Hip Flexor Stretch", duration: "90 seconds each side", intensity: "moderate" },
        { name: "Spinal Twist", duration: "2 minutes each side", intensity: "moderate" }
      ],
      description: "Comprehensive stretching for improved flexibility" },
    { name: "Post-Workout Stretch", type: "flexibility", difficulty: "beginner", duration: 15, calories: 65, 
      exercises: [
        { name: "Quad Stretch", duration: "30 seconds each leg", intensity: "moderate" },
        { name: "Hamstring Stretch", duration: "45 seconds each leg", intensity: "moderate" },
        { name: "Shoulder Stretch", duration: "30 seconds each arm", intensity: "gentle" },
        { name: "Calf Stretch", duration: "30 seconds each leg", intensity: "moderate" }
      ],
      description: "Essential cool-down stretches after exercise" },
    { name: "Bedtime Relaxation", type: "flexibility", difficulty: "beginner", duration: 25, calories: 95, 
      exercises: [
        { name: "Legs Up Wall", duration: "5 minutes", intensity: "gentle" },
        { name: "Gentle Spinal Twist", duration: "2 minutes each side", intensity: "gentle" },
        { name: "Happy Baby Pose", duration: "3 minutes", intensity: "gentle" },
        { name: "Corpse Pose", duration: "5 minutes", intensity: "gentle" }
      ],
      description: "Relaxing stretches to prepare for sleep" },
    { name: "Hip Mobility", type: "flexibility", difficulty: "intermediate", duration: 25, calories: 105, 
      exercises: [
        { name: "90/90 Hip Stretch", duration: "2 minutes each side", intensity: "moderate" },
        { name: "Hip Circles", duration: "1 minute each direction", intensity: "gentle" },
        { name: "Butterfly Stretch", duration: "3 minutes", intensity: "moderate" },
        { name: "Lizard Pose", duration: "90 seconds each side", intensity: "deep" }
      ],
      description: "Targeted hip mobility and flexibility routine" },
    { name: "Desk Worker Stretches", type: "flexibility", difficulty: "beginner", duration: 15, calories: 55, 
      exercises: [
        { name: "Neck Rolls", duration: "1 minute", intensity: "gentle" },
        { name: "Shoulder Shrugs", duration: "30 seconds", intensity: "gentle" },
        { name: "Chest Doorway Stretch", duration: "45 seconds", intensity: "moderate" },
        { name: "Seated Spinal Twist", duration: "1 minute each side", intensity: "gentle" }
      ],
      description: "Quick stretches to combat desk-related stiffness" },
    { name: "Runner's Recovery", type: "flexibility", difficulty: "intermediate", duration: 20, calories: 85, 
      exercises: [
        { name: "IT Band Stretch", duration: "90 seconds each side", intensity: "moderate" },
        { name: "Calf Wall Stretch", duration: "1 minute each leg", intensity: "moderate" },
        { name: "Figure-4 Stretch", duration: "90 seconds each side", intensity: "moderate" },
        { name: "Standing Quad Stretch", duration: "45 seconds each leg", intensity: "moderate" }
      ],
      description: "Essential stretches for runners and walkers" },
    { name: "Upper Body Release", type: "flexibility", difficulty: "beginner", duration: 18, calories: 75, 
      exercises: [
        { name: "Eagle Arms", duration: "45 seconds", intensity: "moderate" },
        { name: "Tricep Stretch", duration: "30 seconds each arm", intensity: "moderate" },
        { name: "Chest Expansion", duration: "1 minute", intensity: "gentle" },
        { name: "Neck Side Bends", duration: "30 seconds each side", intensity: "gentle" }
      ],
      description: "Upper body stretches for shoulders, arms, and neck" },
    { name: "Balance & Stability", type: "flexibility", difficulty: "intermediate", duration: 22, calories: 95, 
      exercises: [
        { name: "Tree Pose", duration: "1 minute each side", intensity: "moderate" },
        { name: "Warrior III", duration: "30 seconds each side", intensity: "challenging" },
        { name: "Single Leg Stands", duration: "45 seconds each leg", intensity: "moderate" },
        { name: "Standing Figure-4", duration: "45 seconds each side", intensity: "moderate" }
      ],
      description: "Improve balance while increasing flexibility" },
    { name: "Gentle Senior Stretches", type: "flexibility", difficulty: "beginner", duration: 20, calories: 75, 
      exercises: [
        { name: "Seated Arm Circles", duration: "1 minute", intensity: "gentle" },
        { name: "Ankle Rotations", duration: "30 seconds each foot", intensity: "gentle" },
        { name: "Seated Side Bend", duration: "45 seconds each side", intensity: "gentle" },
        { name: "Gentle Neck Stretch", duration: "30 seconds each direction", intensity: "gentle" }
      ],
      description: "Safe, gentle stretches suitable for older adults" },
    { name: "Dynamic Warm-up", type: "flexibility", difficulty: "intermediate", duration: 12, calories: 65, 
      exercises: [
        { name: "Arm Circles", duration: "30 seconds each direction", intensity: "moderate" },
        { name: "Leg Swings", duration: "30 seconds each leg", intensity: "moderate" },
        { name: "Hip Circles", duration: "30 seconds each direction", intensity: "moderate" },
        { name: "Torso Twists", duration: "1 minute", intensity: "moderate" }
      ],
      description: "Dynamic movements to prepare body for exercise" },
    { name: "Prenatal Stretches", type: "flexibility", difficulty: "beginner", duration: 25, calories: 95, 
      exercises: [
        { name: "Cat-Cow (Modified)", duration: "2 minutes", intensity: "gentle" },
        { name: "Side-lying Leg Lifts", duration: "1 minute each side", intensity: "gentle" },
        { name: "Pelvic Tilts", duration: "2 minutes", intensity: "gentle" },
        { name: "Supported Child's Pose", duration: "3 minutes", intensity: "gentle" }
      ],
      description: "Safe stretches designed for pregnant women" }
  ]
};

async function addWorkoutsToDatabase() {
  console.log('🤖 Workout Generator Bot Starting...');
  
  for (const [category, workouts] of Object.entries(workoutDatabase)) {
    console.log(`\n💪 Adding ${category} workouts...`);
    
    for (const workout of workouts) {
      try {
        const workoutData = {
          name: workout.name,
          type: workout.type,
          category: category,
          difficulty: workout.difficulty,
          duration: workout.duration,
          estimatedDuration: `${workout.duration} mins`,
          calories: workout.calories,
          caloriesBurned: `${workout.calories-50}-${workout.calories}`,
          exercises: workout.exercises,
          description: workout.description
        };
        
        await SupabaseService.addWorkout(workoutData);
        console.log(`✅ Added: ${workout.name}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`⚠️ Skipping ${workout.name}: ${error.message}`);
      }
    }
  }
  
  console.log('\n🎉 Workout Generator Bot Complete!');
  console.log(`📊 Total workouts added: ${Object.values(workoutDatabase).flat().length}`);
}

// Run the bot
addWorkoutsToDatabase().catch(console.error);