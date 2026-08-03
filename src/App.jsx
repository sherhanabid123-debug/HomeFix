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

import BookingModal from './components/BookingModal';
import PartnerModal from './components/PartnerModal';
import TrackBookingModal from './components/TrackBookingModal';
import ActiveBookingBar from './components/ActiveBookingBar';
import AuthModal from './auth/AuthModal';

import CustomerDashboard from './customer/CustomerDashboard';
import PartnerDashboard from './partner/PartnerDashboard';
import { getCurrentUser } from './auth/authStore';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState('customer');

  const [selectedService, setSelectedService] = useState('Electrical Repairs');
  const [trackBookingId, setTrackBookingId] = useState('');

  // Route & Session Sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUser(getCurrentUser());
      setCurrentPath(window.location.pathname);
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
      setCurrentPath('/customer');
    } else if (user.role === 'technician') {
      window.history.pushState({}, '', '/partner/dashboard');
      setCurrentPath('/partner/dashboard');
    }
  };

  const handleLogoutSuccess = () => {
    setCurrentUser(null);
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // ================= DEDICATED ROUTE ROUTING =================
  if (currentUser) {
    if (currentPath === '/customer' && currentUser.role === 'customer') {
      return <CustomerDashboard user={currentUser} onLogoutSuccess={handleLogoutSuccess} />;
    }
    if (currentPath.startsWith('/partner') && currentUser.role === 'technician') {
      return <PartnerDashboard user={currentUser} onLogoutSuccess={handleLogoutSuccess} />;
    }
  }

  // ================= PUBLIC LANDING PAGE (DEFAULT FOR /) =================
  return (
    <div className="app-wrapper">
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenPartner={handleOpenPartner} 
        onOpenTrack={() => handleOpenTrack()}
        onOpenAuth={() => handleOpenAuth('login', 'customer')}
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
      <BookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)}
        initialService={selectedService}
      />

      <PartnerModal 
        isOpen={partnerModalOpen} 
        onClose={() => setPartnerModalOpen(false)}
      />

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
