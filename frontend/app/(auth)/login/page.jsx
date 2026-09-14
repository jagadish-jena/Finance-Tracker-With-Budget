"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";

export default function Login() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const d = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", d.token);
      localStorage.setItem("user", JSON.stringify(d.user));
      r.push("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#272661] p-4">
      <div className="w-full max-w-md rounded-lg border border-[#30BCCD]/50 bg-[#30BCCD] p-6 text-[#272661] shadow-2xl shadow-black/30 sm:p-8">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-cyan-950">Personal Finance Tracker</p>
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <input
            className="rounded-md border border-white/30 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#272661] focus:ring-2 focus:ring-[#272661]/20"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="rounded-md border border-white/30 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#272661] focus:ring-2 focus:ring-[#272661]/20"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            className="rounded-md bg-[#272661] px-4 py-2.5 font-medium text-white hover:bg-[#1d1d4b] disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-5 text-sm text-cyan-950">
          Don't have an account?{" "}
          <Link
            className="font-medium text-[#272661] underline"
            href="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
