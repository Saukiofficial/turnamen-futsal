# PROMPT REDESIGN LANDING PAGE SAF LEAGUE

## Instruksi untuk AI Agent

Anda bertindak sebagai **Senior UI/UX Designer, Senior Product Designer, dan Frontend Engineer**. Tugas Anda adalah merombak halaman publik **SAF LEAGUE — Portal Seleksi Futsal** berdasarkan screenshot referensi yang diberikan.

Buat desain yang profesional, clean, modern, responsif, dan terasa seperti portal resmi organisasi olahraga. Hindari tampilan generik buatan AI. Pertahankan fungsi, informasi, route, data dinamis, serta alur pendaftaran yang sudah tersedia.

Implementasikan hasilnya secara nyata pada project. Jangan hanya membuat gambar, penjelasan, atau potongan kode.

---

# 1. Tujuan redesign

Redesign harus:

1. Memperjelas informasi event dan status pendaftaran.
2. Membuat CTA pendaftaran mudah ditemukan.
3. Menampilkan kuota secara ringkas dan dapat dipercaya.
4. Menjelaskan proses seleksi tanpa kumpulan card generik.
5. Menjelaskan persyaratan yang sederhana.
6. Menampilkan preview kartu peserta secara profesional.
7. Meningkatkan pengalaman mobile secara khusus.
8. Menghilangkan kesan AI slop dari warna, card, ikon, spacing, dan dekorasi.

---

# 2. Audit sebelum implementasi

Sebelum mengubah kode:

1. Periksa stack, route, komponen, layout, data, dan API/props yang sudah tersedia.
2. Identifikasi bagian halaman yang menggunakan data dinamis.
3. Jangan menghapus fungsi pendaftaran, cek status, unduh kartu, pengumuman, atau login admin.
4. Jangan mengganti data backend dengan hardcoded dummy data.
5. Jangan mengubah business logic hanya untuk menyesuaikan desain.
6. Gunakan komponen existing jika sudah layak dan konsisten.
7. Jangan memasang dependency baru jika kebutuhan sudah dapat dipenuhi oleh package existing.
8. Pastikan active navigation, status pendaftaran, waktu tersisa, kuota, serta URL CTA berasal dari data sebenarnya.

Jika project menggunakan Laravel + Inertia React, pertahankan arsitektur tersebut.

---

# 3. Arah visual

## Karakter desain

- Portal liga dan seleksi olahraga resmi.
- Editorial dan terstruktur.
- Percaya diri tetapi tidak agresif.
- Modern tanpa efek futuristik.
- Bersih, tenang, dan mudah dipindai.
- Menggunakan identitas futsal secara subtil.

## Hindari

- AI slop.
- Gradient warna-warni.
- Neon blue.
- Glassmorphism.
- Glow.
- Card di dalam card.
- Semua informasi dibungkus card.
- Radius terlalu besar.
- Shadow tebal.
- Ikon 3D.
- Ilustrasi karakter generik.
- Blob dekoratif.
- Pola titik yang memenuhi semua section.
- Tombol berbentuk pill berlebihan.
- Judul terlalu besar tanpa keseimbangan.
- Ruang kosong yang tidak mempunyai fungsi.
- Animasi yang mengganggu.

---

# 4. Design system

## 4.1 Warna

Gunakan token terpusat:

```css
--navy-950: #081421;
--navy-900: #0C1929;
--navy-800: #14253A;
--primary-700: #1D4ED8;
--primary-600: #2557D6;
--primary-500: #3B6FE8;
--primary-50: #EEF4FF;
--amber-500: #D89A16;
--amber-100: #FFF4D6;
--success-600: #169B62;
--success-50: #EAF8F1;
--ink: #101828;
--text: #344054;
--muted: #667085;
--border: #E4E7EC;
--border-soft: #EEF0F3;
--surface: #FFFFFF;
--page: #F7F7F5;
--section-soft: #F3F5F7;
```

Ketentuan:

- Navy digunakan untuk identitas, footer, dan panel kuota.
- Cobalt digunakan untuk CTA serta elemen aktif.
- Amber hanya sebagai aksen kecil liga.
- Hijau hanya untuk status dibuka, aman, atau berhasil.
- Jangan memakai banyak tone biru dalam satu section.
- Hindari gradient dekoratif. Gradient sangat halus hanya diperbolehkan bila berasal dari kebutuhan overlay foto dan tidak terlihat mencolok.

## 4.2 Tipografi

Gunakan **Inter** atau **Geist**.

```css
font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Ukuran desktop:

- Hero heading: 54–60 px, weight 700–750, line-height 1.02–1.08.
- Section heading: 34–40 px, weight 700.
- Card/step heading: 17–19 px, weight 650–700.
- Body large: 17–18 px.
- Body: 14–16 px.
- Meta: 13–14 px.
- Eyebrow: 12–13 px, weight 700, letter-spacing 0.08em.

Ukuran mobile:

- Hero heading: 36–40 px.
- Section heading: 27–30 px.
- Item title: 16–18 px.
- Body: 14–16 px.
- Meta: minimal 13 px.

Gunakan tabular number pada angka kuota dan persentase.

## 4.3 Border, radius, shadow

- Card/panel utama: radius 12 px.
- Button/input: radius 8–10 px.
- Badge status: radius penuh.
- Border: 1 px `--border`.
- Shadow sangat ringan hanya untuk kartu peserta, dropdown, navbar sticky, dan panel yang membutuhkan elevasi.
- List row tidak perlu shadow.

## 4.4 Ikon

Gunakan satu library outline, disarankan **Lucide React**.

- Default: 18–20 px.
- Button: 16–18 px.
- Feature icon: 20–22 px.
- Stroke konsisten 1.75–2.
- Jangan mencampur ikon outline, filled, emoji, dan ikon 3D.

Ikon yang disarankan:

- Search: `Search`.
- Daftar: `UserPlus`.
- Tanggal: `CalendarDays`.
- Lokasi: `MapPin`.
- Waktu: `Clock3`.
- Kuota: `Users`.
- Kartu: `CreditCard`.
- QR: `QrCode`.
- Form: `ClipboardList`.
- Verifikasi: `BadgeCheck`.
- Seleksi: `Goal` atau `Trophy`.
- Aman: `ShieldCheck`.
- Arrow: `ArrowRight`.
- Menu: `Menu`.

---

# 5. Grid dan spacing

## Desktop

- Max content width: 1200–1240 px.
- Grid: 12 kolom.
- Gutter: 24 px.
- Padding halaman: 32 px.
- Section padding vertikal: 72–96 px.
- Jarak judul ke deskripsi: 12–16 px.
- Jarak heading ke konten: 36–48 px.

## Tablet

- Padding: 24 px.
- Section padding: 64–72 px.
- Grid menyesuaikan 8 kolom.

## Mobile

- Padding horizontal: 18–20 px.
- Section padding: 52–64 px.
- Grid: satu kolom.
- Gap antarblok: 24–32 px.
- Tidak boleh ada horizontal overflow.

---

# 6. Navbar

## Desktop

- Tinggi 68–72 px.
- Sticky di atas.
- Background putih solid atau opacity sangat tinggi dengan blur minimal.
- Border-bottom 1 px.
- Content max-width mengikuti halaman.

### Kiri

- Logo SAF League ukuran sekitar 42–46 px.
- Nama `SAF LEAGUE`.
- Subteks kecil `PORTAL SELEKSI FUTSAL`.
- Logo dan teks tidak mendominasi navbar.

### Tengah

- Beranda.
- Persyaratan.
- Jadwal Seleksi.
- Pengumuman.

Item aktif:

- Teks cobalt.
- Underline 2 px atau bottom indicator yang sederhana.
- Jangan gunakan background pill.

### Kanan

- Button secondary `Cek Status` dengan icon Search.
- Button primary `Daftar Sekarang` dengan icon UserPlus atau ArrowRight.
- Tinggi 40–42 px.

## Mobile

- Tinggi 58–62 px.
- Logo ringkas di kiri.
- Tombol `Cek Status` dapat berupa outline compact.
- Hamburger di kanan.
- Sembunyikan menu desktop dan button daftar navbar.
- Menu dibuka sebagai drawer dari kanan atau kiri.
- Drawer berisi navigasi serta CTA Daftar Sekarang.
- Drawer dapat ditutup dengan overlay, Escape, dan tombol close.

---

# 7. Hero section desktop

## Struktur

- Tinggi sekitar 500–560 px.
- Gunakan layout dua kolom 6:6 atau 7:5.
- Background utama warm off-white, bukan blok navy besar penuh.
- Boleh gunakan foto lapangan futsal yang nyata dan redup pada sisi kanan jika aset berkualitas tersedia.
- Jangan gunakan foto stok generik yang terasa palsu.
- Bila foto tidak tersedia, gunakan pattern garis lapangan yang sangat halus.

## Kolom kiri

Urutan:

1. Eyebrow `PENDAFTARAN RESMI`.
2. Status `Pendaftaran Dibuka` dengan dot hijau.
3. Heading `Seleksi Terbuka Tim Futsal 2026`.
4. Deskripsi `Seleksi resmi pembentukan skuad futsal untuk mencari talenta terbaik dan membangun generasi futsal masa depan.`
5. Metadata tanggal dan lokasi.
6. CTA.

Eyebrow dan status berada dalam satu baris jika ruang cukup. Jangan membuat dua pill besar.

Metadata:

- Calendar icon + `Pendaftaran Dibuka s/d 10 Oktober 2026`.
- MapPin icon + `GOR Futsal Sport Hall`.
- Gunakan satu baris desktop.

CTA:

- Primary `Daftar Sekarang`.
- Secondary `Cek Status & Unduh Kartu`.
- Tinggi 48 px.
- Primary tidak memakai gradient terang.

## Kolom kanan — panel kuota

Panel navy terintegrasi dengan latar lapangan/foto.

Isi:

- Icon Users.
- Label `Kapasitas Pendaftar`.
- `20 hari tersisa` di kanan dengan Clock icon dan aksen amber.
- Angka `2` besar.
- Teks `dari 200 kuota`.
- Persentase `1%`.
- Progress bar tipis.
- Divider.
- Label `KETERSEDIAAN KUOTA PENDAFTAR` atau rincian posisi jika datanya tersedia.

Panel:

- Lebar sekitar 440–500 px.
- Padding 28–32 px.
- Radius 12 px.
- Tidak perlu glow.
- Tidak perlu banyak inner-card.
- Gunakan garis lapangan sangat tipis sebagai tekstur.

## Event facts strip

Di bawah hero buat baris informasi tiga kolom:

1. Pendaftaran Dibuka — 10 Oktober 2026.
2. Lokasi Seleksi — GOR Futsal Sport Hall.
3. Kartu QR — diterbitkan setelah lolos administrasi.

Gunakan icon tile kecil, divider vertikal, dan background putih. Jangan menjadikan tiga kartu mengambang.

---

# 8. Hero section mobile

Mobile bukan desktop yang diperkecil.

Urutan:

1. Eyebrow.
2. Status dibuka.
3. Heading.
4. Deskripsi.
5. Tanggal.
6. Lokasi.
7. Primary CTA full-width.
8. Secondary CTA full-width.
9. Panel kuota full-width.

Ketentuan:

- Heading 36–40 px.
- Jangan memotong kata secara aneh.
- Metadata menjadi dua baris.
- CTA minimal tinggi 48 px.
- Panel kuota tidak overlap dengan teks.
- Jika memakai foto, pindahkan ke background panel kuota atau hilangkan untuk keterbacaan.
- Event facts strip desktop tidak perlu ditampilkan penuh; informasinya sudah berada dalam hero/panel.

---

# 9. Section Tahapan Pendaftaran & Seleksi

## Header

- Eyebrow `ALUR PRAKTIS`.
- Heading `Tahapan Pendaftaran & Seleksi`.
- Deskripsi `Seluruh proses dirancang terstruktur dan transparan tanpa proses manual yang rumit.`

## Desktop — timeline horizontal

Jangan gunakan empat card berukuran sama.

Gunakan timeline horizontal:

- Empat titik/nomor langkah.
- Garis penghubung tipis.
- Nomor 01–04.
- Judul dan deskripsi berada di bawah setiap nomor.
- Step pertama dapat menggunakan cobalt solid.
- Step lain outline navy/gray.
- Tidak menggunakan shadow.
- Tidak memakai background berbeda per langkah.

Langkah:

### 01 — Formulir Singkat

`Isi 7 data inti: Nama, NIK, Asal Sekolah/Instansi opsional, Tempat Lahir, Tanggal Lahir, Posisi, dan Foto formal 3×4.`

### 02 — Verifikasi Data

`Tim verifikator memeriksa kelengkapan data. Peserta dapat memantau status atau memperbaiki data jika diminta.`

### 03 — Kartu Seleksi QR

`Setelah dinyatakan lolos administrasi, kartu peserta ber-QR token unik diterbitkan dan siap dicetak.`

### 04 — Seleksi Lapangan

`Peserta hadir di lokasi seleksi, melakukan scan QR check-in, dan mengikuti proses seleksi.`

## Mobile — timeline vertikal

- Gunakan garis vertikal di kiri.
- Lingkaran nomor 01–04.
- Judul dan deskripsi di kanan.
- Gap antar-step 28–36 px.
- Jangan membuat empat card vertikal.
- Pastikan garis tidak melewati teks.

---

# 10. Section Syarat Mudah & Ringkas

## Background

- Gunakan warm light-gray `--section-soft`.
- Desktop menggunakan layout dua kolom 7:5.

## Kolom kiri

- Eyebrow `KETENTUAN PENDAFTARAN`.
- Heading `Syarat Mudah & Ringkas`.
- Deskripsi `Sistem ini tidak memerlukan dokumen yang berbelit-belit. Siapkan data berikut sebelum mengisi formulir:`

Gunakan list row, bukan card terpisah.

### Row 1

- Check icon hijau.
- `Identitas Pribadi (NIK 16 Digit)`.
- `NIK hanya diisi sebagai nomor 16 digit untuk verifikasi. Peserta tidak perlu mengunggah scan KTP/KK.`

### Row 2

- Check icon hijau.
- `Foto Formal Rasio 3×4`.
- `Foto terbaru format JPG/PNG dengan pencahayaan jelas. Tersedia fitur crop 3:4 langsung di browser.`

### Row 3

- Check icon hijau.
- `Asal Sekolah / Instansi (Opsional)`.
- `Terbuka untuk pelajar maupun peserta umum lintas umur.`

Tampilan list:

- Padding vertikal 20–24 px.
- Divider horizontal.
- Icon 22 px.
- Tidak menggunakan shadow.
- Jika memakai background putih, gunakan satu container bersama, bukan tiga card terpisah.

CTA di bawah:

- `Lanjut ke Formulir Pendaftaran`.
- Icon ArrowRight.

## Kolom kanan — preview kartu peserta

Gunakan showcase area yang subtil:

- Pattern garis lapangan tipis.
- Label kecil `PREVIEW KARTU PESERTA`.
- Kartu vertikal realistis.
- Shadow ringan.
- Tidak menggunakan mockup perangkat.

Isi kartu:

- Logo SAF League.
- Header `KARTU PESERTA SELEKSI`.
- Badge `RESMI`.
- Foto 3×4 placeholder.
- Nomor `FTS-2026-000127`.
- Nama `Ahmad Rizky Pratama`.
- Posisi `Anchor`.
- Asal sekolah `SMA Negeri 1 Sumenep`.
- QR check-in.
- Teks `Token acak aman`.

Jangan tampilkan NIK pada kartu.

## Mobile

- Heading dan list di atas.
- CTA full-width.
- Preview kartu di bawah CTA.
- Kartu memenuhi sekitar 85–92% lebar content.
- Jangan mengecilkan kartu hingga teks tidak terbaca.

---

# 11. Confidence strip

Sebelum footer tampilkan tiga benefit:

1. ShieldCheck — `Data aman`.
2. FileCheck/BadgeCheck — `Verifikasi transparan`.
3. QrCode — `Kartu QR unik`.

Desktop:

- Satu baris tiga kolom.
- Divider vertikal.
- Padding 24–28 px.

Mobile:

- Grid satu atau dua kolom.
- Jika tiga item terlalu padat, gunakan stack vertikal.
- Jangan mengecilkan font di bawah 13 px.

---

# 12. Footer

## Desktop

- Background deep navy.
- Padding atas/bawah 56–64 px.
- Empat kolom.

### Kolom 1 — brand

- Logo SAF League.
- Deskripsi singkat.
- Catatan keamanan data.

### Kolom 2 — navigasi

- Beranda Pendaftaran.
- Formulir Pendaftaran.
- Cek Status & Perbaikan.
- Pengumuman Hasil.

### Kolom 3 — bantuan/kontak

- Email.
- Nomor kontak.
- Lokasi.

Gunakan data aktual dari project. Jangan mengarang kontak.

### Kolom 4 — panitia

- Deskripsi akses panitia.
- Button `Masuk Panel Admin`.

Bottom row:

- Copyright.
- Teks `Dibangun untuk kemajuan olahraga futsal Indonesia.`
- Border-top halus.

## Mobile

- Stack brand terlebih dahulu.
- Navigasi dan bantuan dapat berupa accordion.
- Button panel admin tetap terlihat.
- Bottom copyright stack dua baris.
- Jangan membuat footer kosong dan sangat tinggi.

---

# 13. Komponen reusable

Buat atau rapikan komponen:

```text
PublicLayout
PublicNavbar
MobileNavigationDrawer
HeroSection
RegistrationStatusBadge
EventMeta
QuotaPanel
EventFactsStrip
ProcessTimeline
RequirementList
ParticipantCardPreview
TrustStrip
PublicFooter
PrimaryButton
SecondaryButton
SectionHeading
```

Komponen harus:

- Menerima props/data.
- Tidak hardcoded bila data tersedia dari backend.
- Memiliki loading/fallback yang wajar.
- Responsif.
- Accessible.

---

# 14. Interaksi dan animasi

Gunakan animasi ringan:

- Hover button: 140–180 ms.
- Navbar shadow ketika scroll.
- Progress bar animate sekali saat load, maksimal 500 ms.
- Timeline dapat fade-up sangat halus ketika masuk viewport.
- Participant card boleh bergerak maksimal 2–3 px saat hover desktop.

Jangan gunakan:

- Bounce.
- Float terus-menerus.
- Parallax berat.
- Glow pulse.
- Animasi pada setiap huruf.
- Animasi yang mengganggu pembacaan.

Hormati `prefers-reduced-motion`.

---

# 15. State dinamis

Desain harus mendukung:

## Pendaftaran dibuka

- Badge hijau.
- CTA aktif.
- Waktu tersisa dan kuota.

## Belum dibuka

- Badge biru/neutral.
- Tampilkan tanggal pembukaan.
- CTA daftar disabled atau diganti `Belum Dibuka`.

## Dijeda

- Badge amber.
- Pesan admin.
- CTA nonaktif.

## Ditutup

- Badge neutral/red restrained.
- Tampilkan tanggal penutupan.
- CTA diganti `Pendaftaran Ditutup`.

## Kuota penuh

- Progress 100%.
- Label `Kuota Penuh`.
- CTA dinonaktifkan atau diarahkan sesuai business rule.

Jangan hanya mengganti warna; ubah teks dan status aksesibilitas.

---

# 16. Responsivitas

## Desktop ≥1440 px

- Max-width 1200–1240 px.
- Hero dua kolom.
- Timeline horizontal.
- Requirement 7:5.
- Footer empat kolom.

## Desktop 1024–1439 px

- Padding 24–32 px.
- Hero 6:6.
- Heading dapat turun ke 48–54 px.
- Panel kuota tetap terbaca.

## Tablet 768–1023 px

- Hero dapat menjadi dua baris jika kolom terlalu sempit.
- Timeline dapat dua kolom atau mulai menjadi vertikal.
- Requirements stack.
- Footer dua kolom.

## Mobile 360–767 px

- Navbar drawer.
- Hero satu kolom.
- CTA full-width.
- Panel kuota full-width.
- Timeline vertikal.
- Requirements stack.
- Preview kartu tidak terpotong.
- Trust strip stack/grid.
- Footer stack.
- Touch target minimal 44×44 px.
- Tidak ada horizontal overflow.

Uji ukuran:

- 360×800.
- 390×844.
- 768×1024.
- 1024×768.
- 1366×768.
- 1440×900.

---

# 17. Accessibility

- Gunakan semantic HTML.
- Navbar menggunakan `nav`.
- Section mempunyai heading hierarchy yang benar.
- Semua tombol/link dapat digunakan dengan keyboard.
- Focus-visible jelas.
- Hamburger mempunyai aria-label dan state expanded.
- Drawer mengunci fokus.
- Status pendaftaran mempunyai teks, tidak hanya warna.
- Progress kuota memiliki aria-label/value.
- Kontras memenuhi standar yang layak.
- Alt text gambar relevan.
- Jangan menggunakan placeholder sebagai label.

---

# 18. Performa

- Optimalkan gambar hero ke WebP/AVIF.
- Gunakan `srcset` dan ukuran responsif.
- Lazy-load gambar non-hero.
- Jangan mengirim gambar desktop besar ke mobile jika tidak dibutuhkan.
- Hindari library animasi berat hanya untuk transisi kecil.
- Hindari rerender yang tidak diperlukan.
- Data status/kuota harus datang dari backend atau props existing.
- Jangan menjalankan query baru per komponen jika data dapat diagregasi.

---

# 19. Copywriting yang digunakan

Gunakan bahasa Indonesia secara konsisten.

Teks utama:

- `Seleksi Terbuka Tim Futsal 2026`.
- `Pendaftaran Resmi`.
- `Pendaftaran Dibuka`.
- `Daftar Sekarang`.
- `Cek Status & Unduh Kartu`.
- `Tahapan Pendaftaran & Seleksi`.
- `Syarat Mudah & Ringkas`.
- `Lanjut ke Formulir Pendaftaran`.
- `Preview Kartu Peserta`.
- `Data aman`.
- `Verifikasi transparan`.
- `Kartu QR unik`.

Jangan mengarang tanggal, lokasi, jumlah kuota, nomor kontak, atau alamat email. Ambil dari data project.

---

# 20. Larangan implementasi

Jangan:

1. Membuat ulang seluruh halaman sebagai kumpulan card.
2. Menggunakan background navy untuk semua section.
3. Menambahkan gradient neon.
4. Menggunakan dummy data jika data nyata tersedia.
5. Menghapus route/fungsi existing.
6. Membuat mobile sebagai desktop yang diperkecil.
7. Membuat timeline horizontal overflow di mobile.
8. Menampilkan NIK di kartu peserta.
9. Mencampur library ikon.
10. Menggunakan gambar stok buruk.
11. Membuat footer terlalu tinggi.
12. Membuat font penting di bawah 13 px.
13. Menambahkan carousel tanpa kebutuhan.
14. Menambahkan animasi berlebihan.
15. Menyembunyikan informasi penting hanya agar desain terlihat minimal.

---

# 21. Urutan implementasi

## Tahap 1 — Audit

- Cek stack dan file existing.
- Petakan data dinamis serta route CTA.
- Catat komponen yang dapat dipakai ulang.

## Tahap 2 — Tokens dan layout

- Terapkan warna, typography, spacing, radius, dan container.
- Buat PublicLayout dan navbar responsive.

## Tahap 3 — Hero

- Implementasikan copy, metadata, CTA, panel kuota, dan state pendaftaran.
- Pastikan desktop/mobile berbeda secara struktur.

## Tahap 4 — Timeline

- Horizontal desktop.
- Vertikal mobile.

## Tahap 5 — Persyaratan dan kartu

- List persyaratan.
- Preview kartu peserta.
- CTA.

## Tahap 6 — Trust dan footer

- Trust strip.
- Footer responsive.

## Tahap 7 — QA

- Uji semua breakpoint.
- Uji state status.
- Uji link dan CTA.
- Uji accessibility.
- Uji performa dan gambar.

---

# 22. Acceptance criteria

Implementasi selesai jika:

1. Desktop mengikuti struktur dua kolom hero dan layout editorial.
2. Mobile memiliki navbar drawer, CTA full-width, panel kuota, timeline vertikal, serta section yang stack dengan benar.
3. Semua data event dinamis tetap bekerja.
4. CTA Daftar dan Cek Status menuju route benar.
5. Status buka/tutup/kuota penuh didukung.
6. Timeline tidak menggunakan empat card generik.
7. Persyaratan menggunakan list terstruktur.
8. Preview kartu responsif dan tidak menampilkan NIK.
9. Footer rapi pada desktop dan mobile.
10. Tidak ada horizontal overflow.
11. Tidak ada console error.
12. Tidak ada teks terpotong.
13. Focus keyboard terlihat.
14. Kontras teks baik.
15. Gambar dioptimalkan.
16. Tidak ada penggunaan gradient/glow/dekorasi berlebihan.
17. Hasil akhir terasa seperti portal liga resmi, bukan template SaaS generik.

---

# 23. Output yang wajib diberikan AI Agent

Setelah implementasi, laporkan:

1. Ringkasan perubahan.
2. Daftar file yang dibuat/diubah.
3. Komponen reusable.
4. Data/props yang digunakan.
5. Route CTA yang dipertahankan.
6. Perbedaan layout desktop, tablet, dan mobile.
7. State event yang sudah didukung.
8. Hasil uji responsive.
9. Hasil uji accessibility.
10. Dependency baru jika ada dan alasannya.
11. Bagian yang belum selesai atau membutuhkan keputusan.

Jangan hanya memberikan snippet. Lakukan perubahan nyata dan verifikasi hasilnya.

