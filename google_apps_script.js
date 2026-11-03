/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND APLIKASI KEUANGAN SUAMI ISTRI
 * Versi: 5.0 (Multi-User Suami Istri, Rutin Bulanan, Hutang Piutang, Transfer Dompet)
 * =========================================================================
 * 
 * CARA PEMASANGAN:
 * 1. Buka Google Spreadsheet baru di Google Drive Anda.
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus kode default, lalu tempel (paste) seluruh kode ini.
 * 4. Klik tombol "Simpan" (ikon disket).
 * 5. Jalankan fungsi "initDatabase" sekali untuk membuat semua Sheet & Header otomatis.
 * 6. Klik tombol "Terapkan" (Deploy) > "Kelola Penerapan" (Manage Deployments) / "Penerapan Baru" (New Deployment).
 * 7. Pilih jenis: "Aplikasi Web" (Web app).
 * 8. Konfigurasi:
 *    - Deskripsi: API Keuangan Suami Istri
 *    - Jalankan sebagai (Execute as): "Saya" (Me / email Anda)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 9. Klik "Terapkan" (Deploy), berikan izin akses Google (Review permissions > Advanced > Go to Untitled (unsafe) > Allow).
 * 10. Salin URL Aplikasi Web yang berakhiran "/exec", lalu masukkan ke aplikasi web HTML Anda.
 */

// Inisialisasi Nama Sheet
const SHEET_TRANSAKSI = "Transaksi";
const SHEET_RUTIN = "Pengeluaran_Rutin";
const SHEET_HUTANG = "Hutang_Piutang";
const SHEET_CICILAN = "Riwayat_Cicilan";
const SHEET_PENGGUNA = "Pengguna";
const SHEET_DOMPET = "Dompet";
const SHEET_ANGGARAN = "Anggaran";
const SHEET_TABUNGAN = "Target_Tabungan";
const SHEET_KATEGORI = "Kategori";
const SHEET_TEMPLATE = "Template_Transaksi";

/**
 * Fungsi untuk membuat struktur tabel database otomatis di Google Sheets
 */
function initDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Sheet Transaksi
  let sheetTx = ss.getSheetByName(SHEET_TRANSAKSI);
  if (!sheetTx) {
    sheetTx = ss.insertSheet(SHEET_TRANSAKSI);
    sheetTx.appendRow([
      "ID", "Tanggal", "Waktu", "Pencatat", "Jenis", 
      "Kategori", "Jumlah", "Dari Dompet", "Ke Dompet", "Keterangan", "Created At"
    ]);
    sheetTx.getRange("A1:K1").setFontWeight("bold").setBackground("#dbeafe");
    sheetTx.setFrozenRows(1);
    
    // Sample Data
    const todayStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
    sheetTx.appendRow([
      "TX-" + Utilities.getUuid().substring(0, 8),
      todayStr, "08:00", "Suami", "Pemasukan Real",
      "Gaji Bulanan", 8500000, "Rekening Suami", "-", "Gaji Pokok Suami", new Date()
    ]);
    sheetTx.appendRow([
      "TX-" + Utilities.getUuid().substring(0, 8),
      todayStr, "09:30", "Suami", "Transfer Dompet",
      "Nafkah Istri", 3500000, "Rekening Suami", "Rekening Istri", "Uang belanja & dapur bulanan", new Date()
    ]);
    sheetTx.appendRow([
      "TX-" + Utilities.getUuid().substring(0, 8),
      todayStr, "11:00", "Istri", "Pengeluaran",
      "Belanja Dapur", 450000, "Rekening Istri", "-", "Belanja sayur & kebutuhan pokok", new Date()
    ]);
  }

  // 2. Sheet Pengeluaran Rutin
  let sheetRutin = ss.getSheetByName(SHEET_RUTIN);
  if (!sheetRutin) {
    sheetRutin = ss.insertSheet(SHEET_RUTIN);
    sheetRutin.appendRow([
      "ID", "Nama Pengeluaran", "Nominal", "Kategori", 
      "Tanggal Tempo", "Penanggung Jawab", "Status Bulan Ini", "Terakhir Dibayar", "Catatan"
    ]);
    sheetRutin.getRange("A1:I1").setFontWeight("bold").setBackground("#fef3c7");
    sheetRutin.setFrozenRows(1);

    // Sample Rutin
    sheetRutin.appendRow(["RT-1", "Listrik PLN Token / Tagihan", 350000, "Tagihan Rumah", 5, "Suami", "Belum Bayar", "-", "Token awal bulan"]);
    sheetRutin.appendRow(["RT-2", "Internet WiFi Indihome", 375000, "Tagihan Rumah", 15, "Suami", "Belum Bayar", "-", "Jatuh tempo tgl 20"]);
    sheetRutin.appendRow(["RT-3", "Belanja Bulanan Mart", 1200000, "Kebutuhan Pokok", 2, "Istri", "Belum Bayar", "-", "Minyak, beras, sabun, dll"]);
    sheetRutin.appendRow(["RT-4", "Iuran Lingkungan & Keamanan", 100000, "Lingkungan", 10, "Bersama", "Belum Bayar", "-", "Bayar ke RT"]);
  }

  // 3. Sheet Hutang Piutang
  let sheetHutang = ss.getSheetByName(SHEET_HUTANG);
  if (!sheetHutang) {
    sheetHutang = ss.insertSheet(SHEET_HUTANG);
    sheetHutang.appendRow([
      "ID", "Tipe", "Nama Pihak", "Nominal Total", "Nominal Terbayar", 
      "Sisa Nominal", "Tanggal Pinjam", "Jatuh Tempo", "Penanggung Jawab", "Status", "Catatan"
    ]);
    sheetHutang.getRange("A1:K1").setFontWeight("bold").setBackground("#fee2e2");
    sheetHutang.setFrozenRows(1);

    // Sample Hutang Piutang
    const todayStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
    sheetHutang.appendRow([
      "HP-1", "Piutang", "Teman Kantor (Andi)", 500000, 200000,
      300000, todayStr, "2026-11-25", "Suami", "Belum Lunas", "Pinjam buat benerin motor"
    ]);
    sheetHutang.appendRow([
      "HP-2", "Hutang", "Toko Perabotan Bu Ani", 1000000, 1000000,
      0, todayStr, "2026-11-10", "Istri", "Lunas", "Cicilan panci & wajan"
    ]);
  }

  // 4. Sheet Riwayat Cicilan
  let sheetCicilan = ss.getSheetByName(SHEET_CICILAN);
  if (!sheetCicilan) {
    sheetCicilan = ss.insertSheet(SHEET_CICILAN);
    sheetCicilan.appendRow(["ID", "Hutang ID", "Tanggal", "Jumlah", "Pembayar", "Dompet", "Catatan"]);
    sheetCicilan.getRange("A1:G1").setFontWeight("bold").setBackground("#f3e8ff");
    sheetCicilan.setFrozenRows(1);
  }

  // 5. Sheet Pengguna & PIN
  let sheetPengguna = ss.getSheetByName(SHEET_PENGGUNA);
  if (!sheetPengguna) {
    sheetPengguna = ss.insertSheet(SHEET_PENGGUNA);
    sheetPengguna.appendRow(["Username", "Role", "Nama Lengkap", "PIN", "Saldo Awal", "Tema Warna"]);
    sheetPengguna.getRange("A1:F1").setFontWeight("bold").setBackground("#e0e7ff");
    sheetPengguna.setFrozenRows(1);
    
    // Default Akun Suami & Istri
    sheetPengguna.appendRow(["suami", "Suami", "Suami", "1234", 0, "#3b82f6"]);
    sheetPengguna.appendRow(["istri", "Istri", "Istri", "1234", 0, "#ec4899"]);
  }

  // 6. Sheet Dompet / Akun Bank
  let sheetDompet = ss.getSheetByName(SHEET_DOMPET);
  if (!sheetDompet) {
    sheetDompet = ss.insertSheet(SHEET_DOMPET);
    sheetDompet.appendRow(["ID", "Nama Dompet", "Pemilik", "Saldo Awal", "Keterangan"]);
    sheetDompet.getRange("A1:E1").setFontWeight("bold").setBackground("#f1f5f9");
    sheetDompet.setFrozenRows(1);

    sheetDompet.appendRow(["W-1", "Rekening Suami", "Suami", 0, "BCA / Mandiri Suami"]);
    sheetDompet.appendRow(["W-2", "Rekening Istri", "Istri", 0, "BCA / BRI Istri"]);
    sheetDompet.appendRow(["W-3", "Dompet Cash Suami", "Suami", 0, "Tunai di dompet Suami"]);
    sheetDompet.appendRow(["W-4", "Dompet Cash Istri", "Istri", 0, "Tunai di dompet Istri"]);
    sheetDompet.appendRow(["W-5", "Rekening Tabungan Bersama", "Bersama", 0, "Tabungan Keluarga"]);
  }

  // 7. Sheet Anggaran
  let sheetBudget = ss.getSheetByName(SHEET_ANGGARAN);
  if (!sheetBudget) {
    sheetBudget = ss.insertSheet(SHEET_ANGGARAN);
    sheetBudget.appendRow(["ID", "Kategori", "Limit Bulanan", "Catatan"]);
    sheetBudget.getRange("A1:D1").setFontWeight("bold").setBackground("#fed7aa");
    sheetBudget.setFrozenRows(1);
    sheetBudget.appendRow(["BG-1", "Makan & Jajan di Luar", 1500000, "Maksimal jajan resto & kafe"]);
    sheetBudget.appendRow(["BG-2", "Belanja Dapur & Sayur", 2500000, "Kebutuhan bahan makan pokok"]);
    sheetBudget.appendRow(["BG-3", "Bensin & Transportasi", 800000, "Bensin kendaraan & parkir"]);
  }

  // 8. Sheet Target Tabungan
  let sheetGoals = ss.getSheetByName(SHEET_TABUNGAN);
  if (!sheetGoals) {
    sheetGoals = ss.insertSheet(SHEET_TABUNGAN);
    sheetGoals.appendRow(["ID", "Nama Target", "Target Nominal", "Terkumpul", "Tenggat", "Icon", "Catatan"]);
    sheetGoals.getRange("A1:G1").setFontWeight("bold").setBackground("#bbf7d0");
    sheetGoals.setFrozenRows(1);
    sheetGoals.appendRow(["GL-1", "Dana Darurat Keluarga", 15000000, 6000000, "2027-12-31", "🛡️", "Simpanan darurat 3-6 bulan"]);
    sheetGoals.appendRow(["GL-2", "Liburan Akhir Tahun", 5000000, 2500000, "2026-12-20", "🏖️", "Tiket & akomodasi jalan-jalan"]);
    sheetGoals.appendRow(["GL-3", "DP Rumah Impian", 50000000, 12000000, "2028-06-30", "🏡", "Simpanan jangka panjang"]);
  }

  // 9. Sheet Kategori Custom
  let sheetKat = ss.getSheetByName(SHEET_KATEGORI);
  if (!sheetKat) {
    sheetKat = ss.insertSheet(SHEET_KATEGORI);
    sheetKat.appendRow(["ID", "Nama Kategori", "Icon", "Tipe"]);
    sheetKat.getRange("A1:D1").setFontWeight("bold").setBackground("#e9d5ff");
    sheetKat.setFrozenRows(1);
    sheetKat.appendRow(["KT-1", "Gaji Bulanan Suami", "💼", "Pemasukan Real"]);
    sheetKat.appendRow(["KT-2", "Penghasilan Istri", "👩‍💻", "Pemasukan Real"]);
    sheetKat.appendRow(["KT-3", "Belanja Dapur & Sayur", "🛒", "Pengeluaran"]);
    sheetKat.appendRow(["KT-4", "Makan & Jajan di Luar", "🍜", "Pengeluaran"]);
    sheetKat.appendRow(["KT-5", "Listrik & Air", "⚡", "Pengeluaran"]);
    sheetKat.appendRow(["KT-6", "Internet & Pulsa", "📶", "Pengeluaran"]);
    sheetKat.appendRow(["KT-7", "Bensin & Transportasi", "⛽", "Pengeluaran"]);
    sheetKat.appendRow(["KT-8", "Kesehatan & Obat", "💊", "Pengeluaran"]);
    sheetKat.appendRow(["KT-9", "Nafkah Istri (Transfer)", "💖", "Transfer Dompet"]);
  }

  // 10. Sheet Template Transaksi
  let sheetTpl = ss.getSheetByName(SHEET_TEMPLATE);
  if (!sheetTpl) {
    sheetTpl = ss.insertSheet(SHEET_TEMPLATE);
    sheetTpl.appendRow(["ID", "Nama Template", "Jenis", "Kategori", "Jumlah", "Dari Dompet", "Ke Dompet", "Keterangan", "Icon"]);
    sheetTpl.getRange("A1:I1").setFontWeight("bold").setBackground("#cffafe");
    sheetTpl.setFrozenRows(1);
    sheetTpl.appendRow(["TP-1", "Bensin Motor Suami", "Pengeluaran", "Bensin & Transportasi", 35000, "Dompet Cash Suami", "-", "Isi Pertalite", "⛽"]);
    sheetTpl.appendRow(["TP-2", "Belanja Sayur Pagi", "Pengeluaran", "Belanja Dapur & Sayur", 50000, "Dompet Cash Istri", "-", "Sayur & lauk harian", "🥬"]);
    sheetTpl.appendRow(["TP-3", "Kopi & Jajan Berdua", "Pengeluaran", "Makan & Jajan di Luar", 40000, "Rekening Suami", "-", "Kopi sore", "☕"]);
  }

  return "Database berhasil diinisialisasi!";
}

/**
 * Handle GET Requests
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // Inisialisasi jika sheet belum ada
    if (!ss.getSheetByName(SHEET_TRANSAKSI)) {
      initDatabase();
    }

    const action = e.parameter.action || "getData";

    if (action === "init") {
      const msg = initDatabase();
      return jsonResponse({ status: "success", message: msg });
    }

    if (action === "getData") {
      return jsonResponse(fetchAllData(ss));
    }

    return jsonResponse({ status: "error", message: "Aksi tidak dikenali" });
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handle POST Requests
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let body;
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      body = e.parameter;
    }

    const action = body.action;
    const payload = body.payload;

    if (!action) {
      return jsonResponse({ status: "error", message: "Action parameter is missing" });
    }

    switch (action) {
      case "addTransaction":
        return jsonResponse(addTransaction(ss, payload));

      case "updateTransaction":
        return jsonResponse(updateTransaction(ss, payload));

      case "deleteTransaction":
        return jsonResponse(deleteTransaction(ss, payload.id));

      case "addRutin":
        return jsonResponse(addRutin(ss, payload));

      case "updateRutin":
        return jsonResponse(updateRutin(ss, payload));

      case "deleteRutin":
        return jsonResponse(deleteRutin(ss, payload.id));

      case "toggleRutinPay":
        return jsonResponse(toggleRutinPay(ss, payload));

      case "addHutangPiutang":
        return jsonResponse(addHutangPiutang(ss, payload));

      case "updateHutangPiutang":
        return jsonResponse(updateHutangPiutang(ss, payload));

      case "bayarHutangPiutang":
        return jsonResponse(bayarHutangPiutang(ss, payload));

      case "deleteHutangPiutang":
        return jsonResponse(deleteHutangPiutang(ss, payload.id));

      case "updatePin":
        return jsonResponse(updatePin(ss, payload));

      case "addDompet":
        return jsonResponse(addDompet(ss, payload));

      case "saveBudget":
        return jsonResponse(saveBudget(ss, payload));

      case "deleteBudget":
        return jsonResponse(deleteBudget(ss, payload.id));

      case "saveGoal":
        return jsonResponse(saveGoal(ss, payload));

      case "contributeGoal":
        return jsonResponse(contributeGoal(ss, payload));

      case "deleteGoal":
        return jsonResponse(deleteGoal(ss, payload.id));

      case "saveCategory":
        return jsonResponse(saveCategory(ss, payload));

      case "deleteCategory":
        return jsonResponse(deleteCategory(ss, payload.id));

      case "saveTemplate":
        return jsonResponse(saveTemplate(ss, payload));

      case "deleteTemplate":
        return jsonResponse(deleteTemplate(ss, payload.id));

      default:
        return jsonResponse({ status: "error", message: "Aksi POST tidak valid: " + action });
    }
  } catch (err) {
    return jsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Mengambil semua data dari seluruh sheet
 */
function fetchAllData(ss) {
  // 1. Transaksi
  const txSheet = ss.getSheetByName(SHEET_TRANSAKSI);
  const txData = sheetToObjects(txSheet);

  // 2. Pengeluaran Rutin
  const rutinSheet = ss.getSheetByName(SHEET_RUTIN);
  const rutinData = sheetToObjects(rutinSheet);

  // 3. Hutang Piutang
  const hutangSheet = ss.getSheetByName(SHEET_HUTANG);
  const hutangData = sheetToObjects(hutangSheet);

  // 4. Riwayat Cicilan
  const cicilanSheet = ss.getSheetByName(SHEET_CICILAN);
  const cicilanData = sheetToObjects(cicilanSheet);

  // 5. Pengguna
  const userSheet = ss.getSheetByName(SHEET_PENGGUNA);
  const userData = sheetToObjects(userSheet);

  // 6. Dompet
  const dompetSheet = ss.getSheetByName(SHEET_DOMPET);
  const dompetData = sheetToObjects(dompetSheet);

  // 7. Anggaran
  const budgetSheet = ss.getSheetByName(SHEET_ANGGARAN);
  const budgetData = sheetToObjects(budgetSheet);

  // 8. Target Tabungan
  const goalSheet = ss.getSheetByName(SHEET_TABUNGAN);
  const goalData = sheetToObjects(goalSheet);

  // 9. Kategori Custom
  const katSheet = ss.getSheetByName(SHEET_KATEGORI);
  const katData = sheetToObjects(katSheet);

  // 10. Template Transaksi
  const tplSheet = ss.getSheetByName(SHEET_TEMPLATE);
  const tplData = sheetToObjects(tplSheet);

  return {
    status: "success",
    timestamp: new Date().toISOString(),
    transactions: txData.reverse(), // Data terbaru di atas
    routineBills: rutinData,
    debts: hutangData,
    debtPayments: cicilanData,
    users: userData,
    wallets: dompetData,
    budgets: budgetData,
    goals: goalData,
    categories: katData,
    templates: tplData
  };
}

/**
 * Tambah Transaksi
 */
function addTransaction(ss, data) {
  const sheet = ss.getSheetByName(SHEET_TRANSAKSI);
  const id = "TX-" + Utilities.getUuid().substring(0, 8);
  const now = new Date();
  const timeStr = Utilities.formatDate(now, "Asia/Jakarta", "HH:mm");

  sheet.appendRow([
    id,
    data.tanggal || Utilities.formatDate(now, "Asia/Jakarta", "yyyy-MM-dd"),
    data.waktu || timeStr,
    data.pencatat || "Suami",
    data.jenis || "Pengeluaran", // "Pemasukan Real", "Pengeluaran", "Transfer Dompet"
    data.kategori || "Lain-lain",
    Number(data.jumlah) || 0,
    data.dari_dompet || "-",
    data.ke_dompet || "-",
    data.keterangan || "",
    now,
    data.foto_struk || ""
  ]);

  return { status: "success", message: "Transaksi berhasil dicatat", id: id };
}

/**
 * Hapus Transaksi berdasarkan ID
 */
function deleteTransaction(ss, id) {
  const sheet = ss.getSheetByName(SHEET_TRANSAKSI);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Transaksi berhasil dihapus" };
    }
  }
  return { status: "error", message: "ID Transaksi tidak ditemukan" };
}

/**
 * Update Transaksi berdasarkan ID
 */
function updateTransaction(ss, data) {
  const sheet = ss.getSheetByName(SHEET_TRANSAKSI);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      if (data.tanggal) sheet.getRange(i + 1, 2).setValue(data.tanggal);
      if (data.waktu) sheet.getRange(i + 1, 3).setValue(data.waktu);
      if (data.pencatat) sheet.getRange(i + 1, 4).setValue(data.pencatat);
      if (data.jenis) sheet.getRange(i + 1, 5).setValue(data.jenis);
      if (data.kategori) sheet.getRange(i + 1, 6).setValue(data.kategori);
      if (data.jumlah !== undefined) sheet.getRange(i + 1, 7).setValue(Number(data.jumlah) || 0);
      if (data.dari_dompet) sheet.getRange(i + 1, 8).setValue(data.dari_dompet);
      if (data.ke_dompet) sheet.getRange(i + 1, 9).setValue(data.ke_dompet);
      if (data.keterangan !== undefined) sheet.getRange(i + 1, 10).setValue(data.keterangan);
      if (data.foto_struk !== undefined) sheet.getRange(i + 1, 12).setValue(data.foto_struk);
      return { status: "success", message: "Transaksi berhasil diperbarui" };
    }
  }
  return { status: "error", message: "ID Transaksi tidak ditemukan" };
}

/**
 * Tambah Pengeluaran Rutin
 */
function addRutin(ss, data) {
  const sheet = ss.getSheetByName(SHEET_RUTIN);
  const id = "RT-" + Utilities.getUuid().substring(0, 8);

  sheet.appendRow([
    id,
    data.nama_pengeluaran || "Tagihan",
    Number(data.nominal) || 0,
    data.kategori || "Tagihan Rutin",
    Number(data.tanggal_tempo) || 1,
    data.penanggung_jawab || "Bersama",
    "Belum Bayar",
    "-",
    data.catatan || ""
  ]);

  return { status: "success", message: "Pengeluaran rutin berhasil ditambahkan", id: id };
}

/**
 * Update Status Bayar Pengeluaran Rutin & Rekam Transaksi Otomatis
 */
function toggleRutinPay(ss, data) {
  const sheet = ss.getSheetByName(SHEET_RUTIN);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      const isLunas = data.lunas;
      const statusStr = isLunas ? "Lunas" : "Belum Bayar";
      const nowStr = isLunas ? Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd") : "-";

      sheet.getRange(i + 1, 7).setValue(statusStr); // Kolom Status Bulan Ini
      sheet.getRange(i + 1, 8).setValue(nowStr);    // Kolom Terakhir Dibayar

      // Jika autoRecord bernilai true dan status Lunas, catat juga ke Transaksi
      if (isLunas && data.autoRecord) {
        addTransaction(ss, {
          tanggal: nowStr,
          waktu: Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm"),
          pencatat: data.pencatat || rows[i][5] || "Suami",
          jenis: "Pengeluaran",
          kategori: rows[i][3] || "Tagihan Rutin",
          jumlah: Number(rows[i][2]),
          dari_dompet: data.dompet || "Rekening Suami",
          ke_dompet: "-",
          keterangan: "Pembayaran Rutin: " + rows[i][1]
        });
      }

      return { status: "success", message: "Status tagihan berhasil diperbarui" };
    }
  }
  return { status: "error", message: "Tagihan tidak ditemukan" };
}

/**
 * Hapus Pengeluaran Rutin
 */
function deleteRutin(ss, id) {
  const sheet = ss.getSheetByName(SHEET_RUTIN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Pengeluaran rutin berhasil dihapus" };
    }
  }
  return { status: "error", message: "Data rutin tidak ditemukan" };
}

/**
 * Update Pengeluaran Rutin
 */
function updateRutin(ss, data) {
  const sheet = ss.getSheetByName(SHEET_RUTIN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      if (data.nama_pengeluaran) sheet.getRange(i + 1, 2).setValue(data.nama_pengeluaran);
      if (data.nominal !== undefined) sheet.getRange(i + 1, 3).setValue(Number(data.nominal) || 0);
      if (data.kategori) sheet.getRange(i + 1, 4).setValue(data.kategori);
      if (data.tanggal_tempo !== undefined) sheet.getRange(i + 1, 5).setValue(Number(data.tanggal_tempo) || 1);
      if (data.penanggung_jawab) sheet.getRange(i + 1, 6).setValue(data.penanggung_jawab);
      if (data.catatan !== undefined) sheet.getRange(i + 1, 9).setValue(data.catatan);
      return { status: "success", message: "Pengeluaran rutin berhasil diperbarui" };
    }
  }
  return { status: "error", message: "Data rutin tidak ditemukan" };
}

/**
 * Tambah Hutang / Piutang
 */
function addHutangPiutang(ss, data) {
  const sheet = ss.getSheetByName(SHEET_HUTANG);
  const id = "HP-" + Utilities.getUuid().substring(0, 8);
  const total = Number(data.nominal_total) || 0;
  const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");

  sheet.appendRow([
    id,
    data.tipe || "Hutang", // "Hutang" atau "Piutang"
    data.nama_pihak || "Pihak Terkait",
    total,
    0, // nominal terbayar awal 0
    total, // sisa nominal = total
    data.tanggal_pinjam || nowStr,
    data.jatuh_tempo || "-",
    data.penanggung_jawab || "Bersama",
    "Belum Lunas",
    data.catatan || ""
  ]);

  return { status: "success", message: "Hutang/Piutang berhasil dicatat", id: id };
}

/**
 * Pembayaran / Cicilan Hutang Piutang
 */
function bayarHutangPiutang(ss, data) {
  const sheet = ss.getSheetByName(SHEET_HUTANG);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      const tipe = rows[i][1]; // "Hutang" atau "Piutang"
      const total = Number(rows[i][3]);
      const currentTerbayar = Number(rows[i][4]);
      const nominalBayar = Number(data.nominal);

      const newTerbayar = currentTerbayar + nominalBayar;
      const newSisa = Math.max(0, total - newTerbayar);
      const newStatus = newSisa <= 0 ? "Lunas" : "Belum Lunas";

      sheet.getRange(i + 1, 5).setValue(newTerbayar);
      sheet.getRange(i + 1, 6).setValue(newSisa);
      sheet.getRange(i + 1, 10).setValue(newStatus);

      // Simpan riwayat cicilan
      const sheetCicilan = ss.getSheetByName(SHEET_CICILAN);
      const cicilanId = "CC-" + Utilities.getUuid().substring(0, 8);
      const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd");
      sheetCicilan.appendRow([
        cicilanId,
        data.id,
        data.tanggal || nowStr,
        nominalBayar,
        data.pencatat || "Suami",
        data.dompet || "-",
        data.catatan || ("Pembayaran " + tipe + " - " + rows[i][2])
      ]);

      // Jika user ingin dicatat ke transaksi kas:
      if (data.catatKas) {
        // Jika bayar Hutang = Pengeluaran kas kita
        // Jika terima Piutang = Pemasukan Real kas kita
        const jenisTx = tipe === "Hutang" ? "Pengeluaran" : "Pemasukan Real";
        addTransaction(ss, {
          tanggal: data.tanggal || nowStr,
          waktu: Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm"),
          pencatat: data.pencatat || "Suami",
          jenis: jenisTx,
          kategori: tipe === "Hutang" ? "Bayar Hutang" : "Terima Piutang",
          jumlah: nominalBayar,
          dari_dompet: tipe === "Hutang" ? (data.dompet || "Rekening Suami") : "-",
          ke_dompet: tipe === "Piutang" ? (data.dompet || "Rekening Suami") : "-",
          keterangan: "Cicilan " + tipe + " (" + rows[i][2] + ")"
        });
      }

      return { status: "success", message: "Pembayaran berhasil dicatat", sisa: newSisa, statusHp: newStatus };
    }
  }
  return { status: "error", message: "Data Hutang/Piutang tidak ditemukan" };
}

/**
 * Hapus Hutang Piutang
 */
function deleteHutangPiutang(ss, id) {
  const sheet = ss.getSheetByName(SHEET_HUTANG);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Data hutang/piutang berhasil dihapus" };
    }
  }
  return { status: "error", message: "Data tidak ditemukan" };
}

/**
 * Update Hutang Piutang
 */
function updateHutangPiutang(ss, data) {
  const sheet = ss.getSheetByName(SHEET_HUTANG);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      if (data.tipe) sheet.getRange(i + 1, 2).setValue(data.tipe);
      if (data.nama_pihak) sheet.getRange(i + 1, 3).setValue(data.nama_pihak);

      let currentTerbayar = Number(rows[i][4]) || 0;
      let newTotal = data.nominal_total !== undefined ? Number(data.nominal_total) : (Number(rows[i][3]) || 0);
      let newSisa = Math.max(0, newTotal - currentTerbayar);
      let newStatus = newSisa <= 0 ? "Lunas" : "Belum Lunas";

      sheet.getRange(i + 1, 4).setValue(newTotal);
      sheet.getRange(i + 1, 6).setValue(newSisa);
      sheet.getRange(i + 1, 10).setValue(newStatus);

      if (data.tanggal_pinjam) sheet.getRange(i + 1, 7).setValue(data.tanggal_pinjam);
      if (data.jatuh_tempo) sheet.getRange(i + 1, 8).setValue(data.jatuh_tempo);
      if (data.penanggung_jawab) sheet.getRange(i + 1, 9).setValue(data.penanggung_jawab);
      if (data.catatan !== undefined) sheet.getRange(i + 1, 11).setValue(data.catatan);

      return { status: "success", message: "Data hutang/piutang berhasil diperbarui" };
    }
  }
  return { status: "error", message: "Data hutang/piutang tidak ditemukan" };
}

/**
 * Update PIN Pengguna
 */
function updatePin(ss, data) {
  const sheet = ss.getSheetByName(SHEET_PENGGUNA);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === String(data.username).toLowerCase()) {
      sheet.getRange(i + 1, 4).setValue(String(data.newPin));
      return { status: "success", message: "PIN berhasil diubah" };
    }
  }
  return { status: "error", message: "Pengguna tidak ditemukan" };
}

/**
 * Tambah Dompet Baru
 */
function addDompet(ss, data) {
  const sheet = ss.getSheetByName(SHEET_DOMPET);
  const id = "W-" + Utilities.getUuid().substring(0, 6);
  sheet.appendRow([
    id,
    data.nama_dompet || "Dompet Baru",
    data.pemilik || "Bersama",
    Number(data.saldo_awal) || 0,
    data.keterangan || ""
  ]);
  return { status: "success", message: "Dompet berhasil ditambahkan", id: id };
}

/**
 * Simpan / Update Anggaran Kategori
 */
function saveBudget(ss, data) {
  const sheet = ss.getSheetByName(SHEET_ANGGARAN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1]).toLowerCase() === String(data.kategori).toLowerCase() || (data.id && String(rows[i][0]) === String(data.id))) {
      sheet.getRange(i + 1, 3).setValue(Number(data.limit_bulanan) || Number(data.limit) || 0);
      if (data.catatan !== undefined) sheet.getRange(i + 1, 4).setValue(data.catatan);
      return { status: "success", message: "Anggaran berhasil diperbarui" };
    }
  }
  const id = "BG-" + Utilities.getUuid().substring(0, 6);
  sheet.appendRow([id, data.kategori, Number(data.limit_bulanan) || Number(data.limit) || 0, data.catatan || ""]);
  return { status: "success", message: "Anggaran baru berhasil disimpan", id: id };
}

function deleteBudget(ss, id) {
  const sheet = ss.getSheetByName(SHEET_ANGGARAN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id) || String(rows[i][1]).toLowerCase() === String(id).toLowerCase()) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Anggaran berhasil dihapus" };
    }
  }
  return { status: "error", message: "Anggaran tidak ditemukan" };
}

/**
 * Simpan / Update Target Tabungan
 */
function saveGoal(ss, data) {
  const sheet = ss.getSheetByName(SHEET_TABUNGAN);
  const rows = sheet.getDataRange().getValues();
  if (data.id) {
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.id)) {
        if (data.nama_target || data.nama) sheet.getRange(i + 1, 2).setValue(data.nama_target || data.nama);
        if (data.target_nominal || data.target) sheet.getRange(i + 1, 3).setValue(Number(data.target_nominal || data.target) || 0);
        if (data.terkumpul !== undefined) sheet.getRange(i + 1, 4).setValue(Number(data.terkumpul) || 0);
        if (data.tenggat) sheet.getRange(i + 1, 5).setValue(data.tenggat);
        if (data.icon) sheet.getRange(i + 1, 6).setValue(data.icon);
        if (data.catatan !== undefined) sheet.getRange(i + 1, 7).setValue(data.catatan);
        return { status: "success", message: "Target tabungan berhasil diperbarui" };
      }
    }
  }
  const id = "GL-" + Utilities.getUuid().substring(0, 6);
  sheet.appendRow([
    id,
    data.nama_target || data.nama || "Tabungan Baru",
    Number(data.target_nominal || data.target) || 0,
    Number(data.terkumpul) || 0,
    data.tenggat || "-",
    data.icon || "🎯",
    data.catatan || ""
  ]);
  return { status: "success", message: "Target tabungan berhasil ditambahkan", id: id };
}

function contributeGoal(ss, data) {
  const sheet = ss.getSheetByName(SHEET_TABUNGAN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) {
      const current = Number(rows[i][3]) || 0;
      const amount = Number(data.jumlah) || 0;
      const newTotal = current + amount;
      sheet.getRange(i + 1, 4).setValue(newTotal);

      // Jika ingin dicatat ke transaksi
      if (data.catatTx) {
        addTransaction(ss, {
          tanggal: Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd"),
          waktu: Utilities.formatDate(new Date(), "Asia/Jakarta", "HH:mm"),
          pencatat: data.pencatat || "Suami",
          jenis: "Transfer Dompet",
          kategori: "Setor Tabungan: " + rows[i][1],
          jumlah: amount,
          dari_dompet: data.dari_dompet || "Rekening Suami",
          ke_dompet: "Rekening Tabungan Bersama",
          keterangan: "Setoran Target Tabungan " + rows[i][1]
        });
      }
      return { status: "success", message: "Setoran tabungan berhasil dicatat", terkumpul: newTotal };
    }
  }
  return { status: "error", message: "Target tabungan tidak ditemukan" };
}

function deleteGoal(ss, id) {
  const sheet = ss.getSheetByName(SHEET_TABUNGAN);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Target tabungan berhasil dihapus" };
    }
  }
  return { status: "error", message: "Target tabungan tidak ditemukan" };
}

/**
 * Kategori Custom
 */
function saveCategory(ss, data) {
  const sheet = ss.getSheetByName(SHEET_KATEGORI);
  const rows = sheet.getDataRange().getValues();
  if (data.id) {
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.id)) {
        if (data.nama_kategori || data.nama) sheet.getRange(i + 1, 2).setValue(data.nama_kategori || data.nama);
        if (data.icon) sheet.getRange(i + 1, 3).setValue(data.icon);
        if (data.tipe) sheet.getRange(i + 1, 4).setValue(data.tipe);
        return { status: "success", message: "Kategori berhasil diperbarui" };
      }
    }
  }
  const id = "KT-" + Utilities.getUuid().substring(0, 6);
  sheet.appendRow([
    id,
    data.nama_kategori || data.nama || "Kategori Baru",
    data.icon || "🏷️",
    data.tipe || "Pengeluaran"
  ]);
  return { status: "success", message: "Kategori berhasil ditambahkan", id: id };
}

function deleteCategory(ss, id) {
  const sheet = ss.getSheetByName(SHEET_KATEGORI);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id) || String(rows[i][1]).toLowerCase() === String(id).toLowerCase()) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Kategori berhasil dihapus" };
    }
  }
  return { status: "error", message: "Kategori tidak ditemukan" };
}

/**
 * Template Transaksi Favorit
 */
function saveTemplate(ss, data) {
  const sheet = ss.getSheetByName(SHEET_TEMPLATE);
  const rows = sheet.getDataRange().getValues();
  if (data.id) {
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][0]) === String(data.id)) {
        sheet.getRange(i + 1, 2).setValue(data.nama_template || data.nama);
        sheet.getRange(i + 1, 3).setValue(data.jenis || "Pengeluaran");
        sheet.getRange(i + 1, 4).setValue(data.kategori || "Lain-lain");
        sheet.getRange(i + 1, 5).setValue(Number(data.jumlah) || 0);
        sheet.getRange(i + 1, 6).setValue(data.dari_dompet || "Rekening Suami");
        sheet.getRange(i + 1, 7).setValue(data.ke_dompet || "-");
        sheet.getRange(i + 1, 8).setValue(data.keterangan || "");
        sheet.getRange(i + 1, 9).setValue(data.icon || "⚡");
        return { status: "success", message: "Template berhasil diperbarui" };
      }
    }
  }
  const id = "TP-" + Utilities.getUuid().substring(0, 6);
  sheet.appendRow([
    id,
    data.nama_template || data.nama || "Template Baru",
    data.jenis || "Pengeluaran",
    data.kategori || "Lain-lain",
    Number(data.jumlah) || 0,
    data.dari_dompet || "Rekening Suami",
    data.ke_dompet || "-",
    data.keterangan || "",
    data.icon || "⚡"
  ]);
  return { status: "success", message: "Template berhasil disimpan", id: id };
}

function deleteTemplate(ss, id) {
  const sheet = ss.getSheetByName(SHEET_TEMPLATE);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { status: "success", message: "Template berhasil dihapus" };
    }
  }
  return { status: "error", message: "Template tidak ditemukan" };
}

/**
 * Helper: Mengubah data sheet menjadi Array of Object dengan nama header sebagai key
 */
function sheetToObjects(sheet) {
  if (!sheet) return [];
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => normalizeKey(h));
  const results = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    // Lewati baris kosong
    if (row.every(cell => cell === "" || cell === null)) continue;
    
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      let val = row[j];
      if (val instanceof Date) {
        val = Utilities.formatDate(val, "Asia/Jakarta", "yyyy-MM-dd");
      }
      obj[headers[j]] = val;
    }
    results.push(obj);
  }
  return results;
}

/**
 * Helper: Menormalisasi nama header agar menjadi key javascript yang valid
 */
function normalizeKey(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

/**
 * Helper: Response JSON dengan Header CORS Lengkap
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
