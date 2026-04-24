// MOVIDO → views/finance/ (pasta com 5 módulos)
// Este arquivo não é mais carregado. Ver base.html.

// ─── Estado local da view ────────────────────────────────────────────────────
const financeState = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    search: '',
    minAmount: '',
    maxAmount: '',
    txType: '',
    summary: { income: 0, expense: 0, balance: 0, category_breakdown: [] },
    transactions: [],
    _searchTimer: null,
};

const PT_MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function fmtBRL(value) {
    return parseFloat(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// ─── Carrega dados do mês selecionado ────────────────────────────────────────
async function financeLoadMonth() {
    const { year, month, search, minAmount, maxAmount, txType } = financeState;
    try {
        const [summary, txList] = await Promise.all([
            api.finance.transactions.summary({ year, month }),
            api.finance.transactions.list({ year, month, search, min_amount: minAmount, max_amount: maxAmount, type: txType }),
        ]);
        financeState.summary = summary;
        financeState.transactions = txList;
        state.transactions = txList;
    } catch (e) {
        console.error('Erro ao carregar financeiro:', e);
    }
    financeRenderContent();
}

// ─── Renderiza o conteúdo interno (sem recriar o shell) ──────────────────────
function financeRenderContent() {
    const { summary, transactions } = financeState;
    const { accounts, categories } = state;

    // Seletor de mês
    const monthOptions = PT_MONTHS.map((name, i) => {
        const sel = (i + 1) === financeState.month && financeState.year === financeState.year ? 'selected' : '';
        return `<option value="${i + 1}" ${(i + 1) === financeState.month ? 'selected' : ''}>${name}</option>`;
    }).join('');

    const yearRange = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
    const yearOptions = yearRange.map(y =>
        `<option value="${y}" ${y === financeState.year ? 'selected' : ''}>${y}</option>`
    ).join('');

    // Cards de resumo
    const balanceClass = summary.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500';

    // Transações
    const txRows = transactions.length === 0
        ? `<div class="p-8 text-center text-earth-400"><ion-icon name="receipt-outline" class="text-4xl mb-2 block"></ion-icon>Nenhuma transação neste período</div>`
        : transactions.map(t => {
            const catColor = t.category_color || '#888';
            const catIcon  = t.category_icon  || 'help-outline';
            const catName  = t.category_name  || 'Geral';
            const sign     = t.type === 'INCOME' ? '+' : '-';
            const amtClass = t.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-500';
            const installBadge = t.installment_total
                ? `<span class="ml-2 text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 px-1.5 py-0.5 rounded-full font-semibold">${t.installment_current}/${t.installment_total}x</span>`
                : '';
            return `
            <div class="flex items-center justify-between p-4 border-b border-earth-100 dark:border-earth-800 last:border-0 group hover:bg-earth-50 dark:hover:bg-earth-800/50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0" style="background-color:${catColor}">
                        <ion-icon name="${catIcon}"></ion-icon>
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-1 flex-wrap">
                            <h4 class="font-semibold text-earth-800 dark:text-earth-200 truncate">${t.description}</h4>
                            ${installBadge}
                        </div>
                        <p class="text-xs text-earth-500">${fmtDate(t.date)} · ${catName}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                    <span class="font-bold ${amtClass}">${sign} ${fmtBRL(t.amount)}</span>
                    <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="btn-edit-tx p-1.5 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors" data-id="${t.id}" title="Editar">
                            <ion-icon name="create-outline" class="text-earth-500"></ion-icon>
                        </button>
                        <button class="btn-delete-tx p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" data-id="${t.id}" title="Excluir">
                            <ion-icon name="trash-outline" class="text-red-400"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

    // Breakdown de categorias (top 5)
    const breakdown = (summary.category_breakdown || []).slice(0, 6);
    const maxVal = breakdown[0]?.total || 1;
    const breakdownRows = breakdown.map(cat => `
        <div class="space-y-1">
            <div class="flex justify-between text-xs text-earth-600 dark:text-earth-400">
                <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full inline-block" style="background:${cat.color}"></span>
                    ${cat.name}
                </span>
                <span class="font-semibold">${fmtBRL(cat.total)}</span>
            </div>
            <div class="w-full h-1.5 bg-earth-100 dark:bg-earth-800 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all" style="width:${((cat.total / maxVal) * 100).toFixed(0)}%;background:${cat.color}"></div>
            </div>
        </div>`).join('');

    // Cards de contas bancárias
    const accountCards = accounts.map(acc => `
        <div class="relative min-w-[220px] p-5 rounded-2xl text-white shadow-lg group" style="background:linear-gradient(135deg,${acc.color}cc,${acc.color}66)">
            <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="btn-edit-acc p-1.5 rounded-lg bg-white/20 hover:bg-white/40 transition-colors" data-id="${acc.id}" title="Editar">
                    <ion-icon name="create-outline" class="text-sm"></ion-icon>
                </button>
                <button class="btn-delete-acc p-1.5 rounded-lg bg-white/20 hover:bg-red-400/60 transition-colors" data-id="${acc.id}" title="Excluir">
                    <ion-icon name="trash-outline" class="text-sm"></ion-icon>
                </button>
            </div>
            <div class="flex items-center gap-2 mb-3">
                <ion-icon name="${acc.icon || 'wallet-outline'}" class="text-xl opacity-90"></ion-icon>
                <p class="text-xs font-medium opacity-80">${acc.type === 'BANK' ? 'Banco' : acc.type === 'WALLET' ? 'Carteira' : acc.type === 'INVESTMENT' ? 'Investimento' : 'Crédito'}</p>
            </div>
            <h4 class="text-base font-bold mb-2">${acc.name}</h4>
            <p class="text-xl font-bold">${fmtBRL(acc.balance)}</p>
        </div>
    `).join('');

    document.getElementById('finance-content').innerHTML = `
        <!-- Seletor de período -->
        <div class="flex flex-wrap items-center gap-3 bg-white dark:bg-earth-900 p-4 rounded-2xl border border-earth-200 dark:border-earth-800">
            <ion-icon name="calendar-outline" class="text-earth-400 text-xl"></ion-icon>
            <select id="finance-month-sel" class="px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 text-sm font-medium focus:ring-2 focus:ring-forest-500 outline-none">
                ${monthOptions}
            </select>
            <select id="finance-year-sel" class="px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 text-sm font-medium focus:ring-2 focus:ring-forest-500 outline-none">
                ${yearOptions}
            </select>
            <span class="text-sm font-semibold text-earth-600 dark:text-earth-400 ml-1">
                ${PT_MONTHS[financeState.month - 1]} ${financeState.year}
            </span>
        </div>

        <!-- Cards resumo -->
        <div class="grid grid-cols-3 gap-4">
            <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-5 rounded-2xl">
                <p class="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Receitas</p>
                <p class="text-xl font-bold text-green-700 dark:text-green-300">${fmtBRL(summary.income)}</p>
            </div>
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-5 rounded-2xl">
                <p class="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Despesas</p>
                <p class="text-xl font-bold text-red-700 dark:text-red-300">${fmtBRL(summary.expense)}</p>
            </div>
            <div class="bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 p-5 rounded-2xl">
                <p class="text-xs text-earth-500 font-medium mb-1">Saldo</p>
                <p class="text-xl font-bold ${balanceClass}">${fmtBRL(summary.balance)}</p>
            </div>
        </div>

        <!-- Contas bancárias -->
        <div>
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold">Contas</h3>
                <button id="btn-new-account" class="flex items-center gap-1.5 text-sm bg-forest-600 hover:bg-forest-700 text-white px-3 py-1.5 rounded-xl transition-colors">
                    <ion-icon name="add-outline"></ion-icon> Nova Conta
                </button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                ${accountCards || '<p class="text-earth-400 text-sm py-4">Nenhuma conta cadastrada.</p>'}
            </div>
        </div>

        <!-- Linha divisória -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Transações -->
            <div class="lg:col-span-2 space-y-3">
                <div class="flex flex-wrap justify-between items-center gap-2">
                    <h3 class="text-lg font-bold">Transações</h3>
                    <button id="btn-new-transaction" class="flex items-center gap-1.5 text-sm bg-forest-600 hover:bg-forest-700 text-white px-3 py-1.5 rounded-xl transition-colors">
                        <ion-icon name="add-outline"></ion-icon> Nova Transação
                    </button>
                </div>

                <!-- Filtros -->
                <div class="bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 rounded-2xl p-4 space-y-3">
                    <div class="flex gap-2 flex-wrap">
                        <div class="flex-1 min-w-[180px] relative">
                            <ion-icon name="search-outline" class="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400"></ion-icon>
                            <input id="finance-search" type="text" placeholder="Buscar por descrição…" value="${financeState.search}"
                                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 bg-transparent text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                        </div>
                        <select id="finance-type-filter" class="px-3 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                            <option value="">Todos os tipos</option>
                            <option value="INCOME" ${financeState.txType === 'INCOME' ? 'selected' : ''}>Receitas</option>
                            <option value="EXPENSE" ${financeState.txType === 'EXPENSE' ? 'selected' : ''}>Despesas</option>
                        </select>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <input id="finance-min-amount" type="number" placeholder="Valor mínimo" value="${financeState.minAmount}" min="0" step="0.01"
                            class="flex-1 min-w-[120px] px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-transparent text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                        <input id="finance-max-amount" type="number" placeholder="Valor máximo" value="${financeState.maxAmount}" min="0" step="0.01"
                            class="flex-1 min-w-[120px] px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-transparent text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                        <button id="finance-clear-filters" class="px-3 py-2 text-sm rounded-xl border border-earth-200 dark:border-earth-700 text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
                            Limpar
                        </button>
                    </div>
                </div>

                <!-- Lista -->
                <div class="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
                    ${txRows}
                </div>
            </div>

            <!-- Painel lateral -->
            <div class="space-y-4">
                <!-- Gastos por categoria -->
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl border border-earth-200 dark:border-earth-800">
                    <h3 class="text-base font-bold mb-4">Gastos por Categoria</h3>
                    ${breakdown.length ? `<div class="space-y-3">${breakdownRows}</div>` : '<p class="text-earth-400 text-sm">Sem despesas no período.</p>'}
                </div>

                <!-- Categorias -->
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-base font-bold">Categorias</h3>
                        <button id="btn-new-category" class="text-xs bg-earth-100 dark:bg-earth-800 hover:bg-earth-200 dark:hover:bg-earth-700 px-2.5 py-1.5 rounded-lg transition-colors">
                            + Nova
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${categories.map(c => `
                            <div class="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-white" style="background:${c.color}">
                                <ion-icon name="${c.icon}" class="text-sm"></ion-icon>
                                <span>${c.name}</span>
                                <button class="btn-edit-cat opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity" data-id="${c.id}" title="Editar">
                                    <ion-icon name="create-outline" class="text-xs"></ion-icon>
                                </button>
                                <button class="btn-delete-cat opacity-0 group-hover:opacity-100 transition-opacity" data-id="${c.id}" title="Excluir">
                                    <ion-icon name="close-outline" class="text-xs"></ion-icon>
                                </button>
                            </div>`).join('')}
                        ${categories.length === 0 ? '<p class="text-earth-400 text-xs">Nenhuma categoria.</p>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    financeBindEvents();
}

// ─── Bind de eventos internos ─────────────────────────────────────────────────
function financeBindEvents() {
    // Seletor de mês/ano
    document.getElementById('finance-month-sel').addEventListener('change', e => {
        financeState.month = parseInt(e.target.value);
        financeLoadMonth();
    });
    document.getElementById('finance-year-sel').addEventListener('change', e => {
        financeState.year = parseInt(e.target.value);
        financeLoadMonth();
    });

    // Filtros de busca (com debounce)
    document.getElementById('finance-search').addEventListener('input', e => {
        financeState.search = e.target.value;
        clearTimeout(financeState._searchTimer);
        financeState._searchTimer = setTimeout(financeLoadMonth, 400);
    });
    document.getElementById('finance-type-filter').addEventListener('change', e => {
        financeState.txType = e.target.value;
        financeLoadMonth();
    });
    document.getElementById('finance-min-amount').addEventListener('change', e => {
        financeState.minAmount = e.target.value;
        financeLoadMonth();
    });
    document.getElementById('finance-max-amount').addEventListener('change', e => {
        financeState.maxAmount = e.target.value;
        financeLoadMonth();
    });
    document.getElementById('finance-clear-filters').addEventListener('click', () => {
        financeState.search = '';
        financeState.txType = '';
        financeState.minAmount = '';
        financeState.maxAmount = '';
        financeLoadMonth();
    });

    // Nova transação
    document.getElementById('btn-new-transaction').addEventListener('click', () =>
        transactionModal.open({ onSaved: financeLoadMonth })
    );

    // Editar transação
    document.querySelectorAll('.btn-edit-tx').forEach(btn =>
        btn.addEventListener('click', () => {
            const tx = financeState.transactions.find(t => t.id == btn.dataset.id);
            if (tx) transactionModal.open({ transaction: tx, onSaved: financeLoadMonth });
        })
    );

    // Excluir transação
    document.querySelectorAll('.btn-delete-tx').forEach(btn =>
        btn.addEventListener('click', () => financeDeleteTransaction(parseInt(btn.dataset.id)))
    );

    // Nova conta
    document.getElementById('btn-new-account').addEventListener('click', () =>
        accountModal.open({ onSaved: async () => { state.accounts = await api.finance.accounts.list(); financeLoadMonth(); } })
    );

    // Editar conta
    document.querySelectorAll('.btn-edit-acc').forEach(btn =>
        btn.addEventListener('click', () => {
            const acc = state.accounts.find(a => a.id == btn.dataset.id);
            if (acc) accountModal.open({ account: acc, onSaved: async () => { state.accounts = await api.finance.accounts.list(); financeLoadMonth(); } });
        })
    );

    // Excluir conta
    document.querySelectorAll('.btn-delete-acc').forEach(btn =>
        btn.addEventListener('click', () => financeDeleteAccount(parseInt(btn.dataset.id)))
    );

    // Nova categoria
    document.getElementById('btn-new-category').addEventListener('click', () =>
        categoryModal.open({ onSaved: async () => { state.categories = await api.finance.categories.list(); financeLoadMonth(); } })
    );

    // Editar categoria
    document.querySelectorAll('.btn-edit-cat').forEach(btn =>
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const cat = state.categories.find(c => c.id == btn.dataset.id);
            if (cat) categoryModal.open({ category: cat, onSaved: async () => { state.categories = await api.finance.categories.list(); financeLoadMonth(); } });
        })
    );

    // Excluir categoria
    document.querySelectorAll('.btn-delete-cat').forEach(btn =>
        btn.addEventListener('click', e => {
            e.stopPropagation();
            financeDeleteCategory(parseInt(btn.dataset.id));
        })
    );
}

async function financeDeleteTransaction(id) {
    const tx = financeState.transactions.find(t => t.id === id);
    const label = tx?.installment_total > 1
        ? `Excluir apenas esta parcela (${tx.installment_current}/${tx.installment_total})?`
        : 'Excluir esta transação?';
    if (!confirm(label)) return;
    try {
        await api.finance.transactions.delete(id);
        await financeLoadMonth();
    } catch (e) {
        alert('Erro ao excluir: ' + e.message);
    }
}

async function financeDeleteAccount(id) {
    if (!confirm('Excluir esta conta? As transações vinculadas serão removidas.')) return;
    try {
        await api.finance.accounts.delete(id);
        state.accounts = await api.finance.accounts.list();
        financeLoadMonth();
    } catch (e) {
        alert('Erro ao excluir conta: ' + e.message);
    }
}

async function financeDeleteCategory(id) {
    if (!confirm('Excluir esta categoria?')) return;
    try {
        await api.finance.categories.delete(id);
        state.categories = await api.finance.categories.list();
        financeLoadMonth();
    } catch (e) {
        alert('Erro ao excluir categoria: ' + e.message);
    }
}

// ─── Entry point chamado pelo router ─────────────────────────────────────────
ui.renderFinance = function (appData) {
    document.getElementById('view-title').innerText = 'Financeiro';
    document.getElementById('view-container').innerHTML = `
        <div id="finance-content" class="animate-in space-y-6"></div>
    `;
    // Sincroniza mês/ano com o estado atual (não reseta ao navegar de volta)
    financeLoadMonth();
};
