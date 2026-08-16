import React from 'react';
import { Search, Radio, Bell, Shield, UserCheck } from 'lucide-react';
import { AuthenticatedUser, SupportNavTab, AdminNavTab } from '../types/fsd';

interface HeaderProps {
  currentUser: AuthenticatedUser;
  activeSupportTab: SupportNavTab;
  activeAdminTab: AdminNavTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenEventDrawer: () => void;
  emittedEventsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeSupportTab,
  activeAdminTab,
  searchQuery,
  setSearchQuery,
  onOpenEventDrawer,
  emittedEventsCount
}) => {
  const isSupport = currentUser.role === 'SUPPORT_AGENT';

  const getTitle = () => {
    if (isSupport) {
      switch (activeSupportTab) {
        case 'SUPPORT_DASHBOARD':
          return 'داشبورد عملیات زنده و پایش سریع سفارش‌ها';
        case 'EXCEPTIONS_CANCELLATIONS':
          return 'استثنائات، درخواست‌های لغو و عودت وجه';
        case 'RETURNS_DISPUTES':
          return 'رسیدگی به شکایات و مرجوعی ۳ ساعته پس از تحویل';
        case 'UNIFIED_TICKETS':
          return 'مرکز تیکتینگ یکپارچه و ارتباط چندجانبه';
      }
    } else {
      switch (activeAdminTab) {
        case 'ADMIN_PIPELINE':
          return 'نمای کلان و پایش جریان سفارش‌ها';
        case 'PHARMACY_VERIFICATION':
          return 'احراز صلاحیت، پروانه‌ها و اتصال داروخانه‌ها';
        case 'INSURANCE_EXPERTS':
          return 'مدیریت و ایجاد حساب کارشناسان سازمان‌های بیمه‌گر';
        case 'INSURANCE_HEALTH':
          return 'پایش سلامت، پینگ و درگاه‌های برخط بیمه';
        case 'SYSTEM_CONFIG':
          return 'تنظیمات و پارامترهای کلان محاسباتی سامانه';
        case 'GLOBAL_AUDIT_TRAIL':
          return 'ردپای سراسری و تغییرناپذیر رویدادهای سامانه';
      }
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* View Title & Role context */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                isSupport
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}
            >
              {isSupport ? <UserCheck className="w-3 h-3 text-amber-600" /> : <Shield className="w-3 h-3 text-teal-600" />}
              <span>{isSupport ? 'کارشناس داودآبادی' : 'ناظر ارشد کریمی'}</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isSupport
              ? 'مداخله بر مبنای قراردادهای رویداد سامانه مدیار'
              : 'حاکمیت سلامت، راستی‌آزمایی مدارک و ممیزی داده‌ها'}
          </p>
        </div>
      </div>

      {/* Global Search & Action Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64 md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی شناسه سفارش، داروخانه، کد نسخه یا کاربر..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-9 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-sans"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2 text-[10px] text-slate-400 hover:text-slate-600"
            >
              پاک‌کردن
            </button>
          )}
        </div>

        {/* Live Event Stream Button */}
        <button
          type="button"
          onClick={onOpenEventDrawer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 text-xs font-medium transition-colors cursor-pointer"
          title="مشاهده جریان رویدادهای زنده مدیار"
        >
          <Radio className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span className="hidden sm:inline">جریان رویدادهای زنده</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-200 text-teal-900 font-bold">
            {emittedEventsCount}
          </span>
        </button>

        {/* Notification Bell */}
        <div className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
        </div>
      </div>
    </header>
  );
};
