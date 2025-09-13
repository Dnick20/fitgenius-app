// FitGenius Migration Runner
const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function runMigration() {
  console.log('🚀 Starting FitGenius Migration...');
  
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'fitgenius',
    user: process.env.USER,
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Sample user data (simulating localStorage migration)
    const sampleUser = {
      email: 'demo@fitgenius.com',
      password: 'demopassword123',
      profile: {
        name: 'Demo User',
        age: 28,
        gender: 'male',
        height: 175,
        weight: 75,
        heightFeet: 5,
        heightInches: 9,
        weightLbs: 165,
        goalWeightLbs: 155,
        activityLevel: 'moderate',
        goal: 'lose_weight',
        workoutTypes: ['hiit', 'running'],
        is75Hard: false
      }
    };

    // Hash password and insert user
    const hashedPassword = await bcrypt.hash(sampleUser.password, 10);
    
    const userResult = await client.query(`
      INSERT INTO api.users (email, password_hash, profile)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET
        profile = EXCLUDED.profile,
        updated_at = NOW()
      RETURNING id
    `, [
      sampleUser.email,
      hashedPassword,
      JSON.stringify(sampleUser.profile)
    ]);

    const userId = userResult.rows[0].id;
    console.log(`✅ User created with ID: ${userId}`);

    // Insert sample progress entries
    await client.query(`
      INSERT INTO api.progress_entries (user_id, weight, body_fat, notes, date)
      VALUES 
        ($1, 165, 18.5, 'Feeling great after workout!', '2024-09-13'),
        ($1, 167, 19.2, 'Good energy levels', '2024-09-10')
      ON CONFLICT DO NOTHING
    `, [userId]);
    console.log('✅ Progress entries migrated');

    // Insert sample meal
    const mealResult = await client.query(`
      INSERT INTO api.meals (user_id, name, meal_type, ingredients, nutrition)
      VALUES ($1, 'Greek Yogurt Parfait', 'breakfast', $2, $3)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      userId,
      JSON.stringify(['Greek yogurt', 'berries', 'granola']),
      JSON.stringify({ calories: 320 })
    ]);
    console.log('✅ Meals migrated');

    // Insert sample workout
    await client.query(`
      INSERT INTO api.workouts (user_id, name, type, difficulty, duration, calories, exercises)
      VALUES ($1, 'Morning HIIT', 'hiit', 'intermediate', '30 minutes', 350, $2)
      ON CONFLICT DO NOTHING
    `, [
      userId,
      JSON.stringify([
        { name: 'Burpees', reps: '10', duration: '45 seconds' },
        { name: 'Mountain Climbers', reps: '20', duration: '45 seconds' }
      ])
    ]);
    console.log('✅ Workouts migrated');

    // Verify data
    const counts = await Promise.all([
      client.query('SELECT COUNT(*) as count FROM api.users'),
      client.query('SELECT COUNT(*) as count FROM api.progress_entries'),
      client.query('SELECT COUNT(*) as count FROM api.meals'),
      client.query('SELECT COUNT(*) as count FROM api.workouts')
    ]);

    console.log('\n📊 Migration Summary:');
    console.log('===================');
    console.log(`👥 Users: ${counts[0].rows[0].count}`);
    console.log(`📈 Progress Entries: ${counts[1].rows[0].count}`);
    console.log(`🍽️ Meals: ${counts[2].rows[0].count}`);
    console.log(`💪 Workouts: ${counts[3].rows[0].count}`);

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.end();
  }
}

// Test API endpoint
async function testAPI() {
  console.log('\n🧪 Testing PostgREST API...');
  
  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();
    console.log(`✅ API Test: Found ${users.length} users`);
    
    const progressResponse = await fetch('http://localhost:3000/progress_entries');
    const progress = await progressResponse.json();
    console.log(`✅ API Test: Found ${progress.length} progress entries`);
    
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

runMigration().then(() => testAPI()).catch(console.error);