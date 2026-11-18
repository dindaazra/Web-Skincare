import FavoriteButton from '../common/FavoriteButton'
import { formatRupiah, truncate } from '../../utils/helpers'
import { Star, Edit3, Trash2 } from 'lucide-react'

export default function ProductCard({ product, onSelect, onEdit, onDelete }) {
  const imgSrc = product.image_url || product.image || '/skincare/serum.svg'
  const isSkincare = product.category === 'Skincare'

  return (
    <li className="beauty-card">
      <div
        className="beauty-card__content"
        onClick={() => onSelect(product)}
        role="button"
        tabIndex={0}
      >
        {/* Top Badges */}
        <div className="beauty-card__top">
          <span
            className={`badge ${
              isSkincare ? 'badge--skincare' : 'badge--makeup'
            }`}
          >
            {product.category}
          </span>
          <span className="badge badge--type">{product.type}</span>
        </div>

        {/* Product Image */}
        <div className="beauty-card__img-wrap">
          <img
            src={imgSrc}
            alt={product.name}
            className="beauty-card__img"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="beauty-card__info">
          <span className="beauty-card__brand">{product.brand}</span>
          <h3 className="beauty-card__name">{product.name}</h3>

          <div className="beauty-card__meta">
            <div className="beauty-card__rating">
              <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
              <span>{product.rating ? Number(product.rating).toFixed(1) : '4.8'}</span>
              <span className="review-count">
                ({product.reviewCount || 10})
              </span>
            </div>
            <span className="beauty-card__skin">{product.skinType}</span>
          </div>

          <p className="beauty-card__desc">
            {truncate(product.description, 75)}
          </p>

          <div className="beauty-card__footer">
            <span className="beauty-card__price">
              {formatRupiah(product.price)}
            </span>
            <span className="beauty-card__link">Lihat Detail →</span>
          </div>
        </div>
      </div>

      {/* Floating Card Actions */}
      <div className="beauty-card__actions">
        <FavoriteButton productId={product.id} />
        {onEdit && (
          <button
            type="button"
            className="card-act-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(product)
            }}
            title="Edit Produk"
            aria-label="Edit"
          >
            <Edit3 size={15} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="card-act-btn card-act-btn--danger"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(product)
            }}
            title="Hapus Produk"
            aria-label="Hapus"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </li>
  )
}
