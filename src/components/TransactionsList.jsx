import React, { useState, useEffect, useMemo } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Trash2, Download, Zap, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate, CATEGORY_STYLES } from '../utils';

export default function TransactionsList() {
  const { transactions, role, deleteTransaction, addTransaction } = useFinanceStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [quickEntryInput, setQuickEntryInput] = useState('');
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleQuickEntry = (e) => {
    e.preventDefault();
    if(!quickEntryInput.trim()) return;
    
    let amount = 0; let category = 'Food'; let type = 'expense';
    const amountMatch = quickEntryInput.match(/\d+/);
    if (amountMatch) amount = parseInt(amountMatch[0], 10);
    
    const normalizedInput = quickEntryInput.toLowerCase();
    if (normalizedInput.includes('earned') || normalizedInput.includes('salary') || normalizedInput.includes('income')) { 
      type = 'income'; category = 'Salary'; 
    }
    
    if (amount > 0) {
      addTransaction({ date: new Date().toISOString().split('T')[0], amount, category, type, desc: quickEntryInput });
      setQuickEntryInput('');
    }
  };

  const categories = useMemo(() => [...new Set((transactions || []).map(t => t.category))], [transactions]);

  const filteredTransactions = useMemo(() => {
    return (transactions || []).filter(t => {
      const matchSearch = (t.desc || '').toLowerCase().includes(debouncedTerm.toLowerCase()) || (t.category || '').toLowerCase().includes(debouncedTerm.toLowerCase());
      const matchCat = filterCat === 'all' || t.category === filterCat;
      const matchType = filterType === 'all' || t.type === filterType;
      const matchStartDate = dateRange.start ? t.date >= dateRange.start : true;
      const matchEndDate = dateRange.end ? t.date <= dateRange.end : true;
      
      return matchSearch && matchCat && matchType && matchStartDate && matchEndDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); 
  }, [transactions, debouncedTerm, filterCat, filterType, dateRange]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE));
  
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const exportData = (format) => {
    if (filteredTransactions.length === 0) return alert("No data to export.");
    const content = format === 'csv' 
      ? ['Date,Description,Category,Type,Amount'].concat(filteredTransactions.map(t => `${t.date},${t.desc || t.category},${t.category},${t.type},${t.amount}`)).join('\n')
      : JSON.stringify(filteredTransactions, null, 2);
    
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `transactions_export.${format}`;
    anchor.click();
  };

  return (
    <div className="animate-fade-in">
      
      {role === 'admin' && (
        <form onSubmit={handleQuickEntry} className="mb-6 bg-white dark:bg-[#1c2128] p-4 rounded-xl border border-gray-200 dark:border-[#2d3748] shadow-sm flex items-center gap-3 transition-colors">
          <Zap className="text-[#22c55e]" size={20} />
          <input type="text" placeholder="Quick Entry: e.g., 'Spent 45 on Uber' or 'Earned 500'" className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400" value={quickEntryInput} onChange={(e) => setQuickEntryInput(e.target.value)} />
          <button type="submit" className="bg-[#22c55e] text-white dark:text-[#12161b] px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-[#1fa14f] transition-colors">Add Record</button>
        </form>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Search descriptions or categories..." 
            className="w-full sm:w-64 bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] text-gray-900 dark:text-gray-200 placeholder-gray-400 px-4 py-2 rounded-lg text-sm focus:border-[#22c55e] outline-none shadow-sm transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2 bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] rounded-lg px-3 py-1.5 shadow-sm transition-colors w-full sm:w-auto">
            <Filter size={14} className="text-gray-400 shrink-0" />
            <input type="date" className="bg-transparent text-gray-600 dark:text-gray-300 text-xs outline-none w-full" value={dateRange.start} onChange={(e) => { setDateRange({...dateRange, start: e.target.value}); setCurrentPage(1); }} />
            <span className="text-gray-400 text-xs">to</span>
            <input type="date" className="bg-transparent text-gray-600 dark:text-gray-300 text-xs outline-none w-full" value={dateRange.end} onChange={(e) => { setDateRange({...dateRange, end: e.target.value}); setCurrentPage(1); }} />
          </div>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
          <select value={filterCat} onChange={(e) => {setFilterCat(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-none bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-2 outline-none shadow-sm transition-colors">
            <option value="all">All categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}} className="flex-1 sm:flex-none bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-2 outline-none shadow-sm transition-colors">
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <div className="relative group flex-1 sm:flex-none">
            <button className="w-full flex items-center justify-center gap-2 bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-[#2d3748] shadow-sm transition-colors">
              <Download size={16} /> Export
            </button>
            <div className="absolute right-0 mt-2 w-full sm:w-32 bg-white dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button onClick={() => exportData('csv')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-t-lg transition-colors">CSV Format</button>
              <button onClick={() => exportData('json')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3748] rounded-b-lg transition-colors">JSON Format</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1c2128] rounded-xl border border-gray-200 dark:border-[#2d3748] overflow-x-auto shadow-sm transition-colors">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#2d3748] bg-gray-50 dark:bg-[#12161b] transition-colors">
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date ↓</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right uppercase tracking-wider">Amount</th>
              {role === 'admin' && <th className="p-4 w-12"></th>}
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length > 0 ? paginatedTransactions.map((t) => {
              const styles = CATEGORY_STYLES[t.category] || CATEGORY_STYLES.Default;
              const isIncome = t.type === 'income';
              return (
                <tr key={t.id} className="border-b border-gray-100 dark:border-[#2d3748] hover:bg-gray-50 dark:hover:bg-[#12161b]/50 transition group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-xs uppercase shrink-0" style={{ backgroundColor: styles.bg, color: styles.text }}>
                        {t.category ? t.category.substring(0, 2) : 'MI'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(t.date)}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-900 dark:text-white font-medium">{t.desc || t.category}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap" style={{ backgroundColor: styles.bg, color: styles.text }}>
                      {t.category}
                    </span>
                  </td>
                  <td className={`p-4 text-sm font-mono font-bold text-right whitespace-nowrap ${isIncome ? 'text-[#22c55e]' : 'text-[#ff5722]'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="p-4 text-right">
                      <button onClick={() => window.confirm('Delete this record?') && deleteTransaction(t.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              )
            }) : (
              <tr><td colSpan={role === 'admin' ? "5" : "4"} className="p-12 text-center text-gray-500 dark:text-gray-400 text-sm">No records found matching current criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} of {filteredTransactions.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1 rounded-md border border-gray-200 dark:border-[#2d3748] text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-mono px-2">
              {currentPage} / {totalPages}
            </span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1 rounded-md border border-gray-200 dark:border-[#2d3748] text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-[#2d3748] transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}