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

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const { data: yesterdayData } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', yesterday)
        .single()

      setYesterdayLog(yesterdayData)
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

      {/* Main Card */}
      <div className="px-6 py-8 mt-8">
        <div className="max-w-2xl mx-auto">
          {todayLog && insight ? (
            // Insight Card
            <div className="bg-card-bg rounded-3xl p-12 text-center space-y-8 min-h-[400px] flex flex-col justify-center">
              <div className="space-y-2">
                <div className="text-label-text text-sm uppercase tracking-widest">
                  Today&apos;s Insight
                </div>
                <h2 className="text-3xl font-bold leading-tight px-4">
                  {insight.reason}
                </h2>
              </div>

              <button
                onClick={() => router.push('/log')}
                className="mx-auto px-12 py-4 bg-white text-primary-bg rounded-full font-medium text-lg hover:scale-105 transition-transform"
              >
                Update
              </button>
            </div>
          ) : todayLog && !insight ? (
            // Welcome Card (First Day)
            <div className="bg-card-bg rounded-3xl p-12 text-center space-y-8 min-h-[400px] flex flex-col justify-center">
              <div className="space-y-2">
                <div className="text-label-text text-sm uppercase tracking-widest">
                  Day 1
                </div>
                <h2 className="text-3xl font-bold leading-tight px-4">
                  Welcome to your journey!
                </h2>
              </div>

              <p className="text-body-text text-lg max-w-md mx-auto">
                Your first insight will appear tomorrow
              </p>

              <button
                onClick={() => router.push('/log')}
                className="mx-auto px-12 py-4 bg-white text-primary-bg rounded-full font-medium text-lg hover:scale-105 transition-transform"
              >
                Update
              </button>
            </div>
          ) : (
            // Empty State - Begin
            <div className="bg-card-bg rounded-3xl p-12 text-center space-y-8 min-h-[400px] flex flex-col justify-center">
              <div className="space-y-2">
                <div className="text-label-text text-sm uppercase tracking-widest">
                  Daily Check-In
                </div>
                <h2 className="text-3xl font-bold leading-tight px-4">
                  New day, fresh start!
                </h2>
              </div>

              <button
                onClick={() => router.push('/log')}
                className="mx-auto px-12 py-4 bg-white text-primary-bg rounded-full font-medium text-lg hover:scale-105 transition-transform"
              >
                Begin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Reflection Section (if insight exists) */}
      {insight && (
        <div className="px-6 py-8 mt-4">
          <div className="max-w-2xl mx-auto bg-white/5 rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-success text-sm font-medium mb-2">Your Trend</h3>
                <p className="text-body-text leading-relaxed">{insight.trend_interpretation}</p>
              </div>

              <div>
                <h3 className="text-warning text-sm font-medium mb-2">Focus Today</h3>
                <p className="text-body-text leading-relaxed">{insight.focus_today}</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/trends')}
              className="w-full px-6 py-3 border border-white/10 rounded-full text-body-text font-medium hover:bg-white/5 transition-colors"
            >
              View All Insights
            </button>
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
