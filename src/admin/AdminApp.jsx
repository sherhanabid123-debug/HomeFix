import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import DashboardOverview from './components/DashboardOverview';
import BookingsManagement from './components/BookingsManagement';
import TechnicianManagement from './components/TechnicianManagement';
import TechnicianApplications from './components/TechnicianApplications';
import CustomerManagement from './components/CustomerManagement';
import PaymentsManagement from './components/PaymentsManagement';
import ReviewsManagement from './components/ReviewsManagement';
import NotificationsCenter from './components/NotificationsCenter';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PlatformSettings from './components/PlatformSettings';
import AdminUsers from './components/AdminUsers';
import CustomerInquiries from './components/CustomerInquiries';

import { 
  INITIAL_BOOKINGS, 
  INITIAL_TECHNICIANS, 
  INITIAL_APPLICATIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ADMIN_USERS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_SETTINGS 
} from './mockData';

export default function AdminApp() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homefix_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Central Store State (persisted & synced with customer web bookings)
  const [bookings, setBookingsState] = useState(() => {
    const saved = localStorage.getItem('homefix_live_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [technicians, setTechniciansState] = useState(() => {
    const saved = localStorage.getItem('homefix_live_technicians');
    return saved ? JSON.parse(saved) : INITIAL_TECHNICIANS;
  });

  const loadApplications = () => {
    try {
      const savedApps = localStorage.getItem('homefix_live_applications');
      const customApps = (savedApps && savedApps !== 'undefined') ? JSON.parse(savedApps) : [];
      
      const savedUsers = localStorage.getItem('homefix_registered_users');
      const users = (savedUsers && savedUsers !== 'undefined') ? JSON.parse(savedUsers) : [];
      const userTechApps = users
        .filter(u => u.role === 'technician')
        .map(u => ({
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email && !u.email.includes('@homefix.in') ? u.email : '',
          trade: u.category || 'Electrician',
          experience: u.experience || '1-3 Years',
          city: u.city || 'Kannur',
          status: u.status === 'approved' ? 'Approved' : (u.status === 'rejected' ? 'Rejected' : 'Pending'),
          appliedDate: u.appliedDate || new Date().toISOString().slice(0, 10)
        }));
      
      const combined = [...customApps, ...userTechApps, ...INITIAL_APPLICATIONS];
      const uniqueMap = new Map();
      combined.forEach(item => {
        if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
      });
      return Array.from(uniqueMap.values());
    } catch (e) {
      return INITIAL_APPLICATIONS;
    }
  };

  const [applications, setApplicationsState] = useState(() => loadApplications());

  const setApplications = (newApps) => {
    setApplicationsState(newApps);
    localStorage.setItem('homefix_live_applications', JSON.stringify(newApps));
  };

  const loadInquiries = () => {
    try {
      const saved = localStorage.getItem('homefix_live_faq_questions');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const [inquiries, setInquiriesState] = useState(() => loadInquiries());

  const setInquiries = (newInqs) => {
    setInquiriesState(newInqs);
    localStorage.setItem('homefix_live_faq_questions', JSON.stringify(newInqs));
  };

  const [customers, setCustomersState] = useState(() => {
    const saved = localStorage.getItem('homefix_live_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);

  const [logs, setLogsState] = useState(() => {
    const saved = localStorage.getItem('homefix_live_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // Sync state with localStorage setters
  const setBookings = (newBookings) => {
    setBookingsState(newBookings);
    localStorage.setItem('homefix_live_bookings', JSON.stringify(newBookings));
  };

  const setTechnicians = (newTechs) => {
    setTechniciansState(newTechs);
    localStorage.setItem('homefix_live_technicians', JSON.stringify(newTechs));
  };

  const setCustomers = (newCusts) => {
    setCustomersState(newCusts);
    localStorage.setItem('homefix_live_customers', JSON.stringify(newCusts));
  };

  // Live Auto-Refresh sync on tab switch or focus
  useEffect(() => {
    const syncData = () => {
      const savedBookings = localStorage.getItem('homefix_live_bookings');
      if (savedBookings) setBookingsState(JSON.parse(savedBookings));

      const savedLogs = localStorage.getItem('homefix_live_logs');
      if (savedLogs) setLogsState(JSON.parse(savedLogs));

      const savedCusts = localStorage.getItem('homefix_live_customers');
      if (savedCusts) setCustomersState(JSON.parse(savedCusts));

      const savedTechs = localStorage.getItem('homefix_live_technicians');
      if (savedTechs) setTechniciansState(JSON.parse(savedTechs));

      setApplicationsState(loadApplications());
      setInquiriesState(loadInquiries());
    };

    syncData();
    window.addEventListener('focus', syncData);
    return () => window.removeEventListener('focus', syncData);
  }, [activeTab]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('homefix_admin_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('homefix_admin_user');
  };

  const handleApproveApplicant = (applicant) => {
    const newTech = {
      id: `TECH-${Math.floor(220 + Math.random() * 100)}`,
      name: applicant.name,
      phone: applicant.phone,
      email: applicant.email,
      category: applicant.trade,
      photo: applicant.photo,
      rating: 5.0,
      jobsCompleted: 0,
      status: 'Online',
      city: applicant.city,
      serviceAreas: `${applicant.city} Central`,
      languages: 'Malayalam, English',
      govIdType: 'Aadhaar Card',
      govIdNumber: 'Verified',
      bankName: 'Kerala Bank',
      accountNumber: 'XXXX-XXXX-1928',
      ifsc: 'KRLB000100',
      upiId: `${applicant.name.toLowerCase().replace(/\s+/g, '')}@upi`,
      monthlyEarnings: 0,
      experience: applicant.experience,
      documentsVerified: true
    };

    setTechnicians([...technicians, newTech]);
    setLogs([
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        user: currentUser?.name || 'Admin',
        action: `Approved Technician Application #${applicant.id} (${applicant.name})`,
        category: 'Technician Onboarding',
        ip: '103.220.14.82'
      },
      ...logs
    ]);
  };

  // If not logged in -> render Admin Login
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const allData = {
    bookings,
    technicians,
    applications,
    inquiries,
    customers,
    adminUsers,
    logs,
    settings
  };

  return (
    <AdminLayout
      user={currentUser}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      allData={allData}
    >
      {activeTab === 'dashboard' && (
        <DashboardOverview allData={allData} onNavigate={setActiveTab} />
      )}

      {activeTab === 'bookings' && (
        <BookingsManagement bookings={bookings} setBookings={setBookings} />
      )}

      {activeTab === 'technicians' && (
        <TechnicianManagement technicians={technicians} setTechnicians={setTechnicians} />
      )}

      {activeTab === 'applications' && (
        <TechnicianApplications 
          applications={applications} 
          setApplications={setApplications} 
          onApproveApplicant={handleApproveApplicant}
        />
      )}

      {activeTab === 'inquiries' && (
        <CustomerInquiries 
          inquiries={inquiries}
          setInquiries={setInquiries}
        />
      )}

      {activeTab === 'customers' && (
        <CustomerManagement customers={customers} setCustomers={setCustomers} bookings={bookings} />
      )}

      {activeTab === 'payments' && (
        <PaymentsManagement bookings={bookings} />
      )}

      {activeTab === 'reviews' && (
        <ReviewsManagement />
      )}

      {activeTab === 'notifications' && (
        <NotificationsCenter />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard />
      )}

      {activeTab === 'settings' && (
        <PlatformSettings settings={settings} setSettings={setSettings} />
      )}

      {activeTab === 'users' && (
        <AdminUsers adminUsers={adminUsers} setAdminUsers={setAdminUsers} />
      )}

      {activeTab === 'logs' && (
        <ActivityLogs logs={logs} />
      )}
    </AdminLayout>
  );
}
