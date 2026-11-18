import { useState, useEffect, useCallback, useRef } from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function SplashScreen({ onFinish, duration = 3200 }) {
  const [isFading, setIsFading] = useState(false)
  const dismissedRef = useRef(false)

  const handleDismiss = useCallback(() => {
    if (dismissedRef.current) return
    dismissedRef.current = true
    setIsFading(true)
    setTimeout(() => {
      if (onFinish) onFinish()
    }, 500)
  }, [onFinish])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, duration)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [duration, handleDismiss])

  return (
    <div
      className={`splash-container ${isFading ? 'splash-container--fading' : ''}`}
      onClick={handleDismiss}
      role="dialog"
      aria-modal="true"
    >
      <div className="splash-center">
        {/* Glowing Badge */}
        <div className="splash-logo-circle">
          <img src="/icon.svg" alt="GlowAura" className="splash-logo-img" />
          <div className="splash-halo" />
        </div>

        {/* Title */}
        <h1 className="splash-title">GlowAura</h1>
        <p className="splash-tagline">Katalog Skincare &amp; Makeup Berbasis Web</p>

        {/* Author Credit */}
        <div className="splash-badge-creator">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Dinda Azra Ariefiah · 21120124120039</span>
        </div>

        <button
          type="button"
          className="splash-enter-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleDismiss()
          }}
        >
          <span>Buka Aplikasi</span>
          <ArrowRight size={16} />
        </button>
      </div>
      <span className="splash-hint">Ketuk di mana saja untuk lanjut</span>
    </div>
  )
}
