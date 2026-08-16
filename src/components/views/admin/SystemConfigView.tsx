import React, { useState } from 'react';
import {
  Sliders,
  Save,
  Clock,
  Snowflake,
  CreditCard,
  ShieldAlert,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { SystemConfig } from '../../../types/fsd';
import { INITIAL_SYSTEM_CONFIG } from '../../../data/mockData';
import { EmitEventParams } from '../../../services/eventEngine';

interface SystemConfigViewProps {
  systemConfig: SystemConfig;
  emitEvent: (params: EmitEventParams) => void;
}

export const SystemConfigView: React.FC<SystemConfigViewProps> = ({
  systemConfig,
  emitEvent
}) => {
  const [formData, setFormData] = useState<SystemConfig>(systemConfig || INITIAL_SYSTEM_CONFIG);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emitEvent({
      eventType: 'SYSTEM_CONFIG_UPDATED',
      aggregateId: 'SYS_GLOBAL_CONFIG',
      aggregateType: 'SYSTEM_CONFIG',
      payload: {
        ...formData,
        updatedAt: new Date().toISOString()
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              تنظیمات و پارامترهای کلان محاسباتی سامانه (Global System Config)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تنظیم TTL رزرو موقت، مهلت پاسخگویی داروخانه‌ها، فرمول حداقل تاریخ انقضا و تعرفه‌های حمل.
            </p>
          </div>
        </div>
      </div>

      {/* Config Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Soft-Hold TTL */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>مدت زمان هولد موقت دارو در سبد (Soft-Hold TTL):</span>
            </label>
            <p className="text-[11px] text-slate-500">
              مدت زمانی که داروی استعلام‌شده در انبار داروخانه برای پرداخت بیمار مسدود می‌ماند.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={5}
                max={60}
                value={formData.softHoldTtlMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, softHoldTtlMinutes: Number(e.target.value) })
                }
                className="w-24 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">دقیقه</span>
            </div>
          </div>

          {/* Pharmacy Response Timeout */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>مهلت زمان پاسخگویی داروخانه (Response Timeout):</span>
            </label>
            <p className="text-[11px] text-slate-500">
              پنجره زمانی اعلام موجودی و تایید استعلام قیمت پیش از بازتوزیع سفارش به داروخانه مجاور.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={15}
                max={300}
                value={formData.pharmacyResponseTimeoutSeconds}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pharmacyResponseTimeoutSeconds: Number(e.target.value)
                  })
                }
                className="w-24 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">ثانیه</span>
            </div>
          </div>

          {/* Drug Minimum Expiry Buffer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>حاشیه ایمنی تاریخ انقضای دارو (Min Expiry Buffer):</span>
            </label>
            <p className="text-[11px] text-slate-500">
              فرمول: طول دوره مصرف + X ماه حاشیه ایمنی جهت جلوگیری از تحویل داروی نزدیک به انقضا.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={1}
                max={12}
                value={formData.minExpiryMonthsBuffer}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minExpiryMonthsBuffer: Number(e.target.value),
                    drugMinExpiryFormula: `طول دوره مصرف + ${e.target.value} ماه حاشیه ایمنی`
                  })
                }
                className="w-24 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">ماه مازاد بر دوره مصرف</span>
            </div>
          </div>

          {/* Base Delivery Fee */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>تعرفه پایه ارسال سفیر (تومان):</span>
            </label>
            <p className="text-[11px] text-slate-500">
              مبلغ پایه کرایه تحویل درب منزل در شعاع استاندارد ۵ کیلومتری.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                step={5000}
                value={formData.baseDeliveryFeeToman}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseDeliveryFeeToman: Number(e.target.value)
                  })
                }
                className="w-36 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">تومان</span>
            </div>
          </div>

          {/* Cold Chain Surcharge */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-sky-600" />
              <span>کارمزد باکس و زنجیره سرد (Cold Chain Surcharge):</span>
            </label>
            <p className="text-[11px] text-slate-500">
              هزینه حمل با باکس دمای ۲ تا ۸ درجه سانتی‌گراد مجهز به حسگر و دیتالاگر آنلاین.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                step={5000}
                value={formData.coldChainSurchargeToman}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coldChainSurchargeToman: Number(e.target.value)
                  })
                }
                className="w-36 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">تومان</span>
            </div>
          </div>

          {/* Dispute Window */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>مهلت ثبت مرجوعی پس از تحویل:</span>
            </label>
            <p className="text-[11px] text-slate-500">
              سقف قانونی زمان مجاز برای بیمار جهت بازرسی بسته و ثبت شکایت با عکس.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min={1}
                max={24}
                value={formData.maxDisputeWindowHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxDisputeWindowHours: Number(e.target.value)
                  })
                }
                className="w-24 bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold font-mono text-center"
              />
              <span className="text-xs text-slate-600">ساعت (حداکثر ۳ ساعت استاندارد سامانه)</span>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>تنظیمات ذخیره شد و رویداد SYSTEM_CONFIG_UPDATED در دفترکل ثبت گردید.</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره و انتشار رویداد تنظیمات سراسری</span>
          </button>
        </div>
      </form>
    </div>
  );
};
