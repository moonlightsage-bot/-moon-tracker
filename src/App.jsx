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
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries", symbol: "♈︎", element: "Fire", modality: "Cardinal" }
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus", symbol: "♉︎", element: "Earth", modality: "Fixed" }
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini", symbol: "♊︎", element: "Air", modality: "Mutable" }
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer", symbol: "♋︎", element: "Water", modality: "Cardinal" }
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo", symbol: "♌︎", element: "Fire", modality: "Fixed" }
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo", symbol: "♍︎", element: "Earth", modality: "Mutable" }
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", symbol: "♎︎", element: "Air", modality: "Cardinal" }
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio", symbol: "♏︎", element: "Water", modality: "Fixed" }
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius", symbol: "♐︎", element: "Fire", modality: "Mutable" }
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Capricorn", symbol: "♑︎", element: "Earth", modality: "Cardinal" }
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius", symbol: "♒︎", element: "Air", modality: "Fixed" }
    return { name: "Pisces", symbol: "♓︎", element: "Water", modality: "Mutable" }
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

  const getPracticalAdvice = (phaseName) => {
    const advice = {
      "New Moon": "Perfect time to plant seeds—both literal and metaphorical. Set intentions for the coming month.",
      "Waxing Crescent": "Take your first steps. Small daily actions build momentum. Trust the process.",
      "First Quarter": "Decision time. Choose your path and commit. Push through resistance.",
      "Waxing Gibbous": "Refine and adjust. Almost there—patience in the final stretch brings perfection.",
      "Full Moon": "Harvest what's ripe. Celebrate achievements. Release what no longer serves.",
      "Waning Gibbous": "Share your wisdom. Teach what you've learned. Gratitude deepens the lessons.",
      "Last Quarter": "Let go with grace. Forgive yourself and others. Make space for what's coming.",
      "Waning Crescent": "Rest deeply. Dream and integrate. This is sacred composting time before renewal."
    }
    return advice[phaseName] || "Align with the lunar rhythm."
  }

  const getElementalAlchemy = (phaseQuality, signElement, signName, phaseName, modality) => {
    // Now we focus on Sign Element + Phase Quality (not phase "element" which doesn't exist)
    
    const alchemyBySign = {
      "Fire": {
        alchemy: "Flames meet lunar tide — passion transforms through cycles",
        qualities: {
          "Waning Crescent": "Embers cooling — fire's intensity composted into wisdom before rebirth"
        }
      },
      "Water": {
        alchemy: "Tides pulling depths — emotions flow with Luna's rhythm",
        qualities: {
          "Waning Crescent": "Deep waters settling — shadow becomes fertile soil for new beginnings"
        }
      },
      "Earth": {
        alchemy: "Ground responds to celestial cycles — matter shaped by lunar time",
        qualities: {
          "Waning Crescent": "Matter composting — the body releases what's complete to feed the next season"
        }
      },
      "Air": {
        alchemy: "Breath shifts with lunar phases — thought moves with moonlight",
        qualities: {
          "Waning Crescent": "Whispers integrating — insights settle in silence before creation's next breath"
        }
      }
    }
    
    const signAlchemy = alchemyBySign[signElement] || alchemyBySign["Water"]
    const specificAlchemy = signAlchemy.qualities[phaseName] || signAlchemy.alchemy
    
    // Meaning bullets specific to this sign + phase combo
    const getMeaning = () => {
      if (phaseName === "Waning Crescent" && signName === "Scorpio") {
        return [
          `${signName}'s deep ${signElement.toLowerCase()} insight`,
          "The Waning Crescent's dissolution and surrender",
          "Creating fertile ground for the next New Moon",
          `Shadow work (${signName}) being composted into wisdom (${phaseName})`
        ]
      }
      
      // Clear, specific structure for other combinations
      return [
        `${signName} brings ${signElement.toLowerCase()}'s energy: ${signElement === 'Fire' ? 'passion, will, transformation' : signElement === 'Water' ? 'depth, emotion, intuition' : signElement === 'Earth' ? 'grounding, manifestation, stability' : 'clarity, thought, communication'}`,
        `${phaseName}: ${phaseQuality}`,
        `${modality} ${signElement.toLowerCase()}: ${modality === 'Cardinal' ? 'initiates new cycles' : modality === 'Fixed' ? 'sustains and concentrates energy' : 'adapts and transforms'}`,
        "Sign essence meeting phase rhythm in this moment"
      ]
    }
    
    return {
      alchemy: specificAlchemy,
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

  const getMoonImagePath = (phaseName) => {
    const imageMap = {
      "New Moon": "/moon-phases-real/new-moon.jpg",
      "Waxing Crescent": "/moon-phases-real/waxing-crescent.jpg",
      "First Quarter": "/moon-phases-real/first-quarter.jpg",
      "Waxing Gibbous": "/moon-phases-real/waxing-gibbous.jpg",
      "Full Moon": "/moon-phases-real/full-moon.jpg",
      "Waning Gibbous": "/moon-phases-real/waning-gibbous.jpg",
      "Last Quarter": "/moon-phases-real/last-quarter.jpg",
      "Waning Crescent": "/moon-phases-real/waning-crescent.jpg"
    }
    return imageMap[phaseName] || "/moon-phases-real/full-moon.jpg"
  }

  if (!moonData) {
    return <div className="loading">Calculating lunar position...</div>
  }

  return (
    <div className="moon-tracker">
      <header>
        <h1 className="site-title">MOONLIGHTSAGE</h1>
        <p className="subtitle">Lunar Phase Tracker</p>
      </header>

      <main>
        <div className="moon-display">
          <img 
            src={getMoonImagePath(moonData.phaseInfo.name)}
            alt={moonData.phaseInfo.name}
            className="moon-image"
          />
          <h2>{moonData.phaseInfo.name}</h2>
          <p className="illumination">{(moonData.illumination * 100).toFixed(1)}% Illuminated</p>
          <p className="zodiac">Moon in {moonData.zodiacSign.name} {moonData.zodiacSign.symbol}</p>
          <div className="days-until">
            <span>New Moon in {moonData.daysUntil.toNewMoon} days</span>
            <span className="separator">•</span>
            <span>Full Moon in {moonData.daysUntil.toFullMoon} days</span>
          </div>
        </div>

        <div className="archetype-section">
          <h3>{moonData.phaseInfo.archetype}</h3>
          <p className="wisdom">{moonData.phaseInfo.wisdom}</p>
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
              moonData.zodiacSign.modality
            ).alchemy}
          </p>
          <div className="alchemy-meaning">
            <p className="alchemy-intro">This combination weaves:</p>
            <ul className="alchemy-bullets">
              {getElementalAlchemy(
                moonData.phaseInfo.quality,
                moonData.zodiacSign.element,
                moonData.zodiacSign.name,
                moonData.phaseInfo.name,
                moonData.zodiacSign.modality
              ).meaning.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
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
            <h4>Essential Oils</h4>
            <p>{moonData.phaseInfo.oils.join(", ")}</p>
          </div>
          
          <div className="correspondence-card">
            <h4>Crystals</h4>
            <p>{moonData.phaseInfo.crystals.join(", ")}</p>
          </div>
          
          <div className="correspondence-card">
            <h4>Gardening Wisdom</h4>
            <p>{moonData.phaseInfo.gardening}</p>
          </div>

          <div className="correspondence-card practical-advice">
            <h4>Practical Guidance</h4>
            <p>{getPracticalAdvice(moonData.phaseInfo.name)}</p>
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
