import React, { useState, useEffect } from 'react';
import { useFinanceStore } from './store/useFinanceStore';
import DashboardOverview from './components/DashboardOverview';
import TransactionsList from './components/TransactionsList';
import Insights from './components/Insights';
import { LayoutDashboard, Sun, Moon } from 'lucide-react';

function App() {
  const { role, toggleRole, theme, toggleTheme, transactions } = useFinanceStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const txCount = (transactions || []).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#12161b] text-gray-900 dark:text-[#e2e8f0] font-sans transition-colors duration-300">
      
      <header className="border-b border-gray-200 dark:border-[#2d3748] bg-white dark:bg-[#12161b] px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-[#22c55e] text-white p-2 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Finia</h1>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1c2128] transition-colors" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Role:</span>
            <select 
              value={role} 
              onChange={toggleRole}
              className="bg-gray-50 dark:bg-[#1c2128] border border-gray-200 dark:border-[#2d3748] text-gray-700 dark:text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-[#22c55e]"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200 dark:border-[#2d3748] px-4 md:px-8 bg-white dark:bg-[#12161b] sticky top-[69px] z-40 transition-colors duration-300 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          <button onClick={() => setActiveTab('overview')} className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-[#22c55e] text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            Overview
          </button>
          <button onClick={() => setActiveTab('transactions')} className={`py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'transactions' ? 'border-[#22c55e] text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            Transactions <span className="bg-gray-100 dark:bg-[#1c2128] text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-xs">{txCount}</span>
          </button>
          <button onClick={() => setActiveTab('insights')} className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'insights' ? 'border-[#22c55e] text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            Insights
          </button>
        </div>
      </div>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'transactions' && <TransactionsList />}
        {activeTab === 'insights' && <Insights />}
      </main>
    </div>
  );
}

export default App;