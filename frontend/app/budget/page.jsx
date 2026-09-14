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

export default function Budget() {
  const r = useRouter();
  const [amount, setAmount] = useState(""),
    [saved, setSaved] = useState(0),
    [spent, setSpent] = useState(0),
    [msg, setMsg] = useState(""),
    [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1),
    [year, setYear] = useState(currentYear);

  const load = async () => {
    try {
      const [b, t] = await Promise.all([
        api(`/budget?month=${month}&year=${year}`),
        api(`/transactions?month=${month}&year=${year}`),
      ]);
      setAmount(b.amount || "");
      setSaved(b.amount || 0);
      setSpent(
        t.filter((x) => x.type === "expense").reduce((a, x) => a + x.amount, 0),
      );
      setError("");
      setMsg("");
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) r.push("/login");
    else load();
  }, [r, month, year]);
  const submit = async (e) => {
    e.preventDefault();
    try {
      const b = await api("/budget", {
        method: "POST",
        body: JSON.stringify({ amount: Number(amount), month, year }),
      });
      setSaved(b.amount);
      setMsg("Budget saved successfully.");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  const remaining = Math.max(saved - spent, 0);
  const percent = saved ? Math.min((spent / saved) * 100, 100) : 0;

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Budget
          </h1>
          <p className="mt-1 text-cyan-100">
            Set and check your budget for any month.
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
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      {msg && <p className="mb-3 text-sm text-emerald-600">{msg}</p>}
      <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
        <h3 className="text-lg font-semibold">
          {months[month - 1]} {year} Budget
        </h3>
        <form className="mt-4 grid max-w-2xl gap-3" onSubmit={submit}>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Monthly budget"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          />
          <button className="rounded-md bg-[#30BCCD] px-4 py-2.5 font-medium text-[#272661] transition hover:bg-[#55d4df]">
            Save Budget
          </button>
        </form>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">Budget</p>
          <h2 className="mt-2 text-2xl font-bold">
            ₹{Number(saved).toLocaleString()}
          </h2>
        </div>
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">Expenses</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">
            ₹{spent.toLocaleString()}
          </h2>
        </div>
        <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
          <p className="text-sm text-cyan-100">Remaining</p>
          <h2 className="mt-2 text-2xl font-bold text-emerald-600">
            ₹{remaining.toLocaleString()}
          </h2>
        </div>
      </div>
      <div className="mt-5 rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Budget Usage</h3>
          <b>{Math.round(percent)}%</b>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-[#30BCCD]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-cyan-100">
          ₹{spent.toLocaleString()} spent out of ₹
          {Number(saved).toLocaleString()}.
        </p>
      </div>
    </Shell>
  );
}
