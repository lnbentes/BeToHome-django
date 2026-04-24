// core/state.js - Estado global da aplicação

const state = {
    user: null,
    currentView: 'dashboard',
    tasks: [],
    transactions: [],
    accounts: [],
    categories: [],
    places: [],
    events: [],
    isDarkMode: localStorage.getItem('theme') === 'dark',
};
