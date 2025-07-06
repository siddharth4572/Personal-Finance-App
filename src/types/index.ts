import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId | string;
  amount: number;
  date: Date;
  description: string;
  category?: string;
  type: 'income' | 'expense';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionFormData {
  amount: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}
