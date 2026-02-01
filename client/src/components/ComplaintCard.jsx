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
        <div className="complaint-card card animate-fade-in">
            <div className="card-header">
                <div className="card-title-row">
                    <h3 className="card-title">
                        {complaint.isAnonymous && <span className="anonymous-badge">🎭</span>}
                        {complaint.title}
                    </h3>
                    <span className={`badge ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                    </span>
                </div>
                <div className="card-meta">
                    <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                        {complaint.priority}
                    </span>
                    <span className="category-tag">{complaint.category}</span>
                    <span className="date-tag">📅 {formatDate(complaint.createdAt)}</span>
                </div>
            </div>

            <p className="card-description">{complaint.description.substring(0, 150)}...</p>

            <div className="card-footer">
                <div className="footer-left">
                    {complaint.dueDate && (
                        <span className={`sla-badge ${getSLAClass(daysRemaining)}`}>
                            ⏱️ {daysRemaining < 0 ? 'Overdue' : `${daysRemaining}d left`}
                        </span>
                    )}
                    {complaint.attachments?.length > 0 && (
                        <span className="attachment-count">📎 {complaint.attachments.length}</span>
                    )}
                    {complaint.comments?.length > 0 && (
                        <span className="comment-count">💬 {complaint.comments.length}</span>
                    )}
                </div>
                <Link to={`/complaint/${complaint._id}`} className="btn btn-primary btn-sm">
                    View Details →
                </Link>
            </div>

            {complaint.rating?.score && (
                <div className="rating-display">
                    {'★'.repeat(complaint.rating.score)}{'☆'.repeat(5 - complaint.rating.score)}
                </div>
            )}

            <style>{`
                .complaint-card {
                    margin-bottom: 1rem;
                }

                .card-header {
                    margin-bottom: 0.75rem;
                }

                .card-title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }

                .card-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .anonymous-badge {
                    font-size: 1rem;
                }

                .card-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    align-items: center;
                }

                .category-tag,
                .date-tag {
                    font-size: 0.75rem;
                    color: var(--color-text-secondary);
                }

                .card-description {
                    color: var(--color-text-secondary);
                    font-size: 0.875rem;
                    margin: 0 0 1rem 0;
                    line-height: 1.5;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--color-border);
                }

                .footer-left {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }

                .attachment-count,
                .comment-count {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                }

                .btn-sm {
                    padding: 0.375rem 0.75rem;
                    font-size: 0.75rem;
                }

                .rating-display {
                    margin-top: 0.75rem;
                    color: #fbbf24;
                    font-size: 1rem;
                    letter-spacing: 0.125rem;
                }

                @media (max-width: 640px) {
                    .card-title-row {
                        flex-direction: column;
                        gap: 0.5rem;
                    }

                    .card-footer {
                        flex-direction: column;
                        gap: 0.75rem;
                        align-items: stretch;
                    }

                    .footer-left {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default ComplaintCard;
