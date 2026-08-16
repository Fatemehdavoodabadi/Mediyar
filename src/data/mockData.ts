import {
  Order,
  PharmacyVerification,
  InsuranceExpert,
  InsuranceGatewayHealth,
  SystemConfig,
  SupportTicket,
  StandardEvent,
  AuthenticatedUser
} from '../types/fsd';

export const DEMO_SUPPORT_USER: AuthenticatedUser = {
  id: 'SUP-9041',
  name: 'کارشناس داودآبادی',
  role: 'SUPPORT_AGENT',
  email: 'davoodabadi@medyar.internal',
  avatarInitials: 'دا',
  department: 'مرکز مداخله و کارشناسی داودآبادی',
  lastLogin: '۱۴۰۵/۰۵/۲۴ - ۰۹:۱۵'
};

export const DEMO_ADMIN_USER: AuthenticatedUser = {
  id: 'ADM-ROOT',
  name: 'دکتر کریمی',
  role: 'SUPER_ADMIN',
  email: 'karimi@medyar.internal',
  avatarInitials: 'کر',
  department: 'مدیریت ارشد و نظارت کریمی',
  lastLogin: '۱۴۰۵/۰۵/۲۴ - ۰۸:۳۰'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-10492',
    patientName: 'سارا کاظمی',
    patientPhone: '09121112233',
    patientAddress: 'تهران، خیابان ولیعصر، تقاطع مطهری، پلاک ۸۲، واحد ۴',
    state: 'CANCELLATION_REQUESTED',
    createdAt: '2026-08-14T08:15:00Z',
    updatedAt: '2026-08-14T09:10:00Z',
    pharmacyId: 'PHARM-101',
    pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
    courierId: 'COUR-502',
    courierName: 'پژمان حسینی',
    courierPhone: '09194445566',
    courierStatus: 'IN_TRANSIT',
    totalAmount: 485000,
    insuranceAmount: 340000,
    patientShare: 145000,
    paymentMethod: 'INTERNAL_WALLET',
    prescriptionCode: 'RX-992104-SALAMAT',
    cancellationReason: 'تاخیر بیش از حد مجاز در اعزام سفیر و تهیه نسخه از داروخانه فیزیکی محلی',
    cancellationRequestedAt: '2026-08-14T09:05:00Z',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10495',
    patientName: 'مهرداد پاکزاد',
    patientPhone: '09353334455',
    patientAddress: 'تهران، سعادت‌آباد، خیابان سرو غربی، کوچه ارغوان، پلاک ۱۲',
    state: 'CANCELLATION_REQUESTED',
    createdAt: '2026-08-14T08:40:00Z',
    updatedAt: '2026-08-14T09:12:00Z',
    pharmacyId: 'PHARM-103',
    pharmacyName: 'داروخانه تخصصی بهارستان',
    courierId: 'COUR-508',
    courierName: 'امیرحسین رضایی',
    courierPhone: '09127778899',
    courierStatus: 'AT_PHARMACY',
    totalAmount: 1250000,
    insuranceAmount: 890000,
    patientShare: 360000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-884321-TAMIN',
    cancellationReason: 'خطای پزشک در دوز تجویزی داروی قلبی و تغییر فوری دستور درمان',
    cancellationRequestedAt: '2026-08-14T09:08:00Z',
    isColdChain: true
  },
  {
    id: 'ORD-2026-10488',
    patientName: 'پروین سلیمی',
    patientPhone: '09125556677',
    patientAddress: 'تهران، پاسداران، بوستان پنجم، برج صدف، طبقه ۶',
    state: 'DISPUTED',
    createdAt: '2026-08-14T06:30:00Z',
    updatedAt: '2026-08-14T08:45:00Z',
    pharmacyId: 'PHARM-104',
    pharmacyName: 'داروخانه مهرآذین',
    courierId: 'COUR-504',
    courierName: 'محمد کریمی',
    courierPhone: '09361112244',
    courierStatus: 'DELIVERED',
    totalAmount: 760000,
    insuranceAmount: 520000,
    patientShare: 240000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-771239-SALAMAT',
    disputeReason: 'شکستگی شیشه شربت سرفه در داخل بسته‌بندی پلمپ و پارگی هولوگرام اصالت دارو',
    disputePhotos: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80'
    ],
    disputeSubmittedAt: '2026-08-14T08:40:00Z',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10482',
    patientName: 'احسان زمانی',
    patientPhone: '09129990011',
    patientAddress: 'تهران، ستارخان، خیابان پاتریس لومومبا، کوچه ترابی، پلاک ۱۹',
    state: 'DISPUTED',
    createdAt: '2026-08-14T07:10:00Z',
    updatedAt: '2026-08-14T08:55:00Z',
    pharmacyId: 'PHARM-102',
    pharmacyName: 'داروخانه تخصصی البرز',
    courierId: 'COUR-510',
    courierName: 'سامان فراهانی',
    courierPhone: '09378889900',
    courierStatus: 'DELIVERED',
    totalAmount: 920000,
    insuranceAmount: 650000,
    patientShare: 270000,
    paymentMethod: 'INTERNAL_WALLET',
    prescriptionCode: 'RX-663219-DANA',
    disputeReason: 'تحویل داروی اشتباهی (قرص لوزارتان به جای لوراتادین با دوز ۵۰ میلی‌گرم)',
    disputePhotos: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80'
    ],
    disputeSubmittedAt: '2026-08-14T08:50:00Z',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10470',
    patientName: 'نگین شجاعی',
    patientPhone: '09124443322',
    patientAddress: 'تهران، یوسف‌آباد، خیابان جهان‌آرا، پلاک ۵۵، واحد ۲',
    state: 'EDR_OVERDUE',
    createdAt: '2026-08-14T06:00:00Z',
    updatedAt: '2026-08-14T08:00:00Z',
    pharmacyId: 'PHARM-101',
    pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
    courierId: 'COUR-501',
    courierName: 'محسن طاهری',
    courierPhone: '09120001122',
    courierStatus: 'DELIVERED',
    totalAmount: 310000,
    insuranceAmount: 220000,
    patientShare: 90000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-551940-TAMIN',
    edrStatus: 'OVERDUE',
    edrTimestamp: '2026-08-14T07:45:00Z',
    deliveryCode: '7492',
    deliveryHandoffTimestamp: '2026-08-14T07:42:00Z',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10464',
    patientName: 'کامران ناصری',
    patientPhone: '09127776655',
    patientAddress: 'تهران، میرداماد، میدان مادر، خیابان وزیری‌پور، پلاک ۴',
    state: 'EDR_OVERDUE',
    createdAt: '2026-08-14T05:45:00Z',
    updatedAt: '2026-08-14T07:30:00Z',
    pharmacyId: 'PHARM-105',
    pharmacyName: 'داروخانه رازی مرکزی',
    courierId: 'COUR-506',
    courierName: 'بهنام یوسفی',
    courierPhone: '09351234567',
    courierStatus: 'DELIVERED',
    totalAmount: 1850000,
    insuranceAmount: 1400000,
    patientShare: 450000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-441098-ARMED_FORCES',
    edrStatus: 'MISSING_SIGNATURE',
    edrTimestamp: '2026-08-14T07:15:00Z',
    deliveryCode: '3180',
    deliveryHandoffTimestamp: '2026-08-14T07:10:00Z',
    isColdChain: true
  },
  // In-flight pipeline orders
  {
    id: 'ORD-2026-10501',
    patientName: 'فرزانه مرادی',
    patientPhone: '09128889911',
    patientAddress: 'تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۴۰',
    state: 'ORCHESTRATED',
    createdAt: '2026-08-14T09:18:00Z',
    updatedAt: '2026-08-14T09:20:00Z',
    pharmacyId: 'PHARM-101',
    pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
    courierId: 'COUR-503',
    courierName: 'سینا باقری',
    courierPhone: '09123334411',
    courierStatus: 'IN_TRANSIT',
    totalAmount: 640000,
    insuranceAmount: 480000,
    patientShare: 160000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-994812-SALAMAT',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10500',
    patientName: 'داوود ابراهیمی',
    patientPhone: '09362221199',
    patientAddress: 'تهران، گیشا، کوچه ۲۳، پلاک ۸',
    state: 'PHARMACY_RESPONSES_PENDING',
    createdAt: '2026-08-14T09:12:00Z',
    updatedAt: '2026-08-14T09:14:00Z',
    pharmacyId: 'PHARM-102',
    pharmacyName: 'داروخانه تخصصی البرز',
    courierId: '',
    courierName: '',
    courierPhone: '',
    courierStatus: 'IN_TRANSIT',
    totalAmount: 510000,
    insuranceAmount: 390000,
    patientShare: 120000,
    paymentMethod: 'INTERNAL_WALLET',
    prescriptionCode: 'RX-994801-TAMIN',
    pharmacyResponseTimeoutSeconds: 45,
    isColdChain: false
  },
  {
    id: 'ORD-2026-10498',
    patientName: 'مینو بهرامی',
    patientPhone: '09121239876',
    patientAddress: 'تهران، شهرک غرب، فاز ۴، خیابان فلامک، پلاک ۲',
    state: 'PRICED',
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-14T09:08:00Z',
    pharmacyId: 'PHARM-103',
    pharmacyName: 'داروخانه تخصصی بهارستان',
    courierId: '',
    courierName: '',
    courierPhone: '',
    courierStatus: 'IN_TRANSIT',
    totalAmount: 890000,
    insuranceAmount: 620000,
    patientShare: 270000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-994760-SALAMAT',
    isColdChain: true
  },
  {
    id: 'ORD-2026-10494',
    patientName: 'آرش شمس',
    patientPhone: '09126667788',
    patientAddress: 'تهران، شریعتی، قلهک، خیابان کلاهدوز، پلاک ۱۱۴',
    state: 'PAYMENT_PENDING',
    createdAt: '2026-08-14T08:50:00Z',
    updatedAt: '2026-08-14T08:58:00Z',
    pharmacyId: 'PHARM-101',
    pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
    courierId: '',
    courierName: '',
    courierPhone: '',
    courierStatus: 'IN_TRANSIT',
    totalAmount: 390000,
    insuranceAmount: 280000,
    patientShare: 110000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-994620-TAMIN',
    softHoldExpiresAt: '2026-08-14T09:28:00Z',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10489',
    patientName: 'زهره گلستانی',
    patientPhone: '09123456780',
    patientAddress: 'تهران، الهیه، خیابان فرشته، کوچه مریم، برج رز',
    state: 'FULFILLING',
    createdAt: '2026-08-14T08:20:00Z',
    updatedAt: '2026-08-14T08:52:00Z',
    pharmacyId: 'PHARM-104',
    pharmacyName: 'داروخانه مهرآذین',
    courierId: 'COUR-509',
    courierName: 'حامد نوروزی',
    courierPhone: '09191234500',
    courierStatus: 'PICKED_UP',
    totalAmount: 2150000,
    insuranceAmount: 1700000,
    patientShare: 450000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-994400-DANA',
    isColdChain: true
  },
  {
    id: 'ORD-2026-10475',
    patientName: 'صادق حبیبی',
    patientPhone: '09358881234',
    patientAddress: 'تهران، تهرانپارس، فلکه سوم، خیابان ۱۹۶ غربی، پلاک ۵۰',
    state: 'DELIVERED',
    createdAt: '2026-08-14T07:00:00Z',
    updatedAt: '2026-08-14T08:30:00Z',
    pharmacyId: 'PHARM-105',
    pharmacyName: 'داروخانه رازی مرکزی',
    courierId: 'COUR-505',
    courierName: 'نیما صفری',
    courierPhone: '09375551122',
    courierStatus: 'DELIVERED',
    totalAmount: 430000,
    insuranceAmount: 310000,
    patientShare: 120000,
    paymentMethod: 'INTERNAL_WALLET',
    prescriptionCode: 'RX-993910-SALAMAT',
    isColdChain: false
  },
  {
    id: 'ORD-2026-10450',
    patientName: 'فاطمه صادقی',
    patientPhone: '09120987654',
    patientAddress: 'تهران، اکباتان، فاز ۱، بلوک A2، ورودی ۳',
    state: 'RECONCILED',
    createdAt: '2026-08-14T04:30:00Z',
    updatedAt: '2026-08-14T08:00:00Z',
    pharmacyId: 'PHARM-101',
    pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
    courierId: 'COUR-501',
    courierName: 'محسن طاهری',
    courierPhone: '09120001122',
    courierStatus: 'DELIVERED',
    totalAmount: 560000,
    insuranceAmount: 410000,
    patientShare: 150000,
    paymentMethod: 'BANK_GATEWAY',
    prescriptionCode: 'RX-992810-TAMIN',
    isColdChain: false
  }
];

export const INITIAL_PHARMACIES: PharmacyVerification[] = [
  {
    id: 'PHARM-201',
    name: 'داروخانه شبانه‌روزی آفتاب',
    licenseNumber: 'LIC-TEH-882910',
    medicalCouncilId: 'MC-49201',
    ownerName: 'دکتر کیانوش رستمی',
    phone: '021-88776655',
    address: 'تهران، خیابان شریعتی، بالاتر از میرداماد، پلاک ۱۱۸۰',
    city: 'تهران',
    iban: 'IR820170000000112233445566',
    operatingHours: 'شبانه‌روزی (۲۴ ساعته / ۷ روز هفته)',
    hasColdChain: true,
    status: 'PENDING_VERIFICATION',
    establishmentLicenseDoc: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
    medicalCouncilCardDoc: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    ibanDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    submittedAt: '2026-08-14T07:30:00Z'
  },
  {
    id: 'PHARM-202',
    name: 'داروخانه دکتر سهرابی (مرکزی)',
    licenseNumber: 'LIC-TEH-773120',
    medicalCouncilId: 'MC-38190',
    ownerName: 'دکتر نسیم سهرابی',
    phone: '021-22334455',
    address: 'تهران، زعفرانیه، خیابان آصف، میدان اعجازی، پلاک ۲۴',
    city: 'تهران',
    iban: 'IR190180000000998877665544',
    operatingHours: '۰۸:۰۰ الی ۲۳:۰۰',
    hasColdChain: true,
    status: 'PENDING_VERIFICATION',
    establishmentLicenseDoc: 'https://images.unsplash.com/photo-1583912267550-d44d95bf6913?w=600&auto=format&fit=crop&q=80',
    medicalCouncilCardDoc: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    ibanDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    submittedAt: '2026-08-14T08:10:00Z'
  },
  {
    id: 'PHARM-203',
    name: 'داروخانه مهرگان پاسداران',
    licenseNumber: 'LIC-TEH-665544',
    medicalCouncilId: 'MC-51092',
    ownerName: 'دکتر حمید مقدم',
    phone: '021-22998877',
    address: 'تهران، پاسداران، نبش گلستان دوم، پلاک ۵',
    city: 'تهران',
    iban: 'IR440120000000334455667788',
    operatingHours: '۰۹:۰۰ الی ۲۲:۰۰',
    hasColdChain: false,
    status: 'PENDING_VERIFICATION',
    establishmentLicenseDoc: 'https://images.unsplash.com/photo-1586015555751-63c299c80fa8?w=600&auto=format&fit=crop&q=80',
    medicalCouncilCardDoc: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    ibanDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    submittedAt: '2026-08-14T08:45:00Z'
  },
  {
    id: 'PHARM-101',
    name: 'داروخانه شبانه‌روزی دکتر افشار',
    licenseNumber: 'LIC-TEH-102938',
    medicalCouncilId: 'MC-19820',
    ownerName: 'دکتر جمشید افشار',
    phone: '021-88990011',
    address: 'تهران، میدان فاطمی، خیابان جویبار، پلاک ۳۲',
    city: 'تهران',
    iban: 'IR900190000000114477889900',
    operatingHours: 'شبانه‌روزی',
    hasColdChain: true,
    status: 'APPROVED',
    establishmentLicenseDoc: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
    medicalCouncilCardDoc: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    ibanDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    submittedAt: '2026-08-01T10:00:00Z',
    reviewedAt: '2026-08-02T11:30:00Z',
    reviewedBy: 'ADM-ROOT'
  }
];

export const INITIAL_EXPERTS: InsuranceExpert[] = [
  {
    id: 'EXP-9042',
    fullName: 'دکتر بابک نوریان',
    nationalId: '0012984710',
    phone: '09121118899',
    insuranceProvider: 'بیمه تامین اجتماعی',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2026-07-15T09:00:00Z',
    assignedRegion: 'منطقه ۱ و ۳ تهران (شمال و شمال شرق)',
    reviewCount: 1420,
    accessPasscode: 'SEC-TN-8821'
  },
  {
    id: 'EXP-9043',
    fullName: 'سرکار خانم فریده خسروی',
    nationalId: '0029384751',
    phone: '09124449900',
    insuranceProvider: 'بیمه سلامت ایران',
    role: 'ADJUDICATOR',
    status: 'ACTIVE',
    createdAt: '2026-07-20T10:30:00Z',
    assignedRegion: 'منطقه ۲ و ۵ تهران (غرب و شمال غرب)',
    reviewCount: 980,
    accessPasscode: 'SEC-SL-9102'
  },
  {
    id: 'EXP-9044',
    fullName: 'مهندس وحید قنبری',
    nationalId: '0049281723',
    phone: '09356667788',
    insuranceProvider: 'بیمه خدمات درمانی دانا',
    role: 'ADJUDICATOR',
    status: 'ACTIVE',
    createdAt: '2026-08-01T08:45:00Z',
    assignedRegion: 'منطقه ۶ و ۷ تهران (مرکز و شرق)',
    reviewCount: 450,
    accessPasscode: 'SEC-DN-4401'
  },
  {
    id: 'EXP-9045',
    fullName: 'سرهنگ بازنشسته جواد علیزاده',
    nationalId: '0058192837',
    phone: '09127773322',
    insuranceProvider: 'بیمه نیروهای مسلح',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: '2026-08-05T11:15:00Z',
    assignedRegion: 'سراسری تهران و حومه',
    reviewCount: 890,
    accessPasscode: 'SEC-AF-3390'
  }
];

export const INITIAL_GATEWAYS: InsuranceGatewayHealth[] = [
  {
    id: 'GW-TAMIN',
    name: 'درگاه سازمان تامین اجتماعی (سامانه نسخه الکترونیک)',
    endpoint: 'https://ep.tamin.ir/v2/adjudication/ws',
    status: 'ONLINE',
    latencyMs: 142,
    uptimePercent: 99.82,
    lastChecked: '2026-08-14T09:25:00Z',
    activeSessions: 840
  },
  {
    id: 'GW-SALAMAT',
    name: 'درگاه بیمه سلامت ایرانیان (سامانه رسا/سیماد)',
    endpoint: 'https://services.ihio.gov.ir/api/v1/prescription',
    status: 'ONLINE',
    latencyMs: 185,
    uptimePercent: 99.45,
    lastChecked: '2026-08-14T09:25:00Z',
    activeSessions: 620
  },
  {
    id: 'GW-ARMED',
    name: 'درگاه بیمه خدمات درمانی نیروهای مسلح (ساخد)',
    endpoint: 'https://eservices.esata.ir/ws/pharma/v3',
    status: 'DEGRADED',
    latencyMs: 640,
    uptimePercent: 96.10,
    lastChecked: '2026-08-14T09:24:00Z',
    activeSessions: 210
  },
  {
    id: 'GW-DANA',
    name: 'درگاه استعلام بیمه تکمیلی دانا و تجاری',
    endpoint: 'https://api.danainsurance.com/healthcare/direct-claim',
    status: 'ONLINE',
    latencyMs: 95,
    uptimePercent: 99.95,
    lastChecked: '2026-08-14T09:25:00Z',
    activeSessions: 390
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  softHoldTtlMinutes: 15,
  pharmacyResponseTimeoutSeconds: 60,
  drugMinExpiryFormula: 'طول دوره مصرف + ۳ ماه حاشیه ایمنی',
  minExpiryMonthsBuffer: 3,
  baseDeliveryFeeToman: 45000,
  coldChainSurchargeToman: 25000,
  maxDisputeWindowHours: 3
};

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-401',
    title: 'عدم تطابق مبلغ کسر شده از کیف پول با پیش‌فاکتور',
    orderId: 'ORD-2026-10492',
    requesterType: 'PATIENT',
    requesterName: 'سارا کاظمی',
    requesterPhone: '09121112233',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-08-14T08:50:00Z',
    updatedAt: '2026-08-14T09:05:00Z',
    category: 'PAYMENT',
    messages: [
      {
        id: 'msg-1',
        sender: 'سارا کاظمی',
        senderRole: 'USER',
        content: 'سلام، بنده سفارش رو لغو کردم ولی هنوز اعتبار ۱۴۵،۰۰۰ تومانی به کیف پولم برگشت داده نشده. لطفا پیگیری فرمایید.',
        timestamp: '2026-08-14T08:50:00Z'
      }
    ]
  },
  {
    id: 'TCK-402',
    title: 'عدم دسترسی سفیر به کد امنیتی ۴ رقمی تحویل دارو',
    orderId: 'ORD-2026-10470',
    requesterType: 'PHARMACY',
    requesterName: 'داروخانه شبانه‌روزی دکتر افشار',
    requesterPhone: '021-88990011',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-14T07:50:00Z',
    updatedAt: '2026-08-14T08:15:00Z',
    category: 'DELIVERY',
    messages: [
      {
        id: 'msg-2',
        sender: 'دکتر افشار (مسئول فنی)',
        senderRole: 'USER',
        content: 'سفیر محترم به درب منزل بیمار رسیده اما بیمار پیامک کد تحویل را دریافت نکرده است. لطفا استعلام EDR را بررسی کنید.',
        timestamp: '2026-08-14T07:50:00Z'
      },
      {
        id: 'msg-3',
        sender: 'کارشناس داودآبادی',
        senderRole: 'SUPPORT',
        content: 'همکار گرامی، کد ۴ رقمی امنیتی (7492) در سیستم ثبت شد و پیامک مجددا برای شماره بیمار ارسال گردید.',
        timestamp: '2026-08-14T08:15:00Z'
      }
    ]
  },
  {
    id: 'TCK-403',
    title: 'درخواست اصلاح تاییدیه داروی پیوند کلیه (تکمیل پرونده بیمه دانا)',
    orderId: 'ORD-2026-10482',
    requesterType: 'INSURANCE',
    requesterName: 'کارشناس خسروی (بیمه سلامت)',
    requesterPhone: '09124449900',
    priority: 'CRITICAL',
    status: 'OPEN',
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-14T09:00:00Z',
    category: 'PRESCRIPTION',
    messages: [
      {
        id: 'msg-4',
        sender: 'کارشناس خسروی (بیمه)',
        senderRole: 'USER',
        content: 'با توجه به اختلاف اقلام مرجوعی، سند EDR متناظر به حالت تعلیق درآمد تا بازرسی بسته تحویلی نهایی شود.',
        timestamp: '2026-08-14T09:00:00Z'
      }
    ]
  }
];

export const CANNED_RESPONSES: { title: string; text: string; category: string }[] = [
  {
    title: 'تأیید لغو و برگشت وجه به کیف پول داخلی',
    text: 'کاربر گرامی، درخواست لغو سفارش شما تایید گردید و مبلغ پرداختی بدون کسر کارمزد مستقیما به کیف پول داخلی حساب کاربری شما بازگردانده شد.',
    category: 'CANCELLATION'
  },
  {
    title: 'تأیید لغو و استرداد شبا بانکی (درگاه آنلاین)',
    text: 'کاربر گرامی، رویداد بازپرداخت بانکی صادر گردید و وجه مذکور ظرف مدت ۲۴ الی ۷۲ ساعت اداری به حساب بانکی مبدا واریز خواهد شد.',
    category: 'CANCELLATION'
  },
  {
    title: 'پذیرش مرجوعی ۳ ساعته و اعزام سفیر جمع‌آوری',
    text: 'با توجه به بررسی تصاویر ارسالی و تایید آسیب‌دیدگی/اشتباه دارویی، مرجوعی پذیرفته شد. سفیر جهت تحویل بسته و استرداد کامل دارو اعزام می‌گردد.',
    category: 'RETURNS'
  },
  {
    title: 'رد مرجوعی به دلیل انقضای بازه زمانی مجاز',
    text: 'کاربر گرامی، طبق استاندارد وزارت بهداشت و آیین‌نامه مدیار، مهلت ثبت شکایت و مرجوعی دارو حداکثر ۳ ساعت پس از تحویل بوده و متاسفانه درخواست شما خارج از مهلت قانونی ثبت شده است.',
    category: 'RETURNS'
  },
  {
    title: 'ارسال مجدد کد امنیتی EDR تحویل',
    text: 'کد احراز هویت و تحویل داروی ۴ رقمی مجددا از طریق سامانه پیامکی امن به شماره همراه ثبت‌شده شما ارسال شد.',
    category: 'DELIVERY'
  }
];

export const INITIAL_AUDIT_TRAIL: StandardEvent[] = [
  {
    eventId: 'evt_901102',
    eventType: 'PHARMACY_APPROVED',
    aggregateId: 'PHARM-101',
    aggregateType: 'PHARMACY',
    occurredAt: '2026-08-02T11:30:00Z',
    actorId: 'ADM-ROOT',
    actorType: 'SUPER_ADMIN',
    correlationId: 'corr_881920',
    idempotencyKey: 'idem_10293847',
    payload: {
      pharmacyName: 'داروخانه شبانه‌روزی دکتر افشار',
      licenseNumber: 'LIC-TEH-102938',
      medicalCouncilId: 'MC-19820',
      approvedBy: 'ADM-ROOT',
      coldChainCertified: true
    }
  },
  {
    eventId: 'evt_901103',
    eventType: 'INSURANCE_EXPERT_CREATED',
    aggregateId: 'EXP-9042',
    aggregateType: 'INSURANCE_USER',
    occurredAt: '2026-07-15T09:00:00Z',
    actorId: 'ADM-ROOT',
    actorType: 'SUPER_ADMIN',
    correlationId: 'corr_771920',
    idempotencyKey: 'idem_99887711',
    payload: {
      fullName: 'دکتر بابک نوریان',
      insuranceProvider: 'بیمه تامین اجتماعی',
      role: 'MANAGER',
      assignedRegion: 'منطقه ۱ و ۳ تهران'
    }
  },
  {
    eventId: 'evt_901104',
    eventType: 'EDR_SUBMITTED',
    aggregateId: 'ORD-2026-10450',
    aggregateType: 'ORDER',
    occurredAt: '2026-08-14T08:00:00Z',
    actorId: 'SUP-9041',
    actorType: 'SUPPORT_AGENT',
    correlationId: 'corr_661920',
    idempotencyKey: 'idem_55443322',
    payload: {
      orderId: 'ORD-2026-10450',
      courierId: 'COUR-501',
      deliveryCode: '9012',
      verifiedTimestamp: '2026-08-14T08:00:00Z',
      edrSignatureVerified: true
    }
  }
];
