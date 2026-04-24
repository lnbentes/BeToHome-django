// ui.js - Núcleo de UI: controle de layout e delegação para views/
// As funções de render estão nos arquivos em static/js/views/

const ui = {
    showApp() {
        document.getElementById('layout-wrapper').classList.remove('hidden');
        document.getElementById('login-wrapper').classList.add('hidden');
    },

    showLogin() {
        document.getElementById('layout-wrapper').classList.add('hidden');
        document.getElementById('login-wrapper').classList.remove('hidden');
        this.renderLogin();
    },
};
