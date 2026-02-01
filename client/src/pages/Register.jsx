import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        department: 'General'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container register">
                <div className="auth-brand">
                    <div className="brand-logo">
                        <span className="logo-icon">📣</span>
                        <span className="logo-text">ComplaintHub</span>
                    </div>
                    <p className="brand-tagline">University Complaint Management</p>
                </div>

                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Create Account</h1>
                        <p>Join the university complaint system</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="John Doe"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="you@university.edu"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Min. 6 characters"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Role</label>
                                <select
                                    name="role"
                                    className="form-select"
                                    onChange={handleChange}
                                    value={formData.role}
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department</label>
                                <select
                                    name="department"
                                    className="form-select"
                                    onChange={handleChange}
                                    value={formData.department}
                                >
                                    <option value="General">General</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="Mechanical">Mechanical</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account →'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>Already have an account?</span>
                        <Link to="/login" className="auth-link">Sign in</Link>
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

                .auth-container.register {
                    max-width: 480px;
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

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
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

                @media (max-width: 520px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .auth-card {
                        padding: 28px 24px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
