// main.js - Core Application Controller

const state = {
    user: null,
    currentView: 'dashboard',
    tasks: [],
    transactions: [],
    accounts: [],
    categories: [],
    places: [],
    events: [],
    isDarkMode: localStorage.getItem('theme') === 'dark'
};

async function init() {
    setupEventListeners();
    applyTheme();
    
    // Check if logged in by fetching user info
    try {
        const users = await api.request('/api/users/');
        // In a real app we'd get the "me" endpoint.
        // For this MVP, if we get a 200, we're "logged in".
        // Let's assume the first user is the logged in one for demo.
        if (users.length > 0) {
            state.user = users[0];
            await loadAppData();
            ui.showApp();
            navigateTo(state.currentView);
        } else {
            ui.showLogin();
        }
    } catch (err) {
        ui.showLogin();
    }
}

async function loadAppData() {
    try {
        const [tasks, transactions, accounts, categories, places, events] = await Promise.all([
            api.tasks.list(),
            api.finance.transactions.list(),
            api.finance.accounts.list(),
            api.finance.categories.list(),
            api.places.list(),
            api.events.list()
        ]);
        state.tasks = tasks;
        state.transactions = transactions;
        state.accounts = accounts;
        state.categories = categories;
        state.places = places;
        state.events = events;
    } catch (err) {
        console.error("Failed to load app data", err);
    }
}

function navigateTo(view) {
    state.currentView = view;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.dataset.view === view) {
            btn.classList.add('bg-forest-50', 'text-forest-700', 'dark:bg-forest-900/20', 'dark:text-forest-300');
            btn.classList.remove('text-earth-600', 'dark:text-earth-400');
        } else {
            btn.classList.remove('bg-forest-50', 'text-forest-700', 'dark:bg-forest-900/20', 'dark:text-forest-300');
            btn.classList.add('text-earth-600', 'dark:text-earth-400');
        }
    });

    switch(view) {
        case 'dashboard': ui.renderDashboard(state); break;
        case 'tasks': ui.renderTasks(state.tasks); break;
        case 'finance': ui.renderFinance(state); break;
        case 'places': ui.renderPlaces(state.places); break;
        case 'calendar': ui.renderCalendar(state.events); break;
        case 'admin': window.location.href = '/admin/'; break; // Redirect to Django Admin
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.view));
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            state.isDarkMode = !state.isDarkMode;
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
            applyTheme();
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await api.auth.logout();
            window.location.reload();
        });
    }

    // Login Form (Delegated)
    document.addEventListener('submit', async (e) => {
        if (e.target.id === 'login-form') {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            const errorEl = document.getElementById('login-error');
            
            try {
                await api.auth.login(username, password);
                init(); // Re-init app
            } catch (err) {
                errorEl.innerText = err.message;
                errorEl.classList.remove('hidden');
            }
        }
    });
}

function applyTheme() {
    if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('name', 'sunny-outline');
    } else {
        document.documentElement.classList.remove('dark');
        const icon = document.getElementById('theme-icon');
        if (icon) icon.setAttribute('name', 'moon-outline');
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
