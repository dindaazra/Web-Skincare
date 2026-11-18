# GlowAura — Aplikasi Katalog Produk Skincare & Makeup Berbasis Web (PWA)

Tugas Akhir Praktikum Pengembangan Perangkat Bergerak (PPB)  
**Pengembang:** Dinda Azra Ariefiah  
**NIM:** 21120124120039  
**Platform:** Progressive Web App (PWA) — React (Vite) + JavaScript  

---

## 🌸 Tentang Aplikasi
**GlowAura** adalah aplikasi katalog produk kecantikan modern yang menggabungkan produk *Skincare* dan *Makeup*. Dibangun dengan teknologi **Progressive Web App (PWA)**, aplikasi ini dapat diinstal di smartphone layaknya aplikasi native, mendukung mode offline dengan Service Worker, serta memiliki antarmuka responsif dengan Bottom Navigation Bar.

### 🌟 Fitur Utama (Sesuai Ketentuan Tugas Akhir):
1. **Dua Halaman Utama Berisi List Produk (Bisa Diklik ke Detail):**
   * **Katalog Skincare:** Menampilkan pembersih, toner, serum, pelembap, dan tabir surya.
   * **Katalog Makeup:** Menampilkan cushion, lip tint, maskara, blush on, dan bedak.
2. **Halaman Detail Produk Interaktif:**
   * Informasi lengkap: Brand, nama, harga Rupiah, tipe kulit/shade, kandungan aktif (*ingredients*), langkah pemakaian (*steps*), dan sistem ulasan & rating bintang.
3. **Halaman Favorit (Wishlist):**
   * Menyimpan produk yang disukai menggunakan `localStorage` dengan badge counter realtime.
4. **Halaman Tambah & Kelola Produk (CRUD):**
   * Registrasi produk baru lengkap dengan upload gambar, pilihan preset ilustrasi cantik, formulir spesifikasi, dan auto-save draft setiap 30 detik.
5. **Halaman Edit & Hapus Produk:**
   * Memperbarui detail produk dan foto secara instan.
6. **Halaman Profil & About Aplikasi:**
   * Informasi resmi pengembang: **Dinda Azra Ariefiah (21120124120039)**, kartu mahasiswa, statistik koleksi, rincian TA, dan tombol putar ulang splash screen.
7. **Fitur PWA Penuh:**
   * Web App Manifest & Service Worker untuk caching offline.
   * Tombol *Add to Home Screen* otomatis di smartphone (Android & iOS).
   * Banner status offline saat koneksi internet terputus.

---

## 🚀 Cara Menjalankan di Laptop (Mode Development)

1. Buka terminal atau VS Code di folder proyek ini:
   ```bash
   npm run dev
   ```
2. Buka link yang tampil di browser: `http://localhost:5173`

---

## 📱 Cara Menjalankan di Smartphone (Tes Tampilan Mobile & Install PWA)

1. Pastikan laptop dan smartphone terhubung di jaringan Wi-Fi yang sama (atau hotspot HP).
2. Di terminal, jalankan perintah:
   ```bash
   npm run build
   npm run preview -- --host
   ```
3. Buka alamat IP Network yang muncul (misal: `http://192.168.x.x:4173`) di browser Google Chrome (Android) atau Safari (iOS).
4. Tekan tombol **"Install App"** atau pilih menu browser **"Tambahkan ke Layar Utama" (Add to Home Screen)**.

---

## 📤 Cara Push ke GitHub

Jalankan perintah berikut di terminal folder proyek:
```bash
git add .
git commit -m "feat: complete GlowAura PWA catalog for Tugas Akhir - Dinda Azra Ariefiah"
git push origin main
```

---

## 🌐 Cara Deploy ke Vercel (Gratis)

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repositori **`Web-Skincare`** dan klik **"Import"**.
4. Pada bagian Framework Preset, pilih **Vite**.
5. Klik **"Deploy"** dan tunggu sekitar 1 menit hingga selesai.
6. Salin link domain yang diberikan Vercel untuk dikumpulkan ke Asisten Pembimbing!
