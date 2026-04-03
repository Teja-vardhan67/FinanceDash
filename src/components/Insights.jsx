import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'

function Insights() {
  const { transactions } = useFinance()

  const analysis = useMemo(() => {
    if (transactions.length === 0) return null

    const expenses = transactions.filter(t => t.type === 'expense')
    const incomes = transactions.filter(t => t.type === 'income')

   
    const catTotals = {}
    expenses.forEach(t => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount
    })
    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1])
    const topCategory = sortedCats[0] || ['N/A', 0]
    const totalExpenseAmt = expenses.reduce((s, t) => s + t.amount, 0)
    const topCatPercent = totalExpenseAmt > 0 ? ((topCategory[1] / totalExpenseAmt) * 100).toFixed(1) : 0

  
    const biggestExpense = expenses.length > 0
      ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
      : null

   
    const biggestIncome = incomes.length > 0
      ? incomes.reduce((max, t) => t.amount > max.amount ? t : max, incomes[0])
      : null

   
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthlyMap = {}
    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      const label = monthNames[d.getMonth()] + ' ' + d.getFullYear()
      if (!monthlyMap[key]) monthlyMap[key] = { label, income: 0, expenses: 0, sortKey: key }
      if (t.type === 'income') monthlyMap[key].income += t.amount
      else monthlyMap[key].expenses += t.amount
    })
    const monthlyArr = Object.values(monthlyMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey))

    const monthComparisons = monthlyArr.map((m, i) => {
      if (i === 0) return { ...m, expenseChange: null, incomeChange: null }
      const prev = monthlyArr[i - 1]
      const expenseChange = prev.expenses > 0
        ? (((m.expenses - prev.expenses) / prev.expenses) * 100).toFixed(1)
        : null
      const incomeChange = prev.income > 0
        ? (((m.income - prev.income) / prev.income) * 100).toFixed(1)
        : null
      return { ...m, expenseChange, incomeChange }
    })

    
    const avgMonthlyExpense = monthlyArr.length > 0
      ? Math.round(totalExpenseAmt / monthlyArr.length)
      : 0

    
    const totalIncomeAmt = incomes.reduce((s, t) => s + t.amount, 0)
    const savingsRate = totalIncomeAmt > 0
      ? (((totalIncomeAmt - totalExpenseAmt) / totalIncomeAmt) * 100).toFixed(1)
      : 0

    
    const mostExpMonth = monthlyArr.length > 0
      ? monthlyArr.reduce((max, m) => m.expenses > max.expenses ? m : max, monthlyArr[0])
      : null

    
    const bottomCategory = sortedCats.length > 1
      ? sortedCats[sortedCats.length - 1]
      : null

    return {
      topCategory,
      topCatPercent,
      biggestExpense,
      biggestIncome,
      monthComparisons,
      avgMonthlyExpense,
      savingsRate,
      mostExpMonth,
      bottomCategory,
      totalExpenseAmt,
      totalIncomeAmt,
      sortedCats
    }
  }, [transactions])

  const fmt = (n) => '₹' + n.toLocaleString('en-IN')

  if (!analysis) {
    return (
      <div className="page-container">
        <div className="empty-state">No data to analyze yet.</div>
      </div>
    )
  }

  return (
    <div className="page-container">

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#1e1e2f' }}>
        Insights & Analysis
      </h2>

      {/* top metrics */}
      <div className="insights-grid">

        <div className="insight-card">
          <div className="insight-title">Highest Spending Category</div>
          <div className="insight-value">{analysis.topCategory[0]}</div>
          <div className="insight-desc">
            {fmt(analysis.topCategory[1])} spent — that's <span className="insight-highlight">{analysis.topCatPercent}%</span> of total expenses
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Savings Rate</div>
          <div className="insight-value" style={{ color: Number(analysis.savingsRate) > 30 ? '#059669' : '#f59e0b' }}>
            {analysis.savingsRate}%
          </div>
          <div className="insight-desc">
            You saved {fmt(analysis.totalIncomeAmt - analysis.totalExpenseAmt)} out of {fmt(analysis.totalIncomeAmt)} earned
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Largest Single Expense</div>
          <div className="insight-value" style={{ color: '#dc2626' }}>
            {analysis.biggestExpense ? fmt(analysis.biggestExpense.amount) : 'N/A'}
          </div>
          <div className="insight-desc">
            {analysis.biggestExpense
              ? `"${analysis.biggestExpense.description}" on ${analysis.biggestExpense.date}`
              : 'No expenses recorded'}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Avg Monthly Expense</div>
          <div className="insight-value">{fmt(analysis.avgMonthlyExpense)}</div>
          <div className="insight-desc">
            {analysis.mostExpMonth
              ? `${analysis.mostExpMonth.label} was your most expensive month (${fmt(analysis.mostExpMonth.expenses)})`
              : ''}
          </div>
        </div>

      </div>

      {/* spending breakdown */}
      <div className="chart-card" style={{ marginBottom: 16 }}>
        <h3>Spending Breakdown by Category</h3>
        <div style={{ marginTop: 12 }}>
          {analysis.sortedCats.map(([cat, amount]) => {
            const pct = ((amount / analysis.totalExpenseAmt) * 100).toFixed(1)
            return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: '#374151' }}>{cat}</span>
                  <span style={{ color: '#6b7280' }}>{fmt(amount)} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#f0f1f5', borderRadius: 3 }}>
                  <div style={{
                    height: 6,
                    width: `${pct}%`,
                    background: '#4f46e5',
                    borderRadius: 3,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* month over month table */}
      <div className="chart-card">
        <h3>Month-over-Month Comparison</h3>
        <table className="month-compare-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Expense Change</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {analysis.monthComparisons.map((m, i) => {
              const net = m.income - m.expenses
              return (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{m.label}</td>
                  <td style={{ color: '#059669' }}>{fmt(m.income)}</td>
                  <td style={{ color: '#dc2626' }}>{fmt(m.expenses)}</td>
                  <td>
                    {m.expenseChange !== null
                      ? <span className={Number(m.expenseChange) > 0 ? 'trend-up' : 'trend-down'}>
                          {Number(m.expenseChange) > 0 ? '↑' : '↓'} {Math.abs(m.expenseChange)}%
                        </span>
                      : <span style={{ color: '#9ca3af' }}>—</span>
                    }
                  </td>
                  <td style={{ fontWeight: 600, color: net >= 0 ? '#059669' : '#dc2626' }}>
                    {net >= 0 ? '+' : ''}{fmt(net)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Insights
