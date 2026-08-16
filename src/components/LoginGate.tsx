import React, { useState } from 'react';
import { Shield, Lock, Key, UserCheck, Stethoscope, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthenticatedUser, UserRole } from '../types/fsd';
import { DEMO_SUPPORT_USER, DEMO_ADMIN_USER } from '../data/mockData';

interface LoginGateProps {
  onLogin: (user: AuthenticatedUser) => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('SUPPORT_AGENT');
  const [identifier, setIdentifier] = useState<string>('SUP-9041');
  const [password, setPassword] = useState<string>('••••••••••');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    if (role === 'SUPPORT_AGENT') {
      setIdentifier('SUP-9041');
      setPassword('••••••••••');
    } else {
      setIdentifier('ADM-ROOT');
      setPassword('••••••••••••');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'SUPPORT_AGENT') {
        onLogin(DEMO_SUPPORT_USER);
      } else {
        onLogin(DEMO_ADMIN_USER);
      }
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('لطفاً شناسه کاربری را وارد نمایید.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'SUPPORT_AGENT') {
        onLogin({
          ...DEMO_SUPPORT_USER,
          id: identifier.toUpperCase()
        });
      } else {
        onLogin({
          ...DEMO_ADMIN_USER,
          id: identifier.toUpperCase()
        });
      }
    }, 450);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between items-center p-4 sm:p-6 text-slate-100 font-sans dir-rtl relative overflow-hidden selection:bg-teal-500 selection:text-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-400 flex items-center justify-center shadow-lg shadow-teal-500/20 ring-1 ring-teal-300/30">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">مدیار</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/60">
                سامانه جامع دارویی
              </span>
            </div>
            <p className="text-xs text-slate-400">سامانه مرکزی مدیریت، نظارت و زنجیره تأمین دارو مدیار</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <Shield className="w-3.5 h-3.5 text-teal-400" />
          <span>پروتکل امنیتی احراز هویت ایزوله دوگانه</span>
        </div>
      </header>

      {/* Center Login Box */}
      <div className="w-full max-w-md my-auto z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Security Alert Badge */}
          <div className="mb-6 p-3 rounded-xl bg-teal-950/40 border border-teal-800/40 text-teal-200 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11.5px]">
              <strong className="text-teal-300">سامانه اختصاصی مدیریت و نظارت مرکزی مدیار:</strong> کلیه دسترسی‌ها، رویدادهای مالی و تغییرات اسناد دارویی ثبت و لاگ امنیتی می‌گردند.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 border border-slate-800/80 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleTabChange('SUPPORT_AGENT')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                selectedRole === 'SUPPORT_AGENT'
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-900/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>کارشناس داودآبادی</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('SUPER_ADMIN')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all ${
                selectedRole === 'SUPER_ADMIN'
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-900/50 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ناظر ارشد کریمی</span>
            </button>
          </div>

          {/* Role Description Card */}
          <div className="mb-5 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <div>
              <span className="text-slate-400">سطح دسترسی فعال: </span>
              <strong className="text-white">
                {selectedRole === 'SUPPORT_AGENT'
                  ? 'کارشناس داودآبادی (مداخله و عملیات سفارش‌ها)'
                  : 'ناظر ارشد کریمی (احراز هویت، بیمه، تنظیمات و ممیزی)'}
              </strong>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {selectedRole === 'SUPPORT_AGENT' ? 'ROLE_OPS_AGENT' : 'ROLE_SUPER_ADMIN'}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {selectedRole === 'SUPPORT_AGENT' ? 'شناسه کارشناس داودآبادی (Agent ID)' : 'شناسه ناظر ارشد کریمی (Admin Key)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono"
                  placeholder={selectedRole === 'SUPPORT_AGENT' ? 'e.g. SUP-9041' : 'e.g. ADM-ROOT'}
                />
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                رمز عبور امنیتی / کلید امضای رویداد
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all font-mono"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ورود به کارپوشه اختصاصی</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Links */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-400 mb-2.5 text-center">ورود سریع با حساب‌های نمونه (تست و ارزیابی):</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('SUPPORT_AGENT')}
                className="py-2 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-[11px] text-teal-300 text-center transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                <span>ورود کارشناس داودآبادی (SUP-9041)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('SUPER_ADMIN')}
                className="py-2 px-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 text-[11px] text-teal-300 text-center transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-400" />
                <span>ورود ناظر ارشد کریمی (ADM-ROOT)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="w-full max-w-5xl py-4 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-900">
        <span>سامانه مدیریت عملیات و نظارت دارویی مدیار</span>
        <span>کلیه رویدادها دارای کلید یکتایی (Idempotency) و امضای دیجیتال می‌باشند</span>
      </footer>
    </div>
  );
};
