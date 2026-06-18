# DESIGN.md - PINFAS (Pinjam Fasilitas)

Dokumen ini adalah panduan visual dan desain sistem untuk PINFAS.
Setiap keputusan desain di sini dibuat dengan alasan spesifik untuk produk ini.
Gunakan dokumen ini sebagai acuan tunggal saat membangun atau mengevaluasi tampilan.
Jangan mengambil keputusan visual di luar dokumen ini.

---

## 1. Filosofi Desain: "Bali Governing with Pride"

PINFAS harus terasa seperti portal pemerintahan kelas dunia yang berakar pada identitas Bali.
Bukan aplikasi pemerintahan yang kaku dan membosankan, bukan pula aplikasi startup yang terlalu kasual.

Tiga kata kunci yang menjadi kompas setiap keputusan visual:

- **Elegan**: setiap elemen punya alasan keberadaannya, tidak ada dekorasi sia-sia. Kesederhanaan yang terasa mewah, bukan kosong.
- **Premium**: warna saturasi tinggi, tipografi bold, kontras kuat. Warga dan dosen yang membuka aplikasi ini harus langsung merasa ini serius dan berkualitas tinggi.
- **Bali**: identitas lokal bukan ditampilkan lewat kosakata atau foto klise, melainkan lewat palet warna yang terinspirasi alam dan budaya Bali, pattern Patra Punggel yang subtle, dan gradien hangat yang mencerminkan cahaya senja Bali.

---

## 2. Signature Elements (Elemen Khas PINFAS)

Tiga elemen ini yang membuat PINFAS tidak tertukar dengan aplikasi pemerintahan lain:

**1. Gradient Navy ke Emas**
Gradien dari biru navy gelap (#0D2137) ke emas amber (#C9A84C). Digunakan di hero section, header dasbor admin, dan elemen premium. Ini adalah identitas visual utama PINFAS.

```css
background: linear-gradient(135deg, #0D2137 0%, #1A3A5C 60%, #C9A84C 100%);
```

**2. Pattern Patra Punggel**
Motif sulur daun spiral khas ukiran Bali, dirender sebagai SVG inline dan dipakai sebagai background texture di section tertentu dengan opacity 5-8%. Tidak pernah dipakai di atas teks penting karena mengganggu keterbacaan.

Implementasi:
```css
background-image: url("data:image/svg+xml,..."); /* SVG Patra Punggel */
background-size: 120px 120px;
opacity: 0.06;
```

**3. Accent Bar Emas**
Garis vertikal emas (#C9A84C) setinggi 4px di sisi kiri setiap kartu aset, dan garis horizontal emas 3px di bawah setiap header section penting. Konsisten di seluruh aplikasi.

---

## 3. Palet Warna

```css
/* Primary - Biru Navy Bali */
--color-primary:        #0D2137;  /* Navy gelap, background utama premium */
--color-primary-mid:    #1A3A5C;  /* Midtone untuk gradient */
--color-primary-light:  #2E6DA4;  /* Hover state, aksen interaktif */
--color-primary-pale:   #E8F0F8;  /* Background subtle primary */

/* Secondary - Hijau Sawah Bali */
--color-secondary:      #0A5C46;  /* Hijau tua, success state */
--color-secondary-light:#138A68;  /* Hover state secondary */
--color-secondary-pale: #E6F4F0;  /* Background subtle secondary */

/* Accent - Emas Adat Bali */
--color-accent:         #C9A84C;  /* Emas signature, accent bar, highlight */
--color-accent-light:   #E8C96A;  /* Emas terang untuk hover */
--color-accent-pale:    #FDF6E3;  /* Background emas sangat subtle */
--color-accent-dark:    #9A7A2E;  /* Emas gelap untuk pressed state */

/* Surface */
--color-surface:        #F4F7FB;  /* Background halaman */
--color-card:           #FFFFFF;  /* Background kartu */
--color-card-dark:      #0D2137;  /* Kartu premium (hero stats) */

/* Text */
--color-text-primary:   #0D2137;  /* Teks utama */
--color-text-secondary: #4A5568;  /* Teks pendukung */
--color-text-muted:     #718096;  /* Label, placeholder */
--color-text-inverse:   #FFFFFF;  /* Teks di atas background gelap */

/* Border */
--color-border:         #E2E8F0;  /* Border default */
--color-border-strong:  #CBD5E0;  /* Border tegas */

/* Danger */
--color-danger:         #9B1C1C;  /* Error, aksi destruktif */
--color-danger-light:   #FEE2E2;  /* Background error subtle */
--color-danger-border:  #FCA5A5;  /* Border error */

/* Warning */
--color-warning:        #92400E;  /* Warning text */
--color-warning-light:  #FEF3C7;  /* Background warning */
--color-warning-border: #FCD34D;  /* Border warning */
```

### Warna Status Badge

| Status | Background | Text | Border | Ikon lucide-react | Label UI |
|--------|-----------|------|--------|-------------------|----------|
| pending | #FEF3C7 | #92400E | #FCD34D | Clock | Menunggu Verifikasi |
| menunggu_pembayaran | #FDF6E3 | #9A7A2E | #E8C96A | CreditCard | Menunggu Pembayaran |
| menunggu_konfirmasi_bayar | #E8F0F8 | #1A3A5C | #2E6DA4 | Hourglass | Menunggu Konfirmasi |
| approved | #E6F4F0 | #0A5C46 | #138A68 | CheckCircle | Disetujui |
| rejected | #FEE2E2 | #9B1C1C | #FCA5A5 | XCircle | Ditolak |
| dibatalkan | #F3F4F6 | #4A5568 | #CBD5E0 | Ban | Dibatalkan |
| terlambat | #FEE2E2 | #9B1C1C | #FCA5A5 | AlertTriangle | Terlambat |
| selesai | #E6F4F0 | #0A5C46 | #138A68 | PackageCheck | Selesai |
| tersedia | #E6F4F0 | #0A5C46 | #138A68 | CheckCircle | Tersedia |
| maintenance | #FEF3C7 | #92400E | #FCD34D | Wrench | Maintenance |
| terpakai | #F3F4F6 | #4A5568 | #CBD5E0 | CalendarX | Terpakai |

---

## 4. Tipografi

Import di `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Peran | Font | Weight | Konteks |
|-------|------|--------|---------|
| Display | Plus Jakarta Sans | 900 | Hero headline, angka KPI besar |
| Heading | Plus Jakarta Sans | 700, 800 | Judul halaman, judul section |
| Subheading | Plus Jakarta Sans | 600 | Judul kartu, label grup |
| Body | Inter | 400, 500 | Konten utama, deskripsi |
| UI | Inter | 500, 600 | Tombol, label, navigasi |
| Data | JetBrains Mono | 400, 500 | Nomor pengajuan, NIK, nominal uang, QR reference |

### Skala Tipografi

| Level | Size | Weight | Font | Digunakan untuk |
|-------|------|--------|------|-----------------|
| Display | 48px / 3rem | 900 | Plus Jakarta Sans | Angka KPI besar di dasbor |
| Hero | 36px / 2.25rem | 800 | Plus Jakarta Sans | Headline hero section |
| H1 | 28px / 1.75rem | 700 | Plus Jakarta Sans | Judul halaman |
| H2 | 22px / 1.375rem | 700 | Plus Jakarta Sans | Judul section |
| H3 | 18px / 1.125rem | 600 | Plus Jakarta Sans | Judul kartu |
| H4 | 15px / 0.9375rem | 600 | Plus Jakarta Sans | Label grup, subjudul |
| Body | 14px / 0.875rem | 400 | Inter | Konten utama |
| Body Strong | 14px / 0.875rem | 500 | Inter | Teks yang perlu penekanan |
| Small | 12px / 0.75rem | 400 | Inter | Label, keterangan, timestamp |
| Data | 13px / 0.8125rem | 500 | JetBrains Mono | NIK, nomor pengajuan, nominal |
| Data Small | 11px / 0.6875rem | 400 | JetBrains Mono | Kode referensi kecil |

---

## 5. Spacing

Berbasis kelipatan 4px, gunakan skala Tailwind default.

| Token | Nilai | Konteks |
|-------|-------|---------|
| space-1 | 4px | Gap antar ikon dan label |
| space-2 | 8px | Padding badge, gap elemen kecil |
| space-3 | 12px | Padding komponen kecil |
| space-4 | 16px | Padding kartu standar |
| space-5 | 20px | Padding kartu besar |
| space-6 | 24px | Padding section |
| space-8 | 32px | Jarak antar section kecil |
| space-12 | 48px | Jarak antar section besar |
| space-16 | 64px | Margin hero |

---

## 6. Border Radius

| Elemen | Nilai | Tailwind |
|--------|-------|---------|
| Badge | 4px | rounded |
| Input field | 8px | rounded-lg |
| Tombol kecil | 8px | rounded-lg |
| Tombol utama | 9999px | rounded-full |
| Kartu standar | 16px | rounded-2xl |
| Kartu premium | 20px | rounded-[20px] |
| Modal | 20px | rounded-[20px] |
| Avatar | 9999px | rounded-full |
| Tag/chip | 9999px | rounded-full |

---

## 7. Shadow

| Level | Tailwind | Digunakan pada |
|-------|---------|----------------|
| Subtle | shadow-sm | Input field, badge |
| Default | shadow-md | Kartu aset default |
| Hover | shadow-xl | Kartu aset saat hover |
| Elevated | shadow-2xl | Modal, panel sticky |
| Colored | shadow-lg + drop-shadow warna primary | Tombol primary saat hover |
| Top bar | shadow-md | Navbar sticky |

---

## 8. Transisi dan Animasi

| Elemen | Efek | Durasi | Easing |
|--------|------|--------|--------|
| Kartu aset hover | shadow naik + translateY(-4px) | 200ms | ease-out |
| Tombol primary hover | shadow berwarna + scale(1.02) | 150ms | ease |
| Tombol active/pressed | scale(0.97) | 100ms | ease |
| Badge fade-in | opacity 0 ke 1 + translateY(4px ke 0) | 250ms | ease-out |
| Sidebar admin mobile | translateX(-100% ke 0) | 300ms | ease-in-out |
| Modal masuk | opacity + scale(0.95 ke 1) | 250ms | ease-out |
| Modal keluar | opacity + scale(1 ke 0.95) | 150ms | ease-in |
| Step indicator progress | width animasi kiri ke kanan | 400ms | ease-in-out |
| Gradient hero | background-position shift subtle | 8s | linear, infinite |
| Dropdown menu | opacity + translateY(-8px ke 0) | 150ms | ease-out |
| Page transition | opacity 0 ke 1 | 200ms | ease |

```css
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

---

## 9. Komponen Berulang

### 9.1 Kartu Aset (AssetCard.jsx)

```
+----------------------------------------+
| [Foto: aspect-video, object-cover]     |
| [Overlay gelap jika maintenance]       |
| [Accent bar emas 4px vertikal kiri]    |  <- signature element
| p-5:                                   |
|   [Badge Kategori]  [Badge StatusAset] |
|   [Nama Aset - H3, font bold]          |
|   [MapPin] [Lokasi singkat]            |
|   [Users] [Kapasitas X orang]          |
|   [Divider tipis]                      |
|   [Banknote] [Info tarif / Gratis]     |
|   [Tombol "Lihat Detail" full-width]   |
+----------------------------------------+
```

Spesifikasi detail:
- Container: `bg-white rounded-2xl shadow-md overflow-hidden border border-[#E2E8F0] relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`
- Accent bar: `absolute left-0 top-0 bottom-0 w-1 bg-[#C9A84C] rounded-l-2xl`
- Foto: `w-full aspect-video object-cover`
- Overlay maintenance: `absolute inset-0 bg-[#0D2137]/70 flex flex-col items-center justify-center gap-2`, ikon Wrench putih + teks "Sedang Maintenance"
- Badge Kategori aset desa: `bg-[#0D2137] text-white text-xs font-semibold px-3 py-1 rounded-full`
- Badge Kategori aset banjar: `bg-[#0A5C46] text-white text-xs font-semibold px-3 py-1 rounded-full`
- Nama aset: `text-lg font-bold text-[#0D2137] mt-3 leading-snug`
- Info lokasi dan kapasitas: `flex items-center gap-1.5 text-xs text-[#4A5568]`, ikon size 14px
- Info tarif berbayar: `text-sm font-semibold text-[#0D2137]`, prefix `text-xs text-[#718096]` "Mulai dari"
- Info tarif gratis: `text-sm font-semibold text-[#0A5C46]` teks "Gratis"
- Tombol Lihat Detail: full-width, varian Secondary, mt-4

### 9.2 Badge Status (BadgeStatus.jsx)

Props: `status` (StatusPengajuan | 'tersedia' | 'maintenance' | 'terpakai')

```
[span: flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border]
  [Ikon lucide-react size 12px]
  [Label teks]
```

Warna dari tabel status di bagian 3. Tidak pernah menggunakan emoji.

### 9.3 Tombol (ButtonPrimary.jsx)

Semua tombol: `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed`

| Varian | Class | Hover | Active |
|--------|-------|-------|--------|
| Primary | `bg-[#0D2137] text-white rounded-full px-6 py-2.5 text-sm shadow-md` | `bg-[#1A3A5C] shadow-lg scale-[1.02]` | `scale-[0.97]` |
| Secondary | `border-2 border-[#0D2137] text-[#0D2137] rounded-full px-6 py-2.5 text-sm` | `bg-[#0D2137] text-white` | `scale-[0.97]` |
| Accent | `bg-[#C9A84C] text-[#0D2137] rounded-full px-6 py-2.5 text-sm font-bold shadow-md` | `bg-[#E8C96A] shadow-lg` | `scale-[0.97]` |
| Danger | `bg-[#9B1C1C] text-white rounded-full px-6 py-2.5 text-sm shadow-md` | `bg-[#7F1D1D] shadow-lg` | `scale-[0.97]` |
| Ghost | `text-[#0D2137] underline underline-offset-4 px-2 py-1 text-sm rounded-lg` | `bg-[#E8F0F8]` | `scale-[0.97]` |
| Icon | `p-2 rounded-lg text-[#4A5568]` | `bg-[#F4F7FB] text-[#0D2137]` | `scale-[0.97]` |

State loading: tombol disabled + spinner kecil (LoadingSpinner size xs) di dalam tombol menggantikan ikon.

### 9.4 Input Field

```
[div: flex flex-col gap-1.5]
  [label: text-sm font-semibold text-[#0D2137]]
  [input/textarea/select:
    w-full rounded-lg border border-[#E2E8F0] px-4 py-3 text-sm text-[#0D2137]
    bg-white placeholder:text-[#718096]
    focus:outline-none focus:ring-2 focus:ring-[#0D2137] focus:border-transparent
    transition-all duration-150
  ]
  [p error: text-xs text-[#9B1C1C] flex items-center gap-1 mt-0.5]
    [AlertCircle size 12px] [teks error]
```

State error: `border-[#9B1C1C] bg-[#FEE2E2]/20 focus:ring-[#9B1C1C]`
State disabled: `bg-[#F4F7FB] text-[#718096] cursor-not-allowed border-[#E2E8F0]`
State valid: `border-[#138A68] focus:ring-[#0A5C46]`

File upload area:
```
[div: border-2 border-dashed border-[#CBD5E0] rounded-xl p-8
      flex flex-col items-center gap-3 cursor-pointer
      hover:border-[#C9A84C] hover:bg-[#FDF6E3] transition-all duration-150]
  [Upload ikon size 32px text-[#718096]]
  [span: text-sm font-semibold text-[#0D2137]] "Klik untuk unggah"
  [span: text-xs text-[#718096]] "Format JPG, PNG. Maksimal 5MB."
  [Preview thumbnail jika file sudah dipilih: rounded-lg w-full max-h-48 object-contain]
```

### 9.5 Modal (Modal.jsx)

```
[fixed inset-0 z-50 flex items-center justify-center p-4]
  [Overlay: absolute inset-0 bg-[#0D2137]/60 backdrop-blur-sm]
  [Panel: relative bg-white rounded-[20px] shadow-2xl w-full max-w-md p-6 flex flex-col gap-5]
    [Tombol X tutup: absolute top-4 right-4, varian Icon]
    [Ikon besar di tengah dalam lingkaran bg: size 48px]
    [Judul: H2 text-center]
    [Deskripsi: text-sm text-[#4A5568] text-center]
    [Konten tambahan: textarea, radio, checklist]
    [Row tombol: gap-3, Batal Secondary + Konfirmasi Primary/Danger]
```

Warna lingkaran ikon per tipe modal:
- Approve: `bg-[#E6F4F0]`, ikon CheckCircle `text-[#0A5C46]`
- Reject: `bg-[#FEE2E2]`, ikon XCircle `text-[#9B1C1C]`
- Konfirmasi bayar: `bg-[#FDF6E3]`, ikon CreditCard `text-[#9A7A2E]`
- Paksa batal: `bg-[#FEE2E2]`, ikon AlertTriangle `text-[#9B1C1C]`
- Pengembalian: `bg-[#E8F0F8]`, ikon PackageCheck `text-[#1A3A5C]`

### 9.6 Kalender Ketersediaan (AvailabilityCalendar.jsx)

Container: `bg-white rounded-2xl border border-[#E2E8F0] p-4`

Header navigasi: `flex items-center justify-between mb-4`
- Tombol panah: varian Icon
- Label bulan tahun: `text-sm font-bold text-[#0D2137]`

Grid hari: `grid grid-cols-7 gap-1`
- Label hari (Sen-Min): `text-xs font-semibold text-[#718096] text-center py-1`

Tanggal per kondisi:
- Tersedia: `bg-[#E6F4F0] text-[#0A5C46] font-semibold rounded-full hover:bg-[#0A5C46] hover:text-white cursor-pointer transition-all`
- Terpakai: `bg-[#F3F4F6] text-[#CBD5E0] rounded-full cursor-not-allowed line-through`
- Blacklist: `bg-[#FEE2E2] text-[#9B1C1C] rounded-full cursor-not-allowed` dengan tooltip keterangan
- Dipilih: `bg-[#0D2137] text-white font-bold rounded-full`
- Range dipilih: `bg-[#E8F0F8] text-[#0D2137] rounded-none` (tanggal di antara mulai dan selesai)
- Hari ini: `ring-2 ring-[#C9A84C] ring-offset-1`
- Lampau: `opacity-30 cursor-not-allowed`

### 9.7 KPI Card (KPICard.jsx)

```
[bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-md
 flex items-start justify-between]
  [div]
    [p: text-sm font-medium text-[#4A5568]] Label
    [p: text-3xl font-black text-[#0D2137] mt-1 font-display] Angka
    [p: text-xs text-[#718096] mt-1] Sublabel opsional
  [div: w-12 h-12 rounded-xl flex items-center justify-center bg-[warna]/10]
    [Ikon size 24px text-[warna]]
```

Warna ikon per KPI:
- Pengajuan masuk: `bg-[#E8F0F8]`, ikon FileText `text-[#1A3A5C]`
- Menunggu verifikasi: `bg-[#FEF3C7]`, ikon Clock `text-[#92400E]`
- Disetujui: `bg-[#E6F4F0]`, ikon CheckCircle `text-[#0A5C46]`
- Pemasukan: `bg-[#FDF6E3]`, ikon Banknote `text-[#9A7A2E]`
- Terlambat: `bg-[#FEE2E2]`, ikon AlertTriangle `text-[#9B1C1C]`

### 9.8 Step Indicator (StepIndicator.jsx)

3 langkah dengan garis penghubung horizontal.

```
[Lingkaran] --[Garis]-- [Lingkaran] --[Garis]-- [Lingkaran]
  [Label]                 [Label]                  [Label]
```

Langkah selesai: `bg-[#0A5C46] text-white` lingkaran + ikon Check di dalam
Langkah aktif: `bg-[#0D2137] text-white` lingkaran + angka di dalam + label `font-bold text-[#0D2137]`
Langkah belum: `border-2 border-[#CBD5E0] text-[#718096]` lingkaran + angka
Garis selesai: `bg-[#0A5C46]`
Garis belum: `bg-[#E2E8F0]`
Garis animasi: width dari 0% ke 100% saat langkah aktif berubah, 400ms ease-in-out

### 9.9 Empty State (EmptyState.jsx)

Props: `icon`, `title`, `description`, `actionLabel?`, `onAction?`, `mode?: 'empty' | 'error'`

```
[div: flex flex-col items-center gap-4 py-20 px-8 text-center]
  [div: w-20 h-20 rounded-2xl flex items-center justify-center bg-[#F4F7FB]]
    [Ikon size 40px text-[#718096]] (AlertTriangle merah jika mode error)
  [h3: text-lg font-bold text-[#0D2137]]
  [p: text-sm text-[#4A5568] max-w-sm]
  [Tombol Secondary jika ada actionLabel]
```

Mode error: lingkaran ikon `bg-[#FEE2E2]`, ikon AlertTriangle `text-[#9B1C1C]`

### 9.10 Image Preview (ImagePreview.jsx)

Props: `src`, `alt`, `label?`

Thumbnail di dalam daftar/tabel:
```
[div: relative group w-16 h-16 rounded-lg overflow-hidden border border-[#E2E8F0] cursor-pointer]
  [img: w-full h-full object-cover]
  [Overlay hover: absolute inset-0 bg-[#0D2137]/50 flex items-center justify-center opacity-0 group-hover:opacity-100]
    [ZoomIn ikon putih]
```

Saat diklik, tampilkan modal fullscreen:
```
[fixed inset-0 z-50 bg-[#0D2137]/90 flex items-center justify-center p-4]
  [img: max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl]
  [Tombol X: absolute top-4 right-4 text-white]
  [Label: absolute bottom-4 text-white text-sm font-medium]
```

### 9.11 Kalkulator Biaya (KalkulatorBiaya.jsx)

```
[bg-[#FDF6E3] border border-[#E8C96A] rounded-2xl p-5]
  [Header: Ikon Calculator + "Estimasi Biaya" bold]
  [Divider]
  [Select Banjar Asal]
  [Input Tanggal Mulai + Tanggal Selesai (date picker)]
  [Hasil kalkulasi:]
    [Row: "Durasi" | "X hari"]
    [Row: "Kategori Tarif" | "Lokal / Antar-Banjar / Luar Desa"]
    [Row: "Tarif per Hari" | "Rp X.XXX" atau "Gratis"]
    [Divider]
    [Row bold: "Total Estimasi" | "Rp X.XXX.XXX" dalam JetBrains Mono]
  [Tombol Accent "Ajukan Sekarang" full-width]
```

### 9.12 Pencocokan Data (PencocokkanData.jsx)

Dipakai di detail pengajuan sisi admin saat ada foto KTP.

```
[grid grid-cols-2 gap-4 bg-[#F4F7FB] rounded-2xl p-4 border border-[#E2E8F0]]
  [Kolom kiri: "Foto KTP"]
    [ImagePreview src=fotoKtpUrl]
  [Kolom kanan: "Data yang Diinput Warga"]
    [Row: Label "NIK" | nilai dalam JetBrains Mono]
    [Row: Label "Nama" | nilai]
    [Row: Label "Banjar Asal" | nilai]
    [Row: Label "Nomor HP" | nilai]
  [Banner bawah: bg-[#FEF3C7] rounded-xl p-3]
    [AlertTriangle ikon] "Cocokkan data KTP dengan informasi di sebelah kanan sebelum menyetujui."
```

### 9.13 Tabel Admin (TabelPengajuan.jsx dan TabelAset.jsx)

Header tabel: `bg-[#0D2137] text-white text-xs font-bold uppercase tracking-wide`
Baris: alternating `bg-white` dan `bg-[#F4F7FB]`
Baris hover: `hover:bg-[#E8F0F8] transition-colors duration-100`
Border baris: `border-b border-[#E2E8F0]`

Di mobile (< 640px): tabel kolaps menjadi kartu per baris.
Setiap kartu mobile:
```
[bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm]
  [Row atas: nomorPengajuan mono + BadgeStatus]
  [Nama warga + nama aset]
  [Tanggal]
  [Row aksi di bawah]
```

### 9.14 Template Alasan Tolak (TemplateAlasanTolak.jsx)

Muncul di ModalReject sebelum textarea alasan.

```
[p: text-xs font-semibold text-[#718096] mb-2] "Pilih template atau tulis sendiri:"
[div: flex flex-wrap gap-2]
  [per template: button chip rounded-full px-3 py-1 text-xs border border-[#E2E8F0]
   hover:border-[#0D2137] hover:bg-[#E8F0F8] transition-all]
```

Saat chip diklik, teks template otomatis mengisi textarea alasan.

---

## 10. Layout

### 10.1 Navbar Publik (Navbar.jsx)

Desktop (sticky top, h-16, `bg-white/95 backdrop-blur-md shadow-md`):
```
[Container max-w-7xl mx-auto px-6 flex items-center justify-between h-full]
  [Kiri: Logo PINFAS + nama instansi dari konfigurasi]
  [Tengah: nav links: Katalog | Laporan Publik]
  [Kanan:
    Jika warga belum login:
      Tombol "Lacak Pengajuan" Secondary kecil
      Tombol "Masuk Warga" Ghost kecil
      Tombol "Masuk Admin" Primary kecil
    Jika warga sudah login:
      Tombol "Dashboard Warga" Secondary kecil dengan ikon UserCheck
      Tombol "Keluar" Ghost kecil
      Tombol "Masuk Admin" Primary kecil
  ]
```

Logo PINFAS: teks "PINFAS" font Plus Jakarta Sans weight 900, warna `#0D2137`, dengan titik emas `text-[#C9A84C]` setelah huruf S.

Mobile (sticky top, h-16):
```
[Logo PINFAS] -------- [Search ikon] [Menu hamburger]
```

Drawer mobile: slide dari kanan, `bg-white w-72 h-full shadow-2xl`, berisi menu lengkap, tombol Masuk/Daftar Warga atau Dashboard Warga sesuai sesi, dan tombol Masuk Admin di bagian bawah.

### 10.2 Footer Publik (Footer.jsx)

```
[bg-[#0D2137] text-white]
  [Pattern Patra Punggel subtle di background, opacity 5%]
  [Container py-12 px-6]
    [Grid 3 kolom desktop / stack mobile]
      [Kolom 1: Logo PINFAS + tagline "Pelayanan Aset Publik yang Transparan"]
      [Kolom 2: Informasi instansi dari konfigurasi: nama, alamat, telepon]
      [Kolom 3: Link cepat: Katalog, Lacak Pengajuan, Laporan Publik, Verifikasi Surat]
    [Divider tipis warna white/20]
    [Copyright: text-xs text-white/60 text-center]
```

### 10.3 Admin Sidebar (AdminSidebar.jsx)

Desktop fixed left, `w-64 bg-[#0D2137] h-screen flex flex-col`:
```
[Header p-6: Logo PINFAS putih + nama instansi kecil]
[Garis emas 1px full-width opacity-30]
[Info user p-4: avatar bulat + nama + jabatan text-xs text-white/60]
[Garis emas 1px full-width opacity-30]
[Nav menu flex-1 overflow-y-auto py-4]
  [per item: flex items-center gap-3 px-4 py-2.5 rounded-xl mx-2 text-sm
   text-white/70 hover:bg-white/10 hover:text-white transition-all]
  [item aktif: bg-[#C9A84C]/20 text-[#C9A84C] font-semibold]
[Footer: tombol Keluar p-4 border-t border-white/10]
```

Menu per role:
- Kelian Banjar: Dasbor, Pengajuan, Aset Banjar, Laporan
- Admin Desa: Dasbor, Pengajuan, Aset, Laporan, Konfigurasi, Manajemen Akun
- Lurah: Dasbor, Laporan

Mobile: bottom navigation bar 4 ikon, `bg-[#0D2137] text-white`.

### 10.4 Admin Layout (AdminLayout.jsx)

```
[flex h-screen overflow-hidden]
  [AdminSidebar fixed left]
  [main: flex-1 ml-64 (desktop) / ml-0 (mobile) overflow-y-auto bg-[#F4F7FB]]
    [Header halaman: bg-white border-b border-[#E2E8F0] px-8 py-5]
      [Judul halaman H1 + breadcrumb kecil]
      [Kanan: info role + nama user]
    [Content: px-8 py-6]
      [<Outlet />]
```

---

## 11. Peta Halaman Lengkap

### 11.1 KatalogPage.jsx (/)

```
[Hero Section]
  bg-gradient: linear-gradient(135deg, #0D2137 0%, #1A3A5C 60%, #C9A84C 100%)
  Pattern Patra Punggel subtle di background
  min-h-[480px] flex items-center
  [Container max-w-7xl]
    [Grid 2 kolom desktop: kiri teks, kanan kalkulator]
      Kiri:
        [Badge: "Layanan Publik Digital" bg-[#C9A84C]/20 text-[#C9A84C] rounded-full]
        [H1: "Pinjam Fasilitas Desa dengan Mudah" text-4xl font-black text-white]
        [p: deskripsi singkat text-white/80]
        [Stats row: total aset tersedia | total penyewaan bulan ini | aset terpopuler]
          [per stat: bg-white/10 rounded-xl px-4 py-2 text-center]
      Kanan:
        [KalkulatorBiaya dalam card bg-white/10 backdrop-blur rounded-2xl]

[Section Katalog Aset]
  [FilterBar: sticky, bg-white shadow-sm, filter kategori + status biaya + search]
  [Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6]
    [AssetCard per aset]
  [EmptyState jika tidak ada hasil]
```

### 11.2 DetailAsetPage.jsx (/aset/:id)

```
[Breadcrumb: Katalog > Nama Aset]
[Grid: lg:grid-cols-3 gap-8]
  [Kolom kiri: lg:col-span-2]
    [AssetGallery: carousel foto]
    [Garis emas 3px horizontal]
    [AssetInfo: nama H1, deskripsi, lokasi, kapasitas, syarat ketentuan accordion]
    [ChecklistKondisi: kondisi aset saat ini read-only, per item dengan ikon]
    [Link ke /aset/:id/riwayat: "Lihat riwayat pemakaian aset ini"]
  [Kolom kanan: sticky top-24 flex flex-col gap-4]
    [BadgeStatus aset]
    [TarifCard]
    [KalkulatorBiaya: interaktif langsung terhubung ke form pengajuan]
    [AvailabilityCalendar]
    [Tombol "Ajukan Peminjaman" Primary full-width]
    [Tombol disabled + badge "Sedang Maintenance" jika maintenance]
```

### 11.3 FormPengajuanPage.jsx (/aset/:id/ajukan)

```
[Header: thumbnail aset kecil + nama aset + badge status biaya]
[StepIndicator: Data Diri | Detail Acara | Konfirmasi]
[Card putih rounded-2xl shadow-md p-6]
  Langkah 1 - FormDataDiri:
    NIK (16 digit, validasi Dukcapil, error per karakter)
    Nama Lengkap
    Nomor HP (awali 08, min 10 digit)
    Banjar Asal (select dropdown)
    Estimasi Jumlah Tamu (number, max = kapasitas aset)
  Langkah 2 - FormDetailAcara:
    Keperluan Acara (textarea)
    Tanggal Mulai (date picker, min = H + minimalHariPengajuan)
    Tanggal Selesai (date picker, min = tanggalMulai)
    Durasi otomatis muncul setelah tanggal diisi
    Total biaya otomatis muncul
    Upload Foto KTP (file upload area dengan preview)
  Langkah 3 - FormKonfirmasi:
    PratinjauSurat (pratinjau surat izin yang akan diterbitkan, read-only)
    RingkasanPengajuan (semua data + total biaya dalam JetBrains Mono)
    Info rekening pembayaran dari konfigurasi (jika aset berbayar)
    Upload Bukti Transfer (jika aset berbayar, file upload area)
    Checkbox "Saya menyetujui syarat dan ketentuan"
    Tombol "Kirim Pengajuan" Primary

[Row navigasi bawah: Tombol Kembali Ghost | Tombol Lanjut/Kirim Primary]

[Halaman Sukses setelah submit:]
  [bg-[#E6F4F0] rounded-2xl p-8 text-center]
  [Ikon CheckCircle besar text-[#0A5C46]]
  ["Pengajuan Berhasil Dikirim"]
  [nomorPengajuan dalam JetBrains Mono bg-[#F4F7FB] px-4 py-2 rounded-lg]
  [Tombol "Lacak Status" Primary | Tombol "Kembali ke Katalog" Secondary]
```

### 11.4 LacakStatusPage.jsx (/lacak)

```
[Hero kecil: bg-gradient primary, judul + deskripsi singkat, text-white]
[Container max-w-2xl mx-auto px-4 -mt-8]
  [Card search: bg-white rounded-2xl shadow-lg p-6]
    [Input NIK atau Nomor HP + Tombol "Cari" Primary]
  [Hasil: mt-6 flex flex-col gap-4]
    [Per pengajuan: RingkasanPengajuan card]
      [Header: nomorPengajuan mono + BadgeStatus]
      [Nama aset + tanggal + durasi]
      [Blok kondisional per status - lihat 11.4.1]
      [Tombol Unduh Surat jika approved/selesai]
      [Tombol Batalkan Ghost jika pending]
  [EmptyState jika tidak ditemukan]
```

**11.4.1 Blok kondisional per status di LacakStatusPage:**

Status `menunggu_pembayaran`:
```
[bg-[#FDF6E3] border border-[#E8C96A] rounded-xl p-4]
  [Header: CreditCard ikon + "Selesaikan Pembayaran" font-bold]
  [Info rekening: nama bank, nomor (JetBrains Mono), atas nama]
  [Nominal: "Rp X.XXX.XXX" text-2xl font-black text-[#0D2137] JetBrains Mono]
  [Jika ada catatan_pembayaran:]
    [bg-[#FEE2E2] rounded-lg p-3 text-sm text-[#9B1C1C]]
    "Catatan dari admin: {catatan_pembayaran}"
  [BuktiTransferUpload: area upload file]
  [Tombol "Kirim Bukti Transfer" Accent full-width]
  [text-xs text-[#718096]] "Format JPG, PNG. Maksimal 5MB."
```

Status `menunggu_konfirmasi_bayar`:
```
[bg-[#E8F0F8] border border-[#2E6DA4] rounded-xl p-4]
  [Header: Hourglass ikon + "Bukti Transfer Sedang Diverifikasi"]
  [p: text-sm text-[#4A5568]] "Bukti transfer sedang diverifikasi admin. Proses ini biasanya 1x24 jam."
```

Status `terlambat`:
```
[bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl p-4]
  [Header: AlertTriangle ikon text-[#9B1C1C] + "Aset Terlambat Dikembalikan"]
  [p: text-sm] "Denda keterlambatan: Rp {dendaKeterlambatan}" dalam JetBrains Mono
  [p: text-xs text-[#4A5568]] "Hubungi kantor desa untuk penyelesaian."
```

### 11.5 VerifikasiSuratPage.jsx (/verifikasi/:nomorPengajuan)

```
[Container max-w-lg mx-auto px-4 py-16 text-center]
  [Jika valid:]
    [Ikon ShieldCheck size 64px text-[#0A5C46] dalam lingkaran bg-[#E6F4F0]]
    [H1: "Surat Izin Valid"]
    [Card info: nama peminjam, nama aset, tanggal acara, disetujui oleh]
    [Badge: "Dokumen Resmi PINFAS" bg-[#0D2137] text-[#C9A84C]]
  [Jika tidak valid:]
    [Ikon ShieldX size 64px text-[#9B1C1C] dalam lingkaran bg-[#FEE2E2]]
    [H1: "Surat Izin Tidak Ditemukan"]
    [p: "Nomor pengajuan tidak ditemukan atau surat belum disetujui."]
```

### 11.6 LaporanPublikPage.jsx (/laporan-publik)

```
[Hero kecil gradient primary: "Transparansi Pengelolaan Aset Publik"]
[Container max-w-5xl py-8]
  [Row KPI: Total Pemasukan PADes Bulan Ini | Total Penyewaan | Aset Paling Populer]
  [GrafikTren: line chart tren bulanan 6 bulan, recharts]
  [Tabel ringkas per aset: nama aset, jumlah penyewaan, total pemasukan bulan ini]
  [Keterangan: "Data diperbarui setiap hari. Tidak ada data pribadi warga yang ditampilkan."]
```

### 11.7 WargaAuthPage.jsx (/masuk-warga dan /daftar-warga)

```
[min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4]
  [Card utama: bg-white rounded-2xl shadow-xl p-6 w-full max-w-md]
    [Logo PINFAS kecil]
    [H1 mode masuk: "Masuk sebagai Warga"]
    [H1 mode daftar: "Daftar Akun Warga"]
    [p: text-sm text-[#4A5568]]
      "Akun warga bersifat opsional. Anda tetap bisa mengajukan peminjaman tanpa akun."
    [Form mode daftar:]
      [Input Email]
      [Input Password + toggle Eye/EyeOff]
      [Input NIK]
      [Input Nama Lengkap]
      [Input Nomor HP]
      [Select Banjar Asal]
      [Tombol "Daftar" Primary full-width]
    [Form mode masuk:]
      [Input Email]
      [Input Password + toggle Eye/EyeOff]
      [Tombol "Masuk" Primary full-width]
    [Divider dengan teks "atau"]
    [Tombol "Lanjut Tanpa Akun" Secondary full-width menuju katalog]
    [Link kecil ganti mode: "Belum punya akun? Daftar" / "Sudah punya akun? Masuk"]
```

Catatan desain:
- Jangan membuat login warga terasa wajib.
- Tombol "Lanjut Tanpa Akun" harus setara jelas secara visual, bukan link kecil tersembunyi.
- Error form mengikuti pola Input Field dan EmptyState mode error.

### 11.8 DashboardWargaPage.jsx (/warga)

```
[Hero kecil gradient primary: "Dashboard Warga" + nama warga, text-white]
[Container max-w-5xl py-8]
  [WargaDashboardCard]
    [Profil ringkas: nama, NIK dalam JetBrains Mono, nomor HP, Banjar asal]
    [Tombol "Edit Profil" Ghost jika fitur profil tersedia]
  [Row KPI 4 kartu:]
    Total Pengajuan | Menunggu Verifikasi | Disetujui | Selesai
  [Header section: "Riwayat Pengajuan Saya" + tombol "Ajukan Peminjaman"]
  [WargaRiwayatList]
    [Per item memakai RingkasanPengajuan + BadgeStatus]
    [Aksi sesuai status: Upload Bukti, Unduh Surat, Batalkan jika pending]
  [EmptyState jika belum ada riwayat]
```

Dashboard warga harus terasa sebagai area layanan publik yang ringan, bukan dasbor admin. Gunakan layout publik, bukan AdminSidebar.

### 11.9 LoginPage.jsx (/admin)

```
[min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4]
  [Grid 2 kolom desktop: kiri branding, kanan form]
    Kiri (hidden mobile):
      [bg-gradient #0D2137 ke #C9A84C, rounded-2xl p-12, min-h-[500px]]
      [Pattern Patra Punggel subtle]
      [Logo PINFAS besar putih]
      [Tagline: "Portal Admin Pengelolaan Fasilitas Publik"]
      [3 bullet fitur: ikon + teks singkat]
    Kanan:
      [bg-white rounded-2xl shadow-xl p-8 w-full max-w-md]
      [Logo PINFAS kecil]
      [H1: "Masuk ke Dasbor"]
      [p: text-sm text-[#4A5568]] "Khusus petugas yang berwenang."
      [Form:]
        [Input Email]
        [Input Password + toggle Eye/EyeOff]
        [Error box jika gagal: bg-[#FEE2E2] rounded-xl p-3]
        [Tombol "Masuk" Primary full-width]
      [text-xs text-[#718096] text-center mt-4] "Lupa kata sandi? Hubungi Admin Desa."
```

### 11.10 DasborPage.jsx (/admin/dasbor)

Untuk Kelian Banjar dan Admin Desa:
```
[Header: "Selamat datang, [Nama]" H1 + tanggal hari ini text-[#718096]]
[Row KPI: 5 kartu - Pengajuan Masuk, Menunggu Verifikasi, Menunggu Konfirmasi Bayar, Disetujui Bulan Ini, Pemasukan Bulan Ini]
[Grid 2 kolom: kiri KalenderGabungan, kanan TabelPengajuan filter pending]
```

Untuk Lurah:
```
[Header greeting]
[Row KPI eksekutif: 4 kartu]
[Grid 2 kolom: GrafikTren | GrafikPerBanjar]
[Link ke LaporanPage dan LaporanPublikPage]
```

### 11.11 ManajemenPengajuanPage.jsx (/admin/pengajuan)

```
[Header: judul + jumlah total pengajuan]
[FilterBar canggih: status (multi-select) + aset + tanggal range + search NIK/nama]
[Tombol reset filter Ghost]
[TabelPengajuan: semua kolom + aksi per status]
  [Flag pengajuan mencurigakan: badge merah "NIK berulang" di baris yang dimaksud]
```

### 11.12 KonfigurasiPage.jsx (/admin/konfigurasi)

```
[Tab navigation: Profil Instansi | Rekening | Aturan Peminjaman | Blacklist Tanggal | Template Alasan]
[Per tab: form dengan tombol Simpan di bawah]

Tab Profil Instansi:
  Select tipe instansi (Desa/Kelurahan)
  Input nama instansi
  Textarea alamat
  Input nomor telepon
  Upload logo (preview langsung)

Tab Rekening:
  Input nama bank
  Input nomor rekening (JetBrains Mono)
  Input atas nama

Tab Aturan Peminjaman:
  Number input batas hari gratis lokal
  Number input batas hari gratis luar banjar/desa
  Number input minimal hari pengajuan sebelum acara
  Number input tarif denda per hari untuk aset gratis

Tab Blacklist Tanggal:
  Date picker tambah tanggal + input keterangan + Tombol Tambah
  Daftar tanggal yang sudah diblokir dengan tombol hapus per baris

Tab Template Alasan Tolak:
  List template yang ada + tombol hapus per item
  Input tambah template baru + Tombol Tambah
```

---

## 12. Surat Izin PDF (SuratIzinPDF.jsx)

Layout A4 portrait, margin 2cm semua sisi, font utama Times New Roman atau serif standar.

```
[Header]
  [Flex row: Logo instansi kiri | Teks tengah | kosong kanan]
  Teks tengah:
    PEMERINTAH DESA/KELURAHAN [NAMA INSTANSI] (bold, 14pt)
    [Alamat instansi] (10pt)
    [Nomor telepon] (10pt)
  [Garis tebal 2pt + garis tipis 0.5pt dengan jarak 2px]

[Judul]
  SURAT IZIN PEMINJAMAN FASILITAS (bold, 12pt, center)
  Nomor: [nomorPengajuan] (center, 11pt, JetBrains Mono)

[Spasi 1 baris]

[Paragraf pembuka baku]
  "Yang bertanda tangan di bawah ini, [jabatan admin yang approve] Desa/Kelurahan [nama instansi],
   dengan ini memberikan izin peminjaman fasilitas kepada:"

[Tabel identitas - 2 kolom kiri:kanan = 35:65]
  Nama Lengkap   : [nama]
  NIK            : [nik] (JetBrains Mono)
  Asal Banjar    : [banjarAsal]
  Nomor HP       : [nomorHp]
  Estimasi Tamu  : [estimasiTamu] orang

[Spasi 0.5 baris]
  "Untuk menggunakan fasilitas sebagai berikut:"

[Tabel detail - 2 kolom]
  Nama Fasilitas : [namaAset]
  Lokasi         : [lokasi]
  Keperluan      : [keperluan]
  Tanggal Mulai  : [tanggalMulai format Indonesia]
  Tanggal Selesai: [tanggalSelesai format Indonesia]
  Durasi         : [durasiHari] hari
  Biaya Sewa     : Rp [totalBiaya format Rupiah] / Gratis

[Paragraf penutup baku]
  "Demikian surat izin ini diberikan untuk dipergunakan sebagaimana mestinya."

[Spasi 2 baris]

[Footer - flex row justify-between]
  Kiri:
    [QR Code 80x80px berisi nomorPengajuan]
    [text 8pt] "Scan untuk verifikasi keaslian"
    [text 7pt JetBrains Mono] nomorPengajuan
  Kanan:
    [Nama kota], [tanggal surat format Indonesia]
    [jabatan admin yang approve]
    [spasi 3 baris untuk tanda tangan]
    [garis bawah nama]
    [nama admin yang approve bold]
```

---

## 13. Ikon (lucide-react)

Tidak ada emoji di seluruh antarmuka.

| Konteks | Ikon |
|---------|------|
| Aset Desa/Kelurahan | Building2 |
| Aset Banjar | Home |
| Kalender | Calendar |
| Kalender blokir | CalendarX |
| Lokasi | MapPin |
| Kapasitas/Orang | Users |
| Tarif/Harga | Banknote |
| Kalkulator biaya | Calculator |
| Status pending | Clock |
| Status menunggu pembayaran | CreditCard |
| Status menunggu konfirmasi | Hourglass |
| Status approved | CheckCircle |
| Status rejected | XCircle |
| Status selesai | PackageCheck |
| Status dibatalkan | Ban |
| Status terlambat | AlertTriangle |
| Status terpakai | CalendarX |
| Maintenance | Wrench |
| Download/PDF | FileDown |
| Download Excel | FileSpreadsheet |
| Upload | Upload |
| Lacak | Search |
| Verifikasi valid | ShieldCheck |
| Verifikasi tidak valid | ShieldX |
| Notifikasi | Bell |
| Logout | LogOut |
| Laporan/Statistik | BarChart2 |
| Kelian Banjar | UserCheck |
| Admin Desa | ShieldCheck |
| Lurah | Landmark |
| Tambah | Plus |
| Edit | Pencil |
| Hapus | Trash2 |
| Lihat Detail | Eye |
| Zoom gambar | ZoomIn |
| Approve aksi | Check |
| Reject aksi | X |
| Dasbor | LayoutDashboard |
| Aset/Inventaris | Package |
| Filter | SlidersHorizontal |
| Kembali | ArrowLeft |
| Menu hamburger | Menu |
| Tutup drawer | X |
| Info | Info |
| Alert/Warning | AlertCircle |
| Pengaturan | Settings |
| Rekening | CreditCard |
| Blacklist | CalendarOff |
| Template | FileText |
| Checklist item | ClipboardCheck |
| Flag mencurigakan | Flag |
| Riwayat | History |
| QR Code | QrCode |
| Show password | Eye |
| Hide password | EyeOff |

---

## 14. Loading dan Error State

### 14.1 Loading State

- Halaman pertama kali load: LoadingSpinner fullscreen `fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50`
- Section data (tabel, grid kartu): LoadingSpinner centered di dalam container dengan min-height
- Tombol submit: disabled + spinner kecil (w-4 h-4) menggantikan ikon di dalam tombol
- Skeleton loading untuk kartu aset: `animate-pulse bg-[#E2E8F0] rounded-2xl` dengan proporsi sama

### 14.2 Error State

Gunakan EmptyState.jsx mode error:
- ikon AlertTriangle
- Judul: "Gagal Memuat Data"
- Deskripsi: "Terjadi kesalahan. Coba refresh halaman atau periksa koneksi internet."
- Tombol: "Coba Lagi" memanggil refetch

### 14.3 State Tombol Submit

```
[Tombol disabled saat loading:]
  opacity-70 cursor-not-allowed
  [LoadingSpinner w-4 h-4 animate-spin] + teks "Memproses..."
```

---

## 15. Tone of Voice

- Kalimat aktif: "Ajukan Peminjaman", bukan "Submit Formulir"
- Hindari jargon teknis: "Status Pengajuan", bukan "Request Status"
- Error message memberi arah: "NIK harus terdiri dari 16 digit angka.", bukan "Input tidak valid."
- Empty state mengundang aksi: "Belum ada aset tersedia. Coba ubah filter." dengan tombol reset
- Konfirmasi aksi penting selalu pakai Modal, bukan alert browser atau window.confirm()
- Label tombol konsisten di seluruh aplikasi
- Angka uang selalu format Rupiah lengkap: "Rp 500.000", bukan "500000" atau "Rp500rb"
- Tanggal selalu format Indonesia panjang: "12 Januari 2025", bukan "12/01/2025"

---

## 16. Breakpoint dan Responsivitas

| Nama | Lebar | Tailwind prefix | Target |
|------|-------|-----------------|--------|
| Mobile | < 640px | default | Warga akses katalog dan form |
| Tablet | 640-1024px | sm: md: | Transisi |
| Desktop | > 1024px | lg: xl: | Admin, dasbor |

Halaman publik (/, /aset, /ajukan, /lacak, /verifikasi, /laporan-publik): mobile-first.
Halaman admin (/admin/*): desktop-first dengan fallback mobile yang tetap fungsional.
Sidebar admin di mobile: bottom navigation 4 ikon.
Tabel admin di mobile: kolaps menjadi kartu per baris.
Grid kartu aset: 1 kolom mobile, 2 kolom tablet, 3 kolom desktop.
