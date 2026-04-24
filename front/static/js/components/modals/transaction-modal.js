// components/modals/transaction-modal.js - Modal de criação de transação financeira
// Depende de: modal.js, api/index.js, core/state.js, core/router.js

const transactionModal = {
    open() {
        const accountOptions = state.accounts
            .map(acc => `<option value="${acc.id}">${acc.name}</option>`)
            .join('');

        const categoryOptions = state.categories
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join('');

        const today = new Date().toISOString().split('T')[0];

        modal.open({
            title: 'Nova Transação',
            body: `
                <form id="transaction-modal-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Descrição *</label>
                        <input type="text" name="description"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="Ex: Mercado, Salário..." required>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Valor (R$) *</label>
                            <input type="number" name="amount" step="0.01" min="0.01"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                                placeholder="0,00" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Tipo</label>
                            <select name="type"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                <option value="EXPENSE">Despesa</option>
                                <option value="INCOME">Receita</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Data</label>
                        <input type="date" name="date" value="${today}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
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
                                ${categoryOptions || '<option value="">Geral</option>'}
                            </select>
                        </div>
                    </div>

                    <p id="transaction-modal-error" class="text-red-500 text-sm hidden"></p>
                </form>
            `,
            footer: `
                <button type="button" id="transaction-modal-cancel"
                    class="px-5 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300
                           hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors font-medium">
                    Cancelar
                </button>
                <button type="submit" form="transaction-modal-form" id="transaction-modal-submit"
                    class="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-medium transition-all">
                    Salvar Transação
                </button>
            `,
        });

        document.getElementById('transaction-modal-cancel').addEventListener('click', () => modal.close());

        document.getElementById('transaction-modal-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            const errorEl   = document.getElementById('transaction-modal-error');
            const submitBtn = document.getElementById('transaction-modal-submit');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                const created = await api.finance.transactions.create(data);
                state.transactions.push(created);
                modal.close();
                router.navigateTo('finance');
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Salvar Transação';
            }
        });
    },
};
