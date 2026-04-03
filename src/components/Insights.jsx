import React, { useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency, CATEGORY_STYLES } from '../utils';

export default function Insights() {
  const { transactions, theme } = useFinanceStore();

  const { topCategory, bestMonth, avgSpend, monthlyChartData, categoryChartData } = useMemo(() => {
    const tx = transactions || [];
    if (!tx.length) {
      return { 
        topCategory: { name: 'N/A', amount: 0, percentage: 0 },
        bestMonth: { name: 'N/A', saved: 0, income: 0 },
        avgSpend: { amount: 0, avgIncome: 0, ratio: 0 },
        monthlyChartData: [],
        categoryChartData: []
      };
    }

    const monthlyData = {};
    const categoryTotals = {};
    let totalExpenseAmount = 0;

    tx.forEach(t => {
      let monthLabel = 'Unknown';
      if (t.date) {
        try { monthLabel = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' }); } 
        catch (e) { monthLabel = 'Err'; }
      }

      if (!monthlyData[monthLabel]) monthlyData[monthLabel] = { month: monthLabel, income: 0, expenses: 0, rawDate: t.date };

      const val = Number(t.amount) || 0;
      if (t.type === 'income') {
        monthlyData[monthLabel].income += val;
      } else {
        monthlyData[monthLabel].expenses += val;
        const catName = t.category || 'Other';
        categoryTotals[catName] = (categoryTotals[catName] || 0) + val;
        totalExpenseAmount += val;
      }
    });

    const categoryKeys = Object.keys(categoryTotals);
    const topCatName = categoryKeys.length > 0 ? categoryKeys.reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) : 'None';
    const topCatValue = categoryTotals[topCatName] || 0;

    const topCategory = {
      name: topCatName,
      amount: topCatValue,
      percentage: totalExpenseAmount > 0 ? Math.round((topCatValue / totalExpenseAmount) * 100) : 0
    };

    const monthKeys = Object.keys(monthlyData);
    let bestMonthName = 'None';
    if (monthKeys.length > 0) {
       bestMonthName = monthKeys.reduce((a, b) => (monthlyData[a].income - monthlyData[a].expenses) > (monthlyData[b].income - monthlyData[b].expenses) ? a : b);
    }

    const bestMonth = {
      name: bestMonthName,
      saved: monthlyData[bestMonthName] ? (monthlyData[bestMonthName].income - monthlyData[bestMonthName].expenses) : 0,
      income: monthlyData[bestMonthName] ? monthlyData[bestMonthName].income : 0
    };

    const countMonths = monthKeys.length || 1;
    const avgInc = monthKeys.reduce((sum, m) => sum + monthlyData[m].income, 0) / countMonths;
    const avgExp = totalExpenseAmount / countMonths;

    const avgSpend = {
      amount: avgExp,
      avgIncome: avgInc,
      ratio: avgInc > 0 ? Math.round((avgExp / avgInc) * 100) : 0
    };

    const monthlyChartData = Object.values(monthlyData).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    const categoryChartData = Object.keys(categoryTotals)
      .map(key => ({ name: key, value: categoryTotals[key] }))
      .sort((a, b) => b.value - a.value);

    return { topCategory, bestMonth, avgSpend, monthlyChartData, categoryChartData };
  }, [transactions]);

  const gridColor = theme === 'dark' ? '#2d3748' : '#e5e7eb';
  const axisTextColor = theme === 'dark' ? '#9CA3AF' : '#6b7280';
  const tooltipBg = theme === 'dark' ? '#12161b' : '#ffffff';
  const tooltipText = theme === 'dark' ? '#ffffff' : '#111827';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] p-5 rounded-xl shadow-sm transition-colors">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-4">Top Spending Category</p>
          <p className="text-2xl font-bold text-[#7F77DD] mb-1">{topCategory.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatCurrency(topCategory.amount)} total · {topCategory.percentage}% of expenses</p>
        </div>
        
        <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] p-5 rounded-xl shadow-sm transition-colors">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-4">Best Savings Month</p>
          <p className="text-2xl font-bold text-[#1D9E75] mb-1">{bestMonth.name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Saved {formatCurrency(bestMonth.saved)} · income of {formatCurrency(bestMonth.income)}</p>
        </div>
        
        <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] p-5 rounded-xl shadow-sm transition-colors">
          <p className="text-[10px] text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-4">Avg Monthly Spend</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{formatCurrency(avgSpend.amount)}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">vs {formatCurrency(avgSpend.avgIncome)} avg income · {avgSpend.ratio}% exp. ratio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] p-6 rounded-xl flex flex-col shadow-sm transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Monthly income vs expenses</h3>
          <div className="flex gap-4 mb-4">
            <span className="text-xs flex items-center gap-1.5 text-gray-500 dark:text-gray-400"><span className="w-2.5 h-2.5 bg-[#639922] rounded-sm"></span>Income</span>
            <span className="text-xs flex items-center gap-1.5 text-gray-500 dark:text-gray-400"><span className="w-2.5 h-2.5 bg-[#D85A30] rounded-sm"></span>Expenses</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: axisTextColor, fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: axisTextColor, fontSize: 11}} tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                  <Tooltip cursor={{fill: gridColor, opacity: 0.4}} contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText, borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="income" fill="#639922" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="expenses" fill="#D85A30" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm">No data available to display.</div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] p-6 rounded-xl flex flex-col shadow-sm transition-colors">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Top spending categories</h3>
          <div className="flex-1 w-full min-h-0">
            {categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: axisTextColor, fontSize: 11}} tickFormatter={(val) => `$${val >= 1000 ? (val/1000).toFixed(0)+'k' : val}`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisTextColor, fontSize: 11}} />
                  <Tooltip cursor={{fill: gridColor, opacity: 0.4}} contentStyle={{ backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText, borderRadius: '8px' }} formatter={(val) => formatCurrency(val)} />
                  <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(CATEGORY_STYLES[entry.name] || CATEGORY_STYLES.Default).text} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400 text-sm">No data available to display.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}