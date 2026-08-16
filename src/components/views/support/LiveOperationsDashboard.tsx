import React from 'react';
import {
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldAlert,
  Wallet,
  Building2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Order, SupportTicket, SupportNavTab } from '../../../types/fsd';

interface LiveOperationsDashboardProps {
  orders: Order[];
  tickets: SupportTicket[];
  setActiveTab: (tab: SupportNavTab) => void;
  searchQuery: string;
}

export const LiveOperationsDashboard: React.FC<LiveOperationsDashboardProps> = ({
  orders,
  tickets,
  setActiveTab,
  searchQuery
}) => {
  const pendingCancellations = orders.filter((o) => o.state === 'CANCELLATION_REQUESTED');
  const activeDisputes = orders.filter((o) => o.state === 'DISPUTED');
  const openTickets = tickets.filter((t) => t.status === 'OPEN');
  const criticalTickets = tickets.filter((t) => t.priority === 'CRITICAL');

  // Actionable orders needing immediate agent intervention
  const urgentOrders = orders.filter(
    (o) =>
      o.state === 'CANCELLATION_REQUESTED' ||
      o.state === 'DISPUTED'
  );

  const filteredUrgentOrders = urgentOrders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.patientName.toLowerCase().includes(q) ||
      o.pharmacyName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Operational Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 shadow-sm border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300">
              مرکز عملیات زنده کارشناسی داودآبادی (Live Intervention Desk)
            </span>
          </div>
          <h2 className="text-lg font-bold">پایش در لحظه و مداخله سریع در سفارش‌های در جریان</h2>
          <p className="text-xs text-slate-300 mt-1">
            کلیه لغو سفارش‌ها، شکایات ۳ ساعته و تیکت‌ها نیازمند ثبت رویدادهای استاندارد هستند.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80">
          <div className="text-left font-mono">
            <div className="text-xs text-slate-400">میانگین زمان پاسخگویی</div>
            <div className="text-base font-bold text-teal-300">۱.۴ دقیقه</div>
          </div>
          <div className="w-px h-8 bg-slate-700" />
          <div className="text-left font-mono">
            <div className="text-xs text-slate-400">سفارش‌های نیازمند اقدام</div>
            <div className="text-base font-bold text-amber-400">{urgentOrders.length}</div>
          </div>
        </div>
      </div>

      {/* 3 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pending Cancellations */}
        <div
          onClick={() => setActiveTab('EXCEPTIONS_CANCELLATIONS')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              اقدام فوری
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800 font-mono">
            {pendingCancellations.length}
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">درخواست‌های لغو و استرداد وجه</div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-teal-700 transition-colors">
            <span>بررسی علت لغو و مسیر پرداخت</span>
            <ArrowLeft className="w-3 h-3" />
          </div>
        </div>

        {/* 3-Hour Disputes */}
        <div
          onClick={() => setActiveTab('RETURNS_DISPUTES')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              مهلت ۳ ساعته
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-800 font-mono">
            {activeDisputes.length}
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">مرجوعی و شکایات بازرسی عکس</div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-teal-700 transition-colors">
            <span>بازرسی تصاویر شیشه شکسته/پلمپ</span>
            <ArrowLeft className="w-3 h-3" />
          </div>
        </div>

        {/* Support Tickets */}
        <div
          onClick={() => setActiveTab('UNIFIED_TICKETS')}
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MessageSquare className="w-5 h-5" />
            </div>
            {criticalTickets.length > 0 ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {criticalTickets.length} تیکت بحرانی
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                پایدار
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-800 font-mono">
            {openTickets.length}
          </div>
          <div className="text-xs font-medium text-slate-600 mt-1">تیکت‌های باز بیمار / داروخانه</div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-teal-700 transition-colors">
            <span>پاسخ‌دهی با پیام‌های آماده</span>
            <ArrowLeft className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Real-time Intervention Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-800">صف رویدادهای نیازمند مداخله کارشناس</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border">
              {filteredUrgentOrders.length} مورد
            </span>
          </div>
          <span className="text-[11px] text-slate-400">به‌روزرسانی خودکار زنده</span>
        </div>

        {filteredUrgentOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            هیچ سفارشی در حال حاضر در وضعیت استثناء یا شکایت قرار ندارد.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUrgentOrders.map((order) => {
              const isCancellation = order.state === 'CANCELLATION_REQUESTED';
              const isDispute = order.state === 'DISPUTED';

              return (
                <div
                  key={order.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-1 ${
                        isCancellation
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isCancellation && <AlertTriangle className="w-4 h-4" />}
                      {isDispute && <RotateCcw className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold font-mono text-slate-900">
                          {order.id}
                        </span>
                        <span className="text-xs font-medium text-slate-700">
                          {order.patientName}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                            isCancellation
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {isCancellation && 'درخواست لغو'}
                          {isDispute && 'شکایت / مرجوعی ۳ ساعته'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-1">
                        {order.cancellationReason || order.disputeReason || 'نیاز به بررسی کارشناس'}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{order.pharmacyName}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Wallet className="w-3 h-3 text-slate-400" />
                          <span>{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Jump Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isCancellation) setActiveTab('EXCEPTIONS_CANCELLATIONS');
                      else if (isDispute) setActiveTab('RETURNS_DISPUTES');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>بررسی در کارپوشه</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
