import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

function Transactions() {
  const { transactions, addTransaction, deleteTransaction, editTransaction, role } = useFinance()

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    description: '', amount: '', type: 'expense', category: '', date: ''
  })

  
  const categories = [...new Set(transactions.map(t => t.category))].sort()

  
  const filtered = transactions
    .filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'all' || t.type === filterType
      const matchCat = filterCategory === 'all' || t.category === filterCategory
      return matchSearch && matchType && matchCat
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'amount') return b.amount - a.amount
      return 0
    })

  const openAddForm = () => {
    setEditingId(null)
    setFormData({ description: '', amount: '', type: 'expense', category: '', date: '' })
    setShowForm(true)
  }

  const openEditForm = (tx) => {
    setEditingId(tx.id)
    setFormData({
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      date: tx.date
    })
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      alert('Please fill all fields')
      return
    }

    if (editingId) {
      editTransaction(editingId, formData)
    } else {
      addTransaction(formData)
    }

    setShowForm(false)
    setEditingId(null)
    setFormData({ description: '', amount: '', type: 'expense', category: '', date: '' })
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  const fmt = (n) => '₹' + n.toLocaleString('en-IN')

  return (
    <div className="page-container">

      {/* controls */}
      <div className="tx-controls">
        <input
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
        </select>

        {role === 'admin' && (
          <button className="btn-primary" onClick={openAddForm} style={{ marginLeft: 'auto' }}>
            + Add Transaction
          </button>
        )}
      </div>

      {/* results count */}
      <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
        Showing {filtered.length} of {transactions.length} transactions
      </p>

      {/* table */}
      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={role === 'admin' ? 6 : 5} className="empty-state">
                  No transactions found. {role === 'admin' ? 'Try adding one!' : 'Try adjusting your filters.'}
                </td>
              </tr>
            )}
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ color: '#6b7280', fontSize: 12 }}>{t.date}</td>
                <td>{t.description}</td>
                <td style={{ color: '#6b7280' }}>{t.category}</td>
                <td>
                  <span className={`type-badge ${t.type}`}>{t.type}</span>
                </td>
                <td className={t.type === 'income' ? 'amount-income' : 'amount-expense'}>
                  {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                </td>
                {role === 'admin' && (
                  <td>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button className="btn-secondary" onClick={() => openEditForm(t)}>Edit</button>
                      <button className="btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>

            <div className="form-group">
              <label>Description</label>
              <input
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Groceries"
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                placeholder="e.g. 2500"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Food, Rent, Salary"
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions