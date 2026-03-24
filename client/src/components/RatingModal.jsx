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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-[var(--radius-lg)] shadow-2xl max-w-md w-full border border-[var(--border-subtle)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-[var(--text-primary)]">Rate Resolution</h3>
                        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center">
                            <p className="text-sm text-[var(--text-secondary)] mb-6">How satisfied are you with the resolution provided?</p>
                            <div className="flex justify-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s} type="button"
                                        className={`material-symbols-outlined text-4xl transition-all ${
                                            s <= (hoverRating || rating) ? 'text-amber-400 scale-110' : 'text-zinc-200'
                                        }`}
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHoverRating(s)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        star
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] min-h-[1rem]">
                                {rating > 0 && ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating-1]}
                            </p>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Detailed Feedback (Optional)</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us more about your experience..."
                                className="w-full px-4 py-3 bg-gray-50 border border-[var(--border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--primary)] min-h-[100px] transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={rating === 0 || isSubmitting}
                                className="w-full bg-[var(--text-primary)] text-white py-3 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                            </button>
                            <button
                                type="button" onClick={onClose}
                                className="w-full text-[var(--text-muted)] py-2 text-xs font-semibold hover:text-[var(--text-primary)] transition-colors"
                            >
                                Skip for now
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;

