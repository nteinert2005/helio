'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

  const [formData, setFormData] = useState({
    glp1_medication: 'semaglutide',
    start_date: '',
    current_dosage: '',
    dosing_schedule: 'weekly',
  })

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
      } else {
        setUserId(user.id)

        // Check if already has profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profile) {
          router.push('/dashboard')
        }
      }
    }

    checkUser()
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            ...formData,
          },
        ])

      if (insertError) throw insertError

      // Redirect to log page for first entry
      router.push('/log')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-page-title">Tell us about your GLP-1 journey</h1>
          <p className="text-label-text">
            This helps us provide more accurate insights (takes less than 60 seconds)
          </p>
        </div>

        {/* Form */}
        <div className="card space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-button bg-critical/10 border border-critical/20 text-critical text-sm">
                {error}
              </div>
            )}

            {/* Medication Type */}
            <div>
              <label htmlFor="medication" className="label">
                Which GLP-1 medication are you taking?
              </label>
              <select
                id="medication"
                value={formData.glp1_medication}
                onChange={(e) => handleChange('glp1_medication', e.target.value)}
                className="input w-full"
                required
              >
                <option value="semaglutide">Semaglutide (Ozempic/Wegovy)</option>
                <option value="tirzepatide">Tirzepatide (Mounjaro/Zepbound)</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="label">
                When did you start this medication?
              </label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                className="input w-full"
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Current Dosage */}
            <div>
              <label htmlFor="dosage" className="label">
                What is your current dosage?
              </label>
              <input
                id="dosage"
                type="text"
                value={formData.current_dosage}
                onChange={(e) => handleChange('current_dosage', e.target.value)}
                className="input w-full"
                placeholder="e.g., 0.25mg, 1mg, 2.5mg"
                required
              />
              <p className="text-xs text-label-text mt-1">
                Enter the dose you're currently taking (e.g., "0.5mg" or "5mg")
              </p>
            </div>

            {/* Dosing Schedule */}
            <div>
              <label htmlFor="schedule" className="label">
                How often do you take your medication?
              </label>
              <select
                id="schedule"
                value={formData.dosing_schedule}
                onChange={(e) => handleChange('dosing_schedule', e.target.value)}
                className="input w-full"
                required
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
