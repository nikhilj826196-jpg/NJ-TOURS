import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-rose-500 mb-2">403</h1>
      <h2 className="text-2xl font-bold mb-3">Access Denied</h2>
      <p className="text-slate-400 text-xs max-w-sm mb-8">
        You do not have the required permissions or role authorization to view this control panel.
      </p>
      <Link
        to="/"
        className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-black px-6 py-3.5 rounded-xl border border-slate-700 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Safety</span>
      </Link>
    </div>
  );
}
