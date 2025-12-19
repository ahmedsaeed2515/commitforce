'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement
} from '@stripe/react-stripe-js';
import { paymentApi } from '@/lib/api/payment.api';
import toast from 'react-hot-toast';
import {
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle,
  Shield,
  Smartphone,
  Wallet as WalletIcon,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  clientSecret: string;
  challengeId: string;
  amount: number;
}

function PaymentForm({ clientSecret, challengeId, amount }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/challenges/${challengeId}?payment=success`,
          receipt_email: email || undefined,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await paymentApi.confirmChallengePayment({
          paymentIntentId: paymentIntent.id
        });

        setPaymentSuccess(true);
        toast.success('🎉 Payment successful! Challenge activated.');
        
        setTimeout(() => {
          router.push(`/challenges/${challengeId}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
        <p className="text-white/70 text-lg mb-2">Your challenge has been activated</p>
        <div className="flex items-center justify-center gap-2 text-sm text-white/50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Redirecting to your challenge...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email for receipt */}
      <div>
        <LinkAuthenticationElement
          onChange={(e) => setEmail(e.value.email)}
          options={{
            defaultValues: {
              email: email
            }
          }}
        />
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <PaymentElement
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            },
            paymentMethodOrder: ['card', 'paypal', 'cashapp', 'apple_pay', 'google_pay'],
          }}
        />
      </div>

      {/* Save payment method */}
      <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition group">
        <input
          type="checkbox"
          checked={savePaymentMethod}
          onChange={(e) => setSavePaymentMethod(e.target.checked)}
          className="w-5 h-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium text-white">Save payment method</span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Securely save for faster checkout next time
          </p>
        </div>
      </label>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-center gap-3">
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay ${amount.toFixed(2)}</span>
              <Shield className="w-5 h-5" />
            </>
          )}
        </div>
      </button>

      {/* Security badges */}
      <div className="flex items-center justify-center gap-6 pt-4">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Lock className="w-3 h-3" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Shield className="w-3 h-3" />
          <span>PCI Compliant</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <CheckCircle className="w-3 h-3" />
          <span>Verified by Stripe</span>
        </div>
      </div>
    </form>
  );
}

function ChallengePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const amount = parseFloat(searchParams.get('amount') || '0');

  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!challengeId || !amount) {
      setError('Invalid payment parameters');
      setIsLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const res = await paymentApi.createChallengePaymentIntent({
          challengeId,
          amount,
          currency: 'EGP'
        });

        if (res.success && res.data.clientSecret) {
          setClientSecret(res.data.clientSecret);
        } else {
          setError('Failed to initialize payment');
        }
      } catch (err) {
        console.error('Payment intent error:', err);
        setError('Failed to initialize payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [challengeId, amount]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white/60 text-lg">Initializing secure payment...</p>
          <p className="text-white/40 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Payment Error</h2>
          <p className="text-white/60 mb-6">{error || 'Something went wrong'}</p>
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] py-12 px-4">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <Link
            href={`/challenges/${challengeId}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Challenge</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/30">
              <CreditCard className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
          </div>
          <p className="text-white/60">Complete your challenge deposit payment</p>
        </div>

        {/* Payment Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
          {/* Amount Summary */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/70 font-medium">Challenge Deposit</span>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  ${amount.toFixed(2)}
                </div>
                <div className="text-xs text-white/50 mt-1">Refundable upon completion</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white/60">
                This deposit will be <span className="text-indigo-400 font-semibold">fully returned</span> to you upon successful completion of your challenge. If you fail, the amount goes to your chosen charity.
              </p>
            </div>
          </div>

          {/* Payment Methods Info */}
          <div className="grid grid-cols-5 gap-3 mb-8">
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <CreditCard className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-xs text-white/60">Cards</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <Smartphone className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-xs text-white/60">Apple Pay</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <WalletIcon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <div className="text-xs text-white/60">Google Pay</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <svg className="w-6 h-6 mx-auto mb-2 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 00-.794.68l-.04.22-.63 3.993-.028.15a.805.805 0 01-.794.68H7.72a.483.483 0 01-.477-.558L7.418 21h1.518l.95-6.02h1.385c4.678 0 7.75-2.203 8.796-6.502z"/>
                <path d="M2.379 0C1.494 0 .755.682.637 1.556L.003 5.75a.805.805 0 00.794.93h2.35L4.72 0H2.38z"/>
              </svg>
              <div className="text-xs text-white/60">PayPal</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition">
              <svg className="w-6 h-6 mx-auto mb-2 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.59 3.475a5.1 5.1 0 0 0-3.05-2.118C19.64.997 15.6.874 12.244.874c-3.355 0-7.395.123-8.293.483a5.1 5.1 0 0 0-3.05 2.118C.32 4.347 0 5.793 0 9.293v5.414c0 3.5.32 4.946.901 5.818a5.1 5.1 0 0 0 3.05 2.118c.898.36 4.938.483 8.293.483 3.355 0 7.395-.123 8.293-.483a5.1 5.1 0 0 0 3.05-2.118c.581-.872.901-2.318.901-5.818V9.293c0-3.5-.32-4.946-.901-5.818zm-11.35 11.83a4.305 4.305 0 1 1 0-8.61 4.305 4.305 0 0 1 0 8.61z"/>
              </svg>
              <div className="text-xs text-white/60">Cash App</div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Payment Details</h3>
            </div>
            
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#6366f1',
                    colorBackground: 'rgba(255, 255, 255, 0.05)',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '12px',
                    spacingUnit: '4px',
                  },
                  rules: {
                    '.Input': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    },
                    '.Input:focus': {
                      border: '1px solid #6366f1',
                      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
                    },
                    '.Tab': {
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '.Tab--selected': {
                      border: '1px solid #6366f1',
                      backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                  },
                },
              }}
            >
              <PaymentForm
                clientSecret={clientSecret}
                challengeId={challengeId!}
                amount={amount}
              />
            </Elements>
          </div>

          {/* Security Info */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-2">Your payment is 100% secure</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  Your payment information is encrypted and processed securely through Stripe. 
                  We never store your card details on our servers. All transactions are protected 
                  by industry-leading security standards.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-white/40">
            Need help? Contact us at{' '}
            <a href="mailto:support@commitforce.com" className="text-indigo-400 hover:text-indigo-300 transition">
              support@commitforce.com
            </a>
          </p>
          <p className="text-xs text-white/30">
            Powered by Stripe • Secured by 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChallengePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <ChallengePaymentContent />
    </Suspense>
  );
}
