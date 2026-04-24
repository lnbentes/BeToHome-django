// api/index.js - Definição dos serviços de API
// Depende de: api/http.js (_http)

const api = {
    users: {
        list: () => _http.request('/api/users/'),
    },

    auth: {
        login: (username, password) =>
            _http.request('/api/auth/login/', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            }),
        logout: () =>
            _http.request('/api/auth/logout/', { method: 'POST' }),
    },

    tasks: {
        list:   ()          => _http.request('/api/tasks/'),
        create: (data)      => _http.request('/api/tasks/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data)  => _http.request(`/api/tasks/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id)        => _http.request(`/api/tasks/${id}/`, { method: 'DELETE' }),
    },

    finance: {
        transactions: {
            list:   ()      => _http.request('/api/transactions/'),
            create: (data)  => _http.request('/api/transactions/', { method: 'POST', body: JSON.stringify(data) }),
        },
        accounts: {
            list: () => _http.request('/api/accounts/'),
        },
        categories: {
            list: () => _http.request('/api/categories/'),
        },
    },

    places: {
        list:   ()         => _http.request('/api/places/'),
        create: (data)     => _http.request('/api/places/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => _http.request(`/api/places/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    },

    events: {
        list:   ()      => _http.request('/api/events/'),
        create: (data)  => _http.request('/api/events/', { method: 'POST', body: JSON.stringify(data) }),
    },
};
