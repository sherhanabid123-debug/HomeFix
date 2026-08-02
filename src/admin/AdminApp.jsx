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
import ActivityLogs from './components/ActivityLogs';

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

  // Central Store State
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [logs, setLogs] = useState(INITIAL_ACTIVITY_LOGS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

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
