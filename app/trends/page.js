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
  const [allLogs, setAllLogs] = useState([])
  const [chartData, setChartData] = useState([])
  const [pastInsights, setPastInsights] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('1M')

  useEffect(() => {
    checkUserAndLoadData()
  }, [])

  useEffect(() => {
    if (allLogs.length > 0) {
      filterDataByPeriod(selectedPeriod)
    }
  }, [selectedPeriod, allLogs])

  const filterDataByPeriod = (period) => {
    const now = new Date()
    let cutoffDate

    switch (period) {
      case '1D':
        cutoffDate = new Date(now.getTime() - 1 * 86400000)
        break
      case '1W':
        cutoffDate = new Date(now.getTime() - 7 * 86400000)
        break
      case '1M':
        cutoffDate = new Date(now.getTime() - 30 * 86400000)
        break
      case '3M':
        cutoffDate = new Date(now.getTime() - 90 * 86400000)
        break
      case '6M':
        cutoffDate = new Date(now.getTime() - 180 * 86400000)
        break
      case '1Y':
        cutoffDate = new Date(now.getTime() - 365 * 86400000)
        break
      case 'All':
        cutoffDate = new Date(0)
        break
      default:
        cutoffDate = new Date(now.getTime() - 30 * 86400000)
    }

    const filtered = allLogs.filter(log => new Date(log.log_date) >= cutoffDate)

    if (filtered.length > 0) {
      // Format for chart
      const formattedData = filtered.map(log => ({
        date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: parseFloat(log.weight),
        fullDate: log.log_date,
      }))

      setChartData(formattedData)

      // Calculate stats
      const weights = filtered.map(log => parseFloat(log.weight))
      const startWeight = weights[0]
      const currentWeight = weights[weights.length - 1]
      const totalLoss = startWeight - currentWeight
      const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length

      setStats({
        startWeight,
        currentWeight,
        totalLoss,
        avgWeight: avgWeight.toFixed(1),
        daysLogged: filtered.length,
      })
    }
  }

  const checkUserAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }

      setUser(user)

      // Load all logs (up to 1 year)
      const oneYearAgo = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0]
      const { data: logs } = await supabase
        .from('daily_logs')
        .select('log_date, weight, calories, protein, steps')
        .eq('user_id', user.id)
        .gte('log_date', oneYearAgo)
        .order('log_date', { ascending: true })

      if (logs && logs.length > 0) {
        setAllLogs(logs)
        // filterDataByPeriod will be called by useEffect
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
    <div className="min-h-screen pb-20 bg-helio-void">
      {/* Top Bar */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-helio-ash-divider">
        <Link href="/dashboard" className="text-helio-muted-titanium hover:text-helio-bone transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-helio-bone">Your Trends</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-helio-obsidian flex items-center justify-center">
          <User className="w-5 h-5 text-helio-bone" />
        </Link>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Main Stats Display */}
        {stats && (
          <div className="text-center space-y-6 py-8">
            {/* Large Weight Loss Number */}
            <div className="space-y-2">
              <div className="text-7xl md:text-8xl font-black tracking-tight text-helio-bone">
                {Math.abs(stats.totalLoss).toFixed(1)}<span className="text-5xl text-helio-muted-titanium">{' '}lbs</span>
              </div>

              {/* Today's Change */}
              <div className="flex items-center justify-center gap-2 text-xl">
                <span className="text-helio-muted-titanium">Total</span>
                <div className="flex items-center gap-1 text-success">
                  {stats.totalLoss >= 0 ? (
                    <>
                      <TrendingDown className="w-5 h-5" />
                      <span>{((stats.totalLoss / stats.startWeight) * 100).toFixed(2)}%</span>
                      <span className="text-helio-muted-titanium">(-{stats.totalLoss.toFixed(1)} lbs)</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      <span>{((Math.abs(stats.totalLoss) / stats.startWeight) * 100).toFixed(2)}%</span>
                      <span className="text-helio-muted-titanium">(+{Math.abs(stats.totalLoss).toFixed(1)} lbs)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Time Period Selector */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {['1D', '1W', '1M', '3M', '6M', '1Y', 'All'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPeriod === period
                      ? 'bg-helio-solar-ember/20 text-helio-solar-ember'
                      : 'bg-helio-obsidian hover:bg-helio-ash-divider text-helio-muted-titanium'
                  }`}
                >
                  {period}
                </button>
              ))}
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
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#141416',
                      border: '1px solid #242428',
                      borderRadius: '12px',
                      color: '#F4F4F5',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#9CA3AF', fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#FCD34D' }}
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
      <div className="fixed bottom-0 left-0 right-0 bg-helio-obsidian/80 backdrop-blur-xl border-t border-helio-ash-divider pb-safe">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Home className="w-6 h-6 text-helio-muted-titanium" />
            <span className="text-xs text-helio-muted-titanium">Today</span>
          </Link>

          <Link href="/trends" className="flex flex-col items-center gap-1">
            <TrendingUp className="w-6 h-6 text-helio-bone" />
            <span className="text-xs text-helio-bone font-medium">Trends</span>
          </Link>

          <Link href="/log" className="relative -top-4">
            <div className="w-16 h-16 rounded-full bg-helio-solar-ember flex items-center justify-center shadow-helio-glow-strong hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </Link>

          <Link href="/insights" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Sparkles className="w-6 h-6 text-helio-muted-titanium" />
            <span className="text-xs text-helio-muted-titanium">Insights</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <User className="w-6 h-6 text-helio-muted-titanium" />
            <span className="text-xs text-helio-muted-titanium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
