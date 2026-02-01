import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="site-header">
            <nav className="nav-wrapper">
                <div className="nav-content">
                    <Link to="/" className="logo-link">
                        <div className="logo-box">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <div className="logo-text">
                            <span className="logo-name">ComplaintHub</span>
                            <span className="logo-tagline">University Portal</span>
                        </div>
                    </Link>

                    {user && (
                        <div className="nav-right">
                            <div className="user-block">
                                <div className="user-avatar">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-meta">
                                    <span className="user-name">{user.name}</span>
                                    <span className="user-badge">{user.role}</span>
                                </div>
                            </div>

                            <div className="nav-actions">
                                <button
                                    onClick={toggleTheme}
                                    className="action-btn theme-btn"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'light' ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" />
                                            <line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" />
                                            <line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </svg>
                                    )}
                                </button>

                                <button onClick={handleLogout} className="action-btn logout-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <style>{`
                .site-header {
                    background: var(--bg-card);
                    border-bottom: 1px solid var(--border-color);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    backdrop-filter: blur(12px);
                }

                .nav-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .nav-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 40px;
                    height: 80px;
                }

                .logo-link {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    text-decoration: none;
                }

                .logo-box {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
                }

                .logo-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .logo-name {
                    font-size: 22px;
                    font-weight: 800;
                    color: var(--text-main);
                    letter-spacing: -0.02em;
                    line-height: 1;
                }

                .logo-tagline {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                }

                .user-block {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 8px 20px 8px 8px;
                    background: var(--bg-elevated);
                    border-radius: 50px;
                    border: 1px solid var(--border-color);
                }

                .user-avatar {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                }

                .user-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .user-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: var(--text-main);
                    line-height: 1.1;
                }

                .user-badge {
                    font-size: 11px;
                    font-weight: 700;
                    color: #ea580c;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }

                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: var(--bg-elevated);
                    border: 1px solid var(--border-color);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: var(--text-secondary);
                    font-family: inherit;
                }

                .theme-btn {
                    width: 44px;
                    height: 44px;
                    padding: 0;
                }

                .theme-btn:hover {
                    background: var(--accent-light);
                    border-color: var(--accent);
                    color: var(--accent);
                    transform: rotate(15deg);
                }

                .logout-btn {
                    padding: 10px 18px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .logout-btn:hover {
                    background: #fef2f2;
                    border-color: #dc2626;
                    color: #dc2626;
                }

                @media (max-width: 768px) {
                    .nav-content {
                        padding: 0 20px;
                        height: 70px;
                    }

                    .user-meta,
                    .logo-tagline {
                        display: none;
                    }

                    .user-block {
                        padding: 6px;
                        border-radius: 50%;
                    }

                    .logo-name {
                        font-size: 18px;
                    }

                    .logout-btn span {
                        display: none;
                    }

                    .logout-btn {
                        width: 44px;
                        height: 44px;
                        padding: 0;
                    }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
