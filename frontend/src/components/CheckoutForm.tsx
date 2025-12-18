'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the user gets redirected after payment
        return_url: `${window.location.origin}/wallet/deposit/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An error occurred');
      toast.error(error.message || 'Payment failed');
    } 
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}
      <button 
        disabled={!stripe || isProcessing} 
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
