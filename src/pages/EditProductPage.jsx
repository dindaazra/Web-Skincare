import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import productService from '../services/productService'
import uploadService from '../services/uploadService'
import {
  saveDraft,
  loadDraft,
  deleteDraft,
  hasDraft,
  getDraftTimestamp,
  formatDraftTime,
} from '../utils/draftStorage'
import ConfirmModal from '../components/modals/ConfirmModal'

export default function EditProductPage({ product, productId, onBack, onSuccess }) {
  const targetId = productId || product?.id
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Skincare',
    type: 'Serum',
    price: 99000,
    skinType: 'Semua Jenis Kulit',
    description: '',
    is_featured: false,
  })

  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }])
  const [steps, setSteps] = useState([''])

  const [showDraftModal, setShowDraftModal] = useState(() => (targetId ? hasDraft(targetId) : false))
  const [draftTimestamp, setDraftTimestamp] = useState(() => (targetId ? getDraftTimestamp(targetId) : null))

  // Fetch initial data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError('')
        let data = product
        if (!data || !data.ingredients || !data.steps) {
          if (targetId) {
            const res = await productService.getProductById(targetId)
            if (res.success && res.data) {
              data = res.data
            }
          }
        }

        if (data) {
          setFormData({
            name: data.name || '',
            brand: data.brand || '',
            category: data.category || 'Skincare',
            type: data.type || 'Serum',
            price: data.price || 50000,
            skinType: data.skinType || 'Semua Jenis Kulit',
            description: data.description || '',
            is_featured: Boolean(data.is_featured),
          })
          setCurrentImageUrl(data.image_url || data.image || '/skincare/serum.svg')

          if (data.ingredients && data.ingredients.length > 0) {
            setIngredients(
              data.ingredients.map((ing) => ({
                name: ing.name || '',
                quantity: ing.quantity || '',
              })),
            )
          }

          if (data.steps && data.steps.length > 0) {
            setSteps(data.steps.map((st) => (typeof st === 'string' ? st : st.instruction || '')))
          }
        }
      } catch (err) {
        setError('Gagal memuat rincian produk.')
      } finally {
        setLoading(false)
      }
    }

    if (targetId) {
      fetchItem()
    }
  }, [targetId, product])

  // Draft operations
  const handleLoadDraft = () => {
    const draft = loadDraft(targetId)
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.ingredients) setIngredients(draft.ingredients)
      if (draft.steps) setSteps(draft.steps)
      if (draft.imagePreview) setImagePreview(draft.imagePreview)
      setShowDraftModal(false)
      setSuccessMsg('Draft perubahan berhasil dipulihkan.')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft(targetId)
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  const handleManualSaveDraft = () => {
    const draftData = {
      formData,
      ingredients,
      steps,
      imagePreview: imagePreview || currentImageUrl,
    }
    const saved = saveDraft(draftData, targetId)
    if (saved) {
      const ts = getDraftTimestamp(targetId)
      setDraftTimestamp(ts)
      setSuccessMsg(`Draft disimpan (${formatDraftTime(ts)})`)
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  // Handle new file
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  const handleUploadNewImage = async () => {
    if (!imageFile) return
    try {
      setUploading(true)
      const res = await uploadService.uploadImage(imageFile)
      if (res.success && res.data?.url) {
        setCurrentImageUrl(res.data.url)
        setImageFile(null)
        setImagePreview(null)
        setSuccessMsg('Foto baru berhasil diunggah.')
        setTimeout(() => setSuccessMsg(''), 3000)
      }
    } catch (err) {
      console.warn('Image upload fallback to blob:', err)
      setCurrentImageUrl(imagePreview)
      setImageFile(null)
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  // Ingredients handlers
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addIngredient = () => setIngredients((p) => [...p, { name: '', quantity: '' }])
  const removeIngredient = (idx) => {
    if (ingredients.length <= 1) return
    setIngredients((p) => p.filter((_, i) => i !== idx))
  }

  // Steps handlers
  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const addStep = () => setSteps((p) => [...p, ''])
  const removeStep = (idx) => {
    if (steps.length <= 1) return
    setSteps((p) => p.filter((_, i) => i !== idx))
  }

  // Submit Update
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setError('Nama produk minimal 3 karakter.')
      return
    }

    const cleanIngredients = ingredients
      .filter((ing) => ing.name.trim())
      .map((ing) => ({
        name: ing.name.trim(),
        quantity: ing.quantity.trim() || 'Kandungan Aktif',
      }))

    const cleanSteps = steps.filter((s) => s.trim()).map((s) => s.trim())

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim() || 'Beauty Brand',
      category: formData.category,
      type: formData.type,
      subCategory: formData.type,
      price: Number(formData.price) || 50000,
      skinType: formData.skinType.trim() || 'Semua Jenis Kulit',
      description: formData.description.trim(),
      image_url: imagePreview || currentImageUrl,
      image: imagePreview || currentImageUrl,
      ingredients: cleanIngredients,
      steps: cleanSteps.length > 0 ? cleanSteps : ['Gunakan pada wajah yang bersih.'],
      is_featured: Boolean(formData.is_featured),
    }

    try {
      setUpdating(true)
      const res = await productService.updateProduct(targetId, payload)
      if (res.success) {
        deleteDraft(targetId)
        if (onSuccess) onSuccess(res.data)
        else if (onBack) onBack()
      } else {
        throw new Error(res.message || 'Gagal memperbarui data.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate produk.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="state-card">
        <Loader size={32} className="spin text-rose" />
        <p>Memuat data produk…</p>
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="form-head">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>
        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={handleManualSaveDraft}
          title="Simpan draft edit"
        >
          <Save size={14} />
          <span>Simpan Draft</span>
        </button>
      </div>

      <div className="form-title-group">
        <h1 className="hero-title">Edit Produk Katalog</h1>
        <p className="hero-desc">Perbarui informasi, harga, formula, atau gambar produk.</p>
      </div>

      {error && (
        <div className="toast toast--error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="toast toast--success">
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="entry-form">
        {/* Gambar Produk */}
        <div className="form-card">
          <h3 className="section-heading">Foto Produk</h3>
          <div className="edit-img-wrap">
            <img
              src={imagePreview || currentImageUrl}
              alt="Foto Produk"
              className="edit-current-img"
            />
            <div className="edit-img-controls">
              <input
                id="edit-beauty-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden-file-input"
              />
              <label htmlFor="edit-beauty-image" className="btn btn--outline btn--sm">
                <Upload size={14} /> Pilih File Gambar Baru
              </label>
              {imageFile && (
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handleUploadNewImage}
                  disabled={uploading}
                >
                  {uploading ? 'Memproses…' : 'Gunakan Gambar Baru'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Utama */}
        <div className="form-card">
          <h3 className="section-heading">Informasi Utama</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-name">
                Nama Produk <span className="req">*</span>
              </label>
              <input
                id="edit-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-brand">
                Brand / Merek <span className="req">*</span>
              </label>
              <input
                id="edit-brand"
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-grid form-grid--3">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">
                Kategori <span className="req">*</span>
              </label>
              <select
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="form-select"
              >
                <option value="Skincare">Skincare</option>
                <option value="Makeup">Makeup</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-type">
                Jenis Produk <span className="req">*</span>
              </label>
              <input
                id="edit-type"
                type="text"
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-price">
                Harga (Rupiah) <span className="req">*</span>
              </label>
              <input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                className="form-input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-skintype">
              Tipe Kulit / Shade Warna
            </label>
            <input
              id="edit-skintype"
              type="text"
              value={formData.skinType}
              onChange={(e) => setFormData((p) => ({ ...p, skinType: e.target.value }))}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">
              Deskripsi Produk
            </label>
            <textarea
              id="edit-desc"
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="form-textarea"
            />
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div className="form-card">
          <div className="card-header-flex">
            <h3 className="section-heading">Kandungan Utama (Ingredients)</h3>
            <button type="button" className="btn btn--outline btn--sm" onClick={addIngredient}>
              <Plus size={14} /> Tambah Kandungan
            </button>
          </div>
          <div className="multi-rows">
            {ingredients.map((ing, i) => (
              <div key={i} className="multi-row">
                <input
                  type="text"
                  placeholder="Nama Bahan"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(i, 'name', e.target.value)}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Konsentrasi / Khasiat"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(i, 'quantity', e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn-remove-row"
                  onClick={() => removeIngredient(i)}
                  disabled={ingredients.length <= 1}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="form-card">
          <div className="card-header-flex">
            <h3 className="section-heading">Langkah &amp; Cara Penggunaan</h3>
            <button type="button" className="btn btn--outline btn--sm" onClick={addStep}>
              <Plus size={14} /> Tambah Langkah
            </button>
          </div>
          <div className="multi-rows">
            {steps.map((st, i) => (
              <div key={i} className="step-row">
                <span className="step-number">{i + 1}</span>
                <input
                  type="text"
                  value={st}
                  onChange={(e) => handleStepChange(i, e.target.value)}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn-remove-row"
                  onClick={() => removeStep(i)}
                  disabled={steps.length <= 1}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="form-actions-bar">
          <button type="button" className="btn btn--outline" onClick={onBack} disabled={updating}>
            Batal
          </button>
          <button type="submit" className="btn btn--primary" disabled={updating}>
            {updating ? (
              <>
                <Loader size={18} className="spin" /> Menyimpan Perubahan…
              </>
            ) : (
              'Perbarui Produk'
            )}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showDraftModal}
        title="Lanjutkan Perubahan Sebelumnya?"
        message={`Ditemukan draf perubahan tersimpan dari ${
          draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'
        }. Ingin dipulihkan?`}
        confirmLabel="Pulihkan Draft"
        cancelLabel="Hapus Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
