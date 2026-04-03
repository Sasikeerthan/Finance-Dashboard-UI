import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockData';

export const useFinanceStore = create(
  persist(
    (set) => ({
      role: 'admin', 
      theme: 'dark', 
      transactions: initialTransactions,
      
      toggleRole: () => set((state) => ({ 
        role: state.role === 'viewer' ? 'admin' : 'viewer' 
      })),

      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: Date.now() }, ...(state.transactions || [])]
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: (state.transactions || []).filter(t => t.id !== id)
      }))
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);