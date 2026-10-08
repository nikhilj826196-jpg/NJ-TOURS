import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function PasswordStrength({ password }) {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-500';

  if (score === 2 || score === 3) {
    label = 'Medium';
    color = 'bg-amber-500';
    textColor = 'text-amber-500';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-500';
  }

  return (
    <div className="space-y-1 mt-1.5 text-left">
      <div className="flex items-center justify-between text-[11px] font-bold">
        <span className="text-slate-500">Password Strength:</span>
        <span className={textColor}>{label}</span>
      </div>

      <div className="flex items-center gap-1.5 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-300 ${score >= 1 ? color : 'bg-transparent'} w-1/4`} />
        <div className={`h-full transition-all duration-300 ${score >= 2 ? color : 'bg-transparent'} w-1/4`} />
        <div className={`h-full transition-all duration-300 ${score >= 3 ? color : 'bg-transparent'} w-1/4`} />
        <div className={`h-full transition-all duration-300 ${score >= 4 ? color : 'bg-transparent'} w-1/4`} />
      </div>
    </div>
  );
}
