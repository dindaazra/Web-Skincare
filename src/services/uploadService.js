// ---------------------------------------------------------------------------
// uploadService.js — Upload & konversi gambar produk kecantikan
// ---------------------------------------------------------------------------

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

class UploadService {
  /**
   * Upload atau ubah gambar menjadi base64 Data URL
   */
  async uploadImage(file) {
    if (!file) {
      throw new Error('Pilih file gambar terlebih dahulu.')
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.')
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('Ukuran file maksimal 5MB.')
    }

    // Konversi ke base64 Data URL agar langsung tampil dan persisten di PWA
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
      reader.readAsDataURL(file)
    })

    return {
      success: true,
      data: {
        url: dataUrl,
        filename: file.name,
      },
    }
  }
}

export default new UploadService()
