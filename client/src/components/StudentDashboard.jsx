import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const stats = {
        total: complaints.length,
        active: complaints.filter(c => ['Pending', 'In Progress'].includes(c.status)).length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
        attention: complaints.filter(c => c.priority === 'High' || c.priority === 'Urgent').length
    };

    const pad = (n) => n.toString().padStart(2, '0');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const getStatusPill = (status) => {
        switch(status) {
            case 'Pending': return { className: 'status-pill bg-[#FDF4E7] text-[#925C0E]', label: 'Pending' };
            case 'In Progress': return { className: 'status-pill bg-[#FCECEA] text-[#9B2B2B]', label: 'Action Req' };
            case 'Resolved': return { className: 'status-pill bg-[#EAF4EC] text-[#2E7D4F]', label: 'Resolved' };
            default: return { className: 'status-pill bg-[#FDF4E7] text-[#925C0E]', label: status };
        }
    };

    const getSlaText = (complaint) => {
        if (complaint.status === 'Resolved') return { text: 'Completed', className: 'text-[var(--text-secondary)]' };
        const created = new Date(complaint.createdAt);
        const now = new Date();
        const hoursElapsed = Math.floor((now - created) / (1000 * 60 * 60));
        if (hoursElapsed > 48) return { text: 'Overdue', className: 'text-[#9B2B2B] font-medium' };
        const remaining = 48 - hoursElapsed;
        return { text: `${remaining}h remaining`, className: 'text-[var(--text-secondary)]' };
    };

    return (
        <div className="animate-fade-in flex flex-col gap-4">
            {/* ── HEADER ── */}
            <header className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="heading-font text-[22px] font-bold text-[var(--text-primary)] leading-tight">
                        {getGreeting()}, {user?.name?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="geist-font text-[13px] text-[var(--text-secondary)] mt-0.5">
                        Here's the current status of your open cases and academic feedback.
                    </p>
                </div>
                <Link to="/complaint/new" className="no-underline">
                    <button className="h-[36px] px-[14px] bg-[var(--primary-orange)] text-white heading-font text-[13px] font-medium rounded-[8px] hover:brightness-110 transition-all border-none cursor-pointer shadow-none">
                        New Complaint
                    </button>
                </Link>
            </header>

            {/* ── STAT CARDS ── */}
            <section className="grid grid-cols-4 gap-[12px] mt-[12px]">
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Total Cases</span>
                    <div className="heading-font text-[22px] font-bold text-[var(--text-primary)] mt-0.5">{pad(stats.total)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Grievances filed to date</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Active Cases</span>
                    <div className="heading-font text-[22px] font-bold text-[var(--text-primary)] mt-0.5">{pad(stats.active)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Currently being processed</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Resolved</span>
                    <div className="heading-font text-[22px] font-bold text-[var(--text-primary)] mt-0.5">{pad(stats.resolved)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Successfully closed cases</p>
                </div>
                <div className="stat-card">
                    <span className="geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-medium">Requires Attention</span>
                    <div className="heading-font text-[22px] font-bold text-[var(--primary-orange)] mt-0.5">{pad(stats.attention)}</div>
                    <p className="geist-font text-[11px] text-[var(--text-secondary)] mt-0.5">Action needed on active case</p>
                </div>
            </section>

            {/* ── RECENT ACTIVITY ── */}
            <section className="mt-[8px]">
                <div className="flex justify-between items-center mb-[10px]">
                    <h2 className="heading-font text-[16px] font-bold text-[var(--text-primary)]">Recent Activity</h2>
                    <Link className="geist-font text-[12px] text-[var(--primary-orange)] font-medium hover:underline no-underline" to="/history">View Archive →</Link>
                </div>
                <div className="table-card">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-left border-b border-[var(--card-border)] bg-white">
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold w-[120px]">ID</th>
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold">Title</th>
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold w-[140px]">Category</th>
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold w-[130px]">Status</th>
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold w-[140px]">SLA</th>
                                <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold text-right w-[60px]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--card-border)]">
                            {loading ? (
                                <tr className="table-row-height bg-white">
                                    <td colSpan="6" className="px-4 text-center geist-font text-[13px] text-[var(--text-muted)]">Loading…</td>
                                </tr>
                            ) : complaints.length === 0 ? (
                                <tr className="table-row-height bg-white">
                                    <td colSpan="6" className="px-4 text-center geist-font text-[13px] text-[var(--text-muted)]">No complaints filed yet.</td>
                                </tr>
                            ) : (
                                complaints.slice(0, 5).map((c) => {
                                    const status = getStatusPill(c.status);
                                    const sla = getSlaText(c);
                                    return (
                                        <tr key={c._id} className="table-row-height bg-white hover:bg-[#fafaf9] transition-colors">
                                            <td className="px-4 geist-mono text-[12px] text-[var(--text-secondary)] font-medium">#{c._id.slice(-4).toUpperCase()}</td>
                                            <td className="px-4">
                                                <div className="heading-font text-[14px] font-bold text-[var(--text-primary)] leading-tight">{c.title}</div>
                                            </td>
                                            <td className="px-4 geist-font text-[13px] text-[var(--text-secondary)]">{c.category}</td>
                                            <td className="px-4">
                                                <span className={`${status.className} font-medium`}>{status.label}</span>
                                            </td>
                                            <td className={`px-4 geist-font text-[13px] ${sla.className}`}>{sla.text}</td>
                                            <td className="px-4 text-right">
                                                <Link to={`/complaint/${c._id}`}>
                                                    <span className="material-symbols-outlined text-[var(--primary-orange)] text-lg cursor-pointer align-middle">arrow_forward</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default StudentDashboard;
