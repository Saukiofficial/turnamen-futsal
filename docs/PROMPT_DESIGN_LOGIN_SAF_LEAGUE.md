# PROMPT IMPLEMENTASI HALAMAN LOGIN SAF LEAGUE

## Instruksi Utama untuk AI Agent

Anda bertindak sebagai **Senior UI/UX Designer, Product Designer, dan Frontend Engineer**. Tugas Anda adalah merancang dan mengimplementasikan ulang halaman login admin **SAF LEAGUE — Portal Seleksi Futsal** agar tampil profesional, clean, aman, responsif, dan konsisten dengan landing page SAF League.

Jangan menghasilkan halaman login bawaan Laravel/Breeze yang hanya berupa logo besar dan card putih di tengah. Gunakan desain split-screen desktop yang matang serta versi mobile yang benar-benar disusun ulang.

Implementasikan langsung pada project. Jangan hanya memberikan screenshot, konsep, atau snippet.

---

# 1. Tujuan halaman

Halaman login digunakan khusus oleh:

- Super Admin.
- Admin pendaftaran.
- Verifikator.
- Pelatih/tim seleksi.
- Petugas check-in.

Peserta umum tidak login melalui halaman ini. Karena itu, gunakan copy yang tegas bahwa halaman hanya untuk panitia berwenang.

---

# 2. Audit sebelum mengubah kode

Sebelum implementasi:

1. Periksa stack project, route login, controller/action autentikasi, middleware, validasi, session, CSRF, dan redirect setelah login.
2. Identifikasi apakah project memakai Laravel Breeze, Fortify, Jetstream, Inertia React, atau sistem autentikasi lain.
3. Pertahankan seluruh business logic login yang sudah berfungsi.
4. Jangan mengubah nama field backend tanpa menyesuaikan request dan validasi.
5. Pertahankan fitur remember me, lupa password, error autentikasi, dan status session jika sudah tersedia.
6. Jangan mengganti route dengan hardcoded URL.
7. Gunakan logo SAF League asli dari asset project. Jangan menggambar ulang atau menggantinya dengan logo generik.
8. Gunakan background lokal yang dioptimalkan; jangan hotlink gambar eksternal.
9. Jangan menambahkan login sosial karena tidak dibutuhkan.

---

# 3. Arah visual

## Karakter desain

- Portal administrasi olahraga resmi.
- Profesional, aman, dan dapat dipercaya.
- Editorial dan tenang.
- Memiliki atmosfer lapangan futsal tanpa menjadi poster pertandingan.
- Form sederhana dan mudah dipahami.
- Tidak terasa seperti template SaaS generik.

## Hindari

- AI slop.
- Card login mengambang di tengah layar kosong.
- Logo sangat besar di atas card.
- Gradient biru terang.
- Glassmorphism.
- Neon/glow.
- Ilustrasi 3D.
- Blob dekoratif.
- Ikon emoji.
- Banyak card kecil.
- Aksen emas berlebihan.
- Latar yang terlalu ramai.
- Tipografi gaming/esports.
- Animasi agresif.

---

# 4. Design system

## 4.1 Warna

Gunakan:

```css
--navy-950: #071320;
--navy-900: #0C1929;
--navy-800: #14253A;
--primary-700: #1D4ED8;
--primary-600: #2557D6;
--primary-50: #EEF4FF;
--amber-500: #D89A16;
--success-600: #169B62;
--danger-600: #DC2626;
--danger-50: #FEF2F2;
--ink: #101828;
--text: #344054;
--muted: #667085;
--border: #DDE3EA;
--surface: #FFFFFF;
--warm-white: #F7F7F5;
```

Aturan:

- Navy digunakan pada panel brand.
- Cobalt digunakan untuk primary action dan focus ring.
- Amber hanya menjadi aksen kecil identitas SAF League.
- Jangan memakai gradient pada button.
- Error menggunakan merah yang restrained.

## 4.2 Font

Gunakan **Inter** atau **Geist**.

```css
font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Ukuran desktop:

- Headline panel brand: 46–52 px, weight 700, line-height 1.08.
- Judul login: 34–38 px, weight 700.
- Eyebrow: 12–13 px, weight 700, letter-spacing 0.15em.
- Body: 15–17 px.
- Label: 13–14 px, weight 600.
- Input: 14–15 px.
- Helper/error: 12–13 px.

Ukuran mobile:

- Judul login: 28–32 px.
- Body: 14–15 px.
- Label/input tetap minimal 14 px.

## 4.3 Radius dan shadow

- Input/button: radius 8–10 px.
- Checkbox: radius 4–5 px.
- Tidak ada card login besar pada desktop.
- Dropdown/popover: radius 10–12 px.
- Shadow hanya jika diperlukan dan sangat tipis.

## 4.4 Ikon

Gunakan satu library outline, disarankan Lucide React:

- `ArrowLeft` — kembali.
- `Mail` — email.
- `LockKeyhole` — password.
- `Eye` / `EyeOff` — tampilkan password.
- `ArrowRight` — login.
- `ShieldCheck` — keamanan.
- `FileCheck2` — verifikasi.
- `ChartNoAxesColumnIncreasing` — aktivitas.

Ukuran input icon 18–20 px. Jangan mencampur gaya ikon.

---

# 5. Layout desktop

Gunakan split-screen penuh dengan rasio sekitar:

- Panel kiri: 56–58%.
- Panel kanan: 42–44%.

Tinggi minimum 100vh. Tidak boleh ada scroll vertikal pada layar desktop normal seperti 1366×768 kecuali viewport sangat pendek.

## 5.1 Panel kiri — brand dan atmosfer

Panel kiri menggunakan background foto lapangan futsal indoor kosong.

Kriteria foto:

- Lapangan indoor nyata.
- Tidak ada pemain atau penonton yang menjadi fokus.
- Pencahayaan arena lembut.
- Komposisi mempunyai ruang kosong untuk teks.
- Tidak bergaya poster atau gaming.
- Resolusi cukup untuk desktop.

Tambahkan overlay navy kuat agar teks putih terbaca:

```css
background:
  linear-gradient(rgba(7, 19, 32, 0.84), rgba(7, 19, 32, 0.90)),
  url(...);
```

Gradient di sini hanya berfungsi sebagai overlay keterbacaan, bukan dekorasi warna.

### Posisi brand

Letakkan di kiri atas dengan margin 64–80 px dari tepi desktop besar:

- Logo SAF League 72–82 px.
- Separator vertikal tipis.
- `SAF LEAGUE` ukuran 24–28 px, letter-spacing ringan.
- Subjudul `PORTAL SELEKSI FUTSAL` ukuran 12–13 px.

Jangan mengubah proporsi logo.

### Konten utama kiri

Posisikan secara vertikal di sekitar tengah panel, tidak terlalu ke atas.

Urutan:

1. Garis aksen amber pendek, sekitar 44 px.
2. Eyebrow `PORTAL ADMINISTRASI`.
3. Headline `Kelola proses seleksi dengan lebih terarah.`
4. Deskripsi:
   `Akses khusus panitia untuk memantau pendaftar, memverifikasi data, mencetak kartu peserta, dan mengelola proses seleksi.`
5. Tiga benefit.

Benefit:

- ShieldCheck — `Data peserta terlindungi`.
- FileCheck2 — `Verifikasi terstruktur`.
- Chart icon — `Aktivitas admin tercatat`.

Tampilan benefit:

- Satu kolom vertikal.
- Icon tile transparan/navy muda sekitar 44–48 px.
- Jarak antaritem 18–22 px.
- Tidak dibungkus card.

### Footer panel kiri

Di kiri bawah:

- Garis horizontal tipis.
- `Satu portal untuk seluruh proses seleksi.`
- `© 2026 SAF League` atau tahun dinamis.

Gunakan posisi absolute/flex yang aman tanpa menyebabkan overlap pada viewport pendek.

---

# 6. Panel kanan — form login

Gunakan background warm white `#F7F7F5` atau putih yang sedikit hangat.

Konten form:

- Max-width 420–440 px.
- Ditempatkan di tengah secara vertikal.
- Padding horizontal desktop 56–72 px.
- Jangan dibungkus card putih mengambang.

## 6.1 Link kembali

Letakkan di atas form:

- Icon ArrowLeft.
- Teks `Kembali ke Beranda`.
- Warna muted.
- Hover menjadi navy/primary.
- Route harus menggunakan route landing page yang benar.

## 6.2 Identitas kecil

Tampilkan logo SAF League kecil 64–72 px di atas eyebrow form.

Logo tidak boleh sebesar logo panel kiri dan tidak boleh membuat ruang kosong berlebihan.

## 6.3 Heading

Urutan:

- Eyebrow `AKSES PANITIA`.
- Judul `Masuk ke Panel Admin`.
- Deskripsi `Gunakan akun yang telah diberikan oleh administrator.`

Jarak:

- Logo ke eyebrow: 24–28 px.
- Eyebrow ke judul: 8–10 px.
- Judul ke deskripsi: 10–12 px.
- Deskripsi ke form: 28–32 px.

---

# 7. Form login

## 7.1 Email

- Label `Email`.
- Input type email.
- Placeholder `nama@domain.com`.
- Mail icon di kiri.
- Autocomplete `email` atau `username` sesuai sistem.
- Tinggi 48–50 px.
- Padding kiri menyesuaikan icon.
- Input tidak boleh otomatis uppercase.

Helper text opsional ketika tidak error:

`Masukkan alamat email Anda.`

## 7.2 Password

- Label `Password`.
- Input type password.
- Lock icon di kiri.
- Eye/EyeOff button di kanan.
- Autocomplete `current-password`.
- Tinggi 48–50 px.
- Tombol eye mempunyai aria-label.
- Tombol eye tidak menyebabkan submit.

Helper text opsional:

`Masukkan password Anda.`

## 7.3 Remember dan lupa password

Gunakan satu baris:

- Kiri: checkbox `Ingat saya`.
- Kanan: link `Lupa password?`.

Checkbox:

- Area sentuh minimal 40–44 px meskipun visual checkbox 20 px.
- Gunakan label yang dapat diklik.

Link lupa password hanya tampil jika route tersedia.

## 7.4 Button submit

- Full width.
- Tinggi 48–50 px.
- Background solid cobalt.
- Teks `Masuk ke Panel`.
- ArrowRight icon di kanan.
- Radius 9 px.
- Hover sedikit lebih gelap.
- Tidak menggunakan gradient, glow, atau shadow besar.

Loading state:

- Disable button.
- Spinner kecil.
- Teks berubah menjadi `Memproses...`.
- Pertahankan lebar dan tinggi button.
- Cegah double submit.

## 7.5 Catatan keamanan

Di bawah button gunakan divider tipis di kiri dan kanan, lalu:

- ShieldCheck icon.
- Teks `Akses ini hanya untuk panitia yang berwenang.`

Tidak perlu card tersendiri.

## 7.6 Bantuan

Bagian bawah:

`Mengalami kendala akses? Hubungi Super Admin`

Jika belum ada route/kontak support, jangan membuat nomor atau email palsu. Gunakan teks tanpa link atau arahkan ke mekanisme existing.

---

# 8. State validasi dan error

## Error field

- Border input menjadi merah.
- Focus ring merah transparan.
- Pesan error tepat di bawah field.
- Gunakan icon `CircleAlert` hanya jika membantu.
- Pesan tidak menggeser layout secara ekstrem.

Contoh:

- `Email wajib diisi.`
- `Format email tidak valid.`
- `Password wajib diisi.`

## Kredensial tidak valid

Tampilkan alert ringkas di atas form:

- Background merah sangat muda.
- Border merah tipis.
- Judul `Login gagal`.
- Pesan `Email atau password yang Anda masukkan tidak sesuai.`

Jangan menjelaskan apakah email terdaftar atau tidak.

## Session status

Jika terdapat pesan reset password atau logout berhasil, tampilkan alert success ringan di atas form.

## Terlalu banyak percobaan

Tampilkan:

`Terlalu banyak percobaan login. Silakan coba kembali beberapa saat lagi.`

## Caps Lock

Opsional: tampilkan hint kecil `Caps Lock aktif` ketika terdeteksi.

---

# 9. Layout mobile

Versi mobile harus diatur ulang, bukan hanya split layout diperkecil.

## Ukuran 360–767 px

- Gunakan satu kolom.
- Form menjadi fokus utama.
- Background warm white.
- Panel foto desktop tidak ditampilkan penuh.
- Gunakan header brand navy ringkas di atas, tinggi sekitar 150–190 px.

Header mobile:

- Logo SAF League 56–64 px.
- Nama SAF League.
- Eyebrow `PORTAL ADMINISTRASI`.
- Boleh menggunakan crop foto lapangan sebagai background dengan overlay kuat.
- Jangan menampilkan headline panjang panel kiri pada mobile jika membuat halaman terlalu tinggi.

Form mobile:

- Padding 20–24 px.
- Link kembali di atas heading atau tepat di bawah header.
- Judul 28–32 px.
- Semua input full-width.
- Tinggi input/button minimal 48 px.
- Remember dan lupa password tetap satu baris jika muat; jika tidak, stack dengan gap 12 px.
- Button full-width.
- Security note dan bantuan tetap terlihat.
- Tidak ada horizontal overflow.
- Gunakan safe-area padding.

Pada layar sangat pendek, halaman boleh scroll secara natural.

---

# 10. Layout tablet

Ukuran 768–1023 px:

- Split layout dapat menggunakan 45:55 atau 42:58.
- Panel kiri disederhanakan.
- Headline kiri turun menjadi 34–40 px.
- Benefit dapat diringkas menjadi dua atau tiga baris compact.
- Form max-width tetap 400–420 px.
- Jika landscape terlalu sempit, gunakan layout mobile/tablet satu kolom.

---

# 11. Responsivitas wajib

Uji minimal:

- 360×800.
- 390×844.
- 768×1024.
- 1024×768.
- 1366×768.
- 1440×900.
- 1920×1080.

Pastikan:

- Logo tidak pecah.
- Headline tidak terpotong.
- Benefit tidak menabrak copyright.
- Form tetap terlihat tanpa zoom.
- Button tidak terpotong.
- Tidak ada overflow horizontal.
- Background menggunakan `cover` dengan focal point yang tepat.

---

# 12. Accessibility

- Gunakan semantic `<main>`, `<form>`, dan heading yang benar.
- Setiap input memiliki label nyata.
- Jangan menggunakan placeholder sebagai satu-satunya label.
- Error menggunakan `aria-describedby`.
- Alert login gagal menggunakan `role="alert"`.
- Focus-visible tidak boleh dihilangkan.
- Tab order logis.
- Eye toggle mempunyai aria-label yang berubah.
- Checkbox dapat digunakan melalui keyboard.
- Kontras teks minimal layak.
- Background image tidak membawa informasi penting.
- Hormati `prefers-reduced-motion`.

---

# 13. Keamanan autentikasi

Desain tidak boleh merusak keamanan existing.

Pastikan:

- Menggunakan POST ke route login yang benar.
- CSRF protection tetap aktif.
- Validasi backend tetap menjadi sumber kebenaran.
- Password tidak pernah disimpan di localStorage.
- Remember me menggunakan mekanisme framework.
- Rate limiting login tetap aktif.
- Session fixation dicegah melalui regenerasi session setelah login.
- Pesan error tidak membocorkan keberadaan akun.
- Redirect setelah login mengikuti role atau konfigurasi existing.
- Redirect intended URL tetap dipertahankan jika tersedia.
- Tombol submit mencegah klik berulang tetapi tidak menggantikan keamanan server.

Jangan mencetak email/password ke console atau log frontend.

---

# 14. Animasi dan interaksi

Gunakan animasi minimal:

- Input focus: 120–160 ms.
- Button hover: 140–180 ms.
- Eye toggle: tanpa animasi berlebihan.
- Form dapat fade-in sangat halus maksimal 250 ms.
- Background tidak parallax.

Jangan gunakan:

- Bounce.
- Floating card.
- Logo berputar.
- Glow pulse.
- Animasi teks per huruf.
- Partikel bola.

---

# 15. Performa

- Gunakan background WebP/AVIF.
- Sediakan fallback JPEG jika perlu.
- Ukuran background disesuaikan dengan breakpoint.
- Jangan mengirim gambar 4K ke mobile.
- Preload hanya asset hero/login yang benar-benar penting.
- Logo menggunakan SVG/PNG transparan teroptimasi.
- Hindari library animasi berat.
- Pastikan layout tidak bergeser saat font/gambar dimuat.

---

# 16. Struktur komponen yang disarankan

Sesuaikan dengan arsitektur project:

```text
auth/
  LoginPage
  AuthBrandPanel
  LoginForm
  PasswordInput
  AuthAlert
  AuthSecurityNote
```

Komponen umum:

```text
Logo
Button
Checkbox
FormField
Input
FieldError
```

Jangan membuat terlalu banyak komponen kecil tanpa manfaat. Prioritaskan reuse dan kejelasan.

---

# 17. Copywriting final

Gunakan teks:

## Panel kiri

- `SAF LEAGUE`
- `PORTAL SELEKSI FUTSAL`
- `PORTAL ADMINISTRASI`
- `Kelola proses seleksi dengan lebih terarah.`
- `Akses khusus panitia untuk memantau pendaftar, memverifikasi data, mencetak kartu peserta, dan mengelola proses seleksi.`
- `Data peserta terlindungi`
- `Verifikasi terstruktur`
- `Aktivitas admin tercatat`
- `Satu portal untuk seluruh proses seleksi.`

## Form

- `Kembali ke Beranda`
- `AKSES PANITIA`
- `Masuk ke Panel Admin`
- `Gunakan akun yang telah diberikan oleh administrator.`
- `Email`
- `nama@domain.com`
- `Password`
- `Ingat saya`
- `Lupa password?`
- `Masuk ke Panel`
- `Memproses...`
- `Akses ini hanya untuk panitia yang berwenang.`
- `Mengalami kendala akses? Hubungi Super Admin`

Gunakan bahasa Indonesia. Jangan menggunakan `Remember me`, `Forgot password`, atau `Log in` jika interface lainnya berbahasa Indonesia.

---

# 18. Larangan implementasi

Jangan:

1. Membuat card putih besar di tengah layar abu-abu.
2. Menampilkan logo besar tanpa konteks.
3. Mengganti logo SAF League.
4. Mengubah autentikasi existing tanpa kebutuhan.
5. Menambahkan register akun admin publik.
6. Menambahkan login sosial.
7. Menggunakan gradient button.
8. Menggunakan background terlalu terang atau ramai.
9. Menampilkan password secara default.
10. Menghilangkan lupa password jika route tersedia.
11. Menggunakan placeholder sebagai label.
12. Membuat mobile split-screen sempit.
13. Menambahkan data dummy.
14. Mengarang nomor kontak support.
15. Menghapus error/session status dari backend.

---

# 19. Urutan pengerjaan

## Tahap 1 — Audit autentikasi

- Cek route dan action login.
- Cek props/error/status.
- Cek logo dan asset background.

## Tahap 2 — Layout

- Buat split desktop.
- Buat header brand mobile.
- Atur responsive breakpoints.

## Tahap 3 — Form

- Email.
- Password + eye toggle.
- Remember me.
- Lupa password.
- Submit/loading.

## Tahap 4 — Feedback

- Field error.
- Login gagal.
- Session success.
- Rate limit.

## Tahap 5 — QA

- Uji login benar/salah.
- Uji keyboard.
- Uji responsive.
- Uji loading/double submit.
- Uji redirect.

---

# 20. Acceptance criteria

Implementasi selesai jika:

1. Desktop memakai split-screen brand/form.
2. Mobile memakai satu kolom dengan header brand ringkas.
3. Logo SAF League asli digunakan tanpa distorsi.
4. Copy sesuai bahasa Indonesia.
5. Email dan password terhubung ke autentikasi existing.
6. Eye toggle bekerja.
7. Remember me bekerja.
8. Lupa password menuju route benar jika tersedia.
9. Loading mencegah double submit.
10. Error backend tampil dengan benar.
11. Login berhasil menuju halaman sesuai role/configuration.
12. Tidak ada horizontal overflow.
13. Tampilan diuji pada desktop, tablet, dan mobile.
14. Keyboard focus terlihat.
15. Tidak ada error console.
16. Password tidak tersimpan atau tercetak tidak aman.
17. Desain tidak terlihat seperti login bawaan Laravel atau template AI generik.

---

# 21. Output yang wajib diberikan AI Agent

Setelah implementasi, laporkan:

1. Ringkasan perubahan.
2. Daftar file yang dibuat/diubah.
3. Route login, lupa password, dan redirect yang digunakan.
4. Komponen reusable yang dibuat.
5. Asset background dan optimasinya.
6. State error/loading yang didukung.
7. Hasil uji desktop, tablet, dan mobile.
8. Hasil uji login berhasil dan gagal.
9. Dependency baru jika ada beserta alasannya.
10. Bagian yang belum selesai atau memerlukan keputusan.

Lakukan implementasi nyata dan verifikasi hasil akhir. Jangan hanya memberikan snippet.

