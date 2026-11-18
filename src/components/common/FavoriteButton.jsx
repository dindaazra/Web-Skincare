import { Heart } from 'lucide-react'
import { useFavorites } from '../../hooks/useFavorites'

export default function FavoriteButton({ productId, onToggle }) {
  const { isFavorited, toggleFavorite } = useFavorites()
  const favorited = isFavorited(productId)

  const handleClick = async (e) => {
    e.stopPropagation()
    const res = await toggleFavorite(productId)
    if (onToggle) onToggle(res)
  }

  return (
    <button
      type="button"
      className={`fav-btn ${favorited ? 'fav-btn--active' : ''}`}
      onClick={handleClick}
      aria-label={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      title={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      <Heart
        size={18}
        fill={favorited ? '#f43f5e' : 'none'}
        stroke={favorited ? '#f43f5e' : '#94a3b8'}
      />
    </button>
  )
}
