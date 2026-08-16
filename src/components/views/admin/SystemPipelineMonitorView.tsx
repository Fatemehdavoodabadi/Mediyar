import React, { useState } from 'react';
import {
  GitMerge,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Snowflake,
  CreditCard,
  Building2,
  Truck,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Order, OrderState } from '../../../types/fsd';

interface SystemPipelineMonitorViewProps {
  orders: Order[];
  searchQuery: string;
}

const PIPELINE_STAGES: { state: OrderState; label: string; description: string }[] = [
  { state: 'DRAFT', label: 'پیش‌نویس', description: 'نسخه در حال دریافت' },
  { state: 'ORCHESTRATED', label: 'توزیع بار', description: 'ارسال استعلام به داروخانه‌ها' },
  { state: 'PHARMACY_RESPONSES_PENDING', label: 'انتظار پاسخ', description: 'مهلت پاسخگویی ۶۰ ثانیه' },
  { state: 'PRICED', label: 'قیمت‌گذاری شده', description: 'استعلام سهم بیمه و بیمار' },
  { state: 'PAYMENT_PENDING', label: 'انتظار پرداخت', description: 'هولد موقت دارو (TTL ۱۵ دقیقه)' },
  { state: 'PAID', label: 'پرداخت شده', description: 'آماده‌سازی توسط داروخانه' },
  { state: 'FULFILLING', label: 'تحویل به سفیر', description: 'سفیر در مسیر تحویل' },
  { state: 'DELIVERED', label: 'تحویل داده شده', description: 'ثبت کد امنیتی ۴ رقمی EDR' },
  { state: 'RECONCILED', label: 'تسويه نهایی', description: 'پایان ممیزی مالی و بیمه‌ای' }
];

export const SystemPipelineMonitorView: React.FC<SystemPipelineMonitorViewProps> = ({
  orders,
  searchQuery
}) => {
  const [selectedStage, setSelectedStage] = useState<OrderState | 'ALL'>('ALL');
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  // Group counts
  const stageCounts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.state] = orders.filter((o) => o.state === stage.state).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'ALL' || order.state === selectedStage;

    return matchesSearch && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Overview Top Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <GitMerge className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                پایش جامع زنجیره پردازش سفارش (Pipeline Machine Monitor)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {orders.length} کل سفارش‌ها
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ردیابی ۹ مرحله‌ای فرآیند از ثبت نسخه تا استعلام بیمه، پرداخت، اعزام زنجیره سرد و ثبت سند EDR.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedStage('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedStage === 'ALL'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              نمایش همه مراحل ({orders.length})
            </button>
          </div>
        </div>
      </div>

      {/* 9-Stage Visual Pipeline Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between min-w-[820px] gap-2">
          {PIPELINE_STAGES.map((stage, idx) => {
            const count = stageCounts[stage.state] || 0;
            const isSelected = selectedStage === stage.state;

            return (
              <React.Fragment key={stage.state}>
                <div
                  onClick={() => setSelectedStage(isSelected ? 'ALL' : stage.state)}
                  className={`flex-1 p-3 rounded-xl border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 shadow-xs ring-1 ring-teal-400/40'
                      : count > 0
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-white border-slate-100 opacity-60'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-1">
                    گام ۰{idx + 1}
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate mb-1">
                    {stage.label}
                  </div>
                  <div className="text-base font-bold font-mono text-teal-700">
                    {count}
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-1">
                    {stage.description}
                  </div>
                </div>

                {idx < PIPELINE_STAGES.length - 1 && (
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filtered Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-slate-800">
              سفارش‌های در حال جریان ({filteredOrders.length} مورد)
            </h3>
            {selectedStage !== 'ALL' && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                فیلتر: {PIPELINE_STAGES.find((s) => s.state === selectedStage)?.label}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">شناسه سفارش</th>
                <th className="p-3.5">بیمار و نسخه</th>
                <th className="p-3.5">وضعیت و گام چرخه</th>
                <th className="p-3.5">داروخانه منتسب</th>
                <th className="p-3.5">سفیر و ارسال</th>
                <th className="p-3.5">مبلغ کل (تومان)</th>
                <th className="p-3.5 text-center">عملیات بازرسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    سفارشی در این وضعیت یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {order.id}
                      {order.isColdChain && (
                        <span className="mr-1.5 inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200">
                          <Snowflake className="w-2.5 h-2.5" />
                          زنجیره سرد
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{order.patientName}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {order.prescriptionCode || 'RX-DIRECT'}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border">
                        {order.state}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-800 truncate max-w-xs">{order.pharmacyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{order.pharmacyId}</div>
                    </td>
                    <td className="p-3.5">
                      {order.courierName ? (
                        <div>
                          <div className="text-slate-800">{order.courierName}</div>
                          <div className="text-[10px] text-slate-400">{order.courierStatus}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {order.totalAmount.toLocaleString('fa-IR')}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setInspectingOrder(order)}
                        className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium transition-colors cursor-pointer"
                      >
                        مشاهده جزئیات
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Inspection Modal */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  شناسنامه کامل سفارش ({inspectingOrder.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingOrder(null)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                بستن
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <span className="text-slate-400 text-[11px]">بیمار و نشانی تحویل:</span>
                <p className="font-bold text-slate-800">{inspectingOrder.patientName}</p>
                <p className="text-slate-600">{inspectingOrder.patientAddress}</p>
                <p className="font-mono text-slate-500">{inspectingOrder.patientPhone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                <span className="text-slate-400 text-[11px]">وضعیت مالی و بیمه:</span>
                <p>مبلغ کل: <strong className="font-mono text-slate-800">{inspectingOrder.totalAmount.toLocaleString('fa-IR')} تومان</strong></p>
                <p>سهم بیمه: <strong className="font-mono text-teal-700">{inspectingOrder.insuranceAmount.toLocaleString('fa-IR')} تومان</strong></p>
                <p>پرداخت بیمار: <strong className="font-mono text-slate-800">{inspectingOrder.patientShare.toLocaleString('fa-IR')} تومان</strong></p>
              </div>
            </div>

            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
              <span className="font-semibold text-teal-900">وضعیت در چرخه حیات سامانه:</span>
              <p className="text-slate-700">
                گام فعلی سفارش <strong>{inspectingOrder.state}</strong> بوده و کلیه رویدادهای منتسب به آن در دفترکل تغییرناپذیر ثبت شده است.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectingOrder(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-medium hover:bg-slate-700"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
