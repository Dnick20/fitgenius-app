/**
 * Workout Intelligence Bot - Advanced Exercise Programming System
 * Combines body type science, BeachBody programs, and AI for optimal workouts
 */

import OpenAI from 'openai';

class WorkoutIntelligenceBot {
  constructor(apiKey = process.env.REACT_APP_OPENAI_API_KEY) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // For development - use backend proxy in production
    });
    
    // BeachBody program knowledge base
    this.beachBodyPrograms = {
      p90x: {
        name: 'P90X',
        duration: 90,
        style: 'muscle confusion',
        intensity: 'extreme',
        equipment: ['dumbbells', 'pull_up_bar', 'resistance_bands'],
        focus: ['strength', 'endurance', 'flexibility'],
        schedule: {
          week1_3: ['Chest & Back', 'Plyometrics', 'Shoulders & Arms', 'Yoga X', 'Legs & Back', 'Kenpo X', 'Rest'],
          week4: ['Yoga X', 'Core Synergistics', 'Kenpo X', 'X Stretch', 'Core Synergistics', 'Yoga X', 'Rest']
        }
      },
      insanity: {
        name: 'Insanity',
        duration: 60,
        style: 'max interval training',
        intensity: 'extreme',
        equipment: ['none'],
        focus: ['cardio', 'plyometrics', 'core'],
        schedule: {
          month1: ['Fit Test', 'Plyometric Cardio', 'Cardio Power', 'Cardio Recovery', 'Pure Cardio', 'Plyometric Cardio', 'Rest'],
          month2: ['Max Interval Circuit', 'Max Interval Plyo', 'Max Cardio Conditioning', 'Max Recovery', 'Max Interval Circuit', 'Max Interval Sports', 'Rest']
        }
      },
      '21dayfix': {
        name: '21 Day Fix',
        duration: 21,
        style: 'simple fitness',
        intensity: 'moderate',
        equipment: ['dumbbells', 'resistance_bands'],
        focus: ['full_body', 'portion_control'],
        schedule: {
          daily: ['Total Body Cardio', 'Upper Fix', 'Lower Fix', 'Pilates', 'Cardio', 'Dirty 30', 'Yoga']
        }
      },
      t25: {
        name: 'Focus T25',
        duration: 70,
        style: '25-minute focused',
        intensity: 'high',
        equipment: ['dumbbells'],
        focus: ['cardio', 'strength', 'core'],
        schedule: {
          alpha: ['Cardio', 'Speed 1.0', 'Total Body', 'Ab Intervals', 'Lower Focus', 'Cardio', 'Rest'],
          beta: ['Core Cardio', 'Speed 2.0', 'Rip\'t Circuit', 'Dynamic Core', 'Upper Focus', 'Speed 2.0', 'Rest']
        }
      },
      liift4: {
        name: 'LIIFT4',
        duration: 56,
        style: 'lifting and HIIT',
        intensity: 'high',
        equipment: ['dumbbells', 'resistance_bands'],
        focus: ['strength', 'hiit'],
        schedule: {
          weekly: ['Chest/Triceps', 'Back/Biceps', 'Shoulders', 'Legs', 'HIIT', 'Rest', 'Rest']
        }
      }
    };

    // Body type training principles
    this.bodyTypeStrategies = {
      ectomorph: {
        training_style: 'hypertrophy_focused',
        rep_ranges: { strength: '4-6', hypertrophy: '8-12', endurance: '12-15' },
        rest_periods: { compound: '2-3 min', isolation: '60-90 sec' },
        volume: 'moderate',
        frequency: '3-4 days/week',
        cardio: 'minimal',
        focus_areas: ['compound_movements', 'progressive_overload', 'muscle_building'],
        avoid: ['excessive_cardio', 'overtraining', 'skipping_meals'],
        best_programs: ['p90x', 'hammer', 'liift4', 'mbf']
      },
      mesomorph: {
        training_style: 'balanced_approach',
        rep_ranges: { strength: '6-8', hypertrophy: '8-12', endurance: '12-20' },
        rest_periods: { compound: '90-120 sec', isolation: '45-60 sec' },
        volume: 'moderate_to_high',
        frequency: '4-6 days/week',
        cardio: 'moderate',
        focus_areas: ['variety', 'periodization', 'athletic_performance'],
        avoid: ['stagnation', 'same_routine', 'ignoring_flexibility'],
        best_programs: ['p90x3', 't25', '80day', '645']
      },
      endomorph: {
        training_style: 'metabolic_focused',
        rep_ranges: { strength: '8-10', hypertrophy: '10-15', endurance: '15-25' },
        rest_periods: { compound: '45-60 sec', isolation: '30-45 sec' },
        volume: 'high',
        frequency: '5-6 days/week',
        cardio: 'high',
        focus_areas: ['circuit_training', 'metabolic_conditioning', 'fat_loss'],
        avoid: ['long_rest_periods', 'low_intensity', 'isolation_only'],
        best_programs: ['insanity', 'transform', 'mbf', 'mm100']
      }
    };
  }

  /**
   * Generate comprehensive workout plan based on body type and goals
   */
  async generateWorkoutPlan(profile, preferences) {
    const {
      body_type,
      fitness_goal,
      workout_preferences = [],
      available_equipment = [],
      weekly_workout_days,
      current_weight,
      goal_weight,
      activity_level,
      age,
      gender
    } = profile;

    const {
      duration_weeks,
      difficulty_level,
      beachbody_program,
      time_per_session = 45,
      focus_area
    } = preferences;

    const systemPrompt = `You are an elite fitness coach and exercise scientist with expertise in:
    - Body type-specific training (somatotype training)
    - BeachBody program methodologies
    - Progressive overload and periodization
    - Injury prevention and mobility
    - Sport-specific training
    - Metabolic conditioning
    
    You understand how different body types respond to training and can create highly effective, personalized workout programs.`;

    const userPrompt = `Create a ${duration_weeks}-week workout plan optimized for:

    CLIENT PROFILE:
    - Body Type: ${body_type}
    - Goal: ${fitness_goal}
    - Current Weight: ${current_weight} lbs
    - Goal Weight: ${goal_weight} lbs
    - Age: ${age}, Gender: ${gender}
    - Activity Level: ${activity_level}
    - Available Days: ${weekly_workout_days} days/week
    - Available Equipment: ${available_equipment.join(', ')}
    - Time per Session: ${time_per_session} minutes
    - Difficulty: ${difficulty_level}
    ${beachbody_program ? `- Inspired by: ${this.beachBodyPrograms[beachbody_program]?.name} methodology` : ''}

    BODY TYPE OPTIMIZATION (${body_type}):
    ${JSON.stringify(this.bodyTypeStrategies[body_type], null, 2)}

    PROGRAMMING REQUIREMENTS:
    1. Apply body type-specific training principles:
       - Ectomorph: Focus on compound movements, longer rest, muscle building
       - Mesomorph: Balanced training with variety and periodization
       - Endomorph: High-intensity circuits, metabolic work, shorter rest

    2. Progressive overload structure:
       - Week 1-2: Adaptation phase
       - Week 3-4: Volume increase
       - Week 5-6: Intensity increase
       - Week 7-8: Peak/Deload

    3. For each workout include:
       - Warm-up protocol (5-10 min)
       - Main workout with exercise order
       - Cool-down and stretching
       - RPE (Rate of Perceived Exertion) targets
       - Form cues for key exercises
       - Modification options

    4. Weekly split optimization based on ${weekly_workout_days} days:
       - 3 days: Full body
       - 4 days: Upper/Lower or Push/Pull
       - 5 days: Push/Pull/Legs + accessories
       - 6 days: PPL x2 or body part split

    5. Include periodization:
       - Undulating (daily variation)
       - Linear (weekly progression)
       - Block (phase-based)

    Return JSON format:
    {
      "name": "Program name",
      "duration_weeks": number,
      "difficulty_level": "string",
      "body_type_focus": "string",
      "weekly_schedule": {
        "monday": "workout_type",
        "tuesday": "workout_type",
        ...
      },
      "workouts": [
        {
          "week": number,
          "day": number,
          "name": "Workout name",
          "type": "strength|cardio|hiit|recovery",
          "duration_minutes": number,
          "warmup": {
            "exercises": ["exercise: duration/reps"],
            "total_time": minutes
          },
          "main_workout": [
            {
              "exercise": "name",
              "sets": number,
              "reps": "range or time",
              "rest_seconds": number,
              "weight": "percentage or RPE",
              "tempo": "eccentric-pause-concentric-pause",
              "form_cues": ["cue1", "cue2"],
              "modification": "easier option"
            }
          ],
          "cooldown": {
            "exercises": ["stretch: duration"],
            "total_time": minutes
          },
          "workout_notes": "coaching tips",
          "estimated_calories": number,
          "target_heart_rate": "zone or bpm"
        }
      ],
      "progression_strategy": "How to progress week to week",
      "recovery_protocol": {
        "active_recovery": ["activities"],
        "mobility_work": ["exercises"],
        "nutrition_focus": "post-workout nutrition"
      },
      "equipment_needed": ["items"],
      "supplement_recommendations": ["optional supplements"]
    }`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000
      });

      const workoutPlan = JSON.parse(completion.choices[0].message.content);
      return this.enhanceWorkoutPlan(workoutPlan, profile, preferences);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      return this.generateAdvancedFallbackPlan(profile, preferences);
    }
  }

  /**
   * Generate body type-specific exercise selection
   */
  async selectExercisesForBodyType(bodyType, muscleGroup, equipment) {
    const prompt = `Select the most effective exercises for:
    Body Type: ${bodyType}
    Muscle Group: ${muscleGroup}
    Available Equipment: ${equipment.join(', ')}
    
    Consider:
    - Ectomorph: Compound movements, free weights, minimal isolation
    - Mesomorph: Mix of compound and isolation, variety
    - Endomorph: Circuit-friendly, metabolic exercises, compounds
    
    Provide 5 exercises ranked by effectiveness with reasoning.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an exercise selection specialist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 800
      });

      return this.parseExerciseSelection(completion.choices[0].message.content);
    } catch (error) {
      return this.getDefaultExercises(bodyType, muscleGroup);
    }
  }

  /**
   * Calculate workout intensity based on multiple factors
   */
  calculateOptimalIntensity(profile, weekNumber, dayInWeek) {
    const { body_type, fitness_goal, activity_level, age } = profile;
    
    // Base intensity by body type
    const baseIntensity = {
      ectomorph: 0.75, // Higher intensity, lower volume
      mesomorph: 0.70, // Moderate intensity, moderate volume
      endomorph: 0.65  // Moderate intensity, higher volume
    };

    // Adjust for age
    const ageMultiplier = age < 30 ? 1.0 : age < 40 ? 0.95 : age < 50 ? 0.90 : 0.85;

    // Adjust for goal
    const goalMultiplier = {
      weight_loss: 0.85,
      muscle_gain: 0.90,
      maintenance: 0.80,
      athletic_performance: 0.95
    };

    // Weekly undulation
    const weeklyWave = Math.sin((weekNumber * Math.PI) / 4) * 0.1 + 1;

    // Daily undulation
    const dailyVariation = dayInWeek % 2 === 0 ? 0.95 : 1.05;

    const intensity = baseIntensity[body_type] * 
                     ageMultiplier * 
                     goalMultiplier[fitness_goal] * 
                     weeklyWave * 
                     dailyVariation;

    return {
      percentage: Math.round(intensity * 100),
      rpe: Math.round(intensity * 10),
      heartRateZone: this.calculateHeartRateZone(age, intensity)
    };
  }

  calculateHeartRateZone(age, intensity) {
    const maxHR = 220 - age;
    const targetHR = Math.round(maxHR * intensity);
    
    if (intensity < 0.6) return `Zone 1: ${targetHR-10}-${targetHR+10} bpm (Recovery)`;
    if (intensity < 0.7) return `Zone 2: ${targetHR-10}-${targetHR+10} bpm (Base)`;
    if (intensity < 0.8) return `Zone 3: ${targetHR-10}-${targetHR+10} bpm (Tempo)`;
    if (intensity < 0.9) return `Zone 4: ${targetHR-10}-${targetHR+10} bpm (Threshold)`;
    return `Zone 5: ${targetHR-10}-${targetHR+10} bpm (Max)`;
  }

  /**
   * Generate recovery and mobility work based on body type
   */
  async generateRecoveryProtocol(bodyType, workoutIntensity, musclesWorked) {
    const prompt = `Design recovery protocol for:
    Body Type: ${bodyType}
    Today's Intensity: ${workoutIntensity}/10
    Muscles Worked: ${musclesWorked.join(', ')}
    
    Include:
    1. Immediate post-workout (0-30 min)
    2. Same day recovery (2-4 hours post)
    3. Next day active recovery
    4. Mobility work specific to body type
    5. Sleep optimization tips`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a recovery and regeneration specialist." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 1000
      });

      return this.parseRecoveryProtocol(completion.choices[0].message.content);
    } catch (error) {
      return this.getDefaultRecovery(bodyType, workoutIntensity);
    }
  }

  /**
   * Adapt BeachBody programs to individual needs
   */
  adaptBeachBodyProgram(programId, profile) {
    const program = this.beachBodyPrograms[programId];
    if (!program) return null;

    const { body_type, available_equipment, fitness_goal } = profile;

    // Adapt based on body type
    const adaptations = {
      ectomorph: {
        modifications: [
          "Reduce cardio days by 30%",
          "Add 30-60 seconds extra rest between sets",
          "Focus on progressive overload over intensity",
          "Add calorie-dense post-workout nutrition"
        ],
        schedule_changes: "Replace 1 cardio day with strength training"
      },
      mesomorph: {
        modifications: [
          "Follow program as designed",
          "Add 10% more volume on strength days",
          "Include variety challenges each week",
          "Mix up exercise order periodically"
        ],
        schedule_changes: "Add optional active recovery activities"
      },
      endomorph: {
        modifications: [
          "Add 10-15 minutes cardio to strength days",
          "Reduce rest periods by 15-30 seconds",
          "Include metabolic finishers",
          "Focus on circuit-style training"
        ],
        schedule_changes: "Add 1 extra HIIT or cardio session"
      }
    };

    // Equipment substitutions
    const equipmentSubs = this.generateEquipmentSubstitutions(
      program.equipment,
      available_equipment
    );

    return {
      original_program: program.name,
      body_type_adaptations: adaptations[body_type],
      equipment_substitutions: equipmentSubs,
      intensity_adjustment: this.calculateIntensityAdjustment(profile),
      nutrition_pairing: this.getProgramNutrition(programId, fitness_goal)
    };
  }

  generateEquipmentSubstitutions(required, available) {
    const substitutions = {
      dumbbells: ["resistance_bands", "water bottles", "bodyweight variations"],
      pull_up_bar: ["resistance band lat pulldowns", "bent over rows", "superman pulls"],
      kettlebells: ["dumbbells", "weighted backpack", "resistance bands"],
      barbell: ["dumbbells", "resistance bands", "bodyweight"]
    };

    const subs = {};
    required.forEach(item => {
      if (!available.includes(item)) {
        subs[item] = substitutions[item] || ["bodyweight alternative"];
      }
    });
    return subs;
  }

  calculateIntensityAdjustment(profile) {
    const { age, activity_level, body_type } = profile;
    
    let adjustment = 1.0;
    
    // Age adjustments
    if (age > 50) adjustment *= 0.85;
    else if (age > 40) adjustment *= 0.92;
    
    // Activity level adjustments
    if (activity_level === 'sedentary') adjustment *= 0.75;
    else if (activity_level === 'lightly_active') adjustment *= 0.85;
    
    // Body type adjustments
    if (body_type === 'ectomorph') adjustment *= 0.9;
    else if (body_type === 'endomorph') adjustment *= 1.05;
    
    return Math.round(adjustment * 100) + '% of prescribed intensity';
  }

  getProgramNutrition(programId, goal) {
    const nutritionPlans = {
      p90x: {
        weight_loss: "Phase 1: Fat Shredder (50% protein, 30% carbs, 20% fat)",
        muscle_gain: "Phase 2: Energy Booster (40% protein, 40% carbs, 20% fat)",
        maintenance: "Phase 3: Endurance Maximizer (20% protein, 60% carbs, 20% fat)"
      },
      insanity: {
        weight_loss: "Elite Nutrition: 40% protein, 40% carbs, 20% fat",
        muscle_gain: "Not optimal for muscle gain - adjust to 35% protein, 45% carbs, 20% fat",
        maintenance: "Month 2: 30% protein, 50% carbs, 20% fat"
      }
    };

    return nutritionPlans[programId]?.[goal] || "Balanced: 30% protein, 40% carbs, 30% fat";
  }

  /**
   * Enhanced workout plan with body type optimizations
   */
  enhanceWorkoutPlan(plan, profile, preferences) {
    const { body_type } = profile;
    
    // Add body type-specific warm-ups
    plan.warmup_protocol = this.getBodyTypeWarmup(body_type);
    
    // Add progression strategies
    plan.progression_model = this.getProgressionModel(body_type, preferences.difficulty_level);
    
    // Add recovery days
    plan.recovery_schedule = this.getRecoverySchedule(body_type, plan.duration_weeks);
    
    // Add performance metrics
    plan.tracking_metrics = this.getTrackingMetrics(profile.fitness_goal);
    
    // Add periodization waves
    plan.periodization = this.getPeriodization(plan.duration_weeks, body_type);
    
    return plan;
  }

  getBodyTypeWarmup(bodyType) {
    const warmups = {
      ectomorph: {
        duration: "10-12 minutes",
        focus: "joint mobility and activation",
        exercises: [
          "Arm circles: 30 seconds each direction",
          "Leg swings: 15 each leg",
          "Light cardio: 3-5 minutes easy pace",
          "Dynamic stretching: 3 minutes",
          "Activation exercises: 2 sets light weight"
        ]
      },
      mesomorph: {
        duration: "8-10 minutes",
        focus: "dynamic movement and preparation",
        exercises: [
          "Jump rope or jog: 2-3 minutes",
          "Dynamic stretching: 3 minutes",
          "Sport-specific movements: 2 minutes",
          "Progressive sets: 50%, 70% effort"
        ]
      },
      endomorph: {
        duration: "12-15 minutes",
        focus: "metabolic activation and mobility",
        exercises: [
          "Low-intensity cardio: 5 minutes increasing pace",
          "Full body dynamic stretches: 4 minutes",
          "Bodyweight circuit: 3 minutes",
          "Activation drills: 2-3 minutes"
        ]
      }
    };
    
    return warmups[bodyType] || warmups.mesomorph;
  }

  getProgressionModel(bodyType, difficulty) {
    const models = {
      ectomorph: {
        type: "Linear progression",
        weekly_increase: "2.5-5% load or 1-2 reps",
        deload_frequency: "Every 4 weeks",
        focus: "Consistent progressive overload"
      },
      mesomorph: {
        type: "Undulating periodization",
        variation: "Daily intensity changes",
        deload_frequency: "Every 3-4 weeks",
        focus: "Variety and adaptation"
      },
      endomorph: {
        type: "Block periodization",
        phases: "3-week blocks with different focus",
        deload_frequency: "Every 3 weeks",
        focus: "Metabolic progression"
      }
    };
    
    return models[bodyType] || models.mesomorph;
  }

  getRecoverySchedule(bodyType, weeks) {
    const recovery = {
      ectomorph: {
        rest_days_per_week: 3,
        active_recovery: "Light walking, yoga",
        deload_weeks: Math.floor(weeks / 4),
        sleep_recommendation: "8-9 hours minimum"
      },
      mesomorph: {
        rest_days_per_week: 2,
        active_recovery: "Swimming, cycling, sports",
        deload_weeks: Math.floor(weeks / 3),
        sleep_recommendation: "7-8 hours"
      },
      endomorph: {
        rest_days_per_week: 1,
        active_recovery: "Walking, light cardio, stretching",
        deload_weeks: Math.floor(weeks / 3),
        sleep_recommendation: "7-9 hours"
      }
    };
    
    return recovery[bodyType] || recovery.mesomorph;
  }

  getTrackingMetrics(goal) {
    const metrics = {
      weight_loss: [
        "Body weight (weekly)",
        "Body measurements (bi-weekly)",
        "Performance metrics (reps, weights)",
        "Energy levels (daily)",
        "Recovery quality"
      ],
      muscle_gain: [
        "Strength increases (weekly)",
        "Body measurements (weekly)",
        "Progressive overload tracking",
        "Volume progression",
        "Recovery between sessions"
      ],
      athletic_performance: [
        "Performance benchmarks",
        "Power output",
        "Speed/agility tests",
        "Recovery time",
        "Sport-specific metrics"
      ],
      maintenance: [
        "Consistency tracking",
        "Energy levels",
        "Workout enjoyment",
        "Body composition",
        "General fitness markers"
      ]
    };
    
    return metrics[goal] || metrics.maintenance;
  }

  getPeriodization(weeks, bodyType) {
    const phases = [];
    const phaseLength = Math.floor(weeks / 4);
    
    const phaseTypes = {
      ectomorph: ["Anatomical Adaptation", "Hypertrophy", "Strength", "Power/Deload"],
      mesomorph: ["General Prep", "Hypertrophy", "Strength/Power", "Peak/Deload"],
      endomorph: ["Metabolic Conditioning", "Strength Endurance", "Power Endurance", "Active Recovery"]
    };
    
    const selectedPhases = phaseTypes[bodyType] || phaseTypes.mesomorph;
    
    for (let i = 0; i < 4 && i * phaseLength < weeks; i++) {
      phases.push({
        weeks: `${i * phaseLength + 1}-${Math.min((i + 1) * phaseLength, weeks)}`,
        phase: selectedPhases[i],
        focus: this.getPhaseFocus(selectedPhases[i]),
        intensity: this.getPhaseIntensity(selectedPhases[i])
      });
    }
    
    return phases;
  }

  getPhaseFocus(phaseName) {
    const focuses = {
      "Anatomical Adaptation": "Form, technique, and movement patterns",
      "Hypertrophy": "Muscle growth and volume",
      "Strength": "Maximum force production",
      "Power/Deload": "Speed and recovery",
      "General Prep": "Overall conditioning",
      "Strength/Power": "Force and speed development",
      "Peak/Deload": "Performance peak and recovery",
      "Metabolic Conditioning": "Fat loss and endurance",
      "Strength Endurance": "Sustained effort capacity",
      "Power Endurance": "Repeated explosive efforts",
      "Active Recovery": "Restoration and adaptation"
    };
    
    return focuses[phaseName] || "General fitness";
  }

  getPhaseIntensity(phaseName) {
    const intensities = {
      "Anatomical Adaptation": "50-70% 1RM",
      "Hypertrophy": "65-85% 1RM",
      "Strength": "80-95% 1RM",
      "Power/Deload": "30-60% 1RM",
      "General Prep": "60-75% 1RM",
      "Strength/Power": "75-90% 1RM",
      "Peak/Deload": "40-70% 1RM",
      "Metabolic Conditioning": "40-70% 1RM",
      "Strength Endurance": "50-70% 1RM",
      "Power Endurance": "50-75% 1RM",
      "Active Recovery": "Bodyweight or light"
    };
    
    return intensities[phaseName] || "Moderate";
  }

  /**
   * Advanced fallback plan generation
   */
  generateAdvancedFallbackPlan(profile, preferences) {
    const { body_type, weekly_workout_days, fitness_goal } = profile;
    const { duration_weeks, difficulty_level, beachbody_program } = preferences;
    
    // Get base template for body type
    const template = this.getBodyTypeTemplate(body_type, weekly_workout_days);
    
    // Apply BeachBody methodology if selected
    if (beachbody_program) {
      template.methodology = this.beachBodyPrograms[beachbody_program];
    }
    
    // Generate weekly workouts
    const workouts = this.generateWeeklyWorkouts(
      template,
      duration_weeks,
      difficulty_level,
      profile
    );
    
    return {
      name: `${body_type} Optimized ${fitness_goal} Plan`,
      duration_weeks,
      difficulty_level,
      body_type_focus: body_type,
      workouts,
      progression_strategy: this.getProgressionModel(body_type, difficulty_level),
      recovery_protocol: this.getRecoverySchedule(body_type, duration_weeks),
      equipment_needed: profile.available_equipment
    };
  }

  getBodyTypeTemplate(bodyType, daysPerWeek) {
    const templates = {
      ectomorph: {
        3: ["Full Body A", "Rest", "Full Body B", "Rest", "Full Body C", "Rest", "Rest"],
        4: ["Upper Power", "Lower Power", "Rest", "Upper Hypertrophy", "Lower Hypertrophy", "Rest", "Rest"],
        5: ["Push", "Pull", "Legs", "Rest", "Upper", "Lower", "Rest"]
      },
      mesomorph: {
        3: ["Full Body Power", "Rest", "Full Body Hypertrophy", "Rest", "Full Body Endurance", "Active Recovery", "Rest"],
        4: ["Push", "Pull", "Rest", "Legs", "Full Body", "Active Recovery", "Rest"],
        5: ["Push", "Pull", "Legs", "Upper", "Lower", "Active Recovery", "Rest"],
        6: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Rest"]
      },
      endomorph: {
        3: ["Full Body Circuit", "Cardio", "Full Body Circuit", "Active Recovery", "Full Body Circuit", "Cardio", "Rest"],
        4: ["Upper Circuit", "Lower + Cardio", "Rest", "Full Body HIIT", "Metabolic", "Active Recovery", "Rest"],
        5: ["Upper", "Lower + Cardio", "HIIT", "Upper", "Lower + Cardio", "Active Recovery", "Rest"],
        6: ["Push", "Pull + Cardio", "Legs", "HIIT", "Full Body", "Cardio", "Rest"]
      }
    };
    
    return templates[bodyType]?.[daysPerWeek] || templates.mesomorph[4];
  }

  generateWeeklyWorkouts(template, weeks, difficulty, profile) {
    const workouts = [];
    
    for (let week = 1; week <= weeks; week++) {
      template.forEach((workoutType, dayIndex) => {
        if (workoutType !== "Rest" && workoutType !== "Active Recovery") {
          workouts.push(this.createWorkout(
            week,
            dayIndex + 1,
            workoutType,
            difficulty,
            profile,
            this.calculateOptimalIntensity(profile, week, dayIndex + 1)
          ));
        }
      });
    }
    
    return workouts;
  }

  createWorkout(week, day, type, difficulty, profile, intensity) {
    const exercises = this.selectExercisesForWorkout(type, profile.body_type, profile.available_equipment);
    
    return {
      week,
      day,
      name: type,
      type: this.getWorkoutType(type),
      duration_minutes: this.getWorkoutDuration(type, profile.body_type),
      warmup: this.getBodyTypeWarmup(profile.body_type),
      main_workout: exercises.map(ex => ({
        exercise: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest_seconds: ex.rest,
        weight: `${intensity.percentage}% effort`,
        tempo: ex.tempo,
        form_cues: ex.cues,
        modification: ex.modification
      })),
      cooldown: this.getCooldown(type),
      workout_notes: this.getWorkoutNotes(type, profile.body_type),
      estimated_calories: this.estimateCalories(type, intensity.percentage, profile),
      target_heart_rate: intensity.heartRateZone
    };
  }

  selectExercisesForWorkout(workoutType, bodyType, equipment) {
    // This would be more sophisticated in production
    const exerciseDatabase = {
      "Push": [
        { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: 120, tempo: "2-0-2-0", cues: ["Retract shoulder blades", "Drive feet into floor"], modification: "Dumbbell press" },
        { name: "Overhead Press", sets: 3, reps: "8-10", rest: 90, tempo: "2-0-2-0", cues: ["Engage core", "Press straight up"], modification: "Seated press" },
        { name: "Dips", sets: 3, reps: "8-12", rest: 90, tempo: "2-0-2-0", cues: ["Lean forward slightly", "Control descent"], modification: "Bench dips" },
        { name: "Cable Flyes", sets: 3, reps: "12-15", rest: 60, tempo: "2-0-2-0", cues: ["Squeeze chest", "Control the weight"], modification: "Dumbbell flyes" }
      ],
      "Pull": [
        { name: "Pull-ups", sets: 4, reps: "6-10", rest: 120, tempo: "2-0-2-0", cues: ["Full range of motion", "Engage lats"], modification: "Lat pulldown" },
        { name: "Barbell Row", sets: 4, reps: "8-10", rest: 90, tempo: "2-0-2-0", cues: ["Hinge at hips", "Pull to stomach"], modification: "Dumbbell row" },
        { name: "Face Pulls", sets: 3, reps: "15-20", rest: 60, tempo: "2-0-2-0", cues: ["Pull to face level", "Squeeze shoulder blades"], modification: "Band pulls" },
        { name: "Bicep Curls", sets: 3, reps: "10-12", rest: 60, tempo: "2-0-2-0", cues: ["Control the negative", "No swinging"], modification: "Hammer curls" }
      ],
      "Legs": [
        { name: "Squats", sets: 4, reps: "6-8", rest: 150, tempo: "2-0-2-0", cues: ["Chest up", "Drive through heels"], modification: "Goblet squats" },
        { name: "Romanian Deadlifts", sets: 3, reps: "8-10", rest: 120, tempo: "2-0-2-0", cues: ["Push hips back", "Feel hamstring stretch"], modification: "Single leg RDL" },
        { name: "Leg Press", sets: 3, reps: "12-15", rest: 90, tempo: "2-0-2-0", cues: ["Full range of motion", "Don't lock knees"], modification: "Lunges" },
        { name: "Calf Raises", sets: 4, reps: "15-20", rest: 60, tempo: "2-1-2-0", cues: ["Full extension", "Pause at top"], modification: "Single leg raises" }
      ]
    };
    
    // Select appropriate exercises based on workout type
    const baseExercises = exerciseDatabase[workoutType.split(" ")[0]] || exerciseDatabase["Push"];
    
    // Modify based on body type
    if (bodyType === 'ectomorph') {
      // Reduce volume
      return baseExercises.slice(0, 3);
    } else if (bodyType === 'endomorph') {
      // Add metabolic finisher
      return [...baseExercises, {
        name: "Metabolic Finisher Circuit",
        sets: 3,
        reps: "30 seconds each",
        rest: 30,
        tempo: "fast",
        cues: ["Keep moving", "Maintain form"],
        modification: "Reduce time"
      }];
    }
    
    return baseExercises;
  }

  getWorkoutType(workoutName) {
    if (workoutName.includes("HIIT") || workoutName.includes("Circuit")) return "hiit";
    if (workoutName.includes("Cardio")) return "cardio";
    if (workoutName.includes("Recovery")) return "recovery";
    return "strength";
  }

  getWorkoutDuration(type, bodyType) {
    const durations = {
      ectomorph: { strength: 45, cardio: 20, hiit: 25, recovery: 30 },
      mesomorph: { strength: 60, cardio: 35, hiit: 30, recovery: 30 },
      endomorph: { strength: 50, cardio: 45, hiit: 35, recovery: 30 }
    };
    
    const workoutCategory = this.getWorkoutType(type);
    return durations[bodyType]?.[workoutCategory] || 45;
  }

  getCooldown(workoutType) {
    return {
      exercises: [
        "Light cardio: 3-5 minutes",
        "Static stretching: 5-10 minutes",
        "Foam rolling: 5 minutes optional",
        "Deep breathing: 2 minutes"
      ],
      total_time: 10
    };
  }

  getWorkoutNotes(type, bodyType) {
    const notes = {
      ectomorph: "Focus on form over weight. Rest fully between sets. Eat pre and post workout.",
      mesomorph: "Push intensity but maintain form. Vary tempo each week. Stay hydrated.",
      endomorph: "Keep rest periods short. Focus on continuous movement. Monitor heart rate."
    };
    
    return notes[bodyType] || "Train hard, recover harder.";
  }

  estimateCalories(workoutType, intensity, profile) {
    const { current_weight, body_type } = profile;
    const baseCalories = current_weight * 0.05; // Base calories per minute
    
    const typeMultiplier = {
      strength: 1.0,
      cardio: 1.5,
      hiit: 1.8,
      recovery: 0.5
    };
    
    const bodyTypeMultiplier = {
      ectomorph: 1.1,
      mesomorph: 1.0,
      endomorph: 0.9
    };
    
    const duration = this.getWorkoutDuration(workoutType, body_type);
    const type = this.getWorkoutType(workoutType);
    
    return Math.round(
      baseCalories * 
      duration * 
      typeMultiplier[type] * 
      bodyTypeMultiplier[body_type] * 
      (intensity / 100)
    );
  }

  // Helper parsing methods
  parseExerciseSelection(content) {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  parseRecoveryProtocol(content) {
    try {
      return JSON.parse(content);
    } catch {
      return this.getDefaultRecovery('mesomorph', 5);
    }
  }

  getDefaultExercises(bodyType, muscleGroup) {
    // Default exercise selection logic
    return [];
  }

  getDefaultRecovery(bodyType, intensity) {
    return {
      immediate: "Protein shake within 30 minutes",
      same_day: "Light stretching and hydration",
      next_day: "Active recovery walk or swim",
      mobility: "10 minutes dynamic stretching",
      sleep: "Aim for 8 hours minimum"
    };
  }
}

export default WorkoutIntelligenceBot;