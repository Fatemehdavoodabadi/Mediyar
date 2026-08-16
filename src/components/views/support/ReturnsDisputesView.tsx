import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle,
  XCircle,
  Eye,
  Camera,
  Building2,
  Clock,
  ShieldAlert,
  FileCheck,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { Order } from '../../../types/fsd';
import { EmitEventParams } from '../../../services/eventEngine';

interface ReturnsDisputesViewProps {
  orders: Order[];
  emitEvent: (params: EmitEventParams) => void;
  searchQuery: string;
}

export const ReturnsDisputesView: React.FC<ReturnsDisputesViewProps> = ({
  orders,
  emitEvent,
  searchQuery
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const disputeOrders = orders.filter((o) => o.state === 'DISPUTED');

  const filteredOrders = disputeOrders.filter((order) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.patientName.toLowerCase().includes(q) ||
      order.pharmacyName.toLowerCase().includes(q)
    );
  });

  const handleApproveReturn = (order: Order) => {
    // Emits standard RETURN_APPROVED and triggers financial refund
    emitEvent({
      eventType: 'RETURN_APPROVED',
      aggregateId: order.id,
      aggregateType: 'ORDER',
      payload: {
        orderId: order.id,
        patientName: order.patientName,
        approvedAmount: order.patientShare,
        disputeReason: order.disputeReason,
        inspectionStatus: 'EVIDENCE_VERIFIED_DAMAGED_OR_WRONG_ITEM',
        courierRecallDispatched: true,
        notes: 'تصاویر ارسالی آسیب‌دیدگی/اشتباه دارویی تأیید شد. دستور استرداد صادر گردید.',
        timestamp: new Date().toISOString()
      }
    });
  };

  const handleRejectDispute = () => {
    if (!rejectingOrder) return;
    emitEvent({
      eventType: 'DISPUTE_RESOLVED',
      aggregateId: rejectingOrder.id,
      aggregateType: 'ORDER',
      payload: {
        orderId: rejectingOrder.id,
        resolutionStatus: 'DISPUTE_REJECTED',
        resolutionNote: rejectReason || 'پلمپ دارو سالم بوده و عدم تطابق با دستور پزشک احراز نگردید.',
        timestamp: new Date().toISOString()
      }
    });
    setRejectingOrder(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                رسیدگی به شکایات و مرجوعی در پنجره ۳ ساعته پس از تحویل
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                {disputeOrders.length} شکایت در دست بررسی
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              مطابق آیین‌نامه سامانه مدیار، بیماران تا حداکثر ۳ ساعت پس از تحویل حق ثبت شکایت مبنی بر شکستگی پلمپ، تغییر فیزیکی یا اشتباه دارویی را دارند.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200 text-xs text-rose-800 self-start md:self-auto">
            <Clock className="w-4 h-4 text-rose-600 shrink-0" />
            <span>پنجره رسیدگی اولویت‌دار ۳ ساعته</span>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs shadow-sm">
          هیچ شکایت بازی در بازه زمانی ۳ ساعته برای بررسی وجود ندارد.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5"
            >
              {/* Order Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {order.id}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{order.patientName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    (کد نسخه: {order.prescriptionCode || 'RX-MANUAL'})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>ثبت شکایت: {new Date(order.updatedAt).toLocaleTimeString('fa-IR')}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                    وضعیت DISPUTED
                  </span>
                </div>
              </div>

              {/* Dispute Content & Side-by-side Evidence Photos */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Side (Dispute details & Metadata) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/80">
                    <div className="flex items-center gap-1.5 text-rose-900 font-semibold text-xs mb-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>شرح شکایت ثبت‌شده توسط بیمار:</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {order.disputeReason}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-1">داروخانه ارسال‌کننده</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>{order.pharmacyName}</span>
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] text-slate-400 block mb-1">مبلغ استرداد قابل مطالبه</span>
                      <span className="font-bold text-teal-700 font-mono">
                        {order.patientShare.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side (Evidence Photo Gallery) */}
                <div className="lg:col-span-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Camera className="w-4 h-4 text-teal-600" />
                        <span>مستندات تصویری بیمار (بازرسی چشمی)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {order.disputePhotos?.length || 0} تصویر ضمیمه
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {order.disputePhotos && order.disputePhotos.length > 0 ? (
                        order.disputePhotos.map((photoUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedPhoto(photoUrl)}
                            className="relative group rounded-lg overflow-hidden border border-slate-300 bg-slate-200 h-28 cursor-pointer"
                          >
                            <img
                              src={photoUrl}
                              alt={`مستند شماره ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Maximize2 className="w-5 h-5" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                          تصویری ضمیمه نشده است
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>تأیید مرجوعی موجب اعزام سفیر جمع‌آوری و استرداد مستقیم وجه می‌گردد.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingOrder(order);
                    }}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span>رد شکایت با ثبت ادله</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveReturn(order)}
                    className="flex-1 sm:flex-none py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors shadow-sm shadow-teal-700/20 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>تأیید مرجوعی و صدور عودت وجه</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800">
            <img
              src={selectedPhoto}
              alt="مستند ضمیمه بازرسی"
              className="w-full max-h-[75vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 text-center text-xs text-slate-300">
              جهت بستن، کلیک کنید یا خارج از کادر بزنید.
            </div>
          </div>
        </div>
      )}

      {/* Reject Dispute Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  ثبت ادله رد شکایت مرجوعی ({rejectingOrder.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                انصراف
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                لطفاً دلیل کارشناسی عدم پذیرش مرجوعی را درج فرمایید. این پیام به صورت رسمی همراه با امضای دیجیتال در رویداد{' '}
                <code className="text-teal-700 bg-teal-50 px-1 py-0.5 rounded font-mono">
                  DISPUTE_RESOLVED
                </code>{' '}
                ثبت خواهد شد.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="مثال: عکس‌های ارسالی نشان‌دهنده سلامت کامل پلمپ شرکت سازنده بوده و داروی تحویلی منطبق بر کد نسخه الکترونیک است."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 font-sans"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleRejectDispute}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-colors shadow-sm"
              >
                امضا و صدور رد شکایت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
