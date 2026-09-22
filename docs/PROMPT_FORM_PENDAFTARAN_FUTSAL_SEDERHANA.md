# PROMPT REVISI FORM PENDAFTARAN FUTSAL SEDERHANA

## Peran AI Agent

Anda bertindak sebagai **Senior UI/UX Designer dan Frontend Engineer**. Tugas Anda adalah merancang serta mengimplementasikan form pendaftaran pemain futsal yang sederhana, profesional, mudah digunakan semua umur, responsif, dan konsisten dengan identitas visual FutsalReg.

Form ini bukan formulir seleksi atlet profesional yang kompleks. Jangan menambahkan field, dokumen, atau persyaratan yang tidak diminta.

---

# 1. Tujuan utama

Buat alur pendaftaran yang singkat agar peserta dapat menyelesaikannya dengan cepat melalui ponsel maupun desktop.

Data yang dikumpulkan hanya:

1. Nama lengkap.
2. NIK.
3. Asal sekolah/instansi, opsional agar sesuai untuk semua umur.
4. Tempat lahir.
5. Tanggal lahir.
6. Posisi futsal.
7. Foto formal 3×4.

Jangan menambahkan data lain tanpa instruksi baru dari pemilik produk.

---

# 2. Larangan field dan berkas tambahan

Hapus dan jangan tampilkan:

- Nomor WhatsApp.
- Email.
- Alamat lengkap.
- Jenis kelamin.
- Kelas atau tingkat.
- Kabupaten/kota sekolah.
- Posisi alternatif.
- Kaki dominan.
- Tinggi badan.
- Berat badan.
- Nama tim atau klub sebelumnya.
- Lama pengalaman.
- Prestasi futsal.
- Kartu pelajar.
- KTP/KK sebagai unggahan dokumen.
- Surat izin orang tua.
- Sertifikat prestasi.
- Berkas tambahan lainnya.

NIK hanya diisi sebagai teks 16 digit. Peserta tidak perlu mengunggah foto KTP atau KK.

---

# 3. Alur pendaftaran

Gunakan alur tiga langkah:

1. **Biodata**
2. **Foto 3×4**
3. **Konfirmasi**

Setelah langkah ketiga dikirim, tampilkan halaman:

4. **Pendaftaran Berhasil**

Jangan menggunakan empat atau lima langkah untuk data yang sedikit. Stepper harus ringkas dan proporsional.

---

# 4. Arah visual

Gunakan desain yang profesional, tenang, dan tidak terlihat seperti template AI generik.

Karakter desain:

- Bersih dan modern.
- Serius tetapi tetap ramah untuk semua umur.
- Memiliki identitas olahraga secara halus.
- Tidak dipenuhi card.
- Informasi utama mudah dipindai.
- Form terasa pendek dan cepat diselesaikan.

Hindari:

- AI slop.
- Card di dalam card.
- Terlalu banyak rounded card.
- Gradient berlebihan.
- Glassmorphism.
- Glow atau neon.
- Ilustrasi 3D.
- Blob dekoratif.
- Icon besar tanpa fungsi.
- Judul terlalu besar.
- Ruang kosong berlebihan.
- Form yang dibuat panjang secara artifisial.

---

# 5. Design system

## Font

Gunakan **Inter** atau **Geist**.

Fallback:

```css
font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Ukuran:

- Judul event: 30–34 px desktop, 24–28 px mobile, weight 700.
- Judul form: 20–22 px desktop, 18–20 px mobile, weight 650–700.
- Label input: 13–14 px, weight 600.
- Isi input: 14 px.
- Helper text: 12–13 px.
- Button: 14 px, weight 600.

## Warna

- Navy utama: `#0B1728`.
- Primary blue: `#2457D6` atau `#2563EB`.
- Background halaman: `#F4F5F7`.
- Surface: `#FFFFFF`.
- Teks utama: `#101828`.
- Teks sekunder: `#667085`.
- Border: `#DDE3EA`.
- Success: `#16A34A`.
- Warning: `#D97706`.
- Error: `#DC2626`.

## Radius dan shadow

- Form surface: radius 12 px.
- Input dan button: radius 8 px.
- Badge status: radius penuh hanya untuk label status.
- Border 1 px.
- Gunakan shadow sangat halus hanya pada form container.

---

# 6. Navbar dan event masthead

Pertahankan layout visual versi redesign terakhir.

## Navbar

- Tinggi sekitar 64 px.
- Background putih.
- Logo FutsalReg di kiri.
- Navigasi: Beranda, Persyaratan, Jadwal Seleksi, Pengumuman.
- Tombol outline `Cek Status` di kanan.
- Pada mobile, menu berubah menjadi drawer/hamburger.

## Event masthead

Gunakan band navy tepat di bawah navbar.

Bagian kiri:

- Eyebrow `PENDAFTARAN PEMAIN`.
- Judul `Seleksi Tim Futsal 2026`.
- Deskripsi singkat.
- Tanggal pendaftaran.
- Lokasi kegiatan.

Bagian kanan:

- Status `PENDAFTARAN DIBUKA`.
- Jumlah pendaftar dan kuota.
- Progress bar tipis.

Gunakan pola garis lapangan futsal yang sangat halus pada background navy. Jangan menggunakan foto pemain, ilustrasi karakter, atau ornamen berlebihan.

Pada mobile:

- Susun informasi menjadi satu kolom.
- Sembunyikan detail dekoratif.
- Status serta kuota tetap terlihat.

---

# 7. Container dan stepper

## Container

- Maksimal lebar 1060–1160 px.
- Form sedikit overlap dengan bagian bawah masthead.
- Background utama putih.
- Jangan membungkus setiap bagian dengan card berbeda.
- Gunakan whitespace dan divider tipis.

## Stepper

Gunakan tiga langkah:

1. Biodata.
2. Foto 3×4.
3. Konfirmasi.

Ketentuan:

- Gunakan lingkaran angka kecil 30–34 px.
- Langkah aktif menggunakan primary blue.
- Langkah selesai menggunakan check icon.
- Langkah berikutnya menggunakan abu-abu.
- Hubungkan dengan garis tipis.
- Stepper tidak perlu dibungkus card besar tersendiri.
- Pada mobile, singkat label menjadi tetap terbaca atau gunakan indikator `Langkah 1 dari 3` tanpa menyebabkan overflow.

---

# 8. Langkah 1 — Biodata

Judul:

`Data Peserta`

Deskripsi:

`Isi data berikut sesuai dengan identitas Anda.`

## Field yang ditampilkan

### Nama Lengkap

- Wajib.
- Full-width.
- Label `Nama Lengkap`.
- Placeholder `Masukkan nama lengkap`.
- Maksimal panjang wajar, misalnya 100 karakter.

### NIK

- Wajib.
- Hanya menerima angka.
- Tepat 16 digit.
- Label `NIK`.
- Placeholder `Masukkan 16 digit NIK`.
- Helper text: `NIK digunakan untuk mencegah pendaftaran ganda dan dijaga kerahasiaannya.`
- Gunakan input mode numeric pada mobile.
- Jangan mengunggah dokumen KTP/KK.

### Asal Sekolah/Instansi

- Opsional karena peserta berasal dari semua umur.
- Label `Asal Sekolah/Instansi (Opsional)`.
- Placeholder `Contoh: SMA Negeri 1 Sumenep`.
- Helper text: `Kosongkan jika tidak sedang bersekolah atau tidak mewakili instansi.`
- Gunakan text input biasa agar tidak membatasi peserta.

### Tempat Lahir

- Wajib.
- Label `Tempat Lahir`.
- Placeholder `Contoh: Sumenep`.

### Tanggal Lahir

- Wajib.
- Gunakan date picker yang mudah digunakan.
- Tidak boleh menerima tanggal masa depan.
- Format tampilan Indonesia.

### Posisi Futsal

- Wajib.
- Pilihan:
  - Goalkeeper.
  - Anchor.
  - Flank.
  - Pivot.

Gunakan satu dari dua pola:

- Select yang rapi; atau
- Empat pilihan kecil dalam segmented/radio grid.

Jika memakai radio grid:

- Jangan membuat card besar berwarna-warni.
- Tinggi sekitar 48–52 px.
- Border tipis.
- Posisi terpilih menggunakan border biru dan background biru sangat muda.
- Gunakan icon garis lapangan kecil bila memang membantu.

## Layout desktop

- Nama lengkap full-width.
- NIK dan Asal Sekolah/Instansi dapat berada dalam dua kolom, tetapi beri ruang lebih besar untuk asal sekolah.
- Tempat Lahir dan Tanggal Lahir dua kolom.
- Posisi futsal full-width.

## Layout mobile

- Semua field satu kolom.
- Input minimal tinggi 44–48 px.
- Tidak ada horizontal overflow.
- Radio posisi dapat menggunakan grid dua kolom.

## Tombol

Bagian bawah menggunakan divider tipis.

- Kiri: `Langkah 1 dari 3`.
- Kanan: tombol outline `Simpan Draft` jika fitur draft tersedia.
- Tombol primary `Lanjutkan`.

Jangan menampilkan tombol Kembali pada langkah pertama.

---

# 9. Langkah 2 — Foto 3×4

Judul:

`Unggah Foto Peserta`

Deskripsi:

`Unggah foto formal terbaru dengan rasio 3×4.`

Langkah ini hanya berisi foto. Jangan menambahkan daftar dokumen lain.

## Layout desktop

Gunakan dua bagian yang seimbang:

### Area kiri — Preview foto

- Frame preview rasio 3:4.
- Ukuran sekitar 220×293 px.
- Background abu-abu muda sebelum foto dipilih.
- Placeholder icon pengguna sederhana.
- Setelah upload, tampilkan preview nyata.
- Sediakan tombol kecil `Ganti Foto` dan `Hapus`.

### Area kanan — Upload dan ketentuan

- Dropzone yang proporsional, bukan memenuhi seluruh layar.
- Button `Pilih Foto`.
- Mendukung drag and drop desktop.
- Pada mobile, utamakan file picker/camera picker.

Ketentuan:

- Format JPG, JPEG, atau PNG.
- Ukuran maksimal 2 MB.
- Rasio akhir 3:4.
- Foto terbaru.
- Wajah terlihat jelas.
- Background polos disarankan.

## Crop foto

Setelah foto dipilih:

- Buka crop modal.
- Rasio terkunci 3:4.
- Sediakan zoom dan reposition.
- Tombol `Batalkan` dan `Gunakan Foto`.
- Jangan menurunkan kualitas secara berlebihan.

## Error state

Tampilkan pesan yang jelas untuk:

- Format tidak didukung.
- Ukuran lebih dari 2 MB.
- File rusak.
- Upload gagal.

## Responsif

- Desktop: preview kiri, instruksi kanan.
- Tablet: tetap dua kolom jika cukup.
- Mobile: preview di atas, kontrol upload di bawah.

## Tombol

- `Kembali`.
- `Simpan Draft` jika tersedia.
- `Lanjutkan`.
- Keterangan `Langkah 2 dari 3`.

---

# 10. Langkah 3 — Konfirmasi

Judul:

`Periksa & Konfirmasi`

Deskripsi:

`Pastikan seluruh data sudah benar sebelum dikirim.`

Jangan menampilkan form editable ulang. Gunakan ringkasan data yang rapi.

## Ringkasan

Tampilkan:

- Foto 3×4.
- Nama lengkap.
- NIK tersamarkan, contoh `3529 •••• •••• 1234`.
- Asal sekolah/instansi atau `Tidak diisi`.
- Tempat dan tanggal lahir.
- Posisi futsal.

Gunakan description list dengan label dan value, bukan card terpisah untuk setiap data.

Sediakan link/tombol kecil:

- `Ubah Biodata`.
- `Ganti Foto`.

## Persetujuan

Gunakan satu checkbox wajib:

`Saya menyatakan bahwa data yang saya isi benar dan dapat dipertanggungjawabkan.`

Jika kebijakan privasi tersedia, tambahkan teks/link kecil tanpa membuat checkbox tambahan yang tidak diperlukan:

`Dengan mengirim pendaftaran, Anda menyetujui pemrosesan data sesuai Kebijakan Privasi.`

## Informasi penting

Tampilkan warning kecil:

`Data tidak dapat diubah setelah dikirim, kecuali panitia meminta perbaikan.`

## Tombol

- `Kembali`.
- Primary `Kirim Pendaftaran`.
- Keterangan `Langkah 3 dari 3`.

Saat mengirim:

- Disable tombol.
- Tampilkan spinner dan teks `Mengirim...`.
- Cegah double submit.

---

# 11. Halaman pendaftaran berhasil

Setelah data berhasil dikirim, tampilkan halaman konfirmasi yang tenang dan profesional.

## Konten utama

- Icon success berukuran sedang.
- Eyebrow `PENDAFTARAN BERHASIL`.
- Judul `Data Anda berhasil dikirim`.
- Pesan `Panitia akan memeriksa data yang telah Anda kirim.`

## Nomor pendaftaran

Tampilkan blok nomor:

- Label `Nomor Pendaftaran`.
- Contoh `FTS-2026-000127`.
- Tombol copy.
- Pesan `Simpan nomor ini untuk mengecek status pendaftaran.`

## Status proses

Gunakan timeline tiga tahap:

1. `Pendaftaran Dikirim` — selesai.
2. `Verifikasi Data` — sedang diproses.
3. `Kartu Peserta Tersedia` — menunggu.

## Kartu sementara

Tampilkan preview kartu peserta sementara berisi:

- Logo dan nama event.
- Foto 3×4.
- Nama lengkap.
- Nomor pendaftaran.
- Asal sekolah/instansi jika diisi.
- Posisi futsal.
- QR code/token verifikasi.

Jangan menampilkan NIK pada kartu.

Tambahkan keterangan:

`Kartu resmi tersedia setelah pendaftaran diverifikasi.`

## Tombol

- Primary `Cek Status Pendaftaran`.
- Secondary `Unduh Bukti Pendaftaran`.
- Link `Kembali ke Beranda`.

---

# 12. Panel informasi samping

Pada desktop, tampilkan contextual rail di kanan dengan lebar sekitar 300–340 px.

Jangan membuat banyak card bertumpuk. Gunakan satu blok informasi dengan divider.

Informasi:

- Periode pendaftaran.
- Lokasi.
- Sisa hari.
- Jumlah pendaftar dan kuota.
- Progress bar tipis.

Pada langkah biodata, tambahkan catatan:

`Pastikan nama dan NIK sesuai dengan identitas.`

Pada langkah foto, tambahkan ketentuan foto.

Pada langkah konfirmasi, tampilkan ringkasan event dan warning perubahan data.

Pada tablet dan mobile:

- Pindahkan panel ke bawah konten utama; atau
- Ringkas menjadi expandable info panel.

Jangan membuat form terlalu sempit hanya untuk mempertahankan sidebar.

---

# 13. Validasi

## Nama lengkap

- Wajib.
- Trim whitespace.
- Minimal 2 karakter.

## NIK

- Wajib.
- Tepat 16 digit.
- Hanya angka.
- Periksa duplikasi dalam event yang sama melalui backend.
- Jangan tampilkan NIK penuh setelah halaman konfirmasi.

## Asal sekolah/instansi

- Opsional.
- Jangan menolak pendaftaran jika kosong.

## Tempat lahir

- Wajib.

## Tanggal lahir

- Wajib.
- Tidak boleh lebih besar dari tanggal hari ini.
- Karena pendaftaran untuk semua umur, jangan menambahkan batas usia otomatis kecuali event memang mengaturnya.

## Posisi futsal

- Wajib.
- Hanya menerima posisi yang tersedia.

## Foto

- Wajib.
- JPG/JPEG/PNG.
- Maksimal 2 MB.
- Rasio hasil crop 3:4.

Pesan error berada tepat di bawah field dan menggunakan bahasa Indonesia yang jelas.

---

# 14. Responsivitas

## Desktop

- Container 1060–1160 px.
- Form utama dan panel informasi menggunakan proporsi sekitar 8:4.
- Field menggunakan maksimal dua kolom.

## Tablet

- Padding 20–24 px.
- Panel informasi dapat berada di bawah form.
- Stepper tetap terbaca.
- Field dua kolom hanya jika lebar cukup.

## Mobile

- Padding 16 px.
- Navbar menggunakan drawer.
- Masthead menjadi satu kolom.
- Stepper ringkas.
- Semua input satu kolom.
- Pilihan posisi menggunakan grid dua kolom.
- Preview foto berada di tengah.
- Button minimal tinggi 44–48 px.
- Primary action full-width bila diperlukan.
- Tidak ada horizontal overflow.
- Action footer tidak menutupi field terakhir.

Uji minimal pada:

- 360×800.
- 390×844.
- 768×1024.
- 1024×768.
- 1366×768.
- 1440×900.

---

# 15. Accessibility dan keamanan

- Semua input memiliki label nyata.
- Focus state terlihat.
- Form dapat digunakan dengan keyboard.
- Error terhubung dengan field.
- Button icon-only memiliki aria-label.
- Status tidak bergantung pada warna saja.
- Modal crop mengunci fokus dan dapat ditutup dengan Escape.
- NIK disimpan secara aman sesuai arsitektur backend.
- NIK dimasking pada halaman konfirmasi, admin list, bukti, dan kartu.
- QR tidak boleh berisi NIK mentah.
- File foto disimpan menggunakan nama aman dan validasi MIME type.
- Cegah double submit dan pendaftaran ganda.

---

# 16. State wajib

Implementasikan:

- Loading form.
- Validasi field.
- Upload progress.
- Upload gagal.
- Draft tersimpan, jika fitur draft digunakan.
- Pengiriman sedang diproses.
- Pengiriman gagal dengan tombol coba lagi.
- Pendaftaran berhasil.
- Pendaftaran ditutup.
- Kuota penuh.
- NIK sudah terdaftar pada event yang sama.

Jangan menghapus data yang sudah diisi ketika terjadi error jaringan.

---

# 17. Instruksi implementasi

1. Audit stack dan komponen yang sudah tersedia.
2. Pertahankan route, autentikasi, validasi, dan business logic yang sudah berfungsi.
3. Hapus field serta komponen dokumen tambahan yang tidak termasuk scope.
4. Jangan hanya menyembunyikan field di frontend jika backend masih mewajibkannya; sesuaikan validasi, request, database, dan output secara aman.
5. Gunakan komponen reusable untuk stepper, input, posisi, upload foto, crop, summary, dan success state.
6. Gunakan data event dari backend.
7. Jangan meninggalkan data dummy pada alur produksi.
8. Pastikan pembuatan nomor pendaftaran dilakukan backend secara aman dan unik.
9. Verifikasi tampilan desktop, tablet, dan mobile.
10. Pastikan tidak ada console error atau horizontal overflow.

---

# 18. Acceptance criteria

Implementasi dianggap selesai jika:

1. Form hanya mengumpulkan nama lengkap, NIK, asal sekolah/instansi opsional, tempat lahir, tanggal lahir, posisi futsal, dan foto 3×4.
2. Tidak ada unggahan KTP, KK, kartu pelajar, surat izin, atau sertifikat.
3. Tidak ada field pengalaman, prestasi, tinggi, berat, kaki dominan, dan posisi alternatif.
4. Alur hanya terdiri dari Biodata, Foto 3×4, dan Konfirmasi.
5. Form dapat diselesaikan pada mobile tanpa zoom atau scroll horizontal.
6. Foto dapat dipreview dan dicrop dengan rasio 3:4.
7. NIK tervalidasi 16 digit dan dimasking pada ringkasan.
8. Asal sekolah/instansi tidak wajib.
9. Tidak ada pembatasan usia otomatis untuk event semua umur.
10. Double submit dicegah.
11. Halaman berhasil menampilkan nomor pendaftaran dan status proses.
12. Kartu sementara tidak menampilkan NIK.
13. Desain konsisten dengan navbar, masthead navy, warna, dan tipografi FutsalReg.
14. Layout tidak terlihat seperti template AI generik.
15. Loading, error, pendaftaran ditutup, kuota penuh, dan duplikasi mempunyai state yang jelas.

---

# 19. Output yang diminta dari AI Agent

Setelah selesai, berikan:

1. Ringkasan implementasi.
2. Daftar file yang diubah.
3. Field yang dihapus.
4. Perubahan validasi frontend dan backend.
5. Struktur komponen reusable.
6. Route atau endpoint yang digunakan.
7. Hasil pengujian responsif.
8. Hasil pengujian upload/crop foto.
9. Hasil pengujian NIK duplikat dan double submit.
10. Catatan apabila terdapat keputusan bisnis yang masih diperlukan.

Lakukan implementasi nyata pada project. Jangan hanya memberikan snippet atau penjelasan.

