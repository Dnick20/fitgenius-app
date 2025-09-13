// Database Service for FitGenius React App
class DatabaseService {
  constructor() {
    // Get the current domain for production
    const isProduction = process.env.NODE_ENV === 'production';
    const productionURL = typeof window !== 'undefined' ? window.location.origin : 'https://fitgenius-app.vercel.app';
    
    this.baseURL = isProduction 
      ? `${productionURL}/api`
      : 'http://localhost:3000';
    
    this.apiURL = isProduction
      ? `${productionURL}/api/database`
      : 'http://localhost:3000'; // Direct PostgREST in development
      
    console.log(`DatabaseService initialized: ${isProduction ? 'Production' : 'Development'} mode`);
    console.log(`API URL: ${this.apiURL}`);
  }

  getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'apikey': process.env.REACT_APP_API_KEY || ''
    };
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('/api') 
      ? `${this.baseURL}${endpoint}`
      : `${this.apiURL}${endpoint}`;
      
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database request failed:', error);
      throw error;
    }
  }

  // Generic CRUD operations
  async get(table, filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/${table}?${params}`);
  }

  async getById(table, id) {
    return this.request(`/${table}?id=eq.${id}`);
  }

  async create(table, data) {
    return this.request(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async update(table, id, data) {
    return this.request(`/${table}?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async delete(table, id) {
    return this.request(`/${table}?id=eq.${id}`, {
      method: 'DELETE'
    });
  }

  // Authentication
  async signUp(userData) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async signIn(email, password) {
    const result = await this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (result.success && result.token) {
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user_profile', JSON.stringify(result.user.profile));
    }
    
    return result;
  }

  signOut() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    return { success: true };
  }

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    const profile = localStorage.getItem('user_profile');
    
    if (token && profile) {
      return {
        profile: JSON.parse(profile)
      };
    }
    
    return null;
  }

  // File upload
  async uploadFile(fileName, fileData, userId, fileType = 'general') {
    return this.request('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        fileName,
        fileData,
        userId,
        fileType
      })
    });
  }

  // Progress entries
  async getProgressEntries(userId) {
    return this.get('progress_entries', { 
      user_id: `eq.${userId}`,
      order: 'date.desc'
    });
  }

  async addProgressEntry(userId, entry) {
    return this.create('progress_entries', {
      user_id: userId,
      ...entry
    });
  }

  // Workouts
  async getWorkouts(userId) {
    return this.get('workouts', { 
      user_id: `eq.${userId}`,
      order: 'created_at.desc'
    });
  }

  async addWorkout(userId, workout) {
    return this.create('workouts', {
      user_id: userId,
      ...workout
    });
  }

  async updateWorkout(workoutId, updates) {
    return this.update('workouts', workoutId, updates);
  }

  // Meals
  async getMeals(userId) {
    return this.get('meals', { 
      user_id: `eq.${userId}`,
      order: 'created_at.desc'
    });
  }

  async addMeal(userId, meal) {
    return this.create('meals', {
      user_id: userId,
      ...meal
    });
  }

  async updateMeal(mealId, updates) {
    return this.update('meals', mealId, updates);
  }

  // Weekly meal plans
  async getWeeklyMealPlan(userId) {
    return this.get('weekly_meal_plans', { 
      user_id: `eq.${userId}`,
      order: 'day_of_week.asc'
    });
  }

  async addMealToPlan(userId, mealId, dayOfWeek, mealType, repetitionIndex = 1, repetitionCount = 1) {
    return this.create('weekly_meal_plans', {
      user_id: userId,
      meal_id: mealId,
      day_of_week: dayOfWeek,
      meal_type: mealType,
      repetition_index: repetitionIndex,
      repetition_count: repetitionCount
    });
  }

  // Workout sessions
  async getWorkoutSessions(userId) {
    return this.get('workout_sessions', { 
      user_id: `eq.${userId}`,
      order: 'started_at.desc'
    });
  }

  async startWorkoutSession(userId, workoutId) {
    return this.create('workout_sessions', {
      user_id: userId,
      workout_id: workoutId,
      started_at: new Date().toISOString()
    });
  }

  async completeWorkoutSession(sessionId, caloriesBurned, notes = '') {
    return this.update('workout_sessions', sessionId, {
      completed_at: new Date().toISOString(),
      calories_burned: caloriesBurned,
      notes
    });
  }

  // Grocery lists
  async getGroceryLists(userId) {
    return this.get('grocery_lists', { 
      user_id: `eq.${userId}`,
      order: 'created_at.desc'
    });
  }

  async createGroceryList(userId, listData) {
    return this.create('grocery_lists', {
      user_id: userId,
      ...listData
    });
  }

  async updateGroceryList(listId, updates) {
    return this.update('grocery_lists', listId, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }

  // Batch operations
  async batchCreate(table, items) {
    return this.request(`/${table}`, {
      method: 'POST',
      body: JSON.stringify(items)
    });
  }

  // Real-time subscription helpers
  subscribeToChanges(table, userId, callback) {
    // This would connect to your real-time service
    const eventSource = new EventSource(`/api/realtime?userId=${userId}&table=${table}`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => eventSource.close();
  }
}

export default new DatabaseService();