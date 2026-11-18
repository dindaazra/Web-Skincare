import { useState } from 'react'
import {
  ArrowLeft,
  Star,
  Send,
  Loader,
  Heart,
  Edit3,
  Trash2,
  CheckCircle,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react'
import FavoriteButton from '../common/FavoriteButton'
import { useReviews } from '../../hooks/useReviews'
import { formatRupiah, averageRating } from '../../utils/helpers'

export default function ProductDetail({ product, onBack, onEdit, onDelete }) {
  const imgSrc = product.image_url || product.image || '/skincare/serum.svg'
  const isSkincare = product.category === 'Skincare'

  // Reviews Hook
  const { reviews, loading: reviewsLoading, addReview } = useReviews(product.id)

  const [rating, setRating] = useState(5)
  const [reviewerName, setReviewerName] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  const overallRating = product.rating || averageRating(reviews) || 4.8
  const totalReviews = (product.reviewCount || 0) + reviews.length

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    const res = await addReview({
      userName: reviewerName.trim() || 'Beauty Enthusiast',
      rating,
      comment: comment.trim(),
    })
    setSubmitting(false)
    if (res) {
      setFeedbackMsg('Terima kasih! Ulasan kamu berhasil dikirim.')
      setComment('')
      setReviewerName('')
      setRating(5)
      setTimeout(() => setFeedbackMsg(''), 4000)
    }
  }

  return (
    <div className="detail-view">
      {/* Top Bar */}
      <div className="detail-top-bar">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Kembali ke Katalog</span>
        </button>
        <div className="detail-top-actions">
          <FavoriteButton productId={product.id} />
          {onEdit && (
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => onEdit(product)}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn--danger-ghost btn--sm"
              onClick={() => onDelete(product)}
            >
              <Trash2 size={15} />
              <span>Hapus</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="detail-hero-card">
        <div className="detail-hero-img-wrap">
          <img src={imgSrc} alt={product.name} className="detail-hero-img" />
          <span
            className={`badge ${
              isSkincare ? 'badge--skincare' : 'badge--makeup'
            } detail-hero-badge`}
          >
            {product.category} · {product.type}
          </span>
        </div>

        <div className="detail-hero-info">
          <span className="detail-brand">{product.brand}</span>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating-row">
            <div className="stars-cluster">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  fill={star <= Math.round(overallRating) ? '#f59e0b' : 'none'}
                  stroke="#f59e0b"
                />
              ))}
            </div>
            <span className="rating-score">{Number(overallRating).toFixed(1)}</span>
            <span className="rating-count">({totalReviews} ulasan)</span>
          </div>

          <div className="detail-price-box">
            <span className="price-tag">{formatRupiah(product.price)}</span>
            <span className="skin-pill">{product.skinType}</span>
          </div>

          <p className="detail-desc">{product.description}</p>
        </div>
      </div>

      {/* Grid: Ingredients & Steps */}
      <div className="detail-sections-grid">
        {/* Ingredients */}
        <section className="detail-card">
          <div className="detail-card__header">
            <Sparkles size={20} className="icon-rose" />
            <h2>Kandungan &amp; Formula Utama</h2>
          </div>
          {product.ingredients && product.ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {product.ingredients.map((ing, i) => (
                <li key={i} className="ingredient-item">
                  <span className="ing-name">{ing.name}</span>
                  <span className="ing-qty">{ing.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-text">Formula teruji klinis dan aman untuk kulit.</p>
          )}
        </section>

        {/* Steps */}
        <section className="detail-card">
          <div className="detail-card__header">
            <Layers size={20} className="icon-rose" />
            <h2>Panduan &amp; Cara Penggunaan</h2>
          </div>
          {product.steps && product.steps.length > 0 ? (
            <ol className="steps-list">
              {product.steps.map((step, i) => (
                <li key={i} className="step-item">
                  <span className="step-number">{i + 1}</span>
                  <p className="step-text">{step}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="empty-text">Gunakan sesuai anjuran pada kemasan produk.</p>
          )}
        </section>
      </div>

      {/* Review Section */}
      <section className="detail-card reviews-card">
        <div className="detail-card__header">
          <Star size={20} className="icon-rose" />
          <h2>Ulasan Pelanggan ({reviews.length})</h2>
        </div>

        {feedbackMsg && (
          <div className="toast toast--success">
            <CheckCircle size={18} />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmitReview} className="review-form">
          <h3 className="review-form__title">Bagikan Pengalaman Kamu</h3>
          <div className="stars-input">
            <span className="stars-label">Rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                className="star-input-btn"
                onClick={() => setRating(s)}
                aria-label={`Rating ${s} bintang`}
              >
                <Star
                  size={24}
                  fill={s <= rating ? '#f59e0b' : 'none'}
                  stroke={s <= rating ? '#f59e0b' : '#cbd5e1'}
                />
              </button>
            ))}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Nama kamu (opsional)"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <textarea
              rows={3}
              placeholder="Tulis ulasan jujur tentang produk ini (tekstur, hasil, kecocokan)…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-textarea"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || !comment.trim()}
          >
            {submitting ? (
              <>
                <Loader size={16} className="spin" /> Mengirim Ulasan…
              </>
            ) : (
              <>
                <Send size={16} /> Kirim Ulasan
              </>
            )}
          </button>
        </form>

        {/* Review List */}
        {reviewsLoading ? (
          <div className="reviews-loading">
            <Loader size={20} className="spin" />
            <span>Memuat ulasan…</span>
          </div>
        ) : reviews.length > 0 ? (
          <ul className="reviews-list">
            {reviews.map((rev) => (
              <li key={rev.id} className="review-card">
                <div className="review-card__top">
                  <div className="review-card__user">
                    <span className="user-avatar-initial">
                      {(rev.userName || 'B')[0].toUpperCase()}
                    </span>
                    <div>
                      <h4 className="user-name">{rev.userName || 'Pengguna Cantik'}</h4>
                      <span className="review-date">
                        {new Date(rev.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="stars-cluster">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= rev.rating ? '#f59e0b' : 'none'}
                        stroke={s <= rev.rating ? '#f59e0b' : '#e2e8f0'}
                      />
                    ))}
                  </div>
                </div>
                <p className="review-card__comment">{rev.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
        )}
      </section>
    </div>
  )
}
