import { apiClient, IS_SUPABASE, BASE_URL } from '../config/api'
import productService from './productService'

const LOCAL_FAVS_KEY = 'glowaura_favorites'

const readLocalFavs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_FAVS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const writeLocalFavs = (items) => {
  try {
    localStorage.setItem(LOCAL_FAVS_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to write local favorites:', err)
  }
}

class FavoriteService {
  async getFavorites(userIdentifier) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.get(
            `/rest/v1/favorites?user_id=eq.${userIdentifier}&select=product_id,products(*)`,
          )
          if (Array.isArray(res)) {
            const list = res.map((f) => f.products || f.product_id)
            return { success: true, data: list }
          }
        } else {
          const res = await apiClient.get('/api/favorites', {
            params: { user_identifier: userIdentifier },
          })
          if (res.success) return res
        }
      } catch (err) {
        console.warn('Favorite API fallback to local:', err.message)
      }
    }

    const localIds = readLocalFavs()
    const { data: allProds } = await productService.getProducts()
    const favItems = allProds.filter((p) => localIds.includes(String(p.id)))
    return { success: true, data: favItems, isLocal: true }
  }

  async toggleFavorite(productId, userIdentifier) {
    const stringId = String(productId)
    const current = readLocalFavs()
    const index = current.indexOf(stringId)
    let isFavorited = false

    if (index === -1) {
      current.push(stringId)
      isFavorited = true
    } else {
      current.splice(index, 1)
      isFavorited = false
    }

    writeLocalFavs(current)

    // Optional API sync
    if (BASE_URL) {
      try {
        await apiClient.post('/api/favorites/toggle', {
          product_id: productId,
          user_identifier: userIdentifier,
        })
      } catch (e) {
        /* silent catch */
      }
    }

    return { success: true, is_favorited: isFavorited }
  }

  isFavorited(productId) {
    const current = readLocalFavs()
    return current.includes(String(productId))
  }
}

export default new FavoriteService()
