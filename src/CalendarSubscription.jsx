import { useState } from 'react';
import './CalendarSubscription.css';

function CalendarSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [copied, setCopied] = useState(false);
  
  const timezones = [
    { value: 'America/Mexico_City', label: 'Mexico City' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Chicago', label: 'Central Time (US)' },
    { value: 'America/Denver', label: 'Mountain Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'Europe/London', label: 'London (UK)' },
    { value: 'Europe/Paris', label: 'Paris (EU)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (Japan)' },
    { value: 'Australia/Sydney', label: 'Sydney (Australia)' },
    { value: 'UTC', label: 'UTC (Universal)' }
  ];
  
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return `https://${window.location.host}`;
    }
    return 'https://moon-tracker-ten.vercel.app';
  };
  
  const getCalendarUrl = () => {
    return `${getBaseUrl()}/api/moon-calendar?timezone=${encodeURIComponent(selectedTimezone)}`;
  };
  
  const getAppleCalendarUrl = () => {
    // webcal:// protocol opens directly in Apple Calendar
    return `webcal://${window.location.host}/api/moon-calendar?timezone=${encodeURIComponent(selectedTimezone)}`;
  };
  
  const getGoogleCalendarUrl = () => {
    // Google Calendar needs webcal:// or direct https URL
    const baseUrl = window.location.host;
    const calPath = `/api/moon-calendar?timezone=${encodeURIComponent(selectedTimezone)}`;
    return `https://calendar.google.com/calendar/u/0/r?cid=webcal://${baseUrl}${calPath}`;
  };
  
  const handleAppleClick = () => {
    window.location.href = getAppleCalendarUrl();
  };
  
  const handleGoogleClick = () => {
    window.open(getGoogleCalendarUrl(), '_blank');
  };
  
  const handleDownload = () => {
    window.location.href = getCalendarUrl();
  };
  
  const copyToClipboard = async () => {
    const url = getCalendarUrl();
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert(`Copy this URL: ${url}`);
    }
  };
  
  return (
    <div className="calendar-subscription">
      <button 
        className="subscribe-button"
        onClick={() => setIsModalOpen(true)}
      >
        Subscribe to Moon Calendar
      </button>
      
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            
            <h2>Subscribe to Lunar Events</h2>
            <p className="modal-description">
              Receive New Moon & Full Moon events, Solstices & Equinoxes directly in your calendar.
            </p>
            
            <div className="timezone-selector">
              <label htmlFor="timezone">Select Your Timezone:</label>
              <select 
                id="timezone"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="calendar-buttons">
              <button 
                className="calendar-btn apple-btn"
                onClick={handleAppleClick}
              >
                <span className="btn-icon">📱</span>
                <span className="btn-text">Add to Apple Calendar</span>
              </button>
              
              <button 
                className="calendar-btn google-btn"
                onClick={handleGoogleClick}
              >
                <span className="btn-icon">📅</span>
                <span className="btn-text">Add to Google Calendar</span>
              </button>
              
              <button 
                className="calendar-btn download-btn"
                onClick={handleDownload}
              >
                <span className="btn-icon">📥</span>
                <span className="btn-text">Download .ics File</span>
              </button>
            </div>
            
            <div className="manual-section">
              <p className="manual-label">Or copy the subscription URL:</p>
              <div className="url-row">
                <input 
                  type="text" 
                  value={getCalendarUrl()} 
                  readOnly 
                  onClick={(e) => e.target.select()}
                  className="url-input"
                />
                <button 
                  className="copy-btn"
                  onClick={copyToClipboard}
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            
            <div className="modal-footer">
              <p className="fine-print">
                Includes New & Full Moons + Seasonal Gateways for 12 months.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarSubscription;
