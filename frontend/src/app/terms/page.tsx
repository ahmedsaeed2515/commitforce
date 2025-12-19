'use client';

import Link from 'next/link';
import { FileText, ArrowLeft, Shield, Users, AlertTriangle, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
  const lastUpdated = 'December 19, 2025';

  return (
    <div className="min-h-screen bg-[#0a0a1a] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                <p className="text-white/50">Last updated: {lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  By accessing and using CommitForce (&quot;the Platform&quot;), you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to abide by these terms, please do not use this service.
                </p>
                <p>
                  We reserve the right to update, change, or replace any part of these Terms of Service by posting updates and/or changes to our website. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">2. User Accounts</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                  <li>You agree not to disclose your password to any third party.</li>
                  <li>You must notify us immediately upon becoming aware of any breach of security.</li>
                  <li>You may not use as a username the name of another person or entity.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">3. Challenges and Deposits</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  CommitForce allows users to create personal challenges with optional monetary deposits. By using the deposit feature, you agree to the following:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Deposits are processed through secure third-party payment processors.</li>
                  <li>Successful completion of challenges according to defined criteria entitles you to a refund of your deposit.</li>
                  <li>Failure to complete challenges may result in forfeiture of deposits to designated charities or community pools.</li>
                  <li>Processing fees may apply to all transactions.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">4. Prohibited Uses</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  You may not use the Platform:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts.</li>
                  <li>To violate any international, federal, or state regulations, rules, laws, or local ordinances.</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others.</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate.</li>
                  <li>To submit false or misleading information.</li>
                  <li>To upload or transmit viruses or any other type of malicious code.</li>
                  <li>To interfere with or circumvent the security features of the Service.</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">5. Contact Information</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  Questions about the Terms of Service should be sent to us at:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-medium text-white">CommitForce Legal Team</p>
                  <p className="text-indigo-400">legal@commitforce.com</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center mt-12 pt-8 border-t border-white/10">
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/help" className="text-white/60 hover:text-white transition-colors">
              Help Center
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
