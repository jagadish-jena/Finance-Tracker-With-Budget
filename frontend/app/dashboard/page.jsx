"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "../../components/Shell";
import { api } from "../../lib/api";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function Dashboard() {
  const r = useRouter();
  const [tx, setTx] = useState([]);
  const [budget, setBudget] = useState(0);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  const load = async () => {
    try {
      const [t, b] = await Promise.all([
        api(`/transactions?month=${month}&year=${year}`),
        api(`/budget?month=${month}&year=${year}`),
      ]);
      setTx(t);
      setBudget(b.amount || 0);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) r.push("/login");
    else load();
  }, [r, month, year]);

  const income = tx
    .filter((x) => x.type === "income")
    .reduce((a, x) => a + x.amount, 0);
  const expense = tx
    .filter((x) => x.type === "expense")
    .reduce((a, x) => a + x.amount, 0);
  const balance = income - expense;
  const percent = budget ? Math.min((expense / budget) * 100, 100) : 0;

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-cyan-100">
            View your finances month by month.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">
            {months[month - 1]} {year} Income
          </p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{income.toLocaleString()}
          </h2>
        </div>
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">
            {months[month - 1]} {year} Expenses
          </p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            ₹{expense.toLocaleString()}
          </h2>
        </div>
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">Monthly Balance</p>
          <h2 className="mt-2 text-2xl font-bold">
            ₹{balance.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">
            {months[month - 1]} {year} Budget
          </h3>
          <b>₹{budget.toLocaleString()}</b>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-[#30BCCD] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-cyan-100">
          ₹{expense.toLocaleString()} spent · ₹
          {Math.max(budget - expense, 0).toLocaleString()} remaining
        </p>
        {!budget && (
          <p className="mt-2 text-sm text-cyan-100">
            No budget set for this month. Go to Budget to add one.
          </p>
        )}
      </div>

      <div className="mt-5 rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
        <h3 className="font-semibold">
          {months[month - 1]} {year} Transactions
        </h3>
        <div className="mt-3 divide-y divide-white/15">
          {tx.slice(0, 8).map((x) => (
            <div
              className="flex items-center justify-between gap-4 py-3 text-sm"
              key={x._id}
            >
              <span className="truncate">
                {x.category}
                {x.description && ` — ${x.description}`}
              </span>
              <b
                className={
                  x.type === "income"
                    ? "shrink-0 text-emerald-600"
                    : "shrink-0 text-red-600"
                }
              >
                {x.type === "income" ? "+" : "-"} ₹{x.amount.toLocaleString()}
              </b>
            </div>
          ))}
        </div>
        {!tx.length && (
          <p className="mt-3 text-sm text-cyan-100">
            No transactions for this month.
          </p>
        )}
      </div>
    </Shell>
  );
}
