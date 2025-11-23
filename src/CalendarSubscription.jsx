import { useState } from 'react';
import './CalendarSubscription.css';

function CalendarSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [copied, setCopied] = useState(false);
  
  const timezones = [
    { value: 'UTC', label: 'UTC (Universal)' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Chicago', label: 'Central Time (US)' },
    { value: 'America/Denver', label: 'Mountain Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'America/Mexico_City', label: 'Mexico City' },
    { value: 'Europe/London', label: 'London (UK)' },
    { value: 'Europe/Paris', label: 'Paris (EU)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (Japan)' },
    { value: 'Australia/Sydney', label: 'Sydney (Australia)' }
  ];
  
  const getCalendarUrl = () => {
    const path = `/api/moon-calendar?timezone=${encodeURIComponent(selectedTimezone)}`;
    if (typeof window !== 'undefined') {
      return `https://${window.location.host}${path}`;
    }
    return path;
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
              Receive automatic New Moon and Full Moon events in your calendar. 
              Events will update automatically each month!
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
            
            <div className="subscription-url-display">
              <label>Your Calendar Subscription URL:</label>
              <input 
                type="text" 
                value={getCalendarUrl()} 
                readOnly 
                onClick={(e) => e.target.select()}
                className="url-input"
              />
            </div>
            
            <div className="button-group">
              <button 
                className="primary-button"
                onClick={copyToClipboard}
              >
                {copied ? 'Copied!' : 'Copy Subscription URL'}
              </button>
            </div>
            
            <div className="instructions">
              <h3>How to Subscribe:</h3>
              
              <div className="instruction-section">
                <h4>iPhone/iPad:</h4>
                <ol>
                  <li>Copy URL above</li>
                  <li>Settings → Calendar → Accounts → Add Account → Other</li>
                  <li>Add Subscribed Calendar</li>
                  <li>Paste URL → Subscribe</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>Mac:</h4>
                <ol>
                  <li>Copy URL above</li>
                  <li>Calendar → File → New Calendar Subscription</li>
                  <li>Paste URL → Subscribe</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>Google Calendar:</h4>
                <ol>
                  <li>Copy URL above</li>
                  <li>+ next to "Other calendars" → From URL</li>
                  <li>Paste URL → Add calendar</li>
                </ol>
              </div>
            </div>
            
            <div className="modal-footer">
              <p className="fine-print">
                Includes New & Full Moons for 12 months. Auto-updates. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarSubscription;
