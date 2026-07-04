// ===============================
// SAPA UTILITIES
// ===============================

// Format Rupiah
function formatRupiah(number) {
    return APP_CONFIG.currencySymbol + " " + number.toLocaleString("id-ID");
}

// Format tanggal
function formatDate(date = new Date()) {
    return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// Format waktu
function formatTime(date = new Date()) {
    return new Date(date).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Generate ID transaksi
function generateId(prefix = "TX") {
    return prefix + Date.now() + Math.floor(Math.random() * 1000);
}

// ============================================================
// LOADING OVERLAY - FULL SCREEN
// ============================================================

function showLoading(text = "Memproses transaksi...") {
    const overlay = document.getElementById("loadingOverlay");
    const textEl = document.getElementById("loadingText");
    
    if (!overlay) {
        console.warn("Loading overlay not found!");
        return;
    }
    
    if (textEl) {
        textEl.innerHTML = text + ' <span class="loading-dots"></span>';
    }
    
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function hideLoading() {
    const overlay = document.getElementById("loadingOverlay");
    if (!overlay) return;
    
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    const icons = {
        success: 'fa-solid fa-check-circle',
        error: 'fa-solid fa-exclamation-circle',
        info: 'fa-solid fa-info-circle'
    };

    toast.className = "";
    toast.innerHTML = `<i class="${icons[type] || icons.info}"></i> ${message}`;
    toast.classList.add("show", type);

    if (window._toastTimeout) {
        clearTimeout(window._toastTimeout);
    }

    window._toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ============================================================
// MODAL
// ============================================================

function showModal(content) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");
    
    if (!modal || !body) return;

    body.innerHTML = content;
    modal.classList.remove("hidden");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;
    modal.classList.remove("show");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
}

// ============================================================
// DELAY HELPER
// ============================================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// VALIDATION
// ============================================================

function isNumber(value) {
    return /^[0-9]+$/.test(value);
}

function isValidPhone(number) {
    return /^08[0-9]{8,11}$/.test(number);
}

function isValidNIM(nim) {
    return /^[0-9]{10,12}$/.test(nim);
}

// ============================================================
// DARK MODE
// ============================================================

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    const state = getState();
    state.darkMode = document.body.classList.contains("dark");
    saveState(state);

    updateDarkIcon();
}

function updateDarkIcon() {
    const btn = document.getElementById("toggleDark");
    if (!btn) return;

    const icon = btn.querySelector("i");
    if (document.body.classList.contains("dark")) {
        icon.className = "fa-solid fa-sun";
    } else {
        icon.className = "fa-solid fa-moon";
    }
}

// ============================================================
// DOWNLOAD STRUK PDF
// ============================================================

function downloadStrukPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 157, 138);
    doc.text("SAPA", 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Sistem Aplikasi Pembayaran Aman", 20, 35);

    doc.setDrawColor(15, 157, 138);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("STRUK PEMBAYARAN", 20, 55);

    // Content
    doc.setFontSize(11);
    let y = 72;
    
    if (data.id) {
        doc.text("ID Transaksi: " + data.id, 20, y);
        y += 10;
    }
    if (data.type) {
        doc.text("Jenis: " + data.type, 20, y);
        y += 10;
    }
    if (data.customer) {
        doc.text("Pelanggan: " + data.customer, 20, y);
        y += 10;
    }
    if (data.method) {
        doc.text("Metode: " + data.method, 20, y);
        y += 10;
    }
    if (data.amount) {
        doc.text("Total: " + formatRupiah(data.amount), 20, y);
        y += 10;
    }
    if (data.date) {
        doc.text("Tanggal: " + data.date, 20, y);
        y += 10;
    }
    if (data.detail) {
        doc.text("Detail: " + data.detail, 20, y);
        y += 10;
    }

    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(20, y + 10, 190, y + 10);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Terima kasih telah menggunakan SAPA", 20, y + 30);
    doc.text("www.sapa-app.com", 20, y + 40);

    doc.save("Struk-SAPA-" + generateId() + ".pdf");
}

// ============================================================
// EXPORT KE GLOBAL
// ============================================================

window.formatRupiah = formatRupiah;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.generateId = generateId;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.showModal = showModal;
window.closeModal = closeModal;
window.delay = delay;
window.isNumber = isNumber;
window.isValidPhone = isValidPhone;
window.isValidNIM = isValidNIM;
window.toggleDarkMode = toggleDarkMode;
window.updateDarkIcon = updateDarkIcon;
window.downloadStrukPDF = downloadStrukPDF;