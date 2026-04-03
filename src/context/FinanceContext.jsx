import { createContext, useContext, useState } from 'react'
import { transactions as initialData } from '../data'

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(initialData)
  const [role, setRole] = useState('viewer')
  const [activePage, setActivePage] = useState('dashboard')

  const addTransaction = (tx) => {
    const newTx = {
      ...tx,
      id: Date.now(),
      amount: Number(tx.amount)
    }
    setTransactions(prev => [...prev, newTx])
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const editTransaction = (id, updated) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updated, amount: Number(updated.amount) } : t)
    )
  }

  return (
    <FinanceContext.Provider value={{
      transactions,
      role, setRole,
      activePage, setActivePage,
      addTransaction,
      deleteTransaction,
      editTransaction
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  return useContext(FinanceContext)
}
