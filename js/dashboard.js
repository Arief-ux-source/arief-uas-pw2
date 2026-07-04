// ======================================================
// SAPA DASHBOARD
// ======================================================

function renderDashboard() {
    const state = getState();
    const totalTransaksi = state.transactions.length;
    const totalPengeluaran = state.transactions.reduce(
        (total, trx) => total + trx.amount,
        0
    );

    // DATA BANNER PROMO
    const banners = [
        {
            image: 'assets/img/banner/promo-1.png',
            title: 'Cashback 15%',
            desc: 'Bayar Tagihan PLN sekarang!',
            link: 'javascript:showPage("bill")'
        },
        {
            image: 'assets/img/banner/promo-2.png',
            title: 'Gratis Biaya Admin',
            desc: 'Pembayaran SPP Semester',
            link: 'javascript:showPage("spp")'
        },
        {
            image: 'assets/img/banner/promo-3.png',
            title: 'Diskon Pulsa Rp5.000',
            desc: 'Semua Provider',
            link: 'javascript:showPage("pulsa")'
        }
    ];

    // Ambil 1 banner random
    const currentBanner = banners[Math.floor(Math.random() * banners.length)];
    const greeting = getGreeting();

    return `
        <div class="dashboard fade">
            <!-- WELCOME -->
            <div class="welcome-card">
                <div class="welcome-text">
                    <small>${greeting}</small>
                    <h2>Selamat Datang</h2>
                    <p>Kelola semua pembayaran Anda melalui SAPA.</p>
                </div>
                <div class="user-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>
            </div>

            <!-- SALDO -->
            <div class="balance-card">
                <small><i class="fa-regular fa-credit-card"></i> Saldo Simulasi</small>
                <h1>${formatRupiah(state.balance)}</h1>
                <div class="balance-action">
                    <button class="mini-btn" onclick="topUpBalance()">
                        <i class="fa-solid fa-wallet"></i>
                        Top Up
                    </button>
                    <button class="mini-btn" onclick="showPage('history')">
                        <i class="fa-solid fa-clock-rotate-left"></i>
                        Riwayat
                    </button>
                </div>
            </div>

            <!-- LAYANAN FAVORIT -->
            <h3 class="section-title"><i class="fa-solid fa-rocket"></i> Layanan Favorit</h3>
            <div class="service-grid">
                <div class="service-card" onclick="openService('pln')">
                    <img src="assets/img/services/pln.png" alt="PLN" class="service-img" onerror="this.style.display='none'">
                    <span>PLN</span>
                </div>

                <div class="service-card" onclick="openService('pdam')">
                    <img src="assets/img/services/pdam.png" alt="PDAM" class="service-img" onerror="this.style.display='none'">
                    <span>PDAM</span>
                </div>

                <div class="service-card" onclick="openService('internet')">
                    <img src="assets/img/services/internet.png" alt="Internet" class="service-img" onerror="this.style.display='none'">
                    <span>Internet</span>
                </div>

                <div class="service-card" onclick="openService('spp')">
                    <img src="assets/img/services/spp.png" alt="SPP" class="service-img" onerror="this.style.display='none'">
                    <span>SPP</span>
                </div>

                <div class="service-card" onclick="openService('pulsa')">
                    <img src="assets/img/services/pulsa.png" alt="Pulsa" class="service-img" onerror="this.style.display='none'">
                    <span>Pulsa</span>
                </div>

                <div class="service-card" onclick="openService('seminar')">
                    <img src="assets/img/services/seminar.png" alt="Seminar" class="service-img" onerror="this.style.display='none'">
                    <span>Seminar</span>
                </div>
            </div>

            <!-- BANNER PROMO - MENGGUNAKAN GAMBAR PNG -->
            <div class="promo-banner" onclick="${currentBanner.link}">
                <img src="${currentBanner.image}" 
                     alt="${currentBanner.title}" 
                     class="promo-banner-img"
                     onerror="this.style.display='none'; this.parentElement.style.display='none';">
                <div class="promo-banner-overlay">
                    <span class="promo-banner-tag">PROMO</span>
                    <h3 class="promo-banner-title">${currentBanner.title}</h3>
                    <p class="promo-banner-desc">${currentBanner.desc}</p>
                    <span class="promo-banner-cta">Lihat Promo →</span>
                </div>
            </div>

            <!-- RINGKASAN -->
            <h3 class="section-title section-spacing"><i class="fa-solid fa-chart-simple"></i> Ringkasan Bulan Ini</h3>
            <div class="summary-grid">
                <div class="summary-card">
                    <i class="fa-solid fa-receipt" style="font-size:20px;color:#0F9D8A;"></i>
                    <h2>${totalTransaksi}</h2>
                    <small>Total Transaksi</small>
                </div>
                <div class="summary-card">
                    <i class="fa-solid fa-arrow-trend-down" style="font-size:20px;color:#EF4444;"></i>
                    <h2>${formatRupiah(totalPengeluaran)}</h2>
                    <small>Total Pengeluaran</small>
                </div>
                <div class="summary-card">
                    <i class="fa-solid fa-piggy-bank" style="font-size:20px;color:#0F9D8A;"></i>
                    <h2 style="color:#0F9D8A;">${formatRupiah(state.balance)}</h2>
                    <small>Sisa Saldo</small>
                </div>
            </div>

            <!-- AKTIVITAS -->
            <h3 class="section-title section-spacing"><i class="fa-solid fa-clock"></i> Aktivitas Terakhir</h3>
            <div id="recentTransaction" class="activity-list">
                ${renderRecentTransaction()}
            </div>
        </div>
    `;
}

function initDashboard() {
    startPromoSlider();
}

// ===============================
// RENDER RECENT TRANSACTION
// ===============================
function renderRecentTransaction() {
    const state = getState();

    if (state.transactions.length === 0) {
        return `
            <div class="empty-card">
                <i class="fa-regular fa-receipt"></i>
                <p>Belum ada transaksi</p>
                <small>Mulai bayar tagihan sekarang!</small>
            </div>
        `;
    }

    return state.transactions
        .slice(0, 5)
        .map(item => `
            <div class="activity-item">
                <div class="activity-left">
                    <strong>${item.type}</strong>
                    <small><i class="fa-regular fa-calendar"></i> ${formatDate(item.time)}</small>
                </div>
                <div class="activity-right">
                    <strong>${formatRupiah(item.amount)}</strong>
                    <small>${item.method || '-'}</small>
                </div>
            </div>
        `)
        .join("");
}

// ===============================
// GET GREETING
// ===============================
function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 11) return '<i class="fa-regular fa-sun"></i> Selamat Pagi';
    if (hour < 15) return '<i class="fa-regular fa-sun"></i> Selamat Siang';
    if (hour < 18) return '<i class="fa-regular fa-cloud-sun"></i> Selamat Sore';
    return '<i class="fa-regular fa-moon"></i> Selamat Malam';
}

// ===============================
// TOP UP BALANCE
// ===============================
function topUpBalance() {
    const amount = prompt("Masukkan nominal top up:", "100000");
    if (!amount) return;

    const nominal = parseInt(amount);
    if (isNaN(nominal) || nominal <= 0) {
        showToast("Nominal tidak valid", "error");
        return;
    }

    const state = getState();
    state.balance += nominal;
    saveState(state);

    showToast("Top up berhasil!", "success");
    showPage("dashboard");
}

// ===============================
// PROMO SLIDER (Untuk Banner Berganti)
// ===============================
let promoIndex = 0;
let promoSliderInterval = null;

function startPromoSlider() {
    // Jika sudah ada interval, hentikan dulu
    if (promoSliderInterval) {
        clearInterval(promoSliderInterval);
    }

    const banners = [
        {
            image: 'assets/img/banner/promo-1.png',
            title: 'Cashback 15%',
            desc: 'Bayar Tagihan PLN sekarang!',
            link: 'javascript:showPage("bill")'
        },
        {
            image: 'assets/img/banner/promo-2.png',
            title: 'Gratis Biaya Admin',
            desc: 'Pembayaran SPP Semester',
            link: 'javascript:showPage("spp")'
        },
        {
            image: 'assets/img/banner/promo-3.png',
            title: 'Diskon Pulsa Rp5.000',
            desc: 'Semua Provider',
            link: 'javascript:showPage("pulsa")'
        }
    ];

    promoSliderInterval = setInterval(() => {
        promoIndex++;
        if (promoIndex >= banners.length) promoIndex = 0;

        const banner = banners[promoIndex];
        const promoBanner = document.querySelector('.promo-banner');
        
        if (promoBanner) {
            // Update gambar
            const img = promoBanner.querySelector('.promo-banner-img');
            if (img) {
                img.src = banner.image;
                img.alt = banner.title;
                img.onerror = function() {
                    this.style.display = 'none';
                };
            }
            
            // Update teks
            const title = promoBanner.querySelector('.promo-banner-title');
            const desc = promoBanner.querySelector('.promo-banner-desc');
            
            if (title) title.textContent = banner.title;
            if (desc) desc.textContent = banner.desc;
            
            // Update link
            promoBanner.onclick = function() {
                eval(banner.link.replace('javascript:', ''));
            };
        }
    }, 5000);
}

// ===============================
// EXPORT KE GLOBAL
// ===============================
window.renderDashboard = renderDashboard;
window.initDashboard = initDashboard;
window.topUpBalance = topUpBalance;
window.openService = openService;