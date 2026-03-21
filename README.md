# favehotel S. Parman Medan — Panduan Kustomisasi

## 📁 Struktur File
```
favehotel-landing/
├── index.html       ← Struktur halaman utama
├── style.css        ← Semua gaya & tampilan
├── script.js        ← Interaktivitas, animasi & pembayaran
└── README.md        ← Panduan ini
```

---

## 🆕 Perubahan Terbaru
- ✅ Custom cursor dihapus → kembali ke cursor default browser
- ✅ Galeri kini menampilkan **judul + deskripsi** saat foto di-hover
- ✅ Integrasi **Midtrans Payment Gateway** (Snap, GoPay, BCA VA, QRIS)

---

## 💳 Setup Midtrans (WAJIB untuk pembayaran aktif)

### Langkah 1 — Daftar & Ambil API Key
1. Daftar di [https://dashboard.midtrans.com](https://dashboard.midtrans.com)
2. Masuk → **Settings → Access Keys**
3. Salin **Client Key** (diawali `Mid-client-...`)
4. Salin **Server Key** (diawali `Mid-server-...`) → **hanya untuk backend**

### Langkah 2 — Pasang Client Key di `index.html`
Cari baris ini di bagian bawah `index.html`:
```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="YOUR_MIDTRANS_CLIENT_KEY">
</script>
```
→ Ganti `YOUR_MIDTRANS_CLIENT_KEY` dengan Client Key Anda.

**Sandbox (testing):** gunakan URL `https://app.sandbox.midtrans.com/snap/snap.js`  
**Production (live):** ganti ke `https://app.midtrans.com/snap/snap.js`

### Langkah 3 — Pasang Client Key di `script.js`
```js
const MIDTRANS_CONFIG = {
  clientKey: 'Mid-client-XXXXXXXXXXXXXXXX',  // ← ganti ini
  roomPrices: { ... }
};
```

### Langkah 4 — Setup Backend (Node.js / PHP)
**PENTING:** Server Key TIDAK BOLEH ada di frontend. Buat endpoint di backend:

```js
// Contoh Node.js + Express
const midtransClient = require('midtrans-client');
const snap = new midtransClient.Snap({
  isProduction: false,   // true untuk production
  serverKey: 'Mid-server-XXXXXXXX',
});

app.post('/api/create-transaction', async (req, res) => {
  const { orderId, grossAmount, customerDetails, itemDetails } = req.body;
  const parameter = {
    transaction_details: { order_id: orderId, gross_amount: grossAmount },
    customer_details: customerDetails,
    item_details: itemDetails,
  };
  const transaction = await snap.createTransaction(parameter);
  res.json({ token: transaction.token, orderId });
});
```

### Langkah 5 — Aktifkan backend di `script.js`
Cari bagian `processPayment()`, **uncomment** blok backend dan **hapus** `runDemoPayment()`:
```js
// Uncomment ini:
const response = await fetch('/api/create-transaction', { ... });
const { token } = await response.json();
launchMidtransSnap(token);

// Hapus/comment ini:
// runDemoPayment();
```

### Metode Pembayaran yang Tersedia
| Metode | Keterangan |
|---|---|
| Midtrans Snap | Semua metode (kartu kredit, VA, e-wallet) dalam 1 popup |
| GoPay | Dompet digital via QR |
| BCA Virtual Account | Transfer bank BCA |
| QRIS | Scan QR dari semua e-wallet |

---

## 🖼️ Mengganti Foto & Logo

### Logo Perusahaan
```html
<img src="logo.png" alt="favehotel Logo" class="nav-logo-img" />
```
→ Ganti `logo.png` dengan file logo Anda (PNG transparan, tinggi ±80px).

### Foto Latar Belakang Hero
```html
<img src="hero-bg.jpg" ... />
```
→ Disarankan ukuran 1920×1080px.

### Foto Kamar
```
room-standard.jpg  ← Kamar Standar
room-deluxe.jpg    ← Kamar Deluxe
room-suite.jpg     ← Kamar Suite
```

### Foto Galeri (bisa ubah nama & deskripsi)
Di `index.html`, setiap item galeri memiliki:
```html
<div class="gallery-item">
  <img src="gallery-1.jpg" alt="Lobby Hotel" />
  <div class="gallery-overlay">
    <div class="gallery-overlay-title">Lobby Utama</div>       ← Ubah judul
    <div class="gallery-overlay-desc">Deskripsi foto...</div>  ← Ubah deskripsi
  </div>
</div>
```

---

## 🎨 Mengubah Warna
Di `style.css` bagian `:root`:
```css
--blue-deep:    #0A1628;   /* Latar utama (60%) */
--blue-bright:  #1E5BCC;   /* Aksen interaktif */
--black-rich:   #080C14;   /* Section gelap (30%) */
--white:        #FFFFFF;   /* Teks terang (10%) */
```

---

## 📝 Mengubah Harga Kamar
Di `script.js`, bagian `MIDTRANS_CONFIG`:
```js
roomPrices: {
  'Kamar Standar': 350000,   // ← ubah sesuai harga aktual
  'Kamar Deluxe':  550000,
  'Kamar Suite':   850000,
}
```

---

## 🚀 Cara Menggunakan
1. Taruh semua file dalam satu folder
2. Tambahkan file gambar sesuai nama
3. Pasang Client Key Midtrans (lihat bagian Setup di atas)
4. Buka `index.html` di browser atau upload ke hosting

---

© 2025 favehotel S. Parman Medan


---

## 💳 Integrasi Midtrans

### Langkah 1 — Daftar & Dapatkan API Key
1. Daftar di [dashboard.midtrans.com](https://dashboard.midtrans.com)
2. Masuk ke **Settings → Access Keys**
3. Salin **Client Key** (untuk frontend) dan **Server Key** (untuk backend)

### Langkah 2 — Pasang Client Key di index.html
Cari tag script Midtrans dan ganti `YOUR_MIDTRANS_CLIENT_KEY`:
```html
<script
  src="https://app.sandbox.midtrans.com/snap/snap.js"
  data-client-key="Mid-client-XXXXXXXXXXXXX">
</script>
```
Untuk **production** (bukan sandbox), ganti URL menjadi:
```
https://app.midtrans.com/snap/snap.js
```

### Langkah 3 — Update Client Key di script.js
```js
const MIDTRANS_CONFIG = {
  clientKey: 'Mid-client-XXXXXXXXXXXXX', // ← ganti ini
  roomPrices: { ... }
};
```

### Langkah 4 — Buat Backend (WAJIB untuk production)
Server Key **tidak boleh** ada di frontend. Buat endpoint backend:

**Contoh Node.js + Express:**
```js
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false, // true untuk production
  serverKey: 'YOUR_SERVER_KEY',
  clientKey: 'YOUR_CLIENT_KEY',
});

app.post('/api/create-transaction', async (req, res) => {
  const { orderId, grossAmount, customerDetails, itemDetails } = req.body;
  
  const parameter = {
    transaction_details: { order_id: orderId, gross_amount: grossAmount },
    customer_details: customerDetails,
    item_details: itemDetails,
  };

  const transaction = await snap.createTransaction(parameter);
  res.json({ token: transaction.token, orderId });
});
```

### Langkah 5 — Aktifkan Backend di script.js
Di fungsi `processPayment()`, uncomment blok `// ── CARA PAKAI BACKEND NYATA ──` dan hapus panggilan `runDemoPayment()`.

### Mode Demo vs Production

| Mode | Keterangan |
|---|---|
| **Demo** (default) | Tidak butuh backend, hanya simulasi tampilan |
| **Sandbox** | Gunakan kredensial sandbox Midtrans, transaksi tidak nyata |
| **Production** | Gunakan kredensial production, transaksi nyata |

### Metode Pembayaran yang Didukung Midtrans
- Kartu Kredit/Debit (Visa, Mastercard, JCB)
- GoPay, OVO, Dana, ShopeePay
- Bank Transfer (BCA, BNI, BRI, Mandiri, Permata)
- QRIS
- Alfamart / Indomaret
- Akulaku / Kredivo
