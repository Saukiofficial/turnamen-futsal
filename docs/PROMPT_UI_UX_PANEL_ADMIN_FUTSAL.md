# PROMPT IMPLEMENTASI UI/UX PANEL ADMIN FUTSAL

## Instruksi utama untuk AI Agent

Anda bertindak sebagai **Senior Product Designer, Senior UI/UX Designer, dan Frontend Engineer** yang berpengalaman membangun dashboard operasional berskala produksi.

Tugas Anda adalah merancang dan mengimplementasikan ulang **layout global dan seluruh halaman Panel Admin Sistem Pendaftaran dan Seleksi Futsal**. Hasil akhirnya harus terlihat profesional, rapi, konsisten, mudah dipindai, responsif, dan benar-benar bisa digunakan untuk pekerjaan admin sehari-hari.

Jangan hanya mempercantik Dashboard. Buat satu design system dan application shell yang digunakan secara konsisten pada semua halaman berikut:

1. Dashboard
2. Pendaftaran/Event
3. Data Pendaftar
4. Verifikasi Berkas
5. Kartu Peserta
6. Check-in Seleksi
7. Penilaian
8. Hasil Seleksi
9. Pengumuman
10. Laporan
11. Pengguna Admin
12. Audit Log
13. Pengaturan

Gunakan referensi visual dashboard yang diberikan sebagai acuan komposisi, tetapi jangan membuat screenshot statis. Implementasikan menjadi UI nyata, reusable, responsif, dapat menerima data dinamis, dan terhubung dengan struktur aplikasi yang sudah ada.

---

# 1. Aturan sebelum mengubah kode

Sebelum melakukan implementasi:

1. Pelajari struktur project, framework, routing, autentikasi, layout, komponen, model data, dan package yang sudah tersedia.
2. Identifikasi halaman serta fitur yang sudah berjalan.
3. Jangan menghapus fitur, route, validasi, permission, atau integrasi backend yang sudah berfungsi.
4. Jangan mengganti business logic hanya untuk menyesuaikan tampilan.
5. Gunakan data nyata dari backend apabila endpoint/props sudah tersedia. Jangan meninggalkan data dummy pada production flow.
6. Jika data belum tersedia, buat komponen dengan interface/props yang jelas dan gunakan fallback sementara yang mudah diganti.
7. Gunakan komponen reusable. Hindari menulis markup kartu, badge, tabel, modal, dan page header secara berulang.
8. Jangan memasang library baru jika fungsi serupa sudah tersedia dalam project.
9. Jika harus menambah dependency, pilih dependency stabil, ringan, dan kompatibel dengan versi project.
10. Pastikan tidak ada error console, hydration error, route error, atau layout shift yang mengganggu.

Jika project menggunakan Laravel + Inertia React, pertahankan arsitektur tersebut. Gunakan TypeScript jika project sudah menggunakannya. Jangan mengubah seluruh stack tanpa alasan teknis yang kuat.

---

# 2. Arah visual

## 2.1 Karakter desain

Gunakan gaya:

- Modern SaaS dashboard.
- Profesional dan operasional.
- Bersih, tegas, dan tenang.
- Memiliki sedikit karakter olahraga melalui aksen visual, bukan dekorasi berlebihan.
- Padat informasi tetapi tetap mempunyai ruang napas.
- Mengutamakan hierarki, alignment, keterbacaan, dan kecepatan kerja admin.

Hindari:

- AI slop.
- Gradient berlebihan.
- Glassmorphism.
- Glow/neon.
- Ilustrasi 3D acak.
- Ikon emoji.
- Kartu terlalu besar dengan banyak ruang kosong.
- Semua elemen dibuat pill.
- Radius terlalu bulat.
- Bayangan tebal.
- Animasi yang mengganggu pekerjaan.
- Judul sangat besar seperti landing page.
- Terlalu banyak warna dalam satu layar.
- Semua section dibungkus card tanpa alasan.

## 2.2 Palet warna

Gunakan token warna, jangan memasukkan warna acak pada setiap komponen.

### Warna utama

- `--navy-950: #0B1624` — sidebar utama.
- `--navy-900: #0E1B2A` — sidebar surface.
- `--primary-700: #1D4ED8` — hover/pressed primary.
- `--primary-600: #2563EB` — primary action, link, active indicator.
- `--primary-500: #3B82F6` — chart/accent ringan.
- `--primary-50: #EFF6FF` — background elemen aktif ringan.

### Warna netral

- `--page-bg: #F5F7FA` atau `#F6F8FB`.
- `--surface: #FFFFFF`.
- `--text-strong: #0F172A`.
- `--text-default: #334155`.
- `--text-muted: #64748B`.
- `--border: #E2E8F0`.
- `--border-soft: #EDF1F5`.

### Warna status

- Success: teks `#15803D`, background `#DCFCE7`, icon `#16A34A`.
- Warning/pending: teks `#B45309`, background `#FEF3C7`, icon `#D97706`.
- Danger/correction: teks `#B91C1C`, background `#FEE2E2`, icon `#DC2626`.
- Info: teks `#1D4ED8`, background `#DBEAFE`, icon `#2563EB`.
- Neutral: teks `#475569`, background `#F1F5F9`.

Orange dapat digunakan sangat terbatas sebagai aksen identitas futsal. Jangan jadikan orange sebagai warna utama dashboard.

## 2.3 Tipografi

Gunakan **Inter** sebagai font utama. Jika tidak tersedia, gunakan fallback:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Aturan ukuran:

| Elemen | Desktop | Mobile | Weight | Line-height |
|---|---:|---:|---:|---:|
| Page title | 28–30 px | 22–24 px | 700 | 1.2 |
| Section title | 18 px | 17 px | 650–700 | 1.35 |
| Card title | 14–16 px | 14–15 px | 600 | 1.4 |
| KPI value | 28–32 px | 24–28 px | 700 | 1.1 |
| Body | 14 px | 14 px | 400–500 | 1.5 |
| Small/meta | 12–13 px | 12 px | 400–500 | 1.4 |
| Table header | 12 px | — | 600 | 1.3 |

Ketentuan:

- Gunakan tabular numbers untuk angka KPI, kuota, dan laporan jika tersedia.
- Jangan gunakan weight 800/900 untuk terlalu banyak elemen.
- Jangan gunakan uppercase untuk paragraf dan menu.
- Uppercase hanya untuk label sangat kecil apabila benar-benar diperlukan.
- Gunakan maksimal tiga level ukuran teks dominan dalam satu card.

## 2.4 Radius, border, dan shadow

- Card utama: radius 12 px.
- Input/button: radius 8–10 px.
- Modal/drawer: radius 14–16 px.
- Badge: radius 999 px hanya untuk status pendek.
- Border card: 1 px solid `#E2E8F0`.
- Shadow card default sangat halus atau tanpa shadow.
- Gunakan shadow ringan hanya pada dropdown, modal, popover, sticky header, dan floating mobile action.

Contoh shadow ringan:

```css
box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.03);
```

---

# 3. Sistem spacing dan grid

Gunakan skala spacing konsisten:

- 4 px: jarak mikro/icon.
- 8 px: jarak label dengan data.
- 12 px: jarak antar-elemen compact.
- 16 px: padding kontrol/card kecil.
- 20 px: gap card umum.
- 24 px: padding card desktop dan gap section.
- 32 px: jarak antar-section utama.

## Container halaman

- Desktop besar: content fluid dengan max-width sekitar 1600 px.
- Padding desktop: 28–32 px.
- Padding tablet: 20–24 px.
- Padding mobile: 16 px.
- Jangan membuat konten terlalu sempit pada monitor lebar.
- Gunakan CSS Grid 12 kolom pada dashboard desktop.

Breakpoints acuan:

- Mobile kecil: 360–479 px.
- Mobile besar: 480–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024–1439 px.
- Desktop besar: 1440 px ke atas.

---

# 4. Application shell / layout global

## 4.1 Sidebar desktop

Ukuran:

- Lebar normal: 248 px.
- Lebar collapsed: 76 px.
- Posisi fixed di kiri, tinggi penuh viewport.
- Background deep navy `#0E1B2A`.
- Sidebar memiliki scroll sendiri jika tinggi layar tidak cukup.

Bagian sidebar:

1. Brand/logo di atas, tinggi sekitar 72 px.
2. Menu utama.
3. Separator tipis.
4. Menu administrasi.
5. Area identitas/version kecil di bawah bila diperlukan.

Brand:

- Gunakan logo bola futsal/perisai sederhana.
- Teks `FutsalReg` atau nama aplikasi aktual.
- Logo 36–40 px.
- Nama aplikasi 18–20 px, weight 700.
- Jangan membuat logo terlalu besar.

Menu:

- Tinggi item 42–44 px.
- Padding horizontal 12 px.
- Gap icon dan label 12 px.
- Icon 18–20 px.
- Label 14 px, weight 500.
- Warna normal `#CBD5E1`.
- Hover background putih dengan opacity rendah.
- Active background primary blue, teks putih, icon putih.
- Active item boleh memiliki inset highlight tipis, tetapi tanpa glow.
- Setiap item harus memiliki tooltip ketika sidebar collapsed.
- Item dengan submenu menggunakan chevron dan animasi tinggi singkat.

Urutan menu dan ikon Lucide:

| Menu | Ikon Lucide |
|---|---|
| Dashboard | `LayoutDashboard` |
| Pendaftaran/Event | `ClipboardList` atau `CalendarRange` |
| Data Pendaftar | `Users` |
| Verifikasi Berkas | `BadgeCheck` atau `FileCheck2` |
| Kartu Peserta | `CreditCard` |
| Check-in Seleksi | `ScanLine` |
| Penilaian | `ChartNoAxesColumnIncreasing` atau `BarChart3` |
| Hasil Seleksi | `Trophy` |
| Pengumuman | `Megaphone` |
| Laporan | `FileBarChart` |
| Pengguna Admin | `UserCog` |
| Audit Log | `History` |
| Pengaturan | `Settings` |

Gunakan satu library icon outline yang konsisten, disarankan **Lucide React**. Jangan mencampur Lucide, Font Awesome, emoji, dan icon fill dalam satu aplikasi.

## 4.2 Top header desktop

- Fixed/sticky di atas area konten.
- Tinggi 64–68 px.
- Background putih.
- Border-bottom 1 px.
- Posisi dimulai setelah sidebar.
- Z-index cukup agar dropdown tidak tertutup.

Bagian kiri:

- Breadcrumb singkat, contoh `Dashboard / Seleksi Futsal 2026`.
- Breadcrumb tidak lebih dominan daripada page title.

Bagian kanan:

- Event selector.
- Global search icon atau search field ringkas.
- Notification button dengan unread counter.
- Separator vertikal tipis.
- Avatar admin 32–36 px.
- Nama dan role admin.
- Chevron dropdown.

Dropdown admin berisi Profil, Pengaturan Akun, dan Keluar.

## 4.3 Mobile header

- Tinggi 58–64 px.
- Tombol hamburger di kiri.
- Logo/nama singkat di tengah atau setelah hamburger.
- Notification dan avatar ringkas di kanan.
- Sidebar menjadi drawer dari kiri, lebar maksimal 86vw atau 320 px.
- Drawer memiliki overlay gelap ringan dan dapat ditutup dengan swipe/escape/click overlay.
- Jangan menampilkan breadcrumb panjang di mobile.

## 4.4 Main content

- Desktop: margin-left mengikuti sidebar.
- Tablet: sidebar collapsed secara default atau drawer.
- Mobile: tanpa margin kiri.
- Content dimulai di bawah top header.
- Jaga min-height penuh dan background page abu-abu sangat muda.

---

# 5. Komponen global reusable

Buat komponen berikut atau sesuaikan komponen yang sudah tersedia:

- `AdminShell`
- `Sidebar`
- `TopHeader`
- `MobileNavigationDrawer`
- `PageHeader`
- `Breadcrumbs`
- `EventSelector`
- `StatCard`
- `StatusBadge`
- `SectionCard`
- `ChartCard`
- `DataTable`
- `MobileRecordCard`
- `FilterBar`
- `SearchInput`
- `DateRangePicker`
- `EmptyState`
- `ErrorState`
- `SkeletonState`
- `Pagination`
- `ConfirmDialog`
- `FormDrawer`
- `DetailDrawer`
- `FilePreviewModal`
- `Toast/Notification`
- `PermissionGate`

Semua komponen harus mempunyai:

- Variant yang terbatas dan konsisten.
- Loading state.
- Disabled state.
- Focus-visible state.
- Error state jika relevan.
- Responsif.
- Accessible label.

---

# 6. Page header standar

Setiap halaman memakai pola header yang sama:

### Kiri

- Breadcrumb kecil bila diperlukan.
- Judul halaman.
- Deskripsi maksimal satu atau dua baris.

### Kanan

- Secondary action.
- Primary action.
- Pada mobile, action yang tidak utama masuk overflow menu.

Contoh Dashboard:

- Judul: `Dashboard Pendaftaran`
- Deskripsi: `Pantau pendaftar dan proses seleksi dalam satu tempat.`
- Secondary: `Buka Pendaftaran` atau `Tutup Pendaftaran`, sesuai status.
- Primary: `Buat Pendaftaran Baru`.

Aturan:

- Tinggi button 40–42 px desktop dan 44 px mobile.
- Primary button menggunakan `PlusCircle` atau `Plus`, bukan icon dekoratif.
- Jangan meletakkan lebih dari dua button besar di header.
- Jika layar sempit, button utama full-width di bawah title atau gunakan sticky action bawah sesuai konteks.

---

# 7. Dashboard utama

Dashboard adalah halaman pemantauan, bukan halaman dekoratif. Semua data harus menjawab kondisi operasional admin.

## 7.1 Urutan section

1. Page header.
2. Event status strip.
3. Empat KPI cards.
4. Grafik Tren Pendaftaran dan Kuota Posisi.
5. Tabel Pendaftar Terbaru dan Aktivitas Terbaru.
6. Opsional: ringkasan asal sekolah atau status seleksi jika data tersedia.

## 7.2 Event status strip

Buat satu horizontal status bar tepat di bawah page header.

Desktop:

- Tinggi 54–58 px.
- Satu baris.
- Background putih.
- Border 1 px.
- Radius 12 px.
- Padding horizontal 18–20 px.
- Dibagi menjadi beberapa kelompok dengan separator vertikal.

Isi:

1. Dot hijau dan teks `Pendaftaran Dibuka`.
2. Icon `CalendarDays`, tanggal `01–30 Oktober 2026`.
3. `127 / 200 peserta` dan progress bar.
4. Icon `Clock3`, teks `12 hari tersisa`.

Mobile:

- Ubah menjadi card dua baris.
- Status dan sisa hari berada di baris pertama.
- Tanggal serta progress kuota di bawah.
- Jangan memaksa semua informasi dalam satu baris sempit.

## 7.3 KPI cards

Desktop besar:

- Empat kartu sejajar, masing-masing span 3 dari 12 kolom.
- Tinggi sekitar 108–116 px.
- Padding 18–20 px.

Tablet:

- Grid dua kolom.

Mobile:

- Grid satu kolom atau dua kolom jika lebar memungkinkan.
- Jika dua kolom, sederhanakan secondary text dan jangan mengecilkan angka secara berlebihan.

Struktur setiap card:

- Icon tile 48–52 px di kiri.
- Icon 22–24 px.
- Label 13–14 px medium.
- Angka 28–32 px bold.
- Meta/trend 12–13 px di bawah.

Kartu:

1. **Total Pendaftar**
   - Icon `Users`.
   - Tile biru muda.
   - Nilai contoh `127`.
   - Meta hijau dengan `TrendingUp`: `+18 minggu ini`.

2. **Menunggu Verifikasi**
   - Icon `Clock3`.
   - Tile amber muda.
   - Nilai contoh `23`.
   - Meta `18,1% dari total`.

3. **Lolos Administrasi**
   - Icon `CircleCheckBig`.
   - Tile hijau muda.
   - Nilai contoh `89`.
   - Meta `70,1% dari total`.

4. **Perlu Perbaikan**
   - Icon `TriangleAlert`.
   - Tile merah muda.
   - Nilai contoh `15`.
   - Meta `11,8% dari total`.

Jangan memberi warna background penuh pada seluruh card. Warna hanya pada icon tile, angka/meta penting, atau status.

## 7.4 Grafik Tren Pendaftaran

Posisi:

- Desktop: span 8 dari 12 kolom.
- Tinggi card sekitar 320–360 px.
- Di kanan terdapat Kuota Posisi span 4 kolom.
- Tablet: kedua card dapat stack atau proporsi 7/5 bila masih terbaca.
- Mobile: stack satu kolom, chart dapat horizontal scroll hanya jika benar-benar diperlukan.

Header chart:

- Kiri: icon `ChartNoAxesCombined`, judul `Tren Pendaftaran`.
- Kanan: dropdown periode `14 Hari Terakhir`.
- Opsional toggle harian/mingguan bila datanya tersedia.

Gunakan line/area chart dengan spesifikasi:

- Disarankan Recharts jika project belum memiliki chart library.
- Satu line utama biru `#2563EB`.
- Stroke width 2–2.5 px.
- Dot kecil 3–4 px, active dot 5–6 px.
- Area fill gradient sangat tipis dari biru opacity 0.16 ke 0.
- Grid horizontal `#E8EEF5`.
- Kurangi grid vertikal agar chart tidak terlalu ramai.
- X-axis berisi tanggal pendek seperti `17 Okt`.
- Y-axis dimulai dari 0.
- Tooltip putih, border tipis, radius 8 px, shadow ringan.
- Tooltip menampilkan tanggal dan jumlah pendaftar.
- Angka dan label harus berasal dari data backend.
- Bila data kosong, jangan tampilkan garis palsu; tampilkan EmptyState dengan icon chart dan teks yang jelas.
- Bila loading, tampilkan skeleton yang menyerupai area chart.

Accessibility:

- Sediakan ringkasan tekstual untuk data utama.
- Warna bukan satu-satunya pembeda.

## 7.5 Card Kuota Posisi

Header:

- Icon `UsersRound`.
- Judul `Kuota Posisi`.
- Opsional link `Kelola Kuota`.

Daftar posisi:

- Goalkeeper `8 / 12`.
- Anchor `24 / 35`.
- Flank `52 / 80`.
- Pivot `43 / 73`.

Tata letak per item:

- Label posisi di kiri.
- Angka terisi/kuota di kanan.
- Progress bar di bawah atau tengah.
- Persentase kecil di paling kanan bila ruang cukup.
- Tinggi progress 8 px.
- Track `#E8EEF5`.
- Radius penuh hanya untuk progress bar.
- Gunakan warna konsisten dan tetap terbaca, tetapi jangan seperti pelangi. Biru sebagai default; variasi warna ringan hanya untuk membedakan posisi.
- Jika kuota mencapai 90%, gunakan indikator warning.
- Jika penuh, tampilkan label `Penuh`.

## 7.6 Pendaftar Terbaru

Desktop:

- Span 8–9 kolom.
- Card tabel dengan header.
- Jangan membuat tabel terlalu sempit.

Header card:

- Icon `Users`.
- Judul `Pendaftar Terbaru`.
- Search field `Cari nama, sekolah, atau nomor...`.
- Button `Filter` dengan icon `ListFilter`.
- Link `Lihat Semua` bila diperlukan.

Kolom:

1. Peserta: avatar/foto 34–36 px, nama, usia kecil.
2. Nomor: contoh `FTS-2026-000127`.
3. Asal Sekolah.
4. Posisi.
5. Tanggal Daftar dan jam.
6. Status.
7. Aksi: `Ellipsis`.

Aturan tabel:

- Header background `#F8FAFC`.
- Header 12 px semibold.
- Row tinggi 58–64 px.
- Divider tipis.
- Hover sangat halus.
- Nama peserta 13–14 px semibold.
- Secondary 12 px muted.
- Action menu berisi Lihat Detail, Verifikasi, Preview Kartu, Cetak, dan tindakan sesuai permission.
- Jangan menampilkan NIK penuh.
- Kolom tidak penting dapat disembunyikan bertahap pada tablet.

Mobile:

- Jangan memaksa tabel tujuh kolom.
- Ubah menjadi `MobileRecordCard`.
- Setiap card menampilkan foto, nama, nomor, sekolah, posisi, status, tanggal, serta button `Lihat Detail`.
- Search dan filter berada di atas.
- Filter mobile dibuka sebagai bottom sheet/drawer.

## 7.7 Aktivitas Terbaru

Desktop:

- Span 3–4 kolom di kanan tabel.
- Judul `Aktivitas Terbaru` dengan icon `Clock3`.
- Link `Lihat Semua`.

Setiap aktivitas:

- Icon tile kecil 34–38 px.
- Kalimat aktivitas maksimal dua baris.
- Waktu relatif di kanan atau bawah.
- Gunakan icon sesuai aksi: `FileCheck2`, `UserPlus`, `RefreshCw`, `Printer`, `Megaphone`.
- Garis timeline vertikal boleh digunakan secara sangat halus.
- Maksimal 5–6 aktivitas pada dashboard.

Mobile:

- Letakkan setelah daftar pendaftar.
- Jangan membuat tinggi tetap.

---

# 8. Halaman Pendaftaran/Event

Tujuan: mengelola banyak periode pendaftaran.

## Layout

- Page header dengan tombol `Buat Pendaftaran Baru`.
- Filter status berbentuk tabs sederhana: Semua, Draft, Dibuka, Dijeda, Ditutup, Diarsipkan.
- Search dan filter tahun.
- Desktop menggunakan tabel atau list row yang padat, bukan grid card besar untuk semua event.
- Event aktif boleh mendapat satu featured summary card di atas.

Kolom:

- Nama event.
- Periode.
- Kuota.
- Jumlah pendaftar.
- Status.
- Waktu terakhir diperbarui.
- Aksi.

Aksi:

- Lihat.
- Edit.
- Buka/jeda/tutup.
- Duplikasi.
- Arsipkan.

Form buat/edit event:

- Gunakan halaman penuh atau form bertahap, bukan modal kecil.
- Kelompokkan: Informasi Dasar, Jadwal, Kuota, Persyaratan, Dokumen, Kartu, Penilaian, Publikasi.
- Sediakan sticky footer `Simpan Draft` dan `Simpan & Lanjutkan`.
- Di mobile, form satu kolom dan footer action tidak menutupi field.

---

# 9. Halaman Data Pendaftar

Gunakan pola data management yang kuat:

- Header dan primary action bila diperlukan.
- Summary mini: total hasil filter, terpilih, menunggu, dan terverifikasi.
- Search lebar.
- Filter event, sekolah, posisi, status, tanggal, kehadiran.
- Button reset filter.
- Tabel server-side pagination.
- Bulk action bar muncul hanya saat row dipilih.

Desktop:

- Sticky table header bila daftar panjang.
- Checkbox selection.
- Column visibility control.
- Pagination dan jumlah per halaman.

Tablet:

- Sembunyikan kolom sekunder seperti jam atau usia.
- Detail dapat dibuka melalui side drawer.

Mobile:

- Card list.
- Filter bottom sheet.
- Bulk selection tetap mungkin tetapi tidak mengacaukan navigasi.

Empty state harus menjelaskan apakah belum ada peserta atau filter tidak menemukan hasil.

---

# 10. Halaman Detail Pendaftar

Desktop menggunakan layout dua kolom:

### Kolom kiri, lebar 300–340 px

- Foto 3×4.
- Nama peserta.
- Nomor pendaftaran.
- Status badge.
- Posisi.
- Quick actions: Preview Kartu, Cetak, Ubah Status.
- QR preview kecil bila berwenang.

### Kolom kanan, fleksibel

Gunakan tabs:

- Biodata.
- Sekolah.
- Data Futsal.
- Berkas.
- Verifikasi.
- Penilaian.
- Riwayat.

Tampilkan data dengan description list dua kolom, bukan card terpisah untuk setiap field.

Mobile:

- Foto dan identitas ringkas di atas.
- Tabs menjadi horizontal scroll atau dropdown section.
- Action utama dapat menjadi sticky bottom bar.

NIK harus dimasking. Tombol reveal hanya ada untuk permission khusus, membutuhkan tindakan eksplisit, dan tercatat pada audit log bila backend mendukung.

---

# 11. Halaman Verifikasi Berkas

Desktop gunakan workspace verifikasi tiga area jika ruang memungkinkan:

1. Kiri: antrean peserta, 280–320 px.
2. Tengah: preview dokumen besar.
3. Kanan: checklist verifikasi, status, dan catatan, 320–360 px.

Jika layar kurang lebar, gunakan dua kolom dan buka checklist sebagai drawer.

Fitur:

- Navigasi peserta sebelumnya/berikutnya.
- Preview foto, kartu pelajar, KTP/KK, dan dokumen.
- Zoom, rotate, download sesuai permission.
- Checklist setiap dokumen.
- Pilihan Terima, Perlu Perbaikan, Tolak.
- Catatan wajib untuk perbaikan/penolakan.
- Shortcut keyboard opsional untuk operator cepat.

Mobile:

- Urutan: identitas → preview → checklist → tindakan.
- Jangan meletakkan tiga panel berdampingan.
- Preview file full-screen modal.

---

# 12. Halaman Kartu Peserta

- Filter event dan status kelayakan.
- Search peserta.
- Kiri/atas: daftar peserta.
- Kanan/bawah: preview kartu.
- Pilihan ukuran ID card, A6, atau layout A4 sesuai fitur.
- Action: Unduh PDF, Cetak, Cetak Terpilih.
- Preview harus mempertahankan rasio nyata.
- Jangan menampilkan NIK pada kartu.
- Gunakan skeleton saat PDF/preview dibuat.

Pada mobile, preview berada di halaman/detail penuh dan action ditempatkan di bawah preview.

---

# 13. Halaman Check-in Seleksi

Prioritaskan kecepatan penggunaan di lokasi seleksi.

Layout desktop/tablet:

- Area scanner QR yang jelas.
- Input nomor peserta manual.
- Card hasil scan berisi foto, nama, nomor, posisi, sesi, status.
- Tombol besar `Konfirmasi Hadir`.
- Panel ringkas statistik hadir, belum hadir, terlambat.
- Daftar check-in terbaru.

Gunakan icon `ScanLine`, `Keyboard`, `CircleCheckBig`, dan `Clock3`.

Mobile:

- Scanner menjadi fokus utama.
- Tombol minimal tinggi 48 px.
- Kamera tidak terpotong.
- Sediakan fallback input manual jika izin kamera ditolak.
- Setelah berhasil, tampilkan feedback jelas tetapi jangan mengandalkan suara saja.

---

# 14. Halaman Penilaian

- Event dan sesi selector.
- Daftar peserta di kiri atau tabel.
- Form penilaian di kanan/detail.
- Kriteria ditampilkan sebagai row terstruktur, bukan banyak card besar.
- Gunakan numeric input atau segmented scale yang accessible.
- Tampilkan bobot dan batas nilai.
- Catatan pelatih berupa textarea.
- Footer action `Simpan Draft` dan `Kirim Penilaian`.
- Ringkasan total nilai selalu terlihat tanpa menutupi konten.

Mobile:

- Satu peserta per layar.
- Navigasi Sebelumnya/Berikutnya.
- Sticky summary dan action di bawah.
- Input nilai harus mudah disentuh.

---

# 15. Halaman Hasil Seleksi

- Summary hasil: Lolos, Cadangan, Tidak Lolos, Belum Diputuskan.
- Filter posisi dan status.
- Tabel ranking/hasil dengan score jika digunakan.
- Bulk action untuk menetapkan status dengan confirmation dialog.
- Button `Publikasikan Hasil` hanya untuk role berwenang.
- Tampilkan timestamp publikasi dan admin penerbit.
- Gunakan warna status secara konsisten.
- Jangan membuat ranking publik bila business rule tidak mengizinkan.

---

# 16. Halaman Pengumuman

- List/table judul, target audience, event, status, jadwal publikasi, penulis.
- Editor pengumuman di halaman penuh atau drawer besar.
- Status Draft, Terjadwal, Dipublikasikan, Diarsipkan.
- Preview desktop/mobile sebelum publikasi.
- Gunakan icon `Megaphone`, `CalendarClock`, `Eye`, `Archive`.

---

# 17. Halaman Laporan

Jangan membuat laporan sebagai kumpulan kartu dekoratif.

Struktur:

- Filter global di atas: event, periode, sekolah, posisi, status.
- KPI ringkas.
- Grafik yang relevan.
- Tabel rekap.
- Action Export Excel dan Export PDF.

Grafik yang diperbolehkan:

- Line chart tren pendaftaran.
- Horizontal bar distribusi posisi/sekolah.
- Donut hanya untuk komposisi status sederhana maksimal 4–5 kategori.

Aturan chart:

- Legend jelas.
- Tooltip konsisten.
- Jangan memakai chart 3D.
- Jangan menampilkan pie chart untuk data dengan banyak kategori.
- Berikan empty state bila data tidak tersedia.

---

# 18. Halaman Pengguna Admin

- Tabel avatar, nama, email, role, status, login terakhir, aksi.
- Filter role dan status.
- Form tambah/edit menggunakan drawer lebar 440–520 px desktop.
- Pada mobile drawer menjadi full-screen sheet.
- Permission dikelompokkan berdasarkan modul.
- Dangerous action dipisahkan secara visual dan meminta konfirmasi.

---

# 19. Halaman Audit Log

- Tabel padat dan mudah dipindai.
- Filter pengguna, aksi, modul, event, dan tanggal.
- Row menampilkan actor, tindakan, target, timestamp, dan IP bila tersedia.
- Detail perubahan dibuka dalam drawer dengan tampilan before/after.
- Jangan menampilkan raw JSON langsung tanpa formatting.
- Data sensitif harus tetap dimasking.

---

# 20. Halaman Pengaturan

Gunakan layout settings dengan navigasi section di kiri pada desktop dan dropdown/tabs di mobile:

- Identitas Aplikasi.
- Penyelenggara.
- Pendaftaran Default.
- Format Nomor Peserta.
- Upload dan Berkas.
- Kartu Peserta.
- Notifikasi.
- Keamanan.
- Backup dan Retensi Data.

Form menggunakan label di atas input. Help text pendek di bawah input. Jangan memakai placeholder sebagai pengganti label.

Action `Simpan Perubahan` dapat sticky ketika form panjang, tetapi harus memberi ruang agar field terakhir tidak tertutup.

---

# 21. Form, input, dan validasi

- Tinggi input desktop 40–42 px; mobile 44–48 px.
- Label 13–14 px semibold.
- Help text 12–13 px muted.
- Error text merah 12–13 px dengan icon `CircleAlert` bila perlu.
- Required indicator konsisten.
- Focus ring 2 px primary dengan offset yang jelas.
- Dropdown panjang harus searchable.
- Date picker tidak boleh bergantung hanya pada input manual.
- File upload menggunakan dropzone yang sederhana, bukan area dekoratif raksasa.
- Tampilkan nama, ukuran, preview, progres, success/error, dan tombol hapus/ganti.
- Untuk foto 3×4, sediakan crop modal dengan rasio terkunci 3:4.
- Form panjang dibagi menjadi section logis.
- Jangan meletakkan lebih dari dua kolom field pada desktop; mobile selalu satu kolom.

---

# 22. Button, badge, dan icon

## Button

Variant:

- Primary: blue solid.
- Secondary: white, gray border.
- Ghost: transparent.
- Danger: red, hanya untuk destructive action.
- Link: text only untuk tindakan kecil.

Aturan:

- Icon kiri 16–18 px.
- Gap 8 px.
- Teks jelas: `Simpan Perubahan`, bukan hanya `OK`.
- Loading mengganti icon dengan spinner dan mempertahankan lebar button.
- Icon-only button wajib memiliki tooltip dan aria-label.

## Badge

- Tinggi 24–26 px.
- Padding horizontal 8–10 px.
- Font 11–12 px semibold.
- Icon opsional 12–14 px.
- Gunakan mapping status terpusat agar warna tidak berbeda antarhalaman.

## Icon

- Gunakan Lucide outline.
- Ukuran default 18 px.
- Ukuran sidebar 19–20 px.
- Ukuran icon tile KPI 22–24 px.
- Stroke width konsisten sekitar 1.75–2.
- Jangan memakai icon hanya sebagai dekorasi tanpa makna.

---

# 23. Modal, drawer, dropdown, dan feedback

- Modal digunakan untuk konfirmasi atau tugas singkat.
- Drawer digunakan untuk detail/filter/form menengah.
- Halaman penuh digunakan untuk form panjang dan workflow kompleks.
- Jangan menaruh form event lengkap dalam modal kecil.
- Modal konfirmasi destructive menampilkan nama target dan konsekuensi.
- Dropdown tidak boleh terpotong container dengan overflow.
- Toast diletakkan konsisten di kanan atas desktop dan atas/bawah aman pada mobile.
- Toast success singkat; error menetap cukup lama agar dapat dibaca.
- Setelah mutasi berhasil, perbarui UI tanpa full reload bila arsitektur memungkinkan.

---

# 24. Loading, empty, error, dan permission states

Setiap halaman wajib memiliki:

## Loading

- Skeleton mengikuti bentuk konten.
- Jangan menggunakan satu spinner besar untuk seluruh dashboard jika section dapat dimuat terpisah.

## Empty

- Icon outline sederhana.
- Judul yang menjelaskan kondisi.
- Deskripsi satu kalimat.
- CTA hanya jika pengguna dapat melakukan tindakan.

## Error

- Jelaskan apa yang gagal.
- Tombol Coba Lagi.
- Jangan menampilkan stack trace kepada user.

## No permission

- Icon `ShieldAlert`.
- Teks bahwa pengguna tidak memiliki izin.
- Link kembali ke halaman aman.

---

# 25. Responsivitas wajib

Implementasi tidak dianggap selesai hanya karena tidak overflow. Susunan informasi harus benar-benar beradaptasi.

## Desktop 1440 px ke atas

- Sidebar expanded 248 px.
- Header penuh.
- Dashboard 12-column grid.
- KPI empat kolom.
- Chart 8/4.
- Pendaftar/Aktivitas 8/4 atau 9/3.

## Desktop 1024–1439 px

- Sidebar dapat collapsed.
- Padding 24 px.
- KPI tetap empat kolom jika muat; jika tidak, dua kolom.
- Kurangi kolom tabel sekunder sebelum mengecilkan font.

## Tablet 768–1023 px

- Sidebar collapsed atau drawer.
- Header ringkas.
- KPI dua kolom.
- Chart stack atau proporsi yang masih terbaca.
- Filter kompleks dalam drawer.
- Detail peserta dapat memakai drawer/full page.

## Mobile 360–767 px

- Drawer navigation.
- Padding 16 px.
- Page title 22–24 px.
- Page actions wrap atau primary full-width.
- KPI satu atau dua kolom sesuai lebar.
- Chart full-width dengan tinggi 260–300 px.
- Tabel berubah menjadi card list.
- Filter menjadi bottom sheet.
- Modal besar menjadi full-screen sheet.
- Form satu kolom.
- Action penting mudah dijangkau ibu jari.
- Gunakan safe-area inset untuk sticky bottom action.
- Tidak boleh ada horizontal overflow pada body.

Uji pada ukuran minimal:

- 360×800.
- 390×844.
- 768×1024.
- 1024×768.
- 1366×768.
- 1440×900.

---

# 26. Animasi dan interaksi

Gunakan animasi secukupnya:

- Hover/focus: 120–160 ms.
- Drawer/modal: 180–240 ms.
- Sidebar collapse: 200–240 ms.
- Chart dapat animate sekali ketika load, maksimal sekitar 500 ms.
- Angka KPI boleh count-up ringan hanya jika tidak mengganggu dan menghormati reduced motion.

Jangan gunakan:

- Bounce.
- Parallax.
- Card melayang terus-menerus.
- Glow pulse.
- Animasi entrance pada setiap row tabel.
- Transisi panjang.

Hormati `prefers-reduced-motion`.

---

# 27. Accessibility

- Semua interactive element dapat digunakan dengan keyboard.
- Gunakan semantic HTML.
- Focus visible tidak boleh dihilangkan.
- Icon-only action memiliki aria-label.
- Form memiliki label nyata.
- Error terhubung ke input.
- Kontras teks dan kontrol memadai.
- Status tidak dibedakan hanya dengan warna.
- Modal mengunci fokus dan mengembalikan fokus saat ditutup.
- Drawer dapat ditutup dengan Escape.
- Chart memiliki ringkasan data tekstual.

---

# 28. Performa

- Gunakan pagination server-side pada tabel besar.
- Debounce search sekitar 300–400 ms.
- Lazy load preview file besar.
- Gunakan thumbnail untuk foto peserta.
- Jangan mengirim gambar asli ke tabel.
- Hindari rerender seluruh dashboard ketika hanya filter satu widget berubah.
- Gunakan memoization hanya pada bagian yang benar-benar membutuhkan.
- Jangan menjalankan query terpisah per row.
- Sediakan optimistic update hanya pada aksi yang aman.

---

# 29. Struktur komponen yang disarankan

Sesuaikan nama folder dengan konvensi project, tetapi jaga pemisahan tanggung jawab:

```text
components/
  admin/
    layout/
      AdminShell
      Sidebar
      TopHeader
      MobileNavDrawer
      PageHeader
    dashboard/
      EventStatusStrip
      DashboardStats
      RegistrationTrendChart
      PositionQuotaCard
      RecentApplicants
      RecentActivity
    data-display/
      DataTable
      MobileRecordCard
      StatusBadge
      DescriptionList
      Pagination
    filters/
      FilterBar
      FilterDrawer
      SearchInput
      DateRangeFilter
    feedback/
      EmptyState
      ErrorState
      Skeletons
    overlays/
      ConfirmDialog
      DetailDrawer
      FilePreviewModal
    forms/
      FormSection
      FileUpload
      PhotoCropper
```

Jangan memaksakan struktur ini jika project sudah mempunyai arsitektur komponen yang baik. Integrasikan secara konsisten dengan struktur yang ada.

---

# 30. Data dashboard yang dibutuhkan

Gunakan kontrak data yang jelas, misalnya:

```ts
type DashboardData = {
  activeEvent: {
    id: string | number;
    name: string;
    status: 'draft' | 'scheduled' | 'open' | 'paused' | 'closed' | 'completed' | 'archived';
    registrationStart: string;
    registrationEnd: string;
    registered: number;
    quota: number;
    daysRemaining: number;
  };
  metrics: {
    totalApplicants: number;
    weeklyGrowth: number;
    awaitingVerification: number;
    administrationPassed: number;
    needsCorrection: number;
  };
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
  positionQuotas: Array<{
    position: 'Goalkeeper' | 'Anchor' | 'Flank' | 'Pivot' | string;
    registered: number;
    quota: number;
  }>;
  recentApplicants: Array<{
    id: string | number;
    registrationNumber: string;
    fullName: string;
    photoUrl?: string;
    age?: number;
    school: string;
    primaryPosition: string;
    registeredAt: string;
    verificationStatus: string;
  }>;
  recentActivities: Array<{
    id: string | number;
    type: string;
    description: string;
    createdAt: string;
    actor?: string;
  }>;
};
```

Sesuaikan dengan backend sebenarnya. Jangan menduplikasi sumber data jika props/API yang sama sudah tersedia.

---

# 31. Ketentuan copywriting UI

Gunakan bahasa Indonesia yang konsisten:

- `Pendaftar`, bukan berganti-ganti dengan `Applicant`.
- `Menunggu Verifikasi`.
- `Perlu Perbaikan`.
- `Terverifikasi`.
- `Lolos Administrasi`.
- `Tidak Lolos`.
- `Buat Pendaftaran Baru`.
- `Buka Pendaftaran` / `Tutup Pendaftaran`.
- `Simpan Perubahan`.
- `Batalkan`.
- `Lihat Detail`.
- `Tidak ada data` hanya sebagai fallback; utamakan pesan kontekstual.

Hindari kalimat teknis atau pesan error mentah dari server. Mapping error menjadi bahasa yang bisa dipahami pengguna.

---

# 32. Larangan implementasi

Jangan:

1. Membuat semua halaman dengan layout card grid yang sama.
2. Menggunakan data palsu setelah koneksi backend tersedia.
3. Menampilkan NIK lengkap pada tabel atau kartu.
4. Menaruh action destructive berdekatan dengan action umum tanpa pembeda.
5. Membuat tabel desktop hanya dikecilkan pada mobile.
6. Menggunakan font di bawah 12 px untuk informasi penting.
7. Membuat chart tanpa empty/loading/error state.
8. Memakai warna status berbeda di halaman berbeda.
9. Menaruh terlalu banyak tombol primer.
10. Membuat modal di dalam modal.
11. Mengubah route atau business logic tanpa alasan.
12. Membiarkan horizontal overflow.
13. Menggunakan gradient/glow hanya agar tampak modern.
14. Mencampur banyak gaya icon.
15. Menambahkan animasi yang menghambat admin.

---

# 33. Urutan pengerjaan untuk AI Agent

Kerjakan bertahap:

## Tahap 1 — Audit

- Periksa stack dan komponen eksisting.
- Catat route, page, data, permission, dan komponen yang dapat digunakan ulang.
- Tentukan file yang akan diubah.

## Tahap 2 — Design tokens

- Buat/rapikan token warna, typography, spacing, radius, shadow, dan breakpoint.
- Pastikan light theme konsisten.

## Tahap 3 — Application shell

- Implementasikan sidebar, header, mobile drawer, content container, breadcrumb, dan page header.
- Pastikan active navigation berasal dari route.

## Tahap 4 — Komponen dasar

- Button, badge, form control, card, table, drawer, modal, state components.

## Tahap 5 — Dashboard

- Event status strip.
- KPI.
- Trend chart.
- Kuota posisi.
- Pendaftar terbaru.
- Aktivitas terbaru.

## Tahap 6 — Halaman operasional

- Pendaftaran/Event.
- Data Pendaftar.
- Verifikasi.
- Kartu.
- Check-in.
- Penilaian.
- Hasil.

## Tahap 7 — Halaman pendukung

- Pengumuman.
- Laporan.
- Pengguna.
- Audit log.
- Pengaturan.

## Tahap 8 — Responsive dan QA

- Uji seluruh breakpoint.
- Uji keyboard dan focus.
- Uji loading/empty/error.
- Uji permission.
- Perbaiki overflow dan layout shift.

Jangan langsung mengubah seluruh file sekaligus tanpa mengecek hasil tiap tahap.

---

# 34. Acceptance criteria visual dan fungsional

Implementasi dianggap selesai apabila:

1. Layout dashboard mendekati struktur referensi: sidebar gelap, header putih, status strip, empat KPI, chart 8/4, tabel dan aktivitas.
2. Seluruh halaman memakai design system yang sama.
3. Navigasi aktif mengikuti route.
4. Sidebar dapat collapse dan mobile drawer berfungsi.
5. Dashboard memakai data dinamis.
6. Chart memiliki tooltip, responsive container, loading, empty, dan error state.
7. Tabel desktop nyaman dibaca dan berubah menjadi card list di mobile.
8. Form tidak overflow dan tetap mudah dipakai pada 360 px.
9. Status badge konsisten.
10. Tidak ada NIK penuh pada list, kartu peserta, atau QR.
11. Semua action menghormati role/permission.
12. Tidak ada horizontal overflow pada ukuran uji.
13. Tidak ada console error.
14. Tidak ada teks terpotong tanpa tooltip pada data penting.
15. Empty/loading/error state tersedia pada semua halaman utama.
16. Keyboard focus terlihat.
17. Desain tidak terasa seperti template AI generik.

---

# 35. Output yang wajib diberikan AI Agent

Setelah implementasi, berikan laporan singkat yang berisi:

1. Ringkasan perubahan.
2. Daftar file yang dibuat atau diubah.
3. Komponen reusable yang dibuat.
4. Library yang digunakan atau ditambahkan beserta alasannya.
5. Route/page yang sudah diselesaikan.
6. Cara menjalankan dan menguji.
7. Hasil pengecekan responsive.
8. Hal yang belum selesai atau membutuhkan keputusan bisnis.

Jangan hanya memberikan penjelasan atau snippet. Lakukan implementasi nyata pada project, pertahankan fungsi existing, dan verifikasi hasil akhir.

---

## Ringkasan hasil visual yang diharapkan

Panel admin harus memberikan kesan seperti produk SaaS operasional yang matang: sidebar navy yang rapi, header ringkas, background abu-abu muda, surface putih dengan border halus, tipografi Inter yang tegas, ikon Lucide yang konsisten, angka KPI yang jelas, grafik tren pendaftaran yang informatif, progress kuota posisi yang mudah dipindai, tabel yang kuat, serta pengalaman mobile yang benar-benar disusun ulang sesuai konteks layar.

Prioritaskan **kejelasan, konsistensi, efisiensi kerja admin, responsivitas, dan keamanan data** di atas dekorasi.

