import React from 'react';
import {
  Activity,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  GitMerge,
  Building2,
  Users,
  Server,
  Sliders,
  History,
  Shield,
  UserCheck,
  LogOut,
  ChevronLeft,
  Stethoscope,
  RefreshCw
} from 'lucide-react';
import {
  AuthenticatedUser,
  SupportNavTab,
  AdminNavTab,
  Order,
  PharmacyVerification,
  SupportTicket
} from '../types/fsd';

interface SidebarProps {
  currentUser: AuthenticatedUser;
  activeSupportTab: SupportNavTab;
  setActiveSupportTab: (tab: SupportNavTab) => void;
  activeAdminTab: AdminNavTab;
  setActiveAdminTab: (tab: AdminNavTab) => void;
  orders: Order[];
  pharmacies: PharmacyVerification[];
  tickets: SupportTicket[];
  emittedEventsCount: number;
  onLogout: () => void;
  onSwitchRole: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeSupportTab,
  setActiveSupportTab,
  activeAdminTab,
  setActiveAdminTab,
  orders,
  pharmacies,
  tickets,
  emittedEventsCount,
  onLogout,
  onSwitchRole
}) => {
  const isSupport = currentUser.role === 'SUPPORT_AGENT';

  // Badges calculations
  const pendingCancellationsCount = orders.filter((o) => o.state === 'CANCELLATION_REQUESTED').length;
  const activeDisputesCount = orders.filter((o) => o.state === 'DISPUTED').length;
  const openTicketsCount = tickets.filter((t) => t.status === 'OPEN').length;
  const pendingPharmaciesCount = pharmacies.filter((p) => p.status === 'PENDING_VERIFICATION').length;

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col h-screen border-l border-slate-800 shrink-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-900/40">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-tight">مدیار</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800/60">
                سامانه هوشمند
              </span>
            </div>
            <p className="text-[11px] text-slate-400">سامانه متمرکز حاکمیت و نظارت دارویی</p>
          </div>
        </div>
      </div>

      {/* Active Role Indicator Card */}
      <div className="p-3.5 mx-3 my-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSupport ? 'bg-amber-400 animate-pulse' : 'bg-teal-400'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-300">
              {isSupport ? 'کارشناس داودآبادی' : 'ناظر ارشد کریمی'}
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
            {currentUser.id}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="truncate">{currentUser.name}</span>
          <button
            type="button"
            onClick={onSwitchRole}
            className="text-[10px] text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
            title="تغییر نقش کاربری جهت تست"
          >
            <RefreshCw className="w-3 h-3" />
            <span>تغییر نقش</span>
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-1 custom-scrollbar">
        <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          {isSupport ? 'کارپوشه کارشناسی داودآبادی' : 'کارپوشه نظارتی کریمی'}
        </div>

        {isSupport ? (
          <>
            {/* SUPPORT ROLE NAVIGATION */}
            <button
              type="button"
              onClick={() => setActiveSupportTab('SUPPORT_DASHBOARD')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSupportTab === 'SUPPORT_DASHBOARD'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-teal-300" />
                <span>داشبورد عملیات زنده</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setActiveSupportTab('EXCEPTIONS_CANCELLATIONS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSupportTab === 'EXCEPTIONS_CANCELLATIONS'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>استثنائات و لغو سفارش</span>
              </div>
              {pendingCancellationsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingCancellationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveSupportTab('RETURNS_DISPUTES')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSupportTab === 'RETURNS_DISPUTES'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>رسیدگی به مرجوعی و شکایات</span>
              </div>
              {activeDisputesCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeDisputesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveSupportTab('UNIFIED_TICKETS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSupportTab === 'UNIFIED_TICKETS'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>مرکز تیکتینگ یکپارچه</span>
              </div>
              {openTicketsCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {openTicketsCount}
                </span>
              )}
            </button>
          </>
        ) : (
          <>
            {/* SUPER ADMIN ROLE NAVIGATION */}
            <button
              type="button"
              onClick={() => setActiveAdminTab('ADMIN_PIPELINE')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'ADMIN_PIPELINE'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <GitMerge className="w-4 h-4 text-teal-300" />
                <span>نمای کلان و پایش جریان</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('PHARMACY_VERIFICATION')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'PHARMACY_VERIFICATION'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>احراز و تأیید داروخانه‌ها</span>
              </div>
              {pendingPharmaciesCount > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {pendingPharmaciesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('INSURANCE_EXPERTS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'INSURANCE_EXPERTS'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>مدیریت کارشناسان بیمه</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('INSURANCE_HEALTH')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'INSURANCE_HEALTH'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>پایش سرورهای بیمه</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('SYSTEM_CONFIG')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'SYSTEM_CONFIG'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-sky-400" />
                <span>تنظیمات کلان سامانه</span>
              </div>
              <ChevronLeft className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('GLOBAL_AUDIT_TRAIL')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeAdminTab === 'GLOBAL_AUDIT_TRAIL'
                  ? 'bg-teal-700 text-white shadow-sm shadow-teal-900/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-teal-400" />
                <span>ردپای سراسری رویدادها</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {emittedEventsCount}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Strict Data Immutability Badge */}
      <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-teal-400 font-medium mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>تغییرناپذیری داده‌ها و رویدادها</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-400">
          تغییر مستقیم فیلدها مسدود است؛ کلیه وضعیت‌ها بر مبنای انتشار رویداد با کلید یکتا اعمال می‌گردند.
        </p>
      </div>

      {/* Bottom Profile and Logout */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-teal-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {currentUser.avatarInitials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser.department}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="خروج از کارپوشه"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
