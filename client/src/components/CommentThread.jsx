import { useState } from 'react';

const CommentThread = ({ comments = [], onAddComment, currentUserId }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await onAddComment(newComment);
            setNewComment('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="comment-thread">
            <h4 className="thread-title">💬 Comments ({comments.length})</h4>

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className={`comment ${comment.user?._id === currentUserId ? 'own-comment' : ''}`}
                        >
                            <div className="comment-header">
                                <div className="avatar avatar-sm">
                                    {comment.user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="comment-meta">
                                    <span className="comment-author">{comment.user?.name || 'Unknown'}</span>
                                    <span className="comment-role">{comment.user?.role}</span>
                                </div>
                                <span className="comment-time">{formatTime(comment.createdAt)}</span>
                            </div>
                            <p className="comment-body">{comment.message}</p>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className="comment-form">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="form-textarea comment-input"
                    rows={3}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !newComment.trim()}
                >
                    {isSubmitting ? 'Sending...' : 'Add Comment'}
                </button>
            </form>

            <style>{`
                .comment-thread {
                    background: var(--color-bg-secondary);
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    margin-top: 1.5rem;
                }

                .thread-title {
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    color: var(--color-text-primary);
                }

                .comments-list {
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                }

                .no-comments {
                    text-align: center;
                    color: var(--color-text-muted);
                    padding: 2rem;
                    font-size: 0.875rem;
                }

                .comment {
                    background: var(--color-bg-primary);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    padding: 0.875rem;
                    margin-bottom: 0.75rem;
                }

                .comment.own-comment {
                    border-left: 3px solid var(--color-primary);
                }

                .comment-header {
                    display: flex;
                    align-items: center;
                    gap: 0.625rem;
                    margin-bottom: 0.5rem;
                }

                .comment-meta {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .comment-author {
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: var(--color-text-primary);
                }

                .comment-role {
                    font-size: 0.625rem;
                    text-transform: uppercase;
                    color: var(--color-primary);
                }

                .comment-time {
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                }

                .comment-body {
                    margin: 0;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                    line-height: 1.5;
                }

                .comment-form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .comment-input {
                    min-height: 80px;
                }

                .comment-form .btn {
                    align-self: flex-end;
                }
            `}</style>
        </div>
    );
};

export default CommentThread;
