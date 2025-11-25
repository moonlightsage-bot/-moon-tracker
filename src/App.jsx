import { useState, useEffect } from 'react'
import SunCalc from 'suncalc'
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
    // Simplified zodiac calculation based on Sun's position as proxy
    // Note: Actual moon sign would need ephemeris data
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries", symbol: "♈︎", ruler: "Mars ♂", element: "Fire", modality: "Cardinal" }
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus", symbol: "♉︎", ruler: "Venus ♀", element: "Earth", modality: "Fixed" }
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini", symbol: "♊︎", ruler: "Mercury ☿", element: "Air", modality: "Mutable" }
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer", symbol: "♋︎", ruler: "Moon ☽", element: "Water", modality: "Cardinal" }
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo", symbol: "♌︎", ruler: "Sun ☉", element: "Fire", modality: "Fixed" }
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo", symbol: "♍︎", ruler: "Mercury ☿", element: "Earth", modality: "Mutable" }
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", symbol: "♎︎", ruler: "Venus ♀", element: "Air", modality: "Cardinal" }
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio", symbol: "♏︎", ruler: "Mars ♂", element: "Water", modality: "Fixed" }
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius", symbol: "♐︎", ruler: "Jupiter ♃", element: "Fire", modality: "Mutable" }
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Capricorn", symbol: "♑︎", ruler: "Saturn ♄", element: "Earth", modality: "Cardinal" }
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius", symbol: "♒︎", ruler: "Saturn ♄", element: "Air", modality: "Fixed" }
    return { name: "Pisces", symbol: "♓︎", ruler: "Jupiter ♃", element: "Water", modality: "Mutable" }
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
    // Blended guidance system that combines phase archetype with sign essence
    
    const phaseActions = {
      "New Moon": "plant seeds",
      "Waxing Crescent": "take first steps",
      "First Quarter": "make decisions",
      "Waxing Gibbous": "refine",
      "Full Moon": "harvest",
      "Waning Gibbous": "share wisdom",
      "Last Quarter": "release",
      "Waning Crescent": "rest"
    }

    const signEssence = {
      "Aries": { verb: "initiate", quality: "courage", theme: "bold beginnings" },
      "Taurus": { verb: "ground", quality: "sensual presence", theme: "steadfast devotion" },
      "Gemini": { verb: "communicate", quality: "curiosity", theme: "bridges and connections" },
      "Cancer": { verb: "nurture", quality: "emotional depth", theme: "home and heart" },
      "Leo": { verb: "create", quality: "radiant confidence", theme: "authentic self-expression" },
      "Virgo": { verb: "purify", quality: "discernment", theme: "devoted refinement" },
      "Libra": { verb: "balance", quality: "harmony", theme: "relationship and beauty" },
      "Scorpio": { verb: "transform", quality: "alchemical depth", theme: "shadow integration" },
      "Sagittarius": { verb: "expand", quality: "adventurous faith", theme: "wider horizons" },
      "Capricorn": { verb: "build", quality: "patient mastery", theme: "earned authority" },
      "Aquarius": { verb: "liberate", quality: "visionary insight", theme: "collective consciousness" },
      "Pisces": { verb: "dissolve", quality: "mystical compassion", theme: "boundless unity" }
    }

    const sign = signEssence[signName] || signEssence["Aries"]
    const action = phaseActions[phaseName] || "align"

    // Generate blended guidance
    const guidance = {
      "New Moon": `In this sacred darkness, ${action} of ${sign.theme}. Set intentions that ${sign.verb} your ${sign.quality}. What calls to awaken? Trust the void's creative power.`,
      "Waxing Crescent": `Plant the first seeds of ${sign.theme}. Let small acts of ${sign.quality} build momentum. ${sign.verb.charAt(0).toUpperCase() + sign.verb.slice(1)} with tender courage—trust the emerging light.`,
      "First Quarter": `Decision time—choose the path of ${sign.theme}. This tension requires you to ${sign.verb} with ${sign.quality}. Push through resistance. Your commitment builds worlds.`,
      "Waxing Gibbous": `Refine what you're ${sign.verb}ing with ${sign.quality}. Almost there—adjust with devotion to ${sign.theme}. Trust the final stretch before fullness.`,
      "Full Moon": `All is revealed through ${sign.theme}. See clearly what ${sign.quality} has built. Celebrate your capacity to ${sign.verb}. Release what no longer serves this path.`,
      "Waning Gibbous": `Share the wisdom of ${sign.theme}. Teach others how to ${sign.verb} with ${sign.quality}. Your insight serves the whole. Give thanks for what you've learned.`,
      "Last Quarter": `Release what no longer serves your ${sign.theme}. Let go with ${sign.quality}. Forgive what wasn't meant to ${sign.verb}. Make space for the next cycle.`,
      "Waning Crescent": `Rest in the depths of ${sign.theme}. Let ${sign.quality} compost into wisdom. Surrender to the liminal—${sign.verb} through dreaming. Trust the sacred emptiness.`
    }

    return guidance[phaseName] || `Align with ${sign.theme} through ${sign.quality}.`
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
        range: [0, 0.0625],
        archetype: "The Void • Pure Potential",
        wisdom: "In darkness, all possibilities exist. This is the sacred pause before creation—the breath between worlds. Rest in the mystery.",
        quality: "Initiation, planting intentions, pure potential",
        oils: ["Jasmine", "Sandalwood", "Frankincense"],
        crystals: ["Black Moonstone", "Obsidian", "Labradorite"],
        gardening: "Plant seeds. Set intentions. The dark moon is for planting root vegetables and new beginnings."
      },
      {
        name: "Waxing Crescent",
        range: [0.0625, 0.1875],
        archetype: "The Seedling • First Light",
        wisdom: "What you planted in darkness now stirs. Tender shoots reach toward light. Nurture the new with patience.",
        quality: "First action, commitment, building momentum",
        oils: ["Bergamot", "Peppermint", "Lemon"],
        crystals: ["Moss Agate", "Green Aventurine", "Citrine"],
        gardening: "Tend young seedlings. Water intentions. Ideal for planting leafy annuals and herbs."
      },
      {
        name: "First Quarter",
        range: [0.1875, 0.3125],
        archetype: "The Warrior • Decision",
        wisdom: "Half-light reveals the path forward. Choose. Act. Build momentum. This is the crisis of action—commit.",
        quality: "Challenge, decision, overcoming obstacles",
        oils: ["Rosemary", "Pine", "Black Pepper"],
        crystals: ["Carnelian", "Red Jasper", "Tiger's Eye"],
        gardening: "Prune and strengthen. Time for decisive action in the garden. Plant above-ground fruiting crops."
      },
      {
        name: "Waxing Gibbous",
        range: [0.3125, 0.4375],
        archetype: "The Refiner • Almost There",
        wisdom: "Nearly full, yet still becoming. Adjust, refine, perfect. The harvest approaches—prepare with devotion.",
        quality: "Refinement, patience, final adjustments",
        oils: ["Lavender", "Geranium", "Rose"],
        crystals: ["Rose Quartz", "Amazonite", "Moonstone"],
        gardening: "Fine-tune care. Watch for pests. Last chance to adjust before the Full Moon peak."
      },
      {
        name: "Full Moon",
        range: [0.4375, 0.5625],
        archetype: "The Revelation • Complete Illumination",
        wisdom: "All is revealed. See clearly what was hidden. This is peak manifestation—celebrate, release, acknowledge.",
        quality: "Culmination, revelation, illumination, completion",
        oils: ["Jasmine", "Ylang Ylang", "Sandalwood"],
        crystals: ["Selenite", "Clear Quartz", "Moonstone"],
        gardening: "Harvest at peak potency. The Full Moon brings maximum vitality. Water deeply—sap rises."
      },
      {
        name: "Waning Gibbous",
        range: [0.5625, 0.6875],
        archetype: "The Teacher • Sharing Wisdom",
        wisdom: "Light diminishes, but wisdom remains. Share what you've learned. Gratitude transforms experience into treasure.",
        quality: "Dissemination, sharing, gratitude, integration",
        oils: ["Frankincense", "Myrrh", "Cedarwood"],
        crystals: ["Lapis Lazuli", "Sodalite", "Blue Lace Agate"],
        gardening: "Harvest and preserve. Share the abundance. Plant perennials and bulbs."
      },
      {
        name: "Last Quarter",
        range: [0.6875, 0.8125],
        archetype: "The Hermit • Release",
        wisdom: "Half-light now wanes. Let go of what no longer serves. This is the sacred pruning—cut away with love.",
        quality: "Letting go, forgiveness, closure, release",
        oils: ["Cypress", "Eucalyptus", "Sage"],
        crystals: ["Smoky Quartz", "Apache Tear", "Black Tourmaline"],
        gardening: "Weed and release. Remove what's complete. Ideal for pruning and clearing."
      },
      {
        name: "Waning Crescent",
        range: [0.8125, 1],
        archetype: "The Crone • Wisdom Before Silence",
        wisdom: "The final sliver holds all the mysteries. Rest, dream, integrate. The void approaches—surrender to the cycle.",
        quality: "Dissolution, surrender, composting, liminality",
        oils: ["Lavender", "Vetiver", "Chamomile"],
        crystals: ["Amethyst", "Lepidolite", "Howlite"],
        gardening: "Rest the soil. Compost and mulch. Turn under cover crops. Prepare for the next cycle."
      }
    ]

    for (let phaseData of phases) {
      if (phase >= phaseData.range[0] && phase < phaseData.range[1]) {
        return phaseData
      }
    }
    
    return phases[0] // Default to New Moon
  }

  const getMoonImagePath = (illumination) => {
    // Map illumination percentage (0-1) to 24 moon phase images
    const imageNumber = Math.ceil(illumination * 24) || 1
    const clampedNumber = Math.max(1, Math.min(24, imageNumber))
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
            src={getMoonImagePath(moonData.illumination)}
            alt={moonData.phaseInfo.name}
            className="moon-image"
          />
          <h2>{moonData.phaseInfo.name}</h2>
          <p className="illumination">{(moonData.illumination * 100).toFixed(1)}% Illuminated</p>
          <p className="zodiac">Moon in {moonData.zodiacSign.name} {moonData.zodiacSign.symbol} • Ruled by {moonData.zodiacSign.ruler}</p>
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
            <h4>Practical Guidance</h4>
            <p>{getBlendedGuidance(
              moonData.phaseInfo.name,
              moonData.zodiacSign.name,
              moonData.zodiacSign.element,
              moonData.zodiacSign.modality
            )}</p>
          </div>
        </div>

        <div className="navigation-section">
          <h4>Deepen Your Practice</h4>
          <div className="nav-links">
           <a href="https://moonlightsage.co" className="nav-link" target="_blank" rel="noopener noreferrer">Home</a>
<a href="https://moonlightsage.co/readings" className="nav-link" target="_blank" rel="noopener noreferrer">Book a Reading</a>
<a href="https://moonlightsage.co/blog" className="nav-link" target="_blank" rel="noopener noreferrer">Zodiac Deep-Dives</a>
<a href="https://www.moonlightsage.co/subscribe" className="nav-link" target="_blank" rel="noopener noreferrer">Join Lunar Circle</a>
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

      <CalendarSubscription />

      <footer>
        <p>Phenomenological geocentric perspective • Classical tropical astrology</p>
        <p className="disclaimer">For educational and contemplative purposes</p>
      </footer>
    </div>
  )
}

export default App