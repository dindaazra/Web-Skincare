import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// In-memory data store with default skincare & makeup
let products = [
  {
    id: 'skincare-1',
    name: '5% Niacinamide + Sabi Beet Brightening Serum',
    brand: 'Somethinc',
    category: 'Skincare',
    type: 'Serum',
    price: 119000,
    rating: 4.9,
    skinType: 'Semua Jenis Kulit / Kusam & Noda Hitam',
    description: 'Serum pencerah dengan formula 5% Niacinamide dan ekstrak Sabiwhite.',
    image_url: '/skincare/serum.svg',
    ingredients: [
      { name: 'Niacinamide', quantity: '5%' },
      { name: 'Sabiwhite', quantity: 'Ekstrak Mencerahkan' },
    ],
    steps: ['Teteskan 3-4 tetes serum ke wajah.', 'Tepuk lembut hingga meresap.'],
  },
  {
    id: 'makeup-1',
    name: 'Cover All Perfect Cushion SPF 35 PA++++',
    brand: 'Skintific',
    category: 'Makeup',
    type: 'Cushion',
    price: 175000,
    rating: 4.9,
    skinType: 'Semua Tipe Kulit (Medium to High Coverage)',
    description: 'Cushion foundation dengan teknologi Raincoat Protective Film.',
    image_url: '/makeup/cushion.svg',
    ingredients: [{ name: '5X Ceramide', quantity: 'Menjaga barrier kulit' }],
    steps: ['Tekan puff ke bantalan.', 'Tepuk ringan mulai dari tengah wajah.'],
  },
]

// GET /api/products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query
  let result = [...products]

  if (category && category !== 'Semua') {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q),
    )
  }

  res.json({ success: true, data: result, total: result.length })
})

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const found = products.find((p) => String(p.id) === String(req.params.id))
  if (found) {
    return res.json({ success: true, data: found })
  }
  res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' })
})

// POST /api/products (CREATE)
app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    created_at: new Date().toISOString(),
  }
  products.unshift(newProduct)
  res.status(201).json({ success: true, data: newProduct })
})

// PUT /api/products/:id (UPDATE)
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex((p) => String(p.id) === String(req.params.id))
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body }
    return res.json({ success: true, data: products[index] })
  }
  res.status(404).json({ success: false, message: 'Produk tidak ditemukan.' })
})

// DELETE /api/products/:id (DELETE)
app.delete('/api/products/:id', (req, res) => {
  products = products.filter((p) => String(p.id) !== String(req.params.id))
  res.json({ success: true, message: 'Produk berhasil dihapus.' })
})

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'cat-1', name: 'Skincare' },
      { id: 'cat-2', name: 'Makeup' },
    ],
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`GlowAura Backend API running on port ${PORT}`)
})
