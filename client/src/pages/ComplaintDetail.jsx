import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
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

    const getStatusStyles = (status) => {
        switch(status) {
            case 'Pending': return 'bg-[#fef3c7] text-[#92400e]';
            case 'Resolved': return 'bg-[#d1fae5] text-[#065f46]';
            case 'In Progress': return 'bg-[#dbeafe] text-[#1d4ed8]';
            case 'Rejected': return 'bg-[#fee2e2] text-[#991b1b]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content flex items-center justify-center">
                <div className="text-[var(--text-muted)] animate-pulse">Loading complaint details...</div>
            </main>
        </div>
    );

    if (!complaint) return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Grievance Not Found</h3>
                <button onClick={() => navigate(-1)} className="mt-4 text-[var(--primary)] font-semibold hover:underline">Back to Dashboard</button>
            </main>
        </div>
    );

    const canRate = user?.role === 'student' && complaint.status === 'Resolved' && !complaint.rating?.score;

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content bg-[var(--bg-app)]">
                <div className="max-w-[1000px] mx-auto animate-fade-in">
                    {/* Header Nav */}
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to List
                        </button>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                            Ref: #{complaint._id.slice(-8).toUpperCase()}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Primary Card */}
                            <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyles(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600">
                                        {complaint.category}
                                    </span>
                                    {complaint.priority === 'Urgent' && (
                                        <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Urgent</span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{complaint.title}</h2>
                                
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 py-6 border-y border-[var(--border-subtle)]">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Filed Date</p>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Filed By</p>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{complaint.isAnonymous ? 'Student (Anonymous)' : complaint.student?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Assigned To</p>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{complaint.assignedTo?.name || 'Unassigned'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</h4>
                                    <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">{complaint.description}</p>
                                </div>

                                {complaint.attachments?.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Supporting Evidence</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {complaint.attachments.map((file, i) => (
                                                <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--primary)] hover:bg-blue-50/20 transition-all group">
                                                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[var(--primary)]">description</span>
                                                    <span className="text-xs font-medium text-[var(--text-secondary)] truncate">{file.filename}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm">
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-8">Resolution Timeline</h4>
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-100">
                                    {complaint.history?.map((item, i) => (
                                        <div key={i} className="relative pl-10">
                                            <div className="absolute left-0 top-1 w-[24px] h-[24px] bg-white border border-[var(--border-subtle)] rounded-full flex items-center justify-center z-10">
                                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></div>
                                            </div>
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-xs font-bold text-[var(--text-primary)]">{item.action}</p>
                                                <time className="text-[10px] font-medium text-[var(--text-muted)]">{new Date(item.date).toLocaleDateString()}</time>
                                            </div>
                                            <p className="text-[10px] text-[var(--text-muted)] font-medium mb-1">By {item.by?.name}</p>
                                            {item.remark && <p className="text-xs text-[var(--text-secondary)] bg-gray-50 p-3 rounded-lg border border-[var(--border-subtle)] mt-2 italic">“{item.remark}”</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            {(user?.role === 'faculty' || user?.role === 'admin') && (
                                <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6">Manage Case</h4>
                                    
                                    {message.text && (
                                        <div className={`mb-4 p-3 rounded-lg text-xs font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                            {message.text}
                                        </div>
                                    )}

                                    <form onSubmit={handleStatusUpdate} className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Update Status</label>
                                            <select 
                                                value={statusUpdate.status} 
                                                onChange={(e) => setStatusUpdate(prev => ({...prev, status: e.target.value}))}
                                                className="w-full px-4 py-2 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--primary)]"
                                            >
                                                {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-2">Remark / Resolution Note</label>
                                            <textarea 
                                                value={statusUpdate.remark} 
                                                onChange={(e) => setStatusUpdate(prev => ({...prev, remark: e.target.value}))}
                                                className="w-full px-4 py-2 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-lg text-sm outline-none focus:border-[var(--primary)] min-h-[100px]"
                                                placeholder="Enter any actions taken..."
                                            />
                                        </div>
                                        <button 
                                            type="submit" disabled={updating}
                                            className="w-full bg-[var(--text-primary)] text-white py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all"
                                        >
                                            {updating ? 'Processing...' : 'Update Status'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {canRate && (
                                <div className="bg-[var(--primary)] text-white p-6 rounded-[var(--radius-lg)] shadow-lg shadow-blue-500/20 text-center">
                                    <h4 className="text-sm font-bold mb-2">Issue Resolved?</h4>
                                    <p className="text-[11px] opacity-80 mb-6">Your feedback helps us improve our service standards.</p>
                                    <button 
                                        onClick={() => setShowRating(true)}
                                        className="w-full bg-white text-[var(--primary)] py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-sm"
                                    >
                                        Rate Resolution
                                    </button>
                                </div>
                            )}

                            {complaint.rating?.score && (
                                <div className="bg-zinc-900 text-white p-6 rounded-[var(--radius-lg)]">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-60 mb-4">Student Rating</h4>
                                    <div className="flex gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className={`material-symbols-outlined text-[16px] ${s <= complaint.rating.score ? 'text-amber-400' : 'text-zinc-700'}`}>star</span>
                                        ))}
                                    </div>
                                    {complaint.rating.feedback && <p className="text-xs text-zinc-400 italic font-medium leading-relaxed">“{complaint.rating.feedback}”</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <RatingModal 
                isOpen={showRating} 
                onClose={() => setShowRating(false)} 
                onSubmit={handleRating} 
            />
        </div>
    );
};

export default ComplaintDetail;

