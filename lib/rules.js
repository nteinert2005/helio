// HelioIQ Rule Engine
// Analyzes daily logs to detect patterns across 5 clusters

/**
 * Main function to run all rule checks
 * @param {Object} todayLog - Today's daily log
 * @param {Object} yesterdayLog - Yesterday's daily log
 * @param {Object} profile - User's GLP-1 profile
 * @param {Array} weeklyLogs - Last 7 days of logs
 * @returns {Array} - Array of triggered rule objects
 */
export function analyzeRules(todayLog, yesterdayLog, profile, weeklyLogs = []) {
  const triggeredRules = []

  // Cluster 1: Water Retention Patterns
  triggeredRules.push(...checkWaterRetention(todayLog, yesterdayLog))

  // Cluster 2: GLP-1 Medication Effects
  triggeredRules.push(...checkMedicationEffects(todayLog, profile, weeklyLogs))

  // Cluster 3: Digestive Factors
  triggeredRules.push(...checkDigestiveFactors(todayLog))

  // Cluster 4: Nutrition Alerts
  triggeredRules.push(...checkNutrition(todayLog))

  // Cluster 5: Measurement Consistency
  // (Would require time-of-day tracking - placeholder for now)

  return triggeredRules
}

/**
 * Cluster 1: Water Retention Patterns
 */
function checkWaterRetention(today, yesterday) {
  const rules = []

  // Rule: Low sleep (< 6 hours) → cortisol-related water retention
  if (today.sleep_hours < 6) {
    rules.push({
      cluster: 'water_retention',
      rule: 'low_sleep_cortisol',
      message: 'Low sleep (under 6 hours) can elevate cortisol levels, causing temporary water retention',
      severity: 'warning',
    })
  }

  // Rule: Low steps (< 3000) → reduced circulation
  if (today.steps < 3000) {
    rules.push({
      cluster: 'water_retention',
      rule: 'low_activity',
      message: 'Low activity (under 3,000 steps) may reduce circulation and cause water retention',
      severity: 'info',
    })
  }

  // Rule: Low water intake (< 40oz) → body hoarding water
  if (today.water < 40) {
    rules.push({
      cluster: 'water_retention',
      rule: 'dehydration',
      message: 'Low water intake (under 40oz) can cause your body to retain water',
      severity: 'warning',
    })
  }

  // Rule: Sudden increase in steps (> 50% jump) → muscle inflammation
  if (yesterday && today.steps > yesterday.steps * 1.5) {
    rules.push({
      cluster: 'water_retention',
      rule: 'exercise_inflammation',
      message: 'Significant increase in activity can cause temporary muscle inflammation and water retention',
      severity: 'info',
    })
  }

  return rules
}

/**
 * Cluster 2: GLP-1 Medication Effects
 */
function checkMedicationEffects(today, profile, weeklyLogs) {
  const rules = []

  // Calculate days since medication start
  const startDate = new Date(profile.start_date)
  const todayDate = new Date(today.log_date)
  const daysSinceStart = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24))
  const weeksSinceStart = Math.floor(daysSinceStart / 7)

  // Rule: First 2 weeks (weeks 0-1) → early adaptation period
  if (weeksSinceStart < 2) {
    rules.push({
      cluster: 'medication_effects',
      rule: 'early_adaptation',
      message: 'You are in the early adaptation phase (first 2 weeks). Weight fluctuations are very common as your body adjusts',
      severity: 'info',
    })
  }

  // Rule: Week 3-4 → stabilization period
  if (weeksSinceStart >= 2 && weeksSinceStart < 4) {
    rules.push({
      cluster: 'medication_effects',
      rule: 'stabilization',
      message: 'You are in the stabilization phase. Expect more consistent patterns to emerge',
      severity: 'info',
    })
  }

  // Rule: Missed medication dose
  if (!today.medication_taken) {
    rules.push({
      cluster: 'medication_effects',
      rule: 'missed_dose',
      message: 'Missing your GLP-1 dose can affect appetite regulation and water retention temporarily',
      severity: 'warning',
    })
  }

  // Rule: Dose increase recently (check if weekly pattern shows variation)
  // This is a placeholder - would need dose change tracking
  if (profile.dosing_schedule === 'weekly' && weeklyLogs.length >= 7) {
    const recentWeightVar = calculateWeightVariance(weeklyLogs.slice(0, 3))
    if (recentWeightVar > 2) {
      rules.push({
        cluster: 'medication_effects',
        rule: 'high_variability',
        message: 'Higher than normal weight fluctuations detected. This is common after dose increases',
        severity: 'info',
      })
    }
  }

  return rules
}

/**
 * Cluster 3: Digestive Factors
 */
function checkDigestiveFactors(today) {
  const rules = []

  // Rule: Constipation or no bowel movement
  if (today.bowel_movement === 'constipated' || today.bowel_movement === 'none') {
    rules.push({
      cluster: 'digestive',
      rule: 'constipation',
      message: 'Constipation is very common on GLP-1s and can add 1-3 lbs of temporary weight. This is not fat gain',
      severity: 'warning',
    })
  }

  // Rule: High fiber day + constipation (would need fiber tracking)
  // Placeholder for future enhancement

  return rules
}

/**
 * Cluster 4: Nutrition Alerts
 */
function checkNutrition(today) {
  const rules = []

  // Rule: Very low protein (< 60g)
  if (today.protein < 60) {
    rules.push({
      cluster: 'nutrition',
      rule: 'low_protein',
      message: 'Low protein intake (under 60g) may affect muscle retention and metabolism',
      severity: 'warning',
    })
  }

  // Rule: Very low calories (< 800)
  if (today.calories < 800) {
    rules.push({
      cluster: 'nutrition',
      rule: 'very_low_calories',
      message: 'Very low calorie intake (under 800) can slow metabolism and trigger water retention as a stress response',
      severity: 'critical',
    })
  }

  // Rule: High calorie day (> 2500) after low days
  if (today.calories > 2500) {
    rules.push({
      cluster: 'nutrition',
      rule: 'high_calorie_day',
      message: 'Higher calorie day can cause temporary water weight gain from increased carb/sodium intake',
      severity: 'info',
    })
  }

  return rules
}

/**
 * Helper: Calculate weight variance across logs
 */
function calculateWeightVariance(logs) {
  if (logs.length < 2) return 0

  const weights = logs.map(log => parseFloat(log.weight))
  const mean = weights.reduce((a, b) => a + b, 0) / weights.length
  const variance = weights.reduce((sum, weight) => sum + Math.pow(weight - mean, 2), 0) / weights.length

  return Math.sqrt(variance)
}

/**
 * Helper: Get days since last medication dose (for weekly dosing)
 */
export function getDaysSinceLastDose(profile, todayDate) {
  if (profile.dosing_schedule !== 'weekly') return null

  const startDate = new Date(profile.start_date)
  const today = new Date(todayDate)
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))

  return daysSinceStart % 7
}

/**
 * Helper: Format rules for AI prompt
 */
export function formatRulesForAI(rules) {
  if (rules.length === 0) return 'No specific patterns detected.'

  return rules.map(rule => {
    const severity = rule.severity === 'critical' ? '⚠️' :
                     rule.severity === 'warning' ? '⚡' : 'ℹ️'
    return `${severity} ${rule.message}`
  }).join('\n')
}
