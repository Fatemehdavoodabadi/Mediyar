import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  Building,
  Key,
  Phone,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { InsuranceExpert, InsuranceProviderName } from '../../../types/fsd';
import { EmitEventParams } from '../../../services/eventEngine';

interface InsuranceExpertsViewProps {
  experts: InsuranceExpert[];
  emitEvent: (params: EmitEventParams) => void;
  searchQuery: string;
}

const PROVIDERS: InsuranceProviderName[] = [
  'بیمه تامین اجتماعی',
  'بیمه سلامت ایران',
  'بیمه خدمات درمانی دانا',
  'بیمه نیروهای مسلح',
  'بیمه ایران'
];

export const InsuranceExpertsView: React.FC<InsuranceExpertsViewProps> = ({
  experts,
  emitEvent,
  searchQuery
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>('');
  const [nationalId, setNationalId] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [provider, setProvider] = useState<InsuranceProviderName>('بیمه تامین اجتماعی');
  const [role, setRole] = useState<'ADJUDICATOR' | 'MANAGER'>('ADJUDICATOR');
  const [region, setRegion] = useState<string>('تهران، منطقه ۱ و ۳');

  const filteredExperts = experts.filter((expert) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      expert.fullName.toLowerCase().includes(q) ||
      expert.id.toLowerCase().includes(q) ||
      expert.insuranceProvider.toLowerCase().includes(q)
    );
  });

  const handleCreateExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const expertId = `EXP-${Math.floor(9040 + Math.random() * 900)}`;
    const passcode = `SEC-${Math.floor(1000 + Math.random() * 9000)}`;

    emitEvent({
      eventType: 'INSURANCE_EXPERT_CREATED',
      aggregateId: expertId,
      aggregateType: 'INSURANCE_USER',
      payload: {
        expertId,
        fullName: fullName.trim(),
        nationalId: nationalId || '0019283746',
        phone: phone || '09120000000',
        insuranceProvider: provider,
        role,
        assignedRegion: region,
        accessPasscode: passcode,
        createdAt: new Date().toISOString()
      }
    });

    setIsCreateModalOpen(false);
    setFullName('');
    setNationalId('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                مدیریت کارشناسان و ممیزین سازمان‌های بیمه‌گر
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                {experts.length} کارشناس فعال
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تخصیص دسترسی و احراز هویت ناظرین بیمه سلامت، تأمین اجتماعی، ساخد و بیمه‌های تجاری در سامانه مدیار.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>ایجاد حساب کارشناس بیمه</span>
          </button>
        </div>
      </div>

      {/* Experts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800">
            فهرست پرسنل مجاز ممیزی اسناد دارویی ({filteredExperts.length} نفر)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">کد پرسنلی</th>
                <th className="p-3.5">نام و نام خانوادگی</th>
                <th className="p-3.5">سازمان بیمه‌گر</th>
                <th className="p-3.5">سمت سازمانی</th>
                <th className="p-3.5">منطقه تخصیص‌یافته</th>
                <th className="p-3.5">تعداد ممیزی</th>
                <th className="p-3.5">وضعیت دسترسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExperts.map((expert) => (
                <tr key={expert.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{expert.id}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{expert.fullName}</td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 text-teal-800 font-medium">
                      <Building className="w-3 h-3 text-teal-600" />
                      <span>{expert.insuranceProvider}</span>
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        expert.role === 'MANAGER'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {expert.role === 'MANAGER' ? 'مدیر ارشد ممیزی' : 'کارشناس ممیز اسناد'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{expert.assignedRegion}</td>
                  <td className="p-3.5 font-mono font-semibold text-slate-900">
                    {expert.reviewCount.toLocaleString('fa-IR')} نسخه
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>فعال</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Expert Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  ایجاد حساب جدید کارشناس سازمان بیمه‌گر
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                انصراف
              </button>
            </div>

            <form onSubmit={handleCreateExpert} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  نام و نام خانوادگی کارشناس:
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: دکتر ساسان افشار"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    کد ملی (۱۰ رقم):
                  </label>
                  <input
                    type="text"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder="0019283746"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    شماره همراه:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09121112233"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  سازمان بیمه‌گر متبوع:
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as InsuranceProviderName)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  {PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    سطح دسترسی و نقش:
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'ADJUDICATOR' | 'MANAGER')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  >
                    <option value="ADJUDICATOR">کارشناس ممیز اسناد (Adjudicator)</option>
                    <option value="MANAGER">مدیر ارشد ممیزی (Manager)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    منطقه جغرافیایی تحت نظارت:
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="تهران، منطقه ۱ و ۳"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-900 leading-relaxed">
                رمز عبور یکبارمصرف و کلید امنیتی اتصال به وب‌سرویس به صورت خودکار تولید و در رویداد{' '}
                <code className="font-mono font-bold">INSURANCE_EXPERT_CREATED</code> ثبت خواهد شد.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium rounded-xl transition-colors shadow-sm"
                >
                  تولید حساب و صدور رویداد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
