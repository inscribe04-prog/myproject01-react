import { useState, useEffect } from 'react';

export const useDashboard = () => {
    const [stats, setStats] = useState({ totalEntries: 0, activeContributors: 0, todayEntries: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/dashboard/stats', { credentials: 'include' });;
            if (!response.ok) {
            console.error('Stats fetch failed:', response.status);
            return;  
            }
            const data = await response.json();
            console.log('Fetched Stats:', data);
            setStats(data); 
        } catch (error) {
            console.error('Dashboard Stats Error:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchStats();        
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return { stats, loading, refreshStats: fetchStats };
};