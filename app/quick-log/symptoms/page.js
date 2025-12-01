'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Stethoscope, ArrowLeft, Check } from 'lucide-react'

export default function QuickLogSymptomsPage() {
  const router = useRouter()
  const [bowelMovement, setBowelMovement] = useState('normal')
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
        setBowelMovement(todayLog.bowel_movement || 'normal')
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    setLoading(true)
    try {
      const today = new Date().toISOString().split('T')[0]

      if (existingLog) {
        // Update existing log
        const { error } = await supabase
          .from('daily_logs')
          .update({ bowel_movement: bowelMovement })
          .eq('id', existingLog.id)

        if (error) throw error
      } else {
        // Create new log
        const { error } = await supabase
          .from('daily_logs')
          .insert({
            user_id: user.id,
            log_date: today,
            bowel_movement: bowelMovement,
          })

        if (error) throw error
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving symptoms:', error)
      alert('Failed to save symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const symptoms = [
    { value: 'none', label: 'None', emoji: '🚫' },
    { value: 'normal', label: 'Normal', emoji: '✅' },
    { value: 'constipated', label: 'Constipated', emoji: '⚠️' },
  ]

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
        <h1 className="text-lg font-semibold text-helio-bone">Log Symptoms</h1>
        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="px-6 py-12 max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-helio-solar-ember/10 flex items-center justify-center shadow-helio-glow-sm">
            <Stethoscope className="w-10 h-10 text-helio-solar-ember" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-helio-bone mb-2">How are you feeling?</h2>
          <p className="text-sm text-helio-muted-titanium">Track your digestive health</p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {symptoms.map((symptom) => (
            <button
              key={symptom.value}
              onClick={() => setBowelMovement(symptom.value)}
              className={`w-full p-5 rounded-xl border-2 transition-all ${
                bowelMovement === symptom.value
                  ? 'border-helio-solar-ember bg-helio-solar-ember/10 shadow-helio-glow-sm'
                  : 'border-helio-ash-divider bg-helio-obsidian hover:border-helio-ash-divider/60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{symptom.emoji}</div>
                <div className="flex-1 text-left">
                  <div className="text-lg font-medium text-helio-bone">{symptom.label}</div>
                </div>
                {bowelMovement === symptom.value && (
                  <Check className="w-6 h-6 text-helio-solar-ember" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Info Text */}
        {existingLog && (
          <div className="mb-6 text-center text-sm text-helio-muted-titanium">
            Updating today's symptoms
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-helio-solar-ember text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-helio-solar-ember/90 shadow-helio-glow-md hover:shadow-helio-glow-strong transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Symptoms
            </>
          )}
        </button>
      </div>
    </div>
  )
}
