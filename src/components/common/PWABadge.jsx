import { useState, useEffect } from 'react'
import { Download, WifiOff, X } from 'lucide-react'

export default function PWABadge() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [installed, setInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    const handleAppInstalled = () => {
      setInstalled(true)
      setInstallPrompt(null)
    }

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstalled(true)
    }
    setInstallPrompt(null)
  }

  if (dismissed) return null

  // Banner status offline
  if (isOffline) {
    return (
      <aside className="pwa-badge pwa-badge--offline" role="status" aria-live="polite">
        <WifiOff size={18} className="icon-pulse" />
        <div className="pwa-badge-text">
          <strong>Mode Offline Aktif</strong>
          <span>Katalog skincare &amp; makeup tersimpan tetap bisa diakses.</span>
        </div>
      </aside>
    )
  }

  // Banner instalasi PWA
  if (installPrompt && !installed) {
    return (
      <aside className="pwa-badge" role="region" aria-label="Install App">
        <div className="pwa-badge-content">
          <div className="pwa-badge-icon">
            <Download size={18} />
          </div>
          <div className="pwa-badge-text">
            <strong>Install GlowAura</strong>
            <span>Pasang aplikasi di layar utama HP kamu untuk akses mudah.</span>
          </div>
        </div>
        <div className="pwa-badge-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={handleInstallClick}
          >
            Pasang
          </button>
          <button
            type="button"
            className="icon-btn-ghost"
            onClick={() => setDismissed(true)}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>
      </aside>
    )
  }

  return null
}
