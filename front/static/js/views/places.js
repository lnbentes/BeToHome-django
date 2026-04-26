// views/places.js - Renderização da tela de Passeios
// Depende de: components/modals/place-modal.js, core/state.js

ui.renderPlaces = function (places) {
    const container = document.getElementById('view-container');
    document.getElementById('view-title').innerText = 'Passeios';

    const placeCards = places.map(place => {
        const stars = Array(5).fill(0).map((_, i) =>
            `<ion-icon name="${i < (place.rating || 0) ? 'star' : 'star-outline'}"></ion-icon>`
        ).join('');

        return `
            <div class="bg-white dark:bg-earth-900 rounded-3xl border border-earth-200 dark:border-earth-800 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div class="relative h-48">
                    <img src="${place.image_url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="${place.name}">
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
                        <div class="flex text-yellow-400">${stars}</div>
                        <button class="btn-edit-place text-forest-600 hover:text-forest-700 font-bold text-sm" data-place-id="${place.id}">Editar</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="animate-in">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-forest-900 dark:text-forest-100">Desejos de Viagem</h2>
                <button id="btn-new-place" class="bg-forest-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-forest-700 transition-all">
                    <ion-icon name="map-outline"></ion-icon> Add Lugar
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${placeCards}
            </div>
        </div>
    `;

    document.getElementById('btn-new-place').addEventListener('click', () => placeModal.open());

    container.querySelectorAll('.btn-edit-place').forEach(btn => {
        btn.addEventListener('click', () => {
            const place = state.places.find(p => p.id === parseInt(btn.dataset.placeId));
            if (place) placeModal.open(place);
        });
    });
};
