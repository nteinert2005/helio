'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'

const LOG_STEPS = [
  { id: 'weight', label: 'Weight', unit: 'lbs' },
  { id: 'calories', label: 'Calories', unit: 'cal' },
  { id: 'protein', label: 'Protein', unit: 'g' },
  { id: 'steps', label: 'Steps', unit: 'steps' },
  { id: 'water', label: 'Water', unit: 'oz' },
  { id: 'sleep', label: 'Sleep', unit: 'hours' },
  { id: 'bathroom', label: 'Bowel Movement', unit: '' },
  { id: 'medication', label: 'Medication', unit: '' },
]

function LogPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [yesterdayData, setYesterdayData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

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
    // Get date from URL query param, or use today
    const dateParam = searchParams.get('date')
    const logDate = dateParam || new Date().toISOString().split('T')[0]
    setSelectedDate(logDate)
    checkUserAndLoadData(logDate)
  }, [searchParams])

  const checkUserAndLoadData = async (logDate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }

      setUser(user)

      // Load data for the selected date
      const { data: dayLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', logDate)
        .single()

      if (dayLog) {
        setFormData({
          weight: dayLog.weight,
          calories: dayLog.calories,
          protein: dayLog.protein,
          steps: dayLog.steps,
          water: dayLog.water,
          sleep_hours: dayLog.sleep_hours,
          medication_taken: dayLog.medication_taken,
          bowel_movement: dayLog.bowel_movement,
        })
      }

      // Load previous day's data relative to selected date
      const selectedDateObj = new Date(logDate)
      const previousDay = new Date(selectedDateObj.getTime() - 86400000).toISOString().split('T')[0]
      const { data: previousDayLog } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', previousDay)
        .single()

      setYesterdayData(previousDayLog)
    } catch (error) {
      console.error('Error loading log data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep < LOG_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)

    try {
      // Use the selected date instead of always using today
      const logDate = selectedDate || new Date().toISOString().split('T')[0]

      const { data: logData, error: logError } = await supabase
        .from('daily_logs')
        .upsert([
          {
            user_id: user.id,
            log_date: logDate,
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

      if (yesterdayData) {
        await fetch('/api/insights/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ daily_log_id: logData.id }),
        })
      }

      setCurrentStep(LOG_STEPS.length)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err) {
      console.error('Error saving log:', err)
    } finally {
      setSaving(false)
    }
  }

  const renderStepContent = () => {
    const step = LOG_STEPS[currentStep]

    if (currentStep === LOG_STEPS.length) {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
            <div className="text-4xl">✓</div>
          </div>
          <h2 className="text-3xl font-bold">All set!</h2>
          <p className="text-body-text text-lg">Your daily log has been saved</p>
        </div>
      )
    }

    switch (step.id) {
      case 'weight':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Weight</div>
              <h2 className="text-3xl font-bold">What&apos;s your weight today?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-48"
                placeholder="0.0"
                autoFocus
              />
              <span className="text-2xl text-label-text">lbs</span>
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.weight} lbs
              </p>
            )}
          </div>
        )

      case 'calories':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Nutrition</div>
              <h2 className="text-3xl font-bold">How many calories?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-64"
                placeholder="0"
                autoFocus
              />
              <span className="text-2xl text-label-text">cal</span>
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.calories} cal
              </p>
            )}
          </div>
        )

      case 'protein':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Nutrition</div>
              <h2 className="text-3xl font-bold">Protein intake?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={formData.protein}
                onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-48"
                placeholder="0"
                autoFocus
              />
              <span className="text-2xl text-label-text">g</span>
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.protein}g
              </p>
            )}
          </div>
        )

      case 'steps':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Activity</div>
              <h2 className="text-3xl font-bold">How many steps?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-64"
                placeholder="0"
                autoFocus
              />
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.steps} steps
              </p>
            )}
          </div>
        )

      case 'water':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Hydration</div>
              <h2 className="text-3xl font-bold">Water intake?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                value={formData.water}
                onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-48"
                placeholder="0"
                autoFocus
              />
              <span className="text-2xl text-label-text">oz</span>
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.water}oz
              </p>
            )}
          </div>
        )

      case 'sleep':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Recovery</div>
              <h2 className="text-3xl font-bold">Hours of sleep?</h2>
            </div>
            <div className="flex items-center justify-center gap-4">
              <input
                type="number"
                step="0.5"
                value={formData.sleep_hours}
                onChange={(e) => setFormData({ ...formData, sleep_hours: e.target.value })}
                className="text-6xl font-black text-center bg-transparent border-none outline-none w-48"
                placeholder="0"
                autoFocus
              />
              <span className="text-2xl text-label-text">h</span>
            </div>
            {yesterdayData && (
              <p className="text-center text-label-text text-sm">
                Yesterday: {yesterdayData.sleep_hours}h
              </p>
            )}
          </div>
        )

      case 'bathroom':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">Digestion</div>
              <h2 className="text-3xl font-bold">Bowel movement today?</h2>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              {['normal', 'constipated', 'none'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFormData({ ...formData, bowel_movement: option })}
                  className={`w-full px-6 py-4 rounded-2xl font-medium text-lg transition-all ${
                    formData.bowel_movement === option
                      ? 'bg-primary-bg text-white'
                      : 'bg-gray-100 text-primary-bg hover:bg-gray-200'
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )

      case 'medication':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="text-label-text text-sm uppercase tracking-widest">GLP-1 Medication</div>
              <h2 className="text-3xl font-bold">Did you take your shot today?</h2>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
              <button
                onClick={() => setFormData({ ...formData, medication_taken: true })}
                className={`w-full px-6 py-4 rounded-2xl font-medium text-lg transition-all ${
                  formData.medication_taken
                    ? 'bg-primary-bg text-white'
                    : 'bg-gray-100 text-primary-bg hover:bg-gray-200'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setFormData({ ...formData, medication_taken: false })}
                className={`w-full px-6 py-4 rounded-2xl font-medium text-lg transition-all ${
                  !formData.medication_taken
                    ? 'bg-primary-bg text-white'
                    : 'bg-gray-100 text-primary-bg hover:bg-gray-200'
                }`}
              >
                No
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-label-text animate-pulse">loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-bg relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <div className="text-9xl">📊</div>
      </div>

      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-10 h-10 rounded-full bg-card-bg/50 backdrop-blur flex items-center justify-center hover:bg-card-bg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {selectedDate && (
        <div className="absolute top-6 right-6 z-20">
          <div className="px-4 py-2 rounded-full bg-card-bg/50 backdrop-blur text-body-text text-sm">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: new Date(selectedDate).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
            })}
          </div>
        </div>
      )}

      <div className="fixed inset-0 flex items-end">
        <div className="w-full bg-white rounded-t-[2rem] p-8 pb-12 space-y-8 animate-slide-up">
          <div className="flex items-center justify-center gap-2">
            {LOG_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-primary-bg'
                    : index < currentStep
                    ? 'w-2 bg-primary-bg/50'
                    : 'w-2 bg-primary-bg/20'
                }`}
              />
            ))}
          </div>

          <div className="min-h-[300px] flex flex-col justify-center text-primary-bg">
            {renderStepContent()}
          </div>

          {currentStep < LOG_STEPS.length && (
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 px-6 py-4 bg-gray-100 text-primary-bg rounded-full font-medium text-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 px-6 py-4 bg-primary-bg text-white rounded-full font-medium text-lg hover:scale-105 transition-transform disabled:opacity-50"
              >
                {currentStep === LOG_STEPS.length - 1
                  ? saving
                    ? 'Saving...'
                    : 'Complete'
                  : 'Next'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-primary-bg">
        <div className="text-label-text animate-pulse">loading...</div>
      </div>
    }>
      <LogPageContent />
    </Suspense>
  )
}
