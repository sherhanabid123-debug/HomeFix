import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import WhyChooseUs from './components/WhyChooseUs';
import ServiceAreas from './components/ServiceAreas';
import PartnerSection from './components/PartnerSection';
import Testimonials from './components/Testimonials';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

import TrackBookingModal from './components/TrackBookingModal';
import ActiveBookingBar from './components/ActiveBookingBar';
import AuthModal from './auth/AuthModal';

import CustomerDashboard from './customer/CustomerDashboard';
import PartnerDashboard from './partner/PartnerDashboard';
import { getCurrentUser } from './auth/authStore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // Modals state
  // Pre-launch mode: BookingModal and PartnerModal are retired, all CTAs route to the technician waitlist (AuthModal)
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('customer');

  const [trackBookingId, setTrackBookingId] = useState('');

  // Route & Session Sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenBooking = (serviceName = '') => {
    handleOpenPartner();
  };

  const handleOpenPartner = () => {
    setAuthMode('tech_register');
    setAuthRole('technician');
    setAuthModalOpen(true);
  };

  const handleOpenTrack = (bookingId = '') => {
    if (typeof bookingId === 'string' && bookingId.length > 0) {
      setTrackBookingId(bookingId);
    }
    setTrackModalOpen(true);
  };

  const handleOpenAuth = (mode = 'login', role = 'customer') => {
    setAuthMode(mode);
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    
    // Redirect based on role
    if (user.role === 'customer') {
      window.history.pushState({}, '', '/customer');
    } else if (user.role === 'technician') {
      window.history.pushState({}, '', '/partner/dashboard');
    }
  };

  const handleLogoutSuccess = () => {
    setCurrentUser(null);
    window.history.pushState({}, '', '/');
  };

  // ================= ROLE-BASED DASHBOARD ROUTING =================
  if (currentUser) {
    if (currentUser.role === 'customer') {
      return <CustomerDashboard user={currentUser} onLogoutSuccess={handleLogoutSuccess} />;
    }
    if (currentUser.role === 'technician') {
      return <PartnerDashboard user={currentUser} onLogoutSuccess={handleLogoutSuccess} />;
    }
  }

  // ================= PUBLIC LANDING PAGE =================
  return (
    <div className="app-wrapper">
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenPartner={handleOpenPartner} 
        onOpenTrack={() => handleOpenTrack()}
      />

      <main>
        <Hero 
          onOpenBooking={() => handleOpenBooking()} 
          onOpenPartner={handleOpenPartner} 
        />

        <Services 
          onOpenBooking={handleOpenBooking} 
        />

        <HowItWorks 
          onOpenBooking={() => handleOpenBooking()} 
        />

        <WhyChooseUs />

        <ServiceAreas 
          onOpenBooking={handleOpenBooking} 
        />

        <PartnerSection 
          onOpenPartner={handleOpenPartner} 
        />

        <Testimonials />

        <FAQSection />
      </main>

      <Footer 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenPartner={handleOpenPartner} 
      />

      {/* Sticky Active Booking Floating Tracker Bar */}
      <ActiveBookingBar onOpenTrack={handleOpenTrack} />

      {/* Interactive Modals */}
      <TrackBookingModal 
        isOpen={trackModalOpen} 
        onClose={() => setTrackModalOpen(false)}
        defaultBookingId={trackBookingId}
      />

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        initialRole={authRole}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
