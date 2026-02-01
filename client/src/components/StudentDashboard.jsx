import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ComplaintCard from './ComplaintCard';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
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
        fetchComplaints();
    }, []);

    const filterOptions = ['all', 'pending', 'in-progress', 'resolved', 'rejected'];

    const filteredComplaints = complaints.filter(c => {
        if (filter === 'all') return true;
        return c.status.toLowerCase().replace(' ', '-') === filter;
    });

    return (
        <div className="dashboard-content">
            <header className="dash-header">
                <div className="header-main">
                    <h1>My Complaints</h1>
                    <span className="complaint-count">{complaints.length}</span>
                </div>
                <Link to="/complaint/new" className="btn btn-primary">
                    <span className="plus-icon">+</span>
                    File Complaint
                </Link>
            </header>

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
                        <p>Loading your complaints...</p>
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h2>No complaints found</h2>
                        <p>Start by filing a new complaint</p>
                        <Link to="/complaint/new" className="btn btn-primary">
                            File Your First Complaint
                        </Link>
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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 40px;
                }

                .header-main {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .header-main h1 {
                    margin: 0;
                    font-size: 36px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                }

                .complaint-count {
                    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
                    color: white;
                    font-size: 16px;
                    font-weight: 800;
                    padding: 6px 18px;
                    border-radius: 100px;
                    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
                }

                .plus-icon {
                    font-size: 22px;
                    font-weight: 400;
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
                    margin: 0 0 32px;
                    font-size: 18px;
                    color: var(--text-secondary);
                }

                @media (max-width: 768px) {
                    .dashboard-content {
                        padding: 32px 0;
                    }

                    .dash-header {
                        flex-direction: column;
                        gap: 24px;
                        align-items: stretch;
                    }

                    .header-main {
                        justify-content: center;
                    }

                    .header-main h1 {
                        font-size: 28px;
                    }

                    .filter-tabs {
                        width: 100%;
                        overflow-x: auto;
                    }

                    .filter-tab {
                        padding: 12px 20px;
                        white-space: nowrap;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
