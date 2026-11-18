import { useState, useEffect, useCallback } from 'react'
import reviewService from '../services/reviewService'

export function useReviews(productId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await reviewService.getReviews(productId)
      if (res.success) {
        setReviews(res.data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const addReview = async (reviewData) => {
    try {
      const res = await reviewService.createReview(productId, reviewData)
      if (res.success) {
        await fetchReviews()
        return res.data
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return { reviews, loading, error, addReview, refetch: fetchReviews }
}
