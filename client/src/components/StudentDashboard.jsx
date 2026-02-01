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

    const filteredComplaints = complaints.filter(c => {
        if (filter === 'all') return true;
        return c.status.toLowerCase().replace(' ', '-') === filter;
    });

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div className="header-left">
                    <h2>My Complaints</h2>
                    <span className="count-badge">{complaints.length}</span>
                </div>
                <Link to="/complaint/new" className="btn btn-primary">
                    + New Complaint
                </Link>
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
                        <p>File a new complaint to get started</p>
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
                }

                .header-left {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .header-left h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: var(--color-text-primary);
                }

                .count-badge {
                    background: var(--color-primary);
                    color: white;
                    padding: 0.125rem 0.5rem;
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 600;
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

                @media (max-width: 640px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }

                    .header-left {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentDashboard;
