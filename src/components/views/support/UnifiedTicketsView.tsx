import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  Building2,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag
} from 'lucide-react';
import { SupportTicket } from '../../../types/fsd';
import { CANNED_RESPONSES } from '../../../data/mockData';
import { EmitEventParams } from '../../../services/eventEngine';

interface UnifiedTicketsViewProps {
  tickets: SupportTicket[];
  emitEvent: (params: EmitEventParams) => void;
  searchQuery: string;
}

export const UnifiedTicketsView: React.FC<UnifiedTicketsViewProps> = ({
  tickets,
  emitEvent,
  searchQuery
}) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [showCannedModal, setShowCannedModal] = useState<boolean>(false);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      activeStatusFilter === 'ALL' ||
      (activeStatusFilter === 'OPEN' && t.status !== 'RESOLVED') ||
      (activeStatusFilter === 'RESOLVED' && t.status === 'RESOLVED');

    return matchesSearch && matchesStatus;
  });

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || filteredTickets[0];

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;

    emitEvent({
      eventType: 'TICKET_REPLIED',
      aggregateId: selectedTicket.id,
      aggregateType: 'SUPPORT_TICKET',
      payload: {
        ticketId: selectedTicket.id,
        messageText: replyText.trim(),
        newStatus: 'IN_PROGRESS',
        timestamp: new Date().toISOString()
      }
    });

    setReplyText('');
  };

  const handleSelectCanned = (text: string) => {
    setReplyText(text);
    setShowCannedModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                مرکز تیکتینگ یکپارچه و ارتباط چندجانبه
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {tickets.length} تیکت در سیستم
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              پاسخگویی سریع به پیام‌های بیماران، مسئولین فنی داروخانه‌ها و ناظرین بیمه همراه با بانک پاسخ‌های آماده.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveStatusFilter('ALL')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeStatusFilter === 'ALL'
                  ? 'bg-white text-slate-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              همه ({tickets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveStatusFilter('OPEN')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeStatusFilter === 'OPEN'
                  ? 'bg-white text-emerald-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              در دست اقدام
            </button>
            <button
              type="button"
              onClick={() => setActiveStatusFilter('RESOLVED')}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeStatusFilter === 'RESOLVED'
                  ? 'bg-white text-teal-800 font-semibold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              مختومه
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Chat Layout */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[560px] overflow-hidden">
        {/* Tickets Left List */}
        <div className="md:col-span-4 border-l border-slate-200 flex flex-col h-full bg-slate-50/50">
          <div className="p-3 border-b border-slate-200 text-xs font-semibold text-slate-600">
            فهرست تیکت‌های فعال
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {filteredTickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;
              const isCritical = ticket.priority === 'CRITICAL';
              const isHigh = ticket.priority === 'HIGH';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-r-4 border-r-teal-600 shadow-xs' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-slate-900">
                      {ticket.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCritical ? 'بحرانی' : isHigh ? 'فوری' : 'عادی'}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate mb-1.5">
                    {ticket.title}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{ticket.requesterName}</span>
                    <span className="font-mono">{ticket.orderId}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Right Panel */}
        <div className="md:col-span-8 flex flex-col h-full bg-white">
          {selectedTicket ? (
            <>
              {/* Ticket Top Info */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">{selectedTicket.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border">
                      {selectedTicket.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span>درخواست‌دهنده: <strong>{selectedTicket.requesterName}</strong></span>
                    <span>سفارش متناظر: <strong className="font-mono text-teal-700">{selectedTicket.orderId}</strong></span>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                  {selectedTicket.status === 'OPEN' ? 'در انتظار پاسخ' : 'در دست اقدام'}
                </span>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/30">
                {selectedTicket.messages.map((msg) => {
                  const isSupport = msg.senderRole === 'SUPPORT';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isSupport ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                        <span>{msg.sender}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(msg.timestamp).toLocaleTimeString('fa-IR')}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg rounded-2xl p-3.5 text-xs leading-relaxed ${
                          isSupport
                            ? 'bg-teal-700 text-white rounded-tr-xs shadow-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input Bar */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowCannedModal(true)}
                    className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1.5 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/80 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>انتخاب از پاسخ‌های آماده سامانه (Canned Responses)</span>
                  </button>

                  <span className="text-[10px] text-slate-400">
                    ارسال پاسخ به عنوان رویداد TICKET_REPLIED
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="متن پاسخ خود را بنویسید یا از پاسخ‌های آماده استفاده کنید..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="p-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl transition-colors shadow-sm cursor-pointer"
                    title="ارسال پاسخ"
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              تیکتی برای نمایش انتخاب نشده است.
            </div>
          )}
        </div>
      </div>

      {/* Canned Responses Modal */}
      {showCannedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans dir-rtl">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  بانک الگوها و پاسخ‌های استاندارد آماده
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCannedModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                بستن
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {CANNED_RESPONSES.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectCanned(item.text)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50/60 hover:border-teal-300 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
