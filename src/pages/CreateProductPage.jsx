import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Loader,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
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

const PRESET_IMAGES = [
  { label: 'Serum', url: '/skincare/serum.svg', category: 'Skincare', type: 'Serum' },
  { label: 'Cleanser', url: '/skincare/cleanser.svg', category: 'Skincare', type: 'Cleanser' },
  { label: 'Sunscreen', url: '/skincare/sunscreen.svg', category: 'Skincare', type: 'Sunscreen' },
  { label: 'Moisturizer', url: '/skincare/moisturizer.svg', category: 'Skincare', type: 'Moisturizer' },
  { label: 'Cushion', url: '/makeup/cushion.svg', category: 'Makeup', type: 'Cushion' },
  { label: 'Lip Tint', url: '/makeup/liptint.svg', category: 'Makeup', type: 'Lip Tint' },
  { label: 'Mascara', url: '/makeup/mascara.svg', category: 'Makeup', type: 'Mascara' },
  { label: 'Blush On', url: '/makeup/blush.svg', category: 'Makeup', type: 'Blush On' },
]

export default function CreateProductPage({ onBack, onSuccess }) {
  const [currentStep, setCurrentStep] = useState('upload') // 'upload' | 'form'
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

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

  // Kandungan Aktif (Ingredients)
  const [ingredients, setIngredients] = useState([
    { name: 'Niacinamide', quantity: 'Mencerahkan & kontrol minyak' },
    { name: 'Hyaluronic Acid', quantity: 'Menjaga hidrasi kulit' },
  ])

  // Langkah Pemakaian (Steps)
  const [steps, setSteps] = useState([
    'Bersihkan wajah terlebih dahulu sebelum penggunaan.',
    'Aplikasikan produk secukupnya secara merata ke seluruh wajah.',
  ])

  const [uploading, setUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Draft Management
  const [showDraftModal, setShowDraftModal] = useState(() => hasDraft('create'))
  const [draftTimestamp, setDraftTimestamp] = useState(() => getDraftTimestamp('create'))

  const handleSaveDraft = useCallback(
    (notify = true) => {
      const draftData = {
        formData,
        ingredients,
        steps,
        uploadedImageUrl,
      }
      const saved = saveDraft(draftData, 'create')
      if (saved) {
        const ts = getDraftTimestamp('create')
        setDraftTimestamp(ts)
        if (notify) {
          setSuccessMsg(`Draft berhasil disimpan (${formatDraftTime(ts)})`)
          setTimeout(() => setSuccessMsg(''), 3000)
        }
      }
    },
    [formData, ingredients, steps, uploadedImageUrl],
  )

  // Auto-save draft tiap 30 detik
  useEffect(() => {
    if (currentStep !== 'form') return
    const interval = setInterval(() => {
      handleSaveDraft(false)
    }, 30000)
    return () => clearInterval(interval)
  }, [handleSaveDraft, currentStep])

  const handleLoadDraft = () => {
    const draft = loadDraft('create')
    if (draft) {
      if (draft.formData) setFormData(draft.formData)
      if (draft.ingredients) setIngredients(draft.ingredients)
      if (draft.steps) setSteps(draft.steps)
      if (draft.uploadedImageUrl) {
        setUploadedImageUrl(draft.uploadedImageUrl)
        setImagePreview(draft.uploadedImageUrl)
        setCurrentStep('form')
      }
      setShowDraftModal(false)
      setSuccessMsg('Draft sebelumnya berhasil dimuat kembali!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  }

  const handleDiscardDraft = () => {
    deleteDraft('create')
    setShowDraftModal(false)
    setDraftTimestamp(null)
  }

  // Pilih file gambar
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

  const handleSelectPreset = (preset) => {
    setImageFile(null)
    setImagePreview(preset.url)
    setUploadedImageUrl(preset.url)
    setFormData((prev) => ({
      ...prev,
      category: preset.category,
      type: preset.type,
    }))
    setCurrentStep('form')
    setError('')
  }

  const handleConfirmImage = async () => {
    if (!imageFile) {
      if (uploadedImageUrl || imagePreview) {
        setCurrentStep('form')
        return
      }
      setError('Pilih file gambar atau salah satu preset terlebih dahulu.')
      return
    }

    try {
      setUploading(true)
      setError('')
      const res = await uploadService.uploadImage(imageFile)
      if (res.success && res.data?.url) {
        setUploadedImageUrl(res.data.url)
        setCurrentStep('form')
      }
    } catch (err) {
      console.warn('Upload error, fallback to preview:', err)
      setUploadedImageUrl(imagePreview || '/skincare/serum.svg')
      setCurrentStep('form')
    } finally {
      setUploading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Ingredients handlers
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: '', quantity: '' }])
  }

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  // Steps handlers
  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev]
      copy[index] = value
      return copy
    })
  }

  const addStep = () => {
    setSteps((prev) => [...prev, ''])
  }

  const removeStep = (index) => {
    if (steps.length <= 1) return
    setSteps((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit Create Product
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
      description:
        formData.description.trim() ||
        `${formData.brand} ${formData.name} untuk perawatan harian.`,
      image_url: uploadedImageUrl || imagePreview || '/skincare/serum.svg',
      image: uploadedImageUrl || imagePreview || '/skincare/serum.svg',
      ingredients: cleanIngredients,
      steps: cleanSteps.length > 0 ? cleanSteps : ['Gunakan pada wajah yang bersih.'],
      is_featured: Boolean(formData.is_featured),
    }

    try {
      setCreating(true)
      const res = await productService.createProduct(payload)
      if (res.success) {
        deleteDraft('create')
        if (onSuccess) onSuccess(res.data)
        else if (onBack) onBack()
      } else {
        throw new Error(res.message || 'Gagal menyimpan produk.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menambahkan produk.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="form-page">
      {/* Top Header */}
      <div className="form-head">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </button>
        {currentStep === 'form' && (
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => handleSaveDraft(true)}
            title="Simpan draft"
          >
            <Save size={14} />
            <span>Simpan Draft</span>
          </button>
        )}
      </div>

      <div className="form-title-group">
        <h1 className="hero-title">Tambah Produk Baru</h1>
        <p className="hero-desc">
          Daftarkan produk skincare atau makeup ke dalam katalog GlowAura.
        </p>
      </div>

      {/* Notifications */}
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

      {/* Step Indicators */}
      <div className="form-steps-nav">
        <div
          className={`step-badge ${
            currentStep === 'upload' ? 'step-badge--active' : 'step-badge--done'
          }`}
        >
          1. Gambar Produk
        </div>
        <div className="step-badge-connector" />
        <div
          className={`step-badge ${
            currentStep === 'form' ? 'step-badge--active' : ''
          }`}
        >
          2. Informasi &amp; Formula
        </div>
      </div>

      {/* STEP 1: Upload / Choose Preset */}
      {currentStep === 'upload' && (
        <div className="detail-card">
          <h2 className="section-heading">Pilih atau Upload Gambar Produk</h2>
          <p className="card-subtext">
            Unggah foto produk kamu (maksimal 5MB) atau pilih salah satu ilustrasi preset cantik di bawah.
          </p>

          {!imagePreview ? (
            <div className="upload-dropzone">
              <input
                id="beauty-image-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden-file-input"
              />
              <label htmlFor="beauty-image-input" className="upload-label">
                <Upload size={38} className="upload-icon" />
                <span className="upload-main-text">Klik untuk memilih file foto</span>
                <span className="upload-sub-text">Format JPG, PNG, atau WebP (maks 5MB)</span>
              </label>

              <div className="presets-block">
                <span className="presets-title">Atau gunakan ilustrasi produk siap pakai:</span>
                <div className="presets-grid">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="preset-btn"
                      onClick={() => handleSelectPreset(preset)}
                    >
                      <img src={preset.url} alt={preset.label} className="preset-thumb" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="preview-container">
              <div className="preview-wrap">
                <img src={imagePreview} alt="Preview produk" className="preview-image" />
                <button
                  type="button"
                  className="preview-remove"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                    setUploadedImageUrl('')
                  }}
                  title="Ganti gambar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="preview-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleConfirmImage}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader size={18} className="spin" /> Memproses Foto…
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Konfirmasi Gambar &amp; Lanjut
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => {
                    setUploadedImageUrl(imagePreview)
                    setCurrentStep('form')
                  }}
                >
                  Gunakan Langsung
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Product Form */}
      {currentStep === 'form' && (
        <form onSubmit={handleSubmit} className="entry-form">
          {/* Active Image Indicator */}
          <div className="selected-thumb-bar">
            <img
              src={uploadedImageUrl || imagePreview}
              alt="Gambar Terpilih"
              className="thumb-small"
            />
            <div className="thumb-info">
              <span className="thumb-title">Gambar Produk Telah Dipilih</span>
              <span className="thumb-sub">Siap didaftarkan ke katalog</span>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => setCurrentStep('upload')}
            >
              Ganti Gambar
            </button>
          </div>

          {/* Form Grid */}
          <div className="form-card">
            <h3 className="section-heading">Informasi Utama</h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">
                  Nama Produk <span className="req">*</span>
                </label>
                <input
                  id="prod-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Contoh: 5% Niacinamide Serum, Cushion Cover All..."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-brand">
                  Brand / Merek <span className="req">*</span>
                </label>
                <input
                  id="prod-brand"
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="Contoh: Somethinc, Skintific, Wardah..."
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-grid form-grid--3">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">
                  Kategori <span className="req">*</span>
                </label>
                <select
                  id="prod-category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value
                    setFormData((p) => ({
                      ...p,
                      category: cat,
                      type: cat === 'Skincare' ? 'Serum' : 'Cushion',
                    }))
                  }}
                  className="form-select"
                >
                  <option value="Skincare">Skincare</option>
                  <option value="Makeup">Makeup</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-type">
                  Jenis Produk <span className="req">*</span>
                </label>
                <input
                  id="prod-type"
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleFormChange}
                  placeholder={
                    formData.category === 'Skincare'
                      ? 'Serum, Toner, Sunscreen...'
                      : 'Cushion, Lip Tint, Mascara...'
                  }
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prod-price">
                  Harga (Rupiah) <span className="req">*</span>
                </label>
                <input
                  id="prod-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="99000"
                  min="0"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-skintype">
                Tipe Kulit / Shade Warna
              </label>
              <input
                id="prod-skintype"
                type="text"
                name="skinType"
                value={formData.skinType}
                onChange={handleFormChange}
                placeholder="Contoh: Kulit Berminyak / Shade 02 Natural Beige"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prod-desc">
                Deskripsi Produk &amp; Manfaat
              </label>
              <textarea
                id="prod-desc"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Jelaskan klaim, keunggulan formula, tekstur, dan manfaat utama..."
                rows={3}
                className="form-textarea"
              />
            </div>
          </div>

          {/* Dynamic Ingredients */}
          <div className="form-card">
            <div className="card-header-flex">
              <div>
                <h3 className="section-heading">Kandungan Utama (Ingredients)</h3>
                <span className="card-subtext">
                  Daftar bahan aktif dan fungsi utamanya bagi kulit
                </span>
              </div>
              <button
                type="button"
                className="btn btn--outline btn--sm"
                onClick={addIngredient}
              >
                <Plus size={14} /> Tambah Kandungan
              </button>
            </div>

            <div className="multi-rows">
              {ingredients.map((ing, i) => (
                <div key={i} className="multi-row">
                  <input
                    type="text"
                    placeholder="Nama Bahan (contoh: Niacinamide)"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(i, 'name', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    placeholder="Fungsi / Konsentrasi (contoh: 5% Mencerahkan)"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(i, 'quantity', e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length <= 1}
                    title="Hapus baris"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Steps */}
          <div className="form-card">
            <div className="card-header-flex">
              <div>
                <h3 className="section-heading">Langkah &amp; Cara Penggunaan</h3>
                <span className="card-subtext">Urutan pemakaian produk yang benar</span>
              </div>
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
                    placeholder="Langkah pemakaian…"
                    value={st}
                    onChange={(e) => handleStepChange(i, e.target.value)}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => removeStep(i)}
                    disabled={steps.length <= 1}
                    title="Hapus langkah"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="checkbox-box">
            <input
              id="is_featured"
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleFormChange}
              className="form-checkbox"
            />
            <label htmlFor="is_featured" className="checkbox-label">
              Tandai sebagai <strong>Produk Pilihan / Rekomendasi Utama</strong>
            </label>
          </div>

          {/* Actions Bar */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onBack}
              disabled={creating}
            >
              Batal
            </button>
            <button type="submit" className="btn btn--primary" disabled={creating}>
              {creating ? (
                <>
                  <Loader size={18} className="spin" /> Menyimpan Produk…
                </>
              ) : (
                'Simpan ke Katalog'
              )}
            </button>
          </div>
        </form>
      )}

      {/* Restore Draft Modal */}
      <ConfirmModal
        open={showDraftModal}
        title="Lanjutkan Draft Sebelumnya?"
        message={`Ditemukan draf produk yang belum selesai dari ${
          draftTimestamp ? formatDraftTime(draftTimestamp) : 'sebelumnya'
        }. Apakah kamu ingin melanjutkan pengeditan?`}
        confirmLabel="Muat Draft"
        cancelLabel="Hapus Draft"
        onConfirm={handleLoadDraft}
        onCancel={handleDiscardDraft}
      />
    </div>
  )
}
