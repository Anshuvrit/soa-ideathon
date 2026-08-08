import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[80vh] max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-brand-100 bg-white py-6 text-center text-sm text-gray-500">
        SOA Ideathon TeamUp & Prep Hub — unofficial team-formation tool for SOA students preparing for SIH.
      </footer>
    </>
  );
}
