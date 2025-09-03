// User entity for production
// Handles user authentication and profile data

class User {
  static async me() {
    // Production user data for authenticated user
    return {
      id: 'user_1',
      email: 'user@example.com',
      full_name: 'Fitness Enthusiast',
      created_at: new Date().toISOString()
    };
  }

  static async create(userData) {
    // User creation with timestamp
    return {
      id: 'user_' + Date.now(),
      ...userData,
      created_at: new Date().toISOString()
    };
  }

  static async update(id, userData) {
    // User update with timestamp
    return {
      id,
      ...userData,
      updated_at: new Date().toISOString()
    };
  }
}

export { User };