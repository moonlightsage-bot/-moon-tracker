import { useState, useEffect } from 'react'
import SunCalc from 'suncalc'
import './App.css'

function App() {
  const [moonData, setMoonData] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const updateMoonData = () => {
      const now = new Date()
      setCurrentTime(now)
      
      // Get moon illumination and position data
      const illumination = SunCalc.getMoonIllumination(now)
      const moonPhase = illumination.phase
      const moonPosition = SunCalc.getMoonPosition(now, 0, 0) // Using equator as reference
      
      // Determine phase name and description
      const phaseInfo = getMoonPhaseInfo(moonPhase)
      
      // Calculate zodiac sign
      const zodiacSign = getZodiacSign(now)
      
      setMoonData({
        phase: moonPhase,
        illumination: illumination.fraction,
        phaseInfo: phaseInfo,
        zodiacSign: zodiacSign
      })
    }

    updateMoonData()
    const interval = setInterval(updateMoonData, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [])

  const getMoonPhaseInfo = (phase) => {
    // Phase is 0-1, where 0 and 1 are New Moon, 0.5 is Full Moon
    const phases = [
      {
        name: "New Moon",
        range: [0, 0.0625],
        archetype: "The Void • Pure Potential",
        wisdom: "In darkness, all possibilities exist. This is the sacred pause before creation—the breath between worlds. Rest in the mystery.",
        element: "Ether"
      },
      {
        name: "Waxing Crescent",
        range: [0.0625, 0.1875],
        archetype: "The Seedling • First Light",
        wisdom: "What you planted in darkness now stirs. Tender shoots reach toward light. Nurture the new with patience.",
        element: "Earth"
      },
      {
        name: "First Quarter",
        range: [0.1875, 0.3125],
        archetype: "The Warrior • Decision",
        wisdom: "Half-light reveals the path forward. Choose. Act. Build momentum. This is the crisis of action—commit.",
        element: "Fire"
      },
      {
        name: "Waxing Gibbous",
        range: [0.3125, 0.4375],
        archetype: "The Refiner • Almost There",
        wisdom: "Nearly full, yet still becoming. Adjust, refine, perfect. The harvest approaches—prepare with devotion.",
        element: "Air"
      },
      {
        name: "Full Moon",
        range: [0.4375, 0.5625],
        archetype: "The Revelation • Complete Illumination",
        wisdom: "All is revealed. See clearly what was hidden. This is peak manifestation—celebrate, release, acknowledge.",
        element: "Water"
      },
      {
        name: "Waning Gibbous",
        range: [0.5625, 0.6875],
        archetype: "The Teacher • Sharing Wisdom",
        wisdom: "Light diminishes, but wisdom remains. Share what you've learned. Gratitude transforms experience into treasure.",
        element: "Air"
      },
      {
        name: "Last Quarter",
        range: [0.6875, 0.8125],
        archetype: "The Hermit • Release",
        wisdom: "Half-light now wanes. Let go of what no longer serves. This is the sacred pruning—cut away with love.",
        element: "Fire"
      },
      {
        name: "Waning Crescent",
        range: [0.8125, 1],
        archetype: "The Crone • Wisdom Before Silence",
        wisdom: "The final sliver holds all the mysteries. Rest, dream, integrate. The void approaches—surrender to the cycle.",
        element: "Earth"
      }
    ]

    for (let phaseData of phases) {
      if (phase >= phaseData.range[0] && phase < phaseData.range[1]) {
        return phaseData
      }
    }
    
    return phases[0] // Default to New Moon
  }

  const getMoonEmoji = (phaseName) => {
    const emojiMap = {
      "New Moon": "🌑",
      "Waxing Crescent": "🌒",
      "First Quarter": "🌓",
      "Waxing Gibbous": "🌔",
      "Full Moon": "🌕",
      "Waning Gibbous": "🌖",
      "Last Quarter": "🌗",
      "Waning Crescent": "🌘"
    }
    return emojiMap[phaseName] || "🌙"
  }

  if (!moonData) {
    return <div className="loading">Calculating lunar position...</div>
  }

  return (
    <div className="moon-tracker">
      <header>
        <h1>MoonlightSage</h1>
        <p className="subtitle">Lunar Phase Tracker</p>
      </header>

      <main>
        <div className="moon-display">
          <div className="moon-icon">{getMoonEmoji(moonData.phaseInfo.name)}</div>
          <h2>{moonData.phaseInfo.name}</h2>
          <p className="illumination">{(moonData.illumination * 100).toFixed(1)}% Illuminated</p>
        </div>

        <div className="archetype-section">
          <h3>{moonData.phaseInfo.archetype}</h3>
          <p className="wisdom">{moonData.phaseInfo.wisdom}</p>
          <span className="element">Element: {moonData.phaseInfo.element}</span>
        </div>

        <div className="timestamp">
          Current: {currentTime.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </main>

      <footer>
        <p>Phenomenological geocentric perspective • Classical tropical astrology</p>
        <p className="disclaimer">For educational and contemplative purposes</p>
      </footer>
    </div>
  )
}

export default App
