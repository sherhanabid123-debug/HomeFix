import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, MessageSquare, Smartphone, Mail } from 'lucide-react';
import './NotificationsCenter.css';

export default function NotificationsCenter() {
  const [targetGroup, setTargetGroup] = useState('All Customers');
  const [channel, setChannel] = useState('Push');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (title && message) {
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        setTitle('');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div className="notifications-mgmt-page">
      <div className="module-header glass-card">
        <div>
          <h2>Notifications Broadcast Center</h2>
          <p>Send instant announcements via Push, SMS, and Email to all users</p>
        </div>
      </div>

      <div className="glass-card p-6 max-w-2xl">
        {sentSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 p-4 rounded-xl mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span>Notification dispatched successfully to <strong>{targetGroup}</strong> via {channel}!</span>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="form-label">Target Recipient Group</label>
            <select value={targetGroup} onChange={(e) => setTargetGroup(e.target.value)} className="form-select">
              <option value="All Customers">👥 All Customers (Kannur & Kozhikode)</option>
              <option value="All Technicians">👷 All Technicians</option>
              <option value="Specific Customer">👤 Specific Customer</option>
              <option value="Specific Technician">🛠️ Specific Technician</option>
            </select>
          </div>

          <div>
            <label className="form-label">Notification Channel</label>
            <div className="grid grid-cols-4 gap-2">
              {['Push', 'SMS', 'Email', 'In App'].map(ch => (
                <button 
                  key={ch} 
                  type="button" 
                  className={`btn-secondary btn-sm ${channel === ch ? 'bg-primary text-white border-primary' : ''}`}
                  onClick={() => setChannel(ch)}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Notification Title</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Monsoon Electrical Safety Check Discount" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Notification Message Body</label>
            <textarea 
              className="form-input h-24" 
              placeholder="Type notification text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            <Send size={16} /> Broadcast Notification Now
          </button>
        </form>
      </div>
    </div>
  );
}
