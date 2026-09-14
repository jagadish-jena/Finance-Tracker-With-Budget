"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "../../components/Shell";
import { api } from "../../lib/api";

const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Other",
];
const expenseCategories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];
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

const emptyForm = () => ({
  type: "expense",
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toISOString().slice(0, 10),
});

export default function Transactions() {
  const r = useRouter();
  const [tx, setTx] = useState([]),
    [editing, setEditing] = useState(null),
    [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1),
    [year, setYear] = useState(currentYear);
  const [form, setForm] = useState(emptyForm());

  const load = () =>
    api(`/transactions?month=${month}&year=${year}`)
      .then(setTx)
      .catch((e) => setError(e.message));
  useEffect(() => {
    if (!localStorage.getItem("token")) r.push("/login");
    else load();
  }, [r, month, year]);

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setForm({ ...form, type, category: type === "income" ? "Salary" : "Food" });
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify({ ...form, amount: Number(form.amount) });
      if (editing)
        await api("/transactions/" + editing, { method: "PUT", body });
      else await api("/transactions", { method: "POST", body });
      setEditing(null);
      setForm(emptyForm());
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  const edit = (x) => {
    setEditing(x._id);
    setForm({
      ...x,
      amount: String(x.amount),
      date: new Date(x.date).toISOString().slice(0, 10),
    });
  };
  const del = async (id) => {
    if (confirm("Delete this transaction?")) {
      await api("/transactions/" + id, { method: "DELETE" });
      load();
    }
  };
  const categories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <Shell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Transactions
          </h1>
          <p className="mt-1 text-cyan-100">
            Showing transactions for the selected month.
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

      <div className="rounded-lg border border-[#30BCCD]/40 bg-[#272661] p-5 text-white shadow-lg shadow-black/20">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">
            {editing ? "Edit" : "Add"} Transaction
          </h3>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(emptyForm());
              }}
              className="rounded-md border border-white/30 px-3 py-2 text-sm hover:bg-[#30BCCD]/30"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <form className="mt-4 grid max-w-2xl gap-3" onSubmit={submit}>
          <select
            value={form.type}
            onChange={handleTypeChange}
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#30BCCD] focus:ring-2 focus:ring-[#30BCCD]/20"
          />
          <button className="rounded-md bg-[#30BCCD] px-4 py-2.5 font-medium text-[#272661] transition hover:bg-[#55d4df]">
            {editing ? "Update" : "Add Transaction"}
          </button>
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-[#30BCCD]/40 bg-[#272661] text-white shadow-lg shadow-black/20">
        <div className="p-5 pb-3">
          <h3 className="font-semibold">
            {months[month - 1]} {year} Transactions
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-y border-white/15 bg-black/20 text-cyan-100">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/15">
              {tx.map((x) => (
                <tr key={x._id} className="hover:bg-[#30BCCD]/20">
                  <td className="px-5 py-3">
                    {new Date(x.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 capitalize">{x.type}</td>
                  <td className="px-5 py-3">{x.category}</td>
                  <td className="px-5 py-3">{x.description || "—"}</td>
                  <td
                    className={`px-5 py-3 font-medium ${x.type === "income" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {x.type === "income" ? "+" : "-"} ₹
                    {x.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => edit(x)}
                      className="mr-2 rounded border border-slate-300 px-2.5 py-1.5 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => del(x._id)}
                      className="rounded border border-red-200 px-2.5 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!tx.length && (
            <p className="p-5 text-sm text-cyan-100">
            No transactions for this month.
          </p>
        )}
      </div>
    </Shell>
  );
}
