// ===============================
// SAPA STORAGE ENGINE
// LocalStorage Management
// ===============================

const STORAGE_KEY = "SAPA_DATA";

// Default state aplikasi
const defaultState = {
    balance: APP_CONFIG.defaultBalance,
    transactions: [],
    paidBills: {},
    paidSPP: {},
    darkMode: APP_CONFIG.darkMode,
    profile: {
        name: "User SAPA",
        id: "-"
    }
};

// Ambil data dari localStorage
function getState(){

    let data = localStorage.getItem(STORAGE_KEY);

    if(!data){

        saveState(defaultState);

        return structuredClone(defaultState);

    }

    return JSON.parse(data);

}

// Simpan data ke localStorage
function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Reset semua data
function resetState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
}

// Update balance
function updateBalance(amount) {
    const state = getState();
    state.balance -= amount;
    saveState(state);
    return state.balance;
}

// Tambah transaksi
function addTransaction(transaction) {
    const state = getState();
    state.transactions.unshift(transaction);
    saveState(state);
}

// Tandai tagihan lunas
function markBillPaid(type, id) {
    const state = getState();

    if (!state.paidBills[type]) {
        state.paidBills[type] = [];
    }

    state.paidBills[type].push(id);
    saveState(state);
}

// Tandai SPP lunas
function markSPPPaid(nim, id) {
    const state = getState();

    if (!state.paidSPP[nim]) {
        state.paidSPP[nim] = [];
    }

    state.paidSPP[nim].push(id);
    saveState(state);
}