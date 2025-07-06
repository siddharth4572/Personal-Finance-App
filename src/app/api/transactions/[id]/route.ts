import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;
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

    const result = await db
      .collection('transactions')
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            amount: parseFloat(amount),
            date: new Date(date),
            description,
            type,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction updated successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    const client = await clientPromise;
    const db = client.db('personal-finance');

    const result = await db
      .collection('transactions')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
