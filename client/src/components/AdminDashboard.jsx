import { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                const res = await api.get('/complaints/admin/all');
                setComplaints(res.data);
            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllComplaints();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const res = await api.put(`/complaints/admin/${id}`, { status: newStatus });
            setComplaints(prev => prev.map(c => c._id === id ? res.data : c));
        } catch (err) {
            console.error('Status update error:', err);
        }
    };

    const handleDownload = async (fileUrl) => {
        const filename = fileUrl.split('/').pop();
        window.open(`http://localhost:5000/api/complaints/download/${filename}`, '_blank');
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Resolved': return 'bg-emerald-100 text-emerald-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Administrator Console</h1>
                <p className="text-gray-500 mt-1">Manage global student grievances and track resolution status.</p>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Complaint ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Subject</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Files</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">Loading grievances...</td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">No complaints filed yet.</td>
                                </tr>
                            ) : (
                                complaints.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-medium text-gray-400">#{c._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{c.createdBy?.name}</div>
                                            <div className="text-xs text-gray-500">{c.createdBy?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{c.title}</div>
                                            <div className="text-xs text-gray-400">{c.category}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                c.priority === 'High' ? 'text-red-600 bg-red-50' : 
                                                c.priority === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50'
                                            }`}>
                                                {c.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyles(c.status)}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.fileUrl ? (
                                                <button 
                                                    onClick={() => handleDownload(c.fileUrl)}
                                                    className="flex items-center gap-1 text-[var(--primary)] hover:underline text-xs font-bold"
                                                >
                                                    <span className="material-symbols-outlined text-sm">attachment</span>
                                                    View
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {c.status !== 'Resolved' ? (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(c._id, 'Resolved')}
                                                        className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded uppercase hover:bg-emerald-700 transition-colors"
                                                    >
                                                        Resolve
                                                    </button>
                                                ) : (
                                                    <button 
                                                        disabled
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded uppercase cursor-not-allowed"
                                                    >
                                                        Closed
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
