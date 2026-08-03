import React, { useState } from 'react';
import { X, MapPin, Navigation, Compass, Check, AlertCircle, Loader2 } from 'lucide-react';
import './AddAddressModal.css';

export default function AddAddressModal({ isOpen, onClose, onSaveAddress }) {
  const [tag, setTag] = useState('Home'); // 'Home' | 'Office' | 'Apartment' | 'Other'
  const [houseNo, setHouseNo] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Kannur');
  const [landmark, setLandmark] = useState('');
  
  // Geolocation & Map States
  const [detecting, setDetecting] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState(null);
  const [detectionSuccess, setDetectionSuccess] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Auto-Detect Location using HTML5 Geolocation + OpenStreetMap Reverse Geocoding
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setDetecting(true);
    setErrorMessage('');
    setDetectionSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setDetectedCoords({ lat, lng });

        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();

          if (data && data.address) {
            const detectedArea = data.address.suburb || data.address.neighbourhood || data.address.road || data.address.residential || 'Central Area';
            const detectedCity = (data.address.city || data.address.town || data.address.county || '').toLowerCase().includes('kozhikode') ? 'Kozhikode' : 'Kannur';

            setArea(detectedArea);
            setCity(detectedCity);
            if (data.address.building || data.address.house_number) {
              setHouseNo(data.address.building || `House #${data.address.house_number}`);
            }
            setDetectionSuccess(`Location detected: ${detectedArea}, ${detectedCity} (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
          } else {
            setArea('Main Road');
            setDetectionSuccess(`Location detected (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
          }
        } catch (err) {
          console.warn("Reverse geocode fetch error:", err);
          setDetectionSuccess(`Coordinates captured: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`);
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        setDetecting(false);
        console.warn("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location permission was denied. Please enter address manually.');
        } else {
          setErrorMessage('Could not fetch location. Please enter address manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!houseNo || !area) {
      setErrorMessage('Please fill in House/Flat number and Area details.');
      return;
    }

    const newAddress = {
      id: `ADDR-${Date.now().toString().slice(-4)}`,
      tag,
      houseNo,
      area,
      city,
      landmark: landmark || '',
      lat: detectedCoords ? detectedCoords.lat : (city === 'Kannur' ? 11.8745 : 11.2588),
      lng: detectedCoords ? detectedCoords.lng : (city === 'Kannur' ? 75.3704 : 75.7804),
      fullText: `${houseNo}, ${area}, ${landmark ? landmark + ', ' : ''}${city}`
    };

    onSaveAddress(newAddress);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-address-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="brand-badge-circle">
            <MapPin size={22} className="text-primary" />
          </div>
          <h3 className="modal-title">Add Saved Address</h3>
          <p className="modal-sub">Save your home or office address for fast 1-click booking</p>
        </div>

        {/* Automatic Location Detection Button */}
        <div className="location-detect-box">
          <button 
            type="button" 
            onClick={handleDetectLocation} 
            disabled={detecting}
            className="btn-auto-location"
          >
            {detecting ? (
              <>
                <Loader2 size={18} className="animate-spin text-primary" />
                <span>Detecting GPS Location...</span>
              </>
            ) : (
              <>
                <Navigation size={18} className="text-primary" />
                <span>Use Current Location (GPS Auto-Detect)</span>
              </>
            )}
          </button>
        </div>

        {detectionSuccess && (
          <div className="location-success-alert">
            <Check size={16} className="text-emerald" />
            <span>{detectionSuccess}</span>
          </div>
        )}

        {errorMessage && (
          <div className="location-error-alert">
            <AlertCircle size={16} className="text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Map Preview Card */}
        {detectedCoords && (
          <div className="map-preview-box">
            <div className="map-pin-indicator">
              <Compass size={20} className="text-primary animate-pulse" />
              <span>Pinned Map Location: <strong>{detectedCoords.lat.toFixed(4)}° N, {detectedCoords.lng.toFixed(4)}° E</strong></span>
            </div>
            <iframe
              title="Location Map"
              width="100%"
              height="120"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${detectedCoords.lat},${detectedCoords.lng}&z=15&output=embed`}
              className="map-iframe"
            ></iframe>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-address-form mt-3">
          {/* Address Tag Selector */}
          <div className="form-group">
            <label className="form-label">Save Address As</label>
            <div className="tag-selector-row">
              {['Home', 'Office', 'Apartment', 'Other'].map(t => (
                <button
                  type="button"
                  key={t}
                  className={`tag-btn ${tag === t ? 'active' : ''}`}
                  onClick={() => setTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">House / Flat / Building No.</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. House #42, Villa No. 3"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              required
            />
          </div>

          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">Street / Locality / Area</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Thana Road, Near Fort"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">District City</label>
              <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="Kannur">Kannur</option>
                <option value="Kozhikode">Kozhikode</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Landmark (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Opposite City Center Mall"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-3">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
