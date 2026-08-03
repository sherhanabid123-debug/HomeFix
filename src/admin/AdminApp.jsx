import React, { useState, useEffect, Component } from 'react';
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
import CustomerInquiries from './components/CustomerInquiries';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

import { 
  INITIAL_BOOKINGS, 
  INITIAL_TECHNICIANS, 
  INITIAL_APPLICATIONS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ADMIN_USERS, 
  INITIAL_ACTIVITY_LOGS, 
  INITIAL_SETTINGS 
} from './mockData';

// Helper for safe JSON parsing across all localStorage keys
function safeParseJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved || saved === 'undefined' || saved === 'null') return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== undefined && parsed !== null ? parsed : fallback;
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    return fallback;
  }
}

// Admin Error Boundary to prevent white screens
class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Admin Portal Error Boundary caught error:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem('homefix_live_applications');
    localStorage.removeItem('homefix_live_faq_questions');
    localStorage.removeItem('homefix_admin_user');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#DC2626', fontSize: '1.5rem', fontWeight: 800 }}>Admin Portal Render Error</h2>
          <p style={{ color: '#4B5563', margin: '1rem 0' }}>An error occurred while displaying the Admin Portal tab.</p>
          <button 
            onClick={this.handleReset}
            style={{ 
              background: '#10B981', 
              color: '#fff', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: 'pointer' 
            }}
          >
            Reset Admin Session & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminAppContent() {
  const [currentUser, setCurrentUser] = useState(() => safeParseJSON('homefix_admin_user', null));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Central Store State
  const [bookings, setBookingsState] = useState(() => safeParseJSON('homefix_live_bookings', INITIAL_BOOKINGS));
  const [technicians, setTechniciansState] = useState(() => safeParseJSON('homefix_live_technicians', INITIAL_TECHNICIANS));

  const loadApplications = () => {
    try {
      const customApps = safeParseJSON('homefix_live_applications', []);
      const users = safeParseJSON('homefix_registered_users', []);
      const userTechApps = Array.isArray(users) ? users
        .filter(u => u && u.role === 'technician')
        .map(u => ({
          id: u.id || `TECH-${Math.floor(Math.random() * 1000)}`,
          name: u.name || 'Technician Applicant',
          phone: u.phone || '',
          email: u.email && !u.email.includes('@homefix.in') ? u.email : '',
          trade: u.category || 'Electrician',
          experience: u.experience || '1-3 Years',
          city: u.city || 'Kannur',
          status: u.status === 'approved' ? 'Approved' : (u.status === 'rejected' ? 'Rejected' : 'Pending'),
          appliedDate: u.appliedDate || new Date().toISOString().slice(0, 10)
        })) : [];
      
      const combined = [...(Array.isArray(customApps) ? customApps : []), ...userTechApps, ...INITIAL_APPLICATIONS];
      const uniqueMap = new Map();
      combined.forEach(item => {
        if (item && item.id && !uniqueMap.has(item.id)) {
          const isTest = String(item.name || '').includes('Test') || String(item.id || '').includes('APP-TEST');
          if (!isTest) {
            uniqueMap.set(item.id, item);
          }
        }
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

  const loadInquiries = () => safeParseJSON('homefix_live_faq_questions', []);

  const [inquiries, setInquiriesState] = useState(() => loadInquiries());
  const [cloudSyncError, setCloudSyncError] = useState(null);

  const setInquiries = (newInqs) => {
    setInquiriesState(newInqs);
    localStorage.setItem('homefix_live_faq_questions', JSON.stringify(newInqs));
  };

  const [customers, setCustomersState] = useState(() => safeParseJSON('homefix_live_customers', INITIAL_CUSTOMERS));
  const [adminUsers, setAdminUsers] = useState(INITIAL_ADMIN_USERS);
  const [logs, setLogsState] = useState(() => safeParseJSON('homefix_live_logs', INITIAL_ACTIVITY_LOGS));
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

  // Live Auto-Refresh sync on tab switch, focus, or Supabase real-time trigger
  useEffect(() => {
    const syncData = async () => {
      setBookingsState(safeParseJSON('homefix_live_bookings', INITIAL_BOOKINGS));
      setLogsState(safeParseJSON('homefix_live_logs', INITIAL_ACTIVITY_LOGS));
      setCustomersState(safeParseJSON('homefix_live_customers', INITIAL_CUSTOMERS));
      setTechniciansState(safeParseJSON('homefix_live_technicians', INITIAL_TECHNICIANS));
      
      const localApps = loadApplications();
      const localInqs = loadInquiries();

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: dbApps, error: appsError } = await supabase.from('technician_applications').select('*');
          const { data: dbInqs, error: inqsError } = await supabase.from('customer_inquiries').select('*');

          if (appsError) {
            console.error('Supabase technician_applications fetch failed:', appsError.message, appsError);
            setCloudSyncError(`Applications cloud sync failed: ${appsError.message}`);
          }
          if (inqsError) {
            console.error('Supabase customer_inquiries fetch failed:', inqsError.message, inqsError);
            setCloudSyncError(`Inquiries cloud sync failed: ${inqsError.message}`);
          }
          if (!appsError && !inqsError) {
            setCloudSyncError(null);
          }

          if (Array.isArray(dbApps) && dbApps.length > 0) {
            const formattedDbApps = dbApps.map(a => ({
              id: a.id,
              name: a.name,
              phone: a.phone,
              trade: a.trade,
              district: a.district,
              experience: a.experience,
              status: a.status || 'Pending',
              appliedDate: a.applied_date || new Date().toISOString().slice(0, 10)
            })).sort((a, b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''));
            const mergedAppsMap = new Map();
            [...formattedDbApps, ...localApps].forEach(item => {
              if (item && item.id && !mergedAppsMap.has(item.id)) {
                const isTest = String(item.name || '').toLowerCase().includes('test applicant') || String(item.id || '').includes('APP-TEST');
                if (!isTest) {
                  mergedAppsMap.set(item.id, item);
                }
              }
            });
            setApplicationsState(Array.from(mergedAppsMap.values()));
          } else {
            setApplicationsState(localApps);
          }

          if (Array.isArray(dbInqs) && dbInqs.length > 0) {
            const formattedDbInqs = dbInqs.map(i => ({
              id: i.id,
              name: i.asker_name,
              phone: i.phone,
              email: i.email || '',
              question: i.question,
              status: i.status || 'Pending',
              submittedAt: i.created_at ? new Date(i.created_at).toISOString().slice(0, 16).replace('T', ' ') : ''
            })).sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''));
            const mergedInqsMap = new Map();
            [...formattedDbInqs, ...localInqs].forEach(item => {
              if (item && item.id && !mergedInqsMap.has(item.id)) {
                mergedInqsMap.set(item.id, item);
              }
            });
            setInquiriesState(Array.from(mergedInqsMap.values()));
          } else {
            setInquiriesState(localInqs);
          }
        } catch (dbErr) {
          console.warn('Supabase fetch error:', dbErr);
          setCloudSyncError(`Cloud sync error: ${dbErr.message || dbErr}`);
          setApplicationsState(localApps);
          setInquiriesState(localInqs);
        }
      } else {
        setApplicationsState(localApps);
        setInquiriesState(localInqs);
      }
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
    if (!applicant) return;
    const newTech = {
      id: `TECH-${Math.floor(220 + Math.random() * 100)}`,
      name: applicant.name || 'Technician',
      phone: applicant.phone || '',
      email: applicant.email || '',
      category: applicant.trade || 'Electrician',
      status: 'Online',
      city: applicant.city || 'Kannur',
      experience: applicant.experience || '1-3 Years'
    };

    setTechnicians([...technicians, newTech]);
  };

  // If not logged in -> render Admin Login
  if (!currentUser) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const allData = {
    bookings: Array.isArray(bookings) ? bookings : [],
    technicians: Array.isArray(technicians) ? technicians : [],
    applications: Array.isArray(applications) ? applications : [],
    inquiries: Array.isArray(inquiries) ? inquiries : [],
    customers: Array.isArray(customers) ? customers : [],
    adminUsers: Array.isArray(adminUsers) ? adminUsers : [],
    logs: Array.isArray(logs) ? logs : [],
    settings
  };

  return (
    <>
      {cloudSyncError && (
        <div style={{
          background: '#FEF2F2', color: '#991B1B', padding: '0.6rem 1.25rem',
          fontSize: '0.85rem', fontWeight: 600, textAlign: 'center',
          borderBottom: '1px solid #FCA5A5', position: 'sticky', top: 0, zIndex: 9999
        }}>
          ⚠️ {cloudSyncError} — showing locally cached data only, entries from other devices may be missing.
        </div>
      )}
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
          <BookingsManagement bookings={bookings} setBookings={setBookings} technicians={technicians} />
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
    </>
  );
}

export default function AdminApp() {
  return (
    <AdminErrorBoundary>
      <AdminAppContent />
    </AdminErrorBoundary>
  );
}
