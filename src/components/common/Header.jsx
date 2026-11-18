import { Sparkles, Plus, Heart, Palette, User } from 'lucide-react'

export default function Header({ activeTab, onNavigate, favCount = 0 }) {
  const desktopNavItems = [
    { id: 'Skincare', label: 'Skincare', icon: Sparkles },
    { id: 'Makeup', label: 'Makeup', icon: Palette },
    { id: 'Favorites', label: 'Favorit', icon: Heart, badge: favCount },
    { id: 'Profile', label: 'Profil & About', icon: User },
  ]

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <div
          className="header-brand"
          onClick={() => onNavigate('Skincare')}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-badge">
            <img src="/icon.svg" alt="GlowAura Logo" />
          </div>
          <div className="brand-text">
            <span className="brand-title">GlowAura</span>
            <span className="brand-sub">Beauty & Skincare PWA</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {desktopNavItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-btn ${isActive ? 'nav-btn--active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge > 0 && <span className="header-badge">{item.badge}</span>}
              </button>
            )
          })}
        </nav>

        {/* Right CTA */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onNavigate('Create')}
            title="Tambah Produk Baru"
          >
            <Plus size={16} />
            <span className="hide-on-mobile">Tambah Produk</span>
          </button>
        </div>
      </div>
    </header>
  )
}
