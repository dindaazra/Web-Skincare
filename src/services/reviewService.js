import { apiClient, IS_SUPABASE, BASE_URL } from '../config/api'

const LOCAL_REVIEWS_KEY = 'glowaura_reviews'

const readLocalReviews = () => {
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const writeLocalReviews = (data) => {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to write local reviews:', err)
  }
}

class ReviewService {
  async getReviews(productId) {
    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.get(
            `/rest/v1/reviews?product_id=eq.${productId}&select=*&order=created_at.desc`,
          )
          if (Array.isArray(res)) return { success: true, data: res }
        } else {
          const res = await apiClient.get(`/api/products/${productId}/reviews`)
          if (res.success) return res
        }
      } catch (err) {
        console.warn('Review API fallback to local:', err.message)
      }
    }

    const all = readLocalReviews()
    const list = all[String(productId)] || [
      {
        id: 'rev-default-1',
        userName: 'Alya Putri',
        rating: 5,
        comment: 'Teksturnya sangat ringan dan cepat meresap di kulit. Sangat recommended!',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'rev-default-2',
        userName: 'Nadia S.',
        rating: 5,
        comment: 'Produk asli cocok banget di kulitku yang sensitif. Packagingnya juga gemas.',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ]
    return { success: true, data: list, isLocal: true }
  }

  async createReview(productId, reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      product_id: productId,
      userName: reviewData.userName || reviewData.user_identifier || 'Pengguna Cantik',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || '',
      created_at: new Date().toISOString(),
    }

    if (BASE_URL) {
      try {
        if (IS_SUPABASE) {
          const res = await apiClient.post('/rest/v1/reviews', newReview)
          if (res) return { success: true, data: res }
        } else {
          const res = await apiClient.post(`/api/products/${productId}/reviews`, newReview)
          if (res.success) return res
        }
      } catch (err) {
        console.warn('Server review failed, saving to local storage:', err.message)
      }
    }

    const all = readLocalReviews()
    const current = all[String(productId)] || []
    all[String(productId)] = [newReview, ...current]
    writeLocalReviews(all)
    return { success: true, data: newReview }
  }
}

export default new ReviewService()
