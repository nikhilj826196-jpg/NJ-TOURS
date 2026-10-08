import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function TermsCheckbox({ checked, onChange, error }) {
  return (
    <div className="space-y-1 text-left">
      <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer mt-0.5"
        />
        <span>
          I accept the{' '}
          <a href="#terms" onClick={(e) => e.preventDefault()} className="font-bold text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="font-bold text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </span>
      </label>

      {error && (
        <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
