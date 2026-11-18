import { useState } from 'react'
import Header from './components/common/Header.jsx'
import BottomNav from './components/common/BottomNav.jsx'
import Footer from './components/common/Footer.jsx'
import SkincareCatalog from './pages/SkincareCatalog.jsx'
import MakeupCatalog from './pages/MakeupCatalog.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import CreateProductPage from './pages/CreateProductPage.jsx'
import EditProductPage from './pages/EditProductPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProductDetail from './components/product/ProductDetail.jsx'
import PWABadge from './components/common/PWABadge.jsx'
import SplashScreen from './components/common/SplashScreen.jsx'
import ConfirmModal from './components/modals/ConfirmModal.jsx'
import productService from './services/productService.js'
import { useFavorites } from './hooks/useFavorites.js'
import './App.css'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [tab, setTab] = useState('Skincare') // 'Skincare' | 'Makeup' | 'Favorites' | 'Create' | 'Profile'
  const [mode, setMode] = useState('list') // 'list' | 'detail' | 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Favorites Hook untuk counter badge
  const { favorites } = useFavorites()
  const favCount = favorites ? favorites.length : 0

  const handleNavigate = (destination, payload = null) => {
    if (destination === 'Detail') {
      setSelectedProduct(payload)
      setMode('detail')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (destination === 'Edit') {
      setEditingProduct(payload)
      setMode('edit')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (destination === 'Create') {
      setTab('Create')
      setMode('list')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setTab(destination)
      setMode('list')
      setSelectedProduct(null)
      setEditingProduct(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToList = () => {
    setMode('list')
    setSelectedProduct(null)
    setEditingProduct(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await productService.deleteProduct(deleteTarget.id)
      setDeleteTarget(null)
      handleBackToList()
    } catch (err) {
      alert(err.message || 'Gagal menghapus produk.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="app-shell">
      {/* Intro Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Top Header */}
      <Header
        activeTab={mode === 'list' ? tab : ''}
        onNavigate={handleNavigate}
        favCount={favCount}
      />

      {/* Main Content Area */}
      <main className="app-main">
        {/* Detail View */}
        {mode === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToList}
            onEdit={(p) => handleNavigate('Edit', p)}
            onDelete={(p) => setDeleteTarget(p)}
          />
        )}

        {/* Edit View */}
        {mode === 'edit' && (
          <EditProductPage
            product={editingProduct}
            productId={editingProduct?.id}
            onBack={handleBackToList}
            onSuccess={() => {
              handleBackToList()
              window.location.reload()
            }}
          />
        )}

        {/* Tab Views */}
        {mode === 'list' && (
          <>
            {tab === 'Skincare' && (
              <SkincareCatalog
                onSelectProduct={(p) => handleNavigate('Detail', p)}
                onNavigateCreate={() => handleNavigate('Create')}
                onEditProduct={(p) => handleNavigate('Edit', p)}
                onDeleteProduct={(p) => setDeleteTarget(p)}
              />
            )}

            {tab === 'Makeup' && (
              <MakeupCatalog
                onSelectProduct={(p) => handleNavigate('Detail', p)}
                onNavigateCreate={() => handleNavigate('Create')}
                onEditProduct={(p) => handleNavigate('Edit', p)}
                onDeleteProduct={(p) => setDeleteTarget(p)}
              />
            )}

            {tab === 'Favorites' && (
              <FavoritesPage
                onSelectProduct={(p) => handleNavigate('Detail', p)}
                onNavigateCatalog={(cat) => handleNavigate(cat)}
              />
            )}

            {tab === 'Create' && (
              <CreateProductPage
                onBack={handleBackToList}
                onSuccess={(newProd) => {
                  handleBackToList()
                  setTab(newProd?.category === 'Makeup' ? 'Makeup' : 'Skincare')
                }}
              />
            )}

            {tab === 'Profile' && (
              <ProfilePage onReplaySplash={() => setShowSplash(true)} />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation for Mobile & Responsive Web */}
      <BottomNav
        activeTab={mode === 'list' ? tab : ''}
        onTabChange={handleNavigate}
        favCount={favCount}
      />

      {/* Global Delete Confirmation */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Produk dari Katalog?"
        message={`Apakah kamu yakin ingin menghapus "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Produk"
        cancelLabel="Batal"
        danger
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* PWA Offline & Install Prompt */}
      <PWABadge />

      {/* Footer */}
      <Footer />
    </div>
  )
}
