// Vercel Serverless Function: Moon Calendar iCal Feed
// Generates calendar subscription for New Moon, Full Moon, Eclipses, and Seasonal Gateways

import SunCalc from 'suncalc';

// Zodiac signs with dates
const zodiacSigns = [
  { name: "Aries", start: [3, 21], end: [4, 19] },
  { name: "Taurus", start: [4, 20], end: [5, 20] },
  { name: "Gemini", start: [5, 21], end: [6, 20] },
  { name: "Cancer", start: [6, 21], end: [7, 22] },
  { name: "Leo", start: [7, 23], end: [8, 22] },
  { name: "Virgo", start: [8, 23], end: [9, 22] },
  { name: "Libra", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", start: [1, 20], end: [2, 18] },
  { name: "Pisces", start: [2, 19], end: [3, 20] }
];

function getZodiacSign(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign.name;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign.name;
      }
    }
  }
  return "Pisces";
}

// Find the next New Moon or Full Moon from a given date
function findNextMoonPhase(startDate, targetPhase) {
  let currentDate = new Date(startDate);
  let previousIllumination = SunCalc.getMoonIllumination(currentDate);
  
  // Search forward day by day for phase transition
  for (let i = 0; i < 40; i++) { // Max 40 days to find next phase
    currentDate.setDate(currentDate.getDate() + 1);
    const illumination = SunCalc.getMoonIllumination(currentDate);
    
    // New Moon: phase crosses from ~0.97 to ~0.03 (phase wraps around)
    if (targetPhase === 'new') {
      if (previousIllumination.phase > 0.95 && illumination.phase < 0.05) {
        return findExactMoonPhase(currentDate, 'new');
      }
    }
    
    // Full Moon: phase crosses 0.5
    if (targetPhase === 'full') {
      if (previousIllumination.phase < 0.5 && illumination.phase >= 0.5) {
        return findExactMoonPhase(currentDate, 'full');
      }
    }
    
    previousIllumination = illumination;
  }
  
  return null;
}

// Fine-tune to find exact hour of moon phase
function findExactMoonPhase(approximateDate, targetPhase) {
  let bestDate = new Date(approximateDate);
  let bestDifference = 1;
  
  // Search 24 hours around the approximate date
  const startTime = approximateDate.getTime() - (12 * 60 * 60 * 1000);
  
  for (let i = 0; i < 24 * 4; i++) { // Check every 15 minutes
    const testDate = new Date(startTime + (i * 15 * 60 * 1000));
    const illumination = SunCalc.getMoonIllumination(testDate);
    
    let difference;
    if (targetPhase === 'new') {
      difference = Math.min(illumination.phase, 1 - illumination.phase);
    } else {
      difference = Math.abs(illumination.phase - 0.5);
    }
    
    if (difference < bestDifference) {
      bestDifference = difference;
      bestDate = new Date(testDate);
    }
  }
  
  return bestDate;
}

// Generate lunar events (only one event per lunation)
function generateLunarEvents(months = 12) {
  const events = [];
  let currentDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);
  
  const processedPhases = new Set();
  
  while (currentDate < endDate) {
    // Find next New Moon
    const newMoon = findNextMoonPhase(currentDate, 'new');
    if (newMoon && newMoon < endDate) {
      const key = `new-${newMoon.toISOString().split('T')[0]}`;
      if (!processedPhases.has(key)) {
        processedPhases.add(key);
        const sign = getZodiacSign(newMoon);
        events.push({
          type: 'new',
          date: newMoon,
          sign: sign,
          summary: `New Moon in ${sign}`,
          description: `New Moon in ${sign} • The Void • Pure Potential\\n\\nIn darkness, all possibilities exist. This is the sacred pause before creation—the breath between worlds. Rest in the mystery.\\n\\nPhase Quality: Initiation, planting intentions, pure potential\\n\\nEssential Oils: Jasmine, Sandalwood, Frankincense\\nCrystals: Black Moonstone, Obsidian, Labradorite\\n\\nThese correspondences are linked to the lunation's astrological signature. For detailed guidance on working with this ${sign} New Moon, visit moonlightsage.co`
        });
      }
      currentDate = new Date(newMoon.getTime() + 12 * 24 * 60 * 60 * 1000); // Skip ahead 12 days
    }
    
    // Find next Full Moon  
    const fullMoon = findNextMoonPhase(currentDate, 'full');
    if (fullMoon && fullMoon < endDate) {
      const key = `full-${fullMoon.toISOString().split('T')[0]}`;
      if (!processedPhases.has(key)) {
        processedPhases.add(key);
        const sign = getZodiacSign(fullMoon);
        events.push({
          type: 'full',
          date: fullMoon,
          sign: sign,
          summary: `Full Moon in ${sign}`,
          description: `Full Moon in ${sign} • The Revelation • Complete Illumination\\n\\nAll is revealed. See clearly what was hidden. This is peak manifestation—celebrate, release, acknowledge.\\n\\nPhase Quality: Culmination, revelation, illumination, completion\\n\\nEssential Oils: Jasmine, Ylang Ylang, Sandalwood\\nCrystals: Selenite, Clear Quartz, Moonstone\\n\\nThese correspondences are linked to the lunation's astrological signature. For detailed guidance on working with this ${sign} Full Moon, visit moonlightsage.co`
        });
      }
      currentDate = new Date(fullMoon.getTime() + 12 * 24 * 60 * 60 * 1000); // Skip ahead 12 days
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  // Add seasonal gateways
  const gateways = generateSeasonalGateways(new Date().getFullYear(), new Date().getFullYear() + 1);
  events.push(...gateways);
  
  // Sort by date
  events.sort((a, b) => a.date - b.date);
  
  return events;
}

// Generate seasonal gateway events
function generateSeasonalGateways(startYear, endYear) {
  const gateways = [];
  
  // Approximate dates (these shift slightly each year)
  // Note: month - 1 because JavaScript months are 0-indexed
  const gatewayDates = [
    { month: 3, day: 21, name: "Spring Equinox", desc: "Gateway of Emergence • Balance point between dark and light. The seed breaks through soil." },
    { month: 6, day: 21, name: "Summer Solstice", desc: "Gateway of Fullness • Peak solar power. Maximum light, outward expression." },
    { month: 9, day: 23, name: "Autumn Equinox", desc: "Gateway of Truth • Balance returns. Harvest and reflection." },
    { month: 12, day: 22, name: "Winter Solstice", desc: "Gateway of Initiation • Deepest darkness before rebirth. The inner work begins." }
  ];
  
  for (let year = startYear; year <= endYear; year++) {
    for (const gw of gatewayDates) {
      const date = new Date(Date.UTC(year, gw.month - 1, gw.day, 12, 0, 0));
      gateways.push({
        type: 'gateway',
        date: date,
        summary: gw.name,
        description: `${gw.desc}\\n\\nLearn more about the Wheel of the Year at moonlightsage.co`
      });
    }
  }
  
  return gateways;
}

// Format date for iCal DATETIME (with time)
function formatICalDateTime(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return date.getUTCFullYear() +
         pad(date.getUTCMonth() + 1) +
         pad(date.getUTCDate()) + 'T' +
         pad(date.getUTCHours()) +
         pad(date.getUTCMinutes()) +
         pad(date.getUTCSeconds()) + 'Z';
}

// Format date for iCal DATE (all-day, no time)
function formatICalDateOnly(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return date.getUTCFullYear() +
         pad(date.getUTCMonth() + 1) +
         pad(date.getUTCDate());
}

// Generate iCal content
function generateICalContent(events) {
  const now = new Date();
  
  let icalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MoonlightSage//Lunar Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:MoonlightSage Lunar Calendar',
    'X-WR-CALDESC:New Moon, Full Moon, and Seasonal Gateways',
    'X-WR-TIMEZONE:UTC',
    'REFRESH-INTERVAL;VALUE=DURATION:P1W',
    'X-PUBLISHED-TTL:PT1H',
    'NAME:MoonlightSage Lunar Calendar'
  ].join('\r\n');
  
  events.forEach((event) => {
    const uid = `moonlightsage-${event.type}-${event.date.getTime()}@moonlightsage.co`;
    const dtstamp = formatICalDateTime(now);
    
    // Seasonal gateways = all-day events
    // Moon phases = timed events (show exact time in user's timezone)
    if (event.type === 'gateway') {
      const dtstart = formatICalDateOnly(event.date);
      const nextDay = new Date(event.date);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      const dtend = formatICalDateOnly(nextDay);
      
      icalContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${event.summary}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'URL:https://moonlightsage.co',
        'SEQUENCE:0',
        'END:VEVENT'
      ].join('\r\n');
    } else {
      const dtstart = formatICalDateTime(event.date);
      const dtend = formatICalDateTime(new Date(event.date.getTime() + 60 * 60 * 1000));
      
      icalContent += '\r\n' + [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `SUMMARY:${event.summary}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
        'STATUS:CONFIRMED',
        'TRANSP:TRANSPARENT',
        'URL:https://moonlightsage.co',
        'SEQUENCE:0',
        'END:VEVENT'
      ].join('\r\n');
    }
  });
  
  icalContent += '\r\nEND:VCALENDAR';
  
  return icalContent;
}

// Vercel serverless function handler
export default function handler(req, res) {
  try {
    const months = parseInt(req.query.months) || 12;
    const events = generateLunarEvents(months);
    const icalContent = generateICalContent(events);
    
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="moonlightsage-lunar-calendar.ics"');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    res.status(200).send(icalContent);
  } catch (error) {
    console.error('Error generating moon calendar:', error);
    res.status(500).json({ error: 'Failed to generate calendar' });
  }
}
