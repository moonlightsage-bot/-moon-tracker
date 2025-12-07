const astronomy = require('astronomy-engine');

// Complete zodiac data with correspondences
const zodiacSigns = [
  { 
    name: "Aries", symbol: "♈", opposite: "Libra", start: [3, 21], end: [4, 19],
    ruler: "Mars ♂",
    oils: ["Ginger", "Black Pepper", "Rosemary"],
    crystals: ["Carnelian", "Red Jasper", "Bloodstone"],
    essence: "courage, initiation, bold action"
  },
  { 
    name: "Taurus", symbol: "♉", opposite: "Scorpio", start: [4, 20], end: [5, 20],
    ruler: "Venus ♀",
    oils: ["Rose", "Patchouli", "Ylang Ylang"],
    crystals: ["Rose Quartz", "Emerald", "Jade"],
    essence: "grounding, sensuality, stability"
  },
  { 
    name: "Gemini", symbol: "♊", opposite: "Sagittarius", start: [5, 21], end: [6, 20],
    ruler: "Mercury ☿",
    oils: ["Lemon", "Lavender", "Peppermint"],
    crystals: ["Blue Lace Agate", "Sodalite", "Clear Quartz"],
    essence: "communication, curiosity, connection"
  },
  { 
    name: "Cancer", symbol: "♋", opposite: "Capricorn", start: [6, 21], end: [7, 22],
    ruler: "Moon ☽",
    oils: ["Rose", "Sandalwood", "Chamomile"],
    crystals: ["Moonstone", "Selenite", "Pearl"],
    essence: "nurturing, emotional depth, intuition"
  },
  { 
    name: "Leo", symbol: "♌", opposite: "Aquarius", start: [7, 23], end: [8, 22],
    ruler: "Sun ☉",
    oils: ["Bergamot", "Frankincense", "Wild Orange"],
    crystals: ["Sunstone", "Citrine", "Clear Quartz"],
    essence: "creativity, confidence, radiance"
  },
  { 
    name: "Virgo", symbol: "♍", opposite: "Pisces", start: [8, 23], end: [9, 22],
    ruler: "Mercury ☿",
    oils: ["Rosemary", "Lavender", "Eucalyptus"],
    crystals: ["Clear Quartz", "Blue Lace Agate", "Amazonite"],
    essence: "discernment, purification, service"
  },
  { 
    name: "Libra", symbol: "♎", opposite: "Aries", start: [9, 23], end: [10, 22],
    ruler: "Venus ♀",
    oils: ["Geranium", "Ylang Ylang", "Rose"],
    crystals: ["Rose Quartz", "Jade", "Moonstone"],
    essence: "balance, harmony, relationship"
  },
  { 
    name: "Scorpio", symbol: "♏", opposite: "Taurus", start: [10, 23], end: [11, 21],
    ruler: "Mars ♂",
    oils: ["Patchouli", "Cedarwood", "Vetiver"],
    crystals: ["Obsidian", "Garnet", "Black Tourmaline"],
    essence: "transformation, depth, shadow work"
  },
  { 
    name: "Sagittarius", symbol: "♐", opposite: "Gemini", start: [11, 22], end: [12, 21],
    ruler: "Jupiter ♃",
    oils: ["Clove", "Frankincense", "Wild Orange"],
    crystals: ["Amethyst", "Lapis Lazuli", "Sodalite"],
    essence: "expansion, wisdom, adventure"
  },
  { 
    name: "Capricorn", symbol: "♑", opposite: "Cancer", start: [12, 22], end: [1, 19],
    ruler: "Saturn ♄",
    oils: ["Cedarwood", "Vetiver", "Cypress"],
    crystals: ["Black Tourmaline", "Onyx", "Hematite"],
    essence: "mastery, endurance, structure"
  },
  { 
    name: "Aquarius", symbol: "♒", opposite: "Leo", start: [1, 20], end: [2, 18],
    ruler: "Saturn ♄",
    oils: ["Frankincense", "Peppermint", "Eucalyptus"],
    crystals: ["Amethyst", "Labradorite", "Black Tourmaline"],
    essence: "innovation, liberation, vision"
  },
  { 
    name: "Pisces", symbol: "♓", opposite: "Virgo", start: [2, 19], end: [3, 20],
    ruler: "Jupiter ♃",
    oils: ["Jasmine", "Sandalwood", "Myrrh"],
    crystals: ["Amethyst", "Aquamarine", "Moonstone"],
    essence: "mysticism, compassion, surrender"
  }
];

// Get sign data by name
function getSignByName(name) {
  return zodiacSigns.find(s => s.name === name) || zodiacSigns[0];
}

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

// Get opposite sign with full data
function getOppositeSign(signName) {
  const sign = zodiacSigns.find(s => s.name === signName);
  if (sign) {
    return zodiacSigns.find(s => s.name === sign.opposite);
  }
  return zodiacSigns[0];
}

// Find all moon phases using astronomy-engine (precise to the minute)
function findMoonPhases(startDate, months) {
  const phases = [];
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);
  
  let searchDate = new Date(startDate);
  
  // Find all New Moons and Full Moons in the range
  while (searchDate < endDate) {
    // Search for next New Moon (phase 0°)
    const newMoonResult = astronomy.SearchMoonPhase(0, searchDate, 40);
    if (newMoonResult && newMoonResult.date < endDate) {
      phases.push({
        type: 'new',
        date: newMoonResult.date
      });
    }
    
    // Search for next Full Moon (phase 180°)
    const fullMoonResult = astronomy.SearchMoonPhase(180, searchDate, 40);
    if (fullMoonResult && fullMoonResult.date < endDate) {
      phases.push({
        type: 'full',
        date: fullMoonResult.date
      });
    }
    
    // Move forward ~25 days to find next set of phases
    searchDate = new Date(searchDate.getTime() + 25 * 24 * 60 * 60 * 1000);
  }
  
  // Remove duplicates and sort by date
  const uniquePhases = [];
  const seen = new Set();
  
  phases.forEach(phase => {
    const key = `${phase.type}-${phase.date.toISOString().slice(0, 10)}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePhases.push(phase);
    }
  });
  
  return uniquePhases.sort((a, b) => a.date - b.date);
}

function generateLunarEvents(monthsBack = 12, monthsForward = 12) {
  const events = [];
  const now = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - monthsBack);
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + monthsForward);
  
  moonPhases.forEach(phase => {
    if (phase.type === 'new') {
      const sunSign = getSunSign(phase.date);
      
      // Rich description with correspondences
      const newMoonDescription = [
        `🌑 New Moon in ${sunSign.name} ${sunSign.symbol}`,
        `Ruled by ${sunSign.ruler}`,
        ``,
        `The Void • Pure Potential`,
        `Moon conjunct Sun in ${sunSign.name}`,
        ``,
        `✦ ESSENCE: ${sunSign.essence}`,
        ``,
        `🌿 OILS: ${sunSign.oils.join(', ')}`,
        `💎 CRYSTALS: ${sunSign.crystals.join(', ')}`,
        ``,
        `✦ PRACTICE: Set intentions aligned with ${sunSign.name}'s gifts of ${sunSign.essence}. Plant seeds in the fertile darkness.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n');
      
      events.push({
        type: 'new',
        date: phase.date,
        sign: sunSign.name,
        summary: `🌑 New Moon in ${sunSign.name} ${sunSign.symbol}`,
        description: newMoonDescription
      });
    }
    
    if (phase.type === 'full') {
      const sunSign = getSunSign(phase.date);
      const moonSign = getOppositeSign(sunSign.name);
      
      // Rich description with correspondences
      const fullMoonDescription = [
        `🌕 Full Moon in ${moonSign.name} ${moonSign.symbol}`,
        `Ruled by ${moonSign.ruler}`,
        ``,
        `The Revelation • Complete Illumination`,
        `Moon opposite Sun (Sun in ${sunSign.name})`,
        ``,
        `✦ ESSENCE: ${moonSign.essence}`,
        ``,
        `🌿 OILS: ${moonSign.oils.join(', ')}`,
        `💎 CRYSTALS: ${moonSign.crystals.join(', ')}`,
        ``,
        `✦ PRACTICE: Revisit the ${moonSign.name} New Moon seeds: Celebrate the harvest, witness what has matured, release what is complete, and receive the insight now illuminated.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n');
      
      events.push({
        type: 'full',
        date: phase.date,
        sign: moonSign.name,
        summary: `🌕 Full Moon in ${moonSign.name} ${moonSign.symbol}`,
        description: fullMoonDescription
      });
    }
  });
  
  // Seasonal Gateways with rich descriptions
  const gateways = [
    { 
      month: 3, day: 20, name: "Spring Equinox", 
      sign: "Aries",
      description: [
        `🌿 SPRING EQUINOX — Gateway of Emergence`,
        ``,
        `Sun enters Aries ♈︎ • Light and Dark in Balance`,
        `Cardinal Fire ignites new beginnings`,
        ``,
        `✦ ESSENCE: Initiation, courage, pioneering spirit`,
        ``,
        `🌿 OILS: Ginger, Black Pepper, Rosemary`,
        `💎 CRYSTALS: Carnelian, Red Jasper, Bloodstone`,
        ``,
        `✦ PRACTICE: Plant seeds of intention. Embrace bold new starts. Honor the returning light.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n')
    },
    { 
      month: 6, day: 20, name: "Summer Solstice",
      sign: "Cancer", 
      description: [
        `☀️ SUMMER SOLSTICE — Gateway of Fullness`,
        ``,
        `Sun enters Cancer ♋︎ • Longest Day`,
        `Cardinal Water nurtures peak vitality`,
        ``,
        `✦ ESSENCE: Nurturing, celebration, full expression`,
        ``,
        `🌿 OILS: Rose, Sandalwood, Chamomile`,
        `💎 CRYSTALS: Moonstone, Selenite, Pearl`,
        ``,
        `✦ PRACTICE: Celebrate abundance. Honor what flourishes. Give thanks at the peak of light.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n')
    },
    { 
      month: 9, day: 22, name: "Autumn Equinox",
      sign: "Libra",
      description: [
        `🍂 AUTUMN EQUINOX — Gateway of Truth`,
        ``,
        `Sun enters Libra ♎︎ • Light and Dark in Balance`,
        `Cardinal Air weighs and discerns`,
        ``,
        `✦ ESSENCE: Balance, harvest, discernment`,
        ``,
        `🌿 OILS: Geranium, Ylang Ylang, Rose`,
        `💎 CRYSTALS: Rose Quartz, Jade, Moonstone`,
        ``,
        `✦ PRACTICE: Harvest what you've cultivated. Release what's complete. Find equilibrium.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n')
    },
    { 
      month: 12, day: 21, name: "Winter Solstice",
      sign: "Capricorn",
      description: [
        `❄️ WINTER SOLSTICE — Gateway of Initiation`,
        ``,
        `Sun enters Capricorn ♑︎ • Longest Night`,
        `Cardinal Earth builds from the foundation`,
        ``,
        `✦ ESSENCE: Initiation, structure, patient mastery`,
        ``,
        `🌿 OILS: Cedarwood, Vetiver, Cypress`,
        `💎 CRYSTALS: Black Tourmaline, Onyx, Hematite`,
        ``,
        `✦ PRACTICE: Enter the sacred darkness. Set foundations. Trust the returning light.`,
        ``,
        `→ More Lunar Wisdom: https://moon-tracker-ten.vercel.app`,
        `→ Book a Reading: https://www.moonlightsage.co/offerings`,
        `→ Home: https://www.moonlightsage.co`
      ].join('\\n')
    }
  ];
  
  for (let year = new Date().getFullYear(); year <= new Date().getFullYear() + 1; year++) {
    for (const gw of gateways) {
      const date = new Date(Date.UTC(year, gw.month - 1, gw.day, 0, 0, 0));
      if (date >= startDate && date < endDate) {
        events.push({
          type: 'gateway',
          date: date,
          summary: `✦ ${gw.name}`,
          description: gw.description,
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

module.exports = function handler(req, res) {
  try {
    const events = generateLunarEvents(12);
    const ical = generateICalContent(events);
    
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="moonlightsage.ics"');
    res.setHeader('Cache-Control', 's-maxage=3600');
    
    res.status(200).send(ical);
  } catch (error) {
    console.error('Moon calendar error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
