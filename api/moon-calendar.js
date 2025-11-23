import SunCalc from 'suncalc';

const zodiacSigns = [
  { name: "Aries", symbol: "♈", opposite: "Libra", start: [3, 21], end: [4, 19] },
  { name: "Taurus", symbol: "♉", opposite: "Scorpio", start: [4, 20], end: [5, 20] },
  { name: "Gemini", symbol: "♊", opposite: "Sagittarius", start: [5, 21], end: [6, 20] },
  { name: "Cancer", symbol: "♋", opposite: "Capricorn", start: [6, 21], end: [7, 22] },
  { name: "Leo", symbol: "♌", opposite: "Aquarius", start: [7, 23], end: [8, 22] },
  { name: "Virgo", symbol: "♍", opposite: "Pisces", start: [8, 23], end: [9, 22] },
  { name: "Libra", symbol: "♎", opposite: "Aries", start: [9, 23], end: [10, 22] },
  { name: "Scorpio", symbol: "♏", opposite: "Taurus", start: [10, 23], end: [11, 21] },
  { name: "Sagittarius", symbol: "♐", opposite: "Gemini", start: [11, 22], end: [12, 21] },
  { name: "Capricorn", symbol: "♑", opposite: "Cancer", start: [12, 22], end: [1, 19] },
  { name: "Aquarius", symbol: "♒", opposite: "Leo", start: [1, 20], end: [2, 18] },
  { name: "Pisces", symbol: "♓", opposite: "Virgo", start: [2, 19], end: [3, 20] }
];

function getSunSign(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;
    
    if (startMonth === endMonth) {
      if (month === startMonth && day >= startDay && day <= endDay) return sign;
    } else {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
        return sign;
      }
    }
  }
  return zodiacSigns[11];
}

function findNextMoonPhase(startDate, targetPhase) {
  let currentDate = new Date(startDate);
  let previousIllumination = SunCalc.getMoonIllumination(currentDate);
  
  for (let i = 0; i < 40; i++) {
    currentDate.setDate(currentDate.getDate() + 1);
    const illumination = SunCalc.getMoonIllumination(currentDate);
    
    if (targetPhase === 'new') {
      if (previousIllumination.phase > 0.95 && illumination.phase < 0.05) {
        return findExactMoonPhase(currentDate, 'new');
      }
    }
    
    if (targetPhase === 'full') {
      if (previousIllumination.phase < 0.5 && illumination.phase >= 0.5) {
        return findExactMoonPhase(currentDate, 'full');
      }
    }
    
    previousIllumination = illumination;
  }
  
  return null;
}

function findExactMoonPhase(approximateDate, targetPhase) {
  let bestDate = new Date(approximateDate);
  let bestDifference = 1;
  
  const startTime = approximateDate.getTime() - (12 * 60 * 60 * 1000);
  
  for (let i = 0; i < 24 * 4; i++) {
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

function generateLunarEvents(months = 12) {
  const events = [];
  let currentDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + months);
  
  while (currentDate < endDate) {
    const newMoon = findNextMoonPhase(currentDate, 'new');
    if (newMoon && newMoon < endDate) {
      const sunSign = getSunSign(newMoon);
      events.push({
        type: 'new',
        date: newMoon,
        sign: sunSign.name,
        summary: `${sunSign.symbol} New Moon in ${sunSign.name}`,
        description: `New Moon in ${sunSign.name}\\n\\nThe Void • Pure Potential\\n\\nMoon conjunct Sun in ${sunSign.name}. Initiation, planting intentions, pure potential.`
      });
      currentDate = new Date(newMoon.getTime() + 1 * 24 * 60 * 60 * 1000);
    }
    
    const fullMoon = findNextMoonPhase(currentDate, 'full');
    if (fullMoon && fullMoon < endDate) {
      const sunSign = getSunSign(fullMoon);
      const moonSign = sunSign.opposite;
      events.push({
        type: 'full',
        date: fullMoon,
        sign: moonSign,
        summary: `Full Moon in ${moonSign}`,
        description: `Full Moon in ${moonSign}\\n\\nThe Revelation • Complete Illumination\\n\\nMoon opposite Sun. Culmination, revelation, illumination.`
      });
      currentDate = new Date(fullMoon.getTime() + 1 * 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }
  
  const gateways = [
    { month: 3, day: 20, name: "Spring Equinox" },
    { month: 6, day: 21, name: "Summer Solstice" },
    { month: 9, day: 22, name: "Autumn Equinox" },
    { month: 12, day: 21, name: "Winter Solstice" }
  ];
  
  for (let year = new Date().getFullYear(); year <= new Date().getFullYear() + 1; year++) {
    for (const gw of gateways) {
      const date = new Date(Date.UTC(year, gw.month - 1, gw.day, 0, 0, 0));
      if (date >= new Date() && date < endDate) {
        events.push({
          type: 'gateway',
          date: date,
          summary: gw.name,
          description: gw.name,
          allDay: true
        });
      }
    }
  }
  
  events.sort((a, b) => a.date - b.date);
  return events;
}

function formatICalDateTime(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + pad(date.getUTCMinutes()) + pad(date.getUTCSeconds()) + 'Z';
}

function formatICalDateOnly(date) {
  const pad = (num) => String(num).padStart(2, '0');
  return date.getUTCFullYear() + pad(date.getUTCMonth() + 1) + pad(date.getUTCDate());
}

function generateICalContent(events) {
  const now = new Date();
  
  let ical = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MoonlightSage//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:MoonlightSage Lunar Calendar\r\nREFRESH-INTERVAL;VALUE=DURATION:P1W\r\n';
  
  events.forEach(event => {
    const uid = `${event.type}-${event.date.getTime()}@moonlightsage.co`;
    const dtstamp = formatICalDateTime(now);
    
    if (event.allDay) {
      const dtstart = formatICalDateOnly(event.date);
      const nextDay = new Date(event.date);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      const dtend = formatICalDateOnly(nextDay);
      
      ical += `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTAMP:${dtstamp}\r\nDTSTART;VALUE=DATE:${dtstart}\r\nDTEND;VALUE=DATE:${dtend}\r\nSUMMARY:${event.summary}\r\nDESCRIPTION:${event.description}\r\nEND:VEVENT\r\n`;
    } else {
      const dtstart = formatICalDateTime(event.date);
      const dtend = formatICalDateTime(new Date(event.date.getTime() + 3600000));
      
      ical += `BEGIN:VEVENT\r\nUID:${uid}\r\nDTSTAMP:${dtstamp}\r\nDTSTART:${dtstart}\r\nDTEND:${dtend}\r\nSUMMARY:${event.summary}\r\nDESCRIPTION:${event.description}\r\nEND:VEVENT\r\n`;
    }
  });
  
  ical += 'END:VCALENDAR';
  return ical;
}

export default function handler(req, res) {
  try {
    const events = generateLunarEvents(12);
    const ical = generateICalContent(events);
    
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="moonlightsage.ics"');
    res.setHeader('Cache-Control', 's-maxage=3600');
    
    res.status(200).send(ical);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
