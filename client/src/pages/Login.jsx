import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* Left Panel - Gradient with Glassmorphism */}
                <div className="login-left-panel">
                    <div className="left-content">
                        <div className="asterisk-icon">✱</div>
                        <div className="left-text">
                            <p className="subtitle">A simple and transparent way</p>
                            <h2>to raise, track, and resolve student complaints</h2>
                        </div>
                    </div>
                    <div className="glass-orb glass-orb-1"></div>
                    <div className="glass-orb glass-orb-2"></div>
                    <div className="glass-orb glass-orb-3"></div>
                </div>

                {/* Right Panel - Form */}
                <div className="login-right-panel">
                    <div className="form-container">
                        <div className="form-header">
                            <span className="form-asterisk">✱</span>
                            <h1>Welcome Back</h1>
                            <p>Access and manage complaints, track their status, and communicate seamlessly in one place.</p>
                        </div>

                        {error && (
                            <div className="login-error">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                        </form>

                        <div className="divider">
                            <span>or login with</span>
                        </div>

                        <div className="social-buttons">
                            <button type="button" className="social-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </button>
                            <button type="button" className="social-btn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                        </div>

                        <div className="login-footer">
                            <span>Don't have an account?</span>
                            <Link to="/register" className="signup-link">Register here</Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .login-page {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0f0f3;
                    padding: 16px;
                    overflow: hidden;
                }

                .login-container {
                    display: flex;
                    width: 95%;
                    max-width: 880px;
                    min-height: 520px;
                    height: auto;
                    max-height: calc(100vh - 32px);
                    background: white;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
                }

                /* Left Panel */
                .login-left-panel {
                    width: 340px;
                    flex-shrink: 0;
                    background: linear-gradient(160deg, #c4b5fd 0%, #a78bfa 20%, #8b5cf6 40%, #7c3aed 60%, #6d28d9 80%, #a78bfa 100%);
                    padding: 36px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .left-content {
                    position: relative;
                    z-index: 2;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .asterisk-icon {
                    color: white;
                    font-size: 28px;
                    font-weight: 300;
                }

                .left-text {
                    margin-top: auto;
                }

                .left-text .subtitle {
                    color: rgba(255, 255, 255, 0.75);
                    font-size: 13px;
                    margin: 0 0 6px 0;
                    font-weight: 400;
                }

                .left-text h2 {
                    color: white;
                    font-size: 20px;
                    font-weight: 600;
                    line-height: 1.35;
                    margin: 0;
                }

                /* Glassmorphism Orbs */
                .glass-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                }

                .glass-orb-1 {
                    width: 160px;
                    height: 160px;
                    top: 15%;
                    left: -20%;
                    background: rgba(139, 92, 246, 0.7);
                }

                .glass-orb-2 {
                    width: 100px;
                    height: 100px;
                    top: 35%;
                    right: -10%;
                    background: rgba(196, 181, 253, 0.6);
                }

                .glass-orb-3 {
                    width: 80px;
                    height: 80px;
                    bottom: 30%;
                    left: 40%;
                    background: rgba(167, 139, 250, 0.5);
                }

                /* Right Panel */
                .login-right-panel {
                    flex: 1;
                    padding: 40px 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .form-container {
                    width: 100%;
                    max-width: 320px;
                }

                .form-header {
                    margin-bottom: 20px;
                }

                .form-asterisk {
                    color: #6366f1;
                    font-size: 22px;
                    display: block;
                    margin-bottom: 10px;
                }

                .form-header h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0 0 8px 0;
                }

                .form-header p {
                    font-size: 14px;
                    color: #6b7280;
                    line-height: 1.5;
                    margin: 0;
                }

                .login-error {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    margin-bottom: 14px;
                    border: 1px solid #fecaca;
                }

                .login-form .input-group {
                    margin-bottom: 14px;
                }

                .login-form label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 6px;
                }

                .login-form input {
                    width: 100%;
                    padding: 12px 14px;
                    font-size: 15px;
                    background: #f9fafb;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    color: #1f2937;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .login-form input:focus {
                    outline: none;
                    border-color: #6366f1;
                    background: white;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
                }

                .login-form input::placeholder {
                    color: #9ca3af;
                }

                .password-wrapper {
                    position: relative;
                }

                .password-wrapper input {
                    padding-right: 40px;
                }

                .toggle-password {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 2px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s;
                }

                .toggle-password:hover {
                    color: #6366f1;
                }

                .submit-btn {
                    width: 100%;
                    padding: 12px;
                    font-size: 15px;
                    font-weight: 600;
                    color: white;
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    margin-top: 2px;
                }

                .submit-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    margin: 16px 0;
                }

                .divider::before,
                .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #e5e7eb;
                }

                .divider span {
                    padding: 0 10px;
                    font-size: 13px;
                    color: #9ca3af;
                }

                .social-buttons {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }

                .social-btn {
                    flex: 1;
                    padding: 9px 14px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    color: #374151;
                }

                .social-btn.social-dark {
                    background: #1f2937;
                    color: white;
                }

                .social-btn:hover {
                    opacity: 0.85;
                }

                .social-icon {
                    font-weight: 700;
                    font-size: 15px;
                }

                .login-footer {
                    text-align: center;
                    margin-top: 16px;
                    font-size: 14px;
                    color: #6b7280;
                }

                .signup-link {
                    color: #6366f1;
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 4px;
                }

                .signup-link:hover {
                    text-decoration: underline;
                }

                /* Responsive */
                @media (max-width: 700px) {
                    .login-container {
                        flex-direction: column;
                        max-width: 360px;
                    }

                    .login-left-panel {
                        width: 100%;
                        padding: 24px;
                        min-height: 140px;
                    }

                    .left-text h2 {
                        font-size: 15px;
                    }

                    .login-right-panel {
                        padding: 24px 20px;
                    }
                }

                @media (max-height: 600px) {
                    .login-page {
                        padding: 8px;
                    }
                    
                    .login-left-panel {
                        padding: 20px;
                    }
                    
                    .login-right-panel {
                        padding: 20px 32px;
                    }
                    
                    .form-header {
                        margin-bottom: 14px;
                    }
                    
                    .login-form .input-group {
                        margin-bottom: 10px;
                    }
                    
                    .divider {
                        margin: 12px 0;
                    }
                    
                    .login-footer {
                        margin-top: 12px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
