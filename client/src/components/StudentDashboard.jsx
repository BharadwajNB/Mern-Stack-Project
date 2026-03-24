import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = { user: { name: "Marcus" } }; // Fallback for demonstration if context is missing

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

    const getStatusStyles = (status) => {
        switch(status) {
            case 'Pending': return 'bg-[#fef3c7] text-[#92400e]';
            case 'Resolved': return 'bg-[#d1fae5] text-[#065f46]';
            case 'In Progress': return 'bg-[#dbeafe] text-[#1d4ed8]';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <header className="mb-8">
                <h2 className="text-[32px] font-bold tracking-tight text-[var(--text-primary)]">
                    Good morning, <span className="text-[var(--primary)]">{user?.name}</span>
                </h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Here is the current status of your open cases and academic feedback.</p>
            </header>

            {/* Stats Cards Section */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm relative overflow-hidden group hover:border-[var(--primary)] transition-colors">
                    <span className="material-symbols-outlined text-[var(--primary)] text-[20px] mb-4">folder_open</span>
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Lifetime Total</span>
                        <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stats.total.toString().padStart(2, '0')}</div>
                        <p className="text-[var(--text-secondary)] text-xs mt-2">Grievances filed since Fall 2023</p>
                    </div>
                </div>

                <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm relative group hover:border-[var(--primary)] transition-colors">
                    <span className="material-symbols-outlined text-[var(--primary)] text-[20px] mb-4">pending_actions</span>
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Active Cases</span>
                        <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stats.active.toString().padStart(2, '0')}</div>
                        <p className="text-[var(--text-secondary)] text-xs mt-2">Currently being processed</p>
                    </div>
                </div>

                <div className="bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 shadow-sm relative group hover:border-[var(--primary)] transition-colors">
                    <span className="material-symbols-outlined text-[var(--primary)] text-[20px] mb-4">task_alt</span>
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Resolved</span>
                        <div className="text-3xl font-bold text-[var(--text-primary)] mt-1">{stats.resolved.toString().padStart(2, '0')}</div>
                        <p className="text-[var(--text-secondary)] text-xs mt-2">Successfully closed cases</p>
                    </div>
                </div>

                <div className="bg-white border border-[var(--border-subtle)] border-l-4 border-l-[var(--primary)] rounded-[var(--radius-lg)] p-6 shadow-sm relative group">
                    <span className="material-symbols-outlined text-[var(--primary)] text-[20px] mb-4">notification_important</span>
                    <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">Requires Attention</span>
                        <div className="text-3xl font-bold text-[var(--primary)] mt-1">{stats.attention.toString().padStart(2, '0')}</div>
                        <p className="text-[var(--text-secondary)] text-xs mt-2">Action needed on active cases</p>
                    </div>
                </div>
            </section>

            {/* Recent Activity Table */}
            <section className="mb-8">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">Recent Activity</h3>
                    <Link to="/history" className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
                        View Archive <span>→</span>
                    </Link>
                </div>

                <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-subtle)] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-subtle)] bg-gray-50/50">
                                    <th className="px-6 py-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Grievance Title</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-subtle)]">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-[var(--text-muted)] text-sm">
                                            Loading activity...
                                        </td>
                                    </tr>
                                ) : complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-[var(--text-muted)] text-sm">
                                            No recent activity found.
                                        </td>
                                    </tr>
                                ) : (
                                    complaints.slice(0, 5).map((c) => (
                                        <tr key={c._id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 text-sm font-medium text-[var(--text-secondary)]">#{c._id.slice(-6).toUpperCase()}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-sm text-[var(--text-primary)]">{c.title}</div>
                                                <div className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{c.description}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{c.category}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyles(c.status)}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link to={`/complaint/${c._id}`} className="text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
                                                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Footer Panels */}
            <footer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#f9fafb] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] hover:shadow-md transition-shadow">
                    <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">Student Advocate Office</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                        Sensitive nature grievances require immediate mediation. Visit Student Union, Room 402, 9AM-4PM.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 overflow-hidden">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Chen" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-[var(--text-primary)] leading-tight">Sarah Chen</p>
                            <p className="text-[10px] text-[var(--text-muted)] font-medium">Dean of Student Affairs</p>
                        </div>
                    </div>
                </div>

                <div className="border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] flex flex-col justify-center bg-white hover:shadow-md transition-shadow">
                    <h4 className="text-base font-bold text-[var(--text-primary)] mb-1">Need help navigating?</h4>
                    <p className="text-xs text-[var(--text-secondary)] mb-4">Our guide explains tracking and resolution times.</p>
                    <div className="flex gap-2">
                        <button className="bg-[var(--text-primary)] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">Guide</button>
                        <button className="text-[var(--text-primary)] px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[var(--border-subtle)] hover:bg-gray-50 transition-colors">FAQ</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default StudentDashboard;

