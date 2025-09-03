// UserProfile entity for production
// Handles user fitness profile data with in-memory storage

let userProfiles = [];
let nextId = 1;

class UserProfile {
  static async filter(criteria, ordering = null, limit = null) {
    let results = userProfiles.filter(profile => {
      return Object.entries(criteria).every(([key, value]) => {
        return profile[key] === value;
      });
    });

    // Apply ordering
    if (ordering) {
      const isDescending = ordering.startsWith('-');
      const field = isDescending ? ordering.slice(1) : ordering;
      results.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (isDescending) {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply limit
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }

  static async create(profileData) {
    const profile = {
      id: nextId++,
      created_by: 'user@example.com',
      created_at: new Date().toISOString(),
      ...profileData
    };
    userProfiles.push(profile);
    return profile;
  }

  static async update(id, profileData) {
    const index = userProfiles.findIndex(p => p.id === id);
    if (index !== -1) {
      userProfiles[index] = {
        ...userProfiles[index],
        ...profileData,
        updated_at: new Date().toISOString()
      };
      return userProfiles[index];
    }
    throw new Error('Profile not found');
  }

  static async delete(id) {
    const index = userProfiles.findIndex(p => p.id === id);
    if (index !== -1) {
      userProfiles.splice(index, 1);
      return true;
    }
    throw new Error('Profile not found');
  }
}

export { UserProfile };