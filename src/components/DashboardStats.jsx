import React from 'react';
import { useDashboard } from '../hooks/useDashboard';

const DashboardStats = () => {
    const { stats, loading } = useDashboard();
    

    if (loading) return <div className="text-center p-3">Loading Dashboard...</div>;

    return (
        <div className="row g-3 mb-4">
            <div className="col-md-4">
                <div className="card shadow-sm border-primary">
                    <div className="card-body">
                        <h6 className="text-muted">Total Entries</h6>
                        <h3 className="text-primary">{stats.totalEntries}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card shadow-sm border-success">
                    <div className="card-body">
                        <h6 className="text-muted">Entries Today</h6>
                        <h3 className="text-success">{stats.todayEntries}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card shadow-sm border-info">
                    <div className="card-body">
                        <h6 className="text-muted">Active Contributors</h6>
                        <h3 className="text-info">{stats.activeContributors}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;