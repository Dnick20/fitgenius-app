// MealPlan entity for production
// Handles meal plan data with in-memory storage

let mealPlans = [];
let nextId = 1;

class MealPlan {
  static async filter(criteria, ordering = null, limit = null) {
    let results = mealPlans.filter(plan => {
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
    mealPlans.push(plan);
    return plan;
  }

  static async update(id, planData) {
    const index = mealPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      mealPlans[index] = {
        ...mealPlans[index],
        ...planData,
        updated_at: new Date().toISOString()
      };
      return mealPlans[index];
    }
    throw new Error('Meal plan not found');
  }

  static async delete(id) {
    const index = mealPlans.findIndex(p => p.id === id);
    if (index !== -1) {
      mealPlans.splice(index, 1);
      return true;
    }
    throw new Error('Meal plan not found');
  }
}

export { MealPlan };