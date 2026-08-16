import React, { useEffect } from 'react';
import { CheckCircle, X, Code, ExternalLink } from 'lucide-react';
import { StandardEvent } from '../types/fsd';

interface EventToastNotificationProps {
  event: StandardEvent | null;
  onClose: () => void;
  onOpenDrawer: () => void;
}

export const EventToastNotification: React.FC<EventToastNotificationProps> = ({
  event,
  onClose,
  onOpenDrawer
}) => {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-md w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700/80 p-4 transition-all animate-in slide-in-from-bottom-5 duration-300 font-sans dir-rtl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle className="w-4 h-4 text-teal-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-300 font-mono">
                {event.eventType}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {event.aggregateId}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              رویداد با امضای دیجیتال عامل <strong className="text-white font-mono">{event.actorId}</strong> صادر و در دفترکل ثبت گردید.
            </p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
              <span>کلید یکتایی:</span>
              <span className="text-teal-400">{event.idempotencyKey}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">
          سامانه مدیار — تغییرناپذیری داده‌ها و رویدادها
        </span>
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenDrawer();
          }}
          className="text-xs text-teal-300 hover:text-teal-200 font-medium flex items-center gap-1.5 hover:underline"
        >
          <Code className="w-3.5 h-3.5" />
          <span>مشاهده ساختار JSON</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
