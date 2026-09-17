'use client';

import { useRouter } from 'next/navigation';
import { logout } from '../lib/api';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="border-b border-brand-inkSoft bg-brand-ink text-brand-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-lg font-bold tracking-tight">Personal Finance Tracker</h1>
        <button
          onClick={handleLogout}
          className="rounded-md bg-brand-coral px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-coralDark"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
