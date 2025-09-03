// WorkoutPlan entity for production
// Handles workout plan data with in-memory storage

let workoutPlans = [];
let nextId = 1;

class WorkoutPlan {
  static async filter(criteria, ordering = null, limit = null) {
    let results = workoutPlans.filter(plan => {
      return Object.entries(criteria).every(([key, value]) => {
        return plan[key] === value;
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

  static async create(planData) {
    const plan = {
      id: nextId++,
      created_by: 'user@example.com',
      created_date: new Date().toISOString(),
      ...planData
    };
    workoutPlans.push(plan);
    return plan;
  }

  static async update(id, planData) {
    const index = workoutPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      workoutPlans[index] = {
        ...workoutPlans[index],
        ...planData,
        updated_at: new Date().toISOString()
      };
      return workoutPlans[index];
    }
    throw new Error('Workout plan not found');
  }

  static async delete(id) {
    const index = workoutPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      workoutPlans.splice(index, 1);
      return true;
    }
    throw new Error('Workout plan not found');
  }
}

export { WorkoutPlan };