import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student'
    });
    const [showPassword, setShowPassword] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

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
        <div className="register-page">
            <div className="register-card">
                {/* Left Panel - Dark Form */}
                <div className="register-left-panel">
                    <div className="form-container">
                        <div className="form-header">
                            <h1>Create Account</h1>
                            <p>Register to get started</p>
                        </div>

                        {error && (
                            <div className="register-error">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="register-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <div className="password-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <div className="input-group">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="student">Student</option>
                                </select>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Creating...' : 'Register'}
                            </button>
                        </form>

                        <div className="register-footer">
                            <span>Already have an account?</span>
                            <Link to="/login" className="login-link">Sign in</Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Purple Gradient */}
                <div className="register-right-panel">
                    <div className="right-content">
                        <div className="welcome-text">
                            <h2>
                                <span className="welcome-bold">Join the</span><br />
                                <span className="welcome-light">community</span>
                            </h2>
                            <p>Start your journey with us today</p>
                        </div>
                        <div className="illustration-container">
                            {/* Same Illustration as Login for consistency */}
                            <svg viewBox="0 0 500 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="register-illustration">
                                <ellipse cx="250" cy="420" rx="180" ry="15" fill="rgba(0,0,0,0.1)" />
                                <rect x="180" y="120" rx="4" width="180" height="240" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                <rect x="200" y="145" width="40" height="4" rx="2" fill="#1e1e2f" opacity="0.8" />
                                <rect x="250" y="145" width="80" height="4" rx="2" fill="#ddd6fe" />
                                <rect x="200" y="170" width="140" height="4" rx="2" fill="#ddd6fe" />
                                <rect x="200" y="185" width="110" height="4" rx="2" fill="#ddd6fe" />
                                <circle cx="208" cy="220" r="6" stroke="#1e1e2f" strokeWidth="1.5" fill="none" />
                                <rect x="225" y="218" width="100" height="4" rx="2" fill="#ddd6fe" />
                                <circle cx="208" cy="245" r="6" stroke="#1e1e2f" strokeWidth="1.5" fill="none" />
                                <rect x="225" y="243" width="90" height="4" rx="2" fill="#ddd6fe" />
                                <circle cx="208" cy="270" r="6" stroke="#1e1e2f" strokeWidth="1.5" fill="none" />
                                <rect x="225" y="268" width="110" height="4" rx="2" fill="#ddd6fe" />
                                <rect x="200" y="305" width="130" height="4" rx="2" fill="#ddd6fe" />
                                <rect x="200" y="325" width="90" height="4" rx="2" fill="#ddd6fe" />
                                <g id="person-top">
                                    <path d="M330 120 L330 160 L345 160 L345 150" stroke="#1e1e2f" strokeWidth="12" strokeLinecap="round" fill="none" />
                                    <path d="M300 120 L300 155 L315 155" stroke="#1e1e2f" strokeWidth="12" strokeLinecap="round" fill="none" />
                                    <path d="M290 120 C290 90 330 90 340 120 Z" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M290 120 L280 90 C280 70 320 70 330 90 L340 120" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <circle cx="305" cy="70" r="14" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M290 70 C290 55 320 55 320 70" fill="#1e1e2f" />
                                    <path d="M320 95 L350 95 L345 115 L325 115 Z" fill="#1e1e2f" />
                                </g>
                                <g id="person-left">
                                    <path d="M125 310 L115 380 L100 380" stroke="#1e1e2f" strokeWidth="10" strokeLinecap="round" fill="none" />
                                    <path d="M145 310 L165 370 L180 370" stroke="#1e1e2f" strokeWidth="10" strokeLinecap="round" fill="none" />
                                    <rect x="115" y="240" width="40" height="70" rx="20" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M135 255 L110 280" stroke="#1e1e2f" strokeWidth="8" strokeLinecap="round" />
                                    <rect x="100" y="270" width="12" height="20" transform="rotate(-30 100 270)" fill="#1e1e2f" />
                                    <circle cx="135" cy="225" r="14" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M120 225 C120 210 150 210 150 225" fill="#1e1e2f" />
                                    <path d="M155 250 Q165 270 155 290" stroke="#1e1e2f" strokeWidth="2" fill="none" />
                                </g>
                                <g id="magnifying-glass">
                                    <circle cx="180" cy="300" r="45" stroke="#1e1e2f" strokeWidth="8" fill="rgba(255,255,255,0.2)" />
                                    <circle cx="180" cy="300" r="35" stroke="#1e1e2f" strokeWidth="1" fill="none" opacity="0.3" />
                                    <line x1="148" y1="332" x2="120" y2="360" stroke="#1e1e2f" strokeWidth="12" strokeLinecap="round" />
                                </g>
                                <g id="plant">
                                    <path d="M380 420 Q400 350 430 380 Q450 400 450 420 Z" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M400 420 Q420 370 450 390 Q470 410 470 420 Z" fill="white" stroke="#1e1e2f" strokeWidth="1.5" />
                                    <path d="M380 420 L470 420 L460 450 L390 450 Z" fill="#1e1e2f" />
                                </g>
                                <path d="M100 150 L110 160 M110 150 L100 160" stroke="#1e1e2f" strokeWidth="2" />
                                <circle cx="450" cy="100" r="3" fill="#1e1e2f" />
                                <circle cx="430" cy="120" r="2" fill="#1e1e2f" />
                            </svg>
                        </div>
                    </div>
                    <div className="purple-blob"></div>
                </div>
            </div>

            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                .register-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%);
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }

                .register-card {
                    display: flex;
                    width: 100%;
                    max-width: 900px;
                    min-height: 600px;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                }

                /* ====== LEFT PANEL — Dark Form ====== */
                .register-left-panel {
                    width: 50%;
                    flex-shrink: 0;
                    background: #1e1e2f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                }

                .form-container {
                    width: 100%;
                    max-width: 340px;
                }

                .form-header {
                    margin-bottom: 24px;
                }

                .form-header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                }

                .form-header p {
                    font-size: 14px;
                    color: #9ca3af;
                    margin: 0;
                    font-weight: 400;
                }

                .register-error {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(239, 68, 68, 0.1);
                    color: #f87171;
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 500;
                    margin-bottom: 20px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }

                .error-icon {
                    font-size: 14px;
                }

                /* Form */
                .register-form .input-group {
                    margin-bottom: 20px;
                }

                .register-form input, 
                .register-form select {
                    width: 100%;
                    padding: 10px 0;
                    font-size: 15px;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid #4b5563;
                    border-radius: 0;
                    color: #f3f4f6;
                    transition: all 0.2s ease;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                }
                
                .register-form select {
                    color: #f3f4f6;
                    cursor: pointer;
                }

                .register-form select option {
                    background: #1e1e2f;
                    color: #f3f4f6;
                }

                .register-form input:focus,
                .register-form select:focus {
                    border-bottom-color: #a78bfa;
                }

                .register-form input::placeholder {
                    color: #6b7280;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 10px;
                }

                /* Password */
                .password-wrapper {
                    position: relative;
                }

                .password-wrapper input {
                    padding-right: 30px;
                }

                .toggle-password {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 0;
                    transition: color 0.2s;
                }

                .toggle-password:hover {
                    color: #e5e7eb;
                }

                /* Submit Button */
                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.4), 0 2px 4px -1px rgba(139, 92, 246, 0.2);
                    margin-top: 10px;
                }

                .submit-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.5), 0 4px 6px -2px rgba(139, 92, 246, 0.3);
                }

                .submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Footer */
                .register-footer {
                    margin-top: 24px;
                    font-size: 14px;
                    color: #9ca3af;
                    text-align: center;
                }

                .login-link {
                    color: #a78bfa;
                    text-decoration: none;
                    font-weight: 600;
                    margin-left: 5px;
                    transition: color 0.2s;
                }

                .login-link:hover {
                    color: #c4b5fd;
                    text-decoration: underline;
                }

                /* ====== RIGHT PANEL — Purple Welcome ====== */
                .register-right-panel {
                    flex: 1;
                    background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 40px;
                }

                .right-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    width: 100%;
                    max-width: 440px;
                    color: white;
                }

                .welcome-text {
                    margin-bottom: 40px;
                }

                .welcome-text h2 {
                    font-size: 32px;
                    line-height: 1.2;
                    margin: 0 0 10px 0;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }

                .welcome-bold, .welcome-light {
                    display: inline;
                    font-size: inherit;
                    font-weight: inherit;
                }

                .welcome-text p {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.9);
                    margin: 0;
                    font-weight: 400;
                }

                .illustration-container {
                    width: 100%;
                    max-width: 400px;
                    margin: 0 auto;
                    filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
                }

                .register-illustration {
                    width: 100%;
                    height: auto;
                    display: block;
                }

                .purple-blob {
                    position: absolute;
                    top: -20%;
                    right: -20%;
                    width: 500px;
                    height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
                    pointer-events: none;
                }

                /* ====== RESPONSIVE ====== */
                @media (max-width: 900px) {
                    .register-card {
                        flex-direction: column;
                        max-width: 450px;
                        min-height: auto;
                    }

                    .register-left-panel {
                        width: 100%;
                        padding: 32px;
                        border-right: none;
                    }

                    .register-right-panel {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
