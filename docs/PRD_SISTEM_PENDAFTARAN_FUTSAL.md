# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Stack utama

| Bagian     | Teknologi          | Kegunaan                                                   |
| ---------- | ------------------ | ---------------------------------------------------------- |
| Backend    | Laravel 13      | Business logic, validasi, autentikasi, API, dan keamanan   |
| Frontend   | React + TypeScript | Form pendaftaran dan panel admin                           |
| Penghubung | Inertia.js         | Menghubungkan Laravel dengan React tanpa REST API terpisah |
| Styling    | Tailwind CSS       | Membuat UI responsif                                       |
| Database   | MySQL 8            | Menyimpan event, peserta, status, dan admin                |
| Build tool | Vite               | Menjalankan dan membangun frontend                         |
| Server     | Nginx              | Web server saat production                                 |
| PHP        | PHP 8.3+           | Menjalankan Laravel                                        |

## Sistem Pendaftaran dan Seleksi Pemain Futsal

**Versi:** 1.0  
**Status:** Draft siap pengembangan  
**Platform:** Web responsif  
**Bahasa utama:** Indonesia  
**Target pengguna:** Peserta, panitia, verifikator, pelatih/tim seleksi, dan administrator

---

## 1. Ringkasan Produk

Sistem Pendaftaran dan Seleksi Pemain Futsal adalah aplikasi web untuk mengelola seluruh proses penerimaan pemain, mulai dari publikasi periode pendaftaran, pengisian biodata, unggah berkas, verifikasi administrasi, penerbitan kartu peserta, check-in seleksi, penilaian, pengumuman hasil, sampai ekspor laporan.

Sistem harus mendukung banyak periode atau event pendaftaran. Admin dapat membuat pendaftaran baru tanpa menghapus atau menimpa data periode sebelumnya. Setiap event memiliki jadwal, kuota, formulir, persyaratan, status, nomor peserta, dan desain kartu masing-masing.

Peserta pada versi awal tidak diwajibkan membuat akun. Setelah mengirim formulir, peserta memperoleh nomor pendaftaran dan kode akses untuk mengecek status, memperbaiki data jika diminta, serta mengunduh kartu peserta setelah dinyatakan memenuhi ketentuan.

---

## 2. Latar Belakang

Proses pendaftaran futsal yang dilakukan melalui formulir umum atau pesan pribadi menimbulkan beberapa masalah:

- Data peserta tidak seragam dan sulit dicari.
- Foto dan berkas tercampur dengan percakapan panitia.
- Verifikasi berkas tidak memiliki status dan riwayat yang jelas.
- Pembuatan kartu peserta harus dilakukan secara manual.
- Panitia kesulitan membatasi kuota dan menutup pendaftaran tepat waktu.
- Rekap peserta, posisi pemain, asal sekolah, kehadiran, dan hasil seleksi membutuhkan pekerjaan berulang.
- Data sensitif seperti NIK berisiko tersebar kepada pihak yang tidak berwenang.

Produk ini dibuat untuk menjadikan proses tersebut terstruktur, cepat, dapat dilacak, aman, dan dapat digunakan kembali pada periode selanjutnya.

---

## 3. Tujuan Produk

### 3.1 Tujuan utama

1. Memudahkan peserta melakukan pendaftaran secara mandiri melalui perangkat desktop maupun ponsel.
2. Memudahkan admin membuat, membuka, menjeda, menutup, dan mengarsipkan periode pendaftaran.
3. Menyediakan proses verifikasi biodata dan berkas yang jelas.
4. Menghasilkan kartu peserta secara otomatis dan siap cetak.
5. Memusatkan data check-in, penilaian, dan hasil seleksi.
6. Menyediakan laporan serta ekspor data tanpa pengolahan ulang secara manual.
7. Melindungi NIK, foto, dan dokumen peserta dengan kontrol akses yang sesuai.

### 3.2 Indikator keberhasilan

- Peserta dapat menyelesaikan pendaftaran tanpa bantuan panitia.
- Nomor pendaftaran dibuat otomatis dan tidak duplikat.
- Admin dapat menemukan peserta berdasarkan nama atau nomor peserta dalam waktu singkat.
- Kartu peserta dapat dibuat tanpa desain manual per peserta.
- Semua perubahan status mempunyai waktu, pelaku, dan catatan.
- Data periode lama tetap tersedia setelah admin membuat periode baru.
- Tampilan utama dapat digunakan dengan baik pada layar ponsel minimal 360 px.

---

## 4. Ruang Lingkup

### 4.1 Termasuk dalam versi utama

- Landing page pendaftaran.
- Daftar event/periode pendaftaran.
- Status buka/tutup otomatis dan manual.
- Formulir pendaftaran bertahap.
- Unggah dan validasi foto 3×4 serta dokumen.
- Nomor pendaftaran dan kode akses otomatis.
- Halaman cek status tanpa akun.
- Permintaan perbaikan data/berkas.
- Verifikasi administrasi.
- Kartu peserta dengan QR code.
- Preview, unduh PDF, dan cetak kartu.
- Panel admin dan hak akses berbasis role.
- Check-in peserta saat seleksi.
- Penilaian seleksi dasar.
- Pengumuman hasil.
- Dashboard statistik.
- Ekspor Excel/CSV dan PDF.
- Audit log aktivitas admin.

### 4.2 Di luar ruang lingkup versi awal

- Pembayaran biaya pendaftaran secara online.
- Aplikasi Android/iOS native.
- Integrasi otomatis dengan database kependudukan.
- Pengenalan wajah.
- Integrasi mesin absensi fisik.
- Pengiriman WhatsApp berbayar melalui provider eksternal.
- Manajemen pertandingan, klasemen, dan turnamen setelah tim terbentuk.

Fitur di luar ruang lingkup dapat dikembangkan sebagai fase lanjutan.

---

## 5. Istilah Penting

| Istilah | Definisi |
|---|---|
| Event/Periode | Satu program pendaftaran atau seleksi futsal pada waktu tertentu. |
| Peserta | Orang yang mengisi dan mengirim formulir pendaftaran. |
| Pendaftar | Record pendaftaran peserta pada sebuah event. |
| Nomor Peserta | Nomor unik yang dibuat sistem untuk setiap pendaftaran. |
| Kode Akses | Kode rahasia untuk membuka halaman status/perbaikan tanpa akun. |
| Verifikator | Admin yang memeriksa biodata dan dokumen. |
| Tim Seleksi | Pelatih/petugas yang menilai kemampuan peserta. |
| Check-in | Pencatatan kehadiran peserta saat kegiatan seleksi. |
| Kartu Peserta | Dokumen identitas seleksi berisi foto, data penting, dan QR code. |

---

## 6. Persona dan Hak Akses

### 6.1 Peserta

Kebutuhan:

- Melihat informasi pendaftaran.
- Mengisi formulir dengan mudah.
- Mengetahui apakah pendaftaran berhasil.
- Memeriksa status dan catatan admin.
- Memperbaiki data jika diminta.
- Mengunduh kartu peserta dan melihat jadwal seleksi.

### 6.2 Super Admin

Hak akses penuh terhadap event, peserta, pengguna admin, pengaturan, laporan, dan audit log.

### 6.3 Admin Pendaftaran

Mengelola event, peserta, pengumuman, kartu, dan laporan. Tidak dapat mengubah pengaturan keamanan utama atau menghapus Super Admin.

### 6.4 Verifikator

Melihat biodata dan berkas yang ditugaskan, kemudian menyetujui, meminta perbaikan, atau menolak pendaftaran.

### 6.5 Pelatih/Tim Seleksi

Melihat peserta yang lolos administrasi, mencatat nilai seleksi, memberikan catatan, dan mengusulkan hasil seleksi. Akses NIK serta dokumen identitas tidak diperlukan.

### 6.6 Petugas Check-in

Memindai QR code atau mencari nomor peserta, melihat identitas minimum, dan mencatat kehadiran.

### 6.7 Viewer/Pimpinan

Hanya melihat dashboard, statistik, dan laporan yang diizinkan tanpa dapat mengubah data.

---

## 7. Status Sistem

### 7.1 Status event

| Status | Perilaku |
|---|---|
| Draft | Belum terlihat oleh publik dan masih dapat dikonfigurasi. |
| Terjadwal | Sudah dipublikasikan, tetapi belum menerima pendaftaran. |
| Dibuka | Formulir dapat diakses dan dikirim. |
| Dijeda | Pengiriman baru dihentikan sementara oleh admin. |
| Ditutup | Tidak menerima pendaftaran baru. Data tetap dapat diproses admin. |
| Selesai | Seluruh proses event telah selesai. |
| Diarsipkan | Tidak muncul pada daftar aktif, tetapi data tetap tersimpan. |

### 7.2 Status pendaftaran peserta

| Status | Arti |
|---|---|
| Draft | Peserta belum mengirim formulir. |
| Menunggu Verifikasi | Formulir telah dikirim dan masuk antrean verifikasi. |
| Perlu Perbaikan | Peserta harus memperbaiki data atau berkas tertentu. |
| Dikirim Ulang | Peserta selesai memperbaiki dan menunggu pemeriksaan ulang. |
| Terverifikasi | Biodata dan berkas dinyatakan valid. |
| Ditolak | Tidak memenuhi persyaratan administrasi. |
| Lolos Administrasi | Diizinkan mengikuti seleksi. |
| Tidak Lolos Administrasi | Tidak dapat mengikuti seleksi. |
| Lolos Seleksi | Diterima berdasarkan hasil akhir. |
| Cadangan | Masuk daftar cadangan. |
| Tidak Lolos Seleksi | Tidak diterima pada hasil akhir. |
| Mengundurkan Diri | Peserta menyatakan tidak melanjutkan. |

Status verifikasi, kehadiran, dan hasil seleksi sebaiknya disimpan sebagai kelompok data berbeda agar status tidak saling menimpa.

---

## 8. Alur Utama Produk

### 8.1 Alur peserta baru

1. Peserta membuka landing page.
2. Sistem menampilkan event yang aktif beserta tanggal, kuota, persyaratan, dan status.
3. Peserta memilih **Daftar Sekarang**.
4. Sistem memeriksa bahwa event masih dibuka, belum melewati kuota, dan berada pada periode yang valid.
5. Peserta mengisi formulir bertahap.
6. Peserta mengunggah foto serta dokumen wajib.
7. Sistem menjalankan validasi format dan kelengkapan.
8. Peserta melihat halaman review.
9. Peserta menyetujui pernyataan kebenaran data dan kebijakan privasi.
10. Peserta mengirim pendaftaran.
11. Sistem membuat nomor peserta, kode akses, QR token, dan bukti pendaftaran.
12. Peserta diarahkan ke halaman sukses dan dapat menyimpan bukti pendaftaran.

### 8.2 Alur verifikasi

1. Pendaftaran baru masuk ke antrean **Menunggu Verifikasi**.
2. Verifikator membuka detail peserta.
3. Verifikator memeriksa identitas, syarat usia, foto, sekolah, posisi, dan dokumen.
4. Verifikator memilih salah satu hasil:
   - Terverifikasi/lolos administrasi.
   - Perlu perbaikan disertai catatan dan field yang harus diperbaiki.
   - Ditolak disertai alasan.
5. Sistem menyimpan riwayat perubahan.
6. Status terbaru tampil pada halaman cek status peserta.
7. Jika diminta perbaikan, peserta mengubah hanya field yang dibuka oleh admin lalu mengirim ulang.

### 8.3 Alur penerbitan kartu

1. Admin menentukan status minimum penerbitan kartu, default **Lolos Administrasi**.
2. Sistem menghasilkan kartu dari template event.
3. Peserta melihat preview dan mengunduh PDF.
4. Admin dapat mencetak satu, beberapa, atau seluruh kartu yang memenuhi syarat.
5. QR code pada kartu berisi token acak, bukan NIK atau data pribadi mentah.

### 8.4 Alur check-in

1. Petugas membuka menu Check-in.
2. Petugas memindai QR code atau memasukkan nomor peserta.
3. Sistem menampilkan foto, nama, nomor peserta, posisi, jadwal, dan status kelayakan.
4. Petugas menekan **Konfirmasi Hadir**.
5. Sistem menyimpan waktu, lokasi/sesi, dan petugas pencatat.
6. Pemindaian ulang menampilkan peringatan bahwa peserta sudah check-in dan tidak membuat data ganda.

### 8.5 Alur penilaian dan hasil

1. Tim seleksi membuka daftar peserta yang hadir.
2. Penilai memasukkan nilai per kriteria dan catatan.
3. Sistem menghitung nilai akhir berdasarkan bobot event.
4. Koordinator melakukan review.
5. Admin menetapkan hasil: lolos, cadangan, atau tidak lolos.
6. Admin dapat mempublikasikan hasil secara serentak atau per peserta.

### 8.6 Alur membuat event baru

1. Admin memilih **Buat Pendaftaran Baru**.
2. Admin mengisi informasi umum, periode, lokasi, kategori usia, dan kuota.
3. Admin menentukan field serta dokumen wajib.
4. Admin mengatur posisi pemain dan kuota per posisi.
5. Admin mengatur format nomor peserta dan template kartu.
6. Admin mengatur kriteria penilaian jika diperlukan.
7. Admin melihat preview landing page, formulir, dan kartu.
8. Event disimpan sebagai Draft.
9. Admin membuka secara manual atau menjadwalkan pembukaan.
10. Ketika waktu berakhir atau kuota penuh, sistem menutup pendaftaran sesuai pengaturan.

---

## 9. Kebutuhan Fungsional

### 9.1 Website publik

**FR-PUB-001** Sistem harus menampilkan identitas penyelenggara, logo, nama event, deskripsi, banner, jadwal, lokasi, persyaratan, tahapan, kontak, serta status pendaftaran.

**FR-PUB-002** Sistem harus menampilkan tombol Daftar Sekarang hanya jika event dapat menerima pendaftaran.

**FR-PUB-003** Jika event belum dibuka, sistem menampilkan waktu pembukaan. Jika ditutup, sistem menampilkan tanggal penutupan dan pesan dari admin.

**FR-PUB-004** Sistem harus menyediakan halaman pengumuman dan detail pengumuman.

**FR-PUB-005** Sistem harus menyediakan halaman kebijakan privasi, syarat pendaftaran, serta kontak panitia.

**FR-PUB-006** Jika terdapat beberapa event aktif, pengguna dapat memilih event yang sesuai.

### 9.2 Formulir pendaftaran

Formulir dibuat dalam beberapa langkah dan menyimpan progres lokal/draft bila memungkinkan.

#### Langkah 1 — Identitas

- Nama lengkap sesuai dokumen.
- NIK, 16 digit.
- NIS/NISN, opsional atau dapat diwajibkan per event.
- Tempat lahir.
- Tanggal lahir.
- Jenis kelamin.
- Alamat lengkap.
- Nomor WhatsApp aktif.
- Email, opsional.

#### Langkah 2 — Sekolah

- Asal sekolah.
- Kelas/tingkat.
- Kabupaten/kota sekolah, bila dibutuhkan.

Admin dapat menyediakan pilihan sekolah atau mengizinkan input manual.

#### Langkah 3 — Data futsal

- Posisi utama: Goalkeeper, Anchor, Flank, atau Pivot.
- Posisi alternatif, opsional.
- Kaki dominan: kanan, kiri, atau keduanya.
- Tinggi badan.
- Berat badan.
- Tim/klub sebelumnya, opsional.
- Lama pengalaman, opsional.
- Prestasi, opsional.

#### Langkah 4 — Berkas

- Foto formal 3×4.
- Kartu pelajar, bila diwajibkan.
- KTP/KK, bila diwajibkan.
- Surat izin orang tua/wali, bila diwajibkan.
- Sertifikat prestasi, opsional.
- Dokumen tambahan yang dapat dikonfigurasi admin.

#### Langkah 5 — Review dan persetujuan

- Ringkasan seluruh data.
- Preview foto dan daftar dokumen.
- Tombol kembali untuk memperbaiki langkah tertentu.
- Checkbox kebenaran data.
- Checkbox persetujuan pemrosesan data pribadi.
- Checkbox persetujuan peraturan event.

**FR-REG-001** Sistem harus menolak pengiriman jika field wajib belum lengkap.

**FR-REG-002** Sistem harus memvalidasi NIK sebanyak 16 digit tanpa menampilkan NIK lengkap setelah tersimpan.

**FR-REG-003** Sistem harus memeriksa usia berdasarkan tanggal lahir dan aturan usia event.

**FR-REG-004** Sistem harus mendeteksi potensi pendaftaran ganda berdasarkan event dan NIK. Duplikasi tidak boleh otomatis dihapus; sistem memberi pesan aman kepada peserta dan menandainya untuk admin.

**FR-REG-005** Foto harus menerima JPG/JPEG/PNG, batas ukuran dapat diatur, dan mendukung crop rasio 3:4.

**FR-REG-006** Dokumen harus divalidasi berdasarkan ekstensi, MIME type, dan ukuran.

**FR-REG-007** Setelah pengiriman berhasil, data utama tidak dapat diubah tanpa kode akses atau pembukaan revisi oleh admin.

**FR-REG-008** Sistem harus membuat nomor pendaftaran unik secara transaksional untuk mencegah nomor ganda.

Format default: `FUTSAL-{TAHUN}-{NOMOR_URUT_6_DIGIT}`.

### 9.3 Cek status peserta

**FR-STS-001** Peserta dapat mengakses status menggunakan nomor pendaftaran dan kode akses.

**FR-STS-002** Sebagai opsi pemulihan, sistem dapat menggunakan nomor pendaftaran, tanggal lahir, dan verifikasi kontak; NIK lengkap tidak digunakan sebagai informasi login tunggal.

**FR-STS-003** Halaman status menampilkan progres, catatan admin, jadwal, lokasi, pengumuman relevan, dan tombol kartu jika sudah tersedia.

**FR-STS-004** Ketika status Perlu Perbaikan, sistem hanya membuka field atau berkas yang ditandai admin.

**FR-STS-005** Setiap pengiriman ulang harus membuat versi/revisi dan tidak menghilangkan data sebelumnya dari audit internal.

### 9.4 Dashboard admin

Dashboard minimal menampilkan:

- Event aktif.
- Total pendaftar.
- Jumlah hari tersisa.
- Kuota terisi dan sisa kuota.
- Menunggu verifikasi.
- Perlu perbaikan.
- Terverifikasi/lolos administrasi.
- Ditolak.
- Kehadiran seleksi.
- Distribusi posisi pemain.
- Distribusi asal sekolah.
- Grafik pendaftaran harian.
- Pendaftar terbaru.
- Aktivitas admin terbaru.

Filter dashboard: event dan rentang tanggal.

### 9.5 Manajemen event

Data event:

- Nama dan kode event.
- Slug/URL publik.
- Deskripsi singkat dan lengkap.
- Banner dan logo.
- Penyelenggara.
- Kategori/kelompok usia.
- Batas usia minimum dan maksimum.
- Waktu mulai dan berakhir pendaftaran.
- Tanggal, waktu, sesi, dan lokasi seleksi.
- Kuota total.
- Kuota per posisi, opsional.
- Kontak panitia.
- Persyaratan dan tahapan.
- Pesan sebelum dibuka, dijeda, dan setelah ditutup.
- Status publikasi.
- Mode penutupan saat kuota penuh.
- Aturan penerbitan kartu.
- Template nomor peserta.
- Template kartu.

**FR-EVT-001** Admin dapat menduplikasi event lama sebagai dasar event baru tanpa menyalin peserta.

**FR-EVT-002** Perubahan tanggal harus memperbarui perilaku buka/tutup otomatis.

**FR-EVT-003** Penutupan manual harus meminta konfirmasi dan alasan internal.

**FR-EVT-004** Event yang mempunyai peserta tidak boleh dihapus permanen melalui UI biasa; gunakan arsip.

### 9.6 Data pendaftar

Kolom tabel utama:

- Checkbox pemilihan.
- Foto mini.
- Nomor peserta.
- Nama lengkap.
- NIK tersamarkan.
- Asal sekolah.
- Posisi utama.
- Tanggal daftar.
- Status verifikasi.
- Status kehadiran.
- Hasil seleksi.
- Aksi.

Filter dan pencarian:

- Nama atau nomor peserta.
- Event.
- Sekolah.
- Posisi.
- Status verifikasi.
- Kehadiran.
- Hasil seleksi.
- Tanggal pendaftaran.
- Indikasi duplikat.
- Kelengkapan dokumen.

Aksi massal yang diizinkan sesuai role:

- Tetapkan verifikator.
- Ubah status administrasi.
- Cetak kartu.
- Ekspor data.
- Kirim/publikasikan pengumuman status.
- Arsipkan data tertentu.

### 9.7 Detail dan verifikasi peserta

Halaman detail menggunakan layout dua area:

- Area ringkas: foto, nama, nomor peserta, posisi, status, QR, tombol kartu.
- Area informasi: tab Biodata, Sekolah, Futsal, Berkas, Verifikasi, Penilaian, dan Riwayat.

Checklist verifikasi dapat dikonfigurasi, dengan default:

- Biodata lengkap.
- NIK sesuai format.
- Usia memenuhi persyaratan.
- Asal sekolah sesuai.
- Foto 3×4 sesuai.
- Dokumen wajib tersedia dan terbaca.
- Posisi pemain valid.

Admin harus mengisi alasan jika memilih Perlu Perbaikan, Ditolak, atau Tidak Lolos Administrasi.

### 9.8 Kartu peserta

Elemen kartu yang dapat dikonfigurasi:

- Logo dan nama penyelenggara.
- Nama event.
- Foto 3×4.
- Nama lengkap.
- Nomor peserta.
- Asal sekolah.
- Posisi utama.
- Jadwal/sesi dan lokasi.
- QR code.
- Status atau label peserta.
- Tanda tangan/stempel digital, opsional.
- Tata tertib di sisi belakang, opsional.

Output:

- Preview web.
- PDF individual.
- Layout kartu ID atau A6.
- Tata letak beberapa kartu pada kertas A4.
- Cetak massal peserta terpilih.

**FR-CARD-001** NIK tidak boleh dicetak pada kartu.

**FR-CARD-002** QR code harus menggunakan token acak yang dapat dicabut, bukan identifier berurutan atau data pribadi.

### 9.9 Check-in

- Pemindaian QR melalui kamera perangkat.
- Input nomor peserta manual sebagai alternatif.
- Pencarian nama untuk kondisi darurat sesuai hak akses.
- Konfirmasi foto dan identitas minimum.
- Status Hadir, Terlambat, Tidak Hadir, atau Izin.
- Waktu check-in otomatis.
- Sesi/lokasi seleksi.
- Nama petugas.
- Catatan opsional.
- Pencegahan check-in ganda.
- Rekap kehadiran real-time.

### 9.10 Penilaian seleksi

Kriteria default:

- Teknik dasar.
- Passing.
- Dribbling.
- Shooting.
- Kecepatan.
- Stamina.
- Kerja sama.
- Pemahaman permainan.
- Kedisiplinan.
- Catatan pelatih.

Admin dapat mengaktifkan/menonaktifkan kriteria, mengubah skala, dan menentukan bobot. Total bobot aktif harus 100% jika perhitungan berbobot digunakan.

Sistem dapat mendukung lebih dari satu penilai. Nilai akhir menggunakan rata-rata atau metode yang dipilih event. Hasil akhir tidak boleh dipublikasikan otomatis hanya berdasarkan nilai tanpa persetujuan admin yang berwenang.

### 9.11 Pengumuman

- Buat, edit, jadwalkan, publikasikan, dan arsipkan pengumuman.
- Target publik, event tertentu, status tertentu, atau peserta tertentu.
- Judul, isi, gambar opsional, waktu publikasi, dan lampiran.
- Pengumuman hasil dapat menampilkan status melalui halaman pribadi agar data peserta tidak dipublikasikan berlebihan.

### 9.12 Laporan dan ekspor

Laporan minimal:

- Rekap seluruh pendaftar.
- Rekap per sekolah.
- Rekap per posisi.
- Rekap status administrasi.
- Rekap kehadiran.
- Rekap nilai dan hasil seleksi.
- Daftar peserta lolos/cadangan/tidak lolos.
- Statistik harian pendaftaran.

Format:

- Excel/XLSX atau CSV untuk data tabel.
- PDF untuk daftar resmi, kartu, dan rekap cetak.

Ekspor harus mengikuti filter yang aktif. Kolom sensitif hanya tersedia bagi role yang berwenang dan harus tersamarkan pada ekspor umum.

### 9.13 Pengguna admin

- CRUD pengguna admin.
- Aktivasi/nonaktifkan akun.
- Penetapan role.
- Reset password yang aman.
- Catatan login terakhir.
- Pencegahan admin menghapus atau menonaktifkan akun sendiri secara tidak sengaja.
- Super Admin terakhir tidak boleh dihapus.

### 9.14 Pengaturan global

- Nama aplikasi.
- Logo, favicon, warna identitas.
- Identitas penyelenggara.
- Alamat dan kontak.
- Zona waktu, default Asia/Jakarta.
- Format nomor peserta default.
- Ukuran dan tipe file.
- Template kartu default.
- Template pesan/status.
- Kebijakan privasi.
- Masa retensi data.
- Pengaturan backup.

### 9.15 Audit log

Aktivitas yang dicatat:

- Login dan kegagalan login penting.
- Pembuatan/perubahan event.
- Pembukaan, penjedaan, dan penutupan pendaftaran.
- Melihat/mengunduh dokumen sensitif bila memungkinkan.
- Perubahan data peserta oleh admin.
- Perubahan status dan hasil.
- Ekspor data.
- Pembuatan/penghapusan pengguna admin.

Setiap log minimal mempunyai pengguna, aksi, objek, waktu, alamat IP bila tersedia, nilai sebelum/sesudah untuk perubahan penting, dan konteks event.

---

## 10. Struktur Navigasi

### 10.1 Navigasi publik

- Beranda
- Pendaftaran
- Persyaratan
- Jadwal & Tahapan
- Pengumuman
- Cek Status
- Kontak
- Kebijakan Privasi

### 10.2 Sidebar panel admin

- Dashboard
- Pendaftaran/Event
- Data Pendaftar
- Verifikasi Berkas
- Kartu Peserta
- Check-in Seleksi
- Penilaian Seleksi
- Hasil Seleksi
- Pengumuman
- Laporan & Ekspor
- Pengguna Admin
- Audit Log
- Pengaturan

Menu harus disembunyikan atau dibuat read-only berdasarkan izin role.

---

## 11. Model Data Konseptual

Entitas utama:

### 11.1 users

- id
- name
- email/username
- password_hash
- status
- last_login_at
- timestamps

### 11.2 roles, permissions, role_user/permission_role

Digunakan untuk otorisasi berbasis role dan permission.

### 11.3 events

- id
- name
- code
- slug
- description
- organizer
- banner_path
- logo_path
- registration_start_at
- registration_end_at
- selection_start_at
- selection_end_at
- location
- total_quota
- min_age
- max_age
- status
- close_when_full
- settings_json
- timestamps

### 11.4 event_positions

- id
- event_id
- position_name
- quota
- active

### 11.5 event_requirements

- id
- event_id
- name
- description
- requirement_type
- required
- allowed_file_types
- max_file_size
- sort_order

### 11.6 participants

Menyimpan identitas orang yang dapat memiliki pendaftaran pada satu atau beberapa event.

- id
- full_name
- nik_encrypted
- nik_hash untuk pencocokan duplikat
- nisn
- birth_place
- birth_date
- gender
- address
- phone
- email
- school_name
- grade
- timestamps

### 11.7 registrations

- id
- event_id
- participant_id
- registration_number
- access_code_hash
- qr_token_hash
- primary_position_id
- secondary_position_id
- dominant_foot
- height_cm
- weight_kg
- previous_club
- experience
- achievements
- registration_status
- verification_status
- selection_status
- submitted_at
- verified_at
- verified_by
- revision_count
- duplicate_flag
- timestamps

Kombinasi event_id dan participant/NIK hash harus mempunyai aturan keunikan yang sesuai kebijakan duplikasi.

### 11.8 registration_documents

- id
- registration_id
- requirement_id/document_type
- original_name
- storage_path
- mime_type
- size
- verification_status
- verification_note
- uploaded_at

### 11.9 registration_revisions

- id
- registration_id
- revision_number
- changed_fields_json
- submitted_at
- reviewed_at
- reviewed_by

### 11.10 verification_logs

- id
- registration_id
- admin_id
- previous_status
- new_status
- checklist_json
- note
- created_at

### 11.11 card_templates

- id
- event_id nullable
- name
- size
- orientation
- design_settings_json
- front_background_path
- back_background_path
- active

### 11.12 selection_sessions

- id
- event_id
- name
- date
- start_time
- end_time
- location
- capacity

### 11.13 attendances

- id
- registration_id
- session_id
- status
- checked_in_at
- checked_in_by
- note

### 11.14 assessment_criteria

- id
- event_id
- name
- description
- min_score
- max_score
- weight
- active

### 11.15 assessments

- id
- registration_id
- criterion_id
- assessor_id
- score
- note
- timestamps

### 11.16 announcements

- id
- event_id nullable
- title
- slug
- content
- audience_type
- publish_at
- status
- created_by

### 11.17 audit_logs

- id
- user_id nullable
- action
- auditable_type
- auditable_id
- old_values_json
- new_values_json
- ip_address
- user_agent
- created_at

---

## 12. Aturan Bisnis

1. Satu NIK hanya boleh mempunyai satu pendaftaran aktif pada event yang sama, kecuali Super Admin menyetujui pengecualian dengan alasan.
2. Nomor peserta bersifat unik untuk seluruh sistem atau minimal unik per event sesuai konfigurasi.
3. Pendaftaran hanya dapat dikirim ketika event berstatus Dibuka, masih dalam jadwal, dan kuota tersedia.
4. Admin dapat membuka kembali event yang ditutup, tetapi tindakan wajib masuk audit log.
5. Draft peserta tidak langsung mengurangi kuota; kuota dihitung saat formulir berhasil dikirim. Implementasi harus menangani pengiriman bersamaan agar kuota tidak terlampaui.
6. Peserta yang belum lolos administrasi tidak dapat memperoleh kartu aktif atau melakukan check-in, kecuali aturan event menyatakan lain.
7. Nilai tidak dapat dimasukkan untuk peserta yang tidak hadir kecuali penilai mempunyai izin khusus dan memberi catatan.
8. Hasil seleksi tidak terlihat oleh peserta sebelum dipublikasikan.
9. Arsip event tidak menghapus data peserta.
10. Dokumen lama tetap tersedia bagi admin berwenang ketika peserta mengirim revisi.
11. Perubahan data sensitif oleh admin harus menyimpan alasan.
12. Semua perhitungan waktu menggunakan zona waktu event, default Asia/Jakarta.

---

## 13. Validasi Formulir

| Field | Validasi utama |
|---|---|
| Nama lengkap | Wajib, panjang wajar, karakter teks yang valid. |
| NIK | Wajib sesuai konfigurasi, tepat 16 digit, dienkripsi saat disimpan. |
| Tempat lahir | Wajib. |
| Tanggal lahir | Wajib, bukan tanggal masa depan, sesuai batas usia. |
| Nomor WhatsApp | Wajib, dinormalisasi ke format internasional bila memungkinkan. |
| Asal sekolah | Wajib. |
| Posisi utama | Wajib dan tersedia pada event. |
| Tinggi/berat | Angka dalam rentang yang masuk akal. |
| Foto | Wajib, JPG/JPEG/PNG, ukuran sesuai pengaturan, crop 3:4. |
| Dokumen | Tipe, MIME, dan ukuran sesuai konfigurasi. |
| Persetujuan | Semua persetujuan wajib harus dicentang. |

Pesan kesalahan harus spesifik, berada dekat field, dan tidak menghapus data yang sudah diisi.

---

## 14. Kebutuhan UI/UX

### 14.1 Prinsip desain

- Profesional, bersih, atletis, dan tidak berlebihan.
- Hierarki informasi jelas; fokus utama pada status dan tindakan berikutnya.
- Tidak memakai terlalu banyak gradient, glow, ilustrasi acak, atau kartu dekoratif yang membuat tampilan seperti AI-generated.
- Warna status konsisten dan tidak hanya bergantung pada warna; selalu sertakan label/icon.
- Formulir memakai stepper dan progress yang jelas.
- Tombol utama hanya satu per konteks layar.
- Tabel desktop berubah menjadi kartu/ringkasan yang mudah digunakan pada ponsel.

### 14.2 Responsivitas

- Mobile: 360–767 px.
- Tablet: 768–1023 px.
- Desktop: 1024 px ke atas.
- Form pendaftaran harus nyaman pada mobile.
- Panel admin diprioritaskan untuk desktop/tablet, tetapi fungsi verifikasi dan check-in tetap dapat digunakan pada mobile.
- Area sentuh minimal sekitar 44×44 px.

### 14.3 Aksesibilitas

- Label form terhubung dengan input.
- Navigasi keyboard untuk fungsi utama.
- Kontras teks memenuhi standar aksesibilitas yang layak.
- Pesan error dibaca teknologi bantu.
- Preview dokumen menyediakan nama file dan tindakan alternatif.

### 14.4 State wajib

Setiap halaman harus mendesain:

- Loading/skeleton.
- Empty state.
- Error state.
- Success state.
- Tidak punya izin.
- Koneksi gagal/retry.
- Data tidak ditemukan.

---

## 15. Kebutuhan Nonfungsional

### 15.1 Performa

- Halaman publik utama ditargetkan tampil cepat pada jaringan seluler.
- Tabel menggunakan pagination server-side.
- Foto dibuatkan thumbnail agar tabel tidak memuat file asli.
- Ekspor besar diproses sebagai background job dan memberikan status progres.
- Query dashboard harus menggunakan indeks dan agregasi yang efisien.

### 15.2 Keandalan

- Pengiriman formulir harus idempotent untuk mencegah pendaftaran ganda akibat klik ulang.
- Pembuatan nomor peserta dan pengurangan kuota dilakukan dalam transaksi database.
- File upload yang gagal tidak boleh membuat record final yang rusak.
- Backup database serta file dilakukan terjadwal.

### 15.3 Kompatibilitas

- Mendukung versi terbaru Chrome, Edge, Firefox, dan Safari yang masih umum digunakan.
- PDF harus dapat dicetak melalui printer standar.
- Kamera QR harus memiliki alternatif input manual jika izin kamera tidak tersedia.

### 15.4 Skalabilitas awal

Sistem minimal dirancang untuk ribuan peserta per event dan dapat ditingkatkan tanpa perubahan arsitektur data mendasar.

---

## 16. Keamanan dan Privasi

NIK, foto, alamat, tanggal lahir, dan dokumen identitas merupakan data pribadi. Persyaratan berikut wajib diterapkan:

1. Seluruh halaman produksi menggunakan HTTPS.
2. Password disimpan menggunakan hashing kuat.
3. NIK disimpan terenkripsi dan mempunyai hash terpisah untuk kebutuhan pencocokan duplikat.
4. NIK ditampilkan tersamarkan, misalnya `3529********1234`, kecuali pada tampilan khusus dengan izin eksplisit.
5. File dokumen disimpan pada private storage, bukan URL publik langsung.
6. Unduhan dokumen menggunakan otorisasi dan tautan sementara.
7. File diperiksa berdasarkan MIME type, ekstensi, ukuran, dan nama aman.
8. QR code tidak berisi NIK, nama, atau data sensitif mentah.
9. Form publik menggunakan rate limiting, proteksi CSRF, dan perlindungan spam/bot yang sesuai.
10. Login admin memakai rate limiting, session timeout, dan dianjurkan mendukung 2FA.
11. Otorisasi harus diperiksa pada server, bukan hanya menyembunyikan tombol di UI.
12. Ekspor data dan unduhan dokumen dicatat dalam audit log.
13. Kebijakan privasi menjelaskan tujuan pemrosesan, pihak yang memiliki akses, masa simpan, dan mekanisme penghapusan/koreksi.
14. Retensi data dapat dikonfigurasi. Penghapusan/anonymization harus melalui prosedur khusus dan tidak dilakukan otomatis tanpa kebijakan resmi.
15. Data sensitif tidak dicatat ke log aplikasi biasa.

---

## 17. Notifikasi

### 17.1 Notifikasi minimal dalam aplikasi

- Pendaftaran berhasil.
- Status sedang diverifikasi.
- Permintaan perbaikan.
- Pendaftaran terverifikasi/ditolak.
- Kartu peserta tersedia.
- Jadwal seleksi.
- Hasil seleksi dipublikasikan.

### 17.2 Kanal lanjutan

- Email.
- WhatsApp melalui provider resmi.
- SMS bila diperlukan.

Notifikasi eksternal harus menggunakan antrean/background job, menyimpan status pengiriman, dan tidak menjadi syarat keberhasilan penyimpanan data utama.

---

## 18. Acceptance Criteria Utama

### AC-01 Membuat dan membuka event

**Given** admin telah mengisi seluruh data wajib event  
**When** admin menekan Buka Pendaftaran  
**Then** event tampil di halaman publik dan formulir dapat dikirim selama jadwal serta kuota mengizinkan.

### AC-02 Pendaftaran berhasil

**Given** event dibuka dan peserta mengisi data valid  
**When** peserta menyetujui pernyataan dan mengirim form  
**Then** sistem menyimpan data, membuat nomor peserta unik, membuat kode akses, menampilkan bukti pendaftaran, dan memasukkan peserta ke antrean verifikasi.

### AC-03 Pendaftaran ganda

**Given** NIK sudah terdaftar pada event yang sama  
**When** formulir lain dikirim dengan NIK tersebut  
**Then** sistem tidak membuat pendaftaran aktif kedua secara diam-diam dan memberikan jalur pemulihan/pengecekan status yang aman.

### AC-04 Pendaftaran ditutup

**Given** waktu pendaftaran berakhir atau admin menutup event  
**When** peserta membuka formulir atau mencoba mengirim data  
**Then** sistem menolak pengiriman dan menampilkan informasi penutupan tanpa kehilangan keamanan data.

### AC-05 Perbaikan berkas

**Given** verifikator menandai foto sebagai perlu diperbaiki  
**When** peserta membuka halaman status menggunakan kode akses  
**Then** hanya foto dan field yang diizinkan dapat diubah, catatan admin terlihat, dan pengiriman ulang membuat revisi baru.

### AC-06 Kartu peserta

**Given** peserta berstatus Lolos Administrasi  
**When** peserta atau admin membuka kartu  
**Then** kartu memuat data event dan peserta yang benar, QR valid, tidak memuat NIK, dan dapat diunduh sebagai PDF.

### AC-07 Check-in QR

**Given** kartu valid dan peserta memenuhi syarat check-in  
**When** petugas memindai QR  
**Then** sistem menampilkan identitas minimum dan menyimpan kehadiran setelah konfirmasi. Pemindaian kedua tidak membuat kehadiran duplikat.

### AC-08 Privasi role pelatih

**Given** pengguna login sebagai Pelatih  
**When** membuka peserta yang dinilai  
**Then** pengguna dapat melihat data olahraga dan penilaian, tetapi tidak dapat melihat NIK lengkap atau dokumen identitas.

### AC-09 Ekspor terfilter

**Given** admin memfilter peserta berdasarkan posisi dan status  
**When** admin mengekspor data  
**Then** file hanya berisi peserta yang sesuai filter dan kolom sensitif mengikuti izin admin.

### AC-10 Data periode lama

**Given** admin membuat event baru dari duplikasi event lama  
**When** event baru disimpan  
**Then** konfigurasi yang dipilih dapat disalin, tetapi peserta dan nomor pendaftaran event lama tidak ikut tersalin atau berubah.

---

## 19. Skenario Edge Case

- Dua peserta mengirim formulir ketika sisa kuota hanya satu.
- Peserta menekan tombol Kirim beberapa kali karena koneksi lambat.
- Upload foto selesai tetapi upload dokumen gagal.
- Tanggal penutupan terjadi ketika peserta sedang mengisi form.
- Admin mengubah kuota menjadi lebih kecil dari jumlah pendaftar yang sudah ada.
- Peserta lupa kode akses.
- QR code dipindai setelah event selesai atau kartu dicabut.
- Peserta mengunggah file dengan ekstensi benar tetapi MIME type tidak sesuai.
- Event diubah dari Ditutup menjadi Dibuka kembali.
- Verifikator dan admin mengubah peserta yang sama pada waktu bersamaan.
- Peserta berpindah sesi setelah kartu sudah dicetak.
- Nilai berasal dari beberapa penilai dan salah satu penilai belum mengisi.

Sistem harus memberikan pesan jelas, menjaga konsistensi data, dan mencatat tindakan penting.

---

## 20. Tahapan Pengembangan

### Fase 1 — Fondasi dan pendaftaran

- Autentikasi admin dan role dasar.
- Manajemen event.
- Landing page.
- Form bertahap.
- Upload private.
- Nomor peserta dan cek status.
- Data pendaftar.

### Fase 2 — Verifikasi dan kartu

- Checklist verifikasi.
- Permintaan perbaikan dan revisi.
- Status administrasi.
- Template serta PDF kartu.
- QR code.
- Audit log utama.

### Fase 3 — Operasional seleksi

- Sesi seleksi.
- Check-in QR.
- Penilaian dan bobot.
- Hasil seleksi.
- Pengumuman.

### Fase 4 — Laporan dan penyempurnaan

- Dashboard statistik lengkap.
- Ekspor Excel/PDF.
- Cetak massal.
- Background job.
- Backup, monitoring, optimasi, dan pengujian keamanan.

---

## 21. Prioritas MoSCoW

### Must Have

- Multi-event/periode.
- Buka/tutup pendaftaran.
- Form identitas, sekolah, futsal, foto 3×4, dan dokumen.
- Verifikasi dan permintaan perbaikan.
- Nomor peserta serta cek status.
- Kartu peserta preview/PDF.
- Data pendaftar, filter, pencarian, dan ekspor dasar.
- Role admin dan perlindungan data sensitif.

### Should Have

- Crop foto 3:4.
- QR check-in.
- Cetak kartu massal.
- Dashboard statistik.
- Penilaian seleksi.
- Audit log lengkap.

### Could Have

- Notifikasi WhatsApp/email.
- Form builder lebih fleksibel.
- Import daftar sekolah.
- Tanda tangan/stempel digital.
- Beberapa tema kartu.
- Penetapan verifikator otomatis.

### Won't Have pada versi pertama

- Payment gateway.
- Aplikasi mobile native.
- Modul turnamen/pertandingan.
- Integrasi kependudukan otomatis.

---

## 22. Rekomendasi Teknis

Rekomendasi ini dapat disesuaikan dengan lingkungan pengembangan:

- Backend: Laravel versi stabil yang kompatibel dengan server.
- Frontend: Inertia.js + React + TypeScript.
- Styling: Tailwind CSS dengan komponen internal yang konsisten.
- Database: MySQL atau PostgreSQL.
- Authentication: Laravel authentication dengan session-based auth untuk admin.
- Authorization: Role dan permission berbasis server.
- File storage: private local storage untuk awal atau object storage S3-compatible untuk skala produksi.
- Queue: database/Redis queue untuk PDF, ekspor, dan notifikasi.
- PDF: generator PDF yang mendukung layout kartu cetak secara konsisten.
- QR: library QR server-side dengan token acak.
- Spreadsheet: library ekspor XLSX yang kompatibel dengan versi framework/PHP.

Keputusan final versi Laravel, library, dan infrastruktur harus mengikuti kompatibilitas hosting serta hasil technical discovery sebelum implementasi.

---

## 23. Pengujian Minimum

- Unit test aturan usia, kuota, status, nomor peserta, dan perhitungan nilai.
- Feature test pendaftaran berhasil/gagal.
- Feature test pendaftaran ganda dan race condition kuota.
- Authorization test setiap role.
- Upload security test.
- Test permintaan perbaikan dan revisi.
- Test QR aktif, tidak valid, sudah digunakan, dan dicabut.
- Test ekspor dengan filter dan masking.
- Test cetak PDF pada ukuran yang didukung.
- Responsive test pada mobile, tablet, dan desktop.
- Uji backup dan pemulihan dasar sebelum produksi.

---

## 24. Definition of Done

Sebuah fitur dianggap selesai apabila:

1. Kebutuhan fungsional dan acceptance criteria terpenuhi.
2. Validasi frontend dan backend tersedia.
3. Otorisasi server-side diterapkan.
4. Loading, empty, success, dan error state tersedia.
5. Tampilan responsif telah diuji.
6. Aktivitas sensitif masuk audit log.
7. Test utama lulus.
8. Tidak ada data pribadi sensitif yang bocor melalui URL, QR, log, atau tampilan tanpa izin.
9. Dokumentasi penggunaan admin diperbarui.
10. Fitur telah diuji pada data event nyata atau data simulasi representatif.

---

## 25. Keputusan Produk yang Digunakan dalam PRD Ini

- Peserta tidak wajib membuat akun pada MVP.
- Satu sistem mendukung banyak event/periode.
- Kartu diterbitkan setelah peserta lolos administrasi secara default.
- QR digunakan untuk verifikasi/check-in, bukan untuk menyimpan biodata mentah.
- Data NIK dienkripsi, dimasking, dan aksesnya dibatasi.
- Event yang sudah memiliki peserta diarsipkan, bukan dihapus melalui alur normal.
- Penilaian seleksi disediakan sebagai modul operasional, tetapi publikasi hasil tetap membutuhkan persetujuan admin.

---

## 26. Pertanyaan untuk Finalisasi Sebelum Development

Jawaban berikut tidak menghalangi pembuatan MVP, tetapi perlu diputuskan sebelum implementasi final:

1. Nama resmi aplikasi dan penyelenggara.
2. Apakah pendaftaran khusus pelajar atau juga untuk masyarakat umum.
3. Rentang usia dan apakah berbeda untuk tiap event.
4. Dokumen wajib selain foto 3×4.
5. Apakah NIK benar-benar wajib untuk seluruh kategori peserta.
6. Apakah kartu langsung tersedia setelah verifikasi atau harus menunggu persetujuan admin tambahan.
7. Ukuran kartu final: ID card, A6, atau keduanya.
8. Apakah hasil seleksi menggunakan nilai berbobot atau keputusan pelatih tanpa perhitungan otomatis.
9. Apakah notifikasi WhatsApp/email masuk MVP atau fase lanjutan.
10. Identitas visual: logo, warna, tipografi, dan contoh desain kartu.

---

**Akhir dokumen**
