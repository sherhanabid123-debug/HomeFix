import React, { useState } from 'react';
import { Zap, Wrench, Fan, ToggleLeft, Droplets, GitCommit, ArrowUpRight, Clock, ShieldCheck, Search } from 'lucide-react';
import './Services.css';

const SERVICES_DATA = [
  {
    id: 'elec-repair',
    title: 'Electrical Repairs',
    category: 'electrical',
    description: 'Diagnose and fix short circuits, tripped MCBs, flickering lights, and wiring faults.',
    icon: Zap,
    badge: 'Popular',
    price: '₹299',
    time: '30-45 mins',
    rating: '4.9 (420+)'
  },
  {
    id: 'plumb-repair',
    title: 'Plumbing Repairs',
    category: 'plumbing',
    description: 'Fix running toilets, broken faucets, clogged drains, and low water pressure issues.',
    icon: Wrench,
    badge: 'Popular',
    price: '₹349',
    time: '45 mins',
    rating: '4.8 (380+)'
  },
  {
    id: 'fan-install',
    title: 'Fan Installation',
    category: 'electrical',
    description: 'Safe ceiling & wall fan mounting, regulator fitting, and speed troubleshooting.',
    icon: Fan,
    categoryLabel: 'Electrical',
    price: '₹199',
    time: '30 mins',
    rating: '4.9 (290+)'
  },
  {
    id: 'switch-socket',
    title: 'Switch & Socket Replacement',
    category: 'electrical',
    description: 'Replace burned or outdated switches, modular sockets, & MCB distribution boards.',
    icon: ToggleLeft,
    categoryLabel: 'Electrical',
    price: '₹149',
    time: '20 mins',
    rating: '4.9 (510+)'
  },
  {
    id: 'leak-repair',
    title: 'Water Leak Repairs',
    category: 'plumbing',
    badge: 'Emergency',
    description: 'Instant leak detection & sealing for ceiling dampness, concealed pipes, and tanks.',
    icon: Droplets,
    categoryLabel: 'Plumbing',
    price: '₹399',
    time: '40 mins',
    rating: '4.9 (310+)'
  },
  {
    id: 'pipe-install',
    title: 'Pipe Installation',
    category: 'plumbing',
    description: 'CPVC & PVC pipe fitting for new bathrooms, kitchens, water meters, and pumps.',
    icon: GitCommit,
    categoryLabel: 'Plumbing',
    price: '₹499',
    time: '60 mins',
    rating: '4.8 (260+)'
  }
];

export default function Services({ onOpenBooking }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesCategory = activeTab === 'all' || service.category === activeTab || (activeTab === 'emergency' && service.badge === 'Emergency');
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge">
            <Zap size={14} />
            <span>Verified Experts</span>
          </div>
          <h2 className="section-title">Popular Services</h2>
          <p className="section-subtitle mx-auto">
            Choose from our top-rated electrical and plumbing services. transparent upfront estimates, no hidden charges.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="services-filter-bar">
          <div className="filter-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Services
            </button>
            <button 
              className={`tab-btn ${activeTab === 'electrical' ? 'active' : ''}`}
              onClick={() => setActiveTab('electrical')}
            >
              ⚡ Electrical
            </button>
            <button 
              className={`tab-btn ${activeTab === 'plumbing' ? 'active' : ''}`}
              onClick={() => setActiveTab('plumbing')}
            >
              🚰 Plumbing
            </button>
            <button 
              className={`tab-btn ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              🚨 Emergency
            </button>
          </div>

          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search service e.g. leak, fan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="services-grid">
          {filteredServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <div key={service.id} className="service-card glass-card">
                {service.badge && (
                  <span className={`service-badge ${service.badge === 'Emergency' ? 'badge-red' : 'badge-blue'}`}>
                    {service.badge}
                  </span>
                )}

                <div className="service-card-header">
                  <div className={`service-icon-wrapper ${service.category}`}>
                    <IconComponent size={26} />
                  </div>
                  <div className="service-rating">
                    ⭐ <span>{service.rating}</span>
                  </div>
                </div>

                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>

                <div className="service-card-meta">
                  <div className="meta-price">
                    <span className="price-label">Starts at</span>
                    <span className="price-val">{service.price}</span>
                  </div>
                  <div className="meta-time">
                    <Clock size={14} />
                    <span>{service.time}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onOpenBooking(service.title)} 
                  className="service-book-btn"
                >
                  <span>Book Now</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
