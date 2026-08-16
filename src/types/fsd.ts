/**
 * سامانه مدیریت و نظارت دارویی مدیار - Domain & Event Types
 */

export type UserRole = 'SUPPORT_AGENT' | 'SUPER_ADMIN';

export interface AuthenticatedUser {
  id: string;              // e.g. "SUP-9041" or "ADM-ROOT"
  name: string;            // e.g. "علیرضا صابری" or "مدیر کل سامانه مرکزی"
  role: UserRole;
  email: string;
  avatarInitials: string;
  department: string;
  lastLogin: string;
}

export type ActorType = 'SUPPORT_AGENT' | 'SUPER_ADMIN' | 'SYSTEM' | 'PHARMACY' | 'COURIER' | 'PATIENT';

export interface StandardEvent<T = Record<string, any>> {
  eventId: string;          // e.g. "evt_104928374"
  eventType:
    | 'REFUND_REQUESTED'
    | 'CANCELLATION_REJECTED'
    | 'RETURN_APPROVED'
    | 'DISPUTE_RESOLVED'
    | 'EDR_SUBMITTED'
    | 'PHARMACY_APPROVED'
    | 'PHARMACY_REJECTED'
    | 'INSURANCE_EXPERT_CREATED'
    | 'SYSTEM_CONFIG_UPDATED'
    | 'TICKET_REPLIED';
  aggregateId: string;      // e.g. "ORD-2026-10492", "PHARM-201", "EXP-9042"
  aggregateType: 'ORDER' | 'PHARMACY' | 'INSURANCE_USER' | 'SYSTEM_CONFIG' | 'SUPPORT_TICKET';
  occurredAt: string;       // ISO 8601 string
  actorId: string;          // "SUP-9041" or "ADM-ROOT"
  actorType: 'SUPPORT_AGENT' | 'SUPER_ADMIN' | 'SYSTEM';
  correlationId: string;    // e.g. "corr_99210"
  idempotencyKey: string;   // e.g. "idem_44882103"
  payload: T;
}

export type OrderState =
  | 'DRAFT'
  | 'ORCHESTRATED'
  | 'PHARMACY_RESPONSES_PENDING'
  | 'PRICED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'FULFILLING'
  | 'DELIVERED'
  | 'RECONCILED'
  | 'CANCELLATION_REQUESTED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'PRICING_EXCEPTION'
  | 'EDR_OVERDUE';

export type PaymentMethod = 'BANK_GATEWAY' | 'INTERNAL_WALLET';

export interface Order {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  state: OrderState;
  createdAt: string;
  updatedAt: string;
  pharmacyId: string;
  pharmacyName: string;
  courierId: string;
  courierName: string;
  courierPhone: string;
  courierStatus: 'IN_TRANSIT' | 'AT_PHARMACY' | 'PICKED_UP' | 'DELIVERED' | 'DELAYED';
  totalAmount: number; // Toman
  insuranceAmount: number;
  patientShare: number;
  paymentMethod: PaymentMethod;
  prescriptionCode?: string;
  cancellationReason?: string;
  cancellationRequestedAt?: string;
  disputeReason?: string;
  disputePhotos?: string[];
  disputeSubmittedAt?: string;
  edrStatus?: 'VALID' | 'MISSING_SIGNATURE' | 'EXPIRED' | 'OVERDUE' | 'CORRECTED';
  edrTimestamp?: string;
  deliveryCode?: string;
  deliveryHandoffTimestamp?: string;
  softHoldExpiresAt?: string;
  pharmacyResponseTimeoutSeconds?: number;
  isColdChain?: boolean;
}

export type PharmacyVerificationStatus = 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';

export interface PharmacyVerification {
  id: string;
  name: string;
  licenseNumber: string;
  medicalCouncilId: string;
  ownerName: string;
  phone: string;
  address: string;
  city: string;
  iban: string;
  operatingHours: string;
  hasColdChain: boolean;
  status: PharmacyVerificationStatus;
  establishmentLicenseDoc: string;
  medicalCouncilCardDoc: string;
  ibanDoc: string;
  submittedAt: string;
  rejectionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type InsuranceProviderName =
  | 'بیمه سلامت ایران'
  | 'بیمه تامین اجتماعی'
  | 'بیمه خدمات درمانی دانا'
  | 'بیمه نیروهای مسلح'
  | 'بیمه ایران';

export interface InsuranceExpert {
  id: string;
  fullName: string;
  nationalId: string;
  phone: string;
  insuranceProvider: InsuranceProviderName;
  role: 'ADJUDICATOR' | 'MANAGER';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  assignedRegion: string;
  reviewCount: number;
  accessPasscode: string;
}

export interface InsuranceGatewayHealth {
  id: string;
  name: string;
  endpoint: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  activeSessions: number;
}

export interface SystemConfig {
  softHoldTtlMinutes: number;
  pharmacyResponseTimeoutSeconds: number;
  drugMinExpiryFormula: string;
  minExpiryMonthsBuffer: number;
  baseDeliveryFeeToman: number;
  coldChainSurchargeToman: number;
  maxDisputeWindowHours: number;
}

export interface SupportTicket {
  id: string;
  title: string;
  orderId?: string;
  requesterType: 'PATIENT' | 'PHARMACY' | 'INSURANCE';
  requesterName: string;
  requesterPhone: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
  category: 'PRESCRIPTION' | 'PAYMENT' | 'DELIVERY' | 'RETURN' | 'GENERAL';
  messages: {
    id: string;
    sender: string;
    senderRole: 'USER' | 'SUPPORT';
    content: string;
    timestamp: string;
  }[];
}

// Navigation Tabs for Support Role
export type SupportNavTab =
  | 'SUPPORT_DASHBOARD'
  | 'EXCEPTIONS_CANCELLATIONS'
  | 'RETURNS_DISPUTES'
  | 'UNIFIED_TICKETS';

// Navigation Tabs for Super Admin Role
export type AdminNavTab =
  | 'ADMIN_PIPELINE'
  | 'PHARMACY_VERIFICATION'
  | 'INSURANCE_EXPERTS'
  | 'INSURANCE_HEALTH'
  | 'SYSTEM_CONFIG'
  | 'GLOBAL_AUDIT_TRAIL';
