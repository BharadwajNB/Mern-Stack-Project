import { Link } from 'react-router-dom';

const getStatusClass = (status) => {
    const map = {
        'Pending': 'badge-pending',
        'In Progress': 'badge-in-progress',
        'Resolved': 'badge-resolved',
        'Rejected': 'badge-rejected'
    };
    return map[status] || 'badge-pending';
};

const getPriorityClass = (priority) => {
    const map = {
        'Low': 'priority-low',
        'Medium': 'priority-medium',
        'High': 'priority-high',
        'Urgent': 'priority-urgent'
    };
    return map[priority] || 'priority-medium';
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
};

const getSLAClass = (daysRemaining) => {
    if (daysRemaining < 0) return 'sla-overdue';
    if (daysRemaining <= 1) return 'sla-danger';
    if (daysRemaining <= 3) return 'sla-warning';
    return 'sla-safe';
};

const ComplaintCard = ({ complaint }) => {
    const daysRemaining = getDaysRemaining(complaint.dueDate);

    return (
        <article className="complaint-card animate-fade-in">
            <div className="card-header">
                <span className="card-category">{complaint.category}</span>
                <span className={`badge ${getStatusClass(complaint.status)}`}>
                    {complaint.status}
                </span>
            </div>

            <h3 className="card-title">
                {complaint.title}
            </h3>

            <p className="card-desc">{complaint.description.substring(0, 140)}...</p>

            <div className="card-tags">
                <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                    {complaint.priority}
                </span>

                {daysRemaining !== null && (
                    <span className={`sla-badge ${getSLAClass(daysRemaining)}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                        </svg>
                        {daysRemaining < 0 ? 'Overdue' : `${daysRemaining} days left`}
                    </span>
                )}
            </div>

            <div className="card-footer">
                <div className="card-meta">
                    <span className="meta-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                        {formatDate(complaint.createdAt)}
                    </span>
                    {complaint.attachments?.length > 0 && (
                        <span className="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                            </svg>
                            {complaint.attachments.length}
                        </span>
                    )}
                    {complaint.comments?.length > 0 && (
                        <span className="meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            {complaint.comments.length}
                        </span>
                    )}
                    {complaint.rating?.score && (
                        <span className="meta-item rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {complaint.rating.score}
                        </span>
                    )}
                </div>

                <Link to={`/complaint/${complaint._id}`} className="card-action">
                    View Details →
                </Link>
            </div>

            <style>{`
                .complaint-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    margin-bottom: 12px;
                    transition: all 0.2s ease;
                }

                .complaint-card:hover {
                    box-shadow: var(--shadow-sm);
                    border-color: var(--border-hover);
                    transform: translateY(-2px);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .card-category {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent);
                    background: var(--accent-light);
                    padding: 4px 10px;
                    border-radius: 100px;
                }

                .card-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-main);
                    margin: 0 0 8px 0;
                    line-height: 1.3;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .anon-icon {
                    font-size: 14px;
                }

                .card-desc {
                    color: var(--text-secondary);
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 14px 0;
                }

                .card-tags {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid var(--border-color);
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 14px;
                }

                .meta-date,
                .meta-item {
                    font-size: 12px;
                    color: var(--text-muted);
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .meta-item.rating {
                    color: var(--sand);
                    font-weight: 600;
                }

                .sla-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    padding: 4px 10px;
                    border-radius: 100px;
                }

                .sla-badge.safe { background: var(--mint-light); color: #047857; }
                .sla-badge.warning { background: #fef3c7; color: #b45309; }
                .sla-badge.danger { background: #fef2f2; color: #dc2626; }

                .card-action {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--accent);
                    text-decoration: none;
                    padding: 8px 16px;
                    background: var(--accent-light);
                    border-radius: var(--radius-sm);
                    transition: all 0.15s ease;
                }

                .card-action:hover {
                    background: var(--accent);
                    color: white;
                }

                @media (max-width: 640px) {
                    .complaint-card {
                        padding: 24px;
                    }

                    .card-title {
                        font-size: 18px;
                    }

                    .card-footer {
                        flex-direction: column;
                        gap: 16px;
                        align-items: stretch;
                    }

                    .card-action {
                        text-align: center;
                    }
                }
            `}</style>
        </article>
    );
};

export default ComplaintCard;
