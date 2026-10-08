import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-6">
        <MapPinOff className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-black text-amber-400 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-3">Route Not Found</h2>
      <p className="text-slate-400 text-xs max-w-sm mb-8">
        The destination page you are looking for has been moved or does not exist on the NJ Tours network.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-6 py-3.5 rounded-xl shadow-lg flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home Page</span>
      </Link>
    </div>
  );
}
