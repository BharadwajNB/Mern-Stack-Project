import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchAllComplaints = async () => {
            try {
                const res = await api.get('/complaints');
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
            const res = await api.put(`/complaints/${id}`, { status: newStatus });
            setComplaints(prev => prev.map(c => c._id === id ? res.data : c));
            if (selectedComplaint?._id === id) {
                setSelectedComplaint(res.data);
            }
        } catch (err) {
            console.error('Status update error:', err);
        }
    };

    const handleDownload = (fileUrl) => {
        if (!fileUrl) return;
        const filename = fileUrl.split('/').pop();
        window.open(`http://localhost:5000/api/complaints/download/${filename}`, '_blank');
    };

    const handleViewFile = (fileUrl) => {
        if (!fileUrl) return;
        // Open file directly — images will show in browser, PDFs will open in viewer
        window.open(`http://localhost:5000${fileUrl}`, '_blank');
    };

    const getStatusPill = (status) => {
        switch(status) {
            case 'Pending':     return 'bg-[#FDF4E7] text-[#925C0E]';
            case 'In Progress': return 'bg-[#E8F0FA] text-[#1E5FA6]';
            case 'Resolved':    return 'bg-[#EAF4EC] text-[#2E7D4F]';
            default:            return 'bg-[#FDF4E7] text-[#925C0E]';
        }
    };

    const pad = (n) => n.toString().padStart(2, '0');

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    let filtered = [...complaints];
    if (search) filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.createdBy?.name?.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);

    const getFileIcon = (fileName) => {
        if (!fileName) return { icon: 'attach_file', color: 'text-[var(--text-muted)]' };
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return { icon: 'description', color: 'text-red-500' };
        if (['jpg','jpeg','png','gif'].includes(ext)) return { icon: 'image', color: 'text-blue-500' };
        if (['xlsx','xls','csv'].includes(ext)) return { icon: 'table_chart', color: 'text-green-600' };
        return { icon: 'attach_file', color: 'text-[var(--text-muted)]' };
    };

    return (
        <div className="animate-fade-in flex flex-col gap-4">
            {/* ── HEADER ── */}
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="heading-font text-[22px] font-bold text-[var(--text-primary)] leading-tight">
                        Administrator Console
                    </h1>
                    <p className="geist-font text-[13px] text-[var(--text-secondary)] mt-0.5">
                        Manage all student grievances, update statuses, and view attached documents.
                    </p>
                </div>
            </header>

            {/* ── STAT CARDS ── */}
            <section className="grid grid-cols-4 gap-[12px] mt-[8px]">
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Total Cases</span>
                    <div className="heading-font text-[22px] font-bold text-[var(--text-primary)] mt-0.5">{pad(stats.total)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">All grievances filed</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Pending</span>
                    <div className="heading-font text-[22px] font-bold text-[#925C0E] mt-0.5">{pad(stats.pending)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Awaiting review</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">In Progress</span>
                    <div className="heading-font text-[22px] font-bold text-[#1E5FA6] mt-0.5">{pad(stats.inProgress)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Being addressed</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Resolved</span>
                    <div className="heading-font text-[22px] font-bold text-[#2E7D4F] mt-0.5">{pad(stats.resolved)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Successfully closed</p>
                </div>
            </section>

            {/* ── SEARCH + FILTERS ── */}
            <div className="flex justify-between items-center mt-[4px]">
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-[280px] h-[36px] border-[0.5px] border-[var(--card-border)] rounded-[8px] px-[12px] bg-white text-[13px] focus:ring-0 focus:border-[var(--primary-orange)] placeholder:text-[var(--text-muted)] geist-font outline-none"
                    placeholder="Search by title or student name..." type="text"/>
                <div className="flex gap-[8px]">
                    {['', 'Pending', 'In Progress', 'Resolved'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                            className={`h-[32px] px-3 rounded-full text-[11px] font-medium border cursor-pointer transition-all ${
                                statusFilter === s
                                ? 'bg-[var(--text-primary)] text-[var(--bg-color)] border-[var(--text-primary)]'
                                : 'bg-white text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[var(--primary-orange)]'
                            }`}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── MAIN CONTENT: TABLE + DETAIL PANEL ── */}
            <div className={`grid gap-[12px] ${selectedComplaint ? 'grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>
                {/* TABLE */}
                <div className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#fcfcfc] border-b border-[var(--card-border)]">
                            <tr className="h-[44px]">
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">ID</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Student</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Subject</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Priority</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Status</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Files</th>
                                <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="px-[16px] py-12 text-center geist-font text-[13px] text-[var(--text-muted)]">Loading grievances…</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="7" className="px-[16px] py-12 text-center geist-font text-[13px] text-[var(--text-muted)]">No complaints found.</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c._id} 
                                        onClick={() => setSelectedComplaint(c)}
                                        className={`h-[52px] border-b border-[var(--bg-color)] cursor-pointer transition-colors ${
                                            selectedComplaint?._id === c._id ? 'bg-[#faf8f5]' : 'hover:bg-[#fcfcfc]'
                                        }`}>
                                        <td className="px-[16px] geist-mono text-[12px] text-[var(--text-muted)] font-medium">#{c._id.slice(-5).toUpperCase()}</td>
                                        <td className="px-[16px]">
                                            <div className="geist-font text-[13px] font-medium text-[var(--text-primary)]">{c.createdBy?.name || 'Unknown'}</div>
                                            <div className="geist-font text-[11px] text-[var(--text-muted)]">{c.createdBy?.email}</div>
                                        </td>
                                        <td className="px-[16px]">
                                            <div className="geist-font text-[13px] font-medium text-[var(--text-primary)]">{c.title}</div>
                                            <div className="geist-font text-[11px] text-[var(--text-muted)]">{c.category}</div>
                                        </td>
                                        <td className="px-[16px]">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold geist-font ${
                                                c.priority === 'High' ? 'text-red-600 bg-red-50' : 
                                                c.priority === 'Medium' ? 'text-[#925C0E] bg-[#FDF4E7]' : 'text-blue-600 bg-blue-50'
                                            }`}>{c.priority}</span>
                                        </td>
                                        <td className="px-[16px]">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold geist-font ${getStatusPill(c.status)}`}>{c.status}</span>
                                        </td>
                                        <td className="px-[16px]">
                                            {c.fileUrl ? (
                                                <span className="material-symbols-outlined text-[18px] text-[var(--primary-orange)]">attach_file</span>
                                            ) : (
                                                <span className="geist-font text-[var(--text-muted)] text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-[16px] text-right">
                                            <div className="flex justify-end gap-2">
                                                {c.status !== 'Resolved' ? (
                                                    <>
                                                        {c.status === 'Pending' && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(c._id, 'In Progress'); }}
                                                                className="px-3 py-1.5 bg-[#1E5FA6] text-white text-[10px] font-bold rounded uppercase hover:brightness-110 transition-all border-none cursor-pointer geist-font">
                                                                Review
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(c._id, 'Resolved'); }}
                                                            className="px-3 py-1.5 bg-[#2E7D4F] text-white text-[10px] font-bold rounded uppercase hover:brightness-110 transition-all border-none cursor-pointer geist-font">
                                                            Resolve
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="px-3 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded uppercase geist-font">Closed</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── DETAIL PANEL ── */}
                {selectedComplaint && (
                    <div className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] overflow-hidden shadow-sm h-fit sticky top-6">
                        {/* Panel Header */}
                        <div className="p-4 border-b border-[var(--card-border)] bg-[#fcfcfc] flex justify-between items-center">
                            <div>
                                <span className="geist-mono text-[11px] text-[var(--text-muted)]">#{selectedComplaint._id.slice(-5).toUpperCase()}</span>
                                <h3 className="heading-font text-[16px] font-bold text-[var(--text-primary)] leading-tight mt-0.5">{selectedComplaint.title}</h3>
                            </div>
                            <button onClick={() => setSelectedComplaint(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Meta */}
                        <div className="p-4 border-b border-[var(--card-border)]">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Student</p>
                                    <p className="geist-font text-[13px] font-medium text-[var(--text-primary)]">{selectedComplaint.createdBy?.name}</p>
                                    <p className="geist-font text-[11px] text-[var(--text-muted)]">{selectedComplaint.createdBy?.email}</p>
                                </div>
                                <div>
                                    <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Filed On</p>
                                    <p className="geist-font text-[13px] font-medium text-[var(--text-primary)]">
                                        {new Date(selectedComplaint.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                                    </p>
                                </div>
                                <div>
                                    <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Category</p>
                                    <p className="geist-font text-[13px] font-medium text-[var(--text-primary)]">{selectedComplaint.category}</p>
                                </div>
                                <div>
                                    <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Priority</p>
                                    <p className={`geist-font text-[13px] font-bold ${
                                        selectedComplaint.priority === 'High' ? 'text-red-600' : selectedComplaint.priority === 'Medium' ? 'text-[#925C0E]' : 'text-blue-600'
                                    }`}>{selectedComplaint.priority}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="p-4 border-b border-[var(--card-border)]">
                            <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-2">Description</p>
                            <p className="geist-font text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{selectedComplaint.description}</p>
                        </div>

                        {/* Attached Documents */}
                        <div className="p-4 border-b border-[var(--card-border)]">
                            <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-2">Attached Documents</p>
                            {selectedComplaint.fileUrl ? (
                                <div className="border border-[var(--card-border)] rounded-xl overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-3">
                                        <span className={`material-symbols-outlined text-lg ${getFileIcon(selectedComplaint.fileName || selectedComplaint.fileUrl).color}`}>
                                            {getFileIcon(selectedComplaint.fileName || selectedComplaint.fileUrl).icon}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="geist-font text-[13px] font-medium text-[var(--text-primary)] truncate">
                                                {selectedComplaint.fileName || selectedComplaint.fileUrl.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex border-t border-[var(--card-border)]">
                                        <button onClick={() => handleViewFile(selectedComplaint.fileUrl)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[var(--primary-orange)] hover:bg-[var(--bg-color)] transition-colors border-none bg-transparent cursor-pointer">
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                            <span className="geist-font text-[12px] font-bold uppercase tracking-wider">View</span>
                                        </button>
                                        <div className="w-px bg-[var(--card-border)]"></div>
                                        <button onClick={() => handleDownload(selectedComplaint.fileUrl)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[var(--text-secondary)] hover:bg-[var(--bg-color)] transition-colors border-none bg-transparent cursor-pointer">
                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                            <span className="geist-font text-[12px] font-bold uppercase tracking-wider">Download</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-[var(--card-border)] rounded-xl p-4 text-center">
                                    <span className="material-symbols-outlined text-[24px] text-[#D1D1D1] block mb-1">folder_off</span>
                                    <p className="geist-font text-[12px] text-[var(--text-muted)]">No documents attached</p>
                                </div>
                            )}
                        </div>

                        {/* Status Update */}
                        <div className="p-4">
                            <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-2">Update Status</p>
                            <div className="flex gap-2">
                                {['Pending', 'In Progress', 'Resolved'].map(s => (
                                    <button key={s}
                                        onClick={() => handleStatusUpdate(selectedComplaint._id, s)}
                                        className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer geist-font ${
                                            selectedComplaint.status === s
                                            ? 'bg-[var(--text-primary)] text-white border-[var(--text-primary)]'
                                            : 'bg-white text-[var(--text-secondary)] border-[var(--card-border)] hover:border-[var(--primary-orange)]'
                                        }`}>{s === 'In Progress' ? 'Review' : s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
