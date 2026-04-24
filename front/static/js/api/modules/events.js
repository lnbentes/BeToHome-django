// api/modules/events.js - Eventos do calendário
// Depende de: api/http.js (_http)

const _apiEvents = {
    list:   ()      => _http.request('/api/events/'),
    create: (data)  => _http.request('/api/events/', { method: 'POST', body: JSON.stringify(data) }),
};
