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

const getTotal = (transactions, type) => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0);
};

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(CURRENT_YEAR);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      router.replace('/login');
      return;
    }

    const loadDashboard = async () => {
      try {
        const [transactionData, budgetData] = await Promise.all([
          api(`/transactions?month=${month}&year=${year}`),
          api(`/budget?month=${month}&year=${year}`)
        ]);

        setTransactions(transactionData);
        setBudget(budgetData.amount || 0);
        setError('');
      } catch (error) {
        setError(error.message);

        if (error.message.includes('Session expired')) {
          router.replace('/login');
        }
      }
    };

    loadDashboard();
  }, [month, year, router]);

  const income = getTotal(transactions, 'income');
  const expenses = getTotal(transactions, 'expense');
  const balance = income - expenses;
  const remaining = Math.max(budget - expenses, 0);
  const usage = budget ? Math.min((expenses / budget) * 100, 100) : 0;

  return (
    <Shell>
      <PageHeader
        title="Dashboard"
        description="View your finances month by month."
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />

      {error && <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Income" value={income} valueClass="text-brand-sage" />
        <SummaryCard label="Expenses" value={expenses} valueClass="text-brand-coral" />
        <SummaryCard label="Balance" value={balance} />
      </div>

      <section className="mt-5 rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{MONTHS[month - 1]} {year} Budget</h2>
          <span className="font-bold text-brand-coral">₹{budget.toLocaleString()}</span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-parchment">
          <div
            className="h-full rounded-full bg-brand-saffron"
            style={{ width: `${usage}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          ₹{expenses.toLocaleString()} spent · ₹{remaining.toLocaleString()} remaining
        </p>

        {!budget && (
          <p className="mt-2 text-sm text-slate-500">
            No budget set for this month. Go to Budget to add one.
          </p>
        )}
      </section>

      <section className="mt-5 rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
        <h2 className="font-display text-xl font-bold">Recent Transactions</h2>

        <div className="mt-3 divide-y divide-slate-100">
          {transactions.slice(0, 8).map((transaction) => (
            <div
              key={transaction._id}
              className="flex items-center justify-between gap-4 py-3 text-sm"
            >
              <span className="truncate">
                {transaction.category}
                {transaction.description && ` — ${transaction.description}`}
              </span>
              <span
                className={
                  transaction.type === 'income'
                    ? 'shrink-0 font-bold text-brand-sage'
                    : 'shrink-0 font-bold text-brand-coral'
                }
              >
                {transaction.type === 'income' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {!transactions.length && (
          <p className="mt-3 text-sm text-slate-500">No transactions for this month.</p>
        )}
      </section>
    </Shell>
  );
}

function PageHeader({ title, description, month, year, setMonth, setYear }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-2 text-slate-600">{description}</p>
      </div>

      <MonthSelector
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
      />
    </div>
  );
}

function MonthSelector({ month, year, setMonth, setYear }) {
  return (
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
  );
}

function SummaryCard({ label, value, valueClass = '' }) {
  return (
    <div className="rounded-xl border border-brand-line bg-brand-paper p-5 shadow-[0_8px_0_rgba(23,33,33,0.04)]">
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueClass}`}>
        ₹{value.toLocaleString()}
      </p>
    </div>
  );
}
