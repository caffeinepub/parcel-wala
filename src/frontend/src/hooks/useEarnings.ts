import { useState } from 'react';
import { useLocalStorage } from 'react-use';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export function useEarnings() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('earnings-transactions', [
    {
      id: '1',
      description: 'Delivery: Mumbai → Delhi',
      amount: 450,
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
    },
    {
      id: '2',
      description: 'Delivery: Bangalore → Chennai',
      amount: 320,
      date: new Date(Date.now() - 172800000).toLocaleDateString(),
    },
  ]);

  const [withdrawals, setWithdrawals] = useLocalStorage<number>('earnings-withdrawals', 0);

  const totalEarned = (transactions || []).reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalEarned - (withdrawals || 0);

  const withdraw = async () => {
    setWithdrawals(totalEarned);
  };

  return {
    totalEarned,
    currentBalance,
    transactions: transactions || [],
    withdraw,
  };
}
