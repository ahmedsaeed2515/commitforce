import apiClient from './client';

export const paymentApi = {
  createDepositIntent: async (amount: number, currency: string = 'usd') => {
    const response = await apiClient.post('/payments/deposit', {
      amount,
      currency
    });
    return response.data;
  },
};
