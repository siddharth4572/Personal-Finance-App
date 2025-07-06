import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import { Transaction } from '@/types';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personal-finance');
    const transactions = await db
      .collection('transactions')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, date, description, type } = body;

    if (!amount || !date || !description || !type) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('personal-finance');
    
    const transaction: Omit<Transaction, '_id'> = {
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection('transactions')
      .insertOne(transaction);

    return NextResponse.json(
      { _id: result.insertedId, ...transaction },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
