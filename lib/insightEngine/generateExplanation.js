export function generateExplanation(args) {
    const {
        anomalies, 
        trendForecast, 
        stabilityScore 
    } = args;

    return [
        {
            headline: `Stability Score ${stabilityScore}/100`,
            reasoning: `Detected ${anomalies.length} anomalies. \n Predicted Weight: ${trendForecast.predictedWeight}
            \n (CI ${trendForecast.lowerCI} - ${trendForecast.upperCI})`,
            confidence: trendForecast.confidence
        }
    ]
}