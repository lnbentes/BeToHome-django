// api/modules/tasks.js - Tarefas
// Depende de: api/http.js (_http)

const _apiTasks = {
    list:   ()          => _http.request('/api/tasks/'),
    create: (data)      => _http.request('/api/tasks/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data)  => _http.request(`/api/tasks/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id)        => _http.request(`/api/tasks/${id}/`, { method: 'DELETE' }),
};
