# favehotel S. Parman Medan — Landing Page

Landing page profil perusahaan untuk **favehotel S. Parman Medan**, sebuah hotel berbintang yang berlokasi di Jalan S. Parman, Kota Medan, Sumatera Utara. Proyek ini dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa framework, dengan pendekatan desain minimalis modern menggunakan teori warna **60-30-10** (Biru · Hitam · Putih).

---

## Tentang Proyek

Website ini merupakan halaman profil digital favehotel S. Parman Medan yang menampilkan identitas hotel, fasilitas unggulan, pilihan kamar, galeri visual, serta sistem reservasi kamar yang terhubung dengan payment gateway **Midtrans**. Seluruh tampilan dibangun dari nol tanpa library UI eksternal, mempertahankan performa yang ringan namun tetap kaya interaksi.

Desain mengadopsi estetika hotel premium dengan palet warna dominan biru navy yang dalam, dipadukan hitam pekat dan sentuhan putih sebagai kontras, menciptakan kesan elegan sekaligus profesional.

---

## Fitur

**Tampilan & Navigasi**
- Navbar transparan yang berubah solid saat scroll, dengan auto-hide saat scroll ke bawah dan muncul kembali saat scroll ke atas
- Hero section fullscreen dengan foto latar belakang, efek parallax, dan animasi partikel berbasis Canvas API
- Animasi masuk elemen saat scroll (Animate on Scroll) yang diimplementasikan sendiri tanpa library
- Responsive penuh untuk desktop, tablet, dan mobile — termasuk hamburger menu dengan overlay

**Konten Hotel**
- Seksi profil hotel dengan lencana tahun berdiri dan chip fitur unggulan
- Tiga pilihan kamar (Standar, Deluxe, Suite) dengan efek tilt 3D saat hover di desktop
- Enam kartu fasilitas hotel dengan efek gradient hover
- Galeri foto horizontal scrollable dengan overlay judul dan deskripsi per foto saat hover, plus lightbox fullscreen saat klik

**Interaksi**
- Slider testimoni tamu dengan auto-rotate, navigasi manual, dan swipe gesture di mobile
- Counter angka statistik dengan animasi increment saat pertama kali terlihat di layar
- Tombol back-to-top yang muncul setelah scroll melampaui batas tertentu
- Toast notification untuk feedback aksi pengguna
- Highlight navigasi aktif sesuai posisi scroll halaman

**Sistem Reservasi & Pembayaran**
- Formulir booking dengan validasi input, batas tanggal otomatis, dan logika check-out tidak boleh sebelum check-in
- Modal pembayaran yang muncul setelah form terisi lengkap, menampilkan ringkasan pesanan dengan kalkulasi total otomatis berdasarkan durasi menginap
- Integrasi **Midtrans Snap** dengan dukungan empat metode: Snap all-in-one, GoPay, BCA Virtual Account, dan QRIS
- Callback handler untuk status `success`, `pending`, `error`, dan `close`
- Mode demo bawaan untuk keperluan pengembangan tanpa memerlukan backend

**Aksesibilitas**
- Dukungan navigasi keyboard penuh dengan indikator fokus yang jelas
- Atribut ARIA pada elemen interaktif (dialog, tombol, iframe peta)
- Respek terhadap preferensi `prefers-reduced-motion` untuk pengguna yang sensitif terhadap animasi

---

## Struktur Proyek

```
favehotel-landing/
├── index.html      — Markup HTML seluruh halaman
├── style.css       — Seluruh gaya, variabel warna, dan layout responsif
├── script.js       — Logika interaksi, animasi, dan integrasi pembayaran
└── README.md       — Dokumentasi proyek ini
```

Seluruh aset gambar (foto hero, kamar, galeri, logo) disimpan terpisah dan direferensikan melalui atribut `src` di `index.html`. Tidak ada dependensi npm atau proses build yang dibutuhkan — cukup buka `index.html` langsung di browser.

---

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Markup | HTML5 Semantic |
| Styling | CSS3 — Custom Properties, Grid, Flexbox, Animasi |
| Skrip | Vanilla JavaScript (ES6+) |
| Font | Google Fonts — Lexend & Cormorant Garamond |
| Pembayaran | Midtrans Snap JS |
| Peta | Google Maps Embed API |

---

## Skema Warna

Proyek ini menerapkan teori warna **60-30-10** secara konsisten di seluruh antarmuka:

| Peran | Warna | Hex |
|---|---|---|
| 60% — Dominan | Biru Navy | `#0A1628` |
| 30% — Sekunder | Hitam Pekat | `#080C14` |
| 10% — Aksen | Putih | `#FFFFFF` |
| Interaktif | Biru Cerah | `#1E5BCC` |

Semua nilai warna tersimpan sebagai CSS Custom Properties di blok `:root` pada `style.css`, sehingga dapat dimodifikasi dari satu tempat tanpa menyentuh markup atau skrip.

---

## Pembayaran — Midtrans

Sistem pembayaran menggunakan **Midtrans Snap**, payment gateway terkemuka di Indonesia yang mendukung puluhan metode pembayaran lokal. Alur kerjanya:

1. Tamu mengisi formulir reservasi dan memilih tipe kamar
2. Submit membuka modal pembayaran dengan ringkasan pesanan
3. Tamu memilih metode bayar dan mengklik tombol bayar
4. Frontend memanggil endpoint backend untuk mendapatkan `snap_token`
5. Midtrans Snap popup tampil dan memproses pembayaran
6. Hasil transaksi ditangkap melalui callback dan ditampilkan kepada tamu

Secara default proyek berjalan dalam **mode demo** yang mensimulasikan alur pembayaran tanpa koneksi ke server nyata. Untuk produksi, diperlukan backend (Node.js, PHP, Python, atau lainnya) yang menggunakan Server Key Midtrans untuk membuat transaksi secara aman.

---

## Pratinjau Halaman

| Seksi | Deskripsi |
|---|---|
| **Hero** | Fullscreen dengan foto hotel, tagline, tombol CTA, dan statistik |
| **Tentang** | Profil singkat hotel dengan foto dan chip fitur unggulan |
| **Kamar** | Tiga tipe kamar dengan harga, fasilitas, dan tombol pesan |
| **Fasilitas** | Enam layanan hotel dalam grid kartu interaktif |
| **Galeri** | Slider foto horizontal dengan deskripsi per gambar dan lightbox |
| **Testimoni** | Ulasan tamu dalam slider otomatis dengan swipe support |
| **Reservasi** | Form booking terintegrasi modal pembayaran Midtrans |
| **Kontak** | Informasi lokasi, telepon, email, sosial media, dan peta embed |

---

## Lisensi

Proyek ini dibuat untuk keperluan **favehotel S. Parman Medan**. Seluruh konten, nama merek, dan materi visual adalah milik PT Grahareksa Selaras / favehotel Group.

---

*Dibuat dengan HTML, CSS, dan JavaScript — tanpa framework, tanpa dependensi.*
