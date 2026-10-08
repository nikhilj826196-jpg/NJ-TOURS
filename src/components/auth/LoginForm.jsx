import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Lock, Eye, EyeOff, ArrowRight, UserPlus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { ROUTES } from '../../constants/routes';
import { ROLES } from '../../constants/roles';

export default function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please enter both email/phone and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login({ email, password });
      addToast(`Welcome back, ${res.user.name}!`, 'success');

      // Role-based Redirection
      const userRole = (res.user.role || '').toUpperCase();
      if (userRole === ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else if (userRole === ROLES.DRIVER) {
        navigate(ROUTES.DRIVER_DASHBOARD);
      } else {
        navigate(ROUTES.CUSTOMER_DASHBOARD);
      }
    } catch (err) {
      setAuthError(err?.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setAuthError('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 text-left">
      
      {/* Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('auth.welcomeBack', 'Welcome Back!')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {t('auth.loginJourney', 'Login to continue your journey with NJ Tours')}
        </p>
      </div>

      {/* Auth Alert Banner */}
      {authError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Quick Demo Role Selector Pills */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1.5 text-left">
        <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
          {t('auth.demoRoles', 'Quick Demo Sessions')}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleDemoFill('customer@example.com')}
            className="bg-white hover:bg-orange-50 text-orange-600 font-bold p-2 rounded-xl border border-slate-200 shadow-sm text-center transition-colors cursor-pointer"
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('driver@example.com')}
            className="bg-white hover:bg-emerald-50 text-emerald-700 font-bold p-2 rounded-xl border border-slate-200 shadow-sm text-center transition-colors cursor-pointer"
          >
            Driver
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('admin@example.com')}
            className="bg-white hover:bg-amber-50 text-amber-700 font-bold p-2 rounded-xl border border-slate-200 shadow-sm text-center transition-colors cursor-pointer"
          >
            Admin HQ
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Email or Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t('auth.emailOrPhone', 'Email or Phone')}
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email or phone number"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t('auth.password', 'Password')}
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-[#F97316] shrink-0 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#F97316] focus:ring-4 focus:ring-orange-500/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs font-medium pt-0.5">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#F97316] rounded border-slate-300 focus:ring-[#F97316] cursor-pointer"
            />
            <span>{t('auth.rememberMe', 'Remember me')}</span>
          </label>

          <Link to={ROUTES.FORGOT_PASSWORD} className="font-bold text-[#F97316] hover:text-[#EA580C] hover:underline">
            {t('auth.forgotPassword', 'Forgot Password?')}
          </Link>
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#EA580C] hover:to-[#F97316] text-white font-bold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>{t('auth.login', 'Login')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
        </button>

      </form>

      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
          or
        </span>
      </div>

      {/* Secondary Register Action */}
      <div className="text-center space-y-2">
        <span className="text-xs text-slate-500 font-medium block">
          {t('auth.newToNj', 'New to NJ Tours?')}
        </span>
        <Link
          to={ROUTES.REGISTER}
          className="w-full bg-white hover:bg-orange-50/50 text-[#F97316] font-bold text-xs sm:text-sm py-3 rounded-2xl border border-[#F97316] hover:border-[#EA580C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <UserPlus className="w-4 h-4 text-[#F97316]" />
          <span>{t('auth.createNewAccount', 'Create New Account')}</span>
        </Link>
      </div>

      {/* Footer Terms */}
      <p className="text-center text-[11px] text-slate-400 font-medium pt-2">
        By continuing, you agree to our{' '}
        <span className="font-bold text-slate-700 hover:underline cursor-pointer">Terms & Conditions</span>
        {' '}and{' '}
        <span className="font-bold text-slate-700 hover:underline cursor-pointer">Privacy Policy</span>
      </p>

    </div>
  );
}
