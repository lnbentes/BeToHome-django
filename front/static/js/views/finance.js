// views/finance.js - Renderização da tela Financeiro
// Depende de: components/modals/transaction-modal.js, core/state.js

ui.renderFinance = function (appData) {
    const { transactions, accounts, categories } = appData;
    const container = document.getElementById('view-container');
    document.getElementById('view-title').innerText = 'Financeiro';

    const accountCards = accounts.map(acc => `
        <div class="min-w-[240px] p-5 rounded-2xl text-white shadow-lg" style="background: linear-gradient(135deg, ${acc.color}, #00000066)">
            <p class="text-xs opacity-80">${acc.type}</p>
            <h4 class="text-lg font-bold mb-4">${acc.name}</h4>
            <p class="text-2xl font-bold">R$ ${parseFloat(acc.balance).toFixed(2).replace('.', ',')}</p>
        </div>
    `).join('');

    const transactionRows = transactions.map(t => {
        const cat = categories.find(c => c.id === t.category) || { name: 'Geral', color: '#888' };
        return `
            <div class="flex items-center justify-between p-4 border-b border-earth-100 dark:border-earth-800">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white" style="background-color: ${cat.color}">
                        <ion-icon name="wallet"></ion-icon>
                    </div>
                    <div>
                        <h4 class="font-bold text-earth-800 dark:text-earth-200">${t.description}</h4>
                        <p class="text-xs text-earth-500">${t.date}</p>
                    </div>
                </div>
                <span class="font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-500'}">
                    ${t.type === 'INCOME' ? '+' : '-'} R$ ${parseFloat(t.amount).toFixed(0)}
                </span>
            </div>`;
    }).join('');

    container.innerHTML = `
        <div class="animate-in space-y-6">
            <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                ${accountCards}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-4">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold">Últimas Transações</h3>
                        <div class="flex gap-2">
                            <button class="bg-white dark:bg-earth-800 p-2 rounded-lg border border-earth-200 dark:border-earth-700">
                                <ion-icon name="filter-outline"></ion-icon>
                            </button>
                            <button id="btn-new-transaction" class="bg-forest-600 text-white px-4 py-2 rounded-xl">Add +</button>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
                        ${transactionRows}
                    </div>
                </div>

                <div>
                    <h3 class="text-xl font-bold mb-4">Metas</h3>
                    <div class="bg-white dark:bg-earth-900 p-6 rounded-2xl border border-earth-200 dark:border-earth-800 space-y-4">
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Reserva de Emergência</span>
                                <span class="font-bold">75%</span>
                            </div>
                            <div class="w-full h-2 bg-earth-100 dark:bg-earth-800 rounded-full overflow-hidden">
                                <div class="h-full bg-forest-500" style="width: 75%"></div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span>Viagem Japão</span>
                                <span class="font-bold">20%</span>
                            </div>
                            <div class="w-full h-2 bg-earth-100 dark:bg-earth-800 rounded-full overflow-hidden">
                                <div class="h-full bg-forest-500" style="width: 20%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-new-transaction').addEventListener('click', () => transactionModal.open());
};
