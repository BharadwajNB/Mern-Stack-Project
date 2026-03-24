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
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Resolved': return 'bg-emerald-100 text-emerald-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleDownload = () => {
        if (!complaint?.fileUrl) return;
        const filename = complaint.fileUrl.split('/').pop();
        window.open(`http://localhost:5000/api/complaints/download/${filename}`, '_blank');
    };

    if (loading) return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content flex items-center justify-center">
                <div className="text-[var(--text-muted)] animate-pulse">Loading grievance details...</div>
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
                                </div>
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">{complaint.title}</h2>
                                
                                <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-y border-[var(--border-subtle)]">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Filed Date</p>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Filed By</p>
                                        <p className="text-xs font-semibold text-[var(--text-secondary)]">{complaint.createdBy?.name || 'Anonymous'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Description</h4>
                                    <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap">{complaint.description}</p>
                                </div>

                                {complaint.fileUrl && (
                                    <div className="mt-8 pt-8 border-t border-[var(--border-subtle)]">
                                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Attachment</h4>
                                        <button 
                                            onClick={handleDownload}
                                            className="flex items-center gap-3 p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--primary)] hover:bg-blue-50/20 transition-all group w-full md:w-auto"
                                        >
                                            <span className="material-symbols-outlined text-[var(--primary)]">download</span>
                                            <div className="text-left">
                                                <span className="block text-xs font-bold text-[var(--text-primary)]">Download Evidence</span>
                                                <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{complaint.fileUrl.split('/').pop()}</span>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            {user?.role === 'admin' && (
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
                                                {['Pending', 'In Progress', 'Resolved'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
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

                            <div className="bg-gray-50 border border-dashed border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] text-center">
                                <h4 className="text-xs font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Case Priority</h4>
                                <span className={`inline-block px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    complaint.priority === 'High' ? 'text-red-700 bg-red-100' : 
                                    complaint.priority === 'Medium' ? 'text-amber-700 bg-amber-100' : 'text-blue-700 bg-blue-100'
                                }`}>
                                    {complaint.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComplaintDetail;

