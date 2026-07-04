// =====================================================
// SAPA DATA SIMULASI
// =====================================================

// =======================
// DATA PLN
// =======================

const PLN_DATA = {

    "123456789012": {
        name: "Budi Santoso",
        address: "Jl. Melati No.12, Jakarta",
        period: "Juli 2026",
        bill: 245000,
        penalty: 5000,
        dueDate: "10 Juli 2026"
    },

    "123456789013": {
        name: "Siti Aisyah",
        address: "Jl. Mawar No.8, Bandung",
        period: "Juli 2026",
        bill: 185000,
        penalty: 0,
        dueDate: "12 Juli 2026"
    },

    "123456789014": {
        name: "Andi Saputra",
        address: "Perum Griya Asri, Surabaya",
        period: "Juli 2026",
        bill: 320000,
        penalty: 10000,
        dueDate: "15 Juli 2026"
    },

    "123456789015": {
        name: "Rina Marlina",
        address: "Jl. Kenanga No.5, Yogyakarta",
        period: "Juli 2026",
        bill: 275000,
        penalty: 0,
        dueDate: "17 Juli 2026"
    },

    "123456789016": {
        name: "Dewi Lestari",
        address: "Jl. Anggrek No.15, Medan",
        period: "Juli 2026",
        bill: 410000,
        penalty: 15000,
        dueDate: "20 Juli 2026"
    }

};

// =======================
// DATA PDAM
// =======================

const PDAM_DATA = {

    "555666777888": {
        name: "Yusuf Hidayat",
        address: "Perum Telaga Indah, Bekasi",
        period: "Juli 2026",
        bill: 98000,
        penalty: 2000,
        dueDate: "8 Juli 2026"
    },

    "555666777889": {
        name: "Nina Oktavia",
        address: "Jl. Flamboyan, Depok",
        period: "Juli 2026",
        bill: 126000,
        penalty: 0,
        dueDate: "11 Juli 2026"
    },

    "555666777890": {
        name: "Rudi Hartono",
        address: "Villa Harmoni, Tangerang",
        period: "Juli 2026",
        bill: 87000,
        penalty: 3000,
        dueDate: "9 Juli 2026"
    }

};

// =======================
// DATA INTERNET
// =======================

const INTERNET_DATA = {

    "111222333444": {
        name: "Andika Pratama",
        address: "IndiHome - Jakarta Selatan",
        period: "Juli 2026",
        bill: 350000,
        penalty: 0,
        dueDate: "18 Juli 2026"
    },

    "111222333445": {
        name: "Salsabila Putri",
        address: "Biznet - Bandung",
        period: "Juli 2026",
        bill: 425000,
        penalty: 0,
        dueDate: "22 Juli 2026"
    },

    "111222333446": {
        name: "Rahmat Hidayat",
        address: "MyRepublic - Surabaya",
        period: "Juli 2026",
        bill: 389000,
        penalty: 5000,
        dueDate: "25 Juli 2026"
    }

};

// =======================
// DATA SEMINAR
// =======================

const SEMINAR_DATA = {

    "SEM001": {
        name: "Seminar Nasional AI 2026",
        address: "Universitas Indonesia",
        period: "20 Juli 2026",
        bill: 150000,
        penalty: 0,
        dueDate: "15 Juli 2026"
    },

    "SEM002": {
        name: "Workshop Cyber Security",
        address: "Universitas Brawijaya",
        period: "25 Juli 2026",
        bill: 200000,
        penalty: 0,
        dueDate: "18 Juli 2026"
    },

    "SEM003": {
        name: "Seminar Web Development",
        address: "Universitas Negeri Jakarta",
        period: "30 Juli 2026",
        bill: 175000,
        penalty: 0,
        dueDate: "22 Juli 2026"
    }

};

// =======================
// DATA SPP (CICILAN)
// =======================

const SPP_DATA = {

    "221011450442": [
        {
            id: 1,
            code: "986248962486438",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 1",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 2,
            code: "986248962486439",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 2",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 3,
            code: "986248962486440",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 3",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 4,
            code: "986248962486441",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 4",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 5,
            code: "986248962486442",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 5",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 6,
            code: "986248962486443",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 6",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        }
    ],

    "221011450443": [
        {
            id: 1,
            code: "986248962486444",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 1",
            semester: "20251",
            amount: 1500000,
            status: "paid"
        },
        {
            id: 2,
            code: "986248962486445",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 2",
            semester: "20251",
            amount: 1500000,
            status: "paid"
        },
        {
            id: 3,
            code: "986248962486446",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 3",
            semester: "20251",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 4,
            code: "986248962486447",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 4",
            semester: "20251",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 5,
            code: "986248962486448",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 5",
            semester: "20251",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 6,
            code: "986248962486449",
            desc: "SPP Semester Genap 2024/2025 - Cicilan 6",
            semester: "20251",
            amount: 1500000,
            status: "unpaid"
        }
    ],

    "221011450444": [
        {
            id: 1,
            code: "986248962486450",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 1",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        },
        {
            id: 2,
            code: "986248962486451",
            desc: "SPP Semester Ganjil 2025/2026 - Cicilan 2",
            semester: "20252",
            amount: 1500000,
            status: "unpaid"
        }
    ]
};

// =======================
// PAKET DATA
// =======================

const PAKET_DATA = {
    "Telkomsel": [
        { name: "Paket Internet 10GB", price: 100000, desc: "30 hari" },
        { name: "Paket Internet 25GB", price: 200000, desc: "30 hari" },
        { name: "Paket Internet 50GB", price: 350000, desc: "30 hari" },
        { name: "Paket Combo 15GB", price: 150000, desc: "30 hari + nelpon" }
    ],
    "Indosat": [
        { name: "Paket Freedom 10GB", price: 90000, desc: "30 hari" },
        { name: "Paket Freedom 25GB", price: 180000, desc: "30 hari" },
        { name: "Paket Freedom 50GB", price: 320000, desc: "30 hari" }
    ],
    "XL": [
        { name: "Paket Xtra 10GB", price: 95000, desc: "30 hari" },
        { name: "Paket Xtra 25GB", price: 190000, desc: "30 hari" },
        { name: "Paket Xtra 50GB", price: 340000, desc: "30 hari" }
    ],
    "Tri": [
        { name: "Paket Tri 10GB", price: 85000, desc: "30 hari" },
        { name: "Paket Tri 25GB", price: 170000, desc: "30 hari" }
    ],
    "Smartfren": [
        { name: "Paket Smart 10GB", price: 88000, desc: "30 hari" },
        { name: "Paket Smart 25GB", price: 175000, desc: "30 hari" }
    ],
    "Axis": [
        { name: "Paket Axis 10GB", price: 92000, desc: "30 hari" },
        { name: "Paket Axis 25GB", price: 185000, desc: "30 hari" }
    ]
};

// =======================
// PROVIDER PREFIX
// =======================

const PROVIDER_PREFIX = {
    // Telkomsel
    "0811": "Telkomsel",
    "0812": "Telkomsel",
    "0813": "Telkomsel",
    "0821": "Telkomsel",
    "0822": "Telkomsel",
    "0823": "Telkomsel",
    "0852": "Telkomsel",
    "0853": "Telkomsel",
    // XL
    "0817": "XL",
    "0818": "XL",
    "0819": "XL",
    "0877": "XL",
    "0878": "XL",
    // Indosat
    "0814": "Indosat",
    "0815": "Indosat",
    "0816": "Indosat",
    "0855": "Indosat",
    "0856": "Indosat",
    "0857": "Indosat",
    // Tri
    "0895": "Tri",
    "0896": "Tri",
    "0897": "Tri",
    "0898": "Tri",
    "0899": "Tri",
    // Axis
    "0838": "Axis",
    "0831": "Axis",
    "0832": "Axis",
    "0833": "Axis",
    // Smartfren
    "0881": "Smartfren",
    "0882": "Smartfren",
    "0883": "Smartfren",
    "0884": "Smartfren",
    "0885": "Smartfren",
    "0886": "Smartfren",
    "0887": "Smartfren",
    "0888": "Smartfren"
};

// =======================
// EXPORT
// =======================

// Untuk digunakan di file lain
window.PLN_DATA = PLN_DATA;
window.PDAM_DATA = PDAM_DATA;
window.INTERNET_DATA = INTERNET_DATA;
window.SEMINAR_DATA = SEMINAR_DATA;
window.SPP_DATA = SPP_DATA;
window.PAKET_DATA = PAKET_DATA;
window.PROVIDER_PREFIX = PROVIDER_PREFIX;