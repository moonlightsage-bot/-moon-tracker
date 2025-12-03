import { useState, useEffect } from 'react'
import SunCalc from 'suncalc'
import * as astronomy from 'astronomy-engine'
import CalendarSubscription from './CalendarSubscription'
import './App.css'

function App() {
  const [moonData, setMoonData] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const updateMoonData = () => {
      const now = new Date()
      setCurrentTime(now)
      
      // Get moon illumination data
      const illumination = SunCalc.getMoonIllumination(now)
      const moonPhase = illumination.phase
      
      // Determine phase name and description
      const phaseInfo = getMoonPhaseInfo(moonPhase)
      
      // Calculate approximate zodiac sign (simplified - Moon moves ~13°/day)
      const zodiacSign = getApproxMoonSign(now)
      
      // Calculate days until next New/Full Moon
      const daysUntil = getDaysUntilNextPhase(moonPhase)
      
      setMoonData({
        phase: moonPhase,
        illumination: illumination.fraction,
        phaseInfo: phaseInfo,
        zodiacSign: zodiacSign,
        daysUntil: daysUntil
      })
    }

    updateMoonData()
    const interval = setInterval(updateMoonData, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const getApproxMoonSign = (date) => {
    try {
      // Create an observer (we use a generic Earth observer)
      const observer = new astronomy.Observer(0, 0, 0) // lat, lon, elevation
      
      // Get moon's geocentric position
      const moonEquator = astronomy.Equator('Moon', date, observer, true, true)
      
      // Convert to ecliptic coordinates
      const ecliptic = astronomy.Ecliptic(moonEquator.vec)
      let longitude = ecliptic.elon
      
      // Normalize longitude to 0-360
      if (longitude < 0) longitude += 360
      
      console.log("Moon ecliptic longitude:", longitude) // Debug
      
      // Tropical zodiac signs
      const signs = [
        { name: "Aries", symbol: "♈︎", ruler: "Mars ♂", element: "Fire", modality: "Cardinal", start: 0 },
        { name: "Taurus", symbol: "♉︎", ruler: "Venus ♀", element: "Earth", modality: "Fixed", start: 30 },
        { name: "Gemini", symbol: "♊︎", ruler: "Mercury ☿", element: "Air", modality: "Mutable", start: 60 },
        { name: "Cancer", symbol: "♋︎", ruler: "Moon ☽", element: "Water", modality: "Cardinal", start: 90 },
        { name: "Leo", symbol: "♌︎", ruler: "Sun ☉", element: "Fire", modality: "Fixed", start: 120 },
        { name: "Virgo", symbol: "♍︎", ruler: "Mercury ☿", element: "Earth", modality: "Mutable", start: 150 },
        { name: "Libra", symbol: "♎︎", ruler: "Venus ♀", element: "Air", modality: "Cardinal", start: 180 },
        { name: "Scorpio", symbol: "♏︎", ruler: "Mars ♂", element: "Water", modality: "Fixed", start: 210 },
        { name: "Sagittarius", symbol: "♐︎", ruler: "Jupiter ♃", element: "Fire", modality: "Mutable", start: 240 },
        { name: "Capricorn", symbol: "♑︎", ruler: "Saturn ♄", element: "Earth", modality: "Cardinal", start: 270 },
        { name: "Aquarius", symbol: "♒︎", ruler: "Saturn ♄", element: "Air", modality: "Fixed", start: 300 },
        { name: "Pisces", symbol: "♓︎", ruler: "Jupiter ♃", element: "Water", modality: "Mutable", start: 330 }
      ]
      
      // Find which sign the moon is in
      for (let i = signs.length - 1; i >= 0; i--) {
        if (longitude >= signs[i].start) {
          return signs[i]
        }
      }
      
      return signs[0]
    } catch (error) {
      console.error("Error calculating moon sign:", error)
      return { name: "Sagittarius", symbol: "♐︎", ruler: "Jupiter ♃", element: "Fire", modality: "Mutable" }
    }
  }

  const getSunSign = (date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    const signs = [
      { name: "Aries", symbol: "♈︎", start: [3, 21], end: [4, 19] },
      { name: "Taurus", symbol: "♉︎", start: [4, 20], end: [5, 20] },
      { name: "Gemini", symbol: "♊︎", start: [5, 21], end: [6, 20] },
      { name: "Cancer", symbol: "♋︎", start: [6, 21], end: [7, 22] },
      { name: "Leo", symbol: "♌︎", start: [7, 23], end: [8, 22] },
      { name: "Virgo", symbol: "♍︎", start: [8, 23], end: [9, 22] },
      { name: "Libra", symbol: "♎︎", start: [9, 23], end: [10, 22] },
      { name: "Scorpio", symbol: "♏︎", start: [10, 23], end: [11, 21] },
      { name: "Sagittarius", symbol: "♐︎", start: [11, 22], end: [12, 21] },
      { name: "Capricorn", symbol: "♑︎", start: [12, 22], end: [1, 19] },
      { name: "Aquarius", symbol: "♒︎", start: [1, 20], end: [2, 18] },
      { name: "Pisces", symbol: "♓︎", start: [2, 19], end: [3, 20] }
    ]
    
    for (const sign of signs) {
      const [startMonth, startDay] = sign.start
      const [endMonth, endDay] = sign.end
      
      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) return sign
      } else if (startMonth > endMonth) {
        // Handles Capricorn (Dec-Jan)
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign
      } else {
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) return sign
      }
    }
    return signs[11] // Default to Pisces
  }

  const getDaysUntilNextPhase = (currentPhase) => {
    // Moon cycle is ~29.53 days
    const lunarCycle = 29.53
    
    // Calculate days until New Moon (phase 0 or 1)
    const daysToNewMoon = currentPhase < 0.5 
      ? (0 - currentPhase) * lunarCycle  // If waxing, go backwards to 0
      : (1 - currentPhase) * lunarCycle  // If waning, continue to 1
    
    // Calculate days until Full Moon (phase 0.5)
    const daysToFullMoon = currentPhase < 0.5
      ? (0.5 - currentPhase) * lunarCycle  // If before full
      : (1.5 - currentPhase) * lunarCycle  // If after full, next cycle
    
    return {
      toNewMoon: Math.round(daysToNewMoon),
      toFullMoon: Math.round(daysToFullMoon)
    }
  }

  const getSignCrystals = (signName) => {
    const crystals = {
      "Aries": ["Carnelian", "Red Jasper", "Bloodstone"],
      "Taurus": ["Rose Quartz", "Emerald", "Jade"],
      "Gemini": ["Blue Lace Agate", "Sodalite", "Clear Quartz"],
      "Cancer": ["Moonstone", "Selenite", "Pearl"],
      "Leo": ["Sunstone", "Citrine", "Clear Quartz"],
      "Virgo": ["Clear Quartz", "Blue Lace Agate", "Amazonite"],
      "Libra": ["Rose Quartz", "Jade", "Moonstone"],
      "Scorpio": ["Obsidian", "Garnet", "Black Tourmaline"],
      "Sagittarius": ["Amethyst", "Lapis Lazuli", "Sodalite"],
      "Capricorn": ["Black Tourmaline", "Onyx", "Hematite"],
      "Aquarius": ["Amethyst", "Black Tourmaline", "Labradorite"],
      "Pisces": ["Amethyst", "Aquamarine", "Moonstone"]
    }
    return crystals[signName] || ["Clear Quartz", "Amethyst", "Rose Quartz"]
  }

  const getSignOils = (signName) => {
    const oils = {
      "Aries": ["Ginger", "Black Pepper", "Peppermint", "Rosemary", "Bergamot"],
      "Taurus": ["Rose", "Patchouli", "Ylang Ylang", "Vanilla", "Geranium"],
      "Gemini": ["Lemon", "Lavender", "Basil", "Peppermint", "Eucalyptus"],
      "Cancer": ["Rose", "Sandalwood", "Jasmine", "Chamomile", "Ylang Ylang"],
      "Leo": ["Bergamot", "Frankincense", "Cinnamon", "Wild Orange", "Rosemary"],
      "Virgo": ["Rosemary", "Lavender", "Eucalyptus", "Peppermint", "Tea Tree"],
      "Libra": ["Geranium", "Ylang Ylang", "Jasmine", "Rose", "Palmarosa"],
      "Scorpio": ["Patchouli", "Cedarwood", "Black Pepper", "Vetiver", "Myrrh"],
      "Sagittarius": ["Clove", "Cinnamon", "Wild Orange", "Coriander", "Frankincense", "Ginger", "Melissa"],
      "Capricorn": ["Cedarwood", "Patchouli", "Vetiver", "Myrrh", "Cypress"],
      "Aquarius": ["Frankincense", "Peppermint", "Eucalyptus", "Lavender", "Tea Tree"],
      "Pisces": ["Jasmine", "Sandalwood", "Myrrh", "Ylang Ylang", "Chamomile"]
    }
    return oils[signName] || ["Lavender", "Frankincense", "Rose"]
  }

  const getBlendedGuidance = (phaseName, signName, element, modality) => {
    // Refined practice guidance for each phase
    
    const guidance = {
      "New Moon": `In this sacred dark, set intentions aligned with ${signName}'s gifts. What wants to awaken through you? Trust the creative power of the void.`,
      "Waxing Crescent": `A faint light emerges. Take small, devoted steps. Momentum grows through steady action.`,
      "First Quarter": `A crossroads. Choose your direction and commit. Move through resistance — your effort is shaping the future.`,
      "Waxing Gibbous": `Refine, adjust, attune. Tend to the details before the cycle reaches fullness.`,
      "Full Moon": `All is illuminated. Witness what has come into form. Celebrate the harvest, and release what has completed its story.`,
      "Waning Gibbous": `Share your insight. Offer what you've learned. Give thanks for the wisdom gathered along the path.`,
      "Last Quarter": `A clearing opens. Let go with intention. Release what is complete and soften into forgiveness.`,
      "Waning Crescent": `Return to the quiet dark. Rest, empty, and dream. Let the old compost so the new can take root.`
    }

    return guidance[phaseName] || `Align with the rhythm of ${signName}.`
  }

  const getElementalAlchemy = (phaseQuality, signElement, signName, phaseName, modality, ruler) => {
    // Clear descriptions based on sign + phase combination
    
    const getSignDescription = () => {
      const signDescriptions = {
        "Aries": "initiates with courage and raw creative fire",
        "Taurus": "grounds through sensual presence and steadfast devotion",
        "Gemini": "connects through curious inquiry and communication",
        "Cancer": "nurtures through emotional depth and ancestral memory",
        "Leo": "radiates through authentic self-expression and a generous heart",
        "Virgo": "purifies through discerning service, devotion, and refinement",
        "Libra": "balances through relationship and aesthetic harmony",
        "Scorpio": "transforms through alchemical depth and shadow integration",
        "Sagittarius": "expands through philosophical quest and adventurous faith",
        "Capricorn": "builds through patient mastery and earned authority",
        "Aquarius": "liberates through innovative vision and collective consciousness",
        "Pisces": "dissolves through mystical surrender and boundless compassion"
      }
      return signDescriptions[signName] || "brings unique energy"
    }
    
    const alchemyDescription = `${signName} ${getSignDescription()}, while the ${phaseName} calls for ${phaseQuality.toLowerCase()}.`
    
    // Refined element descriptions based on modality
    const getElementDescription = () => {
      if (signElement === 'Fire') {
        if (modality === 'Cardinal') return 'will, raw initiatory heat, and the spark that begins all things'
        if (modality === 'Fixed') return 'passion, sustained creative flame, and radiant self-expression'
        if (modality === 'Mutable') return 'passion, adaptable will, and the kind of heat that transforms through vision and direction'
      }
      if (signElement === 'Water') {
        if (modality === 'Cardinal') return 'emotion, nurturing depth, and the protective tide of feeling'
        if (modality === 'Fixed') return 'emotion, transformative depth, and the alchemical power of the underworld'
        if (modality === 'Mutable') return 'emotion, mystical depth, and the boundless compassion that dissolves all separation'
      }
      if (signElement === 'Earth') {
        if (modality === 'Cardinal') return 'form, practical manifestation, and the structure that endures'
        if (modality === 'Fixed') return 'form, sensual embodiment, and the stability of rooted presence'
        if (modality === 'Mutable') return 'form, purifying discernment, and the devoted refinement of matter'
      }
      if (signElement === 'Air') {
        if (modality === 'Cardinal') return 'thought, initiating connection, and the balance of relationship'
        if (modality === 'Fixed') return 'thought, visionary insight, and the liberation of collective consciousness'
        if (modality === 'Mutable') return 'thought, curious communication, and the swift bridges between minds'
      }
      return 'elemental essence'
    }
    
    // Clear meaning bullets
    const getMeaning = () => {
      return [
        `The Moon in ${signName} expresses through ${signElement.toLowerCase()}'s essence—${getElementDescription()}`,
        `${phaseName} phase energy: ${phaseQuality}`,
        `${modality} modality ${modality === 'Cardinal' ? 'initiates action and begins new cycles' : modality === 'Fixed' ? 'sustains focus and concentrates power' : 'adapts flow and enables transition'}`,
        `Planetary ruler ${ruler} governs this lunar expression`
      ]
    }
    
    return {
      alchemy: alchemyDescription,
      meaning: getMeaning()
    }
  }

  const getMoonPhaseInfo = (phase) => {
    // Phase is 0-1, where 0 and 1 are New Moon, 0.5 is Full Moon
   const phases = [
  {
    name: "New Moon",
    range: [0, 0.01],
    archetype: "The Void • Pure Potential",
    wisdom: "In darkness, all possibilities exist. This is the sacred pause before creation—the breath between worlds. Rest in the mystery.",
    quality: "Initiation, planting intentions, pure potential",
    oils: ["Jasmine", "Sandalwood", "Frankincense"],
    crystals: ["Black Moonstone", "Obsidian", "Labradorite"],
    gardening: "Plant seeds. Set intentions. The dark moon is for planting root vegetables and new beginnings."
  },
  {
    name: "Waxing Crescent",
    range: [0.01, 0.21875],  // Extended until almost First Quarter
    archetype: "The Seedling • First Light",
    wisdom: "What you planted in darkness now stirs. Tender shoots reach toward light. Nurture the new with patience.",
    quality: "First action, commitment, building momentum",
    oils: ["Bergamot", "Peppermint", "Lemon"],
    crystals: ["Moss Agate", "Green Aventurine", "Citrine"],
    gardening: "Tend young seedlings. Water intentions. Ideal for planting leafy annuals and herbs."
  },
  {
    name: "First Quarter",
    range: [0.21875, 0.28125],  // Narrow range around 0.25 (true quarter)
    archetype: "The Warrior • Decision",
    wisdom: "Half-light reveals the path forward. Choose. Act. Build momentum. This is the crisis of action—commit.",
    quality: "Challenge, decision, overcoming obstacles",
    oils: ["Rosemary", "Pine", "Black Pepper"],
    crystals: ["Carnelian", "Red Jasper", "Tiger's Eye"],
    gardening: "Prune and strengthen. Time for decisive action in the garden. Plant above-ground fruiting crops."
  },
  {
    name: "Waxing Gibbous",
    range: [0.28125, 0.495],
    archetype: "The Refiner • Almost There",
    wisdom: "Nearly full, yet still becoming. Adjust, refine, perfect. The harvest approaches—prepare with devotion.",
    quality: "Refinement, patience, final adjustments",
    oils: ["Lavender", "Geranium", "Rose"],
    crystals: ["Rose Quartz", "Amazonite", "Moonstone"],
    gardening: "Fine-tune care. Watch for pests. Last chance to adjust before the Full Moon peak."
  },
  {
    name: "Full Moon",
    range: [0.495, 0.505],
    archetype: "The Revelation • Complete Illumination",
    wisdom: "All is revealed. See clearly what was hidden. This is peak manifestation—celebrate, release, acknowledge.",
    quality: "Culmination, revelation, illumination, completion",
    oils: ["Jasmine", "Ylang Ylang", "Sandalwood"],
    crystals: ["Selenite", "Clear Quartz", "Moonstone"],
    gardening: "Harvest at peak potency. The Full Moon brings maximum vitality. Water deeply—sap rises."
  },
  {
    name: "Waning Gibbous",
    range: [0.505, 0.71875],
    archetype: "The Teacher • Sharing Wisdom",
    wisdom: "Light diminishes, but wisdom remains. Share what you've learned. Gratitude transforms experience into treasure.",
    quality: "Dissemination, sharing, gratitude, integration",
    oils: ["Frankincense", "Myrrh", "Cedarwood"],
    crystals: ["Lapis Lazuli", "Sodalite", "Blue Lace Agate"],
    gardening: "Harvest and preserve. Share the abundance. Plant perennials and bulbs."
  },
  {
    name: "Last Quarter",
    range: [0.71875, 0.78125],  // Narrow range around 0.75 (true quarter)
    archetype: "The Hermit • Release",
    wisdom: "Half-light now wanes. Let go of what no longer serves. This is the sacred pruning—cut away with love.",
    quality: "Letting go, forgiveness, closure, release",
    oils: ["Cypress", "Eucalyptus", "Sage"],
    crystals: ["Smoky Quartz", "Apache Tear", "Black Tourmaline"],
    gardening: "Weed and release. Remove what's complete. Ideal for pruning and clearing."
  },
  {
    name: "Waning Crescent",
    range: [0.78125, 0.99],
    archetype: "The Crone • Wisdom Before Silence",
    wisdom: "The final sliver holds all the mysteries. Rest, dream, integrate. The void approaches—surrender to the cycle.",
    quality: "Dissolution, surrender, composting, liminality",
    oils: ["Lavender", "Vetiver", "Chamomile"],
    crystals: ["Amethyst", "Lepidolite", "Howlite"],
    gardening: "Rest the soil. Compost and mulch. Turn under cover crops. Prepare for the next cycle."
  }
    ]

     for (let phaseData of phases) {
      // Special case for New Moon (wraps around 0/1)
      if (phaseData.name === "New Moon") {
        if (phase >= 0.99 || phase < 0.01) {
          return phaseData
        }
      } else if (phase >= phaseData.range[0] && phase < phaseData.range[1]) {
        return phaseData
      }
    }
    
    return phases[0] // Default to New Moon
  }

    const getMoonImagePath = (phase) => {
  // 27 images mapping based on PHASE position (0-1):
  // phase 0/1: New Moon → Image 1 or 27
  // phase 0.25: First Quarter (50% lit) → Image ~7-8
  // phase 0.5: Full Moon (100% lit) → Image 14
  // phase 0.75: Last Quarter (50% lit) → Image ~20-21
  
  let imageNumber
  
  // Normalize phase to 0-1 range
  let normalizedPhase = phase % 1
  if (normalizedPhase < 0) normalizedPhase += 1
  
  if (normalizedPhase < 0.015 || normalizedPhase > 0.985) {
    // New Moon (within 1.5% of 0 or 1) → Image 1 or 27
    imageNumber = normalizedPhase < 0.5 ? 1 : 27
  } else {
    // Map phase 0.015-0.985 to images 2-26 (25 images)
    imageNumber = Math.round(2 + ((normalizedPhase - 0.015) / (0.985 - 0.015)) * 24)
  }
  
  const clampedNumber = Math.max(1, Math.min(27, imageNumber))
  console.log("Phase:", (normalizedPhase * 100).toFixed(1) + "%", "→ Image:", clampedNumber)
  
  return `/moon-phases-real/${clampedNumber}.jpg`
}

  const getFullMoonHarvestNote = (signName) => {
    return `The Full Moon illuminates what was planted at the New Moon in ${signName} (6 months prior). What seeds of ${signName.toLowerCase()}'s essence are now bearing fruit?`
  }
const getPhaseOilPurpose = (phaseName) => {
  const purposes = {
    "New Moon": "For sacred beginnings, intention setting, and entering the void",
    "Waxing Crescent": "For courage, momentum, and taking first steps",
    "First Quarter": "For clarity, decision-making, and overcoming obstacles",
    "Waxing Gibbous": "For patience, refinement, and adjustments",
    "Full Moon": "For celebration, illumination, and release",
    "Waning Gibbous": "For wisdom, gratitude, and integration",
    "Last Quarter": "For letting go, forgiveness, and closure",
    "Waning Crescent": "For rest, reflection, and composting wisdom"
  }
  return purposes[phaseName] || "For lunar alignment"
}

const getSignOilPurpose = (signName) => {
  const purposes = {
    "Aries": "For courage, initiation, and bold action",
    "Taurus": "For grounding, sensuality, and stability",
    "Gemini": "For clarity, communication, and curiosity",
    "Cancer": "For emotional healing, nurturing, and intuition",
    "Leo": "For confidence, creativity, and radiant self-expression",
    "Virgo": "For purification, discernment, devotion, and service",
    "Libra": "For balance, harmony, and relationship",
    "Scorpio": "For transformation, depth, and shadow work",
    "Sagittarius": "For expansion, optimism, and adventure",
    "Capricorn": "For endurance, grounding, and mastery",
    "Aquarius": "For innovation, clarity, and liberation",
    "Pisces": "For spiritual surrender, compassion, and mysticism"
  }
  return purposes[signName] || "For zodiacal alignment"
}
  if (!moonData) {
    return <div className="loading">Calculating lunar position...</div>
  }

  const isFullMoon = moonData.phaseInfo.name === "Full Moon"

  return (
    <div className="moon-tracker">
      <header>
        <h1 className="site-title">MOONLIGHTSAGE</h1>
        <p className="subtitle">Lunar Phase Tracker</p>
      </header>

      <main>
        <div className="moon-display">
          <img 
            src={getMoonImagePath(moonData.phase)}
            alt={moonData.phaseInfo.name}
            className="moon-image"
          />
          <h2>{moonData.phaseInfo.name}</h2>
          <p className="illumination">{(moonData.illumination * 100).toFixed(1)}% Luminous</p>
          <p className="zodiac">Moon in {moonData.zodiacSign.name} {moonData.zodiacSign.symbol}</p>
          <p className="sun-sign">☉ Sun in {getSunSign(currentTime).name} {getSunSign(currentTime).symbol}</p>
          <div className="days-until">
            <span>🌑 New Moon in {moonData.daysUntil.toNewMoon} days</span>
            <span className="separator">•</span>
            <span>🌕 Full Moon in {moonData.daysUntil.toFullMoon} days</span>
          </div>
        </div>

        <div className="archetype-section">
          <h3>{moonData.phaseInfo.archetype}</h3>
          <p className="wisdom">{moonData.phaseInfo.wisdom}</p>
          {isFullMoon && (
            <p className="full-moon-harvest">{getFullMoonHarvestNote(moonData.zodiacSign.name)}</p>
          )}
          <div className="element-badges">
            <span className="element-badge phase-quality">
              Phase: {moonData.phaseInfo.quality}
            </span>
            <span className="element-badge sign-element">
              {moonData.zodiacSign.name} ({moonData.zodiacSign.element})
            </span>
            <span className="element-badge modality">
              {moonData.zodiacSign.modality} {moonData.zodiacSign.element}
            </span>
          </div>
        </div>
<div className="elemental-alchemy">
  <h4>Elemental Alchemy</h4>
  
  <p className="alchemy-description">
    {getElementalAlchemy(
      moonData.phaseInfo.quality,
      moonData.zodiacSign.element,
      moonData.zodiacSign.name,
      moonData.phaseInfo.name,
      moonData.zodiacSign.modality,
      moonData.zodiacSign.ruler
    ).alchemy}
  </p>

  <div className="alchemy-meaning">
  <ul className="alchemy-bullets">
    <li>Planetary ruler {moonData.zodiacSign.ruler} governs this lunar expression</li>
  </ul>
</div>

  <div className="alchemy-layers">
    <div className="alchemy-layer">
      <strong>Phase ({moonData.phaseInfo.name}):</strong> {moonData.phaseInfo.quality}
    </div>
    <div className="alchemy-layer">
      <strong>Sign ({moonData.zodiacSign.element}):</strong> {moonData.zodiacSign.name} brings {moonData.zodiacSign.element === 'Fire' ? 'passion, will, and transformative heat' : moonData.zodiacSign.element === 'Water' ? 'emotional depth, intuition, and feeling' : moonData.zodiacSign.element === 'Earth' ? 'grounding, stability, and manifestation' : 'mental clarity, communication, and swift movement'}
    </div>
    <div className="alchemy-layer">
      <strong>Modality ({moonData.zodiacSign.modality}):</strong> {moonData.zodiacSign.modality} energy {moonData.zodiacSign.modality === 'Cardinal' ? 'initiates new beginnings and sets things in motion' : moonData.zodiacSign.modality === 'Fixed' ? 'sustains, concentrates, and builds through persistence' : 'adapts, transitions, and transforms flexibly'}
    </div>
  </div>
</div>
        <div className="correspondences">
          <div className="correspondence-card">
            <h4>Phase Oils ({moonData.phaseInfo.name})</h4>
  <p>{moonData.phaseInfo.oils.join(", ")}</p>
  <p className="oil-purpose">{getPhaseOilPurpose(moonData.phaseInfo.name)}</p>
</div>

          <div className="correspondence-card">
  <h4>Sign Oils ({moonData.zodiacSign.name})</h4>
  <p>{getSignOils(moonData.zodiacSign.name).join(", ")}</p>
<p className="oil-purpose">{getSignOilPurpose(moonData.zodiacSign.name)}</p>
</div>
          
          <div className="correspondence-card">
            <h4>Phase Crystals</h4>
            <p>{moonData.phaseInfo.crystals.join(", ")}</p>
          </div>

          <div className="correspondence-card">
            <h4>Sign Crystals ({moonData.zodiacSign.name})</h4>
            <p>{getSignCrystals(moonData.zodiacSign.name).join(", ")}</p>
            <p className="oil-purpose">Ruled by {moonData.zodiacSign.ruler}</p>
          </div>
          
          <div className="correspondence-card">
            <h4>Gardening Wisdom</h4>
            <p>{moonData.phaseInfo.gardening}</p>
          </div>

          <div className="correspondence-card practical-advice">
            <h4>Practice</h4>
            <p>{getBlendedGuidance(
              moonData.phaseInfo.name,
              moonData.zodiacSign.name,
              moonData.zodiacSign.element,
              moonData.zodiacSign.modality
            )}</p>
            {moonData.phaseInfo.name === "New Moon" && (
              <p className="six-month-note">✦ What is set in motion now culminates at the Full Moon in {moonData.zodiacSign.name} six months hence.</p>
            )}
            {moonData.phaseInfo.name === "Full Moon" && (
              <p className="six-month-note">✦ This harvest reflects what was seeded six months ago at the {moonData.zodiacSign.name} New Moon.</p>
            )}
          </div>
        </div>

        <div className="navigation-section">
          <h4>Go Deeper</h4>
          <div className="nav-links">
           <a href="https://moonlightsage.co" className="nav-link" target="_blank" rel="noopener noreferrer">Home</a>
<a href="https://moonlightsage.co/readings" className="nav-link" target="_blank" rel="noopener noreferrer">Book a Reading</a>
<a href="https://moonlightsage.co/blog" className="nav-link" target="_blank" rel="noopener noreferrer">Zodiac Deep-Dives</a>
          </div>
        </div>

        <div className="timestamp">
          {currentTime.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </main>

<p className="calendar-promo">Receive New Moon & Full Moon, Solstice & Equinox events directly in your calendar.</p>
      <CalendarSubscription />
     
      <footer>
        <p>Phenomenological geocentric perspective • Classical tropical astrology</p>
        <p className="disclaimer">For educational and contemplative purposes</p>
      </footer>
    </div>
  )
}

export default App