'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { TrendingDown, TrendingUp, Minus, LogOut, Settings, BarChart3 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [todayLog, setTodayLog] = useState(null)
  const [yesterdayLog, setYesterdayLog] = useState(null)
  const [insight, setInsight] = useState(null)
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  const checkUserAndLoadData = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }

      setUser(user)

      // Check if user has profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        router.push('/onboarding')
        return
      }

      // Load today's log
      const today = new Date().toISOString().split('T')[0]
      const { data: todayData } = await supabase
        .from('daily_logs')
        .select('*, insights(*)')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      setTodayLog(todayData)
      if (todayData?.insights?.[0]) {
        setInsight(todayData.insights[0])
      }

      // Load yesterday's log
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const { data: yesterdayData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', yesterday)
        .single()

      setYesterdayLog(yesterdayData)

      // Load weekly data for chart
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      const { data: weeklyLogs } = await supabase
        .from('daily_logs')
        .select('log_date, weight')
        .eq('user_id', user.id)
        .gte('log_date', weekAgo)
        .order('log_date', { ascending: true })

      setWeeklyData(weeklyLogs || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getWeightChange = () => {
    if (!todayLog || !yesterdayLog) return null
    const change = todayLog.weight - yesterdayLog.weight
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
    }
  }

  const weightChange = getWeightChange()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label-text">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-card-bg/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">HelioIQ</h1>
            <div className="flex items-center gap-4">
              <Link href="/trends" className="text-label-text hover:text-body-text transition-colors">
                <BarChart3 className="w-5 h-5" />
              </Link>
              <Link href="/settings" className="text-label-text hover:text-body-text transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-label-text hover:text-body-text transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Today's Weight */}
        <div className="text-center space-y-4 animate-fade-in">
          {todayLog ? (
            <>
              <div className="hero-metric">{todayLog.weight}</div>
              <div className="text-label-text text-lg">lbs today</div>

              {weightChange && (
                <div className="flex items-center justify-center gap-2 text-lg">
                  {weightChange.direction === 'up' && (
                    <TrendingUp className="w-5 h-5 text-critical" />
                  )}
                  {weightChange.direction === 'down' && (
                    <TrendingDown className="w-5 h-5 text-success" />
                  )}
                  {weightChange.direction === 'same' && (
                    <Minus className="w-5 h-5 text-label-text" />
                  )}
                  <span className={`font-medium ${
                    weightChange.direction === 'up' ? 'text-critical' :
                    weightChange.direction === 'down' ? 'text-success' :
                    'text-label-text'
                  }`}>
                    {weightChange.value} lbs from yesterday
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-4xl font-bold text-label-text">No data yet</div>
              <Link href="/log" className="btn-primary inline-block mt-4">
                Log Today&apos;s Metrics
              </Link>
            </>
          )}
        </div>

        {/* Today's Insight */}
        {insight && (
          <div className="card-glass space-y-6 animate-slide-up">
            <h2 className="text-xl font-bold">Today&apos;s Insight</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-primary-action mb-2">Why this happened</h3>
                <p className="text-body-text leading-relaxed">{insight.reason}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-success mb-2">Your trend</h3>
                <p className="text-body-text leading-relaxed">{insight.trend_interpretation}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-warning mb-2">Focus today</h3>
                <p className="text-body-text leading-relaxed">{insight.focus_today}</p>
              </div>
            </div>
          </div>
        )}

        {/* No insight yet - first day */}
        {todayLog && !insight && (
          <div className="card-glass text-center space-y-4">
            <h2 className="text-xl font-bold">Welcome to HelioIQ!</h2>
            <p className="text-label-text">
              Your first insight will be generated tomorrow after you log your second day.
              Keep logging daily to track your progress!
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/log" className="btn-primary inline-block">
            {todayLog ? "Update Today&apos;s Log" : "Log Today&apos;s Metrics"}
          </Link>
        </div>
      </div>
    </div>
  )
}
