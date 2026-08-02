import React, { useState } from 'react';
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

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Electrical Repairs');

  const handleOpenBooking = (serviceName = '') => {
    if (typeof serviceName === 'string' && serviceName.length > 0) {
      setSelectedService(serviceName);
    }
    setBookingModalOpen(true);
  };

  const handleOpenPartner = () => {
    setPartnerModalOpen(true);
  };

  return (
    <div className="app-wrapper">
      <Navbar 
        onOpenBooking={() => handleOpenBooking()} 
        onOpenPartner={handleOpenPartner} 
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
    </div>
  );
}
