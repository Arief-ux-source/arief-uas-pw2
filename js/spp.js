// ===============================
// SPP MODULE
// ===============================

let currentNIM = null;
let selectedSPPItems = [];
let sppDataCache = null;
let lastSPPTransaction = null;

function renderSPP() {
    return `
        <div class="spp-page fade">
            <div class="card">
                <h2><i class="fa-solid fa-graduation-cap"></i> Biaya Kuliah / SPP</h2>
                <p>Masukkan NIM untuk melihat daftar tagihan semester.</p>

                <div class="form-group">
                    <label>NIM (Nomor Induk Mahasiswa)</label>
                    <input 
                        type="text" 
                        id="nimInput" 
                        placeholder="Contoh: 221011450442"
                        aria-describedby="nimHelp"
                        maxlength="12">
                    <small id="nimHelp" style="color:#94A3B8;font-size:12px;">
                        <i class="fa-solid fa-circle-info"></i> Minimal 10-12 digit angka
                    </small>
                </div>

                <button class="btn btn-primary" id="btnLoadSPP" onclick="loadSPPData()">
                    <i class="fa-solid fa-search"></i> Lihat Tagihan Semester
                </button>
            </div>

            <div id="sppResult" class="mt-2"></div>
        </div>
    `;
}

function initSPP() {
    currentNIM = null;
    selectedSPPItems = [];
    sppDataCache = null;
    document.getElementById("sppResult").innerHTML = "";
}

// ===============================
// LOAD SPP DATA
// ===============================
function loadSPPData() {
    const nim = document.getElementById("nimInput").value.trim();

    if (!isValidNIM(nim)) {
        showToast("Format NIM tidak valid (10-12 digit angka)", "error");
        return;
    }

    const btn = document.getElementById("btnLoadSPP");
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
    btn.disabled = true;

    setTimeout(() => {
        const data = SPP_DATA[nim];

        btn.innerHTML = '<i class="fa-solid fa-search"></i> Lihat Tagihan Semester';
        btn.disabled = false;

        if (!data) {
            showToast("Data SPP tidak ditemukan", "error");
            return;
        }

        currentNIM = nim;
        sppDataCache = data;
        renderSPPList(data);

    }, 1200);
}

// ===============================
// RENDER DAFTAR TAGIHAN SPP
// ===============================
function renderSPPList(data) {
    const container = document.getElementById("sppResult");
    const state = getState();
    const paidList = state.paidSPP[currentNIM] || [];

    let totalUnpaid = 0;
    let totalPaid = 0;
    let totalAll = 0;

    data.forEach(item => {
        const isPaid = paidList.includes(item.id.toString());
        if (isPaid) {
            item.status = "paid";
            totalPaid += item.amount;
        } else {
            item.status = "unpaid";
            totalUnpaid += item.amount;
        }
        totalAll += item.amount;
    });

    container.innerHTML = `
        <div class="card fade">
            <div class="spp-header">
                <div>
                    <h3><i class="fa-regular fa-file-lines"></i> Daftar Tagihan Semester</h3>
                    <p style="font-size:13px;color:#94A3B8;margin:2px 0 0;">
                        <i class="fa-regular fa-id-card"></i> NIM: <strong>${currentNIM}</strong> | 
                        <i class="fa-regular fa-calendar"></i> Semester: <strong>${data[0]?.semester || "-"}</strong>
                    </p>
                </div>
                <span class="spp-badge"><i class="fa-regular fa-file-lines"></i> ${data.length} Cicilan</span>
            </div>

            <div class="spp-summary">
                <div class="spp-summary-item">
                    <small><i class="fa-solid fa-calculator"></i> Total Tagihan</small>
                    <h3>${formatRupiah(totalAll)}</h3>
                </div>
                <div class="spp-summary-item" style="border-left-color:#22C55E;">
                    <small><i class="fa-solid fa-circle-check" style="color:#22C55E;"></i> Sudah Dibayar</small>
                    <h3 style="color:#22C55E;">${formatRupiah(totalPaid)}</h3>
                </div>
                <div class="spp-summary-item" style="border-left-color:#EF4444;">
                    <small><i class="fa-solid fa-clock" style="color:#EF4444;"></i> Belum Dibayar</small>
                    <h3 style="color:#EF4444;">${formatRupiah(totalUnpaid)}</h3>
                </div>
            </div>

            <div class="spp-table-wrapper">
                <table class="spp-table">
                    <thead>
                        <tr>
                            <th style="width:40px;">No</th>
                            <th style="text-align:left;">Deskripsi Tagihan</th>
                            <th style="text-align:right;width:120px;">Jumlah</th>
                            <th style="text-align:center;width:110px;">Status</th>
                            <th style="text-align:center;width:40px;">
                                <input type="checkbox" id="selectAllSPP" onchange="toggleAllSPP()">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((item, index) => {
                            const isPaid = paidList.includes(item.id.toString());
                            return `
                                <tr class="${isPaid ? 'paid' : ''}">
                                    <td style="text-align:center;">${index + 1}</td>
                                    <td>
                                        <strong>${item.desc}</strong>
                                        <br>
                                        <small style="color:#94A3B8;font-size:11px;">
                                            <i class="fa-regular fa-hashtag"></i> Kode: ${item.code}
                                        </small>
                                    </td>
                                    <td style="text-align:right;font-weight:600;">
                                        ${formatRupiah(item.amount)}
                                    </td>
                                    <td style="text-align:center;">
                                        <span class="badge ${isPaid ? 'badge-success' : 'badge-danger'}">
                                            ${isPaid ? '<i class="fa-solid fa-circle-check"></i> Lunas' : '<i class="fa-solid fa-clock"></i> Belum'}
                                        </span>
                                    </td>
                                    <td style="text-align:center;">
                                        <input 
                                            type="checkbox" 
                                            class="spp-checkbox"
                                            ${isPaid ? 'disabled' : ''}
                                            value="${item.id}" 
                                            data-amount="${item.amount}"
                                            onchange="updateSPPTotal()">
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>

            <div class="spp-total">
                <span><i class="fa-solid fa-credit-card"></i> Total Dipilih</span>
                <h3 id="sppTotalDisplay">${formatRupiah(0)}</h3>
            </div>

            <div class="spp-actions">
                <button class="btn btn-primary" onclick="paySPP()">
                    <i class="fa-solid fa-credit-card"></i> Bayar Terpilih
                </button>
                <button class="btn btn-secondary" onclick="selectAllUnpaidSPP()" style="width:100%;margin-top:8px;">
                    <i class="fa-solid fa-check-double"></i> Pilih Semua Belum Lunas
                </button>
            </div>
        </div>
    `;

    updateSPPTotal();
}

// ===============================
// SELECT ALL UNPAID
// ===============================
function selectAllUnpaidSPP() {
    const checkboxes = document.querySelectorAll(".spp-checkbox:not(:disabled)");
    checkboxes.forEach(cb => {
        cb.checked = true;
    });
    updateSPPTotal();
    showToast("Semua cicilan belum lunas dipilih", "info");
}

function toggleAllSPP() {
    const master = document.getElementById("selectAllSPP");
    const checkboxes = document.querySelectorAll(".spp-checkbox:not(:disabled)");
    checkboxes.forEach(cb => {
        cb.checked = master.checked;
    });
    updateSPPTotal();
}

// ===============================
// UPDATE TOTAL
// ===============================
function updateSPPTotal() {
    const checkboxes = document.querySelectorAll(".spp-checkbox:checked");
    let total = 0;

    checkboxes.forEach(cb => {
        total += parseInt(cb.getAttribute("data-amount"));
    });

    const display = document.getElementById("sppTotalDisplay");
    if (display) {
        display.textContent = formatRupiah(total);
        display.style.color = total > 0 ? "#0F9D8A" : "#94A3B8";
    }

    return total;
}

// ===============================
// BAYAR SPP - DENGAN LOADING OVERLAY
// ===============================
function paySPP() {
    const checkboxes = document.querySelectorAll(".spp-checkbox:checked");

    if (checkboxes.length === 0) {
        showToast("Pilih minimal satu cicilan", "error");
        return;
    }

    let total = 0;
    let selectedIds = [];
    let selectedDescriptions = [];

    checkboxes.forEach(cb => {
        const amount = parseInt(cb.getAttribute("data-amount"));
        total += amount;
        selectedIds.push(cb.value);
        
        const item = sppDataCache.find(d => d.id.toString() === cb.value);
        if (item) {
            selectedDescriptions.push(item.desc);
        }
    });

    const state = getState();
    if (state.balance < total) {
        showToast("Saldo tidak mencukupi", "error");
        return;
    }

    showModal(`
        <div style="text-align:center;">
            <h2><i class="fa-solid fa-credit-card"></i> Konfirmasi</h2>
            <hr style="margin:15px 0;">
            <p><i class="fa-regular fa-id-card"></i> <strong>NIM</strong></p>
            <p>${currentNIM}</p>
            <br>
            <p><i class="fa-regular fa-file-lines"></i> <strong>Jumlah Cicilan</strong></p>
            <p>${selectedIds.length} item</p>
            <br>
            <p><i class="fa-solid fa-calculator"></i> <strong>Total</strong></p>
            <h2 style="color:#0F9D8A;">${formatRupiah(total)}</h2>
            <br>
            <div style="display:flex;gap:10px;">
                <button class="btn btn-primary" onclick="confirmPaySPP('${currentNIM}', ${JSON.stringify(selectedIds).replace(/"/g, "'")}, ${total}, '${selectedDescriptions.join(", ")}')">
                    <i class="fa-solid fa-check"></i> Ya, Bayar
                </button>
                <button class="btn btn-danger" onclick="closeModal()">
                    <i class="fa-solid fa-xmark"></i> Batal
                </button>
            </div>
        </div>
    `);
}

// ===============================
// KONFIRMASI BAYAR SPP - DENGAN LOADING OVERLAY
// ===============================
function confirmPaySPP(nim, selectedIds, total, descriptions) {
    closeModal();

    // ============================================================
    // LOADING OVERLAY - TAMPIL DI LAYAR
    // ============================================================
    showLoading("Memproses pembayaran SPP...");

    setTimeout(() => {
        hideLoading();

        updateBalance(total);

        const transactionId = generateId("SPP");
        lastSPPTransaction = {
            id: transactionId,
            type: "SPP",
            nim: nim,
            amount: total,
            count: selectedIds.length,
            descriptions: descriptions,
            date: formatDate(new Date()) + " " + formatTime(new Date())
        };

        addTransaction({
            id: transactionId,
            type: "SPP - " + nim,
            amount: total,
            method: "SPP Payment",
            detail: selectedIds.length + " cicilan",
            time: new Date()
        });

        selectedIds.forEach(id => {
            markSPPPaid(nim, id);
        });

        showToast("SPP berhasil dibayar", "success");
        showSPPResult();

        setTimeout(() => {
            loadSPPData();
        }, 500);

    }, 1500);
}

// ===============================
// TAMPILKAN HASIL SPP
// ===============================
function showSPPResult() {
    showModal(`
        <div class="receipt">
            <div class="receipt-header">
                <div class="receipt-icon"><i class="fa-solid fa-circle-check" style="font-size:48px;color:#22C55E;"></i></div>
                <h2 style="color:#22C55E;">Pembayaran SPP Berhasil!</h2>
                <p>Tagihan semester telah lunas</p>
            </div>

            <div class="receipt-body">
                <div class="receipt-row">
                    <span><i class="fa-regular fa-id-card"></i> ID Transaksi</span>
                    <strong>${lastSPPTransaction.id}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-regular fa-id-card"></i> NIM</span>
                    <strong>${currentNIM}</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-regular fa-file-lines"></i> Jumlah Cicilan</span>
                    <strong>${lastSPPTransaction.count} item</strong>
                </div>
                <div class="receipt-row">
                    <span><i class="fa-solid fa-calendar"></i> Tanggal</span>
                    <strong>${lastSPPTransaction.date}</strong>
                </div>
                <div class="receipt-row total">
                    <span><i class="fa-solid fa-calculator"></i> Total</span>
                    <strong style="color:#0F9D8A;font-size:24px;">${formatRupiah(lastSPPTransaction.amount)}</strong>
                </div>
            </div>

            <div class="receipt-actions">
                <button class="btn btn-primary" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Cetak
                </button>
                <button class="btn btn-secondary" onclick="downloadSPPReceiptPDF()">
                    <i class="fa-solid fa-file-pdf"></i> Download PDF
                </button>
                <button class="btn btn-danger" onclick="closeModal();">
                    <i class="fa-solid fa-check"></i> Selesai
                </button>
            </div>
        </div>
    `);
}

// ===============================
// DOWNLOAD PDF STRUK SPP
// ===============================
function downloadSPPReceiptPDF() {
    downloadStrukPDF({
        id: lastSPPTransaction.id || generateId("SPP"),
        type: "SPP",
        customer: "NIM: " + currentNIM,
        method: "SPP Payment",
        amount: lastSPPTransaction.amount || 0,
        date: lastSPPTransaction.date || formatDate(new Date()) + " " + formatTime(new Date()),
        detail: lastSPPTransaction.count + " cicilan - " + (lastSPPTransaction.descriptions || "")
    });
}

// ===============================
// EXPORT
// ===============================
window.loadSPPData = loadSPPData;
window.selectAllUnpaidSPP = selectAllUnpaidSPP;
window.toggleAllSPP = toggleAllSPP;
window.updateSPPTotal = updateSPPTotal;
window.paySPP = paySPP;
window.confirmPaySPP = confirmPaySPP;
window.downloadSPPReceiptPDF = downloadSPPReceiptPDF;
window.renderSPP = renderSPP;
window.initSPP = initSPP;