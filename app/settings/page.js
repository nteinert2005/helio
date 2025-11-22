'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, User, Pill, Trash2, ChevronRight, Home, TrendingUp, Plus, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    glp1_medication: '',
    start_date: '',
    current_dosage: '',
    dosing_schedule: '',
  })

  useEffect(() => {
    checkUserAndLoadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUserAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }

      setUser(user)

      // Load profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormData({
          glp1_medication: profileData.glp1_medication,
          start_date: profileData.start_date,
          current_dosage: profileData.current_dosage,
          dosing_schedule: profileData.dosing_schedule,
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('user_id', user.id)

      if (updateError) throw updateError

      setProfile({ ...profile, ...formData })
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    )

    if (!confirmed) return

    try {
      // Delete user data
      await supabase.from('user_profiles').delete().eq('user_id', user.id)
      await supabase.from('daily_logs').delete().eq('user_id', user.id)

      // Sign out and redirect
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      setError('Failed to delete account. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-label-text">Loading settings...</div>
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
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <div className="w-10"></div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-2xl space-y-6">
        {error && (
          <div className="p-4 rounded-button bg-critical/10 border border-critical/20 text-critical text-sm">
            {error}
          </div>
        )}

        {/* Account Section */}
        <div className="card-glass space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary-action" />
            <h2 className="text-lg font-bold">Account</h2>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-button bg-primary-bg/50">
              <div className="text-xs text-label-text mb-1">Email</div>
              <div className="text-body-text">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Medication Information */}
        <div className="card-glass space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pill className="w-5 h-5 text-success" />
              <h2 className="text-lg font-bold">Medication Information</h2>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-primary-action hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="label">Medication</label>
                <select
                  value={formData.glp1_medication}
                  onChange={(e) =>
                    setFormData({ ...formData, glp1_medication: e.target.value })
                  }
                  className="input w-full"
                >
                  <option value="semaglutide">Semaglutide (Ozempic/Wegovy)</option>
                  <option value="tirzepatide">Tirzepatide (Mounjaro/Zepbound)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="input w-full"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="label">Current Dosage</label>
                <input
                  type="text"
                  value={formData.current_dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, current_dosage: e.target.value })
                  }
                  className="input w-full"
                  placeholder="e.g., 0.5mg"
                />
              </div>

              <div>
                <label className="label">Dosing Schedule</label>
                <select
                  value={formData.dosing_schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, dosing_schedule: e.target.value })
                  }
                  className="input w-full"
                >
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData({
                      glp1_medication: profile.glp1_medication,
                      start_date: profile.start_date,
                      current_dosage: profile.current_dosage,
                      dosing_schedule: profile.dosing_schedule,
                    })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-button bg-primary-bg/50">
                <div className="text-xs text-label-text mb-1">Medication</div>
                <div className="text-body-text capitalize">
                  {profile?.glp1_medication}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-button bg-primary-bg/50">
                  <div className="text-xs text-label-text mb-1">Start Date</div>
                  <div className="text-body-text">
                    {new Date(profile?.start_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-4 rounded-button bg-primary-bg/50">
                  <div className="text-xs text-label-text mb-1">Current Dosage</div>
                  <div className="text-body-text">{profile?.current_dosage}</div>
                </div>
              </div>

              <div className="p-4 rounded-button bg-primary-bg/50">
                <div className="text-xs text-label-text mb-1">Dosing Schedule</div>
                <div className="text-body-text capitalize">{profile?.dosing_schedule}</div>
              </div>
            </div>
          )}
        </div>

        {/* Legal Links */}
        <div className="card-glass space-y-2">
          <Link
            href="/privacy"
            className="flex items-center justify-between p-4 rounded-button hover:bg-primary-bg/50 transition-colors"
          >
            <span className="text-body-text">Privacy Policy</span>
            <ChevronRight className="w-5 h-5 text-label-text" />
          </Link>

          <Link
            href="/terms"
            className="flex items-center justify-between p-4 rounded-button hover:bg-primary-bg/50 transition-colors"
          >
            <span className="text-body-text">Terms of Service</span>
            <ChevronRight className="w-5 h-5 text-label-text" />
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="card-glass border-critical/20 space-y-4">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-critical" />
            <h2 className="text-lg font-bold text-critical">Danger Zone</h2>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="w-full p-4 rounded-button bg-critical/10 border border-critical/20 text-critical hover:bg-critical/20 transition-colors"
          >
            Delete Account
          </button>

          <p className="text-xs text-label-text">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card-bg/80 backdrop-blur-xl border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-around">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <Home className="w-6 h-6 text-label-text" />
            <span className="text-xs text-label-text">Today</span>
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

          <Link href="/settings" className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-body-text" />
            <span className="text-xs text-body-text font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
