// ---------------------------------------------------------------------------
// helpers.js — Fungsi utilitas umum aplikasi GlowAura Skincare & Makeup
// ---------------------------------------------------------------------------

/**
 * Format harga Rupiah, e.g. Rp 119.000
 */
export const formatRupiah = (number) => {
  const num = Number(number)
  if (Number.isNaN(num) || num === 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Pencarian teks case-insensitive pada nama, brand, dan deskripsi
 */
export const matchesSearch = (item, query) => {
  if (!query) return true
  const q = query.toLowerCase().trim()
  return (
    (item.name || '').toLowerCase().includes(q) ||
    (item.brand || '').toLowerCase().includes(q) ||
    (item.type || '').toLowerCase().includes(q) ||
    (item.description || '').toLowerCase().includes(q)
  )
}

/**
 * Filter berdasarkan sub-kategori (misal: Serum, Cleanser, Cushion, dll)
 */
export const matchesCategory = (item, category) => {
  if (!category || category === 'Semua' || category === 'All') return true
  const itemType = (item.type || item.subCategory || '').toLowerCase()
  return itemType === category.toLowerCase()
}

/**
 * Urutkan item berdasarkan kriteria: nama, harga, rating
 */
export const sortItems = (items, sortKey = 'name', sortOrder = 'asc') => {
  const sorted = [...items].sort((a, b) => {
    if (sortKey === 'price') {
      return (Number(a.price) || 0) - (Number(b.price) || 0)
    }
    if (sortKey === 'rating') {
      return (Number(a.rating) || 0) - (Number(b.rating) || 0)
    }
    return String(a.name || '').localeCompare(String(b.name || ''))
  })
  return sortOrder === 'desc' ? sorted.reverse() : sorted
}

/**
 * Potong teks panjang dengan elipsis (…)
 */
export const truncate = (str, max = 90) => {
  if (!str || str.length <= max) return str || ''
  return str.slice(0, max).trimEnd() + '…'
}

/**
 * Ambil daftar kategori unik dari list item
 */
export const extractCategories = (items) => {
  const set = new Set()
  items.forEach((i) => {
    const cat = i.type || i.subCategory
    if (cat) set.add(cat)
  })
  return ['Semua', ...Array.from(set).sort()]
}

/**
 * Hitung rata-rata rating bintang dari ulasan
 */
export const averageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}
