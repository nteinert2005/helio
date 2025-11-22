'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-label-text hover:text-body-text transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-label-text">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-body-text">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p>
              Welcome to Helio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-body-text">Personal Information</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Email address (for account creation and communication)</li>
              <li>GLP-1 medication information (type, dosage, schedule, start date)</li>
            </ul>

            <h3 className="text-xl font-semibold text-body-text mt-6">Health Data</h3>
            <p>When you use Helio, you voluntarily provide daily health metrics including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Weight measurements</li>
              <li>Calorie and protein intake</li>
              <li>Physical activity (steps)</li>
              <li>Water consumption</li>
              <li>Sleep hours</li>
              <li>Medication adherence</li>
              <li>Digestive health information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate personalized AI-powered insights about your health patterns</li>
              <li>Communicate with you about your account and our services</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Data Storage and Security</h2>
            <p>
              Your data is stored securely using Supabase, a trusted database provider with enterprise-grade security. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">AI and Third-Party Services</h2>
            <p>
              We use OpenAI&apos;s API to generate personalized insights. When processing your data through AI services, we:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Do not share personally identifiable information (PII)</li>
              <li>Only send anonymized health metrics necessary for insight generation</li>
              <li>Do not allow third-party AI providers to store or use your data for training purposes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and all associated data at any time through the Settings page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at the email address provided in the Contact section below.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Children&apos;s Privacy</h2>
            <p>
              Helio is not intended for use by children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Medical Disclaimer</h2>
            <p>
              Helio is not a medical device and does not provide medical advice. The insights provided are for informational purposes only and should not replace professional medical consultation. Always consult with your healthcare provider regarding your GLP-1 medication and health concerns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-primary-action">
              privacy@helioiq.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-primary-action hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
