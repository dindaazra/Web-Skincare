import { apiClient, IS_SUPABASE, BASE_URL } from '../config/api'
import INITIAL_PRODUCTS from '../data/skincareData'

const LOCAL_PRODUCTS_KEY = 'glowaura_products_catalog'

// Helper baca data lokal
const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error reading local catalog:', e)
  }
  // Simpan default pertama kali
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS))
  return INITIAL_PRODUCTS
}

// Helper simpan data lokal
const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products))
  } catch (e) {
    console.error('Error saving local catalog:', e)
  }
}

// Normalizer produk
export const normalizeProduct = (item) => {
  if (!item) return null
  return {
    ...item,
    id: item.id || `prod-${Date.now()}`,
    name: item.name || 'Produk Kecantikan',
    brand: item.brand || 'Brand',
    category: item.category || 'Skincare',
    type: item.type || item.subCategory || 'Serum',
    subCategory: item.subCategory || item.type || 'Serum',
    price: Number(item.price || item.cook_time || 0),
    rating: Number(item.rating || 4.8),
    reviewCount: Number(item.reviewCount || 0),
    skinType: item.skinType || item.caliber || 'Semua Jenis Kulit',
    description: item.description || '',
    image: item.image || item.image_url || '/skincare/serum.svg',
    image_url: item.image_url || item.image || '/skincare/serum.svg',
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
    steps: Array.isArray(item.steps) ? item.steps : ['Gunakan pada wajah yang bersih.'],
    is_featured: Boolean(item.is_featured),
  }
}

class ProductService {
  /**
   * Mengambil daftar produk dengan filter opsional (category, search, sort)
   */
  async getProducts(params = {}) {
    // 1. Coba request ke backend jika BASE_URL terpasang
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          let query = `/rest/v1/products?select=*`
          if (params.category && params.category !== 'Semua') {
            query += `&category=eq.${encodeURIComponent(params.category)}`
          }
          const res = await apiClient.get(query)
          if (Array.isArray(res) && res.length > 0) {
            return { success: true, data: res.map(normalizeProduct) }
          }
        } else {
          const res = await apiClient.get('/api/products', { params })
          if (res.success && Array.isArray(res.data)) {
            return { success: true, data: res.data.map(normalizeProduct) }
          }
        }
      } catch (err) {
        console.warn('API request failed, fallback to local storage:', err.message)
      }
    }

    // 2. Fallback otomatis ke localStorage
    const local = getStoredProducts()
    let filtered = local.map(normalizeProduct)

    if (params.category && params.category !== 'Semua') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === params.category.toLowerCase(),
      )
    }

    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q),
      )
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
      isLocal: true,
    }
  }

  /**
   * Mengambil 1 produk berdasarkan ID
   */
  async getProductById(id) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.get(`/rest/v1/products?id=eq.${id}&select=*`)
          if (Array.isArray(res) && res.length > 0) {
            return { success: true, data: normalizeProduct(res[0]) }
          }
        } else {
          const res = await apiClient.get(`/api/products/${id}`)
          if (res.success && res.data) {
            return { success: true, data: normalizeProduct(res.data) }
          }
        }
      } catch (err) {
        console.warn('Get product by ID failed, falling back to local:', err.message)
      }
    }

    const local = getStoredProducts()
    const found = local.find((p) => String(p.id) === String(id))
    if (found) {
      return { success: true, data: normalizeProduct(found) }
    }
    throw new Error('Produk tidak ditemukan.')
  }

  /**
   * Tambah produk baru (CREATE)
   */
  async createProduct(data) {
    const newId = `prod-${Date.now()}`
    const normalized = normalizeProduct({ ...data, id: newId })

    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.post('/rest/v1/products', normalized, {
            headers: { Prefer: 'return=representation' },
          })
          const created = Array.isArray(res) ? res[0] : res
          if (created) return { success: true, data: normalizeProduct(created) }
        } else {
          const res = await apiClient.post('/api/products', normalized)
          if (res.success && res.data) return res
        }
      } catch (err) {
        console.warn('Server create failed, saving to local catalog:', err.message)
      }
    }

    // Simpan ke local storage
    const local = getStoredProducts()
    const updated = [normalized, ...local]
    saveStoredProducts(updated)
    return { success: true, data: normalized }
  }

  /**
   * Update produk (UPDATE)
   */
  async updateProduct(id, data) {
    const normalized = normalizeProduct({ ...data, id })

    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.patch(`/rest/v1/products?id=eq.${id}`, normalized, {
            headers: { Prefer: 'return=representation' },
          })
          const updated = Array.isArray(res) ? res[0] : res
          if (updated) return { success: true, data: normalizeProduct(updated) }
        } else {
          const res = await apiClient.put(`/api/products/${id}`, normalized)
          if (res.success && res.data) return res
        }
      } catch (err) {
        console.warn('Server update failed, modifying local catalog:', err.message)
      }
    }

    const local = getStoredProducts()
    const index = local.findIndex((p) => String(p.id) === String(id))
    if (index !== -1) {
      local[index] = { ...local[index], ...normalized }
      saveStoredProducts(local)
      return { success: true, data: local[index] }
    }
    throw new Error('Produk tidak ditemukan untuk diperbarui.')
  }

  /**
   * Hapus produk (DELETE)
   */
  async deleteProduct(id) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          await apiClient.delete(`/rest/v1/products?id=eq.${id}`)
        } else {
          await apiClient.delete(`/api/products/${id}`)
        }
      } catch (err) {
        console.warn('Server delete failed, deleting from local catalog:', err.message)
      }
    }

    const local = getStoredProducts()
    const updated = local.filter((p) => String(p.id) !== String(id))
    saveStoredProducts(updated)
    return { success: true, message: 'Produk berhasil dihapus.' }
  }

  /**
   * Reset data katalog ke data awal
   */
  resetToInitial() {
    saveStoredProducts(INITIAL_PRODUCTS)
    return INITIAL_PRODUCTS
  }
}

export default new ProductService()
