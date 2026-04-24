// components/modals/task-modal.js - Modal de criação/edição de tarefas
// Depende de: modal.js, api/index.js, core/state.js, core/router.js

const taskModal = {
    open(task = null) {
        const isEdit = task !== null;

        modal.open({
            title: isEdit ? 'Editar Tarefa' : 'Nova Tarefa',
            body: `
                <form id="task-modal-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Título *</label>
                        <input type="text" name="title" value="${isEdit ? task.title : ''}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="Ex: Limpar o jardim" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Descrição</label>
                        <textarea name="description" rows="3"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all resize-none"
                            placeholder="Detalhes da tarefa...">${isEdit ? (task.description || '') : ''}</textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Vencimento</label>
                            <input type="date" name="due_date" value="${isEdit ? (task.due_date || '') : ''}"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Status</label>
                            <select name="status"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all">
                                <option value="PENDING"     ${(!isEdit || task.status === 'PENDING')      ? 'selected' : ''}>Pendente</option>
                                <option value="IN_PROGRESS" ${(isEdit  && task.status === 'IN_PROGRESS') ? 'selected' : ''}>Em andamento</option>
                                <option value="COMPLETED"   ${(isEdit  && task.status === 'COMPLETED')   ? 'selected' : ''}>Concluída</option>
                            </select>
                        </div>
                    </div>

                    <p id="task-modal-error" class="text-red-500 text-sm hidden"></p>
                </form>
            `,
            footer: `
                <button type="button" id="task-modal-cancel"
                    class="px-5 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300
                           hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors font-medium">
                    Cancelar
                </button>
                <button type="submit" form="task-modal-form" id="task-modal-submit"
                    class="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-medium transition-all">
                    ${isEdit ? 'Salvar' : 'Criar Tarefa'}
                </button>
            `,
        });

        document.getElementById('task-modal-cancel').addEventListener('click', () => modal.close());

        document.getElementById('task-modal-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target).entries());
            const errorEl  = document.getElementById('task-modal-error');
            const submitBtn = document.getElementById('task-modal-submit');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                if (isEdit) {
                    const updated = await api.tasks.update(task.id, data);
                    const idx = state.tasks.findIndex(t => t.id === task.id);
                    if (idx !== -1) state.tasks[idx] = updated;
                } else {
                    const created = await api.tasks.create(data);
                    state.tasks.push(created);
                }
                modal.close();
                router.navigateTo('tasks');
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = isEdit ? 'Salvar' : 'Criar Tarefa';
            }
        });
    },
};
