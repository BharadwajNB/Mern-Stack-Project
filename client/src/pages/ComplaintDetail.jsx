import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import RatingModal from '../components/RatingModal';

const ComplaintDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRating, setShowRating] = useState(false);
    const [statusUpdate, setStatusUpdate] = useState({ status: '', remark: '' });
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get(`/complaints/${id}`);
                setComplaint(res.data);
                setStatusUpdate({ status: res.data.status, remark: res.data.remark || '' });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id]);

    const handleRating = async ({ score, feedback }) => {
        try {
            await api.post(`/complaints/${id}/rate`, { score, feedback });
            const res = await api.get(`/complaints/${id}`);
            setComplaint(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put(`/complaints/${id}`, statusUpdate);
            setMessage({ type: 'success', text: 'Status updated successfully' });
            const res = await api.get(`/complaints/${id}`);
            setComplaint(res.data);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
        } finally {
            setUpdating(false);
        }
    };

    const handleDownload = () => {
        if (!complaint?.fileUrl) return;
        const filename = complaint.fileUrl.split('/').pop();
        window.open(`http://localhost:5000/api/complaints/download/${filename}`, '_blank');
    };

    const getStatusPill = (status) => {
        switch(status) {
            case 'Pending': return 'status-pill pill-pending font-medium';
            case 'In Progress': return 'status-pill pill-progress font-medium';
            case 'Resolved': return 'status-pill pill-resolved font-medium';
            default: return 'status-pill pill-pending font-medium';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="geist-font text-[var(--text-muted)] text-[14px]">Loading grievance details…</div>
        </div>
    );

    if (!complaint) return (
        <div className="flex flex-col items-center justify-center p-12">
            <h3 className="heading-font text-xl font-bold text-[var(--text-primary)]">Grievance Not Found</h3>
            <button onClick={() => navigate(-1)} className="mt-4 text-[var(--primary-orange)] font-semibold hover:underline bg-transparent border-none cursor-pointer geist-font">Back to Dashboard</button>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="min-h-screen">
                    {/* ── HEADER ── */}
                    <header className="mb-6 flex flex-col gap-2">
                        <Link to="/dashboard" className="text-[var(--primary-orange)] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity no-underline">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
                        </Link>
                        <div>
                            <h2 className="heading-font text-[40px] font-bold leading-none text-[var(--text-primary)]">
                                Complaint <span className="text-[var(--primary-orange)]">Details</span>
                            </h2>
                            <p className="geist-font text-[var(--text-secondary)] text-[14px] leading-tight mt-1 font-normal">
                                Track progress, view updates, and communicate with the admin team.
                            </p>
                        </div>
                    </header>

                    <div className="max-w-4xl mx-auto animate-fade-in">
                        {/* ── COMPLAINT SUMMARY CARD ── */}
                        <div className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] p-5 mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="geist-mono text-[12px] font-medium text-[var(--text-secondary)]">#{complaint._id.slice(-4).toUpperCase()}</span>
                                        <span className={getStatusPill(complaint.status)}>{complaint.status}</span>
                                    </div>
                                    <h3 className="heading-font text-[22px] font-bold text-[var(--text-primary)] leading-tight mb-3">{complaint.title}</h3>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 geist-font text-[12px]">
                                        <span className="text-[var(--text-secondary)]">Filed: <strong className="text-[var(--text-primary)]">{new Date(complaint.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</strong></span>
                                        <span className="text-[var(--text-secondary)]">Category: <strong className="text-[var(--text-primary)]">{complaint.category}</strong></span>
                                        <span className="text-[var(--text-secondary)]">Priority: <strong className="text-[var(--text-primary)]">{complaint.priority}</strong></span>
                                        <span className="text-[var(--text-secondary)]">By: <strong className="text-[var(--text-primary)]">{complaint.createdBy?.name || 'Anonymous'}</strong></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── DESCRIPTION CARD ── */}
                        <div className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] p-5 mb-4">
                            <h4 className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-3">Description</h4>
                            <p className="geist-font text-[14px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
                        </div>

                        {/* ── ATTACHMENT ── */}
                        {complaint.fileUrl && (
                            <div className="bg-white border-[0.5px] border(--card-border)] rounded-[12px] p-5 mb-4">
                                <h4 className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-3">Attachments</h4>
                                <button onClick={handleDownload}
                                    className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-color)]/50 rounded-[10px] hover:bg-[var(--card-border)]/40 transition-colors w-full text-left border border-[var(--card-border)] cursor-pointer group">
                                    <span className="material-symbols-outlined text-[18px] text-[var(--primary-orange)]">description</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="geist-font text-[12px] font-semibold text-[var(--text-primary)] truncate">{complaint.fileUrl.split('/').pop()}</p>
                                        <p className="geist-font text-[10px] text-[var(--text-muted)]">Click to download</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[16px] text-[var(--text-muted)] group-hover:text-[var(--primary-orange)] transition-colors">download</span>
                                </button>
                            </div>
                        )}

                        {/* ── ADMIN STATUS UPDATE ── */}
                        {user?.role === 'admin' && (
                            <div className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] p-5 mb-4">
                                <h4 className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-4">Manage Case</h4>
                                {message.text && (
                                    <div className={`mb-4 p-3 rounded-[10px] text-xs font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}
                                <form onSubmit={handleStatusUpdate} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="geist-font text-[13px] font-medium text-[#57534e]">Update Status</label>
                                        <select value={statusUpdate.status}
                                            onChange={(e) => setStatusUpdate(prev => ({...prev, status: e.target.value}))}
                                            className="w-full bg-[var(--bg-color)]/30 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[14px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] appearance-none cursor-pointer transition-all outline-none">
                                            {['Pending', 'In Progress', 'Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" disabled={updating}
                                        className="w-full bg-[var(--primary-orange)] text-white py-3 px-4 rounded-xl font-bold text-[13px] uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all border-none cursor-pointer">
                                        {updating ? 'Processing…' : 'Update Status'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ── RATING PROMPT ── */}
                        {complaint.status === 'Resolved' && !complaint.rating && user?.role === 'student' && (
                            <div className="bg-[#FDF4E7] border border-[#E6D5B8] rounded-[12px] p-5 text-center mb-4">
                                <span className="material-symbols-outlined text-[24px] text-[var(--primary-orange)] mb-2 block">star</span>
                                <h4 className="heading-font text-[14px] font-bold text-[var(--text-primary)] mb-1">Rate This Resolution</h4>
                                <p className="geist-font text-[12px] text-[var(--text-secondary)] mb-3">Your feedback helps improve the grievance system.</p>
                                <button onClick={() => setShowRating(true)}
                                    className="bg-[var(--primary-orange)] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:brightness-110 transition-all border-none cursor-pointer">
                                    Leave Rating
                                </button>
                            </div>
                        )}

                        {/* ── BACK BUTTON ── */}
                        <button onClick={() => navigate(-1)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] text-[13px] font-bold uppercase tracking-wider text-[#78716c] border border-[var(--card-border)] hover:bg-white transition-colors bg-transparent cursor-pointer mt-2 geist-font">
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Dashboard
                        </button>
                    </div>

                    {/* ── FOOTER ── */}
                    <footer className="mt-8 text-center">
                        <p className="geist-font text-[11px] text-[#a8a29e] uppercase tracking-[0.1em] font-medium">SERVIO System Security • Managed by University IT</p>
                    </footer>
            </div>
            {showRating && <RatingModal onSubmit={handleRating} onClose={() => setShowRating(false)} />}
        </div>
    );
};

export default ComplaintDetail;
