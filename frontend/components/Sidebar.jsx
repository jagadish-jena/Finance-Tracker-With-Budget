"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const p = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-[#30BCCD]/40 bg-[#272661] p-3 text-white sm:w-56 sm:border-b-0 sm:border-r sm:p-4">
      <h2 className="mb-4 hidden text-2xl font-bold tracking-tight sm:mb-6 sm:block">
        Finance
      </h2>
      <nav className="flex gap-1 sm:flex-col">
        {[
          ["/dashboard", "Dashboard"],
          ["/transactions", "Transactions"],
          ["/budget", "Budget"],
        ].map(([href, label]) => (
          <Link
            className={`flex-1 rounded-md px-3 py-2.5 text-center text-sm font-medium sm:flex-none sm:text-left ${
              p === href
                ? "bg-[#30BCCD] text-[#272661] shadow-md shadow-black/20"
                : "text-cyan-100 hover:bg-[#30BCCD]/30 hover:text-white"
            }`}
            href={href}
            key={href}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
