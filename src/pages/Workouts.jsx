import React, { useState } from 'react';
import { Dumbbell, Play, Clock, Target, Plus, CheckCircle, RotateCcw, Flame, Trophy, Timer } from 'lucide-react';

const Workouts = ({ userProfile }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('all');
  const [burnedCalories, setBurnedCalories] = useState(0);
  const [showCalorieBonus, setShowCalorieBonus] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [showWeeklyPlanUpdate, setShowWeeklyPlanUpdate] = useState(false);

  // Generate workouts based on user preferences and goals
  const getWorkoutsForUserPreferences = () => {
    const userWorkoutTypes = userProfile?.workoutTypes || [];
    const is75Hard = userProfile?.is75Hard;
    let workouts = [];

    // Add workouts based on selected types
    if (userWorkoutTypes.includes('hiit') || userWorkoutTypes.length === 0) {
      workouts.push(...getHIITWorkouts());
    }
    if (userWorkoutTypes.includes('yoga') || userWorkoutTypes.length === 0) {
      workouts.push(...getYogaWorkouts());
    }
    if (userWorkoutTypes.includes('running') || userWorkoutTypes.length === 0) {
      workouts.push(...getRunningWorkouts());
    }
    if (userWorkoutTypes.includes('biking') || userWorkoutTypes.length === 0) {
      workouts.push(...getBikingWorkouts());
    }
    if (userWorkoutTypes.includes('swimming') || userWorkoutTypes.length === 0) {
      workouts.push(...getSwimmingWorkouts());
    }
    if (userWorkoutTypes.includes('walking') || userWorkoutTypes.length === 0) {
      workouts.push(...getWalkingWorkouts());
    }

    // Add 75 Hard specific workouts if user is doing the challenge
    if (is75Hard) {
      workouts.push(...get75HardWorkouts());
    }

    // If no preferences selected, show general workouts
    if (userWorkoutTypes.length === 0 && !is75Hard) {
      workouts.push(...getGeneralWorkouts());
    }

    // For 75 Hard users, ensure all workouts are at least 45 minutes
    if (is75Hard) {
      workouts = workouts.map(workout => {
        const currentDuration = parseInt(workout.duration);
        if (currentDuration < 45) {
          return {
            ...workout,
            duration: '45 mins',
            name: `${workout.name} (75 Hard Extended)`,
            description: `${workout.description} - Extended to meet 75 Hard minimum duration requirement.`,
            calories: workout.calories.split('-').map(cal => Math.ceil(parseInt(cal) * 2.25)).join('-') // Increase calories proportionally
          };
        }
        return workout;
      });
    }

    return workouts;
  };

  // HIIT Workouts
  const getHIITWorkouts = () => [
    {
      id: 'hiit-1',
      name: 'HIIT Fat Burner',
      duration: '20 mins',
      calories: '300-400',
      difficulty: 'Intermediate',
      type: 'hiit',
      description: 'High-intensity interval training for maximum fat burn',
      exercises: [
        { name: 'Jump Squats', duration: '30s', rest: '10s', reps: '4 rounds' },
        { name: 'Burpees', duration: '20s', rest: '40s', reps: '4 rounds' },
        { name: 'Mountain Climbers', duration: '30s', rest: '10s', reps: '4 rounds' },
        { name: 'Push-up Jacks', duration: '20s', rest: '40s', reps: '4 rounds' },
        { name: 'High Knees', duration: '30s', rest: '10s', reps: '4 rounds' }
      ]
    },
    {
      id: 'hiit-2',
      name: 'Tabata Intensity',
      duration: '16 mins',
      calories: '250-350',
      difficulty: 'Advanced',
      type: 'hiit',
      description: '4-minute Tabata rounds for explosive results',
      exercises: [
        { name: 'Burpees', duration: '20s', rest: '10s', reps: '8 rounds' },
        { name: 'Jump Squats', duration: '20s', rest: '10s', reps: '8 rounds' },
        { name: 'Push-ups', duration: '20s', rest: '10s', reps: '8 rounds' },
        { name: 'Tuck Jumps', duration: '20s', rest: '10s', reps: '8 rounds' }
      ]
    }
  ];

  // Yoga Workouts
  const getYogaWorkouts = () => [
    {
      id: 'yoga-1',
      name: 'Morning Vinyasa Flow',
      duration: '30 mins',
      calories: '150-200',
      difficulty: 'Beginner',
      type: 'yoga',
      description: 'Gentle flow to start your day with energy',
      exercises: [
        { name: 'Sun Salutation A', duration: '3 mins', rest: '30s', reps: '3 rounds' },
        { name: 'Warrior I Flow', duration: '2 mins', rest: '30s', reps: '2 each side' },
        { name: 'Triangle Pose Hold', duration: '1 min', rest: '30s', reps: '2 each side' },
        { name: 'Downward Dog to Plank Flow', duration: '3 mins', rest: '1 min', reps: '3 rounds' },
        { name: 'Seated Spinal Twist', duration: '2 mins', rest: '0s', reps: '2 each side' },
        { name: 'Savasana', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    },
    {
      id: 'yoga-2',
      name: 'Power Yoga Strength',
      duration: '45 mins',
      calories: '200-300',
      difficulty: 'Intermediate',
      type: 'yoga',
      description: 'Build strength and flexibility with power yoga',
      exercises: [
        { name: 'Dynamic Warm-up Flow', duration: '5 mins', rest: '1 min', reps: '1 round' },
        { name: 'Warrior III Balance', duration: '1 min', rest: '30s', reps: '2 each side' },
        { name: 'Side Plank Flow', duration: '2 mins', rest: '1 min', reps: '2 each side' },
        { name: 'Crow Pose Practice', duration: '3 mins', rest: '1 min', reps: '3 attempts' },
        { name: 'Hip Opening Sequence', duration: '8 mins', rest: '2 mins', reps: '1 round' },
        { name: 'Cool Down Stretches', duration: '10 mins', rest: '0s', reps: '1 round' }
      ]
    }
  ];

  // Running Workouts
  const getRunningWorkouts = () => [
    {
      id: 'running-1',
      name: 'Interval Running',
      duration: '30 mins',
      calories: '300-450',
      difficulty: 'Intermediate',
      type: 'running',
      description: 'Speed intervals for improved cardiovascular fitness',
      exercises: [
        { name: 'Warm-up Walk/Jog', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Sprint Intervals', duration: '1 min', rest: '2 mins recovery', reps: '6 rounds' },
        { name: 'Steady Pace Run', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Cool-down Walk', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Dynamic Stretching', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    },
    {
      id: 'running-2',
      name: 'Long Steady Run',
      duration: '45 mins',
      calories: '400-600',
      difficulty: 'Beginner',
      type: 'running',
      description: 'Build endurance with steady-state running',
      exercises: [
        { name: 'Warm-up Walk', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Easy Pace Run', duration: '35 mins', rest: '0s', reps: '1 round' },
        { name: 'Cool-down Walk', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    }
  ];

  // Biking Workouts
  const getBikingWorkouts = () => [
    {
      id: 'biking-1',
      name: 'Hill Climb Training',
      duration: '40 mins',
      calories: '350-500',
      difficulty: 'Intermediate',
      type: 'biking',
      description: 'Build leg strength with hill climbing intervals',
      exercises: [
        { name: 'Easy Pace Warm-up', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Hill Climbs', duration: '3 mins', rest: '2 mins easy', reps: '6 rounds' },
        { name: 'Steady Ride', duration: '10 mins', rest: '0s', reps: '1 round' },
        { name: 'Cool-down Ride', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    },
    {
      id: 'biking-2',
      name: 'Endurance Ride',
      duration: '60 mins',
      calories: '450-650',
      difficulty: 'Beginner',
      type: 'biking',
      description: 'Long steady ride for cardiovascular endurance',
      exercises: [
        { name: 'Gentle Warm-up', duration: '10 mins', rest: '0s', reps: '1 round' },
        { name: 'Steady State Ride', duration: '45 mins', rest: '0s', reps: '1 round' },
        { name: 'Easy Cool-down', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    }
  ];

  // Swimming Workouts
  const getSwimmingWorkouts = () => [
    {
      id: 'swimming-1',
      name: 'Freestyle Intervals',
      duration: '30 mins',
      calories: '250-400',
      difficulty: 'Intermediate',
      type: 'swimming',
      description: 'Freestyle intervals for speed and endurance',
      exercises: [
        { name: 'Easy Warm-up', duration: '5 mins', rest: '0s', reps: '200m easy' },
        { name: 'Freestyle Sprints', duration: '50m', rest: '30s', reps: '8 rounds' },
        { name: 'Easy Recovery', duration: '5 mins', rest: '0s', reps: '200m easy' },
        { name: 'Kickboard Kicks', duration: '5 mins', rest: '0s', reps: '200m' },
        { name: 'Cool-down Swim', duration: '5 mins', rest: '0s', reps: '200m easy' }
      ]
    }
  ];

  // Walking Workouts
  const getWalkingWorkouts = () => [
    {
      id: 'walking-1',
      name: 'Power Walking',
      duration: '45 mins',
      calories: '200-300',
      difficulty: 'Beginner',
      type: 'walking',
      description: 'Brisk walking workout for cardiovascular health',
      exercises: [
        { name: 'Gentle Warm-up', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Brisk Walk', duration: '30 mins', rest: '0s', reps: '1 round' },
        { name: 'Hill Walking', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Cool-down Walk', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    },
    {
      id: 'walking-2',
      name: 'Walking Intervals',
      duration: '35 mins',
      calories: '180-250',
      difficulty: 'Beginner',
      type: 'walking',
      description: 'Interval walking for improved fitness',
      exercises: [
        { name: 'Easy Warm-up Walk', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Fast Walk', duration: '2 mins', rest: '1 min easy', reps: '8 rounds' },
        { name: 'Cool-down Walk', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    }
  ];

  // 75 Hard Specific Workouts
  const get75HardWorkouts = () => [
    {
      id: '75hard-1',
      name: '75 Hard Outdoor Workout',
      duration: '45 mins',
      calories: '400-550',
      difficulty: 'Intermediate',
      type: '75hard',
      description: 'Outdoor workout designed for 75 Hard challenge',
      exercises: [
        { name: 'Dynamic Warm-up', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Walking/Hiking', duration: '20 mins', rest: '0s', reps: '1 round' },
        { name: 'Bodyweight Circuit', duration: '15 mins', rest: '1 min between rounds', reps: '3 rounds' },
        { name: 'Stretching Cool-down', duration: '5 mins', rest: '0s', reps: '1 round' }
      ]
    },
    {
      id: '75hard-2',
      name: '75 Hard Indoor Strength',
      duration: '45 mins',
      calories: '300-450',
      difficulty: 'Intermediate',
      type: '75hard',
      description: 'Indoor strength workout for 75 Hard program',
      exercises: [
        { name: 'Warm-up Movement', duration: '5 mins', rest: '0s', reps: '1 round' },
        { name: 'Push-up Variations', duration: '10 mins', rest: '2 mins', reps: '3 sets' },
        { name: 'Squat Variations', duration: '10 mins', rest: '2 mins', reps: '3 sets' },
        { name: 'Core Circuit', duration: '10 mins', rest: '2 mins', reps: '2 rounds' },
        { name: 'Flexibility Work', duration: '10 mins', rest: '0s', reps: '1 round' }
      ]
    }
  ];

  // General workouts (fallback)
  const getGeneralWorkouts = () => getWorkoutsForGoal(userProfile?.goal || 'maintain');

  // Sample workout data based on user goals
  const getWorkoutsForGoal = (goal) => {
    const workouts = {
      lose_weight: [
        {
          id: 1,
          name: 'HIIT Fat Burner',
          duration: '25 mins',
          calories: '300-400',
          difficulty: 'Intermediate',
          type: 'cardio',
          description: 'High-intensity interval training for maximum fat burn',
          exercises: [
            { name: 'Jumping Jacks', duration: '45s', rest: '15s', reps: null },
            { name: 'Burpees', duration: '30s', rest: '30s', reps: null },
            { name: 'Mountain Climbers', duration: '45s', rest: '15s', reps: null },
            { name: 'High Knees', duration: '30s', rest: '30s', reps: null },
            { name: 'Push-ups', duration: null, rest: '30s', reps: '10-15' },
            { name: 'Squats', duration: null, rest: '30s', reps: '15-20' }
          ]
        },
        {
          id: 2,
          name: 'Insanity Cardio Power',
          duration: '45 mins',
          calories: '400-600',
          difficulty: 'Advanced',
          type: 'cardio',
          description: 'Beachbody-inspired high-intensity cardio workout',
          exercises: [
            { name: 'Power Knees', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Power Jacks', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Power Squats', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Tuck Jumps', duration: '30s', rest: '45s', reps: '3 sets' },
            { name: 'Switch Kicks', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Wide Tuck Jumps', duration: '30s', rest: '45s', reps: '3 sets' }
          ]
        },
        {
          id: 3,
          name: 'T25 Focus',
          duration: '25 mins',
          calories: '250-350',
          difficulty: 'Beginner',
          type: 'cardio',
          description: 'Quick but effective 25-minute cardio blast',
          exercises: [
            { name: 'Marching in Place', duration: '60s', rest: '15s', reps: null },
            { name: 'Knee Ups', duration: '45s', rest: '15s', reps: null },
            { name: 'Butt Kickers', duration: '45s', rest: '15s', reps: null },
            { name: 'Side Steps', duration: '45s', rest: '15s', reps: null },
            { name: 'Jumping Jacks', duration: '45s', rest: '15s', reps: null },
            { name: 'Cool Down Stretch', duration: '3 mins', rest: '0s', reps: null }
          ]
        }
      ],
      gain_muscle: [
        {
          id: 4,
          name: 'P90X Upper Body',
          duration: '60 mins',
          calories: '300-450',
          difficulty: 'Advanced',
          type: 'strength',
          description: 'P90X-inspired upper body strength training',
          exercises: [
            { name: 'Standard Push-ups', duration: null, rest: '30s', reps: '3 sets x max reps' },
            { name: 'Wide Fly Push-ups', duration: null, rest: '30s', reps: '3 sets x max reps' },
            { name: 'Military Push-ups', duration: null, rest: '30s', reps: '3 sets x max reps' },
            { name: 'Pike Push-ups', duration: null, rest: '60s', reps: '3 sets x 8-12' },
            { name: 'Dive Bomber Push-ups', duration: null, rest: '60s', reps: '2 sets x 6-10' },
            { name: 'Diamond Push-ups', duration: null, rest: '60s', reps: '2 sets x 5-8' }
          ]
        },
        {
          id: 5,
          name: 'Body Beast Lower Body',
          duration: '50 mins',
          calories: '350-500',
          difficulty: 'Advanced',
          type: 'strength',
          description: 'Beast-mode leg training for maximum muscle growth',
          exercises: [
            { name: 'Deep Squats', duration: null, rest: '90s', reps: '4 sets x 12-15' },
            { name: 'Bulgarian Split Squats', duration: null, rest: '60s', reps: '3 sets x 10 each leg' },
            { name: 'Jump Squats', duration: null, rest: '60s', reps: '3 sets x 8-12' },
            { name: 'Single Leg Romanian Deadlifts', duration: null, rest: '60s', reps: '3 sets x 8 each leg' },
            { name: 'Calf Raise Holds', duration: '30s', rest: '45s', reps: '3 sets' },
            { name: 'Wall Sit Challenge', duration: '60s', rest: '90s', reps: '2 sets' }
          ]
        },
        {
          id: 6,
          name: '22 Minute Hard Corps Strength',
          duration: '22 mins',
          calories: '200-300',
          difficulty: 'Intermediate',
          type: 'strength',
          description: 'Military-inspired strength training',
          exercises: [
            { name: 'Military Push-ups', duration: null, rest: '30s', reps: '3 sets x 10-15' },
            { name: 'Squat Thrusts', duration: null, rest: '30s', reps: '3 sets x 8-12' },
            { name: 'Mountain Climbers', duration: '30s', rest: '30s', reps: '3 sets' },
            { name: 'Plank Hold', duration: '45s', rest: '30s', reps: '3 sets' },
            { name: 'Bear Crawls', duration: '30s', rest: '30s', reps: '3 sets' }
          ]
        }
      ],
      maintain: [
        {
          id: 7,
          name: 'Core de Force Mixed',
          duration: '35 mins',
          calories: '300-400',
          difficulty: 'Intermediate',
          type: 'mixed',
          description: 'MMA-inspired mixed workout for overall fitness',
          exercises: [
            { name: 'Jab-Cross Combo', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Hooks and Uppercuts', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Knee Strikes', duration: '45s', rest: '30s', reps: '3 sets' },
            { name: 'Sprawls', duration: '30s', rest: '30s', reps: '3 sets' },
            { name: 'Plank to T', duration: null, rest: '45s', reps: '2 sets x 8 each side' },
            { name: 'Cool Down Shadow Boxing', duration: '3 mins', rest: '0s', reps: null }
          ]
        },
        {
          id: 8,
          name: 'PiYo Flow',
          duration: '40 mins',
          calories: '250-350',
          difficulty: 'Beginner',
          type: 'mixed',
          description: 'Pilates-Yoga fusion for strength and flexibility',
          exercises: [
            { name: 'Warrior III Flow', duration: '60s', rest: '30s', reps: '2 sets each leg' },
            { name: 'Chair to Twisted Triangle', duration: '60s', rest: '30s', reps: '2 sets each side' },
            { name: 'Plank to Downward Dog', duration: '45s', rest: '30s', reps: '3 sets' },
            { name: 'Side Plank Dips', duration: '30s', rest: '30s', reps: '2 sets each side' },
            { name: 'Beast to Child\'s Pose Flow', duration: '60s', rest: '30s', reps: '3 sets' }
          ]
        }
      ],
      improve_fitness: [
        {
          id: 9,
          name: 'Transform 20 Burn',
          duration: '20 mins',
          calories: '200-300',
          difficulty: 'Intermediate',
          type: 'functional',
          description: 'Quick but intense functional fitness transformation',
          exercises: [
            { name: 'Step Touch to Squat', duration: '45s', rest: '15s', reps: '4 rounds' },
            { name: 'Push-up to T', duration: '45s', rest: '15s', reps: '4 rounds' },
            { name: 'Lateral Lunges', duration: '45s', rest: '15s', reps: '4 rounds' },
            { name: 'Mountain Climber Twists', duration: '45s', rest: '15s', reps: '4 rounds' },
            { name: 'Burpee Variations', duration: '45s', rest: '15s', reps: '4 rounds' }
          ]
        },
        {
          id: 10,
          name: 'Shift Shop Functional',
          duration: '40 mins',
          calories: '300-450',
          difficulty: 'Advanced',
          type: 'functional',
          description: 'Athletic-based functional training',
          exercises: [
            { name: 'Agility Ladder Drills', duration: '60s', rest: '30s', reps: '3 sets' },
            { name: 'Turkish Get-ups', duration: null, rest: '60s', reps: '2 sets x 5 each side' },
            { name: 'Single Leg Deadlift to Knee', duration: null, rest: '45s', reps: '3 sets x 8 each leg' },
            { name: 'Bear Crawl to Crab Walk', duration: '45s', rest: '45s', reps: '3 sets' },
            { name: 'Explosive Burpees', duration: null, rest: '60s', reps: '3 sets x 6-8' },
            { name: 'Cool Down Mobility Flow', duration: '5 mins', rest: '0s', reps: null }
          ]
        }
      ]
    };
    
    return workouts[goal] || workouts.maintain;
  };

  // Get workouts based on user preferences first, then fallback to goal-based workouts
  const userPreferenceWorkouts = getWorkoutsForUserPreferences();
  const goalBasedWorkouts = getWorkoutsForGoal(userProfile?.goal || 'maintain');
  const allWorkouts = userPreferenceWorkouts.length > 0 ? userPreferenceWorkouts : goalBasedWorkouts;
  
  const filteredWorkouts = selectedWorkoutType === 'all' 
    ? allWorkouts 
    : allWorkouts.filter(w => w.type === selectedWorkoutType);

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
    setIsWorkoutActive(true);
  };

  const completeExercise = () => {
    const newCompleted = [...completedExercises, currentExercise];
    setCompletedExercises(newCompleted);
    
    if (currentExercise < activeWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      // Workout complete - calculate burned calories
      const caloriesRange = activeWorkout.calories.split('-');
      const avgCalories = Math.round((parseInt(caloriesRange[0]) + parseInt(caloriesRange[1])) / 2);
      setBurnedCalories(avgCalories);
      setShowCalorieBonus(true);
      setIsWorkoutActive(false);
    }
  };

  const restartWorkout = () => {
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
  };

  const toggleWorkoutSelection = (workout) => {
    const isSelected = selectedWorkouts.some(w => w.id === workout.id);
    if (isSelected) {
      setSelectedWorkouts(selectedWorkouts.filter(w => w.id !== workout.id));
    } else {
      setSelectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  const addToWeeklyPlan = () => {
    // This would integrate with the weekly plan component
    // For now, we'll show a confirmation and save to localStorage
    const existingPlan = JSON.parse(localStorage.getItem('weeklyWorkoutPlan') || '[]');
    const updatedPlan = [...existingPlan, ...selectedWorkouts.map(workout => ({
      ...workout,
      scheduledFor: 'user-selected',
      addedDate: new Date().toISOString()
    }))];
    
    localStorage.setItem('weeklyWorkoutPlan', JSON.stringify(updatedPlan));
    setShowWeeklyPlanUpdate(true);
    setSelectedWorkouts([]);
    
    setTimeout(() => setShowWeeklyPlanUpdate(false), 3000);
  };

  const exitWorkout = () => {
    setActiveWorkout(null);
    setIsWorkoutActive(false);
    setCurrentExercise(0);
    setCompletedExercises([]);
    setWorkoutTimer(0);
    setBurnedCalories(0);
    setShowCalorieBonus(false);
  };

  const addCalorieBonus = () => {
    // This would integrate with the user's daily calorie tracking
    // For now, we'll show a success message
    setShowCalorieBonus(false);
    // In a real app, this would update the user's daily calorie allowance
    alert(`Added ${burnedCalories} calories to your daily allowance! You can now eat an extra ${burnedCalories} calories today.`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'Advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'cardio': return 'text-orange-400';
      case 'strength': return 'text-blue-400';
      case 'mixed': return 'text-purple-400';
      case 'functional': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (activeWorkout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Active Workout Header */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{activeWorkout.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Timer className="w-4 h-4 mr-1" />
                  <span>{Math.floor(workoutTimer / 60)}:{(workoutTimer % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  <span>{completedExercises.length}/{activeWorkout.exercises.length} exercises</span>
                </div>
              </div>
            </div>
            <button
              onClick={exitWorkout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Exit
            </button>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedExercises.length / activeWorkout.exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Exercise */}
        {isWorkoutActive && currentExercise < activeWorkout.exercises.length && (
          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl mb-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeWorkout.exercises[currentExercise].name}
              </h2>
              
              <div className="flex items-center justify-center space-x-6 mb-6 text-lg">
                {activeWorkout.exercises[currentExercise].reps && (
                  <div className="text-orange-400">
                    <span className="font-semibold">{activeWorkout.exercises[currentExercise].reps}</span>
                  </div>
                )}
                {activeWorkout.exercises[currentExercise].duration && (
                  <div className="text-blue-400">
                    <Clock className="inline w-5 h-5 mr-1" />
                    <span className="font-semibold">{activeWorkout.exercises[currentExercise].duration}</span>
                  </div>
                )}
                {activeWorkout.exercises[currentExercise].rest && (
                  <div className="text-gray-400">
                    Rest: <span className="font-semibold">{activeWorkout.exercises[currentExercise].rest}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={completeExercise}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center mx-auto"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Complete Exercise
              </button>
            </div>
          </div>
        )}

        {/* Calorie Bonus Modal */}
        {showCalorieBonus && (
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl p-8 rounded-2xl border border-green-500/30 shadow-2xl text-center mb-6">
            <Flame className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Calories Burned!</h2>
            <p className="text-gray-300 mb-4">You burned approximately <span className="text-orange-400 font-bold">{burnedCalories} calories</span></p>
            <p className="text-sm text-gray-400 mb-6">Would you like to add these calories to your daily allowance?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={addCalorieBonus}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Bonus Calories
              </button>
              <button
                onClick={() => setShowCalorieBonus(false)}
                className="px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* Workout Complete */}
        {!isWorkoutActive && completedExercises.length === activeWorkout.exercises.length && !showCalorieBonus && (
          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl text-center">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Workout Complete!</h2>
            <p className="text-gray-300 mb-6">Great job finishing {activeWorkout.name}!</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={restartWorkout}
                className="px-6 py-3 bg-blue-500/20 text-blue-400 rounded-xl font-semibold hover:bg-blue-500/30 transition-colors flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Do Again
              </button>
              <button
                onClick={exitWorkout}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Workouts
              </button>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Exercise List</h3>
          <div className="space-y-3">
            {activeWorkout.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-colors ${
                  completedExercises.includes(index)
                    ? 'bg-green-500/10 border-green-500/30'
                    : index === currentExercise && isWorkoutActive
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{exercise.name}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    {exercise.reps && <span>{exercise.reps}</span>}
                    {exercise.duration && <span>{exercise.duration}</span>}
                    {completedExercises.includes(index) && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent mb-2">
            Workout Plans
          </h1>
          <p className="text-gray-300">
            Personalized workouts for your {userProfile?.goal?.replace('_', ' ')} goal
          </p>
        </div>
      </div>

      {/* Selected Workouts Summary */}
      {selectedWorkouts.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-400/30 p-4 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 font-semibold">Selected Workouts ({selectedWorkouts.length})</h3>
              <p className="text-gray-300 text-sm">
                {selectedWorkouts.map(w => w.name).join(', ')}
              </p>
            </div>
            <button
              onClick={addToWeeklyPlan}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Add to Weekly Plan
            </button>
          </div>
        </div>
      )}

      {/* Success notification */}
      {showWeeklyPlanUpdate && (
        <div className="bg-green-500/10 border border-green-400/30 p-4 rounded-xl mb-6 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
          <span className="text-green-400 font-semibold">Workouts added to your weekly plan!</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'hiit', 'yoga', 'running', 'biking', 'swimming', 'walking', '75hard', 'cardio', 'strength', 'mixed', 'functional'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedWorkoutType(type)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors capitalize ${
              selectedWorkoutType === type
                ? 'bg-orange-500/20 text-orange-400'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkouts.map(workout => (
          <div key={workout.id} className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Dumbbell className={`w-6 h-6 mr-3 ${getTypeColor(workout.type)}`} />
                <div>
                  <h3 className="text-xl font-semibold text-white">{workout.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{workout.description}</p>
            
            <div className="flex items-center justify-between mb-4 text-sm">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span>{workout.duration}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Flame className="w-4 h-4 mr-1" />
                <span>{workout.calories} cal</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">{workout.exercises.length} exercises</p>
              <div className="space-y-1">
                {workout.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    • {exercise.name}
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <div className="text-xs text-gray-500">+ {workout.exercises.length - 3} more</div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleWorkoutSelection(workout)}
                className={`py-3 rounded-xl font-semibold transition-all flex items-center justify-center ${
                  selectedWorkouts.some(w => w.id === workout.id)
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-400'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {selectedWorkouts.some(w => w.id === workout.id) ? 'Selected' : 'Select'}
              </button>
              <button
                onClick={() => startWorkout(workout)}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredWorkouts.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No workouts found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Workouts;