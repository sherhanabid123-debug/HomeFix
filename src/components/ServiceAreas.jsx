import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, Clock, Users, Send } from 'lucide-react';
import './ServiceAreas.css';

const KERALA_DISTRICTS = [
  { id: 'kannur', name: 'Kannur', status: 'Active Now', pros: '48 Verified Pros', eta: '35 mins', popular: 'Payyambalam, Thana, Talap, Fort Road, Mattannur' },
  { id: 'kozhikode', name: 'Kozhikode', status: 'Active Now', pros: '62 Verified Pros', eta: '30 mins', popular: 'Mavoor Road, Beach Road, Calicut City, Feroke, Nadakkavu' },
  { id: 'kochi', name: 'Kochi (Ernakulam)', status: 'Launching Q4', pros: 'Waitlist Open', eta: 'Coming Soon', popular: 'Kakkanad, Edappally, Fort Kochi' },
  { id: 'thrissur', name: 'Thrissur', status: 'Launching Q4', pros: 'Waitlist Open', eta: 'Coming Soon', popular: 'Swaraj Round, East Fort' },
  { id: 'trivandrum', name: 'Thiruvananthapuram', status: 'Launching Q4', pros: 'Waitlist Open', eta: 'Coming Soon', popular: 'Technopark, Kowdiar' }
];

export default function ServiceAreas({ onOpenBooking, onOpenPartner }) {
  const [selectedCity, setSelectedCity] = useState(KERALA_DISTRICTS[0]);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [userCity, setUserCity] = useState('');

  const handlePartnerClick = onOpenPartner || onOpenBooking;

  const handleVoteSubmit = (e) => {
    e.preventDefault();
    if (userCity.trim()) {
      setVoteSubmitted(true);
      setTimeout(() => setVoteSubmitted(false), 4000);
      setUserCity('');
    }
  };

  return (
    <section id="coverage" className="coverage-section">
      <div className="container">
        <div className="text-center">
          <div className="section-badge secondary">
            <Navigation size={14} />
            <span>Service Network</span>
          </div>
          <h2 className="section-title">Service Areas</h2>
          <p className="section-subtitle mx-auto">
            Launching first in <strong>Kannur & Kozhikode</strong>. More cities coming soon across Kerala.
          </p>
        </div>

        <div className="coverage-container grid-2-col">
          {/* Interactive Map Visual */}
          <div className="map-visual-card glass-card">
            <div className="map-header">
              <div className="live-indicator">
                <span className="pulse-dot"></span>
                <span>Live Service Network</span>
              </div>
              <span className="active-badge">2 Active Cities</span>
            </div>

            {/* Stylized SVG Map Representation of Kerala */}
            <div className="kerala-svg-wrapper">
              <svg viewBox="0 0 400 500" className="kerala-map-svg">
                {/* Outlines of Kerala Districts */}
                <path 
                  d="M120,40 L160,70 L140,120 L90,140 L70,80 Z" 
                  className={`district-path ${selectedCity.id === 'kannur' ? 'active' : ''}`}
                  onClick={() => setSelectedCity(KERALA_DISTRICTS[0])}
                />
                <path 
                  d="M140,120 L180,150 L165,210 L110,210 L90,140 Z" 
                  className={`district-path ${selectedCity.id === 'kozhikode' ? 'active' : ''}`}
                  onClick={() => setSelectedCity(KERALA_DISTRICTS[1])}
                />
                <path 
                  d="M165,210 L200,240 L185,310 L130,300 L110,210 Z" 
                  className={`district-path ${selectedCity.id === 'kochi' ? 'active' : ''}`}
                  onClick={() => setSelectedCity(KERALA_DISTRICTS[2])}
                />
                <path 
                  d="M185,310 L230,360 L200,420 L150,400 L130,300 Z" 
                  className={`district-path ${selectedCity.id === 'thrissur' ? 'active' : ''}`}
                  onClick={() => setSelectedCity(KERALA_DISTRICTS[3])}
                />
                <path 
                  d="M200,420 L250,440 L230,480 L180,470 L150,400 Z" 
                  className={`district-path ${selectedCity.id === 'trivandrum' ? 'active' : ''}`}
                  onClick={() => setSelectedCity(KERALA_DISTRICTS[4])}
                />

                {/* Hotspot Pins */}
                <g className="map-pin-group" onClick={() => setSelectedCity(KERALA_DISTRICTS[0])}>
                  <circle cx="120" cy="90" r="14" className="pin-pulse" />
                  <circle cx="120" cy="90" r="8" className="pin-core active-pin" />
                  <text x="140" y="95" className="pin-label">Kannur (ACTIVE)</text>
                </g>

                <g className="map-pin-group" onClick={() => setSelectedCity(KERALA_DISTRICTS[1])}>
                  <circle cx="135" cy="165" r="14" className="pin-pulse" />
                  <circle cx="135" cy="165" r="8" className="pin-core active-pin" />
                  <text x="155" y="170" className="pin-label">Kozhikode (ACTIVE)</text>
                </g>

                <g className="map-pin-group" onClick={() => setSelectedCity(KERALA_DISTRICTS[2])}>
                  <circle cx="155" cy="255" r="6" className="pin-core upcoming-pin" />
                  <text x="170" y="260" className="pin-label upcoming">Kochi (Soon)</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Selected City Info Panel */}
          <div className="city-info-panel">
            <div className="city-selector-tabs">
              {KERALA_DISTRICTS.map((city) => (
                <button 
                  key={city.id}
                  className={`city-tab ${selectedCity.id === city.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  <MapPin size={16} />
                  <span>{city.name}</span>
                </button>
              ))}
            </div>

            <div className="city-detail-card glass-card">
              <div className="detail-header">
                <h3>{selectedCity.name}</h3>
                <span className={`status-pill ${selectedCity.status.includes('Active') ? 'active-pill' : 'soon-pill'}`}>
                  {selectedCity.status}
                </span>
              </div>

              <div className="detail-stats-grid">
                <div className="d-stat">
                  <Users size={18} className="d-icon" />
                  <div>
                    <span className="d-val">{selectedCity.pros}</span>
                    <span className="d-lbl">Technicians</span>
                  </div>
                </div>
                <div className="d-stat">
                  <Clock size={18} className="d-icon" />
                  <div>
                    <span className="d-val">{selectedCity.eta}</span>
                    <span className="d-lbl">Avg. Arrival</span>
                  </div>
                </div>
              </div>

              <div className="neighborhoods-list">
                <h4>Popular Neighborhoods Covered:</h4>
                <p>{selectedCity.popular}</p>
              </div>

              {selectedCity.status.includes('Active') ? (
                <button onClick={handlePartnerClick} className="btn-primary w-full mt-4">
                  Become a Technician in {selectedCity.name}
                </button>
              ) : (
                <div className="vote-box mt-4">
                  <p className="vote-title">Want HomeFix in your locality?</p>
                  <form onSubmit={handleVoteSubmit} className="vote-form">
                    <input 
                      type="text" 
                      placeholder="Enter your town/locality..." 
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn-emerald btn-sm">
                      <Send size={14} />
                      <span>Vote</span>
                    </button>
                  </form>
                  {voteSubmitted && (
                    <div className="vote-success">
                      <CheckCircle2 size={16} /> Vote registered! We will notify you when we expand.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
