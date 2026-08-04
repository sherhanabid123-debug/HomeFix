// ==========================================================================
// HomeFix Central Authentication & Multi-Role Session Store
// ==========================================================================

const USERS_KEY = 'homefix_registered_users';
const CURRENT_USER_KEY = 'homefix_current_user';

// Default initial accounts if empty
const INITIAL_USERS = [];

export function getRegisteredUsers() {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    if (!saved || saved === 'undefined' || saved === 'null') {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_USERS;
  } catch (e) {
    console.error("Error parsing registered users:", e);
    localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
}

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (!saved || saved === 'undefined' || saved === 'null') return null;
    const parsed = JSON.parse(saved);
    return (parsed && typeof parsed === 'object') ? parsed : null;
  } catch (e) {
    console.error("Error parsing current user session:", e);
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

export function findExistingUser(phoneOrEmail) {
  const users = getRegisteredUsers();
  const rawInput = phoneOrEmail ? phoneOrEmail.trim() : '';
  const cleanPhone = rawInput.replace(/[^0-9]/g, '');
  const cleanEmail = rawInput.toLowerCase();

  if (!rawInput) return null;

  return users.find(u => {
    const uPhone = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
    const uEmail = u.email ? u.email.toLowerCase() : '';
    return (cleanPhone && uPhone === cleanPhone) || (cleanEmail && uEmail === cleanEmail);
  });
}

export function loginWithCredentials({ phoneOrEmail, password, name = '' }) {
  const users = getRegisteredUsers();
  const existingUser = findExistingUser(phoneOrEmail);

  if (existingUser) {
    if (existingUser.password && password && existingUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    // If account exists, log in normally!
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existingUser));
    return { success: true, user: existingUser, isNewAccount: false };
  }

  // If NO account exists, automatically create a new customer account!
  const rawInput = phoneOrEmail ? phoneOrEmail.trim() : '';
  const cleanPhone = rawInput.replace(/[^0-9]/g, '');
  const isEmail = rawInput.includes('@');
  const autoName = name.trim() || (isEmail ? rawInput.split('@')[0] : `Customer (${cleanPhone || rawInput})`);

  const newCustomer = {
    id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
    role: 'customer',
    name: autoName,
    phone: cleanPhone || rawInput,
    email: isEmail ? rawInput : '',
    password: password || 'defaultpass123',
    city: 'Kannur',
    status: 'approved',
    joinedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newCustomer];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newCustomer));

  return { success: true, user: newCustomer, isNewAccount: true };
}

export function registerCustomer({ name, phone, email, password }) {
  const users = getRegisteredUsers();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  if (users.some(u => u.phone.replace(/[^0-9]/g, '') === cleanPhone)) {
    return { success: false, error: 'An account with this phone number already exists.' };
  }

  const newCustomer = {
    id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
    role: 'customer',
    name: name.trim(),
    phone: cleanPhone,
    email: email ? email.trim() : '',
    password,
    city: 'Kannur',
    status: 'approved',
    joinedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newCustomer];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newCustomer));

  return { success: true, user: newCustomer };
}

export function registerTechnician(data) {
  const users = getRegisteredUsers();
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');

  if (users.some(u => u.phone.replace(/[^0-9]/g, '') === cleanPhone)) {
    return { success: false, error: 'An account with this phone number already exists.' };
  }

  const newTech = {
    id: `TECH-${Math.floor(200 + Math.random() * 800)}`,
    role: 'technician',
    name: data.name.trim(),
    phone: cleanPhone,
    email: data.email ? data.email.trim() : '',
    password: data.password,
    category: data.category || 'Electrician',
    experience: data.experience || '1-3 Years',
    city: data.city || 'Kannur',
    serviceAreas: data.serviceAreas || 'Kannur Central',
    govId: data.govId || '',
    bankAccount: data.bankAccount || '',
    upiId: data.upiId || '',
    status: 'pending', // Under review by Admin
    rating: 5.0,
    completedJobs: 0,
    appliedDate: new Date().toISOString().slice(0, 10)
  };

  const updatedUsers = [...users, newTech];
  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newTech));

  // Sync with Admin Applications store
  try {
    const savedApps = localStorage.getItem('homefix_live_applications');
    const apps = savedApps ? JSON.parse(savedApps) : [];
    const newApp = {
      id: newTech.id,
      name: newTech.name,
      phone: newTech.phone,
      email: newTech.email || `${newTech.phone}@homefix.in`,
      trade: newTech.category || 'Electrician',
      experience: newTech.experience || '1-3 Years',
      city: newTech.city || 'Kannur',
      status: 'Pending',
      appliedDate: newTech.appliedDate,
      photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      documents: ['Aadhaar Card (Uploaded)', 'Trade Certificate']
    };
    localStorage.setItem('homefix_live_applications', JSON.stringify([newApp, ...apps]));
  } catch (e) {
    console.error("Error updating live applications store:", e);
  }

  return { success: true, user: newTech };
}

export function resetPassword({ phone, newPassword }) {
  const users = getRegisteredUsers();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const index = users.findIndex(u => u.phone.replace(/[^0-9]/g, '') === cleanPhone);
  if (index === -1) {
    return { success: false, error: 'No account found matching this phone number.' };
  }

  users[index].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true };
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
