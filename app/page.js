'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, User, Home, TrendingUp, Plus } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleJoinWaitlist = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Failed to join waitlist. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-bg flex items-center">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">

          {/* Left Content */}
          <div className="space-y-8 max-w-xl lg:order-1 order-1">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-action to-purple-600 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Helio</h1>
            </div>

            {/* Hero Headline */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                Daily Insights to <br />
                <span className="bg-gradient-to-r from-primary-action to-purple-600 bg-clip-text text-transparent">
                  Decode Your Weight Journey
                </span>
              </h2>

              <p className="text-xl text-body-text leading-relaxed">
                Log in seconds. Understand your habits. Unlock actionable insights powered by AI.
              </p>
            </div>

          </div>

          {/* Right Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end lg:order-2 order-2">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[320px] h-[650px] bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl border border-white/10">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>

                {/* Screen - Dark Background */}
                <div className="relative w-full h-full bg-[#1a1a1a] rounded-[2.5rem] overflow-hidden">

                  {/* Top Bar */}
                  <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">0.0 lbs</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Greeting */}
                  <div className="absolute top-12 left-0 right-0 text-center py-2">
                    <h3 className="text-2xl font-bold text-white">good evening.</h3>
                  </div>

                  {/* Week Calendar */}
                  <div className="absolute top-24 left-0 right-0 px-6">
                    <div className="flex items-center justify-between">
                      {[
                        { day: 'Su', date: '16' },
                        { day: 'Mo', date: '17' },
                        { day: 'Tu', date: '18' },
                        { day: 'We', date: '19' },
                        { day: 'Th', date: '20' },
                        { day: 'Fr', date: '21', active: true },
                        { day: 'Sa', date: '22' }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className={`text-xs ${item.active ? 'text-white' : 'text-gray-500'}`}>
                            {item.day}
                          </span>
                          <span className={`text-sm font-medium ${
                            item.active
                              ? 'text-white bg-white/10 px-2 py-1 rounded-full'
                              : 'text-gray-500'
                          }`}>
                            {item.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main Card */}
                  <div className="absolute top-52 left-6 right-6">
                    <div className="bg-[#252525] rounded-3xl px-8 py-12 text-center space-y-6">
                      <div className="space-y-2">
                        <div className="text-gray-400 text-xs uppercase tracking-widest">
                          DAILY CHECK-IN
                        </div>
                        <h2 className="text-2xl font-bold text-white leading-tight">
                          New day, fresh<br />start!
                        </h2>
                      </div>

                      <button className="mx-auto px-10 py-3 bg-white text-black rounded-full font-semibold text-base">
                        Begin
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-20 left-0 right-0 text-center">
                    <div className="text-gray-600 text-xs uppercase tracking-widest">
                      POWERED BY HELIOIQ
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 bg-[#252525]/90 backdrop-blur-xl border-t border-white/5">
                    <div className="px-6 py-3 flex items-center justify-around">
                      <div className="flex flex-col items-center gap-1">
                        <Home className="w-5 h-5 text-white" />
                        <span className="text-[10px] text-white">Today</span>
                      </div>

                      <div className="flex flex-col items-center gap-1 opacity-40">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400">Trends</span>
                      </div>

                      <div className="relative -top-6">
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                          <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-1 opacity-40">
                        <Sparkles className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400">Insights</span>
                      </div>

                      <div className="flex flex-col items-center gap-1 opacity-40">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] text-gray-400">Settings</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-action/20 to-purple-600/20 blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Additional Content - Below phone on mobile */}
          <div className="space-y-8 max-w-xl lg:col-span-2 order-3">
            {/* What is Helio Section */}
            <div className="space-y-3 py-4">
              <h3 className="text-sm uppercase tracking-widest text-label-text font-semibold">What is Helio?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                  </div>
                  <p className="text-body-text"><span className="font-semibold text-white">Fast, simple logging.</span> Track your daily metrics in under 60 seconds—no complex forms or tedious data entry.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary-action/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary-action"></div>
                  </div>
                  <p className="text-body-text"><span className="font-semibold text-white">AI-powered insights.</span> Discover the &quot;why&quot; behind your weight fluctuations with personalized, science-backed explanations.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                  </div>
                  <p className="text-body-text"><span className="font-semibold text-white">Stay on track.</span> Maintain your GLP-1 progress, avoid common pitfalls, and build healthier routines with confidence.</p>
                </li>
              </ul>
            </div>

            {/* Testimonial Quote */}
            <div className="py-4 border-l-2 border-primary-action pl-4 space-y-2">
              <p className="text-body-text italic">
                &quot;Finally, I understand why my weight goes up some days even when I&apos;m doing everything right. Helio takes the guesswork out of my GLP-1 journey.&quot;
              </p>
              <p className="text-label-text text-sm">— Sarah M., Early Tester</p>
            </div>

            {/* Primary CTA */}
            <form onSubmit={handleJoinWaitlist} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-card-bg border border-white/10 rounded-xl text-body-text placeholder:text-label-text focus:outline-none focus:border-primary-action transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-primary-action hover:bg-primary-action/90 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-primary-action/30"
                >
                  {loading ? 'Joining...' : 'Join Waitlist →'}
                </button>
              </div>

              {/* Success Message */}
              {message && (
                <div className="px-4 py-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="px-4 py-3 bg-critical/10 border border-critical/20 rounded-lg text-critical text-sm">
                  {error}
                </div>
              )}
            </form>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-xs text-label-text">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary-action" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                </svg>
                <span>Join 500+ Early Testers</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warning" />
                <span>Powered by HelioIQ</span>
              </div>
            </div>

            {/* Social Link */}
            <div className="flex items-center gap-2 text-sm text-label-text">
              <span>Follow</span>
              <a
                href="https://studio617.notion.site/Helio-2b38077a59928055a371d7f2920dbd51?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-text hover:text-primary-action transition-colors inline-flex items-center gap-1"
              >
                helio for updates
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-6 text-sm text-label-text pt-4 border-t border-white/5">
              <Link href="/privacy" className="hover:text-body-text transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/terms" className="hover:text-body-text transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
