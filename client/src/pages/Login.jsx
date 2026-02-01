import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-brand">
                    <div className="brand-logo">
                        <span className="logo-icon">📣</span>
                        <span className="logo-text">ComplaintHub</span>
                    </div>
                    <p className="brand-tagline">University Complaint Management</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Welcome back</h1>
                        <p>Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@university.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>New here?</span>
                        <Link to="/register" className="auth-link">Create an account</Link>
                    </div>
                </div>

                <p className="auth-copyright">© 2026 University Complaint System</p>
            </div>

            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, var(--bg-body) 0%, var(--bg-subtle) 100%);
                    padding: 24px;
                }

                .auth-container {
                    width: 100%;
                    max-width: 420px;
                }

                .auth-brand {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .brand-logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .logo-icon {
                    font-size: 36px;
                }

                .logo-text {
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--text-main);
                    letter-spacing: -0.03em;
                }

                .brand-tagline {
                    color: var(--text-muted);
                    font-size: 14px;
                    margin: 0;
                }

                .auth-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    padding: 40px;
                    box-shadow: var(--shadow-card);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 32px;
                }

                .auth-header h1 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-main);
                }

                .auth-header p {
                    margin: 0;
                    color: var(--text-secondary);
                    font-size: 15px;
                }

                .auth-error {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 24px;
                    border: 1px solid #fecaca;
                }

                .error-icon {
                    font-size: 16px;
                }

                .auth-form .form-group {
                    margin-bottom: 20px;
                }

                .auth-submit {
                    width: 100%;
                    padding: 14px;
                    font-size: 15px;
                    margin-top: 8px;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 28px;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    font-size: 14px;
                }

                .auth-link {
                    color: var(--accent);
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 6px;
                }

                .auth-link:hover {
                    text-decoration: underline;
                }

                .auth-copyright {
                    text-align: center;
                    margin-top: 32px;
                    color: var(--text-muted);
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default Login;
