// ===============================
// SAPA CONFIGURATION
// Sistem Aplikasi Pembayaran Aman
// ===============================

const APP_CONFIG = {
    appName: "SAPA",
    fullName: "Sistem Aplikasi Pembayaran Aman",
    version: "1.0.0",

    currency: "IDR",
    currencySymbol: "Rp",

    defaultBalance: 5000000,

    darkMode: false,

    qrisTimeout: 300, // 5 menit

    paymentMethods: [
        {
            id: "va",
            name: "Virtual Account",
            description: "Transfer via bank BCA/BNI/Mandiri"
        },
        {
            id: "qris",
            name: "QRIS",
            description: "Scan QR untuk pembayaran cepat"
        },
        {
            id: "cash",
            name: "Teller / Kasir",
            description: "Bayar langsung di loket"
        }
    ],

    providers: [
        "Telkomsel",
        "Indosat",
        "XL Axiata",
        "Axis",
        "Tri",
        "Smartfren"
    ],

    pulsaNominal: [
        10000,
        25000,
        50000,
        100000,
        200000
    ]
};

// =========================
// CURRENT SERVICE
// =========================

let CURRENT_SERVICE = "pln";