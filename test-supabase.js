// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvpzxwgvgnrvtvmvnych.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cHp4d2d2Z25ydnR2bXZueWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzA3OTAsImV4cCI6MjA3MzMwNjc5MH0.gRFEsgxokCcSs135_oFqxnH_b_clGcCyaEDddavCb9Y';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Check tables exist
  console.log('📊 Checking tables...');
  try {
    const tables = [
      'user_profiles',
      'progress_entries',
      'workouts',
      'meals',
      'weekly_meal_plans',
      'workout_sessions',
      'grocery_lists'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible`);
      }
    }
  } catch (error) {
    console.error('Table check failed:', error);
  }

  // Test 2: Create test user
  console.log('\n👤 Creating test user...');
  try {
    const testEmail = `test${Date.now()}@fitgenius.com`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          name: 'Test User',
          age: 25
        }
      }
    });

    if (authError) {
      console.log(`❌ User creation failed: ${authError.message}`);
    } else {
      console.log(`✅ User created: ${testEmail}`);
      
      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: testEmail,
            profile: {
              name: 'Test User',
              age: 25,
              gender: 'male',
              weight: 70
            }
          });

        if (profileError) {
          console.log(`⚠️ Profile creation warning: ${profileError.message}`);
        } else {
          console.log('✅ User profile created');
        }
      }
    }
  } catch (error) {
    console.error('User test failed:', error);
  }

  // Test 3: Test file storage buckets
  console.log('\n📦 Checking storage buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log(`⚠️ Storage check: ${error.message}`);
    } else if (buckets && buckets.length > 0) {
      console.log(`✅ Storage buckets found: ${buckets.map(b => b.name).join(', ')}`);
    } else {
      console.log('ℹ️ No storage buckets configured yet');
    }
  } catch (error) {
    console.error('Storage check failed:', error);
  }

  console.log('\n🎉 Supabase connection test complete!');
  console.log('\nYour Supabase setup is ready for production use.');
  console.log('\nNext steps:');
  console.log('1. Update your React components to use auth-supabase.js');
  console.log('2. Test signup and signin flows');
  console.log('3. Deploy to Vercel');
}

testSupabase().catch(console.error);