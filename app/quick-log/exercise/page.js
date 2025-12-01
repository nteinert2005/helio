'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Activity, ArrowLeft, Check } from 'lucide-react'

export default function QuickLogExercisePage() {
  const router = useRouter()
  const [steps, setSteps] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [existingLog, setExistingLog] = useState(null)

  useEffect(() => {
    loadUserAndTodayLog()
  }, [])

  const loadUserAndTodayLog = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }
      setUser(user)

      const today = new Date().toISOString().split('T')[0]
      const { data: todayLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      if (todayLog) {
        setExistingLog(todayLog)
        setSteps(todayLog.steps?.toString() || '')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSave = async () => {
    if (!steps || !user) return

    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const stepsValue = parseInt(steps)

      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('daily_logs')
          .update({ steps: stepsValue })
          .eq('id', existingLog.id)

        if (error) throw error
      } else {
        // Create new log
        const { error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            log_date: today,
            steps: stepsValue,
          })

        if (error) throw error
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving steps:', error)
      alert('Failed to save steps. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-helio-void">
      {/* Header */}
      <div className="px-6 py-6 flex items-center justify-between border-b border-helio-ash-divider">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-helio-obsidian flex items-center justify-center hover:bg-helio-ash-divider transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-helio-bone" />
        </button>
        <h1 className="text-lg font-semibold text-helio-bone">Log Exercise</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-6 py-12 max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-helio-solar-ember/10 flex items-center justify-center shadow-helio-glow-sm">
            <Activity className="w-10 h-10 text-helio-solar-ember" />
          </div>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm text-helio-muted-titanium mb-3">Steps Today</label>
          <div className="relative">
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="0"
              className="w-full bg-helio-obsidian border border-helio-ash-divider rounded-xl px-6 py-4 text-4xl font-bold text-helio-bone placeholder-helio-ghost-gray focus:outline-none focus:border-helio-solar-ember focus:ring-2 focus:ring-helio-solar-ember/20 transition-all text-center"
              autoFocus
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xl text-helio-muted-titanium">
              steps
            </div>
          </div>
        </div>

        {/* Info Text */}
        {existingLog && (
          <div className="mb-6 text-center text-sm text-helio-muted-titanium">
            Updating today&apos;s steps
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!steps || loading}
          className="w-full bg-helio-solar-ember text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-helio-solar-ember/90 shadow-helio-glow-md hover:shadow-helio-glow-strong transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Steps
            </>
          )}
        </button>
      </div>
    </div>
  )
}
