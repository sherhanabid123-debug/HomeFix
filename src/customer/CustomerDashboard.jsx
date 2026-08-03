import React, { useState } from 'react';
import { 
  Home, Zap, Calendar, Clock, CreditCard, MapPin, HelpCircle, User, LogOut, 
  Plus, CheckCircle2, ShieldCheck, PhoneCall, ChevronRight, ArrowRight, ExternalLink, Phone, Trash2, Compass
} from 'lucide-react';
import { logoutUser } from '../auth/authStore';
import BookingModal from '../components/BookingModal';
import TrackBookingModal from '../components/TrackBookingModal';
import AddAddressModal from '../components/AddAddressModal';
import './CustomerDashboard.css';

const INITIAL_ADDRESSES = [
  {
    id: 'ADDR-101',
    tag: 'Home',
    houseNo: 'House #42, Thana Road',
    area: 'Near St. Angelo Fort',
    city: 'Kannur',
    landmark: 'Opposite City Center',
    lat: 11.8745,
    lng: 75.3704,
    fullText: 'House #42, Thana Road, Near St. Angelo Fort, Kannur'
  }
];

export default function CustomerDashboard({ user, onLogoutSuccess }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'bookings' | 'active' | 'history' | 'addresses' | 'profile' | 'support'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Electrical Repairs');

  // Saved Addresses State with LocalStorage Persistence
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const stored = localStorage.getItem('homefix_saved_addresses');
    return stored ? JSON.parse(stored) : INITIAL_ADDRESSES;
  });

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

  const handleSaveAddress = (newAddr) => {
    const updated = [newAddr, ...savedAddresses];
    setSavedAddresses(updated);
    localStorage.setItem('homefix_saved_addresses', JSON.stringify(updated));
  };

  const handleRemoveAddress = (id) => {
    if (window.confirm('Are you sure you want to remove this saved address?')) {
      const updated = savedAddresses.filter(a => a.id !== id);
      setSavedAddresses(updated);
      localStorage.setItem('homefix_saved_addresses', JSON.stringify(updated));
    }
  };

  return (
    <div className="customer-dashboard-layout">
      {/* Sidebar Navigation */}
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

        {/* Clean Sidebar Navigation */}
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
            <span>Profile</span>
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

      {/* Main Content Area */}
      <main className="customer-main-content">
        
        {/* Dynamic Greeting Top Header */}
        <header className="customer-top-header">
          <div>
            <h2>{getGreeting()}, <span className="text-primary">{user.name ? user.name.split(' ')[0] : 'Customer'}</span> 👋</h2>
            <p className="sub-greeting">How can we help you today?</p>
          </div>
          <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-primary btn-sm">
            <Plus size={16} />
            <span>Book New Service</span>
          </button>
        </header>

        {/* ================= TAB 1: HOME ================= */}
        {(activeTab === 'home' || activeTab === 'bookings') && (
          <div className="tab-content-area">
            
            {/* CONTEXT-AWARE HERO LOGIC */}
            {activeBooking ? (
              /* Active Booking Hero Card */
              <div className="active-hero-card glass-card">
                <div className="active-hero-top">
                  <div>
                    <span className="badge-blue mb-1">Active Booking #{activeBooking.id}</span>
                    <h3 className="active-hero-title">{activeBooking.service}</h3>
                  </div>
                  <span className="status-pill green">
                    {activeBooking.status === 'Pending' ? 'Searching Technician' : activeBooking.status}
                  </span>
                </div>

                <div className="active-hero-info-grid mt-3">
                  <div>
                    <span className="label-dim">Assigned Technician</span>
                    <strong>{activeBooking.technicianName !== 'Unassigned' ? activeBooking.technicianName : 'Matching Verified Technician...'}</strong>
                  </div>
                  <div>
                    <span className="label-dim">Estimated Arrival</span>
                    <strong className="text-primary">{activeBooking.scheduledSlot}</strong>
                  </div>
                  <div className="span-2">
                    <span className="label-dim">Location</span>
                    <span>{activeBooking.address}, {activeBooking.city}</span>
                  </div>
                </div>

                <div className="active-hero-cta-row mt-4">
                  <button onClick={() => setTrackModalOpen(true)} className="btn-primary flex-1">
                    <span>Track Live Booking</span>
                    <ArrowRight size={18} />
                  </button>

                  {activeBooking.technicianPhone && activeBooking.technicianPhone !== '-' && (
                    <a href={`tel:${activeBooking.technicianPhone}`} className="btn-secondary flex-center gap-2">
                      <Phone size={16} />
                      <span>Call Technician</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* Clean Spacious Hero Card */
              <div className="dashboard-hero-card glass-card">
                <div>
                  <h3 className="hero-heading">Need an Electrician or Plumber in Kerala?</h3>
                  <p className="hero-subtext">Book verified professionals on demand. Guaranteed 45-min arrival with transparent pricing.</p>
                </div>

                <button onClick={() => handleOpenBookingWithService('Electrical Repairs')} className="btn-primary mt-4">
                  <span>Book Service Now</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Popular Home Services Grid (Spacious 3 Cards) */}
            <h4 className="section-subtitle mt-6 mb-3">Popular Home Services</h4>
            <div className="services-grid-3">
              <div className="dash-service-card" onClick={() => handleOpenBookingWithService('Electrical Repairs')}>
                <div className="dash-icon blue">⚡</div>
                <strong>Electrical Repairs</strong>
                <p>Wiring, short circuits, MCB trips</p>
                <div className="service-card-bottom">
                  <span className="price-tag-modern">Starts at ₹299</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>

              <div className="dash-service-card" onClick={() => handleOpenBookingWithService('Plumbing Repairs')}>
                <div className="dash-icon green">🚰</div>
                <strong>Plumbing Repairs</strong>
                <p>Leaky taps, pipe fits, clogged drains</p>
                <div className="service-card-bottom">
                  <span className="price-tag-modern">Starts at ₹299</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>

              <div className="dash-service-card" onClick={() => handleOpenBookingWithService('Fan Installation')}>
                <div className="dash-icon blue">🌀</div>
                <strong>Fan & Switch Installation</strong>
                <p>Ceiling fans, modular switches</p>
                <div className="service-card-bottom">
                  <span className="price-tag-modern">Starts at ₹299</span>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
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
            <div className="mb-4">
              <h3 className="tab-title">Saved Addresses</h3>
              <p className="text-xs text-gray-500">Manage your saved locations for 1-click booking</p>
            </div>

            {savedAddresses.length > 0 ? (
              <div className="addresses-grid">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="address-card-item glass-card">
                    <div className="address-card-header">
                      <div className="flex-center gap-2">
                        <MapPin size={20} className="text-primary" />
                        <span className="address-tag-pill">{addr.tag || 'Home'}</span>
                        <span className="city-pill">{addr.city}</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveAddress(addr.id)} 
                        className="btn-remove-address"
                        title="Remove Address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="address-card-body mt-3">
                      <strong>{addr.houseNo}</strong>
                      <p className="text-sm text-gray-600 mt-1">{addr.area}</p>
                      {addr.landmark && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 <em>Landmark: {addr.landmark}</em>
                        </p>
                      )}

                      {addr.lat && addr.lng && (
                        <div className="gps-coordinates-badge mt-2">
                          <Compass size={13} className="text-primary" />
                          <span>GPS: {addr.lat.toFixed(4)}° N, {addr.lng.toFixed(4)}° E</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <MapPin size={44} className="text-gray-300 mb-2" />
                <h4>No Saved Addresses Yet</h4>
                <p>Add your home or office address with 1-click GPS location auto-detection.</p>
                <button 
                  onClick={() => setAddAddressModalOpen(true)} 
                  className="btn-primary btn-sm mt-3"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: PROFILE (INCLUDES PAYMENTS) ================= */}
        {activeTab === 'profile' && (
          <div className="tab-content-area">
            <h3 className="tab-title mb-4">Account Profile & Payments</h3>
            
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
                <h4 className="card-sub-heading mb-3">Payment Methods & Billing</h4>
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

      <AddAddressModal 
        isOpen={addAddressModalOpen}
        onClose={() => setAddAddressModalOpen(false)}
        onSaveAddress={handleSaveAddress}
      />
    </div>
  );
}
