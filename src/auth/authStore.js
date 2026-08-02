// ==========================================================================
// HomeFix Central Authentication & Multi-Role Session Store
// ==========================================================================

const USERS_KEY = 'homefix_registered_users';
const CURRENT_USER_KEY = 'homefix_current_user';

// Default initial accounts if empty
const INITIAL_USERS = [
  {
    id: 'CUST-101',
    role: 'customer',
    name: 'Anjali Menon',
    phone: '9847012345',
    email: 'anjali@gmail.com',
    password: 'password123',
    city: 'Kannur',
    status: 'approved',
    joinedDate: '2026-08-01'
  },
  {
    id: 'TECH-201',
    role: 'technician',
    name: 'Rajesh Kumar',
    phone: '9447098765',
    email: 'rajesh.k@homefix.in',
    password: 'password123',
    category: 'Electrician',
    experience: '5+ Years',
    city: 'Kannur',
    status: 'approved',
    rating: 4.9,
    completedJobs: 142
  },
  {
    id: 'TECH-202',
    role: 'technician',
    name: 'Suresh Babu',
    phone: '9847055555',
    email: 'suresh.babu@gmail.com',
    password: 'password123',
    category: 'Plumber',
    experience: '3 Years',
    city: 'Kozhikode',
    status: 'pending',
    rating: 5.0,
    completedJobs: 0
  },
  {
    id: 'ADM-001',
    role: 'admin',
    name: 'Sherhan Abid',
    phone: '9000000000',
    email: 'admin@homefix.in',
    password: 'admin123',
    status: 'approved'
  }
];

export function getRegisteredUsers() {
  const saved = localStorage.getItem(USERS_KEY);
  if (!saved) {
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(saved);
}

export function getCurrentUser() {
  const saved = localStorage.getItem(CURRENT_USER_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function loginWithCredentials({ phoneOrEmail, password }) {
  const users = getRegisteredUsers();
  const query = phoneOrEmail.trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');

  const user = users.find(u => {
    const cleanPhone = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
    const cleanEmail = u.email ? u.email.toLowerCase() : '';
    return (cleanPhone === query || cleanEmail === query) && u.password === password;
  });

  if (!user) {
    return { success: false, error: 'Invalid phone number / email or password.' };
  }

  // Save session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function registerCustomer({ name, phone, email, password }) {
  const users = getRegisteredUsers();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const existing = users.find(u => u.phone === cleanPhone);
  if (existing) {
    return { success: false, error: 'An account with this phone number already exists.' };
  }

  const newUser = {
    id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    role: 'customer',
    name,
    phone: cleanPhone,
    email: email || `${cleanPhone}@homefix.in`,
    password,
    city: 'Kannur',
    status: 'approved',
    joinedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export function registerTechnician(techData) {
  const users = getRegisteredUsers();
  const cleanPhone = techData.phone.replace(/[^0-9]/g, '');

  const existing = users.find(u => u.phone === cleanPhone);
  if (existing) {
    return { success: false, error: 'A technician account with this phone number already exists.' };
  }

  const newTech = {
    id: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
    role: 'technician',
    name: techData.name,
    phone: cleanPhone,
    email: techData.email || `${cleanPhone}@partner.homefix.in`,
    password: techData.password,
    category: techData.category || 'Electrician',
    experience: techData.experience || '1-3 Years',
    city: techData.city || 'Kannur',
    serviceAreas: techData.serviceAreas || 'Kannur Central',
    govId: techData.govId || 'Aadhaar Verified',
    bankAccount: techData.bankAccount || 'Kerala Bank',
    upiId: techData.upiId || `${cleanPhone}@upi`,
    status: 'pending', // Requires admin review
    rating: 5.0,
    completedJobs: 0,
    appliedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newTech];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

  // Also save to homefix_live_applications for Admin portal
  const existingApps = JSON.parse(localStorage.getItem('homefix_live_applications') || '[]');
  localStorage.setItem('homefix_live_applications', JSON.stringify([newTech, ...existingApps]));

  return { success: true, user: newTech };
}

export function resetPassword({ phone, newPassword }) {
  const users = getRegisteredUsers();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const index = users.findIndex(u => u.phone === cleanPhone);
  if (index === -1) {
    return { success: false, error: 'No account found matching this phone number.' };
  }

  users[index].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // If current logged-in user reset password, update session
  const current = getCurrentUser();
  if (current && current.phone === cleanPhone) {
    current.password = newPassword;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
  }

  return { success: true };
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
