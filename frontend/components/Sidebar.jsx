'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/budget', label: 'Budget' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-brand-line bg-brand-paper sm:w-56 sm:border-b-0 sm:border-r">
      <div className="p-4">
        <h2 className="mb-4 font-display text-2xl font-bold tracking-tight">Finance</h2>
        <nav className="flex gap-1 sm:flex-col">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 rounded-md px-3 py-2.5 text-center text-sm font-medium sm:flex-none sm:text-left ${
                  active
                    ? 'bg-brand-ink text-brand-paper shadow-sm'
                    : 'text-slate-600 hover:bg-brand-parchment hover:text-brand-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
