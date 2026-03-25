// api.js - Centralized API calls with CSRF support

const api = {
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    async request(url, options = {}) {
        const csrfToken = this.getCookie('csrftoken');
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        };

        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, mergedOptions);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.detail || 'API Error');
            }
            return data;
        } catch (error) {
            console.error(`API Error (${url}):`, error);
            throw error;
        }
    },

    auth: {
        async login(username, password) {
            return api.request('/api/auth/login/', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });
        },
        async logout() {
            return api.request('/api/auth/logout/', {
                method: 'POST',
            });
        }
    },

    tasks: {
        list: () => api.request('/api/tasks/'),
        create: (data) => api.request('/api/tasks/', { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => api.request(`/api/tasks/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => api.request(`/api/tasks/${id}/`, { method: 'DELETE' }),
    },

    finance: {
        transactions: {
            list: () => api.request('/api/transactions/'),
            create: (data) => api.request('/api/transactions/', { method: 'POST', body: JSON.stringify(data) }),
        },
        accounts: {
            list: () => api.request('/api/accounts/'),
        },
        categories: {
            list: () => api.request('/api/categories/'),
        }
    },

    places: {
        list: () => api.request('/api/places/'),
        create: (data) => api.request('/api/places/', { method: 'POST', body: JSON.stringify(data) }),
    },

    events: {
        list: () => api.request('/api/events/'),
    }
};
