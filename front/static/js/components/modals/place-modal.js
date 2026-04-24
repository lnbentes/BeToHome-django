// components/modals/place-modal.js - Modal de criação/edição de passeios
// Depende de: modal.js, api/index.js, core/state.js, core/router.js

const placeModal = {
    open(place = null) {
        const isEdit = place !== null;

        modal.open({
            title: isEdit ? 'Editar Lugar' : 'Novo Lugar',
            size: 'lg',
            body: `
                <form id="place-modal-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Nome *</label>
                        <input type="text" name="name" value="${isEdit ? place.name : ''}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="Ex: Jardim Botânico" required>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Localização</label>
                        <input type="text" name="location" value="${isEdit ? (place.location || '') : ''}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="Ex: São Paulo, SP">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">URL da Imagem</label>
                        <input type="url" name="image_url" value="${isEdit ? (place.image_url || '') : ''}"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="https://...">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Notas</label>
                        <textarea name="notes" rows="3"
                            class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all resize-none"
                            placeholder="Observações sobre o lugar...">${isEdit ? (place.notes || '') : ''}</textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-1">Avaliação (1–5)</label>
                            <input type="number" name="rating" min="1" max="5"
                                value="${isEdit ? (place.rating || '') : ''}"
                                class="w-full px-4 py-3 rounded-xl border border-earth-200 dark:border-earth-700 bg-white dark:bg-earth-800 focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                                placeholder="1 a 5">
                        </div>
                        <div class="flex flex-col justify-end pb-1">
                            <label class="flex items-center gap-3 cursor-pointer select-none">
                                <input type="checkbox" name="visited" ${(isEdit && place.visited) ? 'checked' : ''}
                                    class="w-5 h-5 rounded text-forest-600 focus:ring-forest-500">
                                <span class="text-sm font-medium text-earth-700 dark:text-earth-300">Já visitei</span>
                            </label>
                        </div>
                    </div>

                    <p id="place-modal-error" class="text-red-500 text-sm hidden"></p>
                </form>
            `,
            footer: `
                <button type="button" id="place-modal-cancel"
                    class="px-5 py-2.5 rounded-xl border border-earth-200 dark:border-earth-700 text-earth-700 dark:text-earth-300
                           hover:bg-earth-50 dark:hover:bg-earth-800 transition-colors font-medium">
                    Cancelar
                </button>
                <button type="submit" form="place-modal-form" id="place-modal-submit"
                    class="px-5 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-medium transition-all">
                    ${isEdit ? 'Salvar' : 'Adicionar Lugar'}
                </button>
            `,
        });

        document.getElementById('place-modal-cancel').addEventListener('click', () => modal.close());

        document.getElementById('place-modal-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.visited = formData.has('visited'); // checkbox → boolean

            const errorEl  = document.getElementById('place-modal-error');
            const submitBtn = document.getElementById('place-modal-submit');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Salvando...';

            try {
                if (isEdit) {
                    const updated = await api.places.update(place.id, data);
                    const idx = state.places.findIndex(p => p.id === place.id);
                    if (idx !== -1) state.places[idx] = updated;
                } else {
                    const created = await api.places.create(data);
                    state.places.push(created);
                }
                modal.close();
                router.navigateTo('places');
            } catch (err) {
                errorEl.textContent = err.message;
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = isEdit ? 'Salvar' : 'Adicionar Lugar';
            }
        });
    },
};
