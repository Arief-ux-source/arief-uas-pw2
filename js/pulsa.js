// ===============================
// PULSA & PAKET DATA MODULE
// ===============================

let pulsaProvider = null;
let pulsaNominal = 0;
let pulsaPaket = null;
let pulsaPhone = "";
let pulsaBill = null;
let pulsaPaymentMethod = null;
let pulsaBank = null;
let pulsaCashier = null;
let pulsaQrisTimer = null;
let lastPulsaTransaction = null;

function renderPulsa() {
    return `
        <div class="pulsa-page fade">
            <div class="card">
                <h2><i class="fa-solid fa-mobile-screen-button"></i> Isi Pulsa & Paket Data</h2>
                <p>Pilih provider dan nominal yang diinginkan.</p>

                <div class="form-group">
                    <label><i class="fa-solid fa-phone"></i> Nomor HP</label>
                    <input 
                        type="tel" 
                        id="pulsaPhoneInput" 
                        placeholder="Contoh: 08123456789"
                        maxlength="13"
                        aria-describedby="pulsaPhoneHelp">
                    <small id="pulsaPhoneHelp" style="color:#94A3B8;font-size:12px;">
                        <i class="fa-solid fa-circle-info"></i> Minimal 10-13 digit, diawali 08
                    </small>
                </div>

                <div class="form-group">
                    <label><i class="fa-solid fa-tower-broadcast"></i> Pilih Provider</label>
                    <div class="provider-grid" id="pulsaProviderGrid">
                        ${APP_CONFIG.providers.map(provider => `
                            <div class="provider-card" onclick="selectPulsaProvider('${provider}', this)">
                                <img src="assets/img/providers/${getPulsaProviderImage(provider)}" 
                                     alt="${provider}" 
                                     class="provider-img"
                                     onerror="this.style.display='none'">
                                <span>${provider}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <div id="pulsaOptions">
                    <div class="form-group">
                        <label><i class="fa-solid fa-money-bill-wave"></i> Nominal Pulsa</label>
                        <div class="nominal-list" id="pulsaNominalList">
                            ${APP_CONFIG.pulsaNominal.map(nom => `
                                <button class="nominal-btn" onclick="selectPulsaNominal(${nom}, this)">
                                    ${formatRupiah(nom)}
                                </button>
                            `).join("")}
                        </div>
                    </div>

                    <div class="form-group">
                        <label><i class="fa-solid fa-box"></i> Atau Pilih Paket Data</label>
                        <div id="pulsaPaketList" class="paket-list">
                            <p style="color:#94A3B8;font-size:14px;">
                                <i class="fa-solid fa-circle-info"></i> Pilih provider terlebih dahulu
                            </p>
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary" id="btnProcessPulsa" onclick="processPulsa()">
                    <i class="fa-solid fa-credit-card"></i> Lanjutkan Pembayaran
                </button>
            </div>

            <div id="pulsaResult" class="mt-2"></div>
        </div>
    `;
}

function initPulsa() {
    pulsaProvider = null;
    pulsaNominal = 0;
    pulsaPaket = null;
    pulsaPhone = "";
    pulsaPaymentMethod = null;
    pulsaBank = null;
    pulsaCashier = null;
    document.getElementById("pulsaResult").innerHTML = "";
    
    const phoneInput = document.getElementById("pulsaPhoneInput");
    if (phoneInput) {
        phoneInput.addEventListener("input", function() {
            const phone = this.value.trim();
            if (phone.length >= 4) {
                const provider = detectPulsaProvider(phone);
                if (provider) {
                    document.querySelectorAll("#pulsaProviderGrid .provider-card").forEach(el => {
                        const span = el.querySelector("span");
                        if (span) {
                            el.classList.toggle("active", span.textContent === provider);
                        }
                    });
                    pulsaProvider = provider;
                    loadPulsaPaketList(provider);
                }
            }
        });
    }
}

// ===============================
// GET PROVIDER IMAGE
// ===============================
function getPulsaProviderImage(provider) {
    const images = {
        "Telkomsel": "telkomsel.png",
        "Indosat": "indosat.png",
        "XL Axiata": "xl.png",
        "Axis": "axis.png",
        "Tri": "tri.png",
        "Smartfren": "smartfren.png"
    };
    return images[provider] || "default.png";
}

// ===============================
// SELECT PROVIDER
// ===============================
function selectPulsaProvider(provider, element) {
    pulsaProvider = provider;
    pulsaPaket = null;

    document.querySelectorAll("#pulsaProviderGrid .provider-card").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    loadPulsaPaketList(provider);
    showToast("Provider: " + provider, "info");
}

// ===============================
// LOAD PAKET LIST
// ===============================
function loadPulsaPaketList(provider) {
    const container = document.getElementById("pulsaPaketList");
    const pakets = PAKET_DATA[provider];

    if (!pakets || pakets.length === 0) {
        container.innerHTML = `<p style="color:#94A3B8;font-size:14px;"><i class="fa-solid fa-circle-info"></i> Belum ada paket untuk ${provider}</p>`;
        return;
    }

    container.innerHTML = pakets.map((paket, index) => `
        <div class="paket-item" onclick="selectPulsaPaket(${index}, this)">
            <div>
                <strong>${paket.name}</strong>
                <small><i class="fa-solid fa-clock"></i> ${paket.desc}</small>
            </div>
            <span>${formatRupiah(paket.price)}</span>
        </div>
    `).join("");
}

// ===============================
// SELECT PAKET
// ===============================
function selectPulsaPaket(index, element) {
    if (!pulsaProvider) {
        showToast("Pilih provider terlebih dahulu", "error");
        return;
    }

    const pakets = PAKET_DATA[pulsaProvider];
    if (!pakets || !pakets[index]) return;

    pulsaPaket = pakets[index];
    pulsaNominal = 0;

    document.querySelectorAll("#pulsaNominalList .nominal-btn").forEach(el => {
        el.classList.remove("active");
    });
    document.querySelectorAll("#pulsaPaketList .paket-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    showToast("Paket: " + pulsaPaket.name, "info");
}

// ===============================
// SELECT NOMINAL
// ===============================
function selectPulsaNominal(nominal, element) {
    pulsaNominal = nominal;
    pulsaPaket = null;

    document.querySelectorAll("#pulsaNominalList .nominal-btn").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    document.querySelectorAll("#pulsaPaketList .paket-item").forEach(el => {
        el.classList.remove("active");
    });

    showToast("Nominal: " + formatRupiah(nominal), "info");
}

// ===============================
// DETECT PROVIDER
// ===============================
function detectPulsaProvider(number) {
    const prefix = number.substring(0, 4);
    return PROVIDER_PREFIX[prefix] || null;
}

// ===============================
// PROSES PULSA - CEK & TAMPILKAN PREVIEW
// ===============================
function processPulsa() {
    pulsaPhone = document.getElementById("pulsaPhoneInput").value.trim();

    if (!isValidPhone(pulsaPhone)) {
        showToast("Nomor HP tidak valid (10-13 digit, diawali 08)", "error");
        return;
    }

    const detectedProvider = detectPulsaProvider(pulsaPhone);
    if (!detectedProvider) {
        showToast("Provider tidak terdeteksi", "error");
        return;
    }

    const finalProvider = pulsaProvider || detectedProvider;

    let total = 0;
    let type = "";
    let detail = "";

    if (pulsaPaket) {
        total = pulsaPaket.price;
        type = "Paket Data";
        detail = `${finalProvider} - ${pulsaPaket.name}`;
    } else if (pulsaNominal > 0) {
        total = pulsaNominal;
        type = "Pulsa";
        detail = `${finalProvider} ${formatRupiah(pulsaNominal)}`;
    } else {
        showToast("Pilih nominal pulsa atau paket data", "error");
        return;
    }

    const state = getState();
    if (state.balance < total) {
        showToast("Saldo tidak mencukupi", "error");
        return;
    }

    pulsaBill = {
        phone: pulsaPhone,
        provider: finalProvider,
        type: type,
        detail: detail,
        total: total
    };

    pulsaPaymentMethod = null;
    pulsaBank = null;
    pulsaCashier = null;

    renderPulsaPreview();
}

// ===============================
// RENDER PREVIEW PULSA
// ===============================
function renderPulsaPreview() {
    const container = document.getElementById("pulsaResult");
    const bill = pulsaBill;

    container.innerHTML = `
    <div class="card fade">
        <h2><i class="fa-solid fa-mobile-screen-button"></i> Detail Pembelian</h2>
        
        <div class="bill-detail">
            <div class="bill-row">
                <span><i class="fa-solid fa-phone"></i> Nomor HP</span>
                <strong>${bill.phone}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-tower-broadcast"></i> Provider</span>
                <strong>${bill.provider}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-solid fa-tag"></i> Jenis</span>
                <strong>${bill.type}</strong>
            </div>
            <div class="bill-row">
                <span><i class="fa-regular fa-file-lines"></i> Detail</span>
                <strong>${bill.detail}</strong>
            </div>
            <div class="bill-row total">
                <span><i class="fa-solid fa-calculator"></i> Total Pembayaran</span>
                <strong style="color:#0F9D8A;font-size:20px;">${formatRupiah(bill.total)}</strong>
            </div>
        </div>

        <hr class="mt-2 mb-2">

        <h3><i class="fa-solid fa-credit-card"></i> Pilih Metode Pembayaran</h3>
        <p style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
            Pilih salah satu metode pembayaran di bawah ini
        </p>

        <div class="payment-methods-grid">
            <div class="payment-method-card" onclick="selectPulsaPaymentMethod('va', this)">
                <div class="payment-method-icon">
                    <i class="fa-solid fa-building-columns"></i>
                </div>
                <div class="payment-method-info">
                    <strong>Virtual Account</strong>
                    <small>Transfer via bank</small>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>

            <div class="payment-method-card" onclick="selectPulsaPaymentMethod('qris', this)">
                <div class="payment-method-icon">
                    <i class="fa-solid fa-qrcode"></i>
                </div>
                <div class="payment-method-info">
                    <strong>QRIS</strong>
                    <small>Scan QRIS semua e-wallet</small>
                </div>
                <i class="fa-solid fa-chevron-right"></i>
            </div>

            <div class="payment-method-card" onclick="selectPulsaPaymentMethod('cash', this)">
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

        <div id="pulsaBankSelection" class="mt-2" style="display:none;"></div>
        <div id="pulsaPaymentDetail" class="mt-2"></div>

    </div>
    `;
}

// ===============================
// STEP 1: PILIH METODE PEMBAYARAN PULSA
// ===============================
function selectPulsaPaymentMethod(method, element) {
    pulsaPaymentMethod = method;
    pulsaBank = null;
    pulsaCashier = null;

    document.querySelectorAll(".payment-method-card").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    document.getElementById("pulsaPaymentDetail").innerHTML = "";

    const bankContainer = document.getElementById("pulsaBankSelection");
    
    if (method === 'va') {
        bankContainer.style.display = 'block';
        bankContainer.innerHTML = `
            <p style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:8px;">
                <i class="fa-solid fa-building-columns"></i> Pilih Bank
            </p>
            <div class="bank-grid">
                <div class="bank-item" onclick="selectPulsaBank('BCA', this)">
                    <img src="assets/img/banks/bca.png" alt="BCA" onerror="this.style.display='none'">
                    <span>BCA</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('BNI', this)">
                    <img src="assets/img/banks/bni.png" alt="BNI" onerror="this.style.display='none'">
                    <span>BNI</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('Mandiri', this)">
                    <img src="assets/img/banks/mandiri.png" alt="Mandiri" onerror="this.style.display='none'">
                    <span>Mandiri</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('BRI', this)">
                    <img src="assets/img/banks/bri.png" alt="BRI" onerror="this.style.display='none'">
                    <span>BRI</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('CIMB Niaga', this)">
                    <img src="assets/img/banks/cimb.png" alt="CIMB" onerror="this.style.display='none'">
                    <span>CIMB Niaga</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('Danamon', this)">
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
                <div class="bank-item" onclick="selectPulsaBank('Gopay', this)">
                    <img src="assets/img/banks/gopay.png" alt="Gopay" onerror="this.style.display='none'">
                    <span>Gopay</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('OVO', this)">
                    <img src="assets/img/banks/ovo.png" alt="OVO" onerror="this.style.display='none'">
                    <span>OVO</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('DANA', this)">
                    <img src="assets/img/banks/dana.png" alt="DANA" onerror="this.style.display='none'">
                    <span>DANA</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('LinkAja', this)">
                    <img src="assets/img/banks/linkaja.png" alt="LinkAja" onerror="this.style.display='none'">
                    <span>LinkAja</span>
                </div>
                <div class="bank-item" onclick="selectPulsaBank('ShopeePay', this)">
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
                <div class="cashier-item" onclick="selectPulsaCashier('Indomaret', this)">
                    <img src="assets/img/cashier/indomaret.png" alt="Indomaret" onerror="this.style.display='none'">
                    <span>Indomaret</span>
                </div>
                <div class="cashier-item" onclick="selectPulsaCashier('Alfamart', this)">
                    <img src="assets/img/cashier/alfamart.png" alt="Alfamart" onerror="this.style.display='none'">
                    <span>Alfamart</span>
                </div>
                <div class="cashier-item" onclick="selectPulsaCashier('Kantor SAPA', this)">
                    <img src="assets/img/cashier/kantor-sapa.png" alt="Kantor SAPA" onerror="this.style.display='none'">
                    <span>Kantor SAPA</span>
                </div>
                <div class="cashier-item" onclick="selectPulsaCashier('Pos Indonesia', this)">
                    <img src="assets/img/cashier/pos-indonesia.png" alt="Pos Indonesia" onerror="this.style.display='none'">
                    <span>Pos Indonesia</span>
                </div>
            </div>
        `;
    }
}

// ===============================
// STEP 2: PILIH BANK (VA / QRIS)
// ===============================
function selectPulsaBank(bankName, element) {
    pulsaBank = bankName;

    document.querySelectorAll(".bank-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    if (pulsaPaymentMethod === 'va') {
        renderPulsaVADetail();
    } else if (pulsaPaymentMethod === 'qris') {
        renderPulsaQRISDetail();
    }
}

// ===============================
// STEP 2: PILIH KASIR
// ===============================
function selectPulsaCashier(cashierName, element) {
    pulsaCashier = cashierName;

    document.querySelectorAll(".cashier-item").forEach(el => {
        el.classList.remove("active");
    });
    element.classList.add("active");

    renderPulsaCashDetail();
}

// ===============================
// STEP 3: DETAIL VA PULSA
// ===============================
function renderPulsaVADetail() {
    const va = "8808" + Math.floor(100000000000 + Math.random() * 900000000000);
    const total = pulsaBill.total;

    document.getElementById("pulsaPaymentDetail").innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-building-columns"></i>
            <h3>Virtual Account - ${pulsaBank}</h3>
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
                <li>Buka aplikasi <strong>${pulsaBank}</strong> Mobile Banking</li>
                <li>Pilih menu <strong>Transfer</strong> → <strong>Virtual Account</strong></li>
                <li>Masukkan nomor Virtual Account: <strong>${va}</strong></li>
                <li>Nominal: <strong>${formatRupiah(total)}</strong></li>
                <li>Konfirmasi pembayaran</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPulsaPayment()">
            <i class="fa-solid fa-credit-card"></i> Bayar Sekarang
        </button>
    </div>
    `;
}

// ===============================
// STEP 3: DETAIL QRIS PULSA
// ===============================
function renderPulsaQRISDetail() {
    const container = document.getElementById("pulsaPaymentDetail");

    container.innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-qrcode"></i>
            <h3>QRIS - ${pulsaBank}</h3>
        </div>
        
        <div class="qris-container">
            <div id="pulsaQrcode" class="qrcode"></div>
            <div class="qris-timer">
                <span><i class="fa-solid fa-clock"></i> Waktu tersisa</span>
                <h2 id="pulsaCountdown" style="color:#EF4444;">05:00</h2>
            </div>
            <p style="font-size:13px;color:#94A3B8;margin-top:8px;">
                Scan QRIS menggunakan <strong>${pulsaBank}</strong>
            </p>
        </div>

        <div class="payment-instructions">
            <h4><i class="fa-solid fa-list-check"></i> Cara Pembayaran QRIS</h4>
            <ol>
                <li>Buka aplikasi <strong>${pulsaBank}</strong></li>
                <li>Pilih menu <strong>Scan QRIS</strong></li>
                <li>Scan QR code di atas</li>
                <li>Periksa nominal: <strong>${formatRupiah(pulsaBill.total)}</strong></li>
                <li>Konfirmasi pembayaran</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPulsaPayment()">
            <i class="fa-solid fa-check-circle"></i> Saya Sudah Membayar
        </button>
    </div>
    `;

    const qrContainer = document.getElementById("pulsaQrcode");
    if (qrContainer) {
        qrContainer.innerHTML = "";
        try {
            new QRCode(qrContainer, {
                text: "SAPA-PULSA-" + generateId("QR"),
                width: 160,
                height: 160
            });
        } catch (e) {
            qrContainer.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size:64px;color:#94A3B8;"></i>`;
        }
    }

    startPulsaQrisCountdown();
}

// ===============================
// STEP 3: DETAIL KASIR PULSA
// ===============================
function renderPulsaCashDetail() {
    const code = "TRX" + Date.now();

    document.getElementById("pulsaPaymentDetail").innerHTML = `
    <div class="payment-detail-card fade">
        <div class="payment-detail-header">
            <i class="fa-solid fa-store"></i>
            <h3>Teller / Kasir - ${pulsaCashier}</h3>
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
                <li>Datang ke <strong>${pulsaCashier}</strong> terdekat</li>
                <li>Tunjukkan kode pembayaran: <strong>${code}</strong></li>
                <li>Sebutkan nominal: <strong>${formatRupiah(pulsaBill.total)}</strong></li>
                <li>Lakukan pembayaran ke kasir</li>
                <li>Simpan struk sebagai bukti</li>
            </ol>
        </div>

        <button class="btn btn-primary" onclick="processPulsaPayment()">
            <i class="fa-solid fa-cash-register"></i> Bayar Sekarang
        </button>
    </div>
    `;
}

// ===============================
// COUNTDOWN QRIS PULSA
// ===============================
function startPulsaQrisCountdown() {
    if (pulsaQrisTimer) {
        clearInterval(pulsaQrisTimer);
    }

    let time = 300;

    pulsaQrisTimer = setInterval(() => {
        let minute = Math.floor(time / 60);
        let second = time % 60;

        const countdownEl = document.getElementById("pulsaCountdown");
        if (countdownEl) {
            countdownEl.textContent = 
                String(minute).padStart(2, "0") + ":" + 
                String(second).padStart(2, "0");
        }

        if (time <= 0) {
            clearInterval(pulsaQrisTimer);
            showToast("QRIS telah kedaluwarsa", "error");
            if (countdownEl) {
                countdownEl.style.color = "#94A3B8";
            }
        }

        time--;
    }, 1000);
}

// ===============================
// PROSES PEMBAYARAN PULSA - DENGAN LOADING OVERLAY
// ===============================
async function processPulsaPayment() {
    if (!pulsaPaymentMethod) {
        showToast("Pilih metode pembayaran", "error");
        return;
    }

    if ((pulsaPaymentMethod === 'va' || pulsaPaymentMethod === 'qris') && !pulsaBank) {
        showToast("Pilih bank / e-wallet", "error");
        return;
    }

    if (pulsaPaymentMethod === 'cash' && !pulsaCashier) {
        showToast("Pilih lokasi kasir", "error");
        return;
    }

    const total = pulsaBill.total;
    const state = getState();

    if (state.balance < total) {
        showToast("Saldo tidak mencukupi", "error");
        return;
    }

    // ============================================================
    // LOADING OVERLAY - TAMPIL DI LAYAR
    // ============================================================
    showLoading("Memproses pembayaran pulsa...");

    await delay(2500);

    hideLoading();

    updateBalance(total);

    let methodDisplay = '';
    if (pulsaPaymentMethod === 'va') {
        methodDisplay = `VA - ${pulsaBank}`;
    } else if (pulsaPaymentMethod === 'qris') {
        methodDisplay = `QRIS - ${pulsaBank}`;
    } else if (pulsaPaymentMethod === 'cash') {
        methodDisplay = `Teller - ${pulsaCashier}`;
    }

    const transactionId = generateId("PULSA");
    lastPulsaTransaction = {
        id: transactionId,
        type: pulsaBill.type + " - " + pulsaBill.provider,
        amount: total,
        customer: pulsaBill.phone,
        method: methodDisplay,
        date: formatDate(new Date()) + " " + formatTime(new Date()),
        detail: pulsaBill.detail
    };

    addTransaction({
        id: transactionId,
        type: pulsaBill.type + " - " + pulsaBill.provider,
        amount: total,
        customer: pulsaBill.phone,
        method: methodDisplay,
        detail: pulsaBill.detail,
        time: new Date()
    });

    showToast("Pulsa berhasil diisi", "success");
    showPulsaPaymentResult(total, methodDisplay);
}

// ===============================
// TAMPILKAN HASIL PULSA
// ===============================
function showPulsaPaymentResult(total, methodDisplay) {
    showModal(`
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-icon"><i class="fa-solid fa-circle-check" style="font-size:48px;color:#22C55E;"></i></div>
                <h2 style="color:#22C55E;">${pulsaBill.type} Berhasil!</h2>
                <p>Pengisian telah selesai diproses</p>
            </div>

            <div class="receipt-body">
                <div class="receipt-row">
                    <span><i class="fa-regular fa-id-card"></i> ID Transaksi</span>
                    <strong>${lastPulsaTransaction.id}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-phone"></i> Nomor HP</span>
                    <strong>${pulsaBill.phone}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-tower-broadcast"></i> Provider</span>
                    <strong>${pulsaBill.provider}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-tag"></i> Jenis</span>
                    <strong>${pulsaBill.type}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-regular fa-file-lines"></i> Detail</span>
                    <strong>${pulsaBill.detail}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-credit-card"></i> Metode</span>
                    <strong>${methodDisplay}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-calendar"></i> Tanggal</span>
                    <strong>${lastPulsaTransaction.date}</strong>
                </div>
                <div class="receipt-row total">
                    <span><i class="fa-solid fa-calculator"></i> Total</span>
                    <strong style="color:#0F9D8A;font-size:24px;">${formatRupiah(total)}</strong>
                </div>
            </div>

            <div class="receipt-actions">
                <button class="btn btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Cetak
                </button>
                <button class="btn btn-secondary" onclick="downloadPulsaReceiptPDF()">
                    <i class="fa-solid fa-file-pdf"></i> Download PDF
                </button>
                <button class="btn btn-danger" onclick="closeModal();showPage('history');">
                    <i class="fa-solid fa-check"></i> Selesai
                </button>
            </div>
        </div>
    `);

    // Reset form
    setTimeout(() => {
        document.querySelectorAll("#pulsaProviderGrid .provider-card, #pulsaNominalList .nominal-btn, #pulsaPaketList .paket-item, .payment-method-card, .bank-item, .cashier-item").forEach(el => {
            el.classList.remove("active");
        });
        pulsaProvider = null;
        pulsaNominal = 0;
        pulsaPaket = null;
        pulsaPaymentMethod = null;
        pulsaBank = null;
        pulsaCashier = null;
        document.getElementById("pulsaResult").innerHTML = "";
        document.getElementById("pulsaBankSelection").style.display = 'none';
        document.getElementById("pulsaPaymentDetail").innerHTML = "";
    }, 500);
}

// ===============================
// DOWNLOAD PDF STRUK PULSA
// ===============================
function downloadPulsaReceiptPDF() {
    downloadStrukPDF({
        id: lastPulsaTransaction.id || generateId("PULSA"),
        type: lastPulsaTransaction.type || "Pulsa",
        customer: lastPulsaTransaction.customer || "-",
        method: lastPulsaTransaction.method || "-",
        amount: lastPulsaTransaction.amount || 0,
        date: lastPulsaTransaction.date || formatDate(new Date()) + " " + formatTime(new Date()),
        detail: lastPulsaTransaction.detail || "-"
    });
}

// ===============================
// COPY TEXT
// ===============================
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

// ===============================
// EXPORT
// ===============================
window.selectPulsaProvider = selectPulsaProvider;
window.selectPulsaNominal = selectPulsaNominal;
window.selectPulsaPaket = selectPulsaPaket;
window.processPulsa = processPulsa;
window.selectPulsaPaymentMethod = selectPulsaPaymentMethod;
window.selectPulsaBank = selectPulsaBank;
window.selectPulsaCashier = selectPulsaCashier;
window.processPulsaPayment = processPulsaPayment;
window.downloadPulsaReceiptPDF = downloadPulsaReceiptPDF;
window.renderPulsa = renderPulsa;
window.initPulsa = initPulsa;
window.copyText = copyText;