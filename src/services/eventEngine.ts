import type { Dispatch, SetStateAction } from 'react';
import {
  StandardEvent,
  Order,
  PharmacyVerification,
  InsuranceExpert,
  SystemConfig,
  SupportTicket,
  ActorType,
  AuthenticatedUser
} from '../types/fsd';

export interface EmitEventParams {
  eventType: StandardEvent['eventType'];
  aggregateId: string;
  aggregateType: StandardEvent['aggregateType'];
  payload: Record<string, any>;
  actorOverride?: AuthenticatedUser;
}

export interface StateUpdaters {
  setOrders: Dispatch<SetStateAction<Order[]>>;
  setPharmacies: Dispatch<SetStateAction<PharmacyVerification[]>>;
  setExperts: Dispatch<SetStateAction<InsuranceExpert[]>>;
  setSystemConfig?: Dispatch<SetStateAction<SystemConfig>>;
  setTickets?: Dispatch<SetStateAction<SupportTicket[]>>;
  setAuditTrail: Dispatch<SetStateAction<StandardEvent[]>>;
  currentUser: AuthenticatedUser;
  onEventEmitted?: (event: StandardEvent) => void;
}

/**
 * Creates and dispatches a signed, idempotent Standard Event.
 * Implements Data Immutability: No direct status flag mutation; state advances purely through signed events.
 */
export function dispatchStandardEvent(
  params: EmitEventParams,
  updaters: StateUpdaters
): StandardEvent {
  const now = new Date().toISOString();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const actor = params.actorOverride || updaters.currentUser;

  const event: StandardEvent = {
    eventId: `evt_${Date.now()}_${randomSuffix}`,
    eventType: params.eventType,
    aggregateId: params.aggregateId,
    aggregateType: params.aggregateType,
    occurredAt: now,
    actorId: actor.id,
    actorType: actor.role as 'SUPPORT_AGENT' | 'SUPER_ADMIN',
    correlationId: `corr_${Math.floor(10000 + Math.random() * 90000)}`,
    idempotencyKey: `idem_${Math.random().toString(36).substring(2, 12)}`,
    payload: params.payload
  };

  // Mutate application state based on the signed event effect
  switch (event.eventType) {
    case 'REFUND_REQUESTED': {
      updaters.setOrders((prev) =>
        prev.map((order) => {
          if (order.id === event.aggregateId) {
            return {
              ...order,
              state: 'CANCELLED',
              updatedAt: now
            };
          }
          return order;
        })
      );
      break;
    }

    case 'CANCELLATION_REJECTED': {
      updaters.setOrders((prev) =>
        prev.map((order) => {
          if (order.id === event.aggregateId) {
            return {
              ...order,
              state: 'FULFILLING',
              cancellationReason: `[رد شد: ${event.payload.reason || 'ادامه فرآیند ارسال'}]`,
              updatedAt: now
            };
          }
          return order;
        })
      );
      break;
    }

    case 'RETURN_APPROVED': {
      updaters.setOrders((prev) =>
        prev.map((order) => {
          if (order.id === event.aggregateId) {
            return {
              ...order,
              state: 'CANCELLED',
              disputeReason: `[مرجوعی تأیید شد - استرداد وجه صادر گردید: ${event.payload.notes || ''}]`,
              updatedAt: now
            };
          }
          return order;
        })
      );
      break;
    }

    case 'DISPUTE_RESOLVED': {
      updaters.setOrders((prev) =>
        prev.map((order) => {
          if (order.id === event.aggregateId) {
            return {
              ...order,
              state: 'DELIVERED',
              disputeReason: `[شکایت رد/مختومه شد: ${event.payload.resolutionNote || ''}]`,
              updatedAt: now
            };
          }
          return order;
        })
      );
      break;
    }

    case 'EDR_SUBMITTED': {
      updaters.setOrders((prev) =>
        prev.map((order) => {
          if (order.id === event.aggregateId) {
            return {
              ...order,
              state: 'DELIVERED',
              edrStatus: 'CORRECTED',
              deliveryCode: event.payload.deliveryCode || order.deliveryCode,
              edrTimestamp: now,
              updatedAt: now
            };
          }
          return order;
        })
      );
      break;
    }

    case 'PHARMACY_APPROVED': {
      updaters.setPharmacies((prev) =>
        prev.map((pharm) => {
          if (pharm.id === event.aggregateId) {
            return {
              ...pharm,
              status: 'APPROVED',
              reviewedAt: now,
              reviewedBy: event.actorId
            };
          }
          return pharm;
        })
      );
      break;
    }

    case 'PHARMACY_REJECTED': {
      updaters.setPharmacies((prev) =>
        prev.map((pharm) => {
          if (pharm.id === event.aggregateId) {
            return {
              ...pharm,
              status: 'REJECTED',
              rejectionReason: event.payload.reason || 'نقص در مدارک ارسالی',
              reviewedAt: now,
              reviewedBy: event.actorId
            };
          }
          return pharm;
        })
      );
      break;
    }

    case 'INSURANCE_EXPERT_CREATED': {
      const newExpert: InsuranceExpert = {
        id: event.aggregateId,
        fullName: event.payload.fullName,
        nationalId: event.payload.nationalId || '0098765432',
        phone: event.payload.phone || '09120000000',
        insuranceProvider: event.payload.insuranceProvider,
        role: event.payload.role,
        status: 'ACTIVE',
        createdAt: now,
        assignedRegion: event.payload.assignedRegion || 'سراسری',
        reviewCount: 0,
        accessPasscode: event.payload.accessPasscode || `SEC-${Math.floor(1000 + Math.random() * 9000)}`
      };
      updaters.setExperts((prev) => [newExpert, ...prev]);
      break;
    }

    case 'SYSTEM_CONFIG_UPDATED': {
      if (updaters.setSystemConfig) {
        updaters.setSystemConfig((prev) => ({
          ...prev,
          ...event.payload
        }));
      }
      break;
    }

    case 'TICKET_REPLIED': {
      if (updaters.setTickets) {
        updaters.setTickets((prev) =>
          prev.map((ticket) => {
            if (ticket.id === event.aggregateId) {
              return {
                ...ticket,
                status: event.payload.newStatus || ticket.status,
                updatedAt: now,
                messages: [
                  ...ticket.messages,
                  {
                    id: `msg-${Date.now()}`,
                    sender: actor.name,
                    senderRole: 'SUPPORT',
                    content: event.payload.messageText,
                    timestamp: now
                  }
                ]
              };
            }
            return ticket;
          })
        );
      }
      break;
    }
  }

  // Prepend event to the global immutable audit trail
  updaters.setAuditTrail((prev) => [event, ...prev]);

  if (updaters.onEventEmitted) {
    updaters.onEventEmitted(event);
  }

  return event;
}
