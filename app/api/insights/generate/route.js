import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabaseAdmin } from '@/lib/supabase'
import { analyzeRules, formatRulesForAI } from '@/lib/rules'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { daily_log_id } = await request.json()

    if (!daily_log_id) {
      return NextResponse.json(
        { error: 'Missing daily_log_id' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin()

    // Get today's log with user profile
    const { data: todayLog, error: logError } = await supabase
      .from('daily_logs')
      .select(`
        *,
        user_profiles (
          glp1_medication,
          start_date,
          current_dosage,
          dosing_schedule
        )
      `)
      .eq('id', daily_log_id)
      .single()

    if (logError || !todayLog) {
      return NextResponse.json(
        { error: 'Daily log not found' },
        { status: 404 }
      )
    }

    // Get yesterday's log
    const yesterday = new Date(todayLog.log_date)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayDate = yesterday.toISOString().split('T')[0]

    const { data: yesterdayLog } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', todayLog.user_id)
      .eq('log_date', yesterdayDate)
      .single()

    // Get weekly logs for trend analysis
    const weekAgo = new Date(todayLog.log_date)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekAgoDate = weekAgo.toISOString().split('T')[0]

    const { data: weeklyLogs } = await supabase
      .from('daily_logs')
      .select('log_date, weight, calories, protein, steps')
      .eq('user_id', todayLog.user_id)
      .gte('log_date', weekAgoDate)
      .lt('log_date', todayLog.log_date)
      .order('log_date', { ascending: false })

    // Run rule engine
    const profile = todayLog.user_profiles
    const triggeredRules = analyzeRules(todayLog, yesterdayLog, profile, weeklyLogs || [])

    // Calculate days since medication start
    const startDate = new Date(profile.start_date)
    const todayDate = new Date(todayLog.log_date)
    const daysSinceStart = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24))

    // Calculate weight change
    const weightChange = yesterdayLog
      ? (todayLog.weight - yesterdayLog.weight).toFixed(1)
      : 0

    // Build AI prompt
    const systemPrompt = `You are a compassionate health coach specializing in GLP-1 medications (semaglutide/tirzepatide). Your role is to explain daily weight fluctuations in a reassuring, scientific, and non-judgmental way at an 8th-grade reading level.

User Profile:
- Medication: ${profile.glp1_medication}
- Days on medication: ${daysSinceStart}
- Current dosage: ${profile.current_dosage}
- Dosing schedule: ${profile.dosing_schedule}

Today's Metrics:
- Weight: ${todayLog.weight} lbs (${weightChange > 0 ? '+' : ''}${weightChange} lbs from yesterday)
- Calories: ${todayLog.calories}
- Protein: ${todayLog.protein}g
- Steps: ${todayLog.steps}
- Water: ${todayLog.water}oz
- Sleep: ${todayLog.sleep_hours} hours
- Medication taken: ${todayLog.medication_taken ? 'Yes' : 'No'}
- Bowel movement: ${todayLog.bowel_movement}

${yesterdayLog ? `Yesterday's Metrics:
- Weight: ${yesterdayLog.weight} lbs
- Calories: ${yesterdayLog.calories}
- Protein: ${yesterdayLog.protein}g
- Steps: ${yesterdayLog.steps}
- Water: ${yesterdayLog.water}oz
- Sleep: ${yesterdayLog.sleep_hours} hours` : 'No yesterday data available (first log).'}

Detected Patterns:
${formatRulesForAI(triggeredRules)}

Weekly Trend:
${weeklyLogs && weeklyLogs.length > 0
  ? weeklyLogs.map(log => `${log.log_date}: ${log.weight} lbs`).join('\n')
  : 'Not enough data for weekly trend'}

Instructions:
1. Generate a calm, reassuring explanation for today's weight reading
2. Focus on why daily fluctuations are normal, especially on GLP-1s
3. Never be judgmental or create anxiety
4. Use simple language (8th-grade reading level)
5. If extreme patterns detected (e.g., very low calories for multiple days, rapid weight loss), gently suggest consulting their doctor
6. Return response as JSON with exactly 3 fields: reason, trend_interpretation, focus_today

Response Format:
{
  "reason": "1-2 sentences explaining today's weight reading based on the metrics and patterns",
  "trend_interpretation": "1-2 sentences about their overall trend and what to expect",
  "focus_today": "1-2 actionable suggestions for today (e.g., hydration, protein, steps)"
}`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate my daily insight.' },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const insightData = JSON.parse(completion.choices[0].message.content)

    // Save insight to database
    const { data: insight, error: insightError } = await supabase
      .from('insights')
      .upsert([
        {
          daily_log_id: daily_log_id,
          reason: insightData.reason,
          trend_interpretation: insightData.trend_interpretation,
          focus_today: insightData.focus_today,
          triggered_rules: triggeredRules,
        },
      ], { onConflict: 'daily_log_id' })
      .select()
      .single()

    if (insightError) {
      console.error('Error saving insight:', insightError)
      return NextResponse.json(
        { error: 'Failed to save insight' },
        { status: 500 }
      )
    }

    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Error generating insight:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight', details: error.message },
      { status: 500 }
    )
  }
}
