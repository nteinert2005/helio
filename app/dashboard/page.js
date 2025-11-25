'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { User, Home, TrendingUp, Plus, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [todayLog, setTodayLog] = useState(null)
  const [yesterdayLog, setYesterdayLog] = useState(null)
  const [insight, setInsight] = useState(null)
  const [previousInsight, setPreviousInsight] = useState(null)

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

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!profile) {
        router.push('/onboarding')
        return
      }

      const today = new Date().toISOString().split('T')[0]
      const { data: todayData, error: todayError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      if (todayError) {
        console.log('No log for today:', todayError.message)
      }

      setTodayLog(todayData)

      // Fetch insight separately if today's log exists
      if (todayData) {
        const { data: insightData, error: insightError } = await supabase
          .from('insights')
          .select('*')
          .eq('daily_log_id', todayData.id)
          .single()

        if (insightError) {
          console.log('No insight for today:', insightError.message)
        } else if (insightData) {
          setInsight(insightData)
          console.log('Set today insight:', insightData)
        }
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const { data: yesterdayData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', yesterday)
        .single()

      setYesterdayLog(yesterdayData)

      // If no today log but yesterday exists, fetch yesterday's insight
      if (!todayData && yesterdayData) {
        const { data: yesterdayInsightData } = await supabase
          .from('insights')
          .select('*')
          .eq('daily_log_id', yesterdayData.id)
          .single()

        if (yesterdayInsightData) {
          setPreviousInsight(yesterdayInsightData)
          console.log('Set previous insight:', yesterdayInsightData)
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWeightChange = () => {
    if (!todayLog || !yesterdayLog) return null
    const change = todayLog.weight - yesterdayLog.weight
    return {
      value: Math.abs(change).toFixed(1),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
      sign: change > 0 ? '+' : change < 0 ? '-' : ''
    }
  }

  const weightChange = getWeightChange()
  const currentDate = new Date()
  const greeting = currentDate.getHours() < 12 ? 'good morning.' :
                   currentDate.getHours() < 18 ? 'good afternoon.' : 'good evening.'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-label-text animate-pulse">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Minimal Header */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div className="text-label-text text-sm">
          {todayLog ? `${todayLog.weight} lbs` : '0.0 lbs'}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center">
          <User className="w-5 h-5 text-body-text" />
        </Link>
      </div>

      {/* Week Calendar */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => {
            const date = new Date()
            date.setDate(date.getDate() - date.getDay() + index)
            const isToday = date.toDateString() === currentDate.toDateString()
            const dateString = date.toISOString().split('T')[0]

            const handleDateClick = () => {
              router.push(`/log?date=${dateString}`)
            }

            return (
              <button
                key={day}
                onClick={handleDateClick}
                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform active:scale-95"
              >
                <div className={`text-xs ${isToday ? 'text-body-text' : 'text-label-text'}`}>
                  {day}
                </div>
                <div className={`text-sm font-medium ${isToday ? 'text-body-text bg-primary-action/20 px-3 py-1 rounded-full' : 'text-label-text'}`}>
                  {date.getDate()}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Circular Progress & Optimize */}
      <div className="px-6 py-12 flex flex-col items-center justify-center">
        <div className="relative w-64 h-64">
          {/* Circular Progress Ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="8"
            />
            {/* Progress Circle - Using primary-action color */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#c98b75"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(todayLog ? 75 : 50) * 5.34} 534`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl font-black tracking-tight">
              {todayLog ? '75' : '50'}
              <span className="text-3xl text-label-text">%</span>
            </div>
          </div>
        </div>

        {/* Optimize Button */}
        <button
          onClick={() => insight ? router.push('/insights') : router.push('/log')}
          className="mt-8 px-12 py-3 bg-white/10 border border-white/20 text-body-text rounded-full font-medium hover:bg-white/20 transition-colors"
        >
          {insight ? 'view insights' : 'optimize'}
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {/* Log Today Card */}
          <button
            onClick={() => router.push('/log')}
            className="bg-card-bg/50 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-card-bg transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#c98b75]/10 flex items-center justify-center">
              <Plus className="w-6 h-6" style={{ color: '#c98b75' }} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-body-text">Log</div>
              <div className="text-xs text-label-text mt-1">
                {todayLog ? 'Update' : 'Add today'}
              </div>
            </div>
          </button>

          {/* View Trends Card */}
          <button
            onClick={() => router.push('/trends')}
            className="bg-card-bg/50 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-card-bg transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#c98b75]/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" style={{ color: '#c98b75' }} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-body-text">Trends</div>
              <div className="text-xs text-label-text mt-1">View history</div>
            </div>
          </button>

          {/* Insights Card */}
          <button
            onClick={() => router.push('/insights')}
            className="bg-card-bg/50 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-card-bg transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#c98b75]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6" style={{ color: '#c98b75' }} />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-body-text">Insights</div>
              <div className="text-xs text-label-text mt-1">
                {insight ? 'Available' : 'Pending'}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Insight Summary Cards */}
      {insight && (
        <div className="px-6 py-4 space-y-3">
          <div className="max-w-2xl mx-auto space-y-3">
            {/* Why Card */}
            <div className="bg-card-bg/50 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c98b75]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5" style={{ color: '#c98b75' }} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-body-text mb-2">Weight insight</div>
                <div className="text-sm text-label-text leading-relaxed">{insight.reason}</div>
              </div>
            </div>

            {/* Focus Card */}
            <div className="bg-card-bg/50 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#c98b75]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" style={{ color: '#c98b75' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-body-text mb-2">Focus today</div>
                <div className="text-sm text-label-text leading-relaxed">{insight.focus_today}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Insight State */}
      {todayLog && !insight && (
        <div className="px-6 py-4">
          <div className="max-w-2xl mx-auto bg-card-bg/50 rounded-2xl p-8 text-center">
            <div className="text-label-text text-sm mb-2">Day 1</div>
            <div className="text-body-text font-medium mb-2">Welcome to your journey!</div>
            <div className="text-label-text text-sm">Your first insight will appear tomorrow</div>
          </div>
        </div>
      )}


      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg/80 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-body-text" />
            <span className="text-xs text-body-text font-medium">Today</span>
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

      {/* Stoic-style Footer */}
      <div className="pb-32 pt-8 text-center">
        <div className="text-label-text text-xs uppercase tracking-widest">
          Powered by HelioIQ
        </div>
      </div>
    </div>
  )
}
