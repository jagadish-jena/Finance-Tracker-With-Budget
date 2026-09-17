'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { api } from '../../lib/api';

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

const emptyForm = () => ({
  type: 'expense',
  amount: '',
  category: 'Food',
  description: '',
  date: new Date().toISOString().slice(0, 10)
});

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [error, setError] = useState('');

  const loadTransactions = async () => {
    try {
      const data = await api(`/transactions?month=${month}&year=${year}`);
      setTransactions(data);
      setError('');
    } catch (error) {
      setError(error.message);
      if (error.message.includes('Session expired')) router.replace('/login');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.replace('/login');
      return;
    }

    loadTransactions();
  }, [month, year, router]);

  const handleTypeChange = (event) => {
    const type = event.target.value;
    setForm({
      ...form,
      type,
      category: type === 'income' ? 'Salary' : 'Food'
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const body = JSON.stringify({
        ...form,
        amount: Number(form.amount)
      });

      if (editingId) {
        await api(`/transactions/${editingId}`, { method: 'PUT', body });
      } else {
        await api('/transactions', { method: 'POST', body });
      }

      setEditingId(null);
      setForm(emptyForm());
      await loadTransactions();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);
    setForm({
      type: transaction.type,
      amount: String(transaction.amount),
      category: transaction.category,
      description: transaction.description || '',
      date: new Date(transaction.date).toISOString().slice(0, 10)
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;

    try {
      await api(`/transactions/${id}`, { method: 'DELETE' });
      await loadTransactions();
    } catch (error) {
      setError(error.message);
    }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Transactions</h1>
          <p className="mt-2 text-slate-600">Add and manage transactions month by month.</p>
        </div>

        <div className="flex gap-2">
          <select value={month} onChange={(event) => setMonth(Number(event.target.value))} className="rounded-lg border border-brand-line bg-brand-paper px-3 py-2 text-sm outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20">
            {MONTHS.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
          </select>
          <select value={year} onChange={(event) => setYear(Number(event.target.value))} className="rounded-lg border border-brand-line bg-brand-paper px-3 py-2 text-sm outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20">
            {YEARS.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </div>
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <section className="rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h2>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm()); }} className="rounded-lg border border-brand-line px-3 py-2 text-sm transition hover:bg-brand-parchment">Cancel</button>}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid max-w-2xl gap-3">
          <select value={form.type} onChange={handleTypeChange} className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20" />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20">
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20" />
          <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20" />
          <button className="rounded-lg bg-brand-coral px-4 py-2.5 font-bold text-white transition hover:bg-brand-coralDark">{editingId ? 'Update Transaction' : 'Add Transaction'}</button>
        </form>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-brand-line bg-brand-paper shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <div className="p-5 pb-3">
          <h2 className="font-display text-xl font-bold">{MONTHS[month - 1]} {year} Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-y border-brand-line bg-brand-parchment text-slate-600">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-brand-parchment">
                  <td className="px-5 py-3">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 capitalize">{transaction.type}</td>
                  <td className="px-5 py-3">{transaction.category}</td>
                  <td className="px-5 py-3">{transaction.description || '—'}</td>
                  <td className={`px-5 py-3 font-bold ${transaction.type === 'income' ? 'text-brand-sage' : 'text-brand-coral'}`}>
                    {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <button onClick={() => handleEdit(transaction)} className="mr-2 rounded border border-brand-line px-2.5 py-1.5 transition hover:bg-brand-parchment">Edit</button>
                    <button onClick={() => handleDelete(transaction._id)} className="rounded border border-red-200 px-2.5 py-1.5 text-red-600 hover:bg-red-50">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!transactions.length && <p className="p-5 text-sm text-slate-500">No transactions for this month.</p>}
      </section>
    </Shell>
  );
}
