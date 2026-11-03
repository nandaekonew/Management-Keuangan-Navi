# 📖 Panduan Lengkap Setup Database Google Drive & Aplikasi Keuangan Suami Istri (v5.2 Super)

Aplikasi ini dirancang khusus untuk manajemen keuangan rumah tangga yang transparan antara **Suami dan Istri**, dengan database terpusat di **Google Drive (Google Spreadsheet)**, frontend web modern yang responsif diakses multi-user dari berbagai perangkat (Android, iOS, laptop), dukungan **PWA Offline penuh**, serta 12 fitur unggulan baru.

---

## 📑 Daftar Isi
1. [12 Fitur Unggulan Versi 5.2](#1-12-fitur-unggulan-versi-52)
2. [Rincian 10 Struktur Tabel di Google Spreadsheet](#2-rincian-10-struktur-tabel-di-google-spreadsheet)
3. [Langkah Pemasangan Google Apps Script (Backend)](#3-langkah-pemasangan-google-apps-script-backend)
4. [Menghubungkan Aplikasi Web dengan Google Sheets](#4-menghubungkan-aplikasi-web-dengan-google-sheets)
5. [Logika Akuntansi Transfer Dompet & Pemasukan Real](#5-logika-akuntansi-transfer-dompet--pemasukan-real)
6. [Panduan Penggunaan 12 Fitur Baru](#6-panduan-penggunaan-12-fitur-baru)
7. [Panduan Instalasi PWA & Pemakaian Offline di HP](#7-panduan-instalasi-pwa--pemakaian-offline-di-hp)

---

## 1. 12 Fitur Unggulan Versi 5.2

### Prioritas Tinggi
1. 🎯 **Batas Anggaran (Budget) per Kategori**:
   - Limit bulanan per kategori belanja (misalnya: *"Makan & Jajan di Luar"* maksimal Rp 1,5 juta).
   - Real-time progress bar penggunaan anggaran dengan indikator warna visual:
     - Hijau (0–74%): Aman.
     - Kuning/Amber (75–99%): Mendekati limit.
     - Merah (≥100%): Peringatan bahaya *"⚠️ Melebihi Limit!"*.
   - Widget mini Pos Anggaran langsung tampil di Dashboard dan tab lengkap di *Anggaran & Target*.
2. 🏆 **Target Tabungan Impian (Savings Goals)**:
   - Rencana simpanan terarah seperti **Dana Darurat Keluarga**, **Liburan Akhir Tahun**, atau **DP Rumah Impian**.
   - Dilengkapi nominal target, dana terkumpul, tenggat waktu (deadline), ikon emoji, dan persentase pencapaian.
   - Tombol **+ Setor Tabungan** langsung menambah tabungan dan mencatat potongan kas dari rekening yang dipilih.
3. 🔔 **Pengingat Jatuh Tempo (Due Date Scanner & Alerts)**:
   - Kartu notifikasi otomatis di bagian atas Dashboard.
   - Mendeteksi tagihan rutin dan cicilan hutang yang jatuh tempo dalam 3 hari ke depan atau sudah terlewat (overdue).
   - Dilengkapi tombol 1-klik untuk pelunasan langsung tanpa harus mencari di menu lain.
4. 📱 **PWA Penuh & Offline Resilient**:
   - Dilengkapi Service Worker (`sw.js`) dan `manifest.json`.
   - Aplikasi dapat dipasang (*Install to Home Screen*) di Android & iOS seperti aplikasi *native* dari Play Store/App Store.
   - Tetap dapat dibuka dan dipakai mencatat transaksi walau koneksi internet terputus (mode offline). Data akan tersinkronisasi otomatis saat online kembali.

### Laporan dan Analisis
5. 📈 **Perbandingan Bulan Ini vs Bulan Lalu (MoM Comparison)**:
   - Evaluasi pengeluaran keluarga bulan ini dibanding bulan lalu (persentase naik/hemat).
   - Evaluasi pemasukan real keluarga dibanding bulan lalu.
   - Deteksi otomatis **Kategori Lonjakan Tertinggi (Top Mover)**: mengetahui pos pengeluaran apa yang paling melonjak tinggi.
6. 📊 **Grafik Tren Arus Kas 6–12 Bulan**:
   - Tombol toggle cepat **[ 6 Bulan ]** vs **[ 12 Bulan ]**.
   - Memantau tren riwayat Pemasukan Real, Pengeluaran, dan Arus Kas Bersih (Net Cashflow).
7. 📄 **Laporan PDF Bulanan Resmi Siap Cetak**:
   - Format cetak profesional yang bersih dari tombol navigasi (`@media print`).
   - Berisi ringkasan arus kas, saldo kas gabungan, rincian pengeluaran per kategori, kepatuhan pos anggaran, dan **dua kolom tanda tangan resmi (Suami & Istri)**.
8. 🤖 **Ringkasan Otomatis AI & Konsultasi Keuangan**:
   - **Skor Kesehatan Keuangan (0–100)**: Mengevaluasi kesehatan finansial berdasarkan rasio tabungan, surplus kas, dan beban hutang.
   - **Evaluasi Aturan 50 / 30 / 20**: Menghitung alokasi riil Kebutuhan Pokok (50%), Keinginan (30%), dan Tabungan (20%).
   - **Saran Berhemat Cerdas**: AI menganalisis kebocoran belanja secara kontekstual dalam bahasa sehari-hari.
   - **Tanya AI Finansial**: Konsultasi tanya jawab seputar tips finansial dan percepatan tabungan.

### Kemudahan Input
9. 🧾 **Foto Struk / Nota & Smart OCR Amount Reader**:
   - Lampirkan foto bukti struk belanja langsung dari kamera HP atau galeri.
   - Kompresi gambar otomatis via HTML5 Canvas (maksimal 800px, kualitas 0.7 JPEG) sehingga hemat memori dan cepat.
   - Tombol **🤖 Baca Struk**: Memindai struk belanja secara cerdas dan otomatis mengisikan nominal ke formulir transaksi.
   - Ikon struk di daftar transaksi untuk melihat foto ukuran penuh di modal penampil struk.
10. 🏷️ **Kategori Kustom yang Bisa Diatur Sendiri**:
    - Kelola kategori secara dinamis (Tambah, Ubah, Hapus) lengkap dengan pilihan ikon emoji dan tipe transaksi (Pemasukan Real, Pengeluaran, Transfer Dompet).
    - Seluruh formulir di aplikasi otomatis menyesuaikan dengan daftar kategori kustom ini.
11. ⚡ **Template Transaksi Favorit (1-Ketukan)**:
    - Tombol cepat (*chips*) di bawah banner Dashboard untuk transaksi yang sering berulang (seperti: *⛽ Bensin Motor*, *🥬 Belanja Sayur Pagi*, *☕ Kopi Berdua*, *⚡ Token Listrik*).
    - Sekali ketuk langsung membuka formulir dengan data yang sudah terisi otomatis.
    - Checkbox *"⭐ Simpan sebagai Template Favorit"* saat mencatat transaksi baru.

### Tampilan & Kenyamanan
12. 🌙 **Mode Gelap (Dark Mode) Penuh**:
    - Tombol sakelar ganti tema (ikon bulan/matahari) di header atas.
    - Mengubah seluruh tema aplikasi (latar belakang, kartu, tabel, formulir, teks, dan grid diagram Chart.js) ke palet gelap elegan.
    - Pengaturan tema tersimpan secara permanen di browser (`localStorage`).

---

## 2. Rincian 10 Struktur Tabel di Google Spreadsheet

File Spreadsheet di Google Drive Anda memiliki 10 Sheet yang terstruktur rapi:

1. 📄 **`Transaksi`**: Mencatat ID, Tanggal, Waktu, Pencatat (Suami/Istri), Jenis, Kategori, Jumlah, Dari Dompet, Ke Dompet, Keterangan, Lampiran Foto Struk, Created At.
2. 📄 **`Pengeluaran_Rutin`**: ID, Nama Pengeluaran, Nominal, Kategori, Tanggal Tempo (1-31), Penanggung Jawab, Status Bulan Ini, Terakhir Dibayar, Catatan.
3. 📄 **`Hutang_Piutang`**: ID, Tipe (Hutang/Piutang), Nama Pihak, Nominal Total, Nominal Terbayar, Sisa Nominal, Tanggal Pinjam, Jatuh Tempo, Penanggung Jawab, Status, Catatan.
4. 📄 **`Riwayat_Cicilan`**: ID, Hutang ID, Tanggal, Jumlah, Pembayar, Dompet, Catatan.
5. 📄 **`Pengguna`**: Username, Role, Nama Lengkap, PIN Keamanan, Saldo Awal, Tema Warna.
6. 📄 **`Dompet`**: ID, Nama Dompet, Pemilik, Saldo Awal, Keterangan.
7. 📄 **`Anggaran`**: ID, Kategori, Limit Bulanan, Catatan.
8. 📄 **`Target_Tabungan`**: ID, Nama Target, Target Nominal, Terkumpul, Tenggat, Icon, Catatan.
9. 📄 **`Kategori`**: ID, Nama Kategori, Icon, Tipe.
10. 📄 **`Template_Transaksi`**: ID, Nama Template, Jenis, Kategori, Nominal, Dari Dompet, Ke Dompet, Keterangan, Icon.

> [!TIP]
> Anda **tidak perlu membuat sheet-sheet di atas secara manual**! Kode Google Apps Script memiliki fungsi `initDatabase()` yang otomatis membuat 10 Sheet beserta header dan data contohnya.

---

## 3. Langkah Pemasangan Google Apps Script (Backend)

1. Buka [Google Drive](https://drive.google.com) dengan akun Google Anda.
2. Klik **Baru (+)** > **Google Spreadsheet**, beri judul misalnya: `Database Keuangan Suami Istri Navi`.
3. Di menu atas Spreadsheet, klik **Ekstensi (Extensions)** > **Apps Script**.
4. Hapus semua tulisan bawaan di editor Apps Script (`function myFunction() { ... }`).
5. Buka file [google_apps_script.js](file:///d:/3.%20MULTIMEDIA/NANDA/google_apps_script.js), salin (**Copy**) seluruh isinya (949 baris kode), lalu tempel (**Paste**) ke editor Apps Script.
6. Klik tombol **Simpan** (ikon disket 💾 atau `Ctrl + S`).
7. **Inisialisasi Database (Hanya 1 Kali)**:
   - Pada dropdown nama fungsi di atas editor, pilih fungsi **`initDatabase`**.
   - Klik tombol **Jalankan (Run)**.
   - Jika muncul popup izin Google (*Authorization Required*), klik:
     - **Review permissions** > Pilih akun Google Anda.
     - Klik **Advanced** (Lanjutan) di kiri bawah.
     - Klik **Go to Untitled project (unsafe)**.
     - Klik **Allow (Izinkan)**.
   - Buka kembali Spreadsheet Anda: 10 Sheet akan otomatis terbuat lengkap beserta sampel datanya!
8. **Terapkan Sebagai Web App (Deploy)**:
   - Di pojok kanan atas, klik tombol biru **Terapkan (Deploy)** > **Penerapan Baru (New Deployment)**.
   - Klik ikon gerigi ⚙️ di sebelah *Pilih jenis* > pilih **Aplikasi Web (Web app)**.
   - Konfigurasi:
     - **Deskripsi**: `API Keuangan Navi v5.2`
     - **Jalankan sebagai (Execute as)**: `Saya (email Anda)`
     - **Siapa yang memiliki akses (Who has access)**: **`Siapa saja (Anyone)`** *(Sangat penting agar HP Suami & Istri dapat mengakses database).*
   - Klik **Terapkan (Deploy)**.
9. **Salin URL Web App**:
   - Salin URL Aplikasi Web yang berakhiran `/exec` (contoh: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 4. Menghubungkan Aplikasi Web dengan Google Sheets

1. Buka file [aplikasi_keuangan_v5.html](file:///d:/3.%20MULTIMEDIA/NANDA/aplikasi_keuangan_v5.html) atau [index.html](file:///d:/3.%20MULTIMEDIA/NANDA/index.html) di browser.
2. Di pojok kanan atas header aplikasi, klik tombol **Ikon Gerigi (⚙️ Pengaturan)**.
3. Tempel URL Web App `/exec` yang tadi disalin ke kolom **Google Apps Script Web App URL**.
4. Klik **Simpan Pengaturan**.
5. Tombol sinkronisasi di header akan otomatis menyala **🟢 Sync / Online**.
6. Selesai! Data transaksi dari HP Suami dan HP Istri akan langsung tersinkronisasi dua arah ke Google Spreadsheet.

---

## 5. Logika Akuntansi Transfer Dompet & Pemasukan Real

Aturan khusus keuangan keluarga Navi:

$$\text{Total Saldo Bersama} = \text{Saldo Suami} + \text{Saldo Istri}$$

- **Pemasukan Real**: Pendapatan murni keluarga dari luar (Gaji Pokok Suami, Penghasilan Istri, Bonus, Hasil Bisnis). Nominal ini menambah Total Pemasukan Real dan menambah saldo penerima.
- **Transfer Dompet (Nafkah / Uang Belanja Suami ke Istri)**:
  - Saldo rekening Suami berkurang sebesar nominal transfer.
  - Saldo rekening Istri bertambah sebesar nominal transfer.
  - **Total Pemasukan Real TIDAK BERTAMBAH** (karena bukan gaji baru).
  - **Total Saldo Bersama TIDAK BERKURANG** (karena uang masih berputar di dalam rumah tangga).

---

## 6. Panduan Penggunaan 12 Fitur Baru

### A. Mengatur Batas Anggaran (Budget)
1. Buka tab **Anggaran & Target**.
2. Klik tombol **+ Tambah Anggaran**.
3. Pilih kategori pengeluaran (misal: *Makan & Jajan di Luar*), tentukan batas maksimal per bulan (misal: *Rp 1.500.000*), lalu simpan.
4. Progress bar akan otomatis menghitung pengeluaran real-time dan memberikan peringatan jika belanja sudah mendekati atau melebihi limit.

### B. Membuat & Menyetor ke Target Tabungan
1. Di tab **Anggaran & Target**, klik **+ Buat Target Baru**.
2. Masukkan nama target (misal: *DP Rumah Impian*), ikon emoji (🏡), target nominal (*Rp 50.000.000*), dan tanggal tenggat.
3. Kapan pun Anda ingin menabung, klik tombol **+ Setor Tabungan** pada kartu target tersebut. Masukkan nominal dan rekening sumber. Sistem otomatis mencatat setoran dan memperbarui sisa target tabungan.

### C. Menggunakan Foto Struk & Smart OCR
1. Buka formulir pencatatan transaksi (+).
2. Di kotak lampiran foto, klik **Unggah / Foto** untuk mengambil foto struk belanja dengan kamera HP.
3. Klik tombol **🤖 Baca Struk**: Sistem akan membaca total nota secara otomatis dan mengisikan nominal ke formulir.
4. Simpan transaksi. Anda dapat melihat kembali foto struk kapan saja dengan mengetuk tombol *Struk* pada daftar riwayat.

### D. Menggunakan Template Transaksi Cepat
1. Di halaman Dashboard, tepat di bawah banner sapaan, terdapat deretan tombol cepat (*chips*) seperti *⛽ Bensin Motor (35k)* atau *🥬 Belanja Sayur Pagi (50k)*.
2. Ketuk salah satu chip: formulir transaksi akan langsung terbuka dengan isian lengkap, Anda hanya perlu menekan *Simpan Transaksi*.
3. Untuk membuat template baru, centang opsi *"⭐ Simpan sebagai Template Favorit"* saat input transaksi atau melalui tab *Anggaran & Target*.

### E. Cetak / Simpan Laporan PDF Bulanan
1. Buka tab **Laporan AI** atau klik tombol **Laporan Bulanan PDF** di tab Transaksi.
2. Pilih periode bulan dan tahun yang diinginkan.
3. Lembar laporan resmi keluarga Navi akan tersaji lengkap dengan evaluasi kas, rincian kategori, evaluasi anggaran, dan **dua kolom tanda tangan suami & istri**.
4. Klik **Cetak / Simpan PDF** untuk mengunduh dokumen PDF atau mencetak lewat printer.

---

## 7. Panduan Instalasi PWA & Pemakaian Offline di HP

Aplikasi ini sudah berstandar **Progressive Web App (PWA)** penuh berkat file [sw.js](file:///d:/3.%20MULTIMEDIA/NANDA/sw.js) dan [manifest.json](file:///d:/3.%20MULTIMEDIA/NANDA/manifest.json).

### Cara Pasang di Android (Google Chrome):
1. Buka link web aplikasi di browser Google Chrome HP Anda.
2. Ketuk ikon titik tiga (⋮) di pojok kanan atas browser.
3. Pilih menu **"Tambahkan ke Layar Utama" (Add to Home screen)** atau **"Instal Aplikasi"**.
4. Ikon *Keuangan Navi* akan muncul di daftar aplikasi HP Anda dan dapat dibuka tanpa bar alamat browser seperti aplikasi asli.

### Cara Pasang di iPhone / iPad (Safari):
1. Buka link web aplikasi di browser Safari.
2. Ketuk tombol **Bagikan (Share)** (ikon kotak dengan panah ke atas di bagian bawah layar).
3. Gulir ke bawah dan ketuk **"Tambahkan ke Layar Utama" (Add to Home Screen)**.
4. Ketuk **Tambah (Add)** di pojok kanan atas.

### Pemakaian Offline:
- Jika kuota habis atau berada di tempat tanpa sinyal internet, aplikasi akan menampilkan badge **⚡ Offline Mode** di header atas.
- Anda dan pasangan **tetap dapat membuka aplikasi, melihat rekap, dan mencatat transaksi baru**. Data akan tersimpan aman di memori lokal HP dan otomatis tersinkronisasi ke Google Drive begitu perangkat terhubung ke internet kembali.
