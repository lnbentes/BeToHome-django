// views/dashboard.js - Renderização do Dashboard e gráficos

ui.renderDashboard = function (appData) {
    const { user, tasks, transactions } = appData;
    const container = document.getElementById('view-container');
    document.getElementById('view-title').innerText = 'Dashboard';
    document.getElementById('user-name').innerText = user.username || user.name;

    const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;

    const now = new Date();
    const currentMonthTxs = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const income  = currentMonthTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + parseFloat(t.amount), 0);
    const expense = currentMonthTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + parseFloat(t.amount), 0);

    container.innerHTML = `
        <div class="space-y-6">
            <header>
                <h2 class="text-3xl font-bold text-forest-900 dark:text-forest-100">Bem-vindo, ${user.first_name || user.username}</h2>
                <p class="text-earth-600 dark:text-earth-400">Aqui está o que acontece na sua eco-casa hoje.</p>
            </header>

            <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-earth-500">Tarefas Pendentes</p>
                            <h3 class="text-2xl font-bold text-forest-700 mt-1">${pendingTasks}</h3>
                        </div>
                        <div class="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <ion-icon name="alert-circle-outline" class="text-2xl"></ion-icon>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-earth-500">Renda (Mês)</p>
                            <h3 class="text-2xl font-bold text-green-600 mt-1">R$ ${income.toFixed(2)}</h3>
                        </div>
                        <div class="p-2 bg-green-100 text-green-600 rounded-lg">
                            <ion-icon name="trending-up-outline" class="text-2xl"></ion-icon>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-earth-500">Gastos (Mês)</p>
                            <h3 class="text-2xl font-bold text-red-600 mt-1">R$ ${expense.toFixed(2)}</h3>
                        </div>
                        <div class="p-2 bg-red-100 text-red-600 rounded-lg">
                            <ion-icon name="trending-down-outline" class="text-2xl"></ion-icon>
                        </div>
                    </div>
                </div>
                <div class="bg-white dark:bg-earth-900 p-5 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-sm font-medium text-earth-500">Saldo Atual</p>
                            <h3 class="text-2xl font-bold text-forest-600 mt-1">R$ ${(income - expense).toFixed(2)}</h3>
                        </div>
                        <div class="p-2 bg-forest-100 text-forest-600 rounded-lg">
                            <ion-icon name="wallet-outline" class="text-2xl"></ion-icon>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-earth-900 p-4 md:p-6 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800 h-64 md:h-80">
                    <h3 class="text-base md:text-lg font-semibold text-earth-800 dark:text-earth-100 mb-3 md:mb-4 flex items-center gap-2">
                        Fluxo de Caixa
                    </h3>
                    <canvas id="cashflow-chart"></canvas>
                </div>
                <div class="bg-white dark:bg-earth-900 p-4 md:p-6 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800 h-64 md:h-80">
                    <h3 class="text-base md:text-lg font-semibold text-earth-800 dark:text-earth-100 mb-3 md:mb-4">Despesas por Categoria</h3>
                    <canvas id="category-chart"></canvas>
                </div>
            </div>
        </div>
    `;

    ui.initCharts(appData);
};

ui.initCharts = function (appData) {
    const ctx1 = document.getElementById('cashflow-chart');
    if (ctx1) {
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [
                    { label: 'Receitas', data: [1200, 1900, 3000, 5000, 2300, 3400], backgroundColor: '#22c55e', borderRadius: 8 },
                    { label: 'Despesas', data: [2100, 1300, 2200, 3100, 4200, 2300], backgroundColor: '#ef4444', borderRadius: 8 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    const ctx2 = document.getElementById('category-chart');
    if (ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Moradia', 'Lazer', 'Alimentação', 'Saúde'],
                datasets: [{
                    data: [45, 15, 25, 15],
                    backgroundColor: ['#3b82f6', '#ec4899', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }
};
