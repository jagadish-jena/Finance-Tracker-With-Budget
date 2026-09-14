"use client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const r = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    r.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#30BCCD]/40 bg-[#272661] px-4 text-white shadow-lg shadow-black/20 sm:px-6">
      <b className="text-base tracking-tight sm:text-lg">Personal Finance Tracker</b>
      <button
        onClick={logout}
        className="rounded-md bg-[#30BCCD] px-4 py-2 text-sm font-medium text-[#272661] transition hover:bg-[#55d4df]"
      >
        Logout
      </button>
    </header>
  );
}
