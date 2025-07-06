'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

interface TooltipPayload {
  dataKey: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const getMonthlyData = (): MonthlyData[] => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
        income: data.income,
        expenses: data.expenses,
        net: data.income - data.expenses
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Show last 6 months
  };

  const data = getMonthlyData();

  if (data.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No financial data available. Add some transactions to see your overview.
          </p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: TooltipPayload, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize font-medium">{entry.dataKey}:</span>
              <span className="font-bold">
                ₹{entry.value.toFixed(2)}
              </span>
            </div>
          ))}
          {payload[0] && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <span>Net:</span>
                <span className={`${
                  (payload.find((p: TooltipPayload) => p.dataKey === 'income')?.value || 0) - 
                  (payload.find((p: TooltipPayload) => p.dataKey === 'expenses')?.value || 0) >= 0 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{((payload.find((p: TooltipPayload) => p.dataKey === 'income')?.value || 0) - 
                    (payload.find((p: TooltipPayload) => p.dataKey === 'expenses')?.value || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Monthly Financial Overview
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Income vs Expenses over the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tickFormatter={(value) => `₹${value}`}
              stroke="#666"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar 
              dataKey="income" 
              name="Income"
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses"
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Avg Monthly Income</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              ₹{(data.reduce((sum, month) => sum + month.income, 0) / data.length).toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Avg Monthly Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-600">
              ₹{(data.reduce((sum, month) => sum + month.expenses, 0) / data.length).toFixed(0)}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-600">Avg Monthly Net</span>
            </div>
            <div className={`text-xl font-bold ${
              (data.reduce((sum, month) => sum + month.net, 0) / data.length) >= 0 
                ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{(data.reduce((sum, month) => sum + month.net, 0) / data.length).toFixed(0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
