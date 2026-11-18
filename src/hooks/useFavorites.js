import { useState, useEffect, useCallback } from 'react'
import favoriteService from '../services/favoriteService'
import { getUserIdentifier } from '../services/userService'

export function useFavorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userIdentifier = getUserIdentifier()

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await favoriteService.getFavorites(userIdentifier)
      if (res.success) {
        setFavorites(res.data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [userIdentifier])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const toggleFavorite = async (productId) => {
    try {
      await favoriteService.toggleFavorite(productId, userIdentifier)
      await fetchFavorites()
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const isFavorited = (productId) => {
    return favorites.some((f) => String(f.id) === String(productId))
  }

  return { favorites, loading, error, toggleFavorite, isFavorited, refetch: fetchFavorites }
}
