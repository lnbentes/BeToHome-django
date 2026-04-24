// api/modules/places.js - Lugares
// Depende de: api/http.js (_http)

const _apiPlaces = {
    list:   ()          => _http.request('/api/places/'),
    create: (data)      => _http.request('/api/places/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)  => _http.request(`/api/places/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
};
