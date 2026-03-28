import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = user?.role === 'admin' 
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: 'dashboard', label: 'Overview' },
            { name: 'Students', path: '/admin/students', icon: 'group', label: 'Students' },
            { name: 'Complaints', path: '/dashboard', icon: 'gavel', label: 'Complaints' },
            { name: 'Exports', path: '/admin/exports', icon: 'download', label: 'Exports' },
          ]
        : [
            { name: 'Overview', path: '/dashboard', icon: 'dashboard', label: 'Overview' },
            { name: 'Complaints', path: '/complaint/new', icon: 'gavel', label: 'Complaints' },
            { name: 'History', path: '/history', icon: 'history', label: 'History' },
            { name: 'Profile', path: '/profile', icon: 'person', label: 'Profile' },
          ];

    return (
        <aside className="flex flex-col py-8 h-full" style={{background: 'var(--sidebar-bg)'}}>
            {/* Branding */}
            <div className="px-6 mb-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--primary-orange)] rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">account_balance</span>
                    </div>
                    <span className="heading-font text-white font-bold text-xl tracking-tight">SERVIO</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col flex-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path === '/dashboard' && location.pathname === '/');
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`px-6 py-3 flex items-center gap-3 transition-all border-l-[3px] ${
                                isActive 
                                ? 'sidebar-active' 
                                : 'text-[#7A7A7A] hover:text-white border-transparent'
                            }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-white' : ''}`}>{item.icon}</span>
                            <span className="geist-font text-[14px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="flex flex-col gap-5 px-6">
                <Link to="/help" className="text-[#57534e] hover:text-[#a8a29e] transition-colors flex items-center gap-3 no-underline">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    <span className="text-xs">Help & Support</span>
                </Link>
                <button 
                    onClick={logout}
                    className="bg-[var(--primary-orange)] text-white py-3 px-4 rounded-[12px] text-[14px] font-semibold active:scale-[0.98] transition-transform w-full border-none cursor-pointer shadow-none"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
