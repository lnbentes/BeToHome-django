// views/finance/loader.js - Busca dados do mês selecionado via API
// Depende de: finance/state.js, api/index.js

async function financeLoadMonth() {
    const { year, month, search, minAmount, maxAmount, txType } = financeState;
    try {
        const [summary, txList] = await Promise.all([
            api.finance.transactions.summary({ year, month }),
            api.finance.transactions.list({
                year, month, search,
                min_amount: minAmount,
                max_amount: maxAmount,
                type: txType,
            }),
        ]);
        financeState.summary      = summary;
        financeState.transactions = txList;
        state.transactions        = txList;
    } catch (e) {
        console.error('Erro ao carregar financeiro:', e);
    }
    financeRenderContent();
}
