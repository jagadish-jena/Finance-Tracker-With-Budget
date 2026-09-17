import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-brand-parchment text-brand-ink">
      <Navbar />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col sm:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
