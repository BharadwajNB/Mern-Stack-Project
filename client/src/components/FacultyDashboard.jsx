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

    const filterOptions = ['all', 'pending', 'in-progress', 'resolved', 'rejected'];

    const filteredComplaints = complaints.filter(c => {
        if (filter === 'all') return true;
        return c.status.toLowerCase().replace(' ', '-') === filter;
    });

    const pendingCount = complaints.filter(c => c.status === 'Pending').length;
    const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

    return (
        <div className="dashboard-content">
            <header className="dash-header">
                <h1>Department Complaints</h1>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon pending">⏳</div>
                    <div className="stat-info">
                        <span className="stat-value">{pendingCount}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon progress">🔄</div>
                    <div className="stat-info">
                        <span className="stat-value">{inProgressCount}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon resolved">✅</div>
                    <div className="stat-info">
                        <span className="stat-value">{resolvedCount}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">📊</div>
                    <div className="stat-info">
                        <span className="stat-value">{complaints.length}</span>
                        <span className="stat-label">Total</span>
                    </div>
                </div>
            </div>

            <div className="filter-tabs">
                {filterOptions.map(status => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status === 'all' ? 'All' : status.replace('-', ' ')}
                    </button>
                ))}
            </div>

            <div className="complaints-grid">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                        <p>Loading complaints...</p>
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">✨</div>
                        <h2>All caught up!</h2>
                        <p>No complaints in this category</p>
                    </div>
                ) : (
                    filteredComplaints.map(complaint => (
                        <ComplaintCard key={complaint._id} complaint={complaint} />
                    ))
                )}
            </div>

            <style>{`
                .dashboard-content {
                    padding: 48px 0;
                }

                .dash-header {
                    margin-bottom: 40px;
                }

                .dash-header h1 {
                    margin: 0;
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                    margin-bottom: 40px;
                }

                .stat-card {
                    background: var(--bg-card);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    padding: 28px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    transition: all 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-card);
                }

                .stat-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: var(--radius-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }

                .stat-icon.pending { background: #fef3c7; }
                .stat-icon.progress { background: #dbeafe; }
                .stat-icon.resolved { background: var(--mint-light); }
                .stat-icon.total { background: var(--bg-elevated); }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--text-main);
                    line-height: 1;
                }

                .stat-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    margin-top: 4px;
                }

                .filter-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 36px;
                    padding: 8px;
                    background: var(--bg-elevated);
                    border-radius: var(--radius-lg);
                    width: fit-content;
                }

                .filter-tab {
                    background: transparent;
                    border: none;
                    padding: 14px 24px;
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--text-muted);
                    cursor: pointer;
                    border-radius: var(--radius-md);
                    text-transform: capitalize;
                    transition: all 0.2s ease;
                    font-family: var(--font-main);
                }

                .filter-tab:hover {
                    color: var(--text-main);
                    background: var(--bg-card);
                }

                .filter-tab.active {
                    background: var(--navy);
                    color: white;
                    box-shadow: var(--shadow-sm);
                }

                .empty-state {
                    text-align: center;
                    padding: 80px 40px;
                    background: var(--bg-card);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-xl);
                }

                .loading-spinner {
                    width: 48px;
                    height: 48px;
                    border: 4px solid var(--border-color);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 24px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .empty-icon {
                    font-size: 72px;
                    margin-bottom: 24px;
                }

                .empty-state h2 {
                    margin: 0 0 12px 0;
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .empty-state p {
                    margin: 0;
                    font-size: 18px;
                    color: var(--text-secondary);
                }

                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 640px) {
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }

                    .stat-card {
                        flex-direction: column;
                        text-align: center;
                        padding: 24px 16px;
                    }

                    .stat-icon {
                        width: 56px;
                        height: 56px;
                        font-size: 24px;
                    }

                    .stat-value {
                        font-size: 28px;
                    }
                }
            `}</style>
        </div>
    );
};

export default FacultyDashboard;
