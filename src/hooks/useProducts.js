import { useState, useEffect, useCallback } from 'react'
import productService from '../services/productService'

export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLocal, setIsLocal] = useState(false)

  const paramKey = JSON.stringify(params)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await productService.getProducts(params)
      if (res.success) {
        setProducts(res.data || [])
        setIsLocal(Boolean(res.isLocal))
      } else {
        setError(res.message || 'Gagal memuat katalog produk.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data.')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, isLocal, refetch: fetchProducts }
}

export function useProductById(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProduct = useCallback(async () => {
    if (!id) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const res = await productService.getProductById(id)
      if (res.success) {
        setProduct(res.data)
      } else {
        setError('Produk tidak ditemukan.')
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat detail produk.')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return { product, loading, error, refetch: fetchProduct }
}
