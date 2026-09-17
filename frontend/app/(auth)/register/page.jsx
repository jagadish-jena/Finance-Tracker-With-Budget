'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAccessToken } from '../../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      setAccessToken(data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.replace('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-brand-parchment p-4">
      <div className="w-full max-w-md rounded-2xl border border-brand-line bg-brand-paper p-6 shadow-[0_12px_0_rgba(23,33,33,0.06)] sm:p-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand-coral">Personal Finance</p>
        <h1 className="font-display text-4xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">Start tracking your finances with intention.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          />
          <input
            name="password"
            type="password"
            minLength="6"
            placeholder="Password (minimum 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-brand-line bg-brand-parchment px-3 py-2.5 outline-none transition focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/20"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-brand-coral px-4 py-2.5 font-bold text-white transition hover:bg-brand-coralDark disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-coral underline underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
