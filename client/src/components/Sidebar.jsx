import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = user?.role === 'admin' 
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
            { name: 'Analytics', path: '/analytics', icon: 'monitoring' },
            { name: 'Profiles', path: '/profiles', icon: 'group' },
          ]
        : [
            { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
            { name: 'File Complaint', path: '/complaint/new', icon: 'add_circle' },
            { name: 'My Profile', path: '/profile', icon: 'person' },
          ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[var(--bg-sidebar)] flex flex-col justify-between py-8 z-50">
            <div>
                {/* Branding */}
                <div className="px-6 mb-10">
                    <h1 className="text-[18px] font-extrabold text-[#faf6f1] leading-none tracking-[-0.03em]">SERVIO</h1>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#57534e] mt-1.5 font-normal">University Grievance Portal</p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-3.5 px-6 py-3 transition-all ${
                                    isActive 
                                    ? 'text-[#faf6f1] bg-[rgba(37,99,235,0.1)] border-l-[4px] border-[var(--primary)]' 
                                    : 'text-[#a8a29e] hover:text-[#faf6f1]'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                <span className="text-[14px] font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Section */}
            <div className="px-6 flex flex-col gap-4">
                <Link to="/help" className="flex items-center gap-3 text-[#57534e] hover:text-[#a8a29e] transition-colors">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    <span className="text-xs">Help & Support</span>
                </Link>
                
                <button 
                    onClick={logout}
                    className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white py-2.5 rounded-[var(--radius-md)] text-[14px] font-semibold transition-all active:scale-[0.98]"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
