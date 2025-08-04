export enum UserRole {
  CUSTOMER = 'Customer',
  TECHNICIAN = 'Technician',
  ADMIN = 'Admin',
  SHOPKEEPER = 'Shopkeeper',
  DELIVERY_PARTNER = 'Delivery Partner',
  STAFF = 'Staff',
}

export enum AdminRole {
    CEO = 'CEO',
    MANAGER = 'Manager',
    TECH_ADMIN = 'Tech Admin',
    DELIVERY_ADMIN = 'Delivery Admin',
    MARKET_ADMIN = 'Market Admin',
    RECEPTIONIST = 'Receptionist',
}

export type CombinedRole = UserRole | AdminRole;

export const GwaliorLocations = [
    'DD Nagar',
    'Hazira',
    'Thatipur',
    'Govindpuri',
    'Bada',
    'Phoolbagh',
    'Morar',
    'Lashkar'
];

export type Location = typeof GwaliorLocations[number];

export interface PaymentRecord {
    requestId: string;
    amount: number;
    date: Date;
    status: 'Paid' | 'Pending';
}

export interface InsuranceInfo {
    provider: string;
    policyNumber: string;
    expiryDate: Date;
}

export interface DetailedAddress {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Transaction {
    id: string;
    date: Date;
    amount: number;
    description: string;
    source: 'Job Fee' | 'Delivery Fee' | 'Bonus' | 'Salary' | 'Payout' | 'Incentive' | 'Referral Bonus';
}

export interface Wallet {
    balance: number;
    transactions: Transaction[];
}

export interface Loyalty {
    points: number;
    tier: 'Bronze' | 'Silver' | 'Gold';
}

export interface VehicleDetails {
    type: VehicleType;
    model: string;
    registrationNumber: string;
    insuranceExpiry: Date;
    rcDocumentUrl?: string;
    insuranceDocumentUrl?: string;
    drivingLicense?: {
        number: string;
        expiryDate: Date;
        documentUrl?: string;
    };
}

export interface PartnerPerformance {
    customerRating: {
        average: number;
        count: number;
    };
    onTimeRate: number; // Percentage
    recentFeedback: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: Location;
  technicianId?: string;
  shopId?: string; // For Shopkeepers
  mobileNumber?: string;
  specialty?: ServiceCategory;
  isAvailable?: boolean;
  rating?: number;
  paymentHistory?: PaymentRecord[];
  insuranceInfo?: InsuranceInfo;
  // New detailed info
  dateOfBirth?: Date;
  joiningDate?: Date;
  permanentAddress?: DetailedAddress;
  currentAddress?: DetailedAddress;
  whatsappConsent?: boolean;
  hasRegisteredShop?: boolean; // New: To track if a shopkeeper has completed registration
  liveLocation?: { lat: number; lng: number }; // For technicians and delivery partners
  adminRole?: AdminRole; // For RBAC
  expenses?: Expense[];
  weeklyGoal?: number;
  attendance?: { [date: string]: 'Present' | 'Absent' | 'Leave' };
  baseSalary?: number; // New for HR
  wallet?: Wallet; // New for HR & payouts
  achievedIncentives?: string[]; // New for target-based bonuses
  loyalty?: Loyalty; // New for customer rewards
  referralCode?: string; // New for referrals
  referredBy?: string; // New for referrals
  successfulReferrals?: string[]; // New for referrals
  vehicleDetails?: VehicleDetails; // New for delivery partners
  performance?: PartnerPerformance; // New for delivery partners
}

export interface Expense {
    id: string;
    date: Date;
    category: 'Fuel' | 'Parts' | 'Tools' | 'Other' | 'Marketing' | 'Software' | 'Operations' | 'Salary';
    amount: number;
    description: string;
}

export interface ExpenseTarget {
    category: Expense['category'];
    target: number;
}


export enum ServiceCategory {
    PLUMBING = 'Plumbing',
    ELECTRICAL = 'Electrical',
    APPLIANCE_REPAIR = 'Appliance Repair',
    AC_REPAIR = 'AC Repair',
    GEYSER_REPAIR = 'Geyser Repair',
    TV_REPAIR = 'TV Repair',
    CARPENTRY = 'Carpentry',
    PAINTING = 'Painting',
    OTHER = 'Other'
}

export enum ServiceType {
    INSTALLATION = 'Installation',
    REPAIR = 'Repair'
}

export enum ServiceStatus {
    REQUESTED = 'Requested',
    ACCEPTED = 'Technician Assigned',
    EN_ROUTE = 'En Route',
    WORK_IN_PROGRESS = 'Work in Progress',
    PENDING_PAYMENT = 'Pending Payment',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled'
}

export interface ServiceRequest {
    id: string;
    jobId: string;
    customerId: string;
    customerName: string;
    description: string;
    category: ServiceCategory;
    serviceType: ServiceType;
    status: ServiceStatus;
    location: Location;
    address: DetailedAddress;
    mobileNumber: string;
    technicianId?: string;
    technicianName?: string;
    createdAt: Date;
    rating?: number;
    feedback?: string;
    chatHistory?: { senderId: string, text: string, timestamp: Date }[];
    complaint?: {
        id: string; 
        text: string;
        isResolved: boolean;
        resolutionRemark?: string;
        escalationLevel: AdminRole;
        aiSuggestion?: string;
    };
    bill?: {
        itemCharge: number;
        serviceCharge: number;
        discount: number;
        offerDiscount?: number;
        gst: number;
        totalAmount: number;
        isPaid: boolean;
    };
    isLocationSharingActive?: boolean;
    liveLocation?: { lat: number; lng: number };
}

export interface Feedback {
    id: string;
    fromUser: string;
    toUser: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

// Config types for dynamic pricing and offers
export interface ServiceConfig {
    category: ServiceCategory;
    price: number;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    appliesTo?: 'first_service'; // Example condition
}


export type AdminPage = 'overview' | 'users' | 'requests' | 'analytics' | 'feedback' | 'locations' | 'complaints' | 'customers' | 'pricing' | 'training_hub' | 'shop_management' | 'orders' | 'delivery_management' | 'settings' | 'hr';

export interface DiagnosticHelp {
    possibleCauses: string[];
    requiredTools: string[];
    repairSteps: string[];
}

// Types for Training & Support Hub
export interface SupportMessage {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface TrainingVideo {
    id: string;
    title: string;
    category: ServiceCategory;
    description: string;
    videoUrl: string; // YouTube embed URL
}

// Types for Marketplace
export enum ProductQuality {
    BASIC = 'Basic',
    STANDARD = 'Standard',
    PREMIUM = 'Premium'
}

export type WarrantyType = 'Replacement' | 'Repair';
export type WarrantyMode = 'Online' | 'Offline';

export interface Product {
    id: string;
    shopId: string;
    shopName: string;
    name: string;
    category: ServiceCategory;
    price: number;
    description: string;
    warranty: {
        duration: string;
        type: WarrantyType;
        mode: WarrantyMode;
    };
    discount?: number; // percentage
    hasHomeDelivery: boolean;
    quality: ProductQuality;
    imageUrl: string;
    stock: number;
    aiSuggestion?: string;
}

export interface ShopPerformance {
    customerRating: {
        average: number;
        count: number;
    };
    partnerRating: {
        average: number;
        count: number;
    };
    itemReturnRate: number; // Percentage
    recentFeedback: string[];
}

export interface Shop {
    id: string;
    ownerId: string;
    name: string;
    location: Location;
    address: DetailedAddress;
    rating: number;
    ratingCount: number; // New
    isVerified: boolean;
    isGstRegistered: boolean; // New
    gstNumber?: string; // New
    performance: ShopPerformance;
}

// New Types for E-commerce flow
export enum OrderStatus {
    PLACED = 'Placed',
    SHIPPED = 'Shipped', // Ready for pickup
    OUT_FOR_DELIVERY = 'Out for Delivery',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
}

export enum PaymentMode {
    COD = 'Cash on Delivery',
    DIGITAL = 'Digital Payment',
    ADVANCE = 'Advance Payment',
}

export enum PaymentStatus {
    PENDING = 'Pending',
    PAID = 'Paid',
}

export enum DeliveryStatus {
    AWAITING_ASSIGNMENT = 'Awaiting Assignment',
    ASSIGNED = 'Assigned',
    PICKING_UP = 'Picking Up',
    EN_ROUTE = 'En Route',
    DELIVERED = 'Delivered',
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    product: Product;
    shop: Shop;
    status: OrderStatus;
    orderDate: Date;
    billingAddress: DetailedAddress;
    isExperienceRated?: boolean;
    isShopRatedByPartner?: boolean;
    totalAmount: number;
    payment: {
        mode: PaymentMode;
        status: PaymentStatus;
        discountApplied?: number;
    };
    bill?: {
        withGst: {
            subtotal: number;
            gst: number;
            total: number;
        },
        withoutGst: {
            subtotal: number;
            gst: number;
            total: number;
        }
    };
    isDeliveryTrackable?: boolean;
    liveDeliveryLocation?: { lat: number; lng: number };
    delivery?: {
        partnerId: string;
        partnerName: string;
        status: DeliveryStatus;
        fee: number;
    };
}

// New Types for HR & Incentives
export type IncentiveTargetType = 'jobsCompleted' | 'deliveriesCompleted';

export interface IncentiveProgram {
    id: string;
    name: string;
    description: string;
    targetType: IncentiveTargetType;
    targetValue: number;
    bonusAmount: number;
    isActive: boolean;
    applicableRoles: UserRole[];
}

// New Types for Shopkeeper-initiated delivery
export enum VehicleType {
    BIKE = 'Bike',
    E_RICKSHAW = 'E-Rickshaw',
    LORRY = 'Lorry',
    VAN = 'Van',
    TRUCK = 'Truck',
}

export enum DeliveryRequestStatus {
    REQUESTED = 'Requested',
    ASSIGNED = 'Assigned',
    PICKING_UP = 'Picking Up',
    EN_ROUTE = 'En Route',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export interface DeliveryRequest {
  id: string;
  shopId: string;
  shopName: string;
  pickupAddress: DetailedAddress;
  destinationAddress: DetailedAddress;
  itemName: string;
  itemWeight: string; // e.g., '< 5kg', '5-20kg', '> 20kg'
  vehicleType: VehicleType;
  status: DeliveryRequestStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  createdAt: Date;
  fee: number;
  liveDeliveryLocation?: { lat: number; lng: number };
  isExperienceRated?: boolean;
  isShopRatedByPartner?: boolean;
}

export interface PackersMoversRequest {
    id: string;
    customerId: string;
    customerName: string;
    mobileNumber: string;
    pickupAddress: DetailedAddress;
    destinationAddress: DetailedAddress;
    itemDetails: string;
    itemWeight: string; // e.g., '< 20kg', '20-100kg', '> 100kg'
    vehicleType: VehicleType;
    status: DeliveryRequestStatus;
    deliveryPartnerId?: string;
    deliveryPartnerName?: string;
    createdAt: Date;
    fee: number;
    liveDeliveryLocation?: { lat: number; lng: number };
    isExperienceRated?: boolean;
}