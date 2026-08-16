import React, { useState } from 'react';
import { X, Code, Copy, Check, Filter, Shield, Radio } from 'lucide-react';
import { StandardEvent } from '../types/fsd';

interface EventDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  auditTrail: StandardEvent[];
}

export const EventDrawer: React.FC<EventDrawerProps> = ({
  isOpen,
  onClose,
  auditTrail
}) => {
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const eventTypes = ['ALL', ...Array.from(new Set(auditTrail.map((e) => e.eventType)))];

  const filteredEvents =
    selectedEventType === 'ALL'
      ? auditTrail
      : auditTrail.filter((e) => e.eventType === selectedEventType);

  const handleCopyJson = (event: StandardEvent) => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopiedId(event.eventId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans dir-rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-2xl w-full bg-slate-900 text-slate-100 shadow-2xl border-r border-slate-800 flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">جریان رویدادهای زنده مدیار (Event Stream)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {auditTrail.length} رویداد ثبت‌شده
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                قرارداد رویدادهای استاندارد امضا شده سامانه مدیار
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 shrink-0">فیلتر نوع رویداد:</span>
          {eventTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedEventType(type)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedEventType === type
                  ? 'bg-teal-600 text-white font-medium shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              رویدادی برای این فیلتر ثبت نشده است.
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.eventId}
                className="bg-slate-950 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                {/* Event Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-300 font-mono">
                      {event.eventType}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {event.aggregateId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(event.occurredAt).toLocaleTimeString('fa-IR')}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyJson(event)}
                      className="p-1 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded transition-colors"
                      title="کپی ساختار JSON رویداد"
                    >
                      {copiedId === event.eventId ? (
                        <Check className="w-3.5 h-3.5 text-teal-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Event Metadata Row */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500">عامل (Actor): </span>
                    <span className="text-slate-200">{event.actorId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">نقش: </span>
                    <span className="text-slate-200">{event.actorType}</span>
                  </div>
                  <div className="truncate">
                    <span className="text-slate-500">Idempotency: </span>
                    <span className="text-teal-400">{event.idempotencyKey}</span>
                  </div>
                </div>

                {/* JSON Body Preview */}
                <div className="relative">
                  <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto border border-slate-800 custom-scrollbar text-left dir-ltr">
                    {JSON.stringify(event, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-between px-4">
          <div className="flex items-center gap-1.5 text-teal-400">
            <Shield className="w-3.5 h-3.5" />
            <span>پروتکل رویدادهای استاندارد مدیار</span>
          </div>
          <span className="font-mono text-slate-400">TLS-Encrypted Signatures</span>
        </div>
      </div>
    </div>
  );
};
