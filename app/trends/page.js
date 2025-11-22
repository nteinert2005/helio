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
      {/* Top Bar */}
      <div className="px-6 py-6 flex items-center justify-between">
        <Link href="/dashboard" className="text-label-text hover:text-body-text transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Your Trends</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center">
          <User className="w-5 h-5 text-body-text" />
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Main Stats Display */}
        {stats && (
          <div className="text-center space-y-6 py-8">
            {/* Large Weight Loss Number */}
            <div className="space-y-2">
              <div className="text-7xl md:text-8xl font-black tracking-tight">
                {Math.abs(stats.totalLoss).toFixed(1)}<span className="text-5xl text-label-text">{' '}lbs</span>
              </div>

              {/* Today's Change */}
              <div className="flex items-center justify-center gap-2 text-xl">
                <span className="text-label-text">Total</span>
                <div className="flex items-center gap-1 text-success">
                  {stats.totalLoss >= 0 ? (
                    <>
                      <TrendingDown className="w-5 h-5" />
                      <span>{((stats.totalLoss / stats.startWeight) * 100).toFixed(2)}%</span>
                      <span className="text-label-text">(-{stats.totalLoss.toFixed(1)} lbs)</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>{((Math.abs(stats.totalLoss) / stats.startWeight) * 100).toFixed(2)}%</span>
                      <span className="text-label-text">(+{Math.abs(stats.totalLoss).toFixed(1)} lbs)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button className="px-4 py-2 rounded-full bg-primary-action/20 text-primary-action text-sm font-medium">
                1D
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                1W
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                1M
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                3M
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                6M
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                1Y
              </button>
              <button className="px-4 py-2 rounded-full hover:bg-white/5 text-label-text text-sm">
                All
              </button>
            </div>
          </div>
        )}

        {/* Weight Chart */}
        {chartData.length > 0 ? (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    stroke="#8A8F98"
                    style={{ fontSize: '12px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1D20',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#C9CDD2',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#8A8F98', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3EB980"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#3EB980' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="card-glass text-center space-y-4 py-12">
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
