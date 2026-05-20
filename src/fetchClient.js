const BASE = import.meta.env.VITE_API_URL || '';

export default function fetchClient(path, options = {}) {
    return fetch(`${BASE}${path}`, {
        ...options,
        credentials: 'same-origin'
    });
}