'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { paymentApi } from '@/lib/api/payment.api';
import toast from 'react-hot-toast';

// Make sure to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample');

export default function DepositPage() {
  const [amount, setAmount] = useState(10);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = async () => {
    try {
      setIsLoading(true);
      const res = await paymentApi.createDepositIntent(amount, 'usd');
      if (res.success) {
        setClientSecret(res.data.clientSecret);
      }
    } catch (err: any) {
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Deposit Funds</h1>
        
        {!clientSecret ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (USD)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <button
              onClick={initializePayment}
              disabled={isLoading || amount < 1}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Proceed to Payment'}
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}
