import { Heart, ArrowRight, Loader } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'
import ProductCard from '../components/product/ProductCard'

export default function FavoritesPage({ onSelectProduct, onNavigateCatalog }) {
  const { favorites, loading, refetch } = useFavorites()

  return (
    <div className="fav-page">
      {/* Header */}
      <section className="catalog-hero catalog-hero--fav">
        <div className="hero-badge hero-badge--fav">
          <Heart size={14} fill="#f43f5e" stroke="#f43f5e" />
          <span>Wishlist Saya</span>
        </div>
        <h1 className="hero-title">Produk Favorit</h1>
        <p className="hero-desc">
          Daftar produk skincare dan makeup yang telah kamu simpan. Data tersimpan
          secara persisten di penyimpanan browser sehingga aman dibuka kapan saja.
        </p>
      </section>

      {/* Counter */}
      <div className="list-header-row">
        <h2>
          Koleksi Favorit{' '}
          <span className="count-pill count-pill--rose">{favorites.length} produk</span>
        </h2>
      </div>

      {loading && (
        <div className="state-card">
          <Loader size={32} className="spin text-rose" />
          <p>Memuat daftar favorit…</p>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="state-card">
          <div className="empty-fav-icon">
            <Heart size={44} stroke="#fda4af" />
          </div>
          <h3>Belum Ada Produk Favorit</h3>
          <p>
            Jelajahi katalog Skincare atau Makeup, lalu klik ikon hati pada produk yang
            kamu sukai untuk menyimpannya di sini.
          </p>
          {onNavigateCatalog && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => onNavigateCatalog('Skincare')}
              style={{ marginTop: '16px' }}
            >
              <span>Eksplorasi Katalog</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}

      {favorites.length > 0 && (
        <ul className="products-grid">
          {favorites.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
