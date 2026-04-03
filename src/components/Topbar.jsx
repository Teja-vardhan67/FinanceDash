import { useFinance } from '../context/FinanceContext'

function Topbar() {
  const { role, setRole, activePage, setActivePage } = useFinance()

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <span>💰</span> FinanceDash
        <span className={`role-badge ${role}`}>
          {role === 'admin' ? 'Admin' : 'Viewer'}
        </span>
      </div>

      <div className="topbar-nav">
        <button
          className={activePage === 'dashboard' ? 'active' : ''}
          onClick={() => setActivePage('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activePage === 'transactions' ? 'active' : ''}
          onClick={() => setActivePage('transactions')}
        >
          Transactions
        </button>
        <button
          className={activePage === 'insights' ? 'active' : ''}
          onClick={() => setActivePage('insights')}
        >
          Insights
        </button>
      </div>

      <select
        className="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="viewer">👁 Viewer</option>
        <option value="admin">🔧 Admin</option>
      </select>
    </div>
  )
}

export default Topbar