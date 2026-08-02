// ==========================================================================
// HomeFix Admin Dashboard - Clean Initial State (No Fake Data)
// ==========================================================================

export const INITIAL_BOOKINGS = [];

export const INITIAL_TECHNICIANS = [];

export const INITIAL_APPLICATIONS = [];

export const INITIAL_CUSTOMERS = [];

export const INITIAL_ADMIN_USERS = [
  {
    id: 'ADM-01',
    name: 'Sherhan Abid',
    email: 'admin@homefix.in',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Just Now',
    permissions: ['all']
  }
];

export const INITIAL_ACTIVITY_LOGS = [];

export const INITIAL_SETTINGS = {
  platformCommissionPercent: 15,
  emergencySurgeFee: 99,
  bookingRadiusKm: 15,
  otpExpiryMinutes: 5,
  paymentGatewayMode: 'Razorpay / UPI Live',
  supportEmail: 'support@homefixkerala.com',
  supportPhone: '+91 (497) 270-HOME',
  maintenanceMode: false
};
