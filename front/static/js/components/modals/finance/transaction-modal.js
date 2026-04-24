// components/modals/finance/transaction-modal.js - Modal de criação/edição de transação
// Depende de: modal.js, api/index.js, core/state.js

const transactionModal = {
    /**
     * @param {object}   opts
     * @param {object}   [opts.transaction]  - Transação existente para edição
     * @param {Function} [opts.onSaved]      - Callback após salvar/excluir
     */
    open({ transaction = null, onSaved } = {}) {
        const isEdit = !!transaction;
        const t = transaction || {};

        const accountOptions = state.accounts
            .map(acc => `<option value="${acc.id}" ${t.account == acc.id ? 'selected' : ''}>${acc.name}</option>`)
            .join('');

        const categoryOptions = state.categories
            .map(cat => `<option value="${cat.id}" ${t.category == cat.id ? 'selected' : ''}>${cat.name}</option>`)
            .join('');

        const today = t.date || new Date().toISOString().split('T')[0];
        const isInstallment = isEdit && t.installment_total > 1;

        const deleteBtn = isEdit ? `
            <button type="button" id="tx-modal-delete"
                class="mr-auto px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400
                       hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors font-medium text-sm">
                <ion-icon name="trash-outline" class="mr-1"></ion-icon>Excluir
            </button>` : '';

        modal.open({
            title: isEdit ? 'Editar Transação' : 'Nova Transação',
            size: 'lg',
            body: `
                <form id="tx-modal-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Descrição *</label>
                        <input type="text" name="description" value="${t.description || ''}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="Ex: Mercado, Salário..." required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Valor (R$) *</label>
                            <input type="number" name="amount" step="0.01" min="0.01" value="${t.amount || ''}"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                                placeholder="0,00" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Tipo *</label>
                            <select name="type" id="tx-type-sel"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                <option value="EXPENSE" ${(!t.type || t.type === 'EXPENSE') ? 'selected' : ''}>Despesa</option>
                                <option value="INCOME"  ${t.type === 'INCOME' ? 'selected' : ''}>Receita</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Método</label>
                            <select name="method" id="tx-method-sel"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                <option value="DEBIT"       ${t.method === 'DEBIT'       ? 'selected' : ''}>Débito</option>
                                <option value="CREDIT"      ${t.method === 'CREDIT'      ? 'selected' : ''}>Crédito</option>
                                <option value="CASH"        ${t.method === 'CASH'        ? 'selected' : ''}>Dinheiro</option>
                                <option value="PIX"         ${t.method === 'PIX'         ? 'selected' : ''}>Pix</option>
                                <option value="INSTALLMENT" ${(t.method === 'INSTALLMENT' || isInstallment) ? 'selected' : ''}>Parcelado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Data *</label>
                            <input type="date" name="date" value="${today}"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                                required>
                        </div>
                    </div>

                    <!-- Parcelas (aparece quando método = INSTALLMENT) -->
                    <div id="tx-installment-row" class="${(isEdit || (t.method !== 'INSTALLMENT' && t.method !== 'CREDIT')) ? 'hidden' : ''} bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <label class="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                            <ion-icon name="layers-outline" class="mr-1"></ion-icon>Número de parcelas
                        </label>
                        <input type="number" name="installments" min="2" max="60" value="${isInstallment ? t.installment_total : 2}"
                            class="w-full px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                            placeholder="Ex: 12">
                        <p class="text-xs text-amber-600 dark:text-amber-400 mt-1.5">O valor total será dividido igualmente entre os meses.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Conta</label>
                            <select name="account"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                ${accountOptions || '<option value="">Nenhuma conta</option>'}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Categoria</label>
                            <select name="category"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                <option value="">Sem categoria</option>
                                ${categoryOptions}
                            </select>
                        </div>
                    </div>

                    ${isEdit && isInstallment ? `
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
                        <ion-icon name="information-circle-outline" class="mr-1"></ion-icon>
                        Esta é a parcela <strong>${t.installment_current}/${t.installment_total}</strong>. Apenas ela será alterada.
                    </div>` : ''}

                    <p id="tx-modal-error" class="text-red-500 text-sm hidden"></p>
                </form>
            `,
            footer: `
                ${deleteBtn}
                <button type="button" id="tx-modal-cancel"
                    class="px-5 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300
                           hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors font-medium">
                    Cancelar
                </button>
                <button type="submit" form="tx-modal-form" id="tx-modal-submit"
                    class="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-medium transition-all">
                    ${isEdit ? 'Salvar Alterações' : 'Registrar'}
                </button>
            `,
        });

        // Toggle parcelas conforme método selecionado
        document.getElementById('tx-method-sel').addEventListener('change', e => {
            const row = document.getElementById('tx-installment-row');
            if (!isEdit && (e.target.value === 'INSTALLMENT' || e.target.value === 'CREDIT')) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });

        document.getElementById('tx-modal-cancel').addEventListener('click', () => modal.close());

        if (isEdit) {
            document.getElementById('tx-modal-delete').addEventListener('click', async () => {
                if (!confirm('Excluir esta transação?')) return;
                try {
                    await api.finance.transactions.delete(t.id);
                    modal.close();
                    if (onSaved) onSaved();
                } catch (err) {
                    alert('Erro ao excluir: ' + err.message);
                }
            });
        }

        document.getElementById('tx-modal-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            const errorEl   = document.getElementById('tx-modal-error');
            const submitBtn = document.getElementById('tx-modal-submit');

            if (!data.category) delete data.category;
            if (isEdit) delete data.installments;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                if (isEdit) {
                    await api.finance.transactions.update(t.id, data);
                } else {
                    await api.finance.transactions.create(data);
                }
                modal.close();
                if (onSaved) onSaved();
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = isEdit ? 'Salvar Alterações' : 'Registrar';
            }
        });
    },
};
