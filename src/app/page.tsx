'use client';

import { useState, useEffect } from 'react';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyExpensesChart } from '@/components/MonthlyExpensesChart';
import { FinancialSummary } from '@/components/FinancialSummary';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Transaction, TransactionFormData } from '@/types';
import { Plus } from 'lucide-react';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to add transaction');
      
      await fetchTransactions();
      setIsAddDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  const handleEditTransaction = async (id: string, data: TransactionFormData) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update transaction');
      
      await fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete transaction');
      
      await fetchTransactions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Personal Finance Visualizer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take control of your finances with our intuitive tracking and visualization tools
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8 mx-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              <p className="text-gray-600 mt-1">Manage your transactions and view insights</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-0 bg-white border border-gray-200">
              <VisuallyHidden>
                <DialogTitle>Add New Transaction</DialogTitle>
              </VisuallyHidden>
              <div className="p-6 bg-white">
                <TransactionForm
                  onSubmit={handleAddTransaction}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="mb-8">
          <FinancialSummary transactions={transactions} />
        </div>

        {/* Charts and Transaction List */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
          <div className="xl:col-span-2 space-y-8">
            <MonthlyExpensesChart transactions={transactions} />
          </div>
          <div className="xl:col-span-1">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
