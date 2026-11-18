import { Sparkles, Palette, Heart, PlusCircle, User } from 'lucide-react'

export default function BottomNav({ activeTab, onTabChange, favCount = 0 }) {
  const navItems = [
    { id: 'Skincare', label: 'Skincare', icon: Sparkles },
    { id: 'Makeup', label: 'Makeup', icon: Palette },
    { id: 'Favorites', label: 'Favorit', icon: Heart, badge: favCount },
    { id: 'Create', label: 'Tambah', icon: PlusCircle, isHighlight: true },
    { id: 'Profile', label: 'Profil', icon: User },
  ]

  return (
    <nav className="bottom-nav" aria-label="Bottom Navigation">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'bottom-nav-item--active' : ''} ${
              item.isHighlight ? 'bottom-nav-item--highlight' : ''
            }`}
            onClick={() => onTabChange(item.id)}
            aria-label={item.label}
          >
            <div className="bottom-nav-icon-wrap">
              <Icon size={item.isHighlight ? 24 : 20} />
              {item.badge > 0 && <span className="bottom-nav-badge">{item.badge}</span>}
            </div>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
