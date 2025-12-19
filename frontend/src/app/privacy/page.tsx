'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, Eye, Lock, Database, Share2, Settings, Mail, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
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
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-white/50">Last updated: {lastUpdated}</p>
              </div>
            </div>
            <p className="text-white/70">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use CommitForce.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>We collect information that you provide directly to us:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Account Information:</strong> Name, email address, username, and password when you register.</li>
                  <li><strong className="text-white">Profile Information:</strong> Profile picture, bio, and other optional details.</li>
                  <li><strong className="text-white">Challenge Data:</strong> Information about challenges you create or participate in.</li>
                  <li><strong className="text-white">Payment Information:</strong> Payment card details are processed securely by our payment processor (Stripe).</li>
                  <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our services.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Personalize and improve your experience</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-green-400" />
                <h2 className="text-xl font-semibold text-white">3. Information Sharing</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>We may share your information in the following situations:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">With Your Consent:</strong> We may share information when you give us permission.</li>
                  <li><strong className="text-white">Service Providers:</strong> With vendors and service providers who need access to perform services.</li>
                  <li><strong className="text-white">Legal Requirements:</strong> If required by law or in response to legal process.</li>
                  <li><strong className="text-white">Safety:</strong> To protect the rights, property, and safety of our users and the public.</li>
                </ul>
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mt-4">
                  <p className="text-green-400 font-medium">
                    🔒 We never sell your personal information to third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Our security measures include:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-1">🔐 Encryption</p>
                    <p className="text-sm text-white/60">All data is encrypted in transit and at rest</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-1">🛡️ Secure Authentication</p>
                    <p className="text-sm text-white/60">JWT tokens with secure refresh mechanisms</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-1">💳 PCI Compliant</p>
                    <p className="text-sm text-white/60">Payment processing through PCI-DSS compliant Stripe</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white font-medium mb-1">🔄 Regular Audits</p>
                    <p className="text-sm text-white/60">Security practices reviewed regularly</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold text-white">5. Your Rights</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-white">Correct:</strong> Update or correct inaccurate information</li>
                  <li><strong className="text-white">Delete:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-white">Export:</strong> Receive your data in a portable format</li>
                  <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us at <span className="text-indigo-400">privacy@commitforce.com</span>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">6. Cookies and Tracking</h2>
              </div>
              <div className="text-white/70 space-y-4">
                <p>
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that are sent to your browser from a website and stored on your device.
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-semibold text-white">Contact Us</h2>
              </div>
              <div className="text-white/70">
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="font-medium text-white">CommitForce Privacy Team</p>
                  <p className="text-indigo-400">privacy@commitforce.com</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap gap-4 justify-center mt-12 pt-8 border-t border-white/10">
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Terms of Service
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
