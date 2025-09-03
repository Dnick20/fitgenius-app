/**
 * FitGenius Utility Functions
 * Common helper functions used throughout the application
 */

/**
 * Create URL for internal navigation (placeholder)
 * @param {string} page - Page name  
 * @param {object} params - URL parameters
 * @returns {string} - URL string
 */
export function createPageUrl(page, params = {}) {
  // Since we're using internal state-based navigation, this is a placeholder
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `/${page}?${queryString}` : `/${page}`;
}

/**
 * Format user display name
 * @param {object} user - User object
 * @returns {string} - Formatted display name
 */
export function formatUserName(user) {
  if (!user) return 'Guest User';
  return user.name || user.email || 'User';
}

/**
 * Calculate BMI
 * @param {number} weight - Weight in pounds
 * @param {number} heightFeet - Height feet
 * @param {number} heightInches - Height inches
 * @returns {number} - BMI value
 */
export function calculateBMI(weight, heightFeet, heightInches) {
  const totalInches = (heightFeet * 12) + heightInches;
  const heightInMeters = totalInches * 0.0254;
  const weightInKg = weight * 0.453592;
  return Math.round((weightInKg / (heightInMeters * heightInMeters)) * 10) / 10;
}

export default {
  createPageUrl,
  formatUserName,
  calculateBMI
};