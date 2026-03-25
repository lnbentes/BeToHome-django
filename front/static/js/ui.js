// ui.js - Responsible for rendering components to the DOM

const ui = {
    // Utility to show/hide sections
    showApp() {
        document.getElementById('layout-wrapper').classList.remove('hidden');
        document.getElementById('login-wrapper').classList.add('hidden');
    },

    showLogin() {
        document.getElementById('layout-wrapper').classList.add('hidden');
        document.getElementById('login-wrapper').classList.remove('hidden');
        this.renderLogin();
    },

    renderLogin() {
        const container = document.getElementById('login-wrapper');
        container.innerHTML = `
            <div class="bg-white dark:bg-earth-900 p-8 rounded-3xl shadow-xl border border-earth-200 dark:border-earth-800 w-full max-auto max-w-md animate-in">
                <div class="flex flex-col items-center mb-8">
                    <div class="w-16 h-16 bg-forest-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4">
                        <ion-icon name="leaf"></ion-icon>
                    </div>
                    <h1 class="text-3xl font-serif font-bold text-forest-900 dark:text-forest-100">BeTo's House</h1>
                    <p class="text-earth-500">Eco-Home Management System</p>
                </div>

                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Usuário</label>
                        <input type="text" id="login-username" class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Senha</label>
                        <input type="password" id="login-password" class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all" required>
                    </div>
                    <button type="submit" class="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-forest-500/20 active:scale-[0.98]">
                        Entrar
                    </button>
                </form>

                <div id="login-error" class="mt-4 text-red-500 text-sm text-center hidden"></div>

                <div class="mt-8 text-center text-sm text-earth-500">
                    Ainda não tem conta? <a href="#" class="text-forest-600 font-bold">Solicite acesso</a>
                </div>
            </div>
        `;
    },

    renderDashboard(appData) {
        const { user, tasks, transactions, categories } = appData;
        const container = document.getElementById('view-container');
        document.getElementById('view-title').innerText = 'Dashboard';
        document.getElementById('user-name').innerText = user.username || user.name;
        
        // Stats calculations
        const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
        
        const now = new Date();
        const currentMonthTxs = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const income = currentMonthTxs.filter(t => t.type === 'INCOME').reduce((s, t) => s + parseFloat(t.amount), 0);
        const expense = currentMonthTxs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + parseFloat(t.amount), 0);

        container.innerHTML = `
            <div class="space-y-6">
                <header>
                    <h2 class="text-3xl font-bold text-forest-900 dark:text-forest-100">Bem-vindo, ${user.first_name || user.username}</h2>
                    <p class="text-earth-600 dark:text-earth-400">Aqui está o que acontece na sua eco-casa hoje.</p>
                </header>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <div class="bg-white dark:bg-earth-900 p-6 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800 h-80">
                        <h3 class="text-lg font-semibold text-earth-800 dark:text-earth-100 mb-4 flex items-center gap-2">
                             Fluxo de Caixa
                        </h3>
                        <canvas id="cashflow-chart"></canvas>
                    </div>
                    <div class="bg-white dark:bg-earth-900 p-6 rounded-2xl shadow-sm border border-earth-200 dark:border-earth-800 h-80">
                        <h3 class="text-lg font-semibold text-earth-800 dark:text-earth-100 mb-4">Despesas por Categoria</h3>
                        <canvas id="category-chart"></canvas>
                    </div>
                </div>
            </div>
        `;

        this.initCharts(appData);
    },

    initCharts(appData) {
        // Simple data aggregation for charts
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
                    scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
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
    },

    renderTasks(tasks) {
        const container = document.getElementById('view-container');
        document.getElementById('view-title').innerText = 'Tarefas';
        container.innerHTML = `
            <div class="animate-in">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-forest-900 dark:text-forest-100">Suas Tarefas</h2>
                    <button class="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
                        <ion-icon name="add-outline"></ion-icon> Nova Tarefa
                    </button>
                </div>
                <div class="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
                    ${tasks.length ? tasks.map(task => `
                        <div class="flex items-center justify-between p-4 border-b border-earth-100 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-full bg-forest-100 text-forest-600 flex items-center justify-center">
                                    <ion-icon name="${task.status === 'COMPLETED' ? 'checkbox' : 'square-outline'}"></ion-icon>
                                </div>
                                <div>
                                    <h4 class="font-bold text-earth-800 dark:text-earth-200 ${task.status === 'COMPLETED' ? 'line-through opacity-50' : ''}">${task.title}</h4>
                                    <p class="text-xs text-earth-500">${task.due_date}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-3 py-1 text-xs rounded-full ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                                    ${task.status}
                                </span>
                                <button class="p-2 text-earth-400 hover:text-earth-600 transition-colors">
                                    <ion-icon name="ellipsis-vertical"></ion-icon>
                                </button>
                            </div>
                        </div>
                    `).join('') : '<div class="p-12 text-center text-earth-500">Nenhuma tarefa encontrada.</div>'}
                </div>
            </div>
        `;
    },

    renderFinance(appData) {
        const { transactions, accounts, categories } = appData;
        const container = document.getElementById('view-container');
        document.getElementById('view-title').innerText = 'Financeiro';
        container.innerHTML = `
            <div class="animate-in space-y-6">
                <!-- Accounts row -->
                <div class="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    ${accounts.map(acc => `
                        <div class="min-w-[240px] p-5 rounded-2xl text-white shadow-lg" style="background: linear-gradient(135deg, ${acc.color}, #00000066)">
                            <p class="text-xs opacity-80">${acc.type}</p>
                            <h4 class="text-lg font-bold mb-4">${acc.name}</h4>
                            <p class="text-2xl font-bold">R$ ${parseFloat(acc.balance).toFixed(2).replace('.', ',')}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="text-xl font-bold">Últimas Transações</h3>
                            <div class="flex gap-2">
                                <button class="bg-white dark:bg-earth-800 p-2 rounded-lg border border-earth-200 dark:border-earth-700"><ion-icon name="filter-outline"></ion-icon></button>
                                <button class="bg-forest-600 text-white px-4 py-2 rounded-xl">Add +</button>
                            </div>
                        </div>
                        <div class="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
                            ${transactions.map(t => {
                                const cat = categories.find(c => c.id == t.category) || { name: 'Geral', color: '#888' };
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
                            }).join('')}
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
    },

    renderPlaces(places) {
        const container = document.getElementById('view-container');
        document.getElementById('view-title').innerText = 'Passeios';
        container.innerHTML = `
            <div class="animate-in">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-forest-900 dark:text-forest-100">Desejos de Viagem</h2>
                    <button class="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
                        <ion-icon name="map-outline"></ion-icon> Add Lugar
                    </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${places.map(place => `
                        <div class="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                            <div class="relative h-48">
                                <img src="${place.image_url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-forest-700">
                                    ${place.visited ? 'Visitado' : 'A visitar'}
                                </div>
                            </div>
                            <div class="p-5">
                                <h4 class="text-xl font-bold text-earth-800 dark:text-earth-100">${place.name}</h4>
                                <div class="flex items-center gap-1 text-earth-500 text-sm mt-1 mb-3">
                                    <ion-icon name="location"></ion-icon> ${place.location}
                                </div>
                                <p class="text-sm text-earth-600 dark:text-earth-400 line-clamp-2">${place.notes || ''}</p>
                                <div class="mt-4 pt-4 border-t border-earth-100 dark:border-earth-800 flex justify-between items-center">
                                    <div class="flex text-yellow-400">
                                        ${Array(5).fill(0).map((_, i) => `<ion-icon name="${i < (place.rating || 0) ? 'star' : 'star-outline'}"></ion-icon>`).join('')}
                                    </div>
                                    <button class="text-forest-600 hover:text-forest-700 font-bold text-sm">Editar</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderCalendar(events) {
        const container = document.getElementById('view-container');
        document.getElementById('view-title').innerText = 'Calendário';
        container.innerHTML = `
            <div class="animate-in bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 p-8">
                <div class="flex justify-between items-center mb-8">
                    <h2 class="text-2xl font-bold flex items-center gap-3">
                        <ion-icon name="calendar-outline" class="text-forest-600"></ion-icon>
                        Junho 2024
                    </h2>
                    <div class="flex gap-2">
                        <button class="p-2 rounded-xl border border-earth-200 dark:border-earth-800"><ion-icon name="chevron-back"></ion-icon></button>
                        <button class="p-2 rounded-xl border border-earth-200 dark:border-earth-800"><ion-icon name="chevron-forward"></ion-icon></button>
                    </div>
                </div>
                
                <div class="grid grid-cols-7 gap-px bg-earth-200 dark:bg-earth-800 rounded-xl overflow-hidden shadow-inner">
                    ${['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => `<div class="bg-earth-50 dark:bg-earth-950 p-4 text-center text-xs font-bold text-earth-500 uppercase">${d}</div>`).join('')}
                    ${Array(31).fill(0).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
                        return `
                            <div class="bg-white dark:bg-earth-900 min-h-[120px] p-2 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
                                <span class="text-sm font-medium ${day === 20 ? 'bg-forest-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-earth-400'}">${day}</span>
                                <div class="mt-2 space-y-1">
                                    ${dayEvents.map(e => `
                                        <div class="text-[10px] p-1 rounded bg-${e.color}-100 text-${e.color}-700 truncate border-l-2 border-${e.color}-500">
                                            ${e.title}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};
