// WorkoutLog entity for production
// Handles workout logging data with in-memory storage

let workoutLogs = [];
let nextId = 1;

class WorkoutLog {
  static async filter(criteria, ordering = null, limit = null) {
    let results = workoutLogs.filter(log => {
      return Object.entries(criteria).every(([key, value]) => {
        return log[key] === value;
      });
    });

    // Apply ordering
    if (ordering) {
      const isDescending = ordering.startsWith('-');
      const field = isDescending ? ordering.slice(1) : ordering;
      results.sort((a, b) => {
        const aVal = a[field] || '';
        const bVal = b[field] || '';
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

  static async create(logData) {
    const log = {
      id: nextId++,
      created_by: 'user@example.com',
      created_at: new Date().toISOString(),
      ...logData
    };
    workoutLogs.push(log);
    return log;
  }

  static async update(id, logData) {
    const index = workoutLogs.findIndex(l => l.id === id);
    if (index !== -1) {
      workoutLogs[index] = {
        ...workoutLogs[index],
        ...logData,
        updated_at: new Date().toISOString()
      };
      return workoutLogs[index];
    }
    throw new Error('Workout log not found');
  }

  static async delete(id) {
    const index = workoutLogs.findIndex(l => l.id === id);
    if (index !== -1) {
      workoutLogs.splice(index, 1);
      return true;
    }
    throw new Error('Workout log not found');
  }
}

export { WorkoutLog };