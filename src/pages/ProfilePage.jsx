import { useState } from 'react'
import {
  User,
  Heart,
  FileText,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  Copy,
  Info,
  ShieldCheck,
  Smartphone,
  Globe,
  Database,
} from 'lucide-react'
import userService from '../services/userService'
import productService from '../services/productService'
import { useFavorites } from '../hooks/useFavorites'
import ConfirmModal from '../components/modals/ConfirmModal'

const getActiveDraftCount = () => {
  try {
    let count = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('glowaura_draft_') && !key.endsWith('_ts')) {
        count++
      }
    }
    return count
  } catch {
    return 0
  }
}

export default function ProfilePage({ onReplaySplash }) {
  const [profile, setProfile] = useState(() => userService.getUserProfile())
  const [name, setName] = useState(profile.name || 'Dinda Azra Ariefiah')
  const [nim, setNim] = useState(profile.nim || '21120124120039')
  const [bio, setBio] = useState(profile.bio || '')
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)

  const { favorites } = useFavorites()
  const [draftCount] = useState(getActiveDraftCount)

  const handleCopyId = () => {
    if (profile.userId) {
      navigator.clipboard.writeText(profile.userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const updated = {
      ...profile,
      name: name.trim() || 'Dinda Azra Ariefiah',
      nim: nim.trim() || '21120124120039',
      bio: bio.trim(),
    }
    const res = userService.saveUserProfile(updated)
    if (res.success) {
      setProfile(res.data)
      setFeedback('Profil praktikan berhasil disimpan!')
      setTimeout(() => setFeedback(''), 3000)
    }
  }

  const handleResetCatalog = () => {
    productService.resetToInitial()
    setShowResetModal(false)
    setFeedback('Katalog berhasil di-reset ke data default!')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  return (
    <div className="profile-page">
      {/* Top Banner */}
      <section className="catalog-hero catalog-hero--profile">
        <div className="hero-badge">
          <User size={14} />
          <span>Profil Pengembang &amp; Tugas Akhir</span>
        </div>
        <h1 className="hero-title">Profil &amp; Informasi Aplikasi</h1>
        <p className="hero-desc">
          Dokumentasi Tugas Akhir Praktikum Pengembangan Perangkat Bergerak (PPB) &middot;
          Implementasi Progressive Web App (PWA) Berbasis React JS.
        </p>
      </section>

      {feedback && (
        <div className="toast toast--success">
          <Check size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Student Profile Card */}
      <div className="student-card">
        <div className="student-card__top">
          <div className="student-avatar-wrap">
            <div className="student-avatar-placeholder">
              <Sparkles size={36} className="text-rose" />
            </div>
          </div>
          <div className="student-info">
            <span className="student-badge">Praktikan Pengembang</span>
            <h2 className="student-name">{profile.name}</h2>
            <div className="student-meta-row">
              <span className="mono-pill">NIM: {profile.nim}</span>
              <span className="mono-pill">Platform: PWA</span>
            </div>
            <p className="student-bio">{profile.bio}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="profile-stats-grid">
          <div className="stat-card">
            <Heart size={22} className="stat-icon stat-icon--rose" />
            <div className="stat-val">{favorites.length}</div>
            <div className="stat-label">Produk Favorit</div>
          </div>
          <div className="stat-card">
            <FileText size={22} className="stat-icon stat-icon--purple" />
            <div className="stat-val">{draftCount}</div>
            <div className="stat-label">Draft Formulir</div>
          </div>
          <div className="stat-card">
            <Smartphone size={22} className="stat-icon stat-icon--blue" />
            <div className="stat-val">PWA</div>
            <div className="stat-label">Installable Web</div>
          </div>
        </div>
      </div>

      {/* TA Details Accordion / Card */}
      <div className="form-card">
        <div className="card-header-flex">
          <div>
            <h3 className="section-heading">Rincian Tugas Akhir</h3>
            <span className="card-subtext">Ketentuan &amp; Pemenuhan Modul Praktikum</span>
          </div>
          <ShieldCheck size={24} className="text-rose" />
        </div>

        <div className="ta-details-list">
          <div className="ta-detail-item">
            <div className="ta-detail-label">
              <Globe size={16} />
              <span>Judul Tugas Akhir:</span>
            </div>
            <p className="ta-detail-value">
              <strong>Aplikasi Katalog Produk Skincare dan Makeup Berbasis Web</strong>
            </p>
          </div>

          <div className="ta-detail-item">
            <div className="ta-detail-label">
              <Database size={16} />
              <span>Arsitektur &amp; Teknologi:</span>
            </div>
            <p className="ta-detail-value">
              React JS (Vite), Progressive Web App (Service Worker + Web Manifest), RESTful API,
              Axios Client, LocalStorage Persistence, and Modern Component-Driven UI.
            </p>
          </div>

          <div className="ta-detail-item">
            <div className="ta-detail-label">
              <Smartphone size={16} />
              <span>Kriteria Tugas Akhir Terpenuhi:</span>
            </div>
            <ul className="criteria-list">
              <li>✅ Menggunakan Web Service / REST API sesuai Modul 1 &amp; Modul 6</li>
              <li>✅ Memiliki <strong>Bottom Navigation Bar</strong> responsif di mobile</li>
              <li>
                ✅ Memiliki <strong>lebih dari 5 halaman</strong> lengkap:
                <br />
                <em>(1) Katalog Skincare, (2) Katalog Makeup, (3) Detail Produk, (4) Favorit/Wishlist, (5) Tambah Produk, (6) Profil/About</em>
              </li>
              <li>
                ✅ Terdapat <strong>2 halaman utama dengan list item</strong> yang dapat diklik ke halaman detail (Katalog Skincare &amp; Katalog Makeup)
              </li>
              <li>✅ Terdapat 1 halaman Profile / About aplikasi yang informatif</li>
              <li>✅ Fitur PWA (Service Worker offline caching &amp; Add to Home Screen prompt)</li>
              <li>✅ Mendukung auto-save draft formulir dan sistem ulasan bintang</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="form-card">
        <h3 className="section-heading">Ubah Data Praktikan</h3>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="user-name">
              Nama Lengkap
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="user-nim">
              Nomor Induk Mahasiswa (NIM)
            </label>
            <input
              id="user-nim"
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="user-bio">
            Biodata / Catatan Pengembang
          </label>
          <textarea
            id="user-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="form-textarea"
          />
        </div>

        <div className="form-actions-bar">
          <button type="submit" className="btn btn--primary btn--sm">
            Simpan Perubahan
          </button>
        </div>
      </form>

      {/* Danger & Utility Actions */}
      <div className="form-card danger-zone">
        <h3 className="section-heading">Utilitas &amp; Pengaturan Aplikasi</h3>
        <p className="card-subtext">
          Gunakan opsi berikut untuk menguji ulang animasi pembuka atau mengatur ulang data katalog.
        </p>

        <div className="utility-buttons-row">
          {onReplaySplash && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={onReplaySplash}
            >
              <Play size={14} /> Putar Ulang Splash Screen
            </button>
          )}

          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={handleCopyId}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin!' : 'Salin User UUID'}</span>
          </button>

          <button
            type="button"
            className="btn btn--danger-ghost btn--sm"
            onClick={() => setShowResetModal(true)}
          >
            <RotateCcw size={14} /> Reset Data Katalog
          </button>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      <ConfirmModal
        open={showResetModal}
        title="Reset Katalog Produk?"
        message="Semua produk yang baru kamu tambahkan akan dikembalikan ke data awal default. Apakah kamu yakin?"
        confirmLabel="Ya, Reset"
        cancelLabel="Batal"
        danger
        onConfirm={handleResetCatalog}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}
