// ===============================
// HISTORY MODULE
// ===============================

let historyFilter = "all";
let chartInstance = null;

function renderHistory() {
    const state = getState();
    const transactions = state.transactions;
    const totalPengeluaran = transactions.reduce((sum, t) => sum + t.amount, 0);
    const chartData = prepareChartData(transactions);

    return `
        <div class="history-page fade">
            <div class="card">
                <h2><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Transaksi</h2>

                <div class="history-summary">
                    <div class="summary-card">
                        <i class="fa-solid fa-receipt" style="font-size:20px;color:#0F9D8A;"></i>
                        <p>Total Transaksi</p>
                        <h3>${transactions.length}</h3>
                    </div>
                    <div class="summary-card">
                        <i class="fa-solid fa-arrow-trend-down" style="font-size:20px;color:#EF4444;"></i>
                        <p>Total Pengeluaran</p>
                        <h3>${formatRupiah(totalPengeluaran)}</h3>
                    </div>
                    <div class="summary-card">
                        <i class="fa-solid fa-piggy-bank" style="font-size:20px;color:#0F9D8A;"></i>
                        <p>Saldo Saat Ini</p>
                        <h3 style="color:#0F9D8A;">${formatRupiah(state.balance)}</h3>
                    </div>
                </div>

                <div class="history-filter">
                    <button class="filter-btn ${historyFilter === 'all' ? 'active' : ''}" onclick="setHistoryFilter('all')">
                        <i class="fa-solid fa-list"></i> Semua
                    </button>
                    <button class="filter-btn ${historyFilter === 'PLN' ? 'active' : ''}" onclick="setHistoryFilter('PLN')">
                        <i class="fa-solid fa-bolt"></i> PLN
                    </button>
                    <button class="filter-btn ${historyFilter === 'PDAM' ? 'active' : ''}" onclick="setHistoryFilter('PDAM')">
                        <i class="fa-solid fa-droplet"></i> PDAM
                    </button>
                    <button class="filter-btn ${historyFilter === 'SPP' ? 'active' : ''}" onclick="setHistoryFilter('SPP')">
                        <i class="fa-solid fa-graduation-cap"></i> SPP
                    </button>
                    <button class="filter-btn ${historyFilter.includes('Pulsa') ? 'active' : ''}" onclick="setHistoryFilter('Pulsa')">
                        <i class="fa-solid fa-mobile-screen-button"></i> Pulsa
                    </button>
                </div>

                <div class="history-list">
                    ${renderFilteredHistory(transactions)}
                </div>

                <button class="reset-btn mt-2" onclick="resetAllData()">
                    <i class="fa-solid fa-trash"></i> Reset Semua Data
                </button>
            </div>

            <!-- CHART - MENGGUNAKAN CANVAS -->
            <div class="card mt-2">
                <h3><i class="fa-solid fa-chart-pie"></i> Statistik Pengeluaran</h3>
                <div class="chart-wrapper">
                    <canvas id="historyChart"></canvas>
                </div>
                <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:10px;">
                    <i class="fa-solid fa-circle-info"></i> Grafik pengeluaran berdasarkan jenis transaksi
                </p>
            </div>
        </div>
    `;
}

function initHistory() {
    // Render chart setelah DOM siap
    setTimeout(() => {
        const state = getState();
        const transactions = state.transactions;
        const chartData = prepareChartData(transactions);
        renderChart(chartData);
    }, 300);
}

// ===============================
// FILTER
// ===============================
function setHistoryFilter(filter) {
    historyFilter = filter;
    const state = getState();
    const historyList = document.querySelector(".history-list");
    if (historyList) {
        historyList.innerHTML = renderFilteredHistory(state.transactions);
    }

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelector(`.filter-btn[onclick="setHistoryFilter('${filter}')"]`)?.classList.add("active");
    
    // Update chart berdasarkan filter
    const filtered = filter === 'all' ? state.transactions : state.transactions.filter(tx => 
        tx.type.includes(filter) || tx.type === filter
    );
    const chartData = prepareChartData(filtered);
    renderChart(chartData);
}

function renderFilteredHistory(transactions) {
    let filtered = transactions;

    if (historyFilter !== "all") {
        filtered = transactions.filter(tx => 
            tx.type.includes(historyFilter) || 
            tx.type === historyFilter
        );
    }

    if (filtered.length === 0) {
        return `
            <div class="empty-state">
                <i class="fa-regular fa-receipt"></i>
                <p>Belum ada transaksi</p>
                <small>Mulai bayar tagihan sekarang!</small>
            </div>
        `;
    }

    return filtered.map(tx => `
        <div class="history-item">
            <div class="history-left">
                <strong><i class="fa-regular fa-file-lines"></i> ${tx.type}</strong>
                <small><i class="fa-regular fa-calendar"></i> ${formatDate(tx.time)} ${formatTime(tx.time)}</small>
                ${tx.customer ? `<small style="color:#94A3B8;"><i class="fa-solid fa-user"></i> ${tx.customer}</small>` : ''}
            </div>
            <div class="history-right">
                <span class="history-amount">${formatRupiah(tx.amount)}</span>
                ${tx.method ? `<small><i class="fa-solid fa-credit-card"></i> ${tx.method}</small>` : ''}
            </div>
        </div>
    `).join("");
}

// ===============================
// CHART - MENGGUNAKAN CANVAS
// ===============================
function prepareChartData(transactions) {
    const grouped = {};
    
    if (transactions.length === 0) {
        return { labels: ['Belum Ada Data'], data: [1] };
    }
    
    transactions.forEach(tx => {
        // Ambil kata pertama sebagai kategori
        let key = tx.type.split(" ")[0];
        // Jika kosong atau terlalu pendek, gunakan "Lainnya"
        if (!key || key.length < 2) key = "Lainnya";
        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += tx.amount;
    });

    return {
        labels: Object.keys(grouped),
        data: Object.values(grouped)
    };
}

function renderChart(chartData) {
    const canvas = document.getElementById("historyChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Hapus chart sebelumnya jika ada
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    // Jika tidak ada data, tampilkan pesan
    if (chartData.labels.length === 0 || (chartData.labels.length === 1 && chartData.labels[0] === 'Belum Ada Data')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#94A3B8";
        ctx.font = "14px Poppins, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("📊 Belum ada data untuk ditampilkan", canvas.width/2, canvas.height/2);
        return;
    }

    // Warna untuk chart
    const colors = [
        '#0F9D8A', // primary
        '#2E7DFF', // blue
        '#F59E0B', // yellow
        '#EF4444', // red
        '#8B5CF6', // purple
        '#22C55E', // green
        '#EC4899', // pink
        '#F97316', // orange
        '#06B6D4', // cyan
        '#6366F1'  // indigo
    ];

    // Buat chart baru dengan Chart.js
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartData.labels,
            datasets: [{
                data: chartData.data,
                backgroundColor: colors.slice(0, chartData.labels.length),
                borderWidth: 2,
                borderColor: '#FFFFFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 11,
                            family: 'Poppins, sans-serif'
                        },
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            let value = context.parsed || 0;
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                            return label + ': ' + formatRupiah(value) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// ===============================
// RESET
// ===============================
function resetAllData() {
    const confirmReset = confirm(
        "⚠️ Yakin ingin menghapus semua data?\n\n" +
        "Data yang akan dihapus:\n" +
        "• Semua riwayat transaksi\n" +
        "• Status pembayaran tagihan\n" +
        "• Saldo akan direset ke default\n\n" +
        "Tindakan ini tidak dapat dibatalkan!"
    );

    if (!confirmReset) return;

    resetState();
    showToast("Semua data berhasil direset", "success");
    
    const appContent = document.getElementById("appContent");
    appContent.innerHTML = renderHistory();
    initHistory();
}

// ===============================
// EXPORT
// ===============================
window.setHistoryFilter = setHistoryFilter;
window.resetAllData = resetAllData;
window.renderHistory = renderHistory;
window.initHistory = initHistory;