import React, { useState } from 'react';
import {
  History,
  Shield,
  Code,
  Copy,
  Check,
  Filter,
  Search,
  Key,
  Calendar,
  User,
  Radio,
  Download
} from 'lucide-react';
import { StandardEvent } from '../../../types/fsd';

interface GlobalAuditTrailViewProps {
  auditTrail: StandardEvent[];
  searchQuery: string;
}

export const GlobalAuditTrailView: React.FC<GlobalAuditTrailViewProps> = ({
  auditTrail,
  searchQuery
}) => {
  const [selectedEvent, setSelectedEvent] = useState<StandardEvent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const eventTypes = ['ALL', ...Array.from(new Set(auditTrail.map((e) => e.eventType)))];

  const filteredEvents = auditTrail.filter((event) => {
    const matchesSearch =
      !searchQuery ||
      event.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.aggregateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.actorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.idempotencyKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || event.eventType === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleCopyJson = (event: StandardEvent) => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopiedId(event.eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditTrail, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `medyar-audit-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                ردپای سراسری و دفترکل تغییرناپذیر رویدادها (Global Immutability Audit Log)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {auditTrail.length} رویداد امضا شده
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ثبت خط‌به‌خط تمامی تراکنش‌ها، احرازها، تایید استردادها و پاسخ‌های پشتیبانی با شناسه یکتا و امضای عامل.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>خروجی JSON کامل دفترکل</span>
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-500 shrink-0">نوع رویداد:</span>
        {eventTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
              typeFilter === type
                ? 'bg-teal-700 text-white font-medium shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">شناسه رویداد (Event ID)</th>
                <th className="p-3.5">نوع رویداد (Event Type)</th>
                <th className="p-3.5">موجودیت (Aggregate)</th>
                <th className="p-3.5">عامل و نقش (Actor)</th>
                <th className="p-3.5">زمان وقوع</th>
                <th className="p-3.5">کلید یکتایی (Idempotency)</th>
                <th className="p-3.5 text-center">مشاهده پی‌لود</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    رویدادی با مشخصات وارد شده یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.eventId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {event.eventId}
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {event.eventType}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-semibold text-slate-800">{event.aggregateId}</div>
                      <div className="text-[9px] text-slate-400">{event.aggregateType}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-mono font-semibold text-slate-800">{event.actorId}</div>
                      <div className="text-[10px] text-slate-400">{event.actorType}</div>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500">
                      {new Date(event.occurredAt).toLocaleString('fa-IR')}
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-teal-700">
                      {event.idempotencyKey}
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event JSON Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {selectedEvent.eventType} ({selectedEvent.eventId})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                بستن
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>Aggregate: <span className="text-teal-400">{selectedEvent.aggregateId}</span></div>
              <div>Actor: <span className="text-slate-100">{selectedEvent.actorId}</span></div>
              <div>Idempotency: <span className="text-teal-400">{selectedEvent.idempotencyKey}</span></div>
              <div>Correlation: <span className="text-slate-300">{selectedEvent.correlationId}</span></div>
            </div>

            <div className="relative">
              <pre className="text-xs font-mono bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto border border-slate-800 custom-scrollbar max-h-80 text-left dir-ltr">
                {JSON.stringify(selectedEvent, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCopyJson(selectedEvent)}
                className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === selectedEvent.eventId ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی ساختار JSON رویداد</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
