import React, { useState } from 'react';
import {
  Building2,
  CheckCircle,
  XCircle,
  FileText,
  CreditCard,
  Clock,
  Snowflake,
  ShieldCheck,
  Eye,
  AlertCircle,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { PharmacyVerification } from '../../../types/fsd';
import { EmitEventParams } from '../../../services/eventEngine';

interface PharmacyVerificationViewProps {
  pharmacies: PharmacyVerification[];
  emitEvent: (params: EmitEventParams) => void;
  searchQuery: string;
}

export const PharmacyVerificationView: React.FC<PharmacyVerificationViewProps> = ({
  pharmacies,
  emitEvent,
  searchQuery
}) => {
  const [inspectingPharmacy, setInspectingPharmacy] = useState<PharmacyVerification | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'ALL'>('PENDING');

  const pendingPharmacies = pharmacies.filter((p) => p.status === 'PENDING_VERIFICATION');

  const filteredPharmacies = pharmacies.filter((pharm) => {
    const matchesSearch =
      !searchQuery ||
      pharm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharm.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pharm.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && pharm.status === 'PENDING_VERIFICATION') ||
      (activeTab === 'APPROVED' && pharm.status === 'APPROVED');

    return matchesSearch && matchesTab;
  });

  const handleApprove = (pharm: PharmacyVerification) => {
    emitEvent({
      eventType: 'PHARMACY_APPROVED',
      aggregateId: pharm.id,
      aggregateType: 'PHARMACY',
      payload: {
        pharmacyId: pharm.id,
        pharmacyName: pharm.name,
        licenseNumber: pharm.licenseNumber,
        medicalCouncilId: pharm.medicalCouncilId,
        iban: pharm.iban,
        hasColdChain: pharm.hasColdChain,
        approvedAt: new Date().toISOString(),
        notes: 'کلیه مدارک ثبتی، کارت نظام پزشکی مسئول فنی و تاییدیه شبا بانک تایید گردید.'
      }
    });
    setInspectingPharmacy(null);
  };

  const handleReject = () => {
    if (!inspectingPharmacy) return;
    emitEvent({
      eventType: 'PHARMACY_REJECTED',
      aggregateId: inspectingPharmacy.id,
      aggregateType: 'PHARMACY',
      payload: {
        pharmacyId: inspectingPharmacy.id,
        pharmacyName: inspectingPharmacy.name,
        reason: rejectReason || 'نقص در تصویر پروانه تاسیس یا عدم تطابق نام صاحب شبا با مسئول فنی',
        rejectedAt: new Date().toISOString()
      }
    });
    setIsRejecting(false);
    setInspectingPharmacy(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                احراز صلاحیت، پروانه‌ها و اتصال داروخانه‌ها (Pharmacy Credentialing)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {pendingPharmacies.length} پرونده در انتظار بررسی
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ممیزی پروانه تأسیس معتبر، شماره نظام پزشکی مسئول فنی، تجهیزات زنجیره سرد و شماره شبای رسمی جهت اتصال به شبکه.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('PENDING')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'PENDING'
                  ? 'bg-white text-amber-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              در انتظار احراز ({pendingPharmacies.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('APPROVED')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'APPROVED'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              تأیید شده
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'ALL'
                  ? 'bg-white text-slate-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              همه ({pharmacies.length})
            </button>
          </div>
        </div>
      </div>

      {/* Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPharmacies.map((pharm) => {
          const isPending = pharm.status === 'PENDING_VERIFICATION';
          const isApproved = pharm.status === 'APPROVED';

          return (
            <div
              key={pharm.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {pharm.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPending
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isApproved
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {isPending ? 'در انتظار احراز' : isApproved ? 'تأیید شده و فعال' : 'رد صلاحیت'}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <div>
                    مسئول فنی: <strong className="text-slate-800">{pharm.ownerName}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>شماره پروانه: {pharm.licenseNumber}</span>
                    <span>نظام پزشکی: {pharm.medicalCouncilId}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>ساعات کاری: {pharm.operatingHours}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{pharm.address}</span>
                  </div>

                  {pharm.hasColdChain && (
                    <div className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                      <Snowflake className="w-3 h-3" />
                      <span>دارای تجهیزات زنجیره سرد (Cold-Chain)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setInspectingPharmacy(pharm)}
                  className="w-full py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>بررسی مدارک و اعتبارسنجی</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Inspector Modal */}
      {inspectingPharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  ممیزی و بازرسی مدارک ({inspectingPharmacy.name})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInspectingPharmacy(null);
                  setIsRejecting(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                بستن
              </button>
            </div>

            {/* General Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[11px]">مسئول فنی و متقاضی</span>
                <strong className="text-slate-800 block">{inspectingPharmacy.ownerName}</strong>
                <span className="text-slate-500 font-mono">نظام: {inspectingPharmacy.medicalCouncilId}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[11px]">پروانه تأسیس و شهر</span>
                <strong className="text-slate-800 block">{inspectingPharmacy.licenseNumber}</strong>
                <span className="text-slate-500">{inspectingPharmacy.city}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 block text-[11px]">شماره شبا بانکی تسویه</span>
                <strong className="text-slate-800 block font-mono text-[11px] truncate">
                  {inspectingPharmacy.iban}
                </strong>
                <span className="text-emerald-700 text-[10px] font-medium">استعلام پایا/ساتنا تایید شد</span>
              </div>
            </div>

            {/* Document Photos Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                مستندات قانونی اسکن شده:
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
                  <div className="h-32 rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={inspectingPharmacy.establishmentLicenseDoc}
                      alt="پروانه تاسیس"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 block">پروانه تأسیس داروخانه</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
                  <div className="h-32 rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={inspectingPharmacy.medicalCouncilCardDoc}
                      alt="کارت نظام پزشکی"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 block">کارت نظام پزشکی مسئول فنی</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1.5">
                  <div className="h-32 rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={inspectingPharmacy.ibanDoc}
                      alt="گواهی شبا"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 block">تاییدیه حساب بانکی و شبا</span>
                </div>
              </div>
            </div>

            {/* Rejection Form if active */}
            {isRejecting ? (
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-3">
                <span className="text-xs font-bold text-rose-800 block">
                  ثبت دلیل نقص مدارک و صدور رویداد رد پرونده (PHARMACY_REJECTED):
                </span>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="مثال: تاریخ اعتبار پروانه تأسیس منقضی شده است؛ لطفاً تصویر تمدید پروانه را بارگذاری نمایید."
                  className="w-full bg-white border border-rose-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-sans"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRejecting(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:bg-slate-100"
                  >
                    انصراف
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-medium hover:bg-rose-700"
                  >
                    ثبت نهایی رد مدارک
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>رد مدارک با ثبت نقص پرونده</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(inspectingPharmacy)}
                  className="py-2 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>تأیید پروانه و فعالسازی داروخانه (PHARMACY_APPROVED)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
