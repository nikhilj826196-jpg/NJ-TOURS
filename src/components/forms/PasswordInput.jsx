import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordInput({
  label = "Password",
  name = "password",
  value,
  onChange,
  placeholder = "••••••••",
  error,
  required = false
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left font-sans">
      <div className="flex justify-between items-center">
        {label && (
          <label htmlFor={name} className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
      </div>

      <div className="relative rounded-[14px] shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Lock className="w-4 h-4 text-slate-400" />
        </div>

        <input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full h-[56px] bg-[#F8FAFC] border ${
            error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-[#E5E7EB] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 focus:bg-white'
          } rounded-[14px] pl-11 pr-12 py-3 text-xs font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all duration-200`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#0F172A] transition-colors cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-4 h-4 text-[#F97316]" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {error && (
        <p id={`${name}-error`} className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
