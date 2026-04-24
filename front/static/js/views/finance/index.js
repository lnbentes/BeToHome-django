// views/finance/index.js - Entry point da view Financeiro
// Depende de: finance/state.js, finance/loader.js (financeLoadMonth)

ui.renderFinance = function () {
    document.getElementById('view-title').innerText = 'Financeiro';
    document.getElementById('view-container').innerHTML = `
        <div id="finance-content" class="animate-in space-y-6"></div>
    `;
    // Preserva o mês/ano ao navegar de volta para a tela
    financeLoadMonth();
};
