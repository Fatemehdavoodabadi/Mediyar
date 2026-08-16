import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wallet,
  Building2,
  Phone,
  MapPin,
  Clock,
  Shield,
  CreditCard,
  FileText,
  HelpCircle,
  Search,
  Filter
} from 'lucide-react';
import { Order } from '../../../types/fsd';
import { EmitEventParams } from '../../../services/eventEngine';

interface ExceptionsCancellationsViewProps {
  orders: Order[];
  emitEvent: (params: EmitEventParams) => void;
  searchQuery: string;
}

export const ExceptionsCancellationsView: React.FC<ExceptionsCancellationsViewProps> = ({
  orders,
  emitEvent,
  searchQuery
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WALLET' | 'BANK'>('ALL');

  const cancellationOrders = orders.filter((o) => o.state === 'CANCELLATION_REQUESTED');

  const filteredOrders = cancellationOrders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'ALL' ||
      (activeFilter === 'WALLET' && order.paymentMethod === 'INTERNAL_WALLET') ||
      (activeFilter === 'BANK' && order.paymentMethod === 'BANK_GATEWAY');

    return matchesSearch && matchesFilter;
  });

  const handleApproveRefund = (order: Order) => {
    emitEvent({
      eventType: 'REFUND_REQUESTED',
      aggregateId: order.id,
      aggregateType: 'ORDER',
      payload: {
        orderId: order.id,
        patientName: order.patientName,
        totalRefundAmount: order.totalAmount,
        patientShareRefund: order.patientShare,
        insuranceShareRefund: order.insuranceAmount,
        paymentMethod: order.paymentMethod,
        refundDestination:
          order.paymentMethod === 'INTERNAL_WALLET'
            ? 'اعتبار غیرقابل نقد کیف پول کاربری (Non-cashable)'
            : 'استرداد آنلاین به شماره شبای کارت مبدا',
        timestamp: new Date().toISOString(),
        compliance: 'Strict Route Matching (No cashout bypass)'
      }
    });
    setSelectedOrder(null);
  };

  const handleRejectCancellation = () => {
    if (!selectedOrder) return;
    emitEvent({
      eventType: 'CANCELLATION_REJECTED',
      aggregateId: selectedOrder.id,
      aggregateType: 'ORDER',
      payload: {
        orderId: selectedOrder.id,
        reason: rejectionReason || 'دارو توسط داروخانه پلمپ و جهت ارسال به سفیر تحویل داده شده است.',
        timestamp: new Date().toISOString()
      }
    });
    setIsRejectModalOpen(false);
    setSelectedOrder(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                صف درخواست‌های لغو و صدور رویداد بازپرداخت
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {cancellationOrders.length} مورد فعال
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              طبق قوانین سامانه مدیار، مبالغ پرداختی از کیف پول داخلی فقط به کیف پول و درگاه بانکی به شبای مبدا بازپرداخت می‌گردد.
            </p>
          </div>

          {/* Payment Method Filters */}
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              همه ({cancellationOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('WALLET')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeFilter === 'WALLET'
                  ? 'bg-white text-amber-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              کیف پول داخلی
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('BANK')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                activeFilter === 'BANK'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              درگاه بانکی
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid / Inspector */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs shadow-sm">
          موردی برای نمایش یافت نشد یا کلیه درخواست‌های لغو رسیدگی شده‌اند.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOrders.map((order) => {
            const isWallet = order.paymentMethod === 'INTERNAL_WALLET';
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {order.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {order.patientName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isWallet
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-teal-50 text-teal-800 border-teal-200'
                        }`}
                      >
                        {isWallet ? <Wallet className="w-3 h-3" /> : <CreditCard className="w-3 h-3" />}
                        <span>{isWallet ? 'کیف پول غیرنقدی' : 'درگاه پرداخت مستقیم'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Cancellation Reason Box */}
                  <div className="mt-3.5 p-3 rounded-lg bg-amber-50/50 border border-amber-200/70 text-xs text-amber-900">
                    <div className="font-semibold mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>علت درخواست لغو:</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">{order.cancellationReason}</p>
                  </div>

                  {/* Financial & Order Details */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-slate-400 block text-[11px]">مبلغ کل سفارش</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {order.totalAmount.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-slate-400 block text-[11px]">سهم بیمار (قابل استرداد)</span>
                      <span className="font-bold text-teal-700 font-mono">
                        {order.patientShare.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>

                  {/* Pharmacy and Courier metadata */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>داروخانه مبدأ: </span>
                      <strong className="text-slate-800">{order.pharmacyName}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{order.patientAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>تماس بیمار: {order.patientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Event Action Controls */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsRejectModalOpen(true);
                    }}
                    className="w-1/2 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>رد درخواست لغو</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveRefund(order)}
                    className="w-1/2 py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors shadow-sm shadow-teal-700/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأیید لغو و صدور بازپرداخت</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  ثبت رویداد رد لغو سفارش ({selectedOrder.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                انصراف
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                لطفاً دلیل مستند رد لغو سفارش را وارد نمایید. این توضیح به عنوان رویداد رسمی{' '}
                <code className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono">
                  CANCELLATION_REJECTED
                </code>{' '}
                در دفترکل ثبت و برای بیمار ارسال خواهد شد.
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: داروخانه سفارش را آماده‌سازی و به سفیر تحویل داده و مرسوله در مسیر تحویل است."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-sans"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleRejectCancellation}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-sm"
              >
                امضا و ثبت رویداد رد لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
