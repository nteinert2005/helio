import { detectAnomalies } from "./anomalyDetector";
import { generateExplanation } from "./generateExplanation";
import { generateMicroInterventions } from "./generateMicrointerventions";
import { computeStabilityScore } from "./stabilityScore";
import { forecastTrend } from "./trendForecaster";
import { supabaseAdmin } from "../supabase";


export async function generateInsights(input, dailyLogId) {
    const stabilityScore = computeStabilityScore(input);
    const anomalies = detectAnomalies(input);
    const trendForecast = forecastTrend(input);
    const interventions = generateMicroInterventions(input);
    const explanations = generateExplanation({
        input,
        anomalies,
        trendForecast,
        interventions,
        stabilityScore
    })

    const insightData = {
        stabilityScore,
        anomalies,
        trendForecast,
        interventions,
        explanations
    };

    // Save or update insight in database if dailyLogId provided
    if (dailyLogId) {
        try {
            const supabase = supabaseAdmin();

            // Check if insight already exists for this daily_log_id
            const { data: existingInsight, error: fetchError } = await supabase
                .from('insights')
                .select('id')
                .eq('daily_log_id', dailyLogId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                // PGRST116 is "no rows returned" - not an error in this case
                console.error('Error checking existing insight:', fetchError);
            }

            const insightPayload = {
                daily_log_id: dailyLogId,
                reason: explanations.reason || '',
                trend_interpretation: explanations.trend_interpretation || '',
                focus_today: explanations.focus_today || '',
                triggered_rules: anomalies || []
            };

            if (existingInsight) {
                // Update existing insight
                const { error: updateError } = await supabase
                    .from('insights')
                    .update(insightPayload)
                    .eq('id', existingInsight.id);

                if (updateError) {
                    console.error('Error updating insight:', updateError);
                } else {
                    console.log('Insight updated successfully for daily_log_id:', dailyLogId);
                }
            } else {
                // Insert new insight
                const { error: insertError } = await supabase
                    .from('insights')
                    .insert([insightPayload]);

                if (insertError) {
                    console.error('Error inserting insight:', insertError);
                } else {
                    console.log('Insight created successfully for daily_log_id:', dailyLogId);
                }
            }
        } catch (err) {
            console.error('Unexpected error saving insight:', err);
        }
    }

    return insightData;
}