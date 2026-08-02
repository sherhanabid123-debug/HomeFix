import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, ToggleLeft, ToggleRight, Phone, Mail, CreditCard, Lock } from 'lucide-react';
import './PlatformSettings.css';

export default function PlatformSettings({ settings, setSettings }) {
  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({ ...formData });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="settings-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Platform Settings</h2>
          <p>Global HomeFix marketplace parameters, commission rates, and security rules</p>
        </div>
      </div>

      <div className="glass-card p-6 max-w-3xl">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 p-3 rounded-xl mb-4 text-sm font-bold">
            ✓ Settings saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Platform Commission (%)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.platformCommissionPercent}
                onChange={(e) => setFormData({ ...formData, platformCommissionPercent: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label">Emergency Express Fee (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.emergencySurgeFee}
                onChange={(e) => setFormData({ ...formData, emergencySurgeFee: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Technician Dispatch Radius (KM)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.bookingRadiusKm}
                onChange={(e) => setFormData({ ...formData, bookingRadiusKm: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="form-label">OTP Expiry (Minutes)</label>
              <input 
                type="number" 
                className="form-input" 
                value={formData.otpExpiryMinutes}
                onChange={(e) => setFormData({ ...formData, otpExpiryMinutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Support Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Support Phone</label>
              <input 
                type="text" 
                className="form-input" 
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <strong className="block text-dark">Platform Maintenance Mode</strong>
              <span className="text-xs text-gray">Temporarily pause new customer bookings for system updates</span>
            </div>
            <button 
              type="button" 
              onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
              className="text-primary"
            >
              {formData.maintenanceMode ? <ToggleRight size={36} color="#EF4444" /> : <ToggleLeft size={36} color="#94A3B8" />}
            </button>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={16} /> Save All Changes
          </button>
        </form>
      </div>
    </div>
  );
}
