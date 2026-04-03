import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from '../utils';

const CHART_COLORS = ['#8b5cf6', '#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#f97316'];

export default function DashboardOverview() {
  const { transactions, theme } = useFinanceStore();

  const { totalIncome, totalExpense, balance, savingsRate } = useMemo(() => {
    const data = (transactions || []).reduce((acc, curr) => {
      if (curr.type === 'income') acc.totalIncome += curr.amount;
      if (curr.type === 'expense') acc.totalExpense += curr.amount;
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });
    
    data.balance = data.totalIncome - data.totalExpense;
    data.savingsRate = data.totalIncome > 0 ? Math.round((data.balance / data.totalIncome) * 100) : 0;
    
    return data;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expenses = (transactions || []).filter(t => t.type === 'expense');
    const grouped = expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {});
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return [...(transactions || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const gridColor = theme === 'dark' ? '#2d3748' : '#e5e7eb';
  const axisTextColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const tooltipBg = theme === 'dark' ? '#12161b' : '#ffffff';
  const tooltipText = theme === 'dark' ? '#ffffff' : '#111827';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#1c2128] rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider">Total Balance</p>
          <p className="text-3xl font-extrabold text-[#22c55e]">{formatCurrency(balance)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Net across all periods</p>
        </div>
        
        <div className="p-5 bg-white dark:bg-[#1c2128] rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider">Total Income</p>
          <p className="text-3xl font-extrabold text-[#22c55e]">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Aggregated earnings</p>
        </div>
        
        <div className="p-5 bg-white dark:bg-[#1c2128] rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm transition-colors">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider">Total Expenses</p>
          <p className="text-3xl font-extrabold text-[#ff5722]">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Aggregated spending</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#1c2128] rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wider">Savings Rate</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{savingsRate}%</p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-[#2d3748] rounded-full h-1.5 mt-4">
            <div className="bg-[#22c55e] h-1.5 rounded-full" style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="bg-white dark:bg-[#1c2128] p-6 rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm lg:col-span-2 flex flex-col transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Balance trend</h3>
            <span className="text-xs text-gray-400 dark:text-gray-500">Historical</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            {sortedTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedTransactions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} tick={{fill: axisTextColor}} tickFormatter={(tick) => tick.slice(5)} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{fill: axisTextColor}} tickFormatter={(tick) => `$${tick >= 1000 ? (tick/1000).toFixed(0)+'k' : tick}`} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText, borderRadius: '8px' }} formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm">Insufficient data for chart rendering.</div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#1c2128] p-6 rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm flex flex-col transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Spending breakdown</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
          <div className="flex-1 w-full min-h-0">
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={2} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText, borderRadius: '8px' }} formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">No expense data available.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}