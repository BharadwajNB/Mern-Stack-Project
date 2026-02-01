import { useEffect, useState } from 'react';
import api from '../api/axios';
import ComplaintCard from './ComplaintCard';

const FacultyDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredComplaints = complaints.filter(c => {
        if (filter === 'all') return true;
        return c.status.toLowerCase().replace(' ', '-') === filter;
    });

    const pendingCount = complaints.filter(c => c.status === 'Pending').length;
    const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div className="header-left">
                    <h2>Department Complaints</h2>
                </div>
                <div className="quick-stats">
                    <div className="stat pending">
                        <span className="stat-value">{pendingCount}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat progress">
                        <span className="stat-value">{inProgressCount}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
            </div>

            <div className="filter-bar">
                {['all', 'pending', 'in-progress', 'resolved', 'rejected'].map(status => (
                    <button
                        key={status}
                        className={`filter-btn ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status === 'all' ? 'All' : status.replace('-', ' ')}
                    </button>
                ))}
            </div>

            <div className="complaints-list">
                {loading ? (
                    <div className="empty-state">Loading complaints...</div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No complaints found</h3>
                        <p>All caught up!</p>
                    </div>
                ) : (
                    filteredComplaints.map(complaint => (
                        <ComplaintCard key={complaint._id} complaint={complaint} />
                    ))
                )}
            </div>

            <style>{`
                .dashboard-content {
                    padding: 1.5rem 0;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .header-left h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: var(--color-text-primary);
                }

                .quick-stats {
                    display: flex;
                    gap: 1rem;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.75rem 1.25rem;
                    background: var(--color-bg-primary);
                    border-radius: var(--radius-md);
                    border: 1px solid var(--color-border);
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                }

                .stat.pending .stat-value {
                    color: #f59e0b;
                }

                .stat.progress .stat-value {
                    color: #3b82f6;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                }

                .filter-bar {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                }

                .filter-btn {
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-full);
                    font-size: 0.875rem;
                    cursor: pointer;
                    white-space: nowrap;
                    text-transform: capitalize;
                    color: var(--color-text-secondary);
                    transition: all var(--transition-fast);
                }

                .filter-btn:hover {
                    border-color: var(--color-primary);
                    color: var(--color-primary);
                }

                .filter-btn.active {
                    background: var(--color-primary);
                    border-color: var(--color-primary);
                    color: white;
                }

                .empty-state {
                    text-align: center;
                    padding: 3rem;
                    background: var(--color-bg-primary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--color-border);
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .empty-state h3 {
                    margin: 0 0 0.5rem 0;
                    color: var(--color-text-primary);
                }

                .empty-state p {
                    margin: 0;
                    color: var(--color-text-muted);
                }
            `}</style>
        </div>
    );
};

export default FacultyDashboard;
