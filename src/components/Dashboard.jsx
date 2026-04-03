import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'
import { useFinance } from '../context/FinanceContext'

function Dashboard() {
  const { transactions } = useFinance()

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  
  const monthlyData = useMemo(() => {
    const monthMap = {}
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const label = monthNames[d.getMonth()]

      if (!monthMap[key]) {
        monthMap[key] = { month: label, income: 0, expenses: 0, sortKey: key }
      }
      if (t.type === 'income') monthMap[key].income += t.amount
      else monthMap[key].expenses += t.amount
    })

    return Object.values(monthMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [transactions])


  const categoryData = useMemo(() => {
    const catMap = {}
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount
      })
    return Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  
  const balanceOverTime = useMemo(() => {
    let running = 0
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date))
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthMap = {}

    sorted.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      running += t.type === 'income' ? t.amount : -t.amount

      monthMap[key] = { month: monthNames[d.getMonth()], balance: running, sortKey: key }
    })

    return Object.values(monthMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey))
  }, [transactions])

  const COLORS = ['#4f46e5', '#059669', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16']

  const txCount = transactions.length

  
  const fmt = (n) => '₹' + n.toLocaleString('en-IN')

  return (
    <div className="page-container">

      {/* summary cards */ }
      <div className="summary-cards">
        <div className="summary-card">
          <div className="label">Total Balance</div>
          <div className="value balance">{fmt(totalBalance)}</div>
          <div className="change">{txCount} transactions total</div>
        </div>
        <div className="summary-card">
          <div className="label">Total Income</div>
          <div className="value income">{fmt(totalIncome)}</div>
          <div className="change">from salary, freelance, etc.</div>
        </div>
        <div className="summary-card">
          <div className="label">Total Expenses</div>
          <div className="value expense">{fmt(totalExpenses)}</div>
          <div className="change">across {categoryData.length} categories</div>
        </div>
      </div>

      {/* balance over time */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <h3>Balance Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={balanceOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => fmt(val)} />
            <Area type="monotone" dataKey="balance" stroke="#4f46e5" fill="#eef2ff" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* charts row */}
      <div className="charts-row">
        {/* bar chart */}
        <div className="chart-card">
          <h3>Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1f5" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(val) => fmt(val)} />
              <Legend />
              <Bar dataKey="income" fill="#059669" radius={[3, 3, 0, 0]} />
              <Bar dataKey="expenses" fill="#dc2626" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* pie chart */}
        <div className="chart-card">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={40}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => fmt(val)} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard