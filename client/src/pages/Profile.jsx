import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        studentId: '',
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                studentId: user.studentId || user?._id?.slice(-6).toUpperCase() || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/auth/profile', formData);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="animate-fade-in">
            <div className="py-6 min-h-screen">
                    <div className="max-w-[920px] mx-auto px-0 animate-fade-in">
                        {/* Header */}
                        <header className="mb-0">
                            <h2 className="heading-font text-[32px] font-bold leading-none text-[var(--text-primary)]">
                                Student <span className="text-[var(--primary-orange)]">Profile</span>
                            </h2>
                            <p className="geist-font text-[var(--text-secondary)] text-[14px] mt-2 font-normal">
                                Manage your personal information and account settings.
                            </p>
                        </header>

                        <div className="mt-[20px] grid grid-cols-[360px_520px] gap-[16px] justify-start items-start">
                            {/* ── LEFT: AVATAR CARD ── */}
                            <div className="bg-white border-[1.5px] border-[var(--card-border)] rounded-[24px] p-5 w-[360px] flex flex-col items-center text-center shadow-sm">
                                <div className="relative mb-[10px]">
                                    <div className="w-[90px] h-[90px] rounded-full overflow-hidden border-4 border-[var(--bg-color)] shadow-md bg-[var(--primary-orange)] flex items-center justify-center">
                                        <span className="heading-font text-[30px] font-bold text-white">{getInitials(user?.name)}</span>
                                    </div>
                                    <button className="absolute bottom-1 right-1 bg-[var(--primary-orange)] text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center cursor-pointer">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                </div>
                                <h3 className="heading-font text-[22px] font-bold text-[var(--text-primary)] mb-[2px]">{user?.name || 'Student'}</h3>
                                <p className="geist-font text-[var(--text-secondary)] text-[13px] mb-0.5">{user?.email || 'student@university.edu'}</p>
                                <p className="geist-font text-[var(--text-muted)] text-[12px] font-medium uppercase tracking-wider">
                                    Student ID: {user?._id?.slice(-6).toUpperCase() || '------'}
                                </p>
                                <div className="w-full h-[1.5px] bg-[var(--hairline)] my-[10px]"></div>
                                <div className="w-full grid grid-cols-2 gap-[10px]">
                                    <div className="bg-[#fafafa] rounded-xl p-[10px]">
                                        <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Joined</p>
                                        <p className="geist-font text-[13px] font-bold text-[var(--text-primary)]">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-[#fafafa] rounded-xl p-[10px]">
                                        <p className="geist-font text-[10px] text-[var(--text-muted)] uppercase font-bold mb-0.5">Status</p>
                                        <p className="geist-font text-[13px] font-bold text-[var(--text-primary)]">Active</p>
                                    </div>
                                </div>
                            </div>

                            {/* ── RIGHT: EDIT FORM ── */}
                            <div className="bg-white border-[1.5px] border-[var(--card-border)] rounded-[24px] p-[22px] w-[520px] shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="heading-font text-[18px] font-bold text-[var(--text-primary)]">Edit Information</h4>
                                    <span className="geist-font text-[12px] text-[var(--text-muted)] font-medium italic">Changes will be verified by administration</span>
                                </div>

                                {message.text && (
                                    <div className={`mb-3 p-3 rounded-xl text-xs font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="geist-font text-[13px] font-medium text-[#57534e]">Name</label>
                                            <input name="name" value={formData.name} onChange={handleChange}
                                                className="w-full px-4 h-[40px] border border-[var(--card-border)] rounded-xl focus:ring-1 focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none text-[15px] font-medium text-[var(--text-primary)] geist-font" type="text"/>
                                        </div>
                                        {/* Student ID */}
                                        <div className="space-y-1.5">
                                            <label className="geist-font text-[13px] font-medium text-[#57534e]">Student ID</label>
                                            <input name="studentId" value={formData.studentId} onChange={handleChange}
                                                className="w-full px-4 h-[40px] border border-[var(--card-border)] rounded-xl focus:ring-1 focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none text-[15px] font-medium text-[var(--text-primary)] geist-font" type="text"/>
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="geist-font text-[13px] font-medium text-[#57534e]">Email</label>
                                        <input name="email" value={formData.email} onChange={handleChange}
                                            className="w-full px-4 h-[40px] border border-[var(--card-border)] rounded-xl focus:ring-1 focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none text-[15px] font-medium text-[var(--text-primary)] geist-font" type="email"/>
                                    </div>
                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className="geist-font text-[13px] font-medium text-[#57534e]">Phone</label>
                                        <input name="phone" value={formData.phone} onChange={handleChange}
                                            className="w-full px-4 h-[40px] border border-[var(--card-border)] rounded-xl focus:ring-1 focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none text-[15px] font-medium text-[var(--text-primary)] geist-font" type="tel"
                                            placeholder="+1 (555) 000-1234"/>
                                    </div>
                                    <div className="pt-3 flex justify-end">
                                        <button type="submit" disabled={saving}
                                            className="bg-[var(--primary-orange)] text-white w-[220px] h-[40px] rounded-xl font-bold text-[14px] uppercase tracking-wider hover:brightness-110 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-50">
                                            {saving ? 'Saving…' : 'Save Changes'}
                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <footer className="mt-6 text-center">
                            <p className="geist-font text-[11px] text-[#a8a29e] uppercase tracking-[0.1em] font-medium">SERVIO System Security • Managed by University IT</p>
                        </footer>
                    </div>
            </div>
        </div>
    );
};

export default Profile;
