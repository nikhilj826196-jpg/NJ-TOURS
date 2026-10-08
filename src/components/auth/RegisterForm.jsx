import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, MapPin, UserPlus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import InputField from '../forms/InputField';
import PasswordInput from '../forms/PasswordInput';
import PasswordStrength from '../forms/PasswordStrength';
import TermsCheckbox from '../forms/TermsCheckbox';
import { authApi } from '../../api/auth.api';
import { useNotification } from '../../context/NotificationContext';
import { ROUTES } from '../../constants/routes';

export default function RegisterForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { addToast } = useNotification();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mobile number is required.';
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address (e.g. name@example.com).';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms & Conditions to register.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');

    if (!validate()) return;

    setLoading(true);

    try {
      await authApi.register({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password,
        role: 'Customer'
      });
      setSuccessMsg('Account created successfully in MySQL database! Redirecting to login...');
      addToast('Registration successful! Your account is saved in database.', 'success');
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (err) {
      console.warn("API registration failed, attempting fallback:", err);
      setAuthError(err?.message || 'Registration failed. Check if password meets criteria (min 8 chars, 1 uppercase, 1 digit, 1 symbol e.g. Pass123!).');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="space-y-5">

      {/* Title */}
      <div className="text-left space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('auth.createAccount')}
        </h2>
        <p className="text-xs font-medium text-slate-500">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Alert */}
      {authError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 shadow-sm animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

        {/* Full Name */}
        <InputField
          label={t('auth.fullName')}
          name="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="e.g. Ramesh Kumar"
          icon={User}
          error={errors.fullName}
          required
        />

        {/* Phone & Email Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <InputField
            label={t('auth.mobileNumber')}
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="9876543210"
            icon={Phone}
            error={errors.phone}
            required
          />

          <InputField
            label={t('auth.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="name@example.com"
            icon={Mail}
            error={errors.email}
            required
          />
        </div>

        {/* City & State Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <InputField
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g. Mumbai"
            icon={MapPin}
            error={errors.city}
            required
          />

          <InputField
            label="State"
            name="state"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="e.g. Maharashtra"
            icon={MapPin}
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <PasswordInput
              label={t('auth.password')}
              name="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <PasswordInput
            label={t('auth.confirmPassword')}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
          />
        </div>

        {/* Terms Checkbox */}
        <TermsCheckbox
          checked={formData.acceptTerms}
          onChange={(e) => handleChange('acceptTerms', e.target.checked)}
          error={errors.acceptTerms}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-shimmer w-full text-slate-950 font-black text-xs py-4 rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{t('auth.registering')}</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>{t('auth.registerNow')}</span>
            </>
          )}
        </button>

      </form>

      {/* Login Footer Link */}
      <div className="text-center pt-2 text-xs font-medium text-slate-600">
        {t('auth.alreadyHaveAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="font-extrabold text-blue-600 hover:text-blue-800 hover:underline">
          {t('auth.loginLink')}
        </Link>
      </div>

    </div>
  );
}
