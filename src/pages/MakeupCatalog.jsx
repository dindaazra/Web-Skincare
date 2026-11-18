import { useState, useMemo } from 'react'
import { Palette, Plus, Loader, RefreshCw, AlertCircle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/product/ProductCard'
import AdvancedFilter from '../components/common/AdvancedFilter'
import {
  matchesSearch,
  matchesCategory,
  sortItems,
  extractCategories,
} from '../utils/helpers'

export default function MakeupCatalog({ onSelectProduct, onNavigateCreate, onEditProduct, onDeleteProduct }) {
  const { products, loading, error, refetch } = useProducts({ category: 'Makeup' })

  // Hanya ambil produk Makeup
  const makeupProducts = useMemo(() => {
    return products.filter((p) => p.category === 'Makeup')
  }, [products])

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [sortKey, setSortKey] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const categories = useMemo(() => extractCategories(makeupProducts), [makeupProducts])

  const filteredProducts = useMemo(() => {
    let result = makeupProducts.filter(
      (p) => matchesSearch(p, search) && matchesCategory(p, activeCategory),
    )
    return sortItems(result, sortKey, sortOrder)
  }, [makeupProducts, search, activeCategory, sortKey, sortOrder])

  return (
    <div className="catalog-page">
      {/* Hero Header */}
      <section className="catalog-hero catalog-hero--makeup">
        <div className="hero-badge hero-badge--makeup">
          <Palette size={14} />
          <span>Koleksi Makeup Cantik</span>
        </div>
        <h1 className="hero-title">Katalog Produk Makeup</h1>
        <p className="hero-desc">
          Eksplorasi pilihan riasan wajah terbaik mulai dari cushion coverage sempurna,
          lip tint dengan warna memikat, maskara lentik tahan lama, hingga blush on segar merona.
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
          Daftar Makeup{' '}
          <span className="count-pill count-pill--makeup">
            {filteredProducts.length} produk
          </span>
        </h2>
        {onNavigateCreate && (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={onNavigateCreate}
          >
            <Plus size={16} /> Tambah Makeup
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="state-card">
          <Loader size={32} className="spin text-rose" />
          <p>Memuat katalog makeup…</p>
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
          <Palette size={36} className="text-muted" />
          <h3>Tidak Ada Makeup yang Cocok</h3>
          <p>Coba gunakan kata kunci lain atau pilih kategori Semua.</p>
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
