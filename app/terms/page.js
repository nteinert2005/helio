'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-label-text hover:text-body-text transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-label-text">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-body-text">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Agreement to Terms</h2>
            <p>
              By accessing or using Helio (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Description of Service</h2>
            <p>
              Helio is a web application designed to help individuals using GLP-1 medications (such as semaglutide or tirzepatide) track daily health metrics and receive AI-powered insights about weight fluctuations and health patterns.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Medical Disclaimer</h2>
            <p className="font-semibold text-warning">
              IMPORTANT: Helio is NOT a medical device and does NOT provide medical advice, diagnosis, or treatment.
            </p>
            <p>
              The insights and information provided by Helio are for educational and informational purposes only. They should not be considered a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication.
            </p>
            <p>
              Never disregard professional medical advice or delay seeking it because of information provided by Helio.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
            </p>
            <p>
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Safeguarding your password and account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Acceptable Use</h2>
            <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the Service in any way that violates any applicable law or regulation</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Submit false, inaccurate, or misleading information</li>
              <li>Use the Service to harm minors in any way</li>
              <li>Impersonate or attempt to impersonate another user</li>
              <li>Use automated systems to access the Service without permission</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Helio and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You retain ownership of the health data you input into the Service. By using the Service, you grant us a limited license to use your data solely for the purpose of providing and improving the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Data Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Subscription and Payments</h2>
            <p>
              Helio may offer subscription-based access to premium features. By subscribing, you agree to pay the applicable fees as described at the time of purchase.
            </p>
            <p>
              Subscription fees are:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Billed in advance on a recurring basis (monthly or annually)</li>
              <li>Non-refundable except as required by law</li>
              <li>Subject to change with 30 days&apos; notice</li>
            </ul>
            <p>
              You may cancel your subscription at any time through the Settings page. Cancellation will take effect at the end of your current billing period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may do so through the Settings page or by contacting us.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, HELIO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any bugs, viruses, or other harmful code that may be transmitted to or through the Service</li>
              <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. HELIO DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
            </p>
            <p>
              By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Severability</h2>
            <p>
              If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Helio regarding the use of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-primary-action">
              support@helioiq.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center space-y-4">
          <Link href="/privacy" className="text-primary-action hover:underline mr-6">
            Privacy Policy
          </Link>
          <Link href="/" className="text-primary-action hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
