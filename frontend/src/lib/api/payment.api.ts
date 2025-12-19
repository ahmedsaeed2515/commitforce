import apiClient from './client';

export interface CreatePaymentIntentData {
  challengeId: string;
  amount: number;
  currency?: string;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
}

export interface RefundData {
  challengeId: string;
  reason?: string;
}

export const paymentApi = {
  // Challenge Payment
  createChallengePaymentIntent: async (data: CreatePaymentIntentData) => {
    const response = await apiClient.post('/payments/challenge/create-intent', data);
    return response.data;
  },

  confirmChallengePayment: async (data: ConfirmPaymentData) => {
    const response = await apiClient.post('/payments/challenge/confirm', data);
    return response.data;
  },

  // Wallet Deposit
  createDepositIntent: async (amount: number, currency: string = 'USD') => {
    const response = await apiClient.post('/payments/deposit/create-intent', {
      amount,
      currency
    });
    return response.data;
  },

  confirmDeposit: async (paymentIntentId: string) => {
    const response = await apiClient.post('/payments/deposit/confirm', {
      paymentIntentId
    });
    return response.data;
  },

  // Payment History
  getPaymentHistory: async () => {
    const response = await apiClient.get('/payments/history');
    return response.data;
  },

  // Refund
  requestRefund: async (data: RefundData) => {
    const response = await apiClient.post('/payments/refund', data);
    return response.data;
  },
};
