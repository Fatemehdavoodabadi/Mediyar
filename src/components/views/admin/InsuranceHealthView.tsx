import React, { useState } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import { InsuranceGatewayHealth } from '../../../types/fsd';
import { INITIAL_GATEWAYS } from '../../../data/mockData';

export const InsuranceHealthView: React.FC = () => {
  const [gateways, setGateways] = useState<InsuranceGatewayHealth[]>(INITIAL_GATEWAYS);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const handlePingAll = () => {
    setIsPinging(true);
    setTimeout(() => {
      setGateways((prev) =>
        prev.map((gw) => {
          const jitter = Math.floor(Math.random() * 40) - 20;
          const newLatency = Math.max(40, gw.latencyMs + jitter);
          return {
            ...gw,
            latencyMs: newLatency,
            lastChecked: new Date().toISOString()
          };
        })
      );
      setIsPinging(false);
    }, 600);
  };

  const handleToggleStatus = (id: string, newStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => {
    setGateways((prev) =>
      prev.map((gw) => (gw.id === id ? { ...gw, status: newStatus } : gw))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Server className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-800">
                پایش سلامت، پینگ و درگاه‌های برخط وب‌سرویس‌های بیمه
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ۴ درگاه متصل
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              نظارت بر تاخیر زمانی (Latency)، نرخ پایداری (Uptime) و نشست‌های فعال استعلام نسخه الکترونیک.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePingAll}
            disabled={isPinging}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
            <span>ارسال پینگ زنده و استعلام درگاه‌ها</span>
          </button>
        </div>
      </div>

      {/* Gateway Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {gateways.map((gw) => {
          const isOnline = gw.status === 'ONLINE';
          const isDegraded = gw.status === 'DEGRADED';
          const isOffline = gw.status === 'OFFLINE';

          return (
            <div
              key={gw.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{gw.name}</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5 truncate max-w-sm">
                      {gw.endpoint}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 ${
                      isOnline
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isDegraded
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnline
                          ? 'bg-emerald-500 animate-pulse'
                          : isDegraded
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{isOnline ? 'عملیاتی و برخط' : isDegraded ? 'دارای کندی پاسخ' : 'قطع ارتباط'}</span>
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">تاخیر زمانی (Ping)</span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        gw.latencyMs < 250
                          ? 'text-emerald-700'
                          : gw.latencyMs < 500
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {gw.latencyMs} ms
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">نرخ پایداری (Uptime)</span>
                    <span className="text-sm font-bold font-mono text-slate-800">
                      {gw.uptimePercent}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block mb-1">نشست‌های فعال</span>
                    <span className="text-sm font-bold font-mono text-indigo-700">
                      {gw.activeSessions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Simulation Toggle Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">شبیه‌سازی وضعیت درگاه:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(gw.id, 'ONLINE')}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      isOnline ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(gw.id, 'DEGRADED')}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      isDegraded ? 'bg-amber-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Slow
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(gw.id, 'OFFLINE')}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      isOffline ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Offline
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
