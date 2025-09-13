// Supabase Service for FitGenius
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvpzxwgvgnrvtvmvnych.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cHp4d2d2Z25ydnR2bXZueWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzA3OTAsImV4cCI6MjA3MzMwNjc5MH0.gRFEsgxokCcSs135_oFqxnH_b_clGcCyaEDddavCb9Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseService {
  // Authentication
  async signUp(email, password, profile = {}) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profile, // Store profile in auth metadata
          emailRedirectTo: undefined, // Skip email confirmation
          autoConfirm: true // Auto-confirm users
        }
      });

      if (authError) throw authError;

      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email,
            profile: profile
          });

        if (profileError) console.error('Profile creation error:', profileError);
      }

      return { 
        success: true, 
        user: authData.user,
        session: authData.session 
      };
    } catch (error) {
      console.error('SignUp error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return { 
        success: true, 
        user: data.user,
        profile: profile,
        session: data.session 
      };
    } catch (error) {
      console.error('SignIn error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { success: !error };
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return { ...user, profile };
    }
    
    return null;
  }

  isAuthenticated() {
    return supabase.auth.getSession().then(({ data }) => !!data.session);
  }

  // Progress Entries
  async getProgressEntries(userId) {
    const { data, error } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addProgressEntry(entry) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('progress_entries')
      .insert({
        ...entry,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateProgressEntry(id, updates) {
    const { data, error } = await supabase
      .from('progress_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Workouts
  async getWorkouts(userId) {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addWorkout(workout) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('workouts')
      .insert({
        ...workout,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateWorkout(id, updates) {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Meals
  async getMeals(userId) {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async addMeal(meal) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('meals')
      .insert({
        ...meal,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMeal(id, updates) {
    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Weekly Meal Plans
  async getWeeklyMealPlan(userId) {
    const { data, error } = await supabase
      .from('weekly_meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    return data;
  }

  async addMealToPlan(mealId, dayOfWeek, mealType, repetitionIndex = 1, repetitionCount = 1) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('weekly_meal_plans')
      .insert({
        user_id: user.id,
        meal_id: mealId,
        day_of_week: dayOfWeek,
        meal_type: mealType,
        repetition_index: repetitionIndex,
        repetition_count: repetitionCount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Workout Sessions
  async startWorkoutSession(workoutId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: user.id,
        workout_id: workoutId,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async completeWorkoutSession(sessionId, caloriesBurned, notes = '') {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update({
        completed_at: new Date().toISOString(),
        calories_burned: caloriesBurned,
        notes
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Grocery Lists
  async getGroceryLists(userId) {
    const { data, error } = await supabase
      .from('grocery_lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createGroceryList(listData) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('grocery_lists')
      .insert({
        ...listData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateGroceryList(id, updates) {
    const { data, error } = await supabase
      .from('grocery_lists')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // File Storage (Supabase Storage)
  async uploadProfileImage(userId, file) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async uploadWorkoutVideo(userId, file) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('workout-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('workout-videos')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async uploadMealPhoto(userId, file) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('meal-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('meal-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async uploadProgressPhoto(userId, file) {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  }

  async deleteFile(bucket, filePath) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    return true;
  }

  async listUserFiles(bucket, userId) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(userId);

    if (error) throw error;
    return data;
  }

  // Real-time subscriptions
  subscribeToProgressEntries(userId, callback) {
    const subscription = supabase
      .channel('progress-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'progress_entries',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }

  subscribeToWorkouts(userId, callback) {
    const subscription = supabase
      .channel('workout-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'workouts',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }

  subscribeToMeals(userId, callback) {
    const subscription = supabase
      .channel('meal-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'meals',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }
}

export default new SupabaseService();