import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-author">
          Tugas Akhir Praktikum Perangkat Bergerak (PPB) &middot; Progressive Web App
        </p>
        <p className="footer-sub">
          Dibuat dengan <Heart size={14} className="heart-inline" fill="#f43f5e" stroke="#f43f5e" /> oleh{' '}
          <strong>Dinda Azra Ariefiah</strong> (21120124120039)
        </p>
      </div>
    </footer>
  )
}
