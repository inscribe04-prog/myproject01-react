const BASE = import.meta.env.VITE_API_URL || ''; // v2
console.log("BASE URL:", BASE);
const api = {
    async getEntries() {
        const res = await fetch(`${BASE}/api/entries`);
        return res.ok ? await res.json() : [];
    },

    async create(data) {
        const res = await fetch(`${BASE}/api/entries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data)
        });
        return res.ok;
    },

    async update(id, data) {
        const res = await fetch(`${BASE}/api/entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(data)
        });
        return res.ok;
    },

    async delete(id) {
        const res = await fetch(`${BASE}/api/entries/${id}`, { method: 'DELETE' });
        return res.ok;
    },

    async getCurrentUser() {
        try { 
        const res = await fetch(`${BASE}/me`);
        if (!res.ok) return null;
        return await res.json();
        } catch {
            return null;
        }
    }
};

export default api;