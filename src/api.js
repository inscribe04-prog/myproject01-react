import fetchClient from './fetchClient';

const api = {
    async getEntries() {
        const res = await fetchClient('/api/entries');
        return res.ok ? await res.json() : [];
    },
    async create(data) {
        const res = await fetchClient('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data)
        });
        return res.ok;
    },
    async update(id, data) {
        const res = await fetchClient(`/api/entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data)
        });
        return res.ok;
    },
    async delete(id) {
        const res = await fetchClient(`/api/entries/${id}`, { method: 'DELETE' });
        return res.ok;
    },
    async getCurrentUser() {
        try {
            const res = await fetchClient('/me');
            if (!res.ok) return null;
            return await res.json();
        } catch {
            return null;
        }
    },
    async login(email, password) {
        return fetchClient('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ email, password })
        });
    },
    async register(firstname, lastname, email, password) {
        return fetchClient('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ firstname, lastname, email, password })
        });
    },
    async logout() {
        return fetchClient('/logout');
    }
};

export default api;