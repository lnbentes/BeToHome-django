// views/tasks.js - Renderização da tela de Tarefas
// Depende de: components/modals/task-modal.js, core/state.js

ui.renderTasks = function (tasks) {
    const container = document.getElementById('view-container');
    document.getElementById('view-title').innerText = 'Tarefas';

    const statusLabel = { COMPLETED: 'Concluída', PENDING: 'Pendente', IN_PROGRESS: 'Em andamento' };

    const taskItems = tasks.length
        ? tasks.map(task => `
            <div class="flex items-center gap-3 p-3 md:p-4 border-b border-earth-100 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors">
                <div class="w-9 h-9 shrink-0 rounded-full bg-forest-100 text-forest-600 flex items-center justify-center">
                    <ion-icon name="${task.status === 'COMPLETED' ? 'checkbox' : 'square-outline'}"></ion-icon>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-earth-800 dark:text-earth-200 truncate ${task.status === 'COMPLETED' ? 'line-through opacity-50' : ''}">${task.title}</h4>
                    <p class="text-xs text-earth-500">${task.due_date || ''}</p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <span class="hidden sm:inline px-2.5 py-1 text-xs rounded-full ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                        ${statusLabel[task.status] || task.status}
                    </span>
                    <button class="btn-edit-task p-2 rounded-lg text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-earth-700 transition-colors" data-task-id="${task.id}">
                        <ion-icon name="ellipsis-vertical"></ion-icon>
                    </button>
                </div>
            </div>
        `).join('')
        : '<div class="p-12 text-center text-earth-500">Nenhuma tarefa encontrada.</div>';

    container.innerHTML = `
        <div class="animate-in">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-forest-900 dark:text-forest-100">Suas Tarefas</h2>
                <button id="btn-new-task" class="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
                    <ion-icon name="add-outline"></ion-icon> Nova Tarefa
                </button>
            </div>
            <div class="bg-white dark:bg-earth-900 rounded-2xl border border-earth-200 dark:border-earth-800 overflow-hidden">
                ${taskItems}
            </div>
        </div>
    `;

    document.getElementById('btn-new-task').addEventListener('click', () => taskModal.open());

    container.querySelectorAll('.btn-edit-task').forEach(btn => {
        btn.addEventListener('click', () => {
            const task = state.tasks.find(t => t.id === parseInt(btn.dataset.taskId));
            if (task) taskModal.open(task);
        });
    });
};
