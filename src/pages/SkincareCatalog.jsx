import { useState, useMemo } from 'react'
import { Sparkles, Plus, Loader, RefreshCw, AlertCircle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import AdvancedFilter from '../components/common/AdvancedFilter'
import {
  matchesSearch,
  matchesCategory,
  sortItems,
  extractCategories,
} from '../utils/helpers'

export default function SkincareCatalog({ onSelectProduct, onNavigateCreate, onEditProduct, onDeleteProduct }) {
  const { products, loading, error, refetch } = useProducts({ category: 'Skincare' })

  // Hanya ambil produk Skincare
  const skincareProducts = useMemo(() => {
    return products.filter((p) => p.category === 'Skincare')
  }, [products])

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const categories = useMemo(() => extractCategories(skincareProducts), [skincareProducts])

  const filteredProducts = useMemo(() => {
    let result = skincareProducts.filter(
      (p) => matchesSearch(p, search) && matchesCategory(p, activeCategory),
    )
    return sortItems(result, sortKey, sortOrder)
  }, [skincareProducts, search, activeCategory, sortKey, sortOrder])

  return (
    <div className="catalog-page">
      {/* Hero Header */}
      <section className="catalog-hero">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Koleksi Skincare Pilihan</span>
        </div>
        <h1 className="hero-title">Katalog Produk Skincare</h1>
        <p className="hero-desc">
          Temukan rangkaian perawatan wajah lengkap mulai dari pembersih, serum pencerah,
          pelembap pelindung skin barrier, hingga tabir surya terbaik untuk kulit sehat bercahaya.
        </p>
      </section>

      {/* Filter & Search */}
      <AdvancedFilter
        search={search}
        onSearch={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSort={({ key, order }) => {
          setSortKey(key)
          setSortOrder(order)
        }}
      />

      {/* Header List */}
      <div className="list-header-row">
        <h2>
          Daftar Skincare{' '}
          <span className="count-pill">{filteredProducts.length} produk</span>
        </h2>
        {onNavigateCreate && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={onNavigateCreate}
          >
            <Plus size={16} /> Tambah Skincare
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="state-card">
          <Loader size={32} className="spin text-rose" />
          <p>Memuat katalog skincare…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="state-card state-card--error">
          <AlertCircle size={32} />
          <p>{error}</p>
          <button type="button" className="btn btn--outline btn--sm" onClick={refetch}>
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="state-card">
          <Sparkles size={36} className="text-muted" />
          <h3>Tidak Ada Produk yang Cocok</h3>
          <p>Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
        </div>
      )}

      {/* Grid List */}
      {filteredProducts.length > 0 && (
        <ul className="products-grid">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
