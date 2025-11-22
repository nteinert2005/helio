'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, TrendingDown, Home, TrendingUp, Plus, User, Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function TrendsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [chartData, setChartData] = useState([])
  const [pastInsights, setPastInsights] = useState([])
  const [stats, setStats] = useState(null)

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

      // Load last 30 days of logs
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('log_date, weight, calories, protein, steps')
        .eq('user_id', user.id)
        .gte('log_date', thirtyDaysAgo)
        .order('log_date', { ascending: true })

      if (logs && logs.length > 0) {
        // Format for chart
        const formattedData = logs.map(log => ({
          date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          weight: parseFloat(log.weight),
          fullDate: log.log_date,
        }))

        setChartData(formattedData)

        // Calculate stats
        const weights = logs.map(log => parseFloat(log.weight))
        const startWeight = weights[0]
        const currentWeight = weights[weights.length - 1]
        const totalLoss = startWeight - currentWeight
        const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length

        setStats({
          startWeight,
          currentWeight,
          totalLoss,
          avgWeight: avgWeight.toFixed(1),
          daysLogged: logs.length,
        })
      }

      // Load past insights (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      const { data: insightsData } = await supabase
        .from('insights')
        .select(`
          *,
          daily_logs (log_date, weight)
        `)
        .eq('daily_logs.user_id', user.id)
        .gte('daily_logs.log_date', sevenDaysAgo)
        .order('created_at', { ascending: false })

      setPastInsights(insightsData || [])
    } catch (error) {
      console.error('Error loading trends:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label-text">Loading trends...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-primary-bg">
      {/* Header */}
      <header className="border-b border-white/10 bg-card-bg/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-label-text hover:text-body-text transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Your Trends</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl space-y-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center space-y-2">
              <div className="text-3xl font-bold text-success">{stats.totalLoss.toFixed(1)}</div>
              <div className="text-xs text-label-text uppercase tracking-wide">Total Loss (lbs)</div>
            </div>

            <div className="card text-center space-y-2">
              <div className="text-3xl font-bold">{stats.currentWeight}</div>
              <div className="text-xs text-label-text uppercase tracking-wide">Current Weight</div>
            </div>

            <div className="card text-center space-y-2">
              <div className="text-3xl font-bold text-primary-action">{stats.avgWeight}</div>
              <div className="text-xs text-label-text uppercase tracking-wide">Avg Weight (30d)</div>
            </div>

            <div className="card text-center space-y-2">
              <div className="text-3xl font-bold text-warning">{stats.daysLogged}</div>
              <div className="text-xs text-label-text uppercase tracking-wide">Days Logged</div>
            </div>
          </div>
        )}

        {/* Weight Chart */}
        {chartData.length > 0 ? (
          <div className="card-glass space-y-4">
            <h2 className="text-xl font-bold">30-Day Weight Trend</h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8A8F98" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    stroke="#8A8F98"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#8A8F98"
                    style={{ fontSize: '12px' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1D20',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#C9CDD2',
                    }}
                    labelStyle={{ color: '#8A8F98' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3A7FFF"
                    strokeWidth={3}
                    dot={{ fill: '#3A7FFF', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="card-glass text-center space-y-4">
            <TrendingDown className="w-16 h-16 mx-auto text-label-text" />
            <h2 className="text-xl font-bold">No data yet</h2>
            <p className="text-label-text">
              Start logging your daily metrics to see your weight trend over time.
            </p>
            <Link href="/log" className="btn-primary inline-block">
              Log Today&apos;s Metrics
            </Link>
          </div>
        )}

        {/* Past Insights */}
        {pastInsights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Recent Insights</h2>

            <div className="space-y-4">
              {pastInsights.map((insight) => (
                <div key={insight.id} className="card-glass space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-label-text">
                      {new Date(insight.daily_logs.log_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-lg font-bold">
                      {insight.daily_logs.weight} lbs
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-body-text">{insight.reason}</p>
                  </div>
                </div>
              ))}
            </div>
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

          <Link href="/trends" className="flex flex-col items-center gap-1">
            <TrendingUp className="w-6 h-6 text-body-text" />
            <span className="text-xs text-body-text font-medium">Trends</span>
          </Link>

          <Link href="/log" className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-primary-action flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </Link>

          <Link href="/insights" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Sparkles className="w-6 h-6 text-label-text" />
            <span className="text-xs text-label-text">Insights</span>
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
