import { useState } from 'react';

const RatingModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ score: rating, feedback });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Rate Resolution</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="rating-section">
                        <p className="rating-prompt">How satisfied are you with the resolution?</p>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className="rating-label">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Feedback (optional)</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your experience..."
                            className="form-textarea"
                            rows={3}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={rating === 0 || isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </form>

                <style>{`
                    .modal-overlay {
                        position: fixed;
                        inset: 0;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        animation: fadeIn 0.2s ease;
                    }

                    .modal-content {
                        background: var(--color-bg-primary);
                        border-radius: var(--radius-xl);
                        padding: 1.5rem;
                        max-width: 400px;
                        width: 90%;
                        box-shadow: var(--shadow-xl);
                        animation: slideIn 0.2s ease;
                    }

                    .modal-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1.5rem;
                    }

                    .modal-header h3 {
                        margin: 0;
                        font-size: 1.25rem;
                        color: var(--color-text-primary);
                    }

                    .modal-close {
                        background: none;
                        border: none;
                        font-size: 1.25rem;
                        cursor: pointer;
                        color: var(--color-text-muted);
                        padding: 0.25rem;
                    }

                    .modal-close:hover {
                        color: var(--color-text-primary);
                    }

                    .rating-section {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }

                    .rating-prompt {
                        color: var(--color-text-secondary);
                        margin: 0 0 1rem 0;
                    }

                    .stars {
                        display: flex;
                        justify-content: center;
                        gap: 0.5rem;
                    }

                    .star-btn {
                        background: none;
                        border: none;
                        font-size: 2.5rem;
                        cursor: pointer;
                        color: var(--color-border);
                        transition: all var(--transition-fast);
                        padding: 0;
                    }

                    .star-btn:hover,
                    .star-btn.filled {
                        color: #fbbf24;
                        transform: scale(1.1);
                    }

                    .rating-label {
                        margin-top: 0.5rem;
                        font-weight: 600;
                        color: var(--color-primary);
                        min-height: 1.5rem;
                    }

                    .modal-actions {
                        display: flex;
                        gap: 0.75rem;
                        justify-content: flex-end;
                        margin-top: 1.5rem;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default RatingModal;
