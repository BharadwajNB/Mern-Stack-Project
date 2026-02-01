import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import CommentThread from '../components/CommentThread';
import RatingModal from '../components/RatingModal';

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

const ComplaintDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRating, setShowRating] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', remark: '' });

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            const res = await api.get(`/complaints/${id}`);
            setComplaint(res.data);
            setStatusUpdate({ status: res.data.status, remark: '' });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (message) => {
        await api.post(`/complaints/${id}/comment`, { message });
        fetchComplaint();
    };

    const handleRating = async ({ score, feedback }) => {
        await api.post(`/complaints/${id}/rate`, { score, feedback });
        fetchComplaint();
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/complaints/${id}`, statusUpdate);
            fetchComplaint();
        } catch (err) {
            console.error(err);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getDaysRemaining = (dueDate) => {
        const diff = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    if (loading) {
        return (
            <div className="page">
                <Navbar />
                <main className="container">
                    <div className="loading">Loading...</div>
                </main>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="page">
                <Navbar />
                <main className="container">
                    <div className="error">Complaint not found</div>
                </main>
            </div>
        );
    }

    const canRate = user.role === 'student' &&
        complaint.status === 'Resolved' &&
        !complaint.rating?.score &&
        complaint.student?._id === user._id;

    const canUpdateStatus = user.role === 'faculty' || user.role === 'admin';

    return (
        <div className="page">
            <Navbar />
            <main className="container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="detail-layout">
                    <div className="main-content">
                        <div className="card">
                            <div className="detail-header">
                                <div className="title-row">
                                    {complaint.isAnonymous && <span className="anon-icon">🎭</span>}
                                    <h1>{complaint.title}</h1>
                                </div>
                                <div className="badge-row">
                                    <span className={`badge ${getStatusClass(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <span className={`badge ${getPriorityClass(complaint.priority)}`}>
                                        {complaint.priority}
                                    </span>
                                    <span className="category-badge">{complaint.category}</span>
                                </div>
                            </div>

                            <div className="detail-meta">
                                <div className="meta-item">
                                    <span className="meta-label">Submitted by</span>
                                    <span className="meta-value">{complaint.student?.name}</span>
                                </div>
                                <div className="meta-item">
                                    <span className="meta-label">Created</span>
                                    <span className="meta-value">{formatDate(complaint.createdAt)}</span>
                                </div>
                                {complaint.dueDate && (
                                    <div className="meta-item">
                                        <span className="meta-label">Due Date</span>
                                        <span className={`meta-value ${getDaysRemaining(complaint.dueDate) < 0 ? 'overdue' : ''}`}>
                                            {formatDate(complaint.dueDate)}
                                            {getDaysRemaining(complaint.dueDate) < 0
                                                ? ' (Overdue)'
                                                : ` (${getDaysRemaining(complaint.dueDate)} days left)`}
                                        </span>
                                    </div>
                                )}
                                {complaint.assignedTo && (
                                    <div className="meta-item">
                                        <span className="meta-label">Assigned to</span>
                                        <span className="meta-value">{complaint.assignedTo.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="description">
                                <h3>Description</h3>
                                <p>{complaint.description}</p>
                            </div>

                            {complaint.attachments?.length > 0 && (
                                <div className="attachments">
                                    <h3>📎 Attachments ({complaint.attachments.length})</h3>
                                    <div className="attachment-list">
                                        {complaint.attachments.map((file, i) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="attachment-item"
                                            >
                                                {file.filename}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {complaint.rating?.score && (
                                <div className="rating-display">
                                    <h3>⭐ Rating</h3>
                                    <div className="stars">
                                        {'★'.repeat(complaint.rating.score)}{'☆'.repeat(5 - complaint.rating.score)}
                                    </div>
                                    {complaint.rating.feedback && (
                                        <p className="rating-feedback">"{complaint.rating.feedback}"</p>
                                    )}
                                </div>
                            )}

                            {canRate && (
                                <button
                                    className="btn btn-primary rate-btn"
                                    onClick={() => setShowRating(true)}
                                >
                                    ⭐ Rate Resolution
                                </button>
                            )}
                        </div>

                        <CommentThread
                            comments={complaint.comments || []}
                            onAddComment={handleAddComment}
                            currentUserId={user._id}
                        />
                    </div>

                    <div className="sidebar">
                        {canUpdateStatus && (
                            <div className="card">
                                <h3>Update Status</h3>
                                <form onSubmit={handleStatusUpdate}>
                                    <div className="form-group">
                                        <select
                                            value={statusUpdate.status}
                                            onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                                            className="form-select"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            value={statusUpdate.remark}
                                            onChange={(e) => setStatusUpdate(prev => ({ ...prev, remark: e.target.value }))}
                                            placeholder="Add a remark..."
                                            className="form-textarea"
                                            rows={3}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-full">
                                        Update
                                    </button>
                                </form>
                            </div>
                        )}

                        <div className="card">
                            <h3>📋 History</h3>
                            <div className="history-list">
                                {complaint.history?.map((item, i) => (
                                    <div key={i} className="history-item">
                                        <div className="history-action">{item.action}</div>
                                        <div className="history-meta">
                                            {item.by?.name} · {formatDate(item.date)}
                                        </div>
                                        {item.remark && (
                                            <div className="history-remark">{item.remark}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <RatingModal
                    isOpen={showRating}
                    onClose={() => setShowRating(false)}
                    onSubmit={handleRating}
                />
            </main>

            <style>{`
                .back-btn {
                    background: none;
                    border: none;
                    color: var(--color-primary);
                    cursor: pointer;
                    font-size: 0.875rem;
                    padding: 0.5rem 0;
                    margin-bottom: 1rem;
                }

                .detail-layout {
                    display: grid;
                    grid-template-columns: 1fr 300px;
                    gap: 1.5rem;
                    padding-bottom: 2rem;
                }

                .detail-header {
                    margin-bottom: 1.5rem;
                }

                .title-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                }

                .title-row h1 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .anon-icon {
                    font-size: 1.5rem;
                }

                .badge-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .category-badge {
                    background: var(--color-bg-tertiary);
                    color: var(--color-text-secondary);
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius-full);
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .detail-meta {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    padding: 1rem;
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                }

                .meta-label {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                }

                .meta-value {
                    font-weight: 500;
                    color: var(--color-text-primary);
                }

                .meta-value.overdue {
                    color: var(--color-danger);
                }

                .description h3,
                .attachments h3 {
                    font-size: 1rem;
                    margin: 0 0 0.75rem 0;
                }

                .description p {
                    color: var(--color-text-secondary);
                    line-height: 1.6;
                    white-space: pre-wrap;
                }

                .attachments {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--color-border);
                }

                .attachment-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .attachment-item {
                    background: var(--color-bg-tertiary);
                    padding: 0.5rem 0.75rem;
                    border-radius: var(--radius-md);
                    font-size: 0.875rem;
                    color: var(--color-primary);
                    text-decoration: none;
                }

                .attachment-item:hover {
                    background: var(--color-primary-light);
                }

                .rating-display {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid var(--color-border);
                }

                .rating-display .stars {
                    color: #fbbf24;
                    font-size: 1.5rem;
                    letter-spacing: 0.125rem;
                }

                .rating-feedback {
                    margin-top: 0.5rem;
                    font-style: italic;
                    color: var(--color-text-secondary);
                }

                .rate-btn {
                    margin-top: 1rem;
                }

                .sidebar .card {
                    margin-bottom: 1rem;
                }

                .sidebar h3 {
                    font-size: 1rem;
                    margin: 0 0 1rem 0;
                }

                .history-list {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .history-item {
                    padding: 0.75rem 0;
                    border-bottom: 1px solid var(--color-border);
                }

                .history-item:last-child {
                    border-bottom: none;
                }

                .history-action {
                    font-weight: 500;
                    font-size: 0.875rem;
                }

                .history-meta {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                    margin-top: 0.25rem;
                }

                .history-remark {
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                    margin-top: 0.25rem;
                }

                .w-full {
                    width: 100%;
                }

                .loading, .error {
                    text-align: center;
                    padding: 3rem;
                    color: var(--color-text-muted);
                }

                @media (max-width: 900px) {
                    .detail-layout {
                        grid-template-columns: 1fr;
                    }

                    .detail-meta {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ComplaintDetail;
