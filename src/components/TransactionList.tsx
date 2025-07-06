'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { TransactionForm } from './TransactionForm';
import { Transaction, TransactionFormData } from '@/types';
import { Edit, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (id: string, data: TransactionFormData) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (data: TransactionFormData) => {
    if (editingTransaction?._id) {
      onEdit(editingTransaction._id.toString(), data);
      setEditingTransaction(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
    
    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No transactions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Recent Transactions</h2>
      {transactions.map((transaction) => (
        <Card key={transaction._id?.toString()} className="w-full">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{transaction.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingTransaction(transaction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px] p-0 bg-white border border-gray-200">
                    <VisuallyHidden>
                      <DialogTitle>Edit Transaction</DialogTitle>
                    </VisuallyHidden>
                    <div className="p-6 bg-white">
                      {editingTransaction && (
                        <TransactionForm
                          initialData={editingTransaction}
                          onSubmit={handleEdit}
                          onCancel={() => setEditingTransaction(null)}
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => transaction._id && onDelete(transaction._id.toString())}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
