'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Home, TrendingUp, Plus, User, Calendar } from 'lucide-react'

export default function InsightsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [user, setUser] = useState(null)
  const [insights, setInsights] = useState([])
  const [todayLog, setTodayLog] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [showMockData, setShowMockData] = useState(false)
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Mock insights data for testing
  const mockInsights = [
    {
      id: 'mock-1',
      created_at: new Date().toISOString(),
      daily_logs: {
        log_date: new Date().toISOString().split('T')[0],
        weight: 247.8
      },
      reason: "Down 0.4 lbs. Here's what the data is really telling you. Your hydration hit 3.2L yesterday. Protein stayed high at 145g. Normal bowel movement cleared water retention. Your weekly semaglutide dose is holding steady. This is the signal beneath the noise.",
      trend_interpretation: "Week 47. Three days of precise execution. The 0.8 lb drop from two days ago isn't luck—it's pattern. Your process is working. Medication adherence is locked. Nutrition is consistent. This is how real progress looks: small, deliberate, compound.",
      focus_today: "Maintain 3L+ water. Hit 140g+ protein. Sleep 7+ hours tonight—yesterday's 6.5 was below threshold. Add 2,000 steps to reach 8,000 total. Your stack is working. Don't change it. Refine it.",
      triggered_rules: [
        { message: "improved hydration", severity: "info" },
        { message: "high protein intake", severity: "info" },
        { message: "sleep slightly below optimal", severity: "warning" }
      ]
    },
    {
      id: 'mock-2',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      daily_logs: {
        log_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        weight: 248.2
      },
      reason: "Up 0.4 lbs. This is noise, not truth. Sleep dropped to 6.5 hours—cortisol spiked. Water retention followed. Constipation added 1-2 lbs of temporary weight. Steps fell to 4,500. Less movement, less sodium flushed. Your weight didn't shift. Your patterns did.",
      trend_interpretation: "Weekly trend: still down. This variation means nothing. Calories at 2,100. Protein at 130g. Both solid. Weight moves like a staircase—down, plateau, down again. You're between drops. This is the part most people misread.",
      focus_today: "Sleep 7+ hours tonight. Cortisol needs reset. Push water to 3L+ for digestion. Add fiber-rich foods. Move toward 6,000 steps. Medication taken yesterday—your body is adjusting to this week's dose. Watch this pattern tomorrow.",
      triggered_rules: [
        { message: "low sleep cortisol spike", severity: "warning" },
        { message: "constipation detected", severity: "warning" },
        { message: "below optimal step count", severity: "info" }
      ]
    },
    {
      id: 'mock-3',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      daily_logs: {
        log_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        weight: 248.6
      },
      reason: "Up 0.4 lbs. Multiple breaks in your stack. Hydration fell to 2.5L—well below your 3L+ baseline. Sleep crashed at 5.8 hours. Medication dose missed. No bowel movement. Calories at 2,450. The number isn't fat gain. It's water retention from dehydration and sleep deficit.",
      trend_interpretation: "This day stacked errors. Missed medication changes how your body processes food and holds water. Sleep deprivation amplifies cortisol. Hydration dropped below threshold. But here's the truth: one broken day doesn't erase your trendline. It reveals blind spots.",
      focus_today: "Take medication today. Don't skip twice. Sleep 8 hours tonight—cortisol levels need full reset. Drink 3.5L water to compensate. Protein above 120g. Calories back to 2,000-2,200 range. Semaglutide demands consistency. Rebuild your stack.",
      triggered_rules: [
        { message: "severe sleep deficit", severity: "critical" },
        { message: "dehydration detected", severity: "warning" },
        { message: "missed medication dose", severity: "critical" },
        { message: "no bowel movement", severity: "warning" }
      ]
    }
  ]

  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  const checkUserAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }

      setUser(user)

      // Load all insights with their daily logs
      const { data: insightsData } = await supabase
        .from('insights')
        .select(`
          *,
          daily_logs (log_date, weight)
        `)
        .eq('daily_logs.user_id', user.id)
        .order('created_at', { ascending: false })

      setInsights(insightsData || [])

      // Check if today has a log
      const today = new Date().toISOString().split('T')[0]
      const { data: todayData } = await supabase
        .from('daily_logs')
        .select('*, insights(*)')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      setTodayLog(todayData)
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateInsight = async () => {
    if (!todayLog) {
      alert('Please log your metrics for today first')
      router.push('/log')
      return
    }

    if (todayLog.insights && todayLog.insights.length > 0) {
      alert('You already have an insight for today')
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_log_id: todayLog.id }),
      })

      if (!response.ok) throw new Error('Failed to generate insight')

      // Reload insights
      await checkUserAndLoadData()
    } catch (error) {
      console.error('Error generating insight:', error)
      alert('Failed to generate insight. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleTestGenerate = async () => {
    if (!todayLog) {
      alert('Please log your metrics for today first')
      return
    }

    setGenerating(true)
    setTestResult(null)
    try {
      const response = await fetch('/api/insights/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_log_id: todayLog.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate insight')
      }

      setTestResult(result)
      console.log('Test Result:', result)

      // Reload insights
      await checkUserAndLoadData()
    } catch (error) {
      console.error('Error testing insight generation:', error)
      setTestResult({ error: error.message })
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-label-text animate-pulse">loading...</div>
      </div>
    )
  }

  const canGenerateToday = todayLog && (!todayLog.insights || todayLog.insights.length === 0)

  return (
    <div className="min-h-screen pb-20 bg-primary-bg">
      {/* Top Bar */}
      <div className="px-6 py-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-label-text hover:text-body-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Your Insights</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center">
          <User className="w-5 h-5 text-body-text" />
        </Link>
      </div>

      {/* Development Test Button */}
      {isDevelopment && (
        <div className="px-6 pb-4">
          <div className="card-glass space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-label-text font-medium">DEV MODE</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMockData(!showMockData)}
                  className="px-4 py-2 bg-success text-primary-bg rounded-lg text-xs font-medium hover:scale-105 transition-transform"
                >
                  {showMockData ? 'Hide Mock' : 'Show Mock'}
                </button>
                {todayLog && (
                  <button
                    onClick={handleTestGenerate}
                    disabled={generating}
                    className="px-4 py-2 bg-warning text-primary-bg rounded-lg text-xs font-medium hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {generating ? 'Testing...' : 'Test Generate'}
                  </button>
                )}
              </div>
            </div>

            {testResult && (
              <div className="space-y-2">
                {testResult.error ? (
                  <div className="p-3 bg-critical/10 border border-critical/20 rounded-lg">
                    <div className="text-xs text-critical font-medium">Error:</div>
                    <div className="text-xs text-body-text mt-1">{testResult.error}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Stability Score */}
                    {testResult.insights?.stabilityScore !== undefined && (
                      <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="text-xs text-success font-medium">Stability Score</div>
                        <div className="text-lg font-bold text-body-text mt-1">
                          {testResult.insights.stabilityScore}
                        </div>
                      </div>
                    )}

                    {/* Other Scores/Data */}
                    {testResult.insights && (
                      <div className="p-3 bg-primary-action/10 border border-primary-action/20 rounded-lg">
                        <div className="text-xs text-primary-action font-medium mb-2">Full Response</div>
                        <pre className="text-xs text-body-text overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                          {JSON.stringify(testResult.insights, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Insight Button */}
      {canGenerateToday && (
        <div className="px-6 pb-4">
          <button
            onClick={handleGenerateInsight}
            disabled={generating}
            className="w-full px-4 py-3 bg-primary-action text-white rounded-xl text-sm font-medium hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating...' : 'Generate Today'}
          </button>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {(showMockData ? mockInsights : insights).length === 0 ? (
          // Empty State
          <div className="card-glass text-center space-y-6 py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-action/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary-action" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No insights yet</h2>
              <p className="text-body-text max-w-md mx-auto">
                Start logging your daily metrics to receive personalized insights about your weight journey.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/log"
                className="px-8 py-3 bg-primary-action text-white rounded-full font-medium hover:scale-105 transition-transform"
              >
                Log Today&apos;s Metrics
              </Link>
              {canGenerateToday && (
                <button
                  onClick={handleGenerateInsight}
                  disabled={generating}
                  className="px-8 py-3 bg-white/5 text-body-text rounded-full font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate Insight'}
                </button>
              )}
            </div>
          </div>
        ) : (
          // Insights List
          <div className="space-y-4">
            {(showMockData ? mockInsights : insights).map((insight) => (
              <div key={insight.id} className="card-glass space-y-4 hover:border-primary-action/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-action/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary-action" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-body-text">
                        {new Date(insight.daily_logs.log_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-label-text">
                        {insight.daily_logs.weight} lbs
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-label-text">
                    {new Date(insight.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-primary-action text-sm font-medium mb-2">Why Your Weight Changed</h3>
                    <p className="text-body-text leading-relaxed">{insight.reason}</p>
                  </div>

                  <div>
                    <h3 className="text-success text-sm font-medium mb-2">Your Trend</h3>
                    <p className="text-body-text leading-relaxed">{insight.trend_interpretation}</p>
                  </div>

                  <div>
                    <h3 className="text-warning text-sm font-medium mb-2">Focus Today</h3>
                    <p className="text-body-text leading-relaxed">{insight.focus_today}</p>
                  </div>

                  {(() => {
                    // Handle both string (old format) and array (new format)
                    let rules = insight.triggered_rules;
                    if (typeof rules === 'string') {
                      try {
                        rules = JSON.parse(rules);
                      } catch (e) {
                        rules = [];
                      }
                    }
                    return rules && Array.isArray(rules) && rules.length > 0 && (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {rules.map((rule, idx) => (
                            <div
                              key={idx}
                              className="px-3 py-1 rounded-full bg-white/5 text-xs text-label-text"
                            >
                              {rule.message}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg/80 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Home className="w-6 h-6 text-label-text" />
            <span className="text-xs text-label-text">Today</span>
          </Link>

          <Link href="/trends" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <TrendingUp className="w-6 h-6 text-label-text" />
            <span className="text-xs text-label-text">Trends</span>
          </Link>

          <Link href="/log" className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-primary-action flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </Link>

          <Link href="/insights" className="flex flex-col items-center gap-1">
            <Sparkles className="w-6 h-6 text-body-text" />
            <span className="text-xs text-body-text font-medium">Insights</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <User className="w-6 h-6 text-label-text" />
            <span className="text-xs text-label-text">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
