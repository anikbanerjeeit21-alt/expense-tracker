export enum ExpenseType {
  DAILY_EXPENSE = 'DAILY_EXPENSE',
  INVESTMENT = 'INVESTMENT'
}

export interface Expense {
  id: string;
  userId: string;
  type: ExpenseType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSummary {
  totalDailyExpenses: number;
  totalInvestments: number;
  month: string;
  year: number;
}

export interface Category {
  name: string;
  icon: string;
}

export const DAILY_EXPENSE_CATEGORIES: Category[] = [
  { name: 'Food', icon: 'restaurant' },
  { name: 'Transport', icon: 'directions_car' },
  { name: 'Shopping', icon: 'shopping_cart' },
  { name: 'Entertainment', icon: 'movie' },
  { name: 'Bills', icon: 'receipt' },
  { name: 'Healthcare', icon: 'local_hospital' },
  { name: 'Education', icon: 'school' },
  { name: 'Other', icon: 'more_horiz' }
];

export const INVESTMENT_CATEGORIES: Category[] = [
  { name: 'Stocks', icon: 'trending_up' },
  { name: 'Mutual Funds', icon: 'account_balance' },
  { name: 'Real Estate', icon: 'home' },
  { name: 'Bonds', icon: 'description' },
  { name: 'Cryptocurrency', icon: 'currency_bitcoin' },
  { name: 'Fixed Deposit', icon: 'lock' },
  { name: 'Gold', icon: 'monetization_on' },
  { name: 'Other', icon: 'more_horiz' }
];
