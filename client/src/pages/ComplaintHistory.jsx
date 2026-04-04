import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ComplaintHistory = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [dateSort, setDateSort] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const getStatusPill = (status) => {
        switch(status) {
            case 'Pending':     return { className: 'status-pill pill-pending', label: 'Pending' };
            case 'In Progress': return { className: 'status-pill bg-[#E8F0FA] text-[#1E5FA6]', label: 'In Review' };
            case 'Resolved':    return { className: 'status-pill pill-resolved', label: 'Resolved' };
            case 'Rejected':    return { className: 'status-pill pill-action', label: 'Rejected' };
            default:            return { className: 'status-pill pill-pending', label: status };
        }
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const d = new Date(date);
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return d.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'});
    };

    // Build notification items from complaints
    const buildNotifications = () => {
        const today = [];
        const yesterday = [];
        const older = [];
        const now = new Date();

        complaints.forEach(c => {
            const d = new Date(c.updatedAt || c.createdAt);
            const diffHours = (now - d) / (1000 * 60 * 60);

            const item = {
                id: c._id,
                title: c.status === 'Resolved' ? 'Complaint Resolved' :
                       c.status === 'In Progress' ? 'Status Updated' :
                       c.status === 'Pending' ? 'New Complaint Filed' : 'Update',
                description: c.title,
                time: getRelativeTime(c.updatedAt || c.createdAt),
                icon: c.status === 'Resolved' ? 'check_circle' :
                      c.status === 'In Progress' ? 'info' :
                      c.status === 'Pending' ? 'warning' : 'verified',
                iconColor: c.status === 'Resolved' ? 'text-[#10b981]' :
                           c.status === 'In Progress' ? 'text-[#3b82f6]' :
                           c.status === 'Pending' ? 'text-[#f59e0b]' : 'text-[#10b981]',
            };

            if (diffHours < 24) today.push(item);
            else if (diffHours < 48) yesterday.push(item);
            else older.push(item);
        });

        return { today, yesterday, older };
    };

    const notifications = buildNotifications();

    // Filtered complaints for table
    let filtered = [...complaints];
    if (search) filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
    if (categoryFilter) filtered = filtered.filter(c => c.category === categoryFilter);
    if (dateSort === 'Newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (dateSort === 'Oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const uniqueCategories = [...new Set(complaints.map(c => c.category))];

    return (
        <div className="animate-fade-in">
            <div className="min-h-screen">

                    {/* ═══════════════════════════════════════
                        SECTION 1: ACTIVITY LOG (TIMELINE)
                        ═══════════════════════════════════════ */}
                    <header className="mb-10 max-w-5xl mx-auto">
                        <h2 className="heading-font text-[32px] font-bold leading-none text-[var(--text-primary)]">
                            Activity <span className="text-[var(--primary-orange)]">Log</span>
                        </h2>
                        <p className="geist-font text-[var(--text-secondary)] text-[14px] mt-2 font-normal">
                            Real-time updates and status changes for your active complaints.
                        </p>
                    </header>

                    <div className="max-w-5xl mx-auto mb-12 animate-fade-in">
                        <div className="bg-white border-[1.5px] border-[var(--card-border)] rounded-[24px] shadow-sm overflow-hidden">
                            <div className="grid grid-cols-[100px_1fr]">
                                {/* Timeline column */}
                                <div className="relative bg-[#fafafa] border-r border-[var(--card-border)] py-4 flex flex-col items-center gap-16 overflow-hidden">
                                    {/* Vertical line */}
                                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--card-border)]" style={{transform: 'translateX(-50%)'}}></div>
                                    {notifications.today.length > 0 && (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="bg-white border border-[var(--card-border)] rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-[var(--text-muted)] mb-1 geist-font">Today</span>
                                            <div className="w-2 h-2 rounded-full bg-[var(--primary-orange)] border-2 border-white ring-2 ring-[var(--primary-orange)]/10"></div>
                                        </div>
                                    )}
                                    {notifications.yesterday.length > 0 && (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="bg-white border border-[var(--card-border)] rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-[var(--text-muted)] mb-1 geist-font">Yesterday</span>
                                            <div className="w-2 h-2 rounded-full bg-[var(--card-border)] border-2 border-white ring-2 ring-black/5"></div>
                                        </div>
                                    )}
                                    {notifications.older.length > 0 && (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <span className="bg-white border border-[var(--card-border)] rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter text-[var(--text-muted)] mb-1 geist-font">Earlier</span>
                                            <div className="w-2 h-2 rounded-full bg-[var(--card-border)] border-2 border-white ring-2 ring-black/5"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Notification cards */}
                                <div className="flex flex-col">
                                    {notifications.today.length > 0 && (
                                        <>
                                            <div className="bg-[#fcfaf8] px-4 py-2 border-b border-[var(--hairline)]">
                                                <span className="geist-font text-[10px] font-bold text-[var(--primary-orange)] uppercase tracking-widest">Recent Updates</span>
                                            </div>
                                            {notifications.today.map((n, i) => (
                                                <Link key={`today-${i}`} to={`/complaint/${n.id}`} className="no-underline flex items-start gap-3 py-3 px-4 transition-colors hover:bg-white/50 border-b border-[var(--hairline)]">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <span className={`material-symbols-outlined text-[18px] ${n.iconColor}`}>{n.icon}</span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="heading-font text-[14px] font-bold text-[var(--text-primary)]">{n.title}</h4>
                                                            <span className="geist-font text-[11px] text-[var(--text-muted)] font-medium whitespace-nowrap">{n.time}</span>
                                                        </div>
                                                        <p className="geist-font text-[12px] text-[var(--text-secondary)] leading-snug mt-0.5">{n.description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                    {notifications.yesterday.length > 0 && (
                                        <>
                                            <div className="bg-[#fafafa] px-4 py-2 border-y border-[var(--hairline)]">
                                                <span className="geist-font text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Previous Activity</span>
                                            </div>
                                            {notifications.yesterday.map((n, i) => (
                                                <Link key={`yest-${i}`} to={`/complaint/${n.id}`} className="no-underline flex items-start gap-3 py-3 px-4 transition-colors hover:bg-white/50 border-b border-[var(--hairline)]">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <span className={`material-symbols-outlined text-[18px] ${n.iconColor}`}>{n.icon}</span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="heading-font text-[14px] font-bold text-[var(--text-primary)]">{n.title}</h4>
                                                            <span className="geist-font text-[11px] text-[var(--text-muted)] font-medium whitespace-nowrap">{n.time}</span>
                                                        </div>
                                                        <p className="geist-font text-[12px] text-[var(--text-secondary)] leading-snug mt-0.5">{n.description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                    {notifications.older.length > 0 && (
                                        <>
                                            {!notifications.yesterday.length && (
                                                <div className="bg-[#fafafa] px-4 py-2 border-y border-[var(--hairline)]">
                                                    <span className="geist-font text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Previous Activity</span>
                                                </div>
                                            )}
                                            {notifications.older.slice(0, 3).map((n, i) => (
                                                <Link key={`older-${i}`} to={`/complaint/${n.id}`} className="no-underline flex items-start gap-3 py-3 px-4 transition-colors hover:bg-white/50 border-b border-[var(--hairline)] opacity-70">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        <span className={`material-symbols-outlined text-[18px] ${n.iconColor}`}>{n.icon}</span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="heading-font text-[14px] font-bold text-[var(--text-primary)]">{n.title}</h4>
                                                            <span className="geist-font text-[11px] text-[var(--text-muted)] font-medium whitespace-nowrap">{n.time}</span>
                                                        </div>
                                                        <p className="geist-font text-[12px] text-[var(--text-secondary)] leading-snug mt-0.5">{n.description}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                    {complaints.length === 0 && !loading && (
                                        <div className="p-8 text-center">
                                            <p className="geist-font text-[var(--text-muted)] text-[13px]">No activity yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════
                        SECTION 2: COMPLAINTS TABLE
                        ═══════════════════════════════════════ */}
                    <div className="max-w-5xl mx-auto">
                        <header className="flex justify-between items-end">
                            <div>
                                <h2 className="heading-font text-[22px] font-bold text-[var(--text-primary)] leading-tight">Complaints</h2>
                                <p className="geist-font text-[13px] text-[var(--text-secondary)] mt-1">Manage and track your submitted complaints</p>
                            </div>
                            <Link to="/complaint/new" className="no-underline">
                                <button className="bg-[var(--primary-orange)] text-white h-[36px] px-[14px] rounded-[8px] text-[13px] font-semibold active:scale-[0.95] transition-transform border-none cursor-pointer geist-font">
                                    Raise Complaint
                                </button>
                            </Link>
                        </header>

                        {/* Search + Filters */}
                        <div className="mt-[16px] flex justify-between items-center">
                            <div className="relative">
                                <input value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="w-[260px] h-[36px] border-[0.5px] border-[var(--card-border)] rounded-[8px] px-[12px] bg-white text-[13px] focus:ring-0 focus:border-[var(--primary-orange)] placeholder:text-[var(--text-muted)] geist-font outline-none"
                                    placeholder="Search complaints..." type="text"/>
                            </div>
                            <div className="flex gap-[8px]">
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                    className="h-[36px] border-[0.5px] border-[var(--card-border)] rounded-[8px] px-[10px] bg-white text-[13px] text-[#555555] min-w-[100px] geist-font outline-none cursor-pointer">
                                    <option value="">Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Review</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="h-[36px] border-[0.5px] border-[var(--card-border)] rounded-[8px] px-[10px] bg-white text-[13px] text-[#555555] min-w-[110px] geist-font outline-none cursor-pointer">
                                    <option value="">Category</option>
                                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={dateSort} onChange={(e) => setDateSort(e.target.value)}
                                    className="h-[36px] border-[0.5px] border-[var(--card-border)] rounded-[8px] px-[10px] bg-white text-[13px] text-[#555555] min-w-[90px] geist-font outline-none cursor-pointer">
                                    <option value="">Date</option>
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="mt-[16px] bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] overflow-hidden shadow-sm mb-8">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#fcfcfc] border-b border-[var(--card-border)]">
                                    <tr className="h-[44px]">
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">ID</th>
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Title</th>
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Category</th>
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Status</th>
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Last Activity</th>
                                        <th className="px-[16px] geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Date</th>
                                        <th className="px-[16px] w-[50px]"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr className="h-[52px]"><td colSpan="7" className="px-[16px] text-center geist-font text-[13px] text-[var(--text-muted)]">Loading…</td></tr>
                                    ) : filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">
                                                <div className="flex flex-col items-center justify-center py-[60px] text-center">
                                                    <span className="material-symbols-outlined text-[48px] text-[#D1D1D1] mb-4">inventory_2</span>
                                                    <p className="geist-font text-[14px] text-[var(--text-muted)] mb-4">No complaints yet</p>
                                                    <Link to="/complaint/new" className="no-underline">
                                                        <button className="bg-[var(--primary-orange)] text-white h-[36px] px-[14px] rounded-[8px] text-[13px] font-semibold active:scale-[0.95] transition-transform border-none cursor-pointer geist-font">
                                                            Raise Complaint
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map(c => {
                                            const status = getStatusPill(c.status);
                                            return (
                                                <tr key={c._id} className="h-[52px] border-b border-[var(--bg-color)] cursor-pointer hover:bg-[#fcfcfc] transition-colors">
                                                    <td className="px-[16px] geist-font text-[12px] text-[var(--text-muted)]">#{c._id.slice(-5).toUpperCase()}</td>
                                                    <td className="px-[16px] geist-font text-[13px] text-[var(--text-primary)] font-medium">{c.title}</td>
                                                    <td className="px-[16px] geist-font text-[12px] text-[#555555]">{c.category}</td>
                                                    <td className="px-[16px]">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold geist-font ${status.className}`}>{status.label}</span>
                                                    </td>
                                                    <td className="px-[16px] geist-font text-[11px] text-[var(--text-secondary)]">{getRelativeTime(c.updatedAt || c.createdAt)}</td>
                                                    <td className="px-[16px] geist-font text-[12px] text-[var(--text-muted)]">{new Date(c.createdAt).toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                                                    <td className="px-[16px] text-right">
                                                        <Link to={`/complaint/${c._id}`}>
                                                            <span className="material-symbols-outlined text-[18px] text-[#D1D1D1]">chevron_right</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <footer className="mt-10 text-center">
                        <p className="geist-font text-[11px] text-[#a8a29e] uppercase tracking-[0.1em] font-medium">SERVIO System Security • Managed by University IT</p>
                    </footer>
            </div>
        </div>
    );
};

export default ComplaintHistory;
