'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '../../components/Shell';
import { api } from '../../lib/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

export default function BudgetPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [savedBudget, setSavedBudget] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.replace('/login');
      return;
    }

    const loadBudget = async () => {
      try {
        const [budgetData, transactionData] = await Promise.all([
          api(`/budget?month=${month}&year=${year}`),
          api(`/transactions?month=${month}&year=${year}`)
        ]);

        setAmount(budgetData.amount || '');
        setSavedBudget(budgetData.amount || 0);
        setExpenses(
          transactionData
            .filter((transaction) => transaction.type === 'expense')
            .reduce((total, transaction) => total + transaction.amount, 0)
        );
        setMessage('');
        setError('');
      } catch (error) {
        setError(error.message);

        if (error.message.includes('Session expired')) {
          router.replace('/login');
        }
      }
    };

    loadBudget();
  }, [month, year, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const data = await api('/budget', {
        method: 'POST',
        body: JSON.stringify({
          amount: Number(amount),
          month,
          year
        })
      });

      setSavedBudget(data.amount);
      setMessage('Budget saved successfully.');
    } catch (error) {
      setError(error.message);
    }
  };

  const remaining = Math.max(savedBudget - expenses, 0);
  const usage = savedBudget
    ? Math.min((expenses / savedBudget) * 100, 100)
    : 0;

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Budget</h1>
          <p className="mt-2 text-slate-600">Set and check a budget for each month.</p>
        </div>

        <div className="flex gap-2">
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="rounded-lg border border-brand-line bg-brand-paper px-3 py-2 text-sm outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index + 1}>{name}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="rounded-lg border border-brand-line bg-brand-paper px-3 py-2 text-sm outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          >
            {YEARS.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-3 rounded-md bg-green-50 px-3 py-2 text-sm text-brand-sage">{message}</p>}

      <section className="rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <h2 className="font-display text-xl font-bold">{MONTHS[month - 1]} {year} Budget</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid max-w-2xl gap-3">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Monthly budget"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          />
          <button className="rounded-lg bg-brand-coral px-4 py-2.5 font-bold text-white transition hover:bg-brand-coralDark">
            Save Budget
          </button>
        </form>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Budget" value={savedBudget} />
        <SummaryCard label="Expenses" value={expenses} valueClass="text-brand-coral" />
        <SummaryCard label="Remaining" value={remaining} valueClass="text-brand-sage" />
      </div>

      <section className="mt-5 rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Budget Usage</h2>
          <span className="font-semibold">{Math.round(usage)}%</span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-parchment">
          <div
            className="h-full rounded-full bg-brand-saffron"
            style={{ width: `${usage}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          ₹{expenses.toLocaleString()} spent out of ₹{Number(savedBudget).toLocaleString()}.
        </p>
      </section>
    </Shell>
  );
}

function SummaryCard({ label, value, valueClass = '' }) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>
        ₹{Number(value).toLocaleString()}
      </p>
    </div>
  );
}
