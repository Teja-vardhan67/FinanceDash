import { FinanceProvider, useFinance } from './context/FinanceContext'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import './App.css'

function AppContent() {
  const { activePage } = useFinance()

  return (
    <div style={{ backgroundColor: '#f1f3f9', minHeight: '100vh' }}>
      <Topbar />
      {activePage === 'dashboard' && <Dashboard />}
      {activePage === 'transactions' && <Transactions />}
      {activePage === 'insights' && <Insights />}
    </div>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}

export default App