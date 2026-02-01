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
                {complaint.isAnonymous && <span className="anon-icon">🎭</span>}
                {complaint.title}
            </h3>

            <p className="card-desc">{complaint.description.substring(0, 140)}...</p>

            <div className="card-tags">
                <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                    {complaint.priority}
                </span>

                {daysRemaining !== null && (
                    <span className={`sla-badge ${getSLAClass(daysRemaining)}`}>
                        {daysRemaining < 0 ? '⚠️ Overdue' : `⏱️ ${daysRemaining} days left`}
                    </span>
                )}
            </div>

            <div className="card-footer">
                <div className="card-meta">
                    <span className="meta-date">📅 {formatDate(complaint.createdAt)}</span>
                    {complaint.attachments?.length > 0 && (
                        <span className="meta-item">📎 {complaint.attachments.length}</span>
                    )}
                    {complaint.comments?.length > 0 && (
                        <span className="meta-item">💬 {complaint.comments.length}</span>
                    )}
                    {complaint.rating?.score && (
                        <span className="meta-item rating">⭐ {complaint.rating.score}</span>
                    )}
                </div>

                <Link to={`/complaint/${complaint._id}`} className="card-action">
                    View Details →
                </Link>
            </div>

            <style>{`
                .complaint-card {
                    background: var(--bg-card);
                    border: 2px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    padding: 32px;
                    margin-bottom: 20px;
                    transition: all 0.3s ease;
                }

                .complaint-card:hover {
                    box-shadow: var(--shadow-hover);
                    border-color: var(--border-hover);
                    transform: translateY(-4px);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .card-category {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent);
                    background: var(--accent-light);
                    padding: 6px 14px;
                    border-radius: 100px;
                }

                .card-title {
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--text-main);
                    margin: 0 0 12px 0;
                    line-height: 1.3;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .anon-icon {
                    font-size: 20px;
                }

                .card-desc {
                    color: var(--text-secondary);
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0 0 20px 0;
                }

                .card-tags {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding-bottom: 24px;
                    border-bottom: 2px solid var(--border-color);
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .card-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .meta-date,
                .meta-item {
                    font-size: 14px;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .meta-item.rating {
                    color: var(--sand);
                    font-weight: 700;
                }

                .card-action {
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--accent);
                    text-decoration: none;
                    padding: 12px 24px;
                    background: var(--accent-light);
                    border-radius: var(--radius-md);
                    transition: all 0.2s ease;
                }

                .card-action:hover {
                    background: var(--accent);
                    color: white;
                    transform: translateX(4px);
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
