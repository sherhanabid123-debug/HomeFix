import React, { useState, useEffect } from 'react';
import { Zap, Clock, ArrowRight, X } from 'lucide-react';
import './ActiveBookingBar.css';

export default function ActiveBookingBar({ onOpenTrack }) {
  const [latestBooking, setLatestBooking] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkBooking = () => {
      try {
        const saved = localStorage.getItem('homefix_live_bookings');
        if (!saved || saved === 'undefined' || saved === 'null') {
          setLatestBooking(null);
          return;
        }
        const liveBookings = JSON.parse(saved);
        if (Array.isArray(liveBookings)) {
          const active = liveBookings.find(b => b.status !== 'Completed' && b.status !== 'Cancelled');
          setLatestBooking(active || null);
        } else {
          setLatestBooking(null);
        }
      } catch (err) {
        console.error("ActiveBookingBar localStorage error:", err);
        setLatestBooking(null);
      }
    };

    checkBooking();
    const interval = setInterval(checkBooking, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!latestBooking || dismissed) return null;

  return (
    <div className="active-booking-sticky-bar">
      <div className="active-bar-content">
        <div className="active-bar-icon">
          <Zap size={20} className="icon-pulse" />
        </div>
        <div className="active-bar-info">
          <div className="active-bar-title">
            <strong>Active Booking #{latestBooking.id}</strong> • <span className="status-highlight">{latestBooking.status === 'Pending' ? 'Matching Technician' : latestBooking.status}</span>
          </div>
          <p className="active-bar-sub">
            {latestBooking.service} in {latestBooking.city} • Slot: {latestBooking.scheduledSlot}
          </p>
        </div>
        <button 
          onClick={() => onOpenTrack(latestBooking.id)} 
          className="btn-primary btn-sm btn-track-active"
        >
          <span>Track Live Status</span>
          <ArrowRight size={16} />
        </button>
        <button 
          className="active-bar-dismiss" 
          onClick={() => setDismissed(true)} 
          title="Dismiss banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
