// ======================================================
// SAPA - BILL MODULE
// Bayar PLN, PDAM, Internet, Seminar
// ======================================================

let currentBill = null;
let selectedPaymentMethod = null;
let selectedBank = null;
let selectedCashier = null;
let qrisTimer = null;
let selectedBillType = "pln";
let lastTransactionData = null;

// ======================================================
// HALAMAN BILL
// ======================================================

function renderBill() {
    return `
    <div class="bill-page fade">

        <div class="card">
            <h2><i class="fa-solid fa-file-invoice"></i> Bayar Tagihan</h2>
            <p>Pilih layanan yang ingin dibayar.</p>

            <div class="form-group">
                <label>Jenis Tagihan</label>
                <div class="service-select-grid">
                    <div class="service-select-item active" onclick="selectBillType('pln', this)">
                        <img src="assets/img/services/pln.png" alt="PLN" onerror="this.style.display='none'">
                        <span>PLN</span>
                    </div>
                    <div class="service-select-item" onclick="selectBillType('pdam', this)">
                        <img src="assets/img/services/pdam.png" alt="PDAM" onerror="this.style.display='none'">
                        <span>PDAM</span>
                    </div>
                    <div class="service-select-item" onclick="selectBillType('internet', this)">
                        <img src="assets/img/services/internet.png" alt="Internet" onerror="this.style.display='none'">
                        <span>Internet</span>
                    </div>
                    <div class="service-select-item" onclick="selectBillType('seminar', this)">
                        <img src="assets/img/services/seminar.png" alt="Seminar" onerror="this.style.display='none'">
                        <span>Seminar</span>
                    </div>
                </div>
                <input type="hidden" id="billType" value="pln">
            </div>

            <div class="form-group">
                <label>ID Pelanggan / Nomor Referensi</label>
                <input
                    type="text"
                    id="customerId"
                    placeholder="Masukkan nomor pelanggan PLN (12 digit)"
                    aria-describedby="customerIdHelp">
                <small id="customerIdHelp" style="color:#94A3B8;font-size:12px;">
                    <i class="fa-solid fa-circle-info"></i> Minimal 8-12 digit angka
                </small>
            </div>

            <button class="btn btn-primary" id="btnCheckBill" onclick="checkBill()">
                <i class="fa-solid fa-search"></i> Cek Tagihan
            </button>
        </div>

        <div id="billResult" class="mt-2"></div>

    </div>
    `;
}

// ======================================================
// SELECT BILL TYPE
// ======================================================

function selectBillType(type, element) {
    selectedBillType = type;
    document.getElementById("billType").value = type;

    document.querySelectorAll(".service-select-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    const placeholder = document.getElementById("customerId");
    const helpText = document.getElementById("customerIdHelp");
    
    const placeholders = {
        "pln": "Masukkan nomor pelanggan PLN (12 digit)",
        "pdam": "Masukkan nomor pelanggan PDAM (12 digit)",
        "internet": "Masukkan nomor pelanggan Internet (12 digit)",
        "seminar": "Masukkan kode referensi seminar"
    };
    
    const helps = {
        "pln": "Minimal 8-12 digit angka",
        "pdam": "Minimal 8-12 digit angka",
        "internet": "Minimal 8-12 digit angka",
        "seminar": "Minimal 5 karakter alphanumeric"
    };
    
    placeholder.placeholder = placeholders[type] || placeholders.pln;
    helpText.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${helps[type] || helps.pln}`;
    
    document.getElementById("billResult").innerHTML = "";
    currentBill = null;
    selectedPaymentMethod = null;
    selectedBank = null;
    selectedCashier = null;
}

function initBill() {
    currentBill = null;
    selectedPaymentMethod = null;
    selectedBank = null;
    selectedCashier = null;
    document.getElementById("billResult").innerHTML = "";
    
    document.querySelectorAll(".service-select-item").forEach((el, i) => {
        el.classList.toggle("active", i === 0);
    });
    document.getElementById("billType").value = "pln";
}

// ======================================================
// VALIDASI
// ======================================================

function validateBillInput(type, id) {
    if (id.trim() === "") {
        showToast("Nomor pelanggan wajib diisi", "error");
        return false;
    }

    if (type === "seminar") {
        if (id.length < 5) {
            showToast("Nomor referensi seminar minimal 5 karakter", "error");
            return false;
        }
        return true;
    }

    if (!/^[0-9]+$/.test(id)) {
        showToast("Nomor pelanggan hanya boleh angka", "error");
        return false;
    }

    if (id.length < 8 || id.length > 12) {
        showToast("Nomor pelanggan harus 8-12 digit", "error");
        return false;
    }

    return true;
}

// ======================================================
// CEK TAGIHAN
// ======================================================

async function checkBill() {
    const type = document.getElementById("billType").value;
    const id = document.getElementById("customerId").value.trim();

    if (!validateBillInput(type, id)) return;

    // LOADING STATE - TOMBOL
    const btn = document.getElementById("btnCheckBill");
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengecek...';
    btn.disabled = true;

    await delay(1500);

    let data = null;

    switch (type) {
        case "pln":
            data = PLN_DATA[id];
            break;
        case "pdam":
            data = PDAM_DATA[id];
            break;
        case "internet":
            data = INTERNET_DATA[id];
            break;
        case "seminar":
            data = SEMINAR_DATA[id];
            break;
    }

    btn.innerHTML = originalText;
    btn.disabled = false;

    if (!data) {
        showToast("Tagihan tidak ditemukan", "error");
        return;
    }

    const state = getState();
    if (state.paidBills[type] && state.paidBills[type].includes(id)) {
        showToast("Tagihan ini sudah lunas", "info");
        return;
    }

    currentBill = {
        type,
        id,
        ...data
    };

    renderBillPreview();
}

// ======================================================
// RENDER PREVIEW TAGIHAN
// ======================================================

function renderBillPreview() {
    const container = document.getElementById("billResult");
    const total = currentBill.bill + (currentBill.penalty || 0);

    container.innerHTML = `
    <div class="card fade">
        <h2><i class="fa-solid fa-file-invoice"></i> Detail Tagihan</h2>
        
        <div class="bill-detail">
            <div class="bill-row">
                <span><i class="fa-solid fa-user"></i> Nama Pelanggan</span>
                <strong>${currentBill.name}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-location-dot"></i> Alamat / Lokasi</span>
                <strong>${currentBill.address}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-calendar"></i> Periode</span>
                <strong>${currentBill.period}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-clock"></i> Jatuh Tempo</span>
                <strong style="color:#EF4444;">${currentBill.dueDate}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-money-bill-wave"></i> Tagihan Pokok</span>
                <strong>${formatRupiah(currentBill.bill)}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-triangle-exclamation" style="color:#EF4444;"></i> Denda</span>
                <strong style="color:#EF4444;">${formatRupiah(currentBill.penalty || 0)}</strong>
            </div>
            <div class="bill-row total">
                <span><i class="fa-solid fa-calculator"></i> Total Pembayaran</span>
                <strong style="color:#0F9D8A;font-size:20px;">${formatRupiah(total)}</strong>
            </div>
        </div>

        <hr class="mt-2 mb-2">

        <h3><i class="fa-solid fa-credit-card"></i> Pilih Metode Pembayaran</h3>
        <p style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
            Pilih salah satu metode pembayaran di bawah ini
        </p>

        <div class="payment-methods-grid">
            <div class="payment-method-card" onclick="selectPaymentMethod('va', this)">
                <div class="payment-method-icon">
                    <i class="fa-solid fa-building-columns"></i>
                </div>
                <div class="payment-method-info">
                    <strong>Virtual Account</strong>
                    <small>Transfer via bank</small>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>

            <div class="payment-method-card" onclick="selectPaymentMethod('qris', this)">
                <div class="payment-method-icon">
                    <i class="fa-solid fa-qrcode"></i>
                </div>
                <div class="payment-method-info">
                    <strong>QRIS</strong>
                    <small>Scan QRIS semua e-wallet</small>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>

            <div class="payment-method-card" onclick="selectPaymentMethod('cash', this)">
                <div class="payment-method-icon">
                    <i class="fa-solid fa-store"></i>
                </div>
                <div class="payment-method-info">
                    <strong>Teller / Kasir</strong>
                    <small>Bayar langsung di loket</small>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>
        </div>

        <div id="bankSelection" class="mt-2" style="display:none;"></div>
        <div id="paymentDetail" class="mt-2"></div>

    </div>
    `;
}

// ======================================================
// STEP 1: PILIH METODE PEMBAYARAN
// ======================================================

function selectPaymentMethod(method, element) {
    selectedPaymentMethod = method;
    selectedBank = null;
    selectedCashier = null;

    document.querySelectorAll(".payment-method-card").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    document.getElementById("paymentDetail").innerHTML = "";

    const bankContainer = document.getElementById("bankSelection");
    
    if (method === 'va') {
        bankContainer.style.display = 'block';
        bankContainer.innerHTML = `
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                <i class="fa-solid fa-building-columns"></i> Pilih Bank
            </p>
            <div class="bank-grid">
                <div class="bank-item" onclick="selectBank('BCA', this)">
                    <img src="assets/img/banks/bca.png" alt="BCA" onerror="this.style.display='none'">
                    <span>BCA</span>
                </div>
                <div class="bank-item" onclick="selectBank('BNI', this)">
                    <img src="assets/img/banks/bni.png" alt="BNI" onerror="this.style.display='none'">
                    <span>BNI</span>
                </div>
                <div class="bank-item" onclick="selectBank('Mandiri', this)">
                    <img src="assets/img/banks/mandiri.png" alt="Mandiri" onerror="this.style.display='none'">
                    <span>Mandiri</span>
                </div>
                <div class="bank-item" onclick="selectBank('BRI', this)">
                    <img src="assets/img/banks/bri.png" alt="BRI" onerror="this.style.display='none'">
                    <span>BRI</span>
                </div>
                <div class="bank-item" onclick="selectBank('CIMB Niaga', this)">
                    <img src="assets/img/banks/cimb.png" alt="CIMB" onerror="this.style.display='none'">
                    <span>CIMB Niaga</span>
                </div>
                <div class="bank-item" onclick="selectBank('Danamon', this)">
                    <img src="assets/img/banks/danamon.png" alt="Danamon" onerror="this.style.display='none'">
                    <span>Danamon</span>
                </div>
            </div>
        `;
    } else if (method === 'qris') {
        bankContainer.style.display = 'block';
        bankContainer.innerHTML = `
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                <i class="fa-solid fa-wallet"></i> Pilih E-Wallet
            </p>
            <div class="bank-grid">
                <div class="bank-item" onclick="selectBank('Gopay', this)">
                    <img src="assets/img/banks/gopay.png" alt="Gopay" onerror="this.style.display='none'">
                    <span>Gopay</span>
                </div>
                <div class="bank-item" onclick="selectBank('OVO', this)">
                    <img src="assets/img/banks/ovo.png" alt="OVO" onerror="this.style.display='none'">
                    <span>OVO</span>
                </div>
                <div class="bank-item" onclick="selectBank('DANA', this)">
                    <img src="assets/img/banks/dana.png" alt="DANA" onerror="this.style.display='none'">
                    <span>DANA</span>
                </div>
                <div class="bank-item" onclick="selectBank('LinkAja', this)">
                    <img src="assets/img/banks/linkaja.png" alt="LinkAja" onerror="this.style.display='none'">
                    <span>LinkAja</span>
                </div>
                <div class="bank-item" onclick="selectBank('ShopeePay', this)">
                    <img src="assets/img/banks/shopeepay.png" alt="ShopeePay" onerror="this.style.display='none'">
                    <span>ShopeePay</span>
                </div>
            </div>
        `;
    } else if (method === 'cash') {
        bankContainer.style.display = 'block';
        bankContainer.innerHTML = `
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                <i class="fa-solid fa-store"></i> Pilih Lokasi Kasir
            </p>
            <div class="cashier-grid">
                <div class="cashier-item" onclick="selectCashier('Indomaret', this)">
                    <img src="assets/img/cashier/indomaret.png" alt="Indomaret" onerror="this.style.display='none'">
                    <span>Indomaret</span>
                </div>
                <div class="cashier-item" onclick="selectCashier('Alfamart', this)">
                    <img src="assets/img/cashier/alfamart.png" alt="Alfamart" onerror="this.style.display='none'">
                    <span>Alfamart</span>
                </div>
                <div class="cashier-item" onclick="selectCashier('Kantor SAPA', this)">
                    <img src="assets/img/cashier/kantor-sapa.png" alt="Kantor SAPA" onerror="this.style.display='none'">
                    <span>Kantor SAPA</span>
                </div>
                <div class="cashier-item" onclick="selectCashier('Pos Indonesia', this)">
                    <img src="assets/img/cashier/pos-indonesia.png" alt="Pos Indonesia" onerror="this.style.display='none'">
                    <span>Pos Indonesia</span>
                </div>
            </div>
        `;
    }
}

// ======================================================
// STEP 2: PILIH BANK
// ======================================================

function selectBank(bankName, element) {
    selectedBank = bankName;

    document.querySelectorAll(".bank-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    if (selectedPaymentMethod === 'va') {
        renderVADetail();
    } else if (selectedPaymentMethod === 'qris') {
        renderQRISDetail();
    }
}

// ======================================================
// STEP 2: PILIH KASIR
// ======================================================

function selectCashier(cashierName, element) {
    selectedCashier = cashierName;

    document.querySelectorAll(".cashier-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    renderCashDetail();
}

// ======================================================
// STEP 3: DETAIL VA
// ======================================================

function renderVADetail() {
    const va = "8808" + Math.floor(100000000000 + Math.random() * 900000000000);
    const total = currentBill.bill + (currentBill.penalty || 0);

    document.getElementById("paymentDetail").innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-building-columns"></i>
            <h3>Virtual Account - ${selectedBank}</h3>
        </div>
        
        <div class="va-number">
            <label>Nomor Virtual Account</label>
            <div class="va-code">${va}</div>
            <button class="copy-btn" onclick="copyText('${va}')">
                <i class="fa-regular fa-copy"></i> Salin
            </button>
        </div>

        <div class="payment-instructions">
            <h4><i class="fa-solid fa-list-check"></i> Instruksi Pembayaran</h4>
            <ol>
                <li>Buka aplikasi <strong>${selectedBank}</strong> Mobile Banking</li>
                <li>Pilih menu <strong>Transfer</strong> → <strong>Virtual Account</strong></li>
                <li>Masukkan nomor Virtual Account: <strong>${va}</strong></li>
                <li>Nominal: <strong>${formatRupiah(total)}</strong></li>
                <li>Konfirmasi pembayaran</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPayment()">
            <i class="fa-solid fa-credit-card"></i> Bayar Sekarang
        </button>
    </div>
    `;
}

// ======================================================
// STEP 3: DETAIL QRIS
// ======================================================

function renderQRISDetail() {
    const container = document.getElementById("paymentDetail");

    container.innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-qrcode"></i>
            <h3>QRIS - ${selectedBank}</h3>
        </div>
        
        <div class="qris-container">
            <div id="qrcode" class="qrcode"></div>
            <div class="qris-timer">
                <span><i class="fa-solid fa-clock"></i> Waktu tersisa</span>
                <h2 id="countdown" style="color:#EF4444;">05:00</h2>
            </div>
            <p style="font-size:13px;color:#94A3B8;margin-top:8px;">
                Scan QRIS menggunakan <strong>${selectedBank}</strong>
            </p>
        </div>

        <div class="payment-instructions">
            <h4><i class="fa-solid fa-list-check"></i> Cara Pembayaran QRIS</h4>
            <ol>
                <li>Buka aplikasi <strong>${selectedBank}</strong></li>
                <li>Pilih menu <strong>Scan QRIS</strong></li>
                <li>Scan QR code di atas</li>
                <li>Periksa nominal: <strong>${formatRupiah(currentBill.bill + (currentBill.penalty || 0))}</strong></li>
                <li>Konfirmasi pembayaran</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPayment()">
            <i class="fa-solid fa-check-circle"></i> Saya Sudah Membayar
        </button>
    </div>
    `;

    const qrContainer = document.getElementById("qrcode");
    if (qrContainer) {
        qrContainer.innerHTML = "";
        try {
            new QRCode(qrContainer, {
                text: "SAPA-" + generateId("QR"),
                width: 160,
                height: 160
            });
        } catch (e) {
            qrContainer.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size:64px;color:#94A3B8;"></i>`;
        }
    }

    startQrisCountdown();
}

// ======================================================
// STEP 3: DETAIL KASIR
// ======================================================

function renderCashDetail() {
    const code = "TRX" + Date.now();

    document.getElementById("paymentDetail").innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-store"></i>
            <h3>Teller / Kasir - ${selectedCashier}</h3>
        </div>
        
        <div class="cash-code">
            <label>Kode Pembayaran</label>
            <div class="cash-code-display">${code}</div>
            <button class="copy-btn" onclick="copyText('${code}')">
                <i class="fa-regular fa-copy"></i> Salin
            </button>
        </div>

        <div class="payment-instructions">
            <h4><i class="fa-solid fa-location-dot"></i> Instruksi Pembayaran</h4>
            <ol>
                <li>Datang ke <strong>${selectedCashier}</strong> terdekat</li>
                <li>Tunjukkan kode pembayaran: <strong>${code}</strong></li>
                <li>Sebutkan nominal: <strong>${formatRupiah(currentBill.bill + (currentBill.penalty || 0))}</strong></li>
                <li>Lakukan pembayaran ke kasir</li>
                <li>Simpan struk sebagai bukti</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPayment()">
            <i class="fa-solid fa-cash-register"></i> Bayar Sekarang
        </button>
    </div>
    `;
}

// ======================================================
// COUNTDOWN QRIS
// ======================================================

function startQrisCountdown() {
    if (qrisTimer) {
        clearInterval(qrisTimer);
    }

    let time = 300;

    qrisTimer = setInterval(() => {
        let minute = Math.floor(time / 60);
        let second = time % 60;

        const countdownEl = document.getElementById("countdown");
        if (countdownEl) {
            countdownEl.textContent = 
                String(minute).padStart(2, "0") + ":" + 
                String(second).padStart(2, "0");
        }

        if (time <= 0) {
            clearInterval(qrisTimer);
            showToast("QRIS telah kedaluwarsa", "error");
            if (countdownEl) {
                countdownEl.style.color = "#94A3B8";
            }
        }

        time--;
    }, 1000);
}

// ======================================================
// PROSES PEMBAYARAN - DENGAN LOADING OVERLAY
// ======================================================

async function processPayment() {
    if (!selectedPaymentMethod) {
        showToast("Silakan pilih metode pembayaran", "error");
        return;
    }

    if ((selectedPaymentMethod === 'va' || selectedPaymentMethod === 'qris') && !selectedBank) {
        showToast("Silakan pilih bank / e-wallet", "error");
        return;
    }

    if (selectedPaymentMethod === 'cash' && !selectedCashier) {
        showToast("Silakan pilih lokasi kasir", "error");
        return;
    }

    const total = currentBill.bill + (currentBill.penalty || 0);
    const state = getState();

    if (state.balance < total) {
        showToast("Saldo tidak mencukupi", "error");
        return;
    }

    // ============================================================
    // LOADING OVERLAY - TAMPIL DI LAYAR
    // ============================================================
    showLoading("Memproses pembayaran tagihan...");

    await delay(2500);

    hideLoading();

    // UPDATE SALDO
    updateBalance(total);

    // METHOD DISPLAY
    let methodDisplay = '';
    if (selectedPaymentMethod === 'va') {
        methodDisplay = `VA - ${selectedBank}`;
    } else if (selectedPaymentMethod === 'qris') {
        methodDisplay = `QRIS - ${selectedBank}`;
    } else if (selectedPaymentMethod === 'cash') {
        methodDisplay = `Teller - ${selectedCashier}`;
    }

    const transactionId = generateId("INV");
    lastTransactionData = {
        id: transactionId,
        type: currentBill.type.toUpperCase(),
        amount: total,
        customer: currentBill.name,
        method: methodDisplay,
        date: formatDate(new Date()) + " " + formatTime(new Date()),
        detail: `Tagihan ${currentBill.type.toUpperCase()} - ${currentBill.period}`
    };

    // SIMPAN TRANSAKSI
    addTransaction({
        id: transactionId,
        type: currentBill.type.toUpperCase(),
        amount: total,
        customer: currentBill.name,
        method: methodDisplay,
        time: new Date()
    });

    // TANDAI LUNAS
    markBillPaid(currentBill.type, currentBill.id);

    // TAMPILKAN HASIL
    showPaymentResult(total, methodDisplay);
}

// ======================================================
// TAMPILKAN HASIL PEMBAYARAN
// ======================================================

function showPaymentResult(total, methodDisplay) {
    const serviceNames = {
        "pln": "Listrik PLN",
        "pdam": "PDAM",
        "internet": "Internet",
        "seminar": "Seminar / Event"
    };

    showModal(`
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-icon"><i class="fa-solid fa-circle-check" style="font-size:48px;color:#22C55E;"></i></div>
                <h2 style="color:#22C55E;">Pembayaran Berhasil!</h2>
                <p>Transaksi telah selesai diproses</p>
            </div>

            <div class="receipt-body">
                <div class="receipt-row">
                    <span><i class="fa-regular fa-id-card"></i> ID Transaksi</span>
                    <strong>${lastTransactionData.id}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-tag"></i> Layanan</span>
                    <strong>${serviceNames[currentBill.type]}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-user"></i> Nama Pelanggan</span>
                    <strong>${currentBill.name}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-credit-card"></i> Metode</span>
                    <strong>${methodDisplay}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-calendar"></i> Tanggal</span>
                    <strong>${lastTransactionData.date}</strong>
                </div>
                <div class="receipt-row total">
                    <span><i class="fa-solid fa-calculator"></i> Total</span>
                    <strong style="color:#0F9D8A;font-size:24px;">${formatRupiah(total)}</strong>
                </div>
            </div>

            <div class="receipt-actions">
                <button class="btn btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Cetak Struk
                </button>
                <button class="btn btn-secondary" onclick="downloadBillReceiptPDF()">
                    <i class="fa-solid fa-file-pdf"></i> Download PDF
                </button>
                <button class="btn btn-danger" onclick="closeModal();showPage('history');">
                    <i class="fa-solid fa-check"></i> Selesai
                </button>
            </div>
        </div>
    `);
}

// ======================================================
// DOWNLOAD PDF STRUK BILL
// ======================================================

function downloadBillReceiptPDF() {
    const total = currentBill.bill + (currentBill.penalty || 0);
    const methodDisplay = selectedPaymentMethod === 'va' ? `VA - ${selectedBank}` :
                          selectedPaymentMethod === 'qris' ? `QRIS - ${selectedBank}` :
                          `Teller - ${selectedCashier}`;
    
    downloadStrukPDF({
        id: lastTransactionData.id || generateId("INV"),
        type: currentBill.type.toUpperCase(),
        customer: currentBill.name,
        method: methodDisplay,
        amount: total,
        date: formatDate(new Date()) + " " + formatTime(new Date()),
        detail: `Tagihan ${currentBill.type.toUpperCase()} - ${currentBill.period}`
    });
}

// ======================================================
// COPY TEXT
// ======================================================

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Berhasil disalin!", "success");
    }).catch(() => {
        const input = document.createElement("input");
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        showToast("Berhasil disalin!", "success");
    });
}

// ======================================================
// EXPORT KE GLOBAL
// ======================================================

window.checkBill = checkBill;
window.selectBillType = selectBillType;
window.selectPaymentMethod = selectPaymentMethod;
window.selectBank = selectBank;
window.selectCashier = selectCashier;
window.processPayment = processPayment;
window.copyText = copyText;
window.downloadBillReceiptPDF = downloadBillReceiptPDF;
window.renderBill = renderBill;
window.initBill = initBill;