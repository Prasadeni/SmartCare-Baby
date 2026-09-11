/**
 * Percentile Calculator - SmartCare Baby
 * Uses simplified WHO LMS-style approximations to estimate percentile
 * from weight (kg) or height (cm) at a given age in months.
 *
 * NOTE: This is a simplified model. For clinical use, replace with full WHO LMS tables.
 */

// Approximate median (50th percentile) values for reference
// Weight in kg, Height in cm — based on WHO Child Growth Standards (0-24 months)
const REFERENCE_TABLE = {
  male: {
    weight: [
      { age: 0, p50: 3.3 }, { age: 1, p50: 4.5 }, { age: 2, p50: 5.6 },
      { age: 3, p50: 6.4 }, { age: 4, p50: 7.0 }, { age: 5, p50: 7.5 },
      { age: 6, p50: 7.9 }, { age: 9, p50: 8.9 }, { age: 12, p50: 9.6 },
      { age: 18, p50: 10.9 }, { age: 24, p50: 12.2 },
    ],
    height: [
      { age: 0, p50: 49.9 }, { age: 1, p50: 54.7 }, { age: 2, p50: 58.4 },
      { age: 3, p50: 61.4 }, { age: 4, p50: 63.9 }, { age: 5, p50: 65.9 },
      { age: 6, p50: 67.6 }, { age: 9, p50: 72.0 }, { age: 12, p50: 75.7 },
      { age: 18, p50: 82.3 }, { age: 24, p50: 87.1 },
    ],
    head: [
      { age: 0, p50: 34.5 }, { age: 1, p50: 37.3 }, { age: 2, p50: 39.1 },
      { age: 3, p50: 40.5 }, { age: 4, p50: 41.6 }, { age: 6, p50: 43.3 },
      { age: 9, p50: 44.9 }, { age: 12, p50: 46.1 }, { age: 18, p50: 47.4 },
      { age: 24, p50: 48.3 },
    ],
  },
  female: {
    weight: [
      { age: 0, p50: 3.2 }, { age: 1, p50: 4.2 }, { age: 2, p50: 5.1 },
      { age: 3, p50: 5.8 }, { age: 4, p50: 6.4 }, { age: 5, p50: 6.9 },
      { age: 6, p50: 7.3 }, { age: 9, p50: 8.2 }, { age: 12, p50: 8.9 },
      { age: 18, p50: 10.2 }, { age: 24, p50: 11.5 },
    ],
    height: [
      { age: 0, p50: 49.1 }, { age: 1, p50: 53.7 }, { age: 2, p50: 57.1 },
      { age: 3, p50: 59.8 }, { age: 4, p50: 62.1 }, { age: 5, p50: 64.0 },
      { age: 6, p50: 65.7 }, { age: 9, p50: 70.1 }, { age: 12, p50: 74.0 },
      { age: 18, p50: 80.7 }, { age: 24, p50: 85.7 },
    ],
    head: [
      { age: 0, p50: 33.9 }, { age: 1, p50: 36.5 }, { age: 2, p50: 38.3 },
      { age: 3, p50: 39.5 }, { age: 4, p50: 40.6 }, { age: 6, p50: 42.2 },
      { age: 9, p50: 43.8 }, { age: 12, p50: 44.9 }, { age: 18, p50: 46.2 },
      { age: 24, p50: 47.2 },
    ],
  },
};

// Linear interpolation to find p50 at any age
const interpolateP50 = (table, age) => {
  for (let i = 0; i < table.length - 1; i++) {
    if (age >= table[i].age && age <= table[i + 1].age) {
      const ratio = (age - table[i].age) / (table[i + 1].age - table[i].age);
      return table[i].p50 + ratio * (table[i + 1].p50 - table[i].p50);
    }
  }
  return table[table.length - 1].p50;
};

// Approximate standard deviation (SD) as a percentage of the median
// Based on typical WHO CV ~ 10-12% for weight, ~4% for height, ~3% for head
const getSD = (p50, type) => {
  if (type === 'weight') return p50 * 0.11;
  if (type === 'height') return p50 * 0.04;
  if (type === 'head') return p50 * 0.03;
  return p50 * 0.05;
};

// Convert Z-score to percentile using the standard normal CDF approximation
const zToPercentile = (z) => {
  // Approximation of the normal CDF (Abramowitz & Stegun)
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? (1 - p) * 100 : p * 100;
};

/**
 * Calculate percentile for a measurement
 * @param {string} sex - 'male' or 'female'
 * @param {number} ageMonths - Age in months
 * @param {string} type - 'weight' | 'height' | 'head'
 * @param {number} value - The measured value
 * @returns {number} Percentile (0-100)
 */
const calculatePercentile = (sex, ageMonths, type, value) => {
  if (!value || !ageMonths || ageMonths < 0) return 50;

  const sexKey = sex === 'female' ? 'female' : 'male';
  const tableKey = type === 'head' ? 'head' : type;
  const table = REFERENCE_TABLE[sexKey][tableKey];
  if (!table) return 50;

  const p50 = interpolateP50(table, ageMonths);
  const sd = getSD(p50, type);
  const z = (value - p50) / sd;
  const percentile = Math.round(zToPercentile(z) * 10) / 10;

  // Clamp between 1 and 99
  return Math.max(1, Math.min(99, percentile));
};

module.exports = { calculatePercentile };