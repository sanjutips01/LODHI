import React, { useState, useEffect } from 'react';
import { User, UserRole, ServiceRequest, ServiceStatus, ServiceCategory, ServiceType, Location, ServiceConfig, Offer, SupportMessage, TrainingVideo, Shop, Product, ProductQuality, DetailedAddress, Order, OrderStatus, PaymentMode, PaymentStatus, DeliveryStatus, AdminRole, Expense, ExpenseTarget, Wallet, Transaction, IncentiveProgram, Loyalty, CombinedRole, DeliveryRequest, DeliveryRequestStatus, VehicleType, PackersMoversRequest, ShopPerformance, PartnerPerformance } from './types.ts';
import Header from './components/shared/Header.tsx';
import LoginModal from './components/shared/LoginModal.tsx';
import { CustomerDashboard } from './components/customer/CustomerDashboard.tsx';
import TechnicianDashboard from './components/technician/TechnicianDashboard.tsx';
import AdminDashboard from './components/admin/AdminDashboard.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { useTranslation } from './hooks/useTranslation.ts';
import ShopkeeperDashboard from './components/shopkeeper/ShopkeeperDashboard.tsx';
import DeliveryDashboard from './components/delivery/DeliveryDashboard.tsx';
import StaffDashboard from './components/staff/StaffDashboard.tsx';
import NotificationSimulator from './components/shared/NotificationSimulator.tsx';

const getSpecialtyPrefix = (specialty: ServiceCategory) => {
    switch (specialty) {
        case ServiceCategory.PLUMBING: return 'P';
        case ServiceCategory.ELECTRICAL: return 'E';
        case ServiceCategory.AC_REPAIR: return 'A';
        case ServiceCategory.GEYSER_REPAIR: return 'G';
        case ServiceCategory.TV_REPAIR: return 'V'; // for Video/TV
        case ServiceCategory.CARPENTRY: return 'C';
        case ServiceCategory.PAINTING: return 'T'; // for PainTer
        case ServiceCategory.APPLIANCE_REPAIR: return 'R';
        default: return 'X';
    }
};

const generateTechnicianId = (specialty: ServiceCategory) => {
    const prefix = getSpecialtyPrefix(specialty);
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${randomNumber}`;
};

const generateJobId = () => `JOB-${Math.floor(100000 + Math.random() * 900000)}`;
const generateComplaintId = () => `CMPL-${Math.floor(100000 + Math.random() * 900000)}`;
const generateOrderId = () => `ORD-${Date.now()}`;
const generateDeliveryId = () => `DEL-${Date.now()}`;
const generateReferralCode = () => `LODHI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

// Mock data is now localized for Gwalior with expanded service categories.
const MOCK_REQUESTS: ServiceRequest[] = [
    { id: 'req1', jobId: generateJobId(), customerId: 'cust1', customerName: 'Alice Johnson', serviceType: ServiceType.REPAIR, description: 'Leaky faucet under the kitchen sink.', category: ServiceCategory.PLUMBING, status: ServiceStatus.COMPLETED, location: 'DD Nagar', address: { street: '123 Main St', city: 'Gwalior', state: 'MP', zip: '474005' }, mobileNumber: '555-1234', technicianId: 'tech1', technicianName: 'Bob Smith', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), rating: 5, feedback: 'Bob was amazing! Fast and professional.', bill: { itemCharge: 1200, serviceCharge: 300, discount: 100, offerDiscount: 50, gst: 243, totalAmount: 1593, isPaid: true } },
    { id: 'req2', jobId: generateJobId(), customerId: 'cust1', customerName: 'Alice Johnson', serviceType: ServiceType.REPAIR, description: 'Main ceiling light is flickering.', category: ServiceCategory.ELECTRICAL, status: ServiceStatus.PENDING_PAYMENT, location: 'DD Nagar', address: { street: '123 Main St', city: 'Gwalior', state: 'MP', zip: '474005' }, mobileNumber: '555-1234', technicianId: 'tech2', technicianName: 'Charlie Brown', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), bill: { itemCharge: 2000, serviceCharge: 500, discount: 0, gst: 450, totalAmount: 2950, isPaid: false }, complaint: { id: generateComplaintId(), text: "Technician left some scuff marks on the wall.", isResolved: false, escalationLevel: AdminRole.RECEPTIONIST }, chatHistory: [{ senderId: 'cust1', text: 'Hey, are you on your way?', timestamp: new Date(Date.now() - 65 * 60000) }, { senderId: 'tech2', text: 'Yes, I should be there in about 15 minutes. Heavy traffic today!', timestamp: new Date(Date.now() - 62 * 60000) }] },
    { id: 'req3', jobId: generateJobId(), customerId: 'cust2', customerName: 'Mark Twain', serviceType: ServiceType.REPAIR, description: 'Split AC is not cooling the room.', category: ServiceCategory.AC_REPAIR, status: ServiceStatus.EN_ROUTE, location: 'Hazira', address: { street: '456 River Ave', city: 'Gwalior', state: 'MP', zip: '474003' }, mobileNumber: '555-5678', technicianId: 'tech3', technicianName: 'David Lee', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), isLocationSharingActive: true, liveLocation: { lat: 26.2183, lng: 78.1828 } },
    { id: 'req4', jobId: generateJobId(), customerId: 'cust2', customerName: 'Mark Twain', serviceType: ServiceType.REPAIR, description: 'The toilet won\'t stop running.', category: ServiceCategory.PLUMBING, status: ServiceStatus.REQUESTED, location: 'Hazira', address: { street: '456 River Ave', city: 'Gwalior', state: 'MP', zip: '474003' }, mobileNumber: '555-5678', createdAt: new Date() },
    { id: 'req5', jobId: generateJobId(), customerId: 'cust3', customerName: 'Jane Austen', serviceType: ServiceType.INSTALLATION, description: 'Need a new wooden bookshelf assembled.', category: ServiceCategory.CARPENTRY, status: ServiceStatus.REQUESTED, location: 'Thatipur', address: { street: '789 Literary Ln', city: 'Gwalior', state: 'MP', zip: '474011' }, mobileNumber: '555-9012', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { id: 'req6', jobId: generateJobId(), customerId: 'cust1', customerName: 'Alice Johnson', serviceType: ServiceType.INSTALLATION, description: 'Install new outdoor security camera.', category: ServiceCategory.ELECTRICAL, status: ServiceStatus.WORK_IN_PROGRESS, location: 'DD Nagar', address: { street: '123 Main St', city: 'Gwalior', state: 'MP', zip: '474005' }, mobileNumber: '555-1234', technicianId: 'tech2', technicianName: 'Charlie Brown', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), bill: { itemCharge: 3500, serviceCharge: 1000, discount: 500, offerDiscount: 200, gst: 684, totalAmount: 4484, isPaid: false }, complaint: { id: generateComplaintId(), text: "Camera angle isn't right, needs adjustment.", isResolved: false, escalationLevel: AdminRole.TECH_ADMIN } },
    { id: 'req7', jobId: generateJobId(), customerId: 'cust4', customerName: 'Ravi Kumar', serviceType: ServiceType.REPAIR, description: 'Geyser is not heating water.', category: ServiceCategory.GEYSER_REPAIR, status: ServiceStatus.REQUESTED, location: 'Govindpuri', address: { street: 'B-Block, Govindpuri', city: 'Gwalior', state: 'MP', zip: '474011' }, mobileNumber: '555-1122', createdAt: new Date() },
    { id: 'req8', jobId: generateJobId(), customerId: 'cust3', customerName: 'Jane Austen', serviceType: ServiceType.REPAIR, description: 'My Samsung TV screen is black, no picture.', category: ServiceCategory.TV_REPAIR, status: ServiceStatus.REQUESTED, location: 'Phoolbagh', address: { street: '15 Poetry Plaza', city: 'Gwalior', state: 'MP', zip: '474002' }, mobileNumber: '555-9012', createdAt: new Date() },
    { id: 'req9', jobId: generateJobId(), customerId: 'cust5', customerName: 'Aarav Singh', serviceType: ServiceType.REPAIR, description: 'The walls in the living room need a fresh coat of paint.', category: ServiceCategory.PAINTING, status: ServiceStatus.REQUESTED, location: 'Lashkar', address: { street: '10 Palace Road', city: 'Gwalior', state: 'MP', zip: '474001' }, mobileNumber: '555-3344', createdAt: new Date() }
];

const MOCK_USERS: User[] = [
  { id: 'cust1', name: 'Alice Johnson', email: 'alice@example.com', role: UserRole.CUSTOMER, location: 'DD Nagar', mobileNumber: '9876543210', whatsappConsent: true, loyalty: { points: 2500, tier: 'Silver' }, referralCode: generateReferralCode(), successfulReferrals: ['cust3'] },
  { id: 'cust2', name: 'Mark Twain', email: 'mark@example.com', role: UserRole.CUSTOMER, location: 'Hazira', mobileNumber: '9876543211', whatsappConsent: false, loyalty: { points: 500, tier: 'Bronze' }, referralCode: generateReferralCode() },
  { id: 'cust3', name: 'Jane Austen', email: 'jane@example.com', role: UserRole.CUSTOMER, location: 'Thatipur', mobileNumber: '9876543212', whatsappConsent: true, loyalty: { points: 8000, tier: 'Gold' }, referralCode: generateReferralCode(), referredBy: 'cust1' },
  { id: 'cust4', name: 'Ravi Kumar', email: 'ravi@example.com', role: UserRole.CUSTOMER, location: 'Govindpuri', mobileNumber: '9876543213', whatsappConsent: true, loyalty: { points: 1200, tier: 'Bronze' }, referralCode: generateReferralCode() },
  { id: 'cust5', name: 'Aarav Singh', email: 'aarav@example.com', role: UserRole.CUSTOMER, location: 'Lashkar', mobileNumber: '9876543214', whatsappConsent: false, loyalty: { points: 0, tier: 'Bronze' }, referralCode: generateReferralCode() },
  { id: 'tech1', name: 'Bob Smith', email: 'bob@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.PLUMBING, technicianId: generateTechnicianId(ServiceCategory.PLUMBING), mobileNumber: '5550001111', location: 'DD Nagar', isAvailable: true, rating: 4.8, 
    dateOfBirth: new Date('1985-05-20'), joiningDate: new Date('2022-01-15'),
    permanentAddress: { street: '1A Smith Lane', city: 'Gwalior', state: 'MP', zip: '474005' },
    currentAddress: { street: '123 Main St', city: 'Gwalior', state: 'MP', zip: '474005' },
    insuranceInfo: { provider: 'InsureCo', policyNumber: 'XYZ-12345', expiryDate: new Date('2025-10-20')}, paymentHistory: [{requestId: 'req1', amount: 1593, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'Paid' }], wallet: { balance: 12500, transactions: [] }, weeklyGoal: 15000, expenses: [], attendance: {} },
  { id: 'tech2', name: 'Charlie Brown', email: 'charlie@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.ELECTRICAL, technicianId: generateTechnicianId(ServiceCategory.ELECTRICAL), mobileNumber: '5550002222', location: 'Thatipur', isAvailable: true, rating: 4.5,
    dateOfBirth: new Date('1990-11-30'), joiningDate: new Date('2021-06-01'),
    permanentAddress: { street: '2B Brown House', city: 'Gwalior', state: 'MP', zip: '474011' },
    currentAddress: { street: '2B Brown House', city: 'Gwalior', state: 'MP', zip: '474011' },
    insuranceInfo: { provider: 'SafeGuard', policyNumber: 'ABC-67890', expiryDate: new Date('2024-12-15')}, paymentHistory: [], wallet: { balance: 8500, transactions: [] }, weeklyGoal: 12000, expenses: [], attendance: {} },
  { id: 'tech3', name: 'David Lee', email: 'david@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.AC_REPAIR, technicianId: generateTechnicianId(ServiceCategory.AC_REPAIR), mobileNumber: '5550003333', location: 'Hazira', isAvailable: true, rating: 4.9,
    dateOfBirth: new Date('1988-02-10'), joiningDate: new Date('2023-03-20'),
    permanentAddress: { street: '3C Lee Estate', city: 'Gwalior', state: 'MP', zip: '474003' },
    insuranceInfo: { provider: 'InsureCo', policyNumber: 'XYZ-98765', expiryDate: new Date('2025-08-01')}, paymentHistory: [], wallet: { balance: 15000, transactions: [] }, weeklyGoal: 18000, expenses: [], attendance: {} },
  { id: 'tech4', name: 'Suresh Sharma', email: 'suresh.sharma@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.CARPENTRY, technicianId: generateTechnicianId(ServiceCategory.CARPENTRY), mobileNumber: '5550004444', location: 'Govindpuri', isAvailable: true, rating: 4.2, insuranceInfo: { provider: 'SafeGuard', policyNumber: 'ABC-11223', expiryDate: new Date('2025-01-10')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 10000, expenses: [], attendance: {} },
  { id: 'tech5', name: 'Ramesh Verma', email: 'ramesh.verma@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.GEYSER_REPAIR, technicianId: generateTechnicianId(ServiceCategory.GEYSER_REPAIR), mobileNumber: '5550005555', location: 'Bada', isAvailable: true, rating: 4.6, insuranceInfo: { provider: 'InsureCo', policyNumber: 'XYZ-33445', expiryDate: new Date('2024-11-30')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 13000, expenses: [], attendance: {} },
  { id: 'tech6', name: 'Heidi Turner', email: 'heidi@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.PLUMBING, technicianId: generateTechnicianId(ServiceCategory.PLUMBING), mobileNumber: '5550006666', location: 'Hazira', isAvailable: false, rating: 4.1, insuranceInfo: { provider: 'SafeGuard', policyNumber: 'ABC-55667', expiryDate: new Date('2025-05-22')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 15000, expenses: [], attendance: {} },
  { id: 'tech7', name: 'Ivan Rodriguez', email: 'ivan@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.ELECTRICAL, technicianId: generateTechnicianId(ServiceCategory.ELECTRICAL), mobileNumber: '5550007777', location: 'DD Nagar', isAvailable: true, rating: 4.7, insuranceInfo: { provider: 'InsureCo', policyNumber: 'XYZ-77889', expiryDate: new Date('2025-03-14')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 16000, expenses: [], attendance: {} },
  { id: 'tech8', name: 'Gopal Mehra', email: 'gopal.mehra@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.TV_REPAIR, technicianId: generateTechnicianId(ServiceCategory.TV_REPAIR), mobileNumber: '5550008888', location: 'Phoolbagh', isAvailable: true, rating: 4.8, insuranceInfo: { provider: 'InsureCo', policyNumber: 'XYZ-11223', expiryDate: new Date('2025-02-15')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 20000, expenses: [], attendance: {} },
  { id: 'tech9', name: 'Priya Singh', email: 'priya.singh@example.com', role: UserRole.TECHNICIAN, specialty: ServiceCategory.PAINTING, technicianId: generateTechnicianId(ServiceCategory.PAINTING), mobileNumber: '5550009999', location: 'Lashkar', isAvailable: true, rating: 4.9, insuranceInfo: { provider: 'SafeGuard', policyNumber: 'ABC-88990', expiryDate: new Date('2025-07-18')}, paymentHistory: [], wallet: { balance: 0, transactions: [] }, weeklyGoal: 11000, expenses: [], attendance: {} },
  { id: 'admin_ceo', name: 'Diana Prince', email: 'diana.ceo@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-01', adminRole: AdminRole.CEO, baseSalary: 120000, wallet: { balance: 0, transactions: [] } },
  { id: 'admin_manager', name: 'Bruce Wayne', email: 'bruce.manager@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-02', adminRole: AdminRole.MANAGER, baseSalary: 90000, wallet: { balance: 0, transactions: [] } },
  { id: 'admin_tech', name: 'Clark Kent', email: 'clark.tech@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-03', adminRole: AdminRole.TECH_ADMIN, baseSalary: 60000, wallet: { balance: 0, transactions: [] } },
  { id: 'admin_delivery', name: 'Barry Allen', email: 'barry.delivery@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-04', adminRole: AdminRole.DELIVERY_ADMIN, baseSalary: 55000, wallet: { balance: 0, transactions: [] } },
  { id: 'admin_market', name: 'Arthur Curry', email: 'arthur.market@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-05', adminRole: AdminRole.MARKET_ADMIN, baseSalary: 55000, wallet: { balance: 0, transactions: [] } },
  { id: 'admin_receptionist', name: 'Lois Lane', email: 'lois.reception@example.com', role: UserRole.ADMIN, mobileNumber: '555-ADMIN-06', adminRole: AdminRole.RECEPTIONIST, baseSalary: 40000, wallet: { balance: 0, transactions: [] } },
  { id: 'staff1', name: 'Alfred Pennyworth', email: 'alfred@example.com', role: UserRole.STAFF, mobileNumber: '555-STAFF-01', baseSalary: 45000, wallet: { balance: 0, transactions: [] } },
  { id: 'shop1', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', role: UserRole.SHOPKEEPER, hasRegisteredShop: true, shopId: 'shop_3', mobileNumber: '7770001111' },
  { id: 'shop_owner_1', name: 'Rajesh Gupta', email: 'rajesh.gupta@example.com', role: UserRole.SHOPKEEPER, hasRegisteredShop: true, shopId: 'shop_2', mobileNumber: '7770002222'},
  { id: 'delivery1', name: 'Karan Yadav', email: 'karan@example.com', role: UserRole.DELIVERY_PARTNER, location: 'Lashkar', mobileNumber: '6660001111', isAvailable: true, rating: 4.9, liveLocation: { lat: 26.20, lng: 78.16 }, wallet: { balance: 250, transactions: [] }, weeklyGoal: 5000, expenses: [], vehicleDetails: { type: VehicleType.BIKE, model: 'Honda Activa', registrationNumber: 'MP07 AB 1234', insuranceExpiry: new Date('2025-05-10'), rcDocumentUrl: '#', insuranceDocumentUrl: '#', drivingLicense: { number: 'MP0720220012345', expiryDate: new Date('2028-10-15'), documentUrl: '#' } }, performance: { customerRating: { average: 4.9, count: 25 }, onTimeRate: 98, recentFeedback: ["Very fast delivery!", "Polite and helpful."] } },
  { id: 'delivery2', name: 'Sunita Patil', email: 'sunita@example.com', role: UserRole.DELIVERY_PARTNER, location: 'Morar', mobileNumber: '6660002222', isAvailable: true, rating: 4.7, liveLocation: { lat: 26.23, lng: 78.24 }, wallet: { balance: 150, transactions: [] }, weeklyGoal: 4500, expenses: [], vehicleDetails: { type: VehicleType.VAN, model: 'Maruti Eeco', registrationNumber: 'MP07 XY 5678', insuranceExpiry: new Date('2024-12-20'), rcDocumentUrl: '#', insuranceDocumentUrl: '#', drivingLicense: { number: 'MP0720210054321', expiryDate: new Date('2027-03-22'), documentUrl: '#' } }, performance: { customerRating: { average: 4.7, count: 30 }, onTimeRate: 95, recentFeedback: ["Good service."] } },
];

const MOCK_SHOPS: Shop[] = [
    { id: 'shop_2', ownerId: 'shop_owner_1', name: 'Bharat Electricals', location: 'Lashkar', address: { street: '55 Nai Sadak', city: 'Gwalior', state: 'MP', zip: '474001' }, rating: 4.8, ratingCount: 25, isVerified: true, isGstRegistered: true, gstNumber: '23ABCDE1234F1Z5', performance: { customerRating: { average: 4.8, count: 25 }, partnerRating: { average: 4.5, count: 10 }, itemReturnRate: 2.5, recentFeedback: ["Great product quality.", "Fast shipping."] } },
    { id: 'shop_3', ownerId: 'shop1', name: 'Modern Plumbing', location: 'DD Nagar', address: { street: '7 Vinay Nagar', city: 'Gwalior', state: 'MP', zip: '474005' }, rating: 4.2, ratingCount: 10, isVerified: true, isGstRegistered: false, performance: { customerRating: { average: 4.2, count: 10 }, partnerRating: { average: 4.0, count: 5 }, itemReturnRate: 5.0, recentFeedback: ["Okay, but could be better packaged."] } },
];

const MOCK_PRODUCTS: Product[] = [
    { id: 'prod_1', shopId: 'shop_2', shopName: 'Bharat Electricals', name: 'Supreme PVC Pipe (1 inch)', category: ServiceCategory.PLUMBING, price: 250, description: 'High-quality, durable PVC pipe suitable for all standard plumbing work.', warranty: { duration: '5 Years', type: 'Replacement', mode: 'Offline' }, discount: 10, hasHomeDelivery: true, quality: ProductQuality.PREMIUM, imageUrl: 'https://via.placeholder.com/300/0059d4/FFFFFF/?text=PVC+Pipe', stock: 150 },
    { id: 'prod_2', shopId: 'shop_2', shopName: 'Bharat Electricals', name: 'Anchor 1.5mm Wire (90m)', category: ServiceCategory.ELECTRICAL, price: 1800, description: 'FR-LSH PVC Insulated Copper Wire for domestic use.', warranty: { duration: '10 Years', type: 'Repair', mode: 'Online' }, hasHomeDelivery: true, quality: ProductQuality.PREMIUM, imageUrl: 'https://via.placeholder.com/300/f77f00/FFFFFF/?text=Wire+Coil', stock: 50 },
    { id: 'prod_3', shopId: 'shop_3', shopName: 'Modern Plumbing', name: 'Standard Faucet Tap', category: ServiceCategory.PLUMBING, price: 450, description: 'Basic and functional faucet for kitchens and bathrooms.', warranty: { duration: '1 Year', type: 'Replacement', mode: 'Offline' }, hasHomeDelivery: false, quality: ProductQuality.STANDARD, imageUrl: 'https://via.placeholder.com/300/cccccc/000000/?text=Faucet', stock: 80 },
    { id: 'prod_4', shopId: 'shop_2', shopName: 'Bharat Electricals', name: 'Legrand Myrius 16A Switch', category: ServiceCategory.ELECTRICAL, price: 120, description: 'Elegant and durable switch for modern homes.', warranty: { duration: '3 Years', type: 'Replacement', mode: 'Online' }, discount: 5, hasHomeDelivery: true, quality: ProductQuality.PREMIUM, imageUrl: 'https://via.placeholder.com/300/3b82f6/FFFFFF/?text=Switch', stock: 200 },
];

const MOCK_ORDERS: Order[] = [];
const MOCK_DELIVERY_REQUESTS: DeliveryRequest[] = [];
const MOCK_PACKERS_MOVERS_REQUESTS: PackersMoversRequest[] = [];

const MOCK_PLATFORM_EXPENSES: Expense[] = [
    { id: 'exp1', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), category: 'Marketing', amount: 5000, description: 'Social Media Campaign' },
    { id: 'exp2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), category: 'Software', amount: 2000, description: 'Cloud Server Costs' },
    { id: 'exp3', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), category: 'Operations', amount: 8500, description: 'Technician Welcome Kits' },
];

const MOCK_EXPENSE_TARGETS: ExpenseTarget[] = [
    { category: 'Marketing', target: 7000 },
    { category: 'Software', target: 2500 },
    { category: 'Operations', target: 10000 },
    { category: 'Salary', target: 50000 },
];

const INITIAL_SERVICES_CONFIG: ServiceConfig[] = [
    { category: ServiceCategory.AC_REPAIR, price: 599 },
    { category: ServiceCategory.PLUMBING, price: 399 },
    { category: ServiceCategory.ELECTRICAL, price: 449 },
    { category: ServiceCategory.GEYSER_REPAIR, price: 499 },
    { category: ServiceCategory.TV_REPAIR, price: 649 },
    { category: ServiceCategory.PAINTING, price: 299 },
    { category: ServiceCategory.CARPENTRY, price: 349 },
    { category: ServiceCategory.APPLIANCE_REPAIR, price: 549 },
    { category: ServiceCategory.OTHER, price: 249 },
];

const INITIAL_OFFERS: Offer[] = [
    { id: 'offer1', title: '10% off your first service', description: 'Get a flat discount on your first booking with us.', isActive: true, discountType: 'percentage', discountValue: 10, appliesTo: 'first_service' },
    { id: 'offer2', title: 'Refer a friend, get ₹50 credit', description: 'Share Lodhi with friends and earn credits for your next service.', isActive: true, discountType: 'fixed', discountValue: 50 },
    { id: 'offer3', title: 'Diwali Special - ₹100 Off', description: 'Flat ₹100 off on all services above ₹999 during the festival season.', isActive: false, discountType: 'fixed', discountValue: 100 },
];

const MOCK_SUPPORT_MESSAGES: SupportMessage[] = [
    { id: 'msg1', senderId: 'admin_ceo', senderName: 'Diana Prince (Admin)', text: 'Welcome to the support channel! Feel free to ask any technical questions here.', timestamp: new Date(Date.now() - 20 * 60000) },
    { id: 'msg2', senderId: 'tech3', senderName: 'David Lee', text: 'Hi team, I have a weird issue with a Voltas AC unit. The compressor tries to start but cuts off immediately. Any ideas?', timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 'msg3', senderId: 'tech2', senderName: 'Charlie Brown', text: 'Hey David, sounds like a faulty capacitor or a voltage issue. Have you checked the capacitor with a multimeter?', timestamp: new Date(Date.now() - 14 * 60000) },
];

const MOCK_TRAINING_VIDEOS: TrainingVideo[] = [
    { id: 'vid1', title: 'Advanced Fault Diagnosis for Inverter ACs', category: ServiceCategory.AC_REPAIR, description: 'Learn to diagnose common and complex issues in modern inverter air conditioners.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'vid2', title: 'Safe Handling of 3-Phase Electrical Wiring', category: ServiceCategory.ELECTRICAL, description: 'A comprehensive guide to safety protocols and procedures for high-voltage systems.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'vid3', title: 'Mastering P-Trap Installation and Repair', category: ServiceCategory.PLUMBING, description: 'Step-by-step instructions for a leak-proof P-trap installation every time.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

const MOCK_INCENTIVE_PROGRAMS: IncentiveProgram[] = [];

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [dashboardView, setDashboardView] = useState<'personal' | 'official'>('official');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [servicesConfig, setServicesConfig] = useState<ServiceConfig[]>(INITIAL_SERVICES_CONFIG);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [supportChatMessages, setSupportChatMessages] = useState<SupportMessage[]>(MOCK_SUPPORT_MESSAGES);
  const [trainingVideos, setTrainingVideos] = useState<TrainingVideo[]>(MOCK_TRAINING_VIDEOS);
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>(MOCK_DELIVERY_REQUESTS);
  const [packersMoversRequests, setPackersMoversRequests] = useState<PackersMoversRequest[]>(MOCK_PACKERS_MOVERS_REQUESTS);
  const [platformExpenses, setPlatformExpenses] = useState<Expense[]>(MOCK_PLATFORM_EXPENSES);
  const [expenseTargets, setExpenseTargets] = useState<ExpenseTarget[]>(MOCK_EXPENSE_TARGETS);
  const [incentivePrograms, setIncentivePrograms] = useState<IncentiveProgram[]>(MOCK_INCENTIVE_PROGRAMS);
  const [userToNotify, setUserToNotify] = useState<User | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Live location simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
        setServiceRequests(prev => prev.map(req => {
            if (req.isLocationSharingActive && req.liveLocation) {
                return {
                    ...req,
                    liveLocation: {
                        lat: req.liveLocation.lat + (Math.random() - 0.5) * 0.001,
                        lng: req.liveLocation.lng + (Math.random() - 0.5) * 0.001,
                    }
                };
            }
            return req;
        }));
        setOrders(prev => prev.map(order => {
            if (order.isDeliveryTrackable && order.liveDeliveryLocation) {
                return {
                    ...order,
                    liveDeliveryLocation: {
                        lat: order.liveDeliveryLocation.lat + (Math.random() - 0.5) * 0.001,
                        lng: order.liveDeliveryLocation.lng + (Math.random() - 0.5) * 0.001,
                    }
                }
            }
            return order;
        }));
    }, 3000); // Update location every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAdminLogin = (userId: string, role: CombinedRole) => {
    const user = users.find(u => u.id === userId && u.role === UserRole.ADMIN && u.adminRole === role);
    if (user) {
        setCurrentUser(user);
        setLoginModalOpen(false);
        setDashboardView('official'); // Default to official view for admins
    } else {
        return 'Invalid User ID or Role for an Admin.';
    }
  };
  
  const handleMobileLogin = (mobile: string) => {
    const user = users.find(u => u.mobileNumber === mobile && u.role !== UserRole.ADMIN);
    if (user) {
        setCurrentUser(user);
        setLoginModalOpen(false);
    } else {
        return 'User with this mobile number not found.';
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const checkAndAwardReferral = (customer: User) => {
    if (!customer.referredBy) return;

    // Check if this is the customer's very first completed transaction
    const hasCompletedBefore = [
        ...serviceRequests.filter(r => r.customerId === customer.id && r.status === ServiceStatus.COMPLETED),
        ...orders.filter(o => o.customerId === customer.id && o.status === OrderStatus.DELIVERED)
    ].length > 1; // Check for more than 1, as the current one is about to be completed

    if (hasCompletedBefore) return;

    setUsers(prevUsers => prevUsers.map(u => {
        if (u.referralCode === customer.referredBy) {
            const updatedUser = { ...u };
            // Update loyalty points
            const newLoyalty: Loyalty = {
                points: (u.loyalty?.points || 0) + 1000,
                tier: u.loyalty?.tier || 'Bronze'
            };
             if (newLoyalty.points >= 7500) newLoyalty.tier = 'Gold';
            else if (newLoyalty.points >= 2000) newLoyalty.tier = 'Silver';
            updatedUser.loyalty = newLoyalty;
            
            // Add referral bonus to wallet
            const referralBonus: Transaction = {
                id: `txn_ref_${Date.now()}`,
                date: new Date(),
                amount: 1000,
                description: `Referral bonus for ${customer.name}`,
                source: 'Referral Bonus'
            };
            const newWallet: Wallet = {
                balance: (u.wallet?.balance || 0) + 1000,
                transactions: [...(u.wallet?.transactions || []), referralBonus]
            };
            updatedUser.wallet = newWallet;
            
            // Update successful referrals list
            updatedUser.successfulReferrals = [...(u.successfulReferrals || []), customer.id];
            
            return updatedUser;
        }
        return u;
    }));
  };

  const handleSendMessage = (requestId: string, text: string) => {
    if (!currentUser) return;
    const newMessage = { senderId: currentUser.id, text, timestamp: new Date() };

    setServiceRequests(prev => 
        prev.map(req => 
            req.id === requestId 
            ? { ...req, chatHistory: [...(req.chatHistory || []), newMessage] }
            : req
        )
    );
  };
  
  const handleAssignTechnician = (requestId: string, technician: User) => {
      setServiceRequests(prev => 
          prev.map(req => 
              req.id === requestId 
              ? { ...req, technicianId: technician.id, technicianName: technician.name, status: ServiceStatus.ACCEPTED }
              : req
          )
      );
  };

  const handleAddNewTechnician = (newTechnician: Omit<User, 'id' | 'role' | 'rating' | 'technicianId'>) => {
    const specialty = newTechnician.specialty || ServiceCategory.OTHER;
    const newUser: User = {
        ...newTechnician,
        id: `tech_${Date.now()}`,
        role: UserRole.TECHNICIAN,
        technicianId: generateTechnicianId(specialty),
        rating: 0,
        isAvailable: true,
        paymentHistory: [],
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleResolveComplaint = (requestId: string, remark: string) => {
    setServiceRequests(prev => prev.map(req => {
        if(req.id === requestId && req.complaint) {
            return { ...req, complaint: { ...req.complaint, isResolved: true, resolutionRemark: remark } };
        }
        return req;
    }));
  };
  
  const handleEscalateComplaint = (requestId: string, newLevel: AdminRole) => {
      setServiceRequests(prev => prev.map(req => {
          if (req.id === requestId && req.complaint) {
              return { ...req, complaint: { ...req.complaint, escalationLevel: newLevel } };
          }
          return req;
      }));
  };

  const handleFileComplaint = (requestId: string, complaintText: string) => {
    setServiceRequests(prev => prev.map(req => {
        if(req.id === requestId) {
            return { 
                ...req, 
                complaint: { 
                    id: generateComplaintId(),
                    text: complaintText, 
                    isResolved: false,
                    escalationLevel: AdminRole.RECEPTIONIST,
                } 
            };
        }
        return req;
    }));
  };

  const handleCompleteServicePayment = (requestId: string) => {
    const request = serviceRequests.find(r => r.id === requestId);
    if (!request || !request.bill) return;

    const customer = users.find(u => u.id === request.customerId);
    if(customer) {
        checkAndAwardReferral(customer);
    }
    
    setServiceRequests(prev => prev.map(r => 
        r.id === requestId 
        ? { ...r, status: ServiceStatus.COMPLETED, bill: { ...r.bill!, isPaid: true } }
        : r
    ));
  };
  
  const handleUpdateServicePrice = (category: ServiceCategory, newPrice: number) => {
    setServicesConfig(prev => prev.map(s => s.category === category ? { ...s, price: newPrice } : s));
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    setOffers(prev => {
        const offerExists = prev.some(o => o.id === updatedOffer.id);
        if (offerExists) {
            return prev.map(o => o.id === updatedOffer.id ? updatedOffer : o);
        }
        return [...prev, updatedOffer];
    });
  };

  const handleSendSupportMessage = (text: string) => {
    if (!currentUser) return;
    const newMessage: SupportMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.role === UserRole.ADMIN ? `${currentUser.name} (Admin)` : currentUser.name,
        text,
        timestamp: new Date()
    };
    setSupportChatMessages(prev => [...prev, newMessage]);
  };

  const handleAddNewVideo = (video: Omit<TrainingVideo, 'id'>) => {
    const newVideo: TrainingVideo = {
        ...video,
        id: `vid_${Date.now()}`
    };
    setTrainingVideos(prev => [newVideo, ...prev]);
  };

  const handleUpdateProduct = (product: Product) => {
      setProducts(prev => {
          const exists = prev.some(p => p.id === product.id);
          if (exists) {
              return prev.map(p => p.id === product.id ? product : p);
          }
          return [...prev, product];
      });
  };

  const handleVerifyShop = (shopId: string, isVerified: boolean) => {
      setShops(prev => prev.map(s => s.id === shopId ? { ...s, isVerified } : s));
  };

  const handleRegisterShop = (shopData: Omit<Shop, 'id' | 'ownerId' | 'rating' | 'ratingCount' | 'isVerified'>) => {
      if (!currentUser || currentUser.role !== UserRole.SHOPKEEPER) return;

      const newShop: Shop = {
          ...shopData,
          id: `shop_${Date.now()}`,
          ownerId: currentUser.id,
          rating: 0,
          ratingCount: 0,
          isVerified: false,
          performance: { customerRating: { average: 0, count: 0 }, partnerRating: { average: 0, count: 0 }, itemReturnRate: 0, recentFeedback: [] }
      };
      
      setShops(prev => [...prev, newShop]);
      
      const updatedUser = { ...currentUser, hasRegisteredShop: true, shopId: newShop.id };
      
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
  };
  
  const handleBuyProduct = (product: Product, billingAddress: DetailedAddress, paymentMode: PaymentMode) => {
    if (!currentUser) throw new Error("User not logged in");
    
    const shop = shops.find(s => s.id === product.shopId);
    if (!shop) throw new Error("Shop not found");

    const basePrice = product.price * (1 - (product.discount || 0) / 100);
    const advancePaymentDiscount = paymentMode === PaymentMode.ADVANCE ? 40 : 0;
    const finalPrice = basePrice - advancePaymentDiscount;

    const newOrder: Order = {
        id: generateOrderId(),
        customerId: currentUser.id,
        customerName: currentUser.name,
        product,
        shop,
        status: OrderStatus.PLACED,
        orderDate: new Date(),
        billingAddress,
        totalAmount: finalPrice,
        payment: {
            mode: paymentMode,
            status: paymentMode === PaymentMode.ADVANCE ? PaymentStatus.PAID : PaymentStatus.PENDING,
            discountApplied: advancePaymentDiscount > 0 ? advancePaymentDiscount : undefined,
        }
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleGenerateBillForOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const subtotal = o.totalAmount;
        const billWithGst = {
          subtotal,
          gst: subtotal * 0.18,
          total: subtotal * 1.18
        };
        const billWithoutGst = {
          subtotal,
          gst: 0,
          total: subtotal
        };
        return { 
          ...o, 
          bill: {
            withGst: billWithGst,
            withoutGst: billWithoutGst,
          }
        };
      }
      return o;
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      
      const order = orders.find(o => o.id === orderId);
      if (order && status === OrderStatus.DELIVERED) {
          const customer = users.find(u => u.id === order.customerId);
          if (customer) {
              checkAndAwardReferral(customer);
          }
      }
  };

  const handleRateExperience = (orderId: string, shopRating: number, partnerRating: number, comment: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Update Shop Performance
    setShops(prev => prev.map(s => {
        if (s.id === order.shop.id) {
            const newCount = s.performance.customerRating.count + 1;
            const newAvg = ((s.performance.customerRating.average * s.performance.customerRating.count) + shopRating) / newCount;
            const newFeedback = s.performance.recentFeedback;
            if (comment) newFeedback.unshift(comment);
            
            return { 
                ...s, 
                performance: { 
                    ...s.performance, 
                    customerRating: { average: newAvg, count: newCount },
                    recentFeedback: newFeedback.slice(0, 5)
                } 
            };
        }
        return s;
    }));

    // Update Partner Performance
    if (order.delivery?.partnerId) {
        setUsers(prev => prev.map(u => {
            if (u.id === order.delivery?.partnerId) {
                const perf = u.performance!;
                const newCount = perf.customerRating.count + 1;
                const newAvg = ((perf.customerRating.average * perf.customerRating.count) + partnerRating) / newCount;
                 const newFeedback = perf.recentFeedback;
                if (comment) newFeedback.unshift(comment);

                return {
                    ...u,
                    performance: {
                        ...perf,
                        customerRating: { average: newAvg, count: newCount },
                        recentFeedback: newFeedback.slice(0, 5)
                    }
                }
            }
            return u;
        }));
    }

    // Mark order as rated
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isExperienceRated: true } : o));
  };
  
   const handleRateShopByPartner = (orderId: string, rating: number, comment: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        setShops(prev => prev.map(s => {
            if (s.id === order.shop.id) {
                const newCount = s.performance.partnerRating.count + 1;
                const newAvg = ((s.performance.partnerRating.average * s.performance.partnerRating.count) + rating) / newCount;
                return {
                    ...s,
                    performance: {
                        ...s.performance,
                        partnerRating: { average: newAvg, count: newCount }
                    }
                };
            }
            return s;
        }));
        
        // This logic needs to be flexible for different request types in the future
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isShopRatedByPartner: true } : o));
   };


  const handleToggleLocationSharing = (type: 'service' | 'order', id: string, isActive: boolean) => {
      if (type === 'service') {
          setServiceRequests(prev => prev.map(req => {
              if (req.id === id) {
                  return {
                      ...req,
                      isLocationSharingActive: isActive,
                      liveLocation: isActive ? { lat: 26.2183, lng: 78.1828 } : undefined
                  };
              }
              return req;
          }));
      } else {
          setOrders(prev => prev.map(order => {
              if (order.id === id) {
                  return {
                      ...order,
                      isDeliveryTrackable: isActive,
                      liveDeliveryLocation: isActive ? { lat: 26.2183, lng: 78.1828 } : undefined
                  }
              }
              return order;
          }));
      }
  };

  const handleAssignDeliveryPartner = (orderId: string, partner: User) => {
    setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            return {
                ...o,
                delivery: {
                    ...o.delivery,
                    partnerId: partner.id,
                    partnerName: partner.name,
                    status: DeliveryStatus.ASSIGNED,
                }
            };
        }
        return o;
    }));
  };

  const handleUpdateDeliveryStatus = (orderId: string, status: DeliveryStatus) => {
      setOrders(prev => prev.map(o => {
          if (o.id === orderId && o.delivery) {
              let newOrderStatus = o.status;
              if (status === DeliveryStatus.DELIVERED) {
                  newOrderStatus = OrderStatus.DELIVERED;
              } else if (status === DeliveryStatus.EN_ROUTE) {
                  newOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
              }
              return {
                  ...o,
                  status: newOrderStatus,
                  delivery: {
                      ...o.delivery,
                      status: status,
                  },
              };
          }
          return o;
      }));
  };

  const handleUpdateSalary = (userId: string, newSalary: number) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, baseSalary: newSalary } : u));
  };

  const handleAwardBonus = (userId: string, amount: number, reason: string) => {
      setUsers(prev => prev.map(u => {
          if (u.id === userId) {
              const newTransaction: Transaction = {
                  id: `txn_${Date.now()}`,
                  date: new Date(),
                  amount: amount,
                  description: reason,
                  source: 'Bonus'
              };
              const newWallet = {
                  balance: (u.wallet?.balance || 0) + amount,
                  transactions: [...(u.wallet?.transactions || []), newTransaction]
              };
              return { ...u, wallet: newWallet };
          }
          return u;
      }));
  };

  const handleUpdateIncentive = (incentive: IncentiveProgram) => {
      setIncentivePrograms(prev => {
          const exists = prev.some(p => p.id === incentive.id);
          if (exists) {
              return prev.map(p => p.id === incentive.id ? incentive : p);
          }
          return [...prev, incentive];
      });
  };
  
  const handleUpdateWeeklyGoal = (userId: string, goal: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, weeklyGoal: goal } : u));
  };
  
  const handleAddExpense = (userId: string, expense: Omit<Expense, 'id'>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newExpenses = [...(u.expenses || []), { ...expense, id: `exp_${Date.now()}` }];
        return { ...u, expenses: newExpenses };
      }
      return u;
    }));
  };
  
  const handleUpdateAttendance = (userId: string, date: string, status: 'Present' | 'Absent' | 'Leave') => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newAttendance = { ...(u.attendance || {}), [date]: status };
        return { ...u, attendance: newAttendance };
      }
      return u;
    }));
  };

  const handleRequestDelivery = (requestData: Omit<DeliveryRequest, 'id' | 'shopId' | 'shopName' | 'status' | 'createdAt' | 'pickupAddress' | 'fee'>) => {
      if (!currentUser || !currentUser.shopId) return;
      const shop = shops.find(s => s.id === currentUser!.shopId);
      if (!shop) return;
      
      const newRequest: DeliveryRequest = {
        ...requestData,
        id: generateDeliveryId(),
        shopId: shop.id,
        shopName: shop.name,
        pickupAddress: shop.address,
        status: DeliveryRequestStatus.REQUESTED,
        createdAt: new Date(),
        fee: 50, // Mock fee
      };
      setDeliveryRequests(prev => [newRequest, ...prev]);
  }

  const handleRequestPackersMovers = (requestData: Omit<PackersMoversRequest, 'id' | 'customerId' | 'customerName' | 'status' | 'createdAt' | 'fee'>) => {
    if (!currentUser) return;
    const newRequest: PackersMoversRequest = {
        ...requestData,
        id: `PM-${Date.now()}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        status: DeliveryRequestStatus.REQUESTED,
        createdAt: new Date(),
        fee: 250, // Mock fee
    };
    setPackersMoversRequests(prev => [newRequest, ...prev]);
  };

  const handleAssignPartnerToDelivery = (requestId: string, requestType: 'shop' | 'packersMovers', partner: User) => {
      if (requestType === 'shop') {
          setDeliveryRequests(prev => prev.map(req => 
              req.id === requestId 
              ? { ...req, deliveryPartnerId: partner.id, deliveryPartnerName: partner.name, status: DeliveryRequestStatus.ASSIGNED }
              : req
          ));
      } else {
          setPackersMoversRequests(prev => prev.map(req =>
              req.id === requestId
              ? { ...req, deliveryPartnerId: partner.id, deliveryPartnerName: partner.name, status: DeliveryRequestStatus.ASSIGNED }
              : req
          ));
      }
  };

  const handleAcceptDeliveryRequest = (requestId: string, requestType: 'shop' | 'packersMovers') => {
    if (!currentUser || currentUser.role !== UserRole.DELIVERY_PARTNER) return;
    
    if (requestType === 'shop') {
      setDeliveryRequests(prev => prev.map(req => 
        req.id === requestId 
        ? { ...req, deliveryPartnerId: currentUser.id, deliveryPartnerName: currentUser.name, status: DeliveryRequestStatus.ASSIGNED }
        : req
      ));
    } else {
      setPackersMoversRequests(prev => prev.map(req =>
        req.id === requestId
        ? { ...req, deliveryPartnerId: currentUser.id, deliveryPartnerName: currentUser.name, status: DeliveryRequestStatus.ASSIGNED }
        : req
      ));
    }
  };

  const handleUpdateDeliveryRequestStatus = (requestId: string, requestType: 'shop' | 'packersMovers', status: DeliveryRequestStatus) => {
    if (requestType === 'shop') {
      setDeliveryRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
    } else {
      setPackersMoversRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status } : req
      ));
    }
  };


  const renderDashboard = () => {
    if (!currentUser) {
      return (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to Lodhi!</h1>
          </div>
      );
    }

    if(currentUser.role === UserRole.ADMIN && dashboardView === 'personal') {
        return <StaffDashboard user={currentUser} />
    }
    
    switch (currentUser.role) {
      case UserRole.CUSTOMER:
        return <CustomerDashboard 
                    user={currentUser} 
                    requests={serviceRequests.filter(r => r.customerId === currentUser.id)} 
                    onFileComplaint={handleFileComplaint}
                    servicesConfig={servicesConfig}
                    offers={offers}
                    onSendMessage={handleSendMessage}
                    products={products}
                    shops={shops}
                    orders={orders.filter(o => o.customerId === currentUser.id)}
                    onBuyProduct={handleBuyProduct}
                    onRateExperience={handleRateExperience}
                    onCompletePayment={handleCompleteServicePayment}
                    onPackersMoversRequest={handleRequestPackersMovers}
                />;
      case UserRole.TECHNICIAN:
        return <TechnicianDashboard 
                    user={currentUser} 
                    requests={serviceRequests} 
                    setRequests={setServiceRequests} 
                    servicesConfig={servicesConfig}
                    offers={offers}
                    supportMessages={supportChatMessages}
                    onSendSupportMessage={handleSendSupportMessage}
                    trainingVideos={trainingVideos}
                    onSendMessage={handleSendMessage}
                    onToggleLocationShare={(reqId, isActive) => handleToggleLocationSharing('service', reqId, isActive)}
                    onUpdateWeeklyGoal={handleUpdateWeeklyGoal}
                    onUpdateAttendance={handleUpdateAttendance}
                />;
      case UserRole.ADMIN:
        return <AdminDashboard 
                    user={currentUser}
                    allRequests={serviceRequests}
                    allUsers={users}
                    servicesConfig={servicesConfig}
                    offers={offers}
                    supportMessages={supportChatMessages}
                    trainingVideos={trainingVideos}
                    shops={shops}
                    products={products}
                    orders={orders}
                    deliveryRequests={deliveryRequests}
                    packersMoversRequests={packersMoversRequests}
                    platformExpenses={platformExpenses}
                    expenseTargets={expenseTargets}
                    incentivePrograms={incentivePrograms}
                    onAssignTechnician={handleAssignTechnician}
                    onAddNewTechnician={handleAddNewTechnician}
                    onResolveComplaint={handleResolveComplaint}
                    onEscalateComplaint={handleEscalateComplaint}
                    onUpdateServicePrice={handleUpdateServicePrice}
                    onUpdateOffer={handleUpdateOffer}
                    onSendSupportMessage={handleSendSupportMessage}
                    onAddNewVideo={handleAddNewVideo}
                    onVerifyShop={handleVerifyShop}
                    onAssignDeliveryPartner={handleAssignDeliveryPartner}
                    onAssignPartnerToDelivery={handleAssignPartnerToDelivery}
                    onUpdateSalary={handleUpdateSalary}
                    onAwardBonus={handleAwardBonus}
                    onUpdateIncentive={handleUpdateIncentive}
                    onNotifyUser={(userToNotify) => setUserToNotify(userToNotify)}
                />;
      case UserRole.SHOPKEEPER:
        return <ShopkeeperDashboard 
                  user={currentUser} 
                  products={products.filter(p => p.shopId === currentUser.shopId)}
                  shop={shops.find(s => s.id === currentUser.shopId) || null}
                  orders={orders.filter(o => o.shop.id === currentUser.shopId)}
                  deliveryRequests={deliveryRequests.filter(dr => dr.shopId === currentUser.shopId)}
                  onUpdateProduct={handleUpdateProduct}
                  onRegisterShop={handleRegisterShop}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  onGenerateBill={handleGenerateBillForOrder}
                  onToggleDeliveryTracking={(orderId, isActive) => handleToggleLocationSharing('order', orderId, isActive)}
                  onRequestDelivery={handleRequestDelivery}
                />;
      case UserRole.DELIVERY_PARTNER:
        return <DeliveryDashboard
                    user={currentUser}
                    deliveryRequests={deliveryRequests}
                    packersMoversRequests={packersMoversRequests}
                    orders={orders}
                    onAcceptRequest={handleAcceptDeliveryRequest}
                    onUpdateRequestStatus={handleUpdateDeliveryRequestStatus}
                    onUpdateWeeklyGoal={handleUpdateWeeklyGoal}
                    onAddExpense={handleAddExpense}
                    onRateShop={handleRateShopByPartner}
                />
      case UserRole.STAFF:
        return <StaffDashboard user={currentUser} />
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <LanguageProvider>
        <ThemeProvider>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <Header user={currentUser} onLogin={() => setLoginModalOpen(true)} onLogout={handleLogout} isAdminView={currentUser?.role === UserRole.ADMIN} dashboardView={dashboardView} onViewChange={setDashboardView} />
                <main className={`transition-all duration-300 ${currentUser?.role === UserRole.ADMIN ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8'} pt-28 pb-12`}>
                   {renderDashboard()}
                </main>
                <LoginModal 
                    isOpen={isLoginModalOpen} 
                    onClose={() => setLoginModalOpen(false)}
                    onAdminLogin={handleAdminLogin}
                    onMobileLogin={handleMobileLogin}
                    users={users}
                />
                 <NotificationSimulator 
                    isOpen={!!userToNotify}
                    onClose={() => setUserToNotify(null)}
                    user={userToNotify}
                />
            </div>
        </ThemeProvider>
    </LanguageProvider>
  );
};


// Main App component with providers
const App: React.FC = () => {
    return <AppContent />;
};

export default App;