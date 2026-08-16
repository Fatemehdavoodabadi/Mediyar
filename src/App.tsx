import React, { useState } from 'react';
import {
  AuthenticatedUser,
  SupportNavTab,
  AdminNavTab,
  Order,
  PharmacyVerification,
  InsuranceExpert,
  SupportTicket,
  SystemConfig,
  StandardEvent
} from './types/fsd';
import {
  DEMO_SUPPORT_USER,
  DEMO_ADMIN_USER,
  INITIAL_ORDERS,
  INITIAL_PHARMACIES,
  INITIAL_EXPERTS,
  INITIAL_TICKETS,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_AUDIT_TRAIL
} from './data/mockData';
import { dispatchStandardEvent, EmitEventParams } from './services/eventEngine';

import { LoginGate } from './components/LoginGate';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EventToastNotification } from './components/EventToastNotification';
import { EventDrawer } from './components/EventDrawer';

// Support Role Views
import { LiveOperationsDashboard } from './components/views/support/LiveOperationsDashboard';
import { ExceptionsCancellationsView } from './components/views/support/ExceptionsCancellationsView';
import { ReturnsDisputesView } from './components/views/support/ReturnsDisputesView';
import { UnifiedTicketsView } from './components/views/support/UnifiedTicketsView';

// Super Admin Role Views
import { SystemPipelineMonitorView } from './components/views/admin/SystemPipelineMonitorView';
import { PharmacyVerificationView } from './components/views/admin/PharmacyVerificationView';
import { InsuranceExpertsView } from './components/views/admin/InsuranceExpertsView';
import { InsuranceHealthView } from './components/views/admin/InsuranceHealthView';
import { SystemConfigView } from './components/views/admin/SystemConfigView';
import { GlobalAuditTrailView } from './components/views/admin/GlobalAuditTrailView';

export default function App() {
  // Current logged in user (null triggers LoginGate)
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(DEMO_SUPPORT_USER);

  // Active navigation tab for Support Role
  const [activeSupportTab, setActiveSupportTab] = useState<SupportNavTab>('SUPPORT_DASHBOARD');

  // Active navigation tab for Super Admin Role
  const [activeAdminTab, setActiveAdminTab] = useState<AdminNavTab>('ADMIN_PIPELINE');

  // Global search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Application State (strictly mutated via signed events)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [pharmacies, setPharmacies] = useState<PharmacyVerification[]>(INITIAL_PHARMACIES);
  const [experts, setExperts] = useState<InsuranceExpert[]>(INITIAL_EXPERTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [auditTrail, setAuditTrail] = useState<StandardEvent[]>(INITIAL_AUDIT_TRAIL);

  // Event stream drawer and toast states
  const [isEventDrawerOpen, setIsEventDrawerOpen] = useState<boolean>(false);
  const [activeToastEvent, setActiveToastEvent] = useState<StandardEvent | null>(null);

  // Event Dispatcher conforming to Medyar event architecture
  const handleEmitEvent = (params: EmitEventParams) => {
    if (!currentUser) return;
    const event = dispatchStandardEvent(params, {
      setOrders,
      setPharmacies,
      setExperts,
      setTickets,
      setSystemConfig,
      setAuditTrail,
      currentUser
    });
    setActiveToastEvent(event);
  };

  // Quick switch role between Support and Super Admin
  const handleSwitchRole = () => {
    if (currentUser?.role === 'SUPPORT_AGENT') {
      setCurrentUser(DEMO_ADMIN_USER);
    } else {
      setCurrentUser(DEMO_SUPPORT_USER);
    }
  };

  // If not logged in, render the LoginGate
  if (!currentUser) {
    return <LoginGate onLogin={(user) => setCurrentUser(user)} />;
  }

  const isSupport = currentUser.role === 'SUPPORT_AGENT';

  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans text-slate-800 dir-rtl antialiased selection:bg-teal-500 selection:text-white">
      {/* Fixed Right Navigation Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeSupportTab={activeSupportTab}
        setActiveSupportTab={setActiveSupportTab}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
        orders={orders}
        pharmacies={pharmacies}
        tickets={tickets}
        emittedEventsCount={auditTrail.length}
        onLogout={() => setCurrentUser(null)}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Desktop Portal Header */}
        <Header
          currentUser={currentUser}
          activeSupportTab={activeSupportTab}
          activeAdminTab={activeAdminTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenEventDrawer={() => setIsEventDrawerOpen(true)}
          emittedEventsCount={auditTrail.length}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/90 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* WORKSPACE A: SUPPORT & OPERATIONS AGENT VIEWS */}
            {isSupport && (
              <>
                {activeSupportTab === 'SUPPORT_DASHBOARD' && (
                  <LiveOperationsDashboard
                    orders={orders}
                    tickets={tickets}
                    setActiveTab={setActiveSupportTab}
                    searchQuery={searchQuery}
                  />
                )}

                {activeSupportTab === 'EXCEPTIONS_CANCELLATIONS' && (
                  <ExceptionsCancellationsView
                    orders={orders}
                    emitEvent={handleEmitEvent}
                    searchQuery={searchQuery}
                  />
                )}

                {activeSupportTab === 'RETURNS_DISPUTES' && (
                  <ReturnsDisputesView
                    orders={orders}
                    emitEvent={handleEmitEvent}
                    searchQuery={searchQuery}
                  />
                )}

                {activeSupportTab === 'UNIFIED_TICKETS' && (
                  <UnifiedTicketsView
                    tickets={tickets}
                    emitEvent={handleEmitEvent}
                    searchQuery={searchQuery}
                  />
                )}
              </>
            )}

            {/* WORKSPACE B: SUPER ADMIN & OVERSEER VIEWS */}
            {!isSupport && (
              <>
                {activeAdminTab === 'ADMIN_PIPELINE' && (
                  <SystemPipelineMonitorView
                    orders={orders}
                    searchQuery={searchQuery}
                  />
                )}

                {activeAdminTab === 'PHARMACY_VERIFICATION' && (
                  <PharmacyVerificationView
                    pharmacies={pharmacies}
                    emitEvent={handleEmitEvent}
                    searchQuery={searchQuery}
                  />
                )}

                {activeAdminTab === 'INSURANCE_EXPERTS' && (
                  <InsuranceExpertsView
                    experts={experts}
                    emitEvent={handleEmitEvent}
                    searchQuery={searchQuery}
                  />
                )}

                {activeAdminTab === 'INSURANCE_HEALTH' && (
                  <InsuranceHealthView />
                )}

                {activeAdminTab === 'SYSTEM_CONFIG' && (
                  <SystemConfigView
                    systemConfig={systemConfig}
                    emitEvent={handleEmitEvent}
                  />
                )}

                {activeAdminTab === 'GLOBAL_AUDIT_TRAIL' && (
                  <GlobalAuditTrailView
                    auditTrail={auditTrail}
                    searchQuery={searchQuery}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Floating Standard Event Toast Notification */}
      <EventToastNotification
        event={activeToastEvent}
        onClose={() => setActiveToastEvent(null)}
        onOpenDrawer={() => setIsEventDrawerOpen(true)}
      />

      {/* Real-time Standard Event JSON Stream Drawer */}
      <EventDrawer
        isOpen={isEventDrawerOpen}
        onClose={() => setIsEventDrawerOpen(false)}
        auditTrail={auditTrail}
      />
    </div>
  );
}
