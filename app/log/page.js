'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function LogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [yesterdayData, setYesterdayData] = useState(null)

  const [formData, setFormData] = useState({
    weight: '',
    calories: '',
    protein: '',
    steps: '',
    water: '',
    sleep_hours: '',
    medication_taken: true,
    bowel_movement: 'normal',
  })

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

      // Load today's log if exists
      const today = new Date().toISOString().split('T')[0]
      const { data: todayLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .single()

      if (todayLog) {
        setFormData({
          weight: todayLog.weight,
          calories: todayLog.calories,
          protein: todayLog.protein,
          steps: todayLog.steps,
          water: todayLog.water,
          sleep_hours: todayLog.sleep_hours,
          medication_taken: todayLog.medication_taken,
          bowel_movement: todayLog.bowel_movement,
        })
      }

      // Load yesterday's data for reference
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const { data: yesterdayLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', yesterday)
        .single()

      setYesterdayData(yesterdayLog)
    } catch (error) {
      console.error('Error loading log data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const today = new Date().toISOString().split('T')[0]

      // Insert or update daily log
      const { data: logData, error: logError } = await supabase
        .from('daily_logs')
        .upsert([
          {
            user_id: user.id,
            log_date: today,
            weight: parseFloat(formData.weight),
            calories: parseInt(formData.calories),
            protein: parseInt(formData.protein),
            steps: parseInt(formData.steps),
            water: parseInt(formData.water),
            sleep_hours: parseFloat(formData.sleep_hours),
            medication_taken: formData.medication_taken,
            bowel_movement: formData.bowel_movement,
          },
        ], { onConflict: 'user_id,log_date' })
        .select()
        .single()

      if (logError) throw logError

      // Trigger insight generation (if not first day)
      if (yesterdayData) {
        const response = await fetch('/api/insights/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ daily_log_id: logData.id }),
        })

        if (!response.ok) {
          console.error('Failed to generate insight')
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-card-bg/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-label-text hover:text-body-text transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Log Today&apos;s Metrics</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <div className="card space-y-6">
          {success && (
            <div className="p-4 rounded-button bg-success/10 border border-success/20 text-success text-sm">
              Log saved successfully! Redirecting to dashboard...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-button bg-critical/10 border border-critical/20 text-critical text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Weight */}
            <div className="space-y-2">
              <label htmlFor="weight" className="label">
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="input w-full text-2xl font-bold"
                placeholder="150.5"
                required
              />
              {yesterdayData && (
                <p className="text-xs text-label-text">
                  Yesterday: {yesterdayData.weight} lbs
                </p>
              )}
            </div>

            {/* Nutrition Group */}
            <div className="space-y-4 p-4 rounded-button bg-primary-bg/50">
              <h3 className="text-sm font-bold text-primary-action uppercase tracking-wide">
                Nutrition
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="label">
                    Calories
                  </label>
                  <input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleChange('calories', e.target.value)}
                    className="input w-full"
                    placeholder="1500"
                    required
                  />
                  {yesterdayData && (
                    <p className="text-xs text-label-text mt-1">
                      Yesterday: {yesterdayData.calories}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="protein" className="label">
                    Protein (g)
                  </label>
                  <input
                    id="protein"
                    type="number"
                    value={formData.protein}
                    onChange={(e) => handleChange('protein', e.target.value)}
                    className="input w-full"
                    placeholder="100"
                    required
                  />
                  {yesterdayData && (
                    <p className="text-xs text-label-text mt-1">
                      Yesterday: {yesterdayData.protein}g
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Group */}
            <div className="space-y-4 p-4 rounded-button bg-primary-bg/50">
              <h3 className="text-sm font-bold text-success uppercase tracking-wide">
                Activity & Hydration
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="steps" className="label">
                    Steps
                  </label>
                  <input
                    id="steps"
                    type="number"
                    value={formData.steps}
                    onChange={(e) => handleChange('steps', e.target.value)}
                    className="input w-full"
                    placeholder="8000"
                    required
                  />
                  {yesterdayData && (
                    <p className="text-xs text-label-text mt-1">
                      Yesterday: {yesterdayData.steps}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="water" className="label">
                    Water (oz)
                  </label>
                  <input
                    id="water"
                    type="number"
                    value={formData.water}
                    onChange={(e) => handleChange('water', e.target.value)}
                    className="input w-full"
                    placeholder="64"
                    required
                  />
                  {yesterdayData && (
                    <p className="text-xs text-label-text mt-1">
                      Yesterday: {yesterdayData.water}oz
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recovery Group */}
            <div className="space-y-4 p-4 rounded-button bg-primary-bg/50">
              <h3 className="text-sm font-bold text-warning uppercase tracking-wide">
                Recovery & Medication
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sleep" className="label">
                    Sleep (hours)
                  </label>
                  <input
                    id="sleep"
                    type="number"
                    step="0.5"
                    value={formData.sleep_hours}
                    onChange={(e) => handleChange('sleep_hours', e.target.value)}
                    className="input w-full"
                    placeholder="7.5"
                    required
                  />
                  {yesterdayData && (
                    <p className="text-xs text-label-text mt-1">
                      Yesterday: {yesterdayData.sleep_hours}h
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="bowel" className="label">
                    Bowel Movement
                  </label>
                  <select
                    id="bowel"
                    value={formData.bowel_movement}
                    onChange={(e) => handleChange('bowel_movement', e.target.value)}
                    className="input w-full"
                    required
                  >
                    <option value="normal">Normal</option>
                    <option value="constipated">Constipated</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-button bg-card-bg">
                <input
                  id="medication"
                  type="checkbox"
                  checked={formData.medication_taken}
                  onChange={(e) => handleChange('medication_taken', e.target.checked)}
                  className="w-5 h-5 rounded bg-primary-bg border-white/10 text-primary-action focus:ring-2 focus:ring-primary-action/20"
                />
                <label htmlFor="medication" className="text-body-text font-medium cursor-pointer">
                  I took my GLP-1 medication today
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Log'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
