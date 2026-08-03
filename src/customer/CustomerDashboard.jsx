import React, { useState } from 'react';
import { 
  Home, Zap, Calendar, Clock, CreditCard, MapPin, HelpCircle, User, LogOut, 
  Plus, CheckCircle2, ShieldCheck, PhoneCall, ChevronRight, ArrowRight, ExternalLink, 
  Search, Star, Check, Phone, MessageSquare, X 
} from 'lucide-react';
import { logoutUser } from '../auth/authStore';
import BookingModal from '../components/BookingModal';
import TrackBookingModal from '../components/TrackBookingModal';
import './CustomerDashboard.css';

const SERVICES_DATA = [
  {
    id: 'Electrical Repairs',
    title: 'Electrical Repairs',
    icon: '⚡',
    desc: 'Wiring, short circuits, MCB trips & light fittings',
    category: 'Electrical',
    color: 'blue',
    tags: ['electrician', 'mcb', 'wiring', 'fuse', 'short circuit']
  },
  {
    id: 'Plumbing Repairs',
    title: 'Plumbing Repairs',
    icon: '🚰',
    desc: 'Leaky taps, pipe fits, clogged drains & toilets',
    category: 'Plumbing',
    color: 'green',
    tags: ['plumber', 'pipe', 'leak', 'tap', 'drain', 'toilet']
  },
  {
    id: 'Fan Installation',
    title: 'Fan Installation',
    icon: '🌀',
    desc: 'Ceiling fans, wall fans & regulator replacement',
    category: 'Electrical',
    color: 'blue',
    tags: ['fan', 'ceiling fan', 'regulator', 'installation']
  },
  {
    id: 'Switch & Socket Replacement',
    title: 'Switch & Socket Replacement',
    icon: '🔌',
    desc: 'Modular switchboards, heavy sockets & DB box',
    category: 'Electrical',
    color: 'blue',
    tags: ['switch', 'socket', 'plug', 'board', 'mcb']
  },
  {
    id: 'Water Leak Repairs',
    title: 'Water Leak Repairs',
    icon: '💧',
    desc: 'Concealed pipe leaks, ceiling dampness & tank sealing',
    category: 'Plumbing',
    color: 'green',
    tags: ['water leak', 'dampness', 'ceiling', 'tank', 'leak']
  },
  {
    id: 'Pipe Installation',
    title: 'Pipe Installation',
    icon: '🔧',
    desc: 'CPVC & PVC pipe fitting for bathroom & kitchen',
    category: 'Plumbing',
    color: 'green',
    tags: ['pipe repair', 'pvc', 'cpvc', 'bathroom', 'kitchen']
  }
];

export default function CustomerDashboard({ user, onLogoutSuccess }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'bookings' | 'active' | 'history' | 'addresses' | 'profile' | 'support'
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'Electrical' | 'Plumbing'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('Electrical Repairs');

  const liveBookings = JSON.parse(localStorage.getItem('homefix_live_bookings') || '[]');
  const activeBooking = liveBookings.find(b => b.status !== 'Completed' && b.status !== 'Cancelled');
  const completedBookings = liveBookings.filter(b => b.status === 'Completed' || b.status === 'Cancelled');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = () => {
    logoutUser();
    onLogoutSuccess();
  };

  const handleOpenBookingWithService = (serviceName) => {
    setSelectedService(serviceName);
    setBookingModalOpen(true);
  };

  const filteredServices = SERVICES_DATA.filter(s => {
    const query = searchQuery.toLowerCase().trim();
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    if (!query) return matchesCategory;
    return matchesCategory && (
      s.title.toLowerCase().includes(query) ||
      s.desc.toLowerCase().includes(query) ||
      s.tags.some(tag => tag.includes(query))
    );
  });

  return (
    <div className="customer-dashboard-layout">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="customer-sidebar">
        <div className="sidebar-brand">
          <div className="logo-icon-badge">
            <Zap className="icon-zap" size={20} />
          </div>
          <div className="logo-text">
            <span className="brand-name">Home<span className="highlight">Fix</span></span>
            <span className="brand-tag">CUSTOMER PORTAL</span>
          </div>
        </div>

        <div className="user-profile-badge">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <strong>{user.name || 'Customer'}</strong>
            <span className="text-xs text-gray-500">{user.phone}</span>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Zap size={18} />
            <span>Book Service</span>
          </button>
          
          <button 
            className={`menu-item ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <Clock size={18} />
            <span>Active Booking</span>
            {activeBooking && <span className="active-live-badge">● Live</span>}
          </button>

          <button 
            className={`menu-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Calendar size={18} />
            <span>Booking History</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={18} />
            <span>Saved Addresses</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile & Billing</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            <HelpCircle size={18} />
            <span>Support</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout-sidebar">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Container */}
      <main className="customer-main-content">
        
        {/* Dynamic Top Header */}
        <header className="customer-top-header">
          <div>
            <h2>{getGreeting()}, <span className="text-primary">{user.name ? user.name.split(' ')[0] : 'Customer'}</span> 👋</h2>
            <p className="sub-greeting">How can we help you today?</p>
          </div>
          <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-primary btn-sm desktop-only-btn">
            <Plus size={16} />
            <span>Book Service</span>
          </button>
        </header>

        {/* ================= TAB 1: HOME ================= */}
        {(activeTab === 'home' || activeTab === 'bookings') && (
          <div className="tab-content-area">
            
            {/* CONTEXT-AWARE HERO CARD */}
            {activeBooking ? (
              /* Active Booking Compact Hero Card */
              <div className="active-hero-card glass-card">
                <div className="active-hero-top">
                  <div>
                    <span className="badge-blue">#{activeBooking.id}</span>
                    <h3 className="active-hero-title">{activeBooking.service}</h3>
                  </div>
                  <span className="status-pill green">
                    {activeBooking.status === 'Pending' ? 'Searching Technician' : activeBooking.status}
                  </span>
                </div>

                <div className="active-hero-info-grid mt-3">
                  <div>
                    <span className="label-dim">Assigned Technician</span>
                    <strong>{activeBooking.technicianName !== 'Unassigned' ? activeBooking.technicianName : 'Matching Verified Pro...'}</strong>
                  </div>
                  <div>
                    <span className="label-dim">Estimated Arrival</span>
                    <strong className="text-primary">{activeBooking.scheduledSlot}</strong>
                  </div>
                  <div className="span-2">
                    <span className="label-dim">Location</span>
                    <span className="text-sm">{activeBooking.address}, {activeBooking.city}</span>
                  </div>
                </div>

                <div className="active-hero-cta-row mt-3">
                  <button onClick={() => setTrackModalOpen(true)} className="btn-primary flex-1">
                    <span>Track Status</span>
                    <ArrowRight size={16} />
                  </button>

                  {activeBooking.technicianPhone && activeBooking.technicianPhone !== '-' && (
                    <a href={`tel:${activeBooking.technicianPhone}`} className="btn-secondary flex-center gap-2">
                      <Phone size={16} />
                      <span>Call Tech</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* Clean Minimal Hero Card when NO active booking exists */
              <div className="dashboard-hero-card glass-card">
                <div>
                  <h3 className="hero-heading">Need an Electrician or Plumber?</h3>
                  <p className="hero-subtext">Book verified professionals on demand with transparent pricing.</p>
                </div>

                {/* Compact Trust Badges */}
                <div className="trust-badges-row my-3">
                  <div className="trust-pill">
                    <Check size={14} className="text-emerald" />
                    <span>Verified Techs</span>
                  </div>
                  <div className="trust-pill">
                    <Zap size={14} className="text-primary" />
                    <span>45-Min Arrival</span>
                  </div>
                  <div className="trust-pill">
                    <Star size={14} className="text-amber" />
                    <span>Rated 4.9/5</span>
                  </div>
                </div>

                <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-primary">
                  <span>Book Service Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Service Search Bar & Filter Pills */}
            <div className="service-search-section mt-5">
              <div className="service-search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="service-search-input" 
                  placeholder="Search service... (e.g. Electrician, Plumber, Fan, Leak, MCB)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="clear-search-btn">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="category-filter-pills mt-3">
                <button 
                  className={`cat-pill ${categoryFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('All')}
                >
                  All Services
                </button>
                <button 
                  className={`cat-pill ${categoryFilter === 'Electrical' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('Electrical')}
                >
                  ⚡ Electrical
                </button>
                <button 
                  className={`cat-pill ${categoryFilter === 'Plumbing' ? 'active' : ''}`}
                  onClick={() => setCategoryFilter('Plumbing')}
                >
                  🚰 Plumbing
                </button>
              </div>
            </div>

            {/* Services Minimal Grid */}
            <div className="flex-between mt-5 mb-2">
              <h4 className="section-subtitle">Home Services</h4>
              <span className="text-xs text-gray-500">{filteredServices.length} Options</span>
            </div>

            {filteredServices.length > 0 ? (
              <div className="services-grid-minimal">
                {filteredServices.map((s) => (
                  <div 
                    key={s.id} 
                    className="dash-service-card-minimal" 
                    onClick={() => handleOpenBookingWithService(s.title)}
                  >
                    <div className="card-top-row">
                      <span className="dash-emoji">{s.icon}</span>
                      <span className="price-tag-minimal">Starts at ₹299</span>
                    </div>
                    <strong className="service-card-title">{s.title}</strong>
                    <p className="service-card-desc">{s.desc}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-search-state">
                <p>No services matching "{searchQuery}". Need custom repair?</p>
                <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-secondary btn-sm mt-2">
                  Request Custom Repair
                </button>
              </div>
            )}

            {/* Compact Bottom Support Strip */}
            <div className="compact-support-strip glass-card mt-6">
              <div className="support-strip-left">
                <HelpCircle size={20} className="text-primary" />
                <span>Need assistance with your booking?</span>
              </div>
              <div className="support-strip-actions">
                <a href="tel:+914972704663" className="strip-action-btn">
                  <PhoneCall size={14} />
                  <span>Call Support</span>
                </a>
                <a 
                  href="https://wa.me/919447000000?text=Hi%20HomeFix!%20I%20need%20assistance%20with%20my%20service%20booking." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="strip-action-btn whatsapp"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: ACTIVE BOOKING ================= */}
        {activeTab === 'active' && (
          <div className="tab-content-area">
            {activeBooking ? (
              <div className="active-booking-card glass-card">
                <div className="flex-between">
                  <div>
                    <span className="badge-blue">#{activeBooking.id}</span>
                    <h3 className="mt-1">{activeBooking.service}</h3>
                  </div>
                  <span className="status-pill green">
                    {activeBooking.status}
                  </span>
                </div>

                <div className="active-details-row mt-4">
                  <div>
                    <span>Location:</span>
                    <strong>{activeBooking.address}, {activeBooking.city}</strong>
                  </div>
                  <div>
                    <span>Slot:</span>
                    <strong>{activeBooking.scheduledSlot}</strong>
                  </div>
                  <div>
                    <span>Estimated Price:</span>
                    <strong>₹299</strong>
                  </div>
                </div>

                <button onClick={() => setTrackModalOpen(true)} className="btn-primary w-full mt-4">
                  <span>Track Live Progress</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="empty-state-box">
                <Clock size={44} className="text-gray-300 mb-2" />
                <h4>No Active Bookings Right Now</h4>
                <p>You don't have any ongoing repairs. Need help at home?</p>
                <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-primary btn-sm mt-3">
                  Book a Service
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: BOOKING HISTORY ================= */}
        {activeTab === 'history' && (
          <div className="tab-content-area">
            <h3 className="tab-title mb-4">Booking History</h3>
            {completedBookings.length > 0 ? (
              <div className="history-table-box">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedBookings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>#{b.id}</strong></td>
                        <td>{b.service}</td>
                        <td>{b.bookingTime}</td>
                        <td>₹299</td>
                        <td>
                          <span className={`status-pill ${b.status === 'Completed' ? 'green' : 'red'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state-box">
                <Calendar size={44} className="text-gray-300 mb-2" />
                <h4>No Past Bookings Recorded</h4>
                <p>Your completed repairs and service invoices will appear here.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: SAVED ADDRESSES ================= */}
        {activeTab === 'addresses' && (
          <div className="tab-content-area">
            <h3 className="tab-title mb-4">Saved Addresses</h3>
            <div className="address-card glass-card">
              <MapPin size={24} className="text-primary" />
              <div>
                <strong>Home Location</strong>
                <p className="text-xs text-gray-600">Thana Road, Near Fort, Kannur</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: PROFILE (INCLUDES PAYMENTS) ================= */}
        {activeTab === 'profile' && (
          <div className="tab-content-area">
            <h3 className="tab-title mb-4">Account Profile & Billing</h3>
            
            <div className="profile-grid-two">
              {/* Profile Details */}
              <div className="profile-form-box glass-card">
                <h4 className="card-sub-heading mb-3">Personal Details</h4>
                <div className="form-group mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={user.name || ''} readOnly />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" value={user.phone || ''} readOnly />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Email</label>
                  <input type="text" className="form-input" value={user.email || 'Not provided'} readOnly />
                </div>
              </div>

              {/* Payments Section inside Profile */}
              <div className="payments-section-box glass-card">
                <h4 className="card-sub-heading mb-3">Payment Methods</h4>
                <div className="payment-method-row">
                  <CreditCard size={24} className="text-primary" />
                  <div>
                    <strong>Pay on Delivery (UPI / Cash)</strong>
                    <p className="text-xs text-gray-500">Pay directly to technician after job completion</p>
                  </div>
                  <span className="badge-green">Default</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: SUPPORT ================= */}
        {activeTab === 'support' && (
          <div className="tab-content-area">
            <h3 className="tab-title mb-4">HomeFix Support & Helpline</h3>
            <div className="support-box glass-card">
              <PhoneCall size={28} className="text-secondary mb-2" />
              <h4>Need Urgent Emergency Assistance?</h4>
              <p className="text-sm text-gray-600 mb-3">Our operations desk is available 24/7 for electrical emergencies and water pipe bursts.</p>
              <a href="tel:+914972704663" className="btn-secondary">
                Call Helpline: +91 (497) 270-HOME
              </a>
            </div>
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation Bar for Native App Feel */}
      <nav className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-item ${activeTab === 'home' || activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <Clock size={20} />
          <span>Active</span>
          {activeBooking && <span className="mobile-nav-badge"></span>}
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Calendar size={20} />
          <span>History</span>
        </button>
        <button 
          className={`mobile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* Modals */}
      <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedService}
      />

      <TrackBookingModal 
        isOpen={trackModalOpen} 
        onClose={() => setTrackModalOpen(false)}
        defaultBookingId={activeBooking?.id || ''}
      />
    </div>
  );
}
