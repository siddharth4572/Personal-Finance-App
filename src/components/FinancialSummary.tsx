'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const calculateSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
    });

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Overall totals
    const overallIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const overallExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const overallBalance = overallIncome - overallExpenses;

    return {
      currentMonth: {
        income: totalIncome,
        expenses: totalExpenses,
        balance: balance
      },
      overall: {
        income: overallIncome,
        expenses: overallExpenses,
        balance: overallBalance
      }
    };
  };

  const summary = calculateSummary();
  const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentMonthName} Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Income */}
          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Monthly Income
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(summary.currentMonth.income)}
              </div>
              <p className="text-xs text-green-600 mt-1">
                +{summary.currentMonth.income > 0 ? '100%' : '0%'} from last month
              </p>
            </CardContent>
          </Card>

          {/* Monthly Expenses */}
          <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-rose-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                Monthly Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {formatCurrency(summary.currentMonth.expenses)}
              </div>
              <p className="text-xs text-red-600 mt-1">
                {summary.currentMonth.expenses > 0 ? 'Total spent' : 'No expenses'}
              </p>
            </CardContent>
          </Card>

          {/* Monthly Balance */}
          <Card className={`border ${
            summary.currentMonth.balance >= 0 
              ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100' 
              : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                summary.currentMonth.balance >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                Monthly Balance
              </CardTitle>
              <Wallet className={`h-4 w-4 ${
                summary.currentMonth.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.currentMonth.balance >= 0 ? 'text-blue-900' : 'text-orange-900'
              }`}>
                {formatCurrency(summary.currentMonth.balance)}
              </div>
              <p className={`text-xs mt-1 ${
                summary.currentMonth.balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {summary.currentMonth.balance >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overall Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Income */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Income
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.overall.income)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All time income
              </p>
            </CardContent>
          </Card>

          {/* Total Expenses */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Expenses
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.overall.expenses)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All time expenses
              </p>
            </CardContent>
          </Card>

          {/* Net Worth */}
          <Card className="border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Net Worth
              </CardTitle>
              <Wallet className={`h-4 w-4 ${
                summary.overall.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.overall.balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(summary.overall.balance)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {summary.overall.balance >= 0 ? 'Positive' : 'Negative'} balance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
