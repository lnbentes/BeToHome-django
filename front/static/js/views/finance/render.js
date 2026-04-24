// views/finance/render.js - Gera o HTML da tela financeira e injeta no DOM
// Depende de: finance/state.js, finance/events.js (financeBindEvents)

function financeRenderContent() {
    const { summary, transactions } = financeState;
    const { accounts, categories }  = state;

    // ── Seletor de mês/ano ────────────────────────────────────────────────────
    const monthOptions = PT_MONTHS.map((name, i) =>
        `<option value="${i + 1}" ${(i + 1) === financeState.month ? 'selected' : ''}>${name}</option>`
    ).join('');

    const yearRange   = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
    const yearOptions = yearRange.map(y =>
        `<option value="${y}" ${y === financeState.year ? 'selected' : ''}>${y}</option>`
    ).join('');

    // ── Cards de resumo ───────────────────────────────────────────────────────
    const balanceClass = summary.balance >= 0
        ? 'text-green-600 dark:text-green-400'
        : 'text-red-500';

    // ── Linhas de transações ──────────────────────────────────────────────────
    const txRows = transactions.length === 0
        ? `<div class="p-8 text-center text-earth-400">
               <ion-icon name="receipt-outline" class="text-4xl mb-2 block"></ion-icon>
               Nenhuma transação neste período
           </div>`
        : transactions.map(t => {
            const catColor = t.category_color || '#888';
            const catIcon  = t.category_icon  || 'help-outline';
            const catName  = t.category_name  || 'Geral';
            const sign     = t.type === 'INCOME' ? '+' : '-';
            const amtClass = t.type === 'INCOME'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500';
            const installBadge = t.installment_total
                ? `<span class="ml-2 text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                       ${t.installment_current}/${t.installment_total}x
                   </span>`
                : '';
            return `
            <div class="flex items-center justify-between p-4 border-b border-earth-100 dark:border-earth-800 last:border-0
                        group hover:bg-earth-50 dark:hover:bg-earth-800/50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                         style="background-color:${catColor}">
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
                        <button class="btn-edit-tx p-1.5 rounded-lg hover:bg-earth-200 dark:hover:bg-earth-700 transition-colors"
                                data-id="${t.id}" title="Editar">
                            <ion-icon name="create-outline" class="text-earth-500"></ion-icon>
                        </button>
                        <button class="btn-delete-tx p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                data-id="${t.id}" title="Excluir">
                            <ion-icon name="trash-outline" class="text-red-400"></ion-icon>
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

    // ── Breakdown de categorias ───────────────────────────────────────────────
    const breakdown = (summary.category_breakdown || []).slice(0, 6);
    const maxVal    = breakdown[0]?.total || 1;
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
                <div class="h-full rounded-full transition-all"
                     style="width:${((cat.total / maxVal) * 100).toFixed(0)}%;background:${cat.color}"></div>
            </div>
        </div>`).join('');

    // ── Cards de contas ───────────────────────────────────────────────────────
    const typeLabel = { BANK: 'Banco', WALLET: 'Carteira', INVESTMENT: 'Investimento', CREDIT: 'Crédito' };
    const accountCards = accounts.map(acc => `
        <div class="relative min-w-[220px] p-5 rounded-2xl text-white shadow-lg group"
             style="background:linear-gradient(135deg,${acc.color}cc,${acc.color}66)">
            <div class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="btn-edit-acc p-1.5 rounded-lg bg-white/20 hover:bg-white/40 transition-colors"
                        data-id="${acc.id}" title="Editar">
                    <ion-icon name="create-outline" class="text-sm"></ion-icon>
                </button>
                <button class="btn-delete-acc p-1.5 rounded-lg bg-white/20 hover:bg-red-400/60 transition-colors"
                        data-id="${acc.id}" title="Excluir">
                    <ion-icon name="trash-outline" class="text-sm"></ion-icon>
                </button>
            </div>
            <div class="flex items-center gap-2 mb-3">
                <ion-icon name="${acc.icon || 'wallet-outline'}" class="text-xl opacity-90"></ion-icon>
                <p class="text-xs font-medium opacity-80">${typeLabel[acc.type] || acc.type}</p>
            </div>
            <h4 class="text-base font-bold mb-2">${acc.name}</h4>
            <p class="text-xl font-bold">${fmtBRL(acc.balance)}</p>
        </div>`).join('');

    // ── Chips de categorias ───────────────────────────────────────────────────
    const categoryChips = categories.map(c => `
        <div class="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-white"
             style="background:${c.color}">
            <ion-icon name="${c.icon}" class="text-sm"></ion-icon>
            <span>${c.name}</span>
            <button class="btn-edit-cat opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity"
                    data-id="${c.id}" title="Editar">
                <ion-icon name="create-outline" class="text-xs"></ion-icon>
            </button>
            <button class="btn-delete-cat opacity-0 group-hover:opacity-100 transition-opacity"
                    data-id="${c.id}" title="Excluir">
                <ion-icon name="close-outline" class="text-xs"></ion-icon>
            </button>
        </div>`).join('');

    // ── Injeção no DOM ────────────────────────────────────────────────────────
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

        <!-- Resumo mensal -->
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

        <!-- Contas -->
        <div>
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold">Contas</h3>
                <button id="btn-new-account"
                    class="flex items-center gap-1.5 text-sm bg-forest-600 hover:bg-forest-700 text-white px-3 py-1.5 rounded-xl transition-colors">
                    <ion-icon name="add-outline"></ion-icon> Nova Conta
                </button>
            </div>
            <div class="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                ${accountCards || '<p class="text-earth-400 text-sm py-4">Nenhuma conta cadastrada.</p>'}
            </div>
        </div>

        <!-- Grid principal -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Transações -->
            <div class="lg:col-span-2 space-y-3">
                <div class="flex flex-wrap justify-between items-center gap-2">
                    <h3 class="text-lg font-bold">Transações</h3>
                    <button id="btn-new-transaction"
                        class="flex items-center gap-1.5 text-sm bg-forest-600 hover:bg-forest-700 text-white px-3 py-1.5 rounded-xl transition-colors">
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
                        <select id="finance-type-filter"
                            class="px-3 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                            <option value="">Todos os tipos</option>
                            <option value="INCOME"  ${financeState.txType === 'INCOME'  ? 'selected' : ''}>Receitas</option>
                            <option value="EXPENSE" ${financeState.txType === 'EXPENSE' ? 'selected' : ''}>Despesas</option>
                        </select>
                    </div>
                    <div class="flex gap-2 flex-wrap">
                        <input id="finance-min-amount" type="number" placeholder="Valor mínimo"
                            value="${financeState.minAmount}" min="0" step="0.01"
                            class="flex-1 min-w-[120px] px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-transparent text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                        <input id="finance-max-amount" type="number" placeholder="Valor máximo"
                            value="${financeState.maxAmount}" min="0" step="0.01"
                            class="flex-1 min-w-[120px] px-3 py-2 rounded-xl border border-earth-200 dark:border-earth-700 bg-transparent text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                        <button id="finance-clear-filters"
                            class="px-3 py-2 text-sm rounded-xl border border-earth-200 dark:border-earth-700 text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
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
                    ${breakdown.length
                        ? `<div class="space-y-3">${breakdownRows}</div>`
                        : '<p class="text-earth-400 text-sm">Sem despesas no período.</p>'}
                </div>

                <!-- Gerenciar Categorias -->
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-base font-bold">Categorias</h3>
                        <button id="btn-new-category"
                            class="text-xs bg-earth-100 dark:bg-earth-800 hover:bg-earth-200 dark:hover:bg-earth-700 px-2.5 py-1.5 rounded-lg transition-colors">
                            + Nova
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        ${categoryChips}
                        ${categories.length === 0 ? '<p class="text-earth-400 text-xs">Nenhuma categoria.</p>' : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    financeBindEvents();
}
