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
                    <div className="stat-icon pending">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{pendingCount}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon progress">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{inProgressCount}</span>
                        <span className="stat-label">In Progress</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon resolved">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{resolvedCount}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon total">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                        </svg>
                    </div>
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
                    padding: 24px 0;
                }

                .dash-header {
                    margin-bottom: 20px;
                }

                .dash-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-main);
                    letter-spacing: -0.01em;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .stat-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s ease;
                }

                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-sm);
                }

                .stat-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-icon.pending { background: #fef3c7; color: #b45309; }
                .stat-icon.progress { background: #dbeafe; color: #1d4ed8; }
                .stat-icon.resolved { background: var(--mint-light); color: #047857; }
                .stat-icon.total { background: var(--bg-elevated); color: var(--text-secondary); }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1;
                }

                .stat-label {
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                    margin-top: 2px;
                }

                .filter-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                    padding: 4px;
                    background: var(--bg-elevated);
                    border-radius: var(--radius-sm);
                    width: fit-content;
                }

                .filter-tab {
                    background: transparent;
                    border: none;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--text-muted);
                    cursor: pointer;
                    border-radius: var(--radius-sm);
                    text-transform: capitalize;
                    transition: all 0.15s ease;
                    font-family: var(--font-main);
                }

                .filter-tab:hover {
                    color: var(--text-main);
                    background: var(--bg-card);
                }

                .filter-tab.active {
                    background: var(--navy);
                    color: white;
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
