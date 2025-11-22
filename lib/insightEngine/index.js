import { detectAnomalies } from "./anomalyDetector";
import { generateExplanation } from "./generateExplanation";
import { generateMicroInterventions } from "./generateMicrointerventions";
import { computeStabilityScore } from "./stabilityScore";
import { forecastTrend } from "./trendForecaster";


export async function generateInsights(input) {
    // const stabilityScore = computeStabilityScore(input);
    // const anomalies = detectAnomalies(input);
    // const trendForecast = forecastTrend(input);
    // const interventions = generateMicroInterventions(input);
    // const explanations = generateExplanation({
    //     input, 
    //     anomalies, 
    //     trendForecast, 
    //     interventions, 
    //     stabilityScore
    // })

    // return {
    //     stabilityScore,
    //     anomalies,
    //     trendForecast,
    //     interventions,
    //     explanations
    // }

    return 100
}