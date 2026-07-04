// ===============================
// SAPA APP CORE (SPA ROUTER)
// ===============================

const appContent = document.getElementById("appContent");
let currentPage = "dashboard";

// ===============================
// INIT APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadInitialState();
    
    const darkButton = document.getElementById("toggleDark");
    if (darkButton) {
        darkButton.addEventListener("click", toggleDarkMode);
    }
    
    setupNavigation();
    showPage("dashboard");
});

// ===============================
// LOAD STATE
// ===============================
function loadInitialState() {
    const state = getState();

    if (state.darkMode) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    updateDarkIcon();
}

// ===============================
// NAVIGATION SETUP
// ===============================
function setupNavigation() {
    const buttons = document.querySelectorAll(".nav-item");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const page = btn.getAttribute("data-page");
            showPage(page);

            document.querySelectorAll(".nav-item")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");
        });
    });
}

// ===============================
// ROUTER SPA - DIPERBAIKI
// ===============================
function showPage(page) {
    currentPage = page;

    // HIDE LOADING AWAL
    const initialLoading = document.querySelector(".initial-loading");
    if (initialLoading) {
        initialLoading.style.display = "none";
    }

    // HIDE LOADING OVERLAY JIKA MASIH TERSEEJA
    hideLoading();

    let html = "";

    switch (page) {
        case "dashboard":
            html = renderDashboard();
            break;
        case "bill":
            html = renderBill();
            break;
        case "spp":
            html = renderSPP();
            break;
        case "pulsa":
            html = renderPulsa();
            break;
        case "history":
            html = renderHistory();
            break;
        default:
            html = renderDashboard();
    }

    appContent.innerHTML = html;

    // INIT FUNCTION
    switch (page) {
        case "dashboard":
            initDashboard();
            break;
        case "bill":
            initBill();
            break;
        case "spp":
            initSPP();
            break;
        case "pulsa":
            initPulsa();
            break;
        case "history":
            initHistory();
            break;
    }

    // HIDE LOADING LAGI UNTUK PASTIKAN
    hideLoading();
}

// ===============================
// GLOBAL EXPORT
// ===============================
window.showPage = showPage;

function openService(service) {
    CURRENT_SERVICE = service;

    switch(service) {
        case "pln":
        case "pdam":
        case "internet":
        case "seminar":
            showPage("bill");
            break;
        case "spp":
            showPage("spp");
            break;
        case "pulsa":
            showPage("pulsa");
            break;
    }
}

window.openService = openService;