// ---------------------------------------------------------------------------
// userService.js — Identitas pengguna / praktikan
// Dinda Azra Ariefiah — 21120124120039
// ---------------------------------------------------------------------------

const USER_IDENTIFIER_KEY = 'glowaura_user_id'
const USER_PROFILE_KEY = 'glowaura_user_profile'

const isValidUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getUserIdentifier = () => {
  try {
    let userId = localStorage.getItem(USER_IDENTIFIER_KEY)
    if (!userId || !isValidUUID(userId)) {
      userId = generateUUID()
      localStorage.setItem(USER_IDENTIFIER_KEY, userId)
    }
    return userId
  } catch {
    return generateUUID()
  }
}

export const getUserProfile = () => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fallback to default */
  }
  return {
    name: 'Dinda Azra Ariefiah',
    nim: '21120124120039',
    programStudi: 'Teknik Komputer / Sistem Komputer',
    instansi: 'Universitas Diponegoro',
    avatar: null,
    bio: 'Pengembang aplikasi katalog skincare & makeup berbasis Progressive Web App (PWA). Berfokus pada antarmuka estetik, responsif, dan performa tinggi.',
    userId: getUserIdentifier(),
    favoriteBrand: 'Somethinc & Skintific',
    skinProfile: 'Normal to Sensitive Skin',
  }
}

export const saveUserProfile = (profile) => {
  try {
    const data = {
      ...profile,
      userId: getUserIdentifier(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data))
    return { success: true, data }
  } catch (err) {
    return { success: false, message: err.message }
  }
}

export default {
  getUserIdentifier,
  getUserProfile,
  saveUserProfile,
}
