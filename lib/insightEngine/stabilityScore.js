export function computeStabilityScore(input){
    const history = input.history || [];
    const today = input.todayLog;

    if(!today || history.length < 3) return 50;

    const weightVol = scoreWeightVol(history);
    const sleepVol = scoreSleepVol(history);
    const hydrationVol = scoreHydrationVol(history);
    const proteinVol = scoreProteinVol(history);
    const mediationVol = scoreMedicationVol(history);
    const symptoms = scoreSymptomsVol(history);

    const WEIGHTS = {
        weightVol: .25, 
        sleepVol: .15, 
        hydrationVol: .15, 
        proteinVol: .15, 
        medicationVol: .20,
        symptomsVol: .10
    }

    const rawScore = 
        weightVol * WEIGHTS.weightVol +
        sleepVol * WEIGHTS.sleepVol + 
        hydrationVol * WEIGHTS.hydrationVol + 
        proteinVol * WEIGHTS.proteinVol +
        medicationVol * WEIGHTS.medicationVol + 
        symptomsVol * WEIGHTS.symptomsVol

    return capper(Math.round(rawScore), 0, 100);

}

/* =======================
   SUB-SCORES
======================= */
function scoreWeightVol(history) {
    const weights = history.map(d => d.weight).filter(Boolean);
    if (weights.length < 4) return 70;

    const mean = average(weights);
    const std = standardDeviation(weights, mean);
    const cv = std / mean;

    if (cv < 0.003) return 95;
    if (cv < 0.006) return 85;
    if (cv < 0.01) return 70;
    if (cv < 0.015) return 55;
    return 40
}

function scoreSleepVol(history) {
  const sleeps = history.map(d => d.sleepHours).filter(Boolean);
  if (sleeps.length < 4) return 70;

  const deviations = sleeps.map(h => Math.abs(h - 7.5));
  const meanDeviation = average(deviations);

  if (meanDeviation < 0.5) return 95;
  if (meanDeviation < 1.0) return 80;
  if (meanDeviation < 1.5) return 65;
  return 45;
}

function scoreHydrationVol(history) {
  const goodDays = history.filter(d => d.water >= 2500).length;
  const ratio = goodDays / history.length;

  if (ratio > 0.9) return 95;
  if (ratio > 0.75) return 85;
  if (ratio > 0.6) return 70;
  if (ratio > 0.4) return 55;
  return 40;
}

function scoreProteinVol(history) {
  const proteinDays = history.filter(d => d.protein >= 100).length;
  const ratio = proteinDays / history.length;

  if (ratio > 0.85) return 95;
  if (ratio > 0.7) return 85;
  if (ratio > 0.5) return 70;
  if (ratio > 0.35) return 55;
  return 40;
}

function scoreMedicationVol(history) {
  const taken = history.filter(d => d.medicationTaken).length;
  const ratio = taken / history.length;

  if (ratio === 1) return 100;
  if (ratio > 0.85) return 85;
  if (ratio > 0.7) return 70;
  if (ratio > 0.5) return 55;
  return 35;
}

function scoreSymptomsVol(history) {
  const badDays = history.filter(
    d => d.bowelMovement === 'none' || d.bowelMovement === 'constipated'
  ).length;

  const ratio = 1 - badDays / history.length;

  if (ratio > 0.9) return 95;
  if (ratio > 0.75) return 85;
  if (ratio > 0.6) return 70;
  if (ratio > 0.45) return 55;
  return 40;
}

/* =======================
   MATH HELPERS
======================= */
function average(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function standardDeviation(values, mean) {
  const variance =
    values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function capper(n, min, max){
    return Math.max(min, Math.min(max, n))
}