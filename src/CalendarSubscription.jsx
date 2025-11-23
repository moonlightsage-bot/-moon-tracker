import { useState } from 'react';
import './CalendarSubscription.css';

function CalendarSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  
  // Common timezones
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
    // Return full URL for display
    if (typeof window !== 'undefined') {
      return `https://${window.location.host}${path}`;
    }
    return path;
  };
  
  const handleSubscribe = () => {
    // Generate the calendar URL
    const calendarUrl = getCalendarUrl();
    
    // Use https:// instead of webcal:// for better Vercel compatibility
    // Most modern calendar apps can handle https:// .ics subscriptions
    const httpsUrl = `https://${window.location.host}${calendarUrl}`;
    
    // Try to open the calendar subscription
    window.location.href = httpsUrl;
    
    // Close modal after a delay
    setTimeout(() => {
      setIsModalOpen(false);
    }, 500);
  };
  
  const copyToClipboard = async () => {
    const url = getCalendarUrl();
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      alert(`Copy this URL: ${url}`);
    }
  };
  
  return (
    <div className="calendar-subscription">
      <button 
        className="subscribe-button"
        onClick={() => setIsModalOpen(true)}
      >
        📅 Subscribe to Moon Calendar
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
                <h4>iPhone/iPad (Apple Calendar):</h4>
                <ol>
                  <li>Click "Copy Subscription URL" above</li>
                  <li>Open Settings → Calendar → Accounts</li>
                  <li>Tap "Add Account" → "Other"</li>
                  <li>Tap <strong>"Add Subscribed Calendar"</strong></li>
                  <li>Paste the URL</li>
                  <li>Tap "Subscribe"</li>
                  <li>Events will auto-update!</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>Mac (Apple Calendar):</h4>
                <ol>
                  <li>Click "Copy Subscription URL" above</li>
                  <li>Open Calendar app</li>
                  <li>Go to <strong>File → New Calendar Subscription</strong></li>
                  <li><strong>IMPORTANT:</strong> Do NOT use "Import" - you must use "New Calendar Subscription"</li>
                  <li>Paste the URL</li>
                  <li>Click "Subscribe"</li>
                  <li>Set refresh to "Every week"</li>
                  <li>The calendar will auto-update with new events!</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>Google Calendar:</h4>
                <ol>
                  <li>Click "Copy Subscription URL" above</li>
                  <li>Go to <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">calendar.google.com</a></li>
                  <li>On the left sidebar, click the <strong>+</strong> next to "Other calendars"</li>
                  <li>Select <strong>"From URL"</strong></li>
                  <li>Paste the URL</li>
                  <li>Click <strong>"Add calendar"</strong></li>
                  <li>Wait a few minutes for sync</li>
                  <li>Look for "MoonlightSage Lunar Calendar" in your calendar list</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>💼 Outlook:</h4>
                <ol>
                  <li>Click "Copy Link" above</li>
                  <li>In Outlook, go to "Add Calendar"</li>
                  <li>Choose "Subscribe from web"</li>
                  <li>Paste the link and subscribe</li>
                </ol>
              </div>
            </div>
            
            <div className="modal-footer">
              <p className="fine-print">
                Calendar includes New Moon and Full Moon events for the next 12 months.
                Events update automatically. Unsubscribe anytime from your calendar app.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarSubscription;
