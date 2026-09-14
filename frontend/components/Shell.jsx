import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Shell({ children }) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] flex-col sm:flex-row">
        <Sidebar />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
