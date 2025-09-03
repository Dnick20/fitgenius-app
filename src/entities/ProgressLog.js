// ProgressLog entity for production
// Handles progress tracking data with in-memory storage

let progressLogs = [];
let nextId = 1;

class ProgressLog {
  static async filter(criteria, ordering = null, limit = null) {
    let results = progressLogs.filter(log => {
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
    progressLogs.push(log);
    return log;
  }

  static async update(id, logData) {
    const index = progressLogs.findIndex(l => l.id === id);
    if (index !== -1) {
      progressLogs[index] = {
        ...progressLogs[index],
        ...logData,
        updated_at: new Date().toISOString()
      };
      return progressLogs[index];
    }
    throw new Error('Progress log not found');
  }

  static async delete(id) {
    const index = progressLogs.findIndex(l => l.id === id);
    if (index !== -1) {
      progressLogs.splice(index, 1);
      return true;
    }
    throw new Error('Progress log not found');
  }
}

export { ProgressLog };