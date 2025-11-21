import Link from 'next/link'
import { Scale, TrendingDown, Brain, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-action/10 to-transparent" />

        <div className="relative container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Why didn&apos;t I lose weight{' '}
              <span className="gradient-text">today?</span>
            </h1>

            <p className="text-xl md:text-2xl text-label-text max-w-2xl mx-auto">
              Get calm, scientific insights about your daily weight fluctuations while on GLP-1 medications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/auth?mode=signup" className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link href="/auth?mode=login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>

            <p className="text-sm text-label-text">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="card-glass text-center space-y-4 animate-slide-up">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-action/20 flex items-center justify-center">
                <Scale className="w-8 h-8 text-primary-action" />
              </div>
              <h3 className="text-xl font-bold">Log Daily Metrics</h3>
              <p className="text-label-text">
                Track 8 simple metrics each day: weight, calories, protein, steps, water, sleep, medication, and bowel movements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-glass text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                <Brain className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-label-text">
                Our rule engine detects patterns and GPT-4 generates personalized insights based on your data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-glass text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
                <TrendingDown className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-bold">Understand Trends</h3>
              <p className="text-label-text">
                See weekly patterns and learn why weight fluctuates day-to-day on GLP-1 medications.
              </p>
            </div>

            {/* Step 4 */}
            <div className="card-glass text-center space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-critical/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-critical" />
              </div>
              <h3 className="text-xl font-bold">Stay Calm</h3>
              <p className="text-label-text">
                Get reassuring, science-backed explanations that keep you motivated on your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto card-glass text-center space-y-6 p-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to understand your weight journey?
            </h2>
            <p className="text-xl text-label-text">
              Join thousands using HelioIQ to stay motivated on GLP-1 medications.
            </p>
            <Link href="/auth?mode=signup" className="btn-primary text-lg px-8 py-4 inline-block">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-label-text">
            <p>&copy; 2024 HelioIQ. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-body-text transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-body-text transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
