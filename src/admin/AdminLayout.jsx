import React, { useState } from 'react';
import { 
  LayoutDashboard, CalendarCheck, Users, UserCheck, FileCheck, 
  CreditCard, Star, Bell, BarChart3, Settings, ShieldCheck, 
  History, LogOut, Search, Sun, Moon, Zap, Wrench, Menu, X, ChevronRight, CheckCircle2
} from 'lucide-react';
import GlobalSearchModal from './components/GlobalSearchModal';
import './AdminLayout.css';

export default function AdminLayout({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  children,
  darkMode,
  setDarkMode,
  allData
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: allData.bookings.filter(b => b.status === 'Pending').length },
    { id: 'technicians', label: 'Technicians', icon: UserCheck },
    { id: 'applications', label: 'Applications', icon: FileCheck, badge: allData.applications.filter(a => a.status === 'Pending').length },
    { id: 'inquiries', label: 'FAQ Inquiries', icon: MessageSquare, badge: (allData.inquiries || []).filter(i => i.status === 'Pending').length },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Admin Users', icon: ShieldCheck },
    { id: 'logs', label: 'Activity Logs', icon: History }
  ];

  return (
    <div className={`admin-app-root ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Logo */}
        <div className="sidebar-logo-area">
          <div className="logo-icon-badge">
            <Zap className="icon-zap" size={18} />
            <Wrench className="icon-wrench" size={16} />
          </div>
          {!sidebarCollapsed && (
            <div className="logo-text">
              <span className="brand-name">Home<span className="highlight">Fix</span></span>
              <span className="admin-tag">ADMIN SAAS</span>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <IconComp size={20} className="nav-icon" />
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
                {!sidebarCollapsed && item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="sidebar-footer">
          <button onClick={onLogout} className="logout-btn" title="Logout">
            <LogOut size={20} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="admin-main-wrapper">
        {/* Top Navbar */}
        <header className="admin-topnav">
          <div className="topnav-left">
            <button 
              className="sidebar-toggle-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Global Search Trigger */}
            <button 
              className="global-search-trigger"
              onClick={() => setSearchModalOpen(true)}
            >
              <Search size={16} className="search-icon" />
              <span>Search bookings, customers, technicians...</span>
              <kbd>⌘K</kbd>
            </button>
          </div>

          <div className="topnav-right">
            {/* Dark Mode Toggle */}
            <button 
              className="topnav-action-btn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun size={20} color="#F59E0B" /> : <Moon size={20} />}
            </button>

            {/* Notifications Bell */}
            <div className="notification-dropdown-wrapper">
              <button 
                className="topnav-action-btn relative"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={20} />
                <span className="red-pulse-badge"></span>
              </button>

              {notificationsOpen && (
                <div className="notifications-popover glass-card">
                  <div className="popover-header">
                    <h4>Live Admin Alerts</h4>
                    <span className="text-xs text-primary">3 New</span>
                  </div>
                  <div className="popover-body">
                    <div className="popover-item">
                      <div className="popover-icon green"><CheckCircle2 size={16} /></div>
                      <div>
                        <p className="popover-text">Technician Jitin Mohan submitted verification docs</p>
                        <span className="popover-time">10 mins ago</span>
                      </div>
                    </div>
                    <div className="popover-item">
                      <div className="popover-icon blue"><CalendarCheck size={16} /></div>
                      <div>
                        <p className="popover-text">New booking #HF-8942 assigned in Kannur</p>
                        <span className="popover-time">25 mins ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin User Profile */}
            <div className="admin-user-profile">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                alt="Sherhan Abid" 
                className="profile-avatar"
              />
              <div className="profile-info">
                <span className="user-name">{user?.name || 'Sherhan Abid'}</span>
                <span className="user-role">{user?.role || 'Super Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Content Area */}
        <main className="admin-content-body">
          {children}
        </main>
      </div>

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
        allData={allData}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setSearchModalOpen(false);
        }}
      />
    </div>
  );
}
