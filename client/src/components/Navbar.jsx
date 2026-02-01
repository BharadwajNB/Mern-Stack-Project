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
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🎓</span>
                    <span className="brand-text">ComplaintHub</span>
                </Link>

                <div className="navbar-menu">
                    {user && (
                        <>
                            <span className="user-info">
                                <span className="user-role">{user.role}</span>
                                <span className="user-name">{user.name}</span>
                            </span>

                            <button
                                onClick={toggleTheme}
                                className="theme-toggle"
                                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            <button onClick={handleLogout} className="btn btn-secondary">
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                .navbar {
                    background: var(--color-bg-primary);
                    border-bottom: 1px solid var(--color-border);
                    padding: 0.75rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .navbar-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                }

                .brand-icon {
                    font-size: 1.5rem;
                }

                .navbar-menu {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }

                .user-role {
                    font-size: 0.625rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--color-primary);
                    font-weight: 600;
                }

                .user-name {
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }

                .theme-toggle {
                    background: var(--color-bg-tertiary);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    padding: 0.5rem;
                    font-size: 1.125rem;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .theme-toggle:hover {
                    background: var(--color-border);
                    transform: scale(1.05);
                }

                @media (max-width: 640px) {
                    .user-info {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
