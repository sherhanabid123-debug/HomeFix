import React, { useState } from 'react';
import { 
  Wrench, Zap, Clock, AlertTriangle, CheckCircle2, PhoneCall, MapPin, 
  IndianRupee, TrendingUp, UserCheck, ShieldCheck, Power, LogOut, Navigation 
} from 'lucide-react';
import { logoutUser } from '../auth/authStore';
import './PartnerDashboard.css';

export default function PartnerDashboard({ user, onLogoutSuccess }) {
  const [isOnline, setIsOnline] = useState(true);

  // If application is pending or rejected
  if (user.status === 'pending') {
    return (
      <div className="partner-status-screen">
        <div className="status-box glass-card">
          <Clock size={56} className="text-amber-500 mb-3" />
          <h2>Application Under Review</h2>
          <p>Hi <strong>{user.name}</strong>, your technician application for <strong>{user.category}</strong> in {user.city} is currently being reviewed by HomeFix operations team.</p>
          <div className="status-notice-box mt-4">
            <ShieldCheck size={18} className="text-secondary" />
            <span>Gov ID & Licenses Verification in Progress</span>
          </div>
          <button onClick={() => { logoutUser(); onLogoutSuccess(); }} className="btn-secondary w-full mt-4">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (user.status === 'rejected') {
    return (
      <div className="partner-status-screen">
        <div className="status-box glass-card">
          <AlertTriangle size={56} className="text-red-500 mb-3" />
          <h2>Application Rejected</h2>
          <p>We are unable to approve your application at this time. Please contact HomeFix support for details.</p>
          <button onClick={() => { logoutUser(); onLogoutSuccess(); }} className="btn-secondary w-full mt-4">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Approved Technician Dashboard
  return (
    <div className="partner-dashboard-layout">
      {/* Header Bar */}
      <header className="partner-top-header">
        <div className="header-brand">
          <div className="logo-icon-badge green-bg">
            <Wrench size={22} className="text-secondary" />
          </div>
          <div>
            <h3>HomeFix Technician Partner</h3>
            <span className="brand-tag">{user.city.toUpperCase()} NETWORK</span>
          </div>
        </div>

        <div className="header-right-actions">
          {/* Online/Offline Toggle */}
          <button 
            className={`duty-toggle-btn ${isOnline ? 'online' : 'offline'}`}
            onClick={() => setIsOnline(!isOnline)}
          >
            <Power size={18} />
            <span>{isOnline ? 'On Duty (Online)' : 'Off Duty (Offline)'}</span>
          </button>

          <button onClick={() => { logoutUser(); onLogoutSuccess(); }} className="btn-logout-partner">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="partner-main-container">
        
        {/* KPI Summary Cards */}
        <div className="partner-kpi-grid">
          <div className="partner-kpi-card glass-card">
            <div className="kpi-icon-box green">
              <IndianRupee size={22} />
            </div>
            <div>
              <span className="kpi-label">This Month's Earnings</span>
              <div className="kpi-val">₹14,850</div>
              <span className="text-xs text-emerald-600">Net payout after 15% commission</span>
            </div>
          </div>

          <div className="partner-kpi-card glass-card">
            <div className="kpi-icon-box blue">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="kpi-label">Jobs Completed</span>
              <div className="kpi-val">{user.completedJobs || 42}</div>
              <span className="text-xs text-gray-500">⭐ 4.9 Average Rating</span>
            </div>
          </div>

          <div className="partner-kpi-card glass-card">
            <div className="kpi-icon-box amber">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="kpi-label">Verification Status</span>
              <div className="kpi-val text-emerald-600">Verified Pro</div>
              <span className="text-xs text-gray-500">Aadhaar & License Active</span>
            </div>
          </div>
        </div>

        {/* Assigned Dispatch Jobs List */}
        <div className="partner-jobs-section mt-6">
          <div className="flex-between mb-4">
            <h3 className="section-title">Assigned Repair Jobs</h3>
            <span className="badge-green">{isOnline ? 'Auto-Dispatch Enabled' : 'Offline'}</span>
          </div>

          <div className="job-card glass-card">
            <div className="job-header">
              <div>
                <span className="job-category-tag">⚡ {user.category || 'Electrical'} Emergency</span>
                <h4>Short Circuit & MCB Trip Fix</h4>
              </div>
              <div className="job-price">₹499</div>
            </div>

            <div className="job-details-grid mt-3">
              <div>
                <span className="text-xs text-gray-500">Customer Name:</span>
                <strong>Anjali Menon</strong>
              </div>
              <div>
                <span className="text-xs text-gray-500">Arrival Window:</span>
                <strong className="text-primary">Express (&lt; 45 Mins)</strong>
              </div>
              <div className="span-2">
                <span className="text-xs text-gray-500">Location:</span>
                <span>Thana Road, Near Fort (Landmark: Opposite AKG Hospital), {user.city}</span>
              </div>
            </div>

            <div className="job-action-row mt-4">
              <a href="tel:+919847012345" className="btn-secondary flex-1 text-center">
                <PhoneCall size={16} />
                <span>Call Customer</span>
              </a>
              <button className="btn-emerald flex-1">
                <Navigation size={16} />
                <span>Start Job Navigation</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
