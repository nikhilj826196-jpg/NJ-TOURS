import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import ScrollToHash from '../components/layout/ScrollToHash';

export default function MainLayout({ onOpenLogin, onOpenBooking }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <ScrollToHash />
      <Navbar onOpenLogin={onOpenLogin} onOpenBooking={onOpenBooking} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}
