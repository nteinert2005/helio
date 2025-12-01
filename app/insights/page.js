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
  const isDevelopment = process.env.NODE_ENV === 'development'

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
      {isDevelopment && todayLog && (
        <div className="px-6 pb-4">
          <div className="card-glass space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-label-text font-medium">DEV MODE</span>
              <button
                onClick={handleTestGenerate}
                disabled={generating}
                className="px-4 py-2 bg-warning text-primary-bg rounded-lg text-xs font-medium hover:scale-105 transition-transform disabled:opacity-50"
              >
                {generating ? 'Testing...' : 'Test Generate'}
              </button>
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
        {insights.length === 0 ? (
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
            {insights.map((insight) => (
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
