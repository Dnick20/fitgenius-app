// Data Migration Service: localStorage → PostgreSQL
const { Client } = require('pg');
const bcrypt = require('bcrypt');

class DataMigrationService {
  constructor() {
    this.pgClient = new Client({
      host: 'localhost',
      port: 5432,
      database: 'fitgenius',
      user: process.env.USER, // Use current system user
    });
    
    this.migrationStats = {
      users: { migrated: 0, errors: 0 },
      progressEntries: { migrated: 0, errors: 0 },
      workouts: { migrated: 0, errors: 0 },
      meals: { migrated: 0, errors: 0 }
    };
  }

  async connect() {
    try {
      await this.pgClient.connect();
      console.log('✅ Connected to PostgreSQL for migration');
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.pgClient.end();
    console.log('✅ PostgreSQL connection closed');
  }

  // Simulate localStorage data extraction (since we can't access browser storage from Node.js)
  generateSampleLocalStorageData() {
    return {
      fitgenius_users: [
        {
          id: "1",
          email: "demo@fitgenius.com",
          password: "demopassword123",
          createdAt: "2024-09-01T00:00:00.000Z",
          profile: {
            name: "Demo User",
            email: "demo@fitgenius.com",
            age: 28,
            gender: "male",
            height: 175,
            weight: 75,
            heightFeet: 5,
            heightInches: 9,
            weightLbs: 165,
            goalWeightLbs: 155,
            activityLevel: "moderate",
            goal: "lose_weight",
            workoutTypes: ["hiit", "running"],
            is75Hard: false
          }
        }
      ],
      progressEntries: [
        {
          date: "2024-09-13",
          weight: 165,
          bodyFat: 18.5,
          notes: "Feeling great after workout!"
        },
        {
          date: "2024-09-10",
          weight: 167,
          bodyFat: 19.2,
          notes: "Good energy levels"
        }
      ],
      weeklyMealPlan: [
        {
          id: "meal1",
          name: "Greek Yogurt Parfait",
          type: "breakfast",
          calories: 320,
          ingredients: ["Greek yogurt", "berries", "granola"],
          repetitionCount: 2
        },
        {
          id: "meal2", 
          name: "Grilled Chicken Salad",
          type: "lunch",
          calories: 450,
          ingredients: ["chicken breast", "mixed greens", "tomatoes"],
          repetitionCount: 3
        }
      ],
      userWorkouts: [
        {
          id: "workout1",
          name: "Morning HIIT",
          type: "hiit",
          difficulty: "intermediate",
          duration: "30 minutes",
          calories: 350,
          exercises: [
            { name: "Burpees", reps: "10", duration: "45 seconds" },
            { name: "Mountain Climbers", reps: "20", duration: "45 seconds" }
          ]
        }
      ]
    };
  }

  async migrateUsers(localStorageData) {
    console.log('👥 Migrating users...');
    
    try {
      for (const userData of localStorageData.fitgenius_users || []) {
        try {
          // Hash password
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          
          // Insert user
          const userResult = await this.pgClient.query(`
            INSERT INTO api.users (email, password_hash, profile, created_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE SET
              profile = EXCLUDED.profile,
              updated_at = NOW()
            RETURNING id
          `, [
            userData.email,
            hashedPassword,
            JSON.stringify(userData.profile),
            userData.createdAt || new Date().toISOString()
          ]);

          this.migrationStats.users.migrated++;
          console.log(`✅ User migrated: ${userData.email}`);
          
          // Store user ID for other migrations
          userData.newUserId = userResult.rows[0].id;
          
        } catch (error) {
          this.migrationStats.users.errors++;
          console.error(`❌ User migration failed for ${userData.email}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Users migration failed:', error);
      throw error;
    }
  }

  async migrateProgressEntries(localStorageData) {
    console.log('📊 Migrating progress entries...');
    
    const user = localStorageData.fitgenius_users?.[0];
    if (!user?.newUserId) {
      console.log('⚠️ No user found for progress entries migration');
      return;
    }

    try {
      for (const entry of localStorageData.progressEntries || []) {
        try {
          await this.pgClient.query(`
            INSERT INTO api.progress_entries (user_id, weight, body_fat, notes, date)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            user.newUserId,
            entry.weight,
            entry.bodyFat,
            entry.notes,
            entry.date
          ]);

          this.migrationStats.progressEntries.migrated++;
          console.log(`✅ Progress entry migrated: ${entry.date}`);
          
        } catch (error) {
          this.migrationStats.progressEntries.errors++;
          console.error(`❌ Progress entry migration failed for ${entry.date}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Progress entries migration failed:', error);
      throw error;
    }
  }

  async migrateMeals(localStorageData) {
    console.log('🍽️ Migrating meals...');
    
    const user = localStorageData.fitgenius_users?.[0];
    if (!user?.newUserId) {
      console.log('⚠️ No user found for meals migration');
      return;
    }

    try {
      for (const meal of localStorageData.weeklyMealPlan || []) {
        try {
          // Insert meal
          const mealResult = await this.pgClient.query(`
            INSERT INTO api.meals (user_id, name, meal_type, ingredients, nutrition)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
          `, [
            user.newUserId,
            meal.name,
            meal.type,
            JSON.stringify(meal.ingredients || []),
            JSON.stringify({ calories: meal.calories || 0 })
          ]);

          // Add to weekly plan if repetition count exists
          if (meal.repetitionCount && meal.repetitionCount > 0) {
            for (let i = 0; i < meal.repetitionCount; i++) {
              await this.pgClient.query(`
                INSERT INTO api.weekly_meal_plans (user_id, meal_id, day_of_week, meal_type, repetition_index, repetition_count)
                VALUES ($1, $2, $3, $4, $5, $6)
              `, [
                user.newUserId,
                mealResult.rows[0].id,
                i % 7, // Distribute across week
                meal.type,
                i + 1,
                meal.repetitionCount
              ]);
            }
          }

          this.migrationStats.meals.migrated++;
          console.log(`✅ Meal migrated: ${meal.name}`);
          
        } catch (error) {
          this.migrationStats.meals.errors++;
          console.error(`❌ Meal migration failed for ${meal.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Meals migration failed:', error);
      throw error;
    }
  }

  async migrateWorkouts(localStorageData) {
    console.log('💪 Migrating workouts...');
    
    const user = localStorageData.fitgenius_users?.[0];
    if (!user?.newUserId) {
      console.log('⚠️ No user found for workouts migration');
      return;
    }

    try {
      for (const workout of localStorageData.userWorkouts || []) {
        try {
          await this.pgClient.query(`
            INSERT INTO api.workouts (user_id, name, type, difficulty, duration, calories, exercises)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [
            user.newUserId,
            workout.name,
            workout.type,
            workout.difficulty,
            workout.duration,
            workout.calories,
            JSON.stringify(workout.exercises || [])
          ]);

          this.migrationStats.workouts.migrated++;
          console.log(`✅ Workout migrated: ${workout.name}`);
          
        } catch (error) {
          this.migrationStats.workouts.errors++;
          console.error(`❌ Workout migration failed for ${workout.name}:`, error.message);
        }
      }
    } catch (error) {
      console.error('❌ Workouts migration failed:', error);
      throw error;
    }
  }

  async runFullMigration() {
    console.log('🚀 Starting full data migration...');
    
    try {
      await this.connect();
      
      // Generate sample data (in real scenario, this would come from browser localStorage)
      const localStorageData = this.generateSampleLocalStorageData();
      console.log('📂 Sample localStorage data generated');
      
      // Run migrations in order (users first, then dependent data)
      await this.migrateUsers(localStorageData);
      await this.migrateProgressEntries(localStorageData);
      await this.migrateMeals(localStorageData);
      await this.migrateWorkouts(localStorageData);
      
      // Print migration summary
      console.log('\n📋 Migration Summary:');
      console.log('====================');
      console.log(`👥 Users: ${this.migrationStats.users.migrated} migrated, ${this.migrationStats.users.errors} errors`);
      console.log(`📊 Progress: ${this.migrationStats.progressEntries.migrated} migrated, ${this.migrationStats.progressEntries.errors} errors`);
      console.log(`🍽️ Meals: ${this.migrationStats.meals.migrated} migrated, ${this.migrationStats.meals.errors} errors`);
      console.log(`💪 Workouts: ${this.migrationStats.workouts.migrated} migrated, ${this.migrationStats.workouts.errors} errors`);
      
      const totalMigrated = Object.values(this.migrationStats).reduce((sum, stat) => sum + stat.migrated, 0);
      const totalErrors = Object.values(this.migrationStats).reduce((sum, stat) => sum + stat.errors, 0);
      
      console.log(`\n✅ Total: ${totalMigrated} items migrated successfully`);
      if (totalErrors > 0) {
        console.log(`⚠️ Total: ${totalErrors} items had errors`);
      }
      
      return {
        success: true,
        stats: this.migrationStats,
        totalMigrated,
        totalErrors
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        error: error.message,
        stats: this.migrationStats
      };
    } finally {
      await this.disconnect();
    }
  }

  // Helper method to verify migration
  async verifyMigration() {
    console.log('🔍 Verifying migration...');
    
    try {
      await this.connect();
      
      const results = await Promise.all([
        this.pgClient.query('SELECT COUNT(*) as count FROM api.users'),
        this.pgClient.query('SELECT COUNT(*) as count FROM api.progress_entries'),
        this.pgClient.query('SELECT COUNT(*) as count FROM api.meals'),
        this.pgClient.query('SELECT COUNT(*) as count FROM api.workouts'),
        this.pgClient.query('SELECT COUNT(*) as count FROM api.weekly_meal_plans')
      ]);

      const verification = {
        users: parseInt(results[0].rows[0].count),
        progressEntries: parseInt(results[1].rows[0].count),
        meals: parseInt(results[2].rows[0].count),
        workouts: parseInt(results[3].rows[0].count),
        weeklyPlans: parseInt(results[4].rows[0].count)
      };

      console.log('\n🔍 Database Verification:');
      console.log('========================');
      Object.entries(verification).forEach(([table, count]) => {
        console.log(`${table}: ${count} records`);
      });

      return verification;
      
    } catch (error) {
      console.error('❌ Migration verification failed:', error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

module.exports = DataMigrationService;