import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import FileUpload from '../components/FileUpload';
import Navbar from '../components/Navbar';

const NewComplaint = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Academic',
        priority: 'Medium',
        isAnonymous: false
    });

    const categories = [
        'Academic', 'Administrative', 'Infrastructure',
        'Hostel', 'Library', 'Cafeteria', 'Technical', 'Other'
    ];

    const priorities = ['Low', 'Medium', 'High', 'Urgent'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            files.forEach(file => {
                data.append('attachments', file);
            });

            await api.post('/complaints', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <Navbar />
            <main className="container">
                <div className="page-nav">
                    <Link to="/dashboard" className="back-link">
                        ← Back to complaints
                    </Link>
                </div>
                <div className="new-complaint-page">

                    <div className="complaint-form-card">
                        <div className="form-header">
                            <span className="header-icon">📝</span>
                            <div>
                                <h1>File a Complaint</h1>
                                <p>Describe your issue in detail</p>
                            </div>
                        </div>

                        {error && (
                            <div className="form-error">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <div className="form-group">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-input"
                                        placeholder="Brief summary of your complaint"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            {categories.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Priority</label>
                                        <select
                                            name="priority"
                                            className="form-select"
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >
                                            {priorities.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        placeholder="Explain your complaint in detail. Include relevant dates, names, and any other information that might help resolve the issue."
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Attachments</h3>
                                <p className="section-desc">Upload supporting documents or images (optional)</p>
                                <FileUpload files={files} setFiles={setFiles} maxFiles={5} />
                            </div>

                            <div className="form-section anon-section">
                                <label className="anon-toggle">
                                    <input
                                        type="checkbox"
                                        name="isAnonymous"
                                        checked={formData.isAnonymous}
                                        onChange={handleChange}
                                    />
                                    <div className="toggle-track">
                                        <div className="toggle-thumb"></div>
                                    </div>
                                    <div className="anon-text">
                                        <span className="anon-title">Submit Anonymously</span>
                                        <span className="anon-desc">Your identity will be hidden from faculty</span>
                                    </div>
                                </label>
                            </div>

                            <div className="form-actions">
                                <Link to="/dashboard" className="btn btn-secondary">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Complaint →'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <style>{`
                .page-nav {
                    margin-bottom: 8px;
                    padding-top: 4px;
                }

                .new-complaint-page {
                    max-width: 720px;
                    margin: 0 auto;
                    padding: 0 0 64px;
                }

                .back-link {
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: color 0.2s;
                }

                .back-link:hover {
                    color: var(--accent);
                }

                .complaint-form-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    padding: 40px;
                }

                .form-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 32px;
                    padding-bottom: 24px;
                    border-bottom: 1px solid var(--border-color);
                }

                .header-icon {
                    font-size: 40px;
                }

                .form-header h1 {
                    margin: 0;
                    font-size: 24px;
                    color: var(--text-main);
                }

                .form-header p {
                    margin: 4px 0 0;
                    color: var(--text-muted);
                    font-size: 14px;
                }

                .form-error {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #fef2f2;
                    color: #dc2626;
                    padding: 12px 16px;
                    border-radius: var(--radius-md);
                    margin-bottom: 24px;
                    font-size: 14px;
                    font-weight: 500;
                    border: 1px solid #fecaca;
                }

                .form-section {
                    margin-bottom: 32px;
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 4px;
                    color: var(--text-main);
                }

                .section-desc {
                    font-size: 13px;
                    color: var(--text-muted);
                    margin: 0 0 16px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .anon-section {
                    background: var(--bg-subtle);
                    padding: 20px;
                    border-radius: var(--radius-lg);
                    margin-bottom: 32px;
                }

                .anon-toggle {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    cursor: pointer;
                }

                .anon-toggle input {
                    display: none;
                }

                .toggle-track {
                    width: 48px;
                    height: 26px;
                    background: var(--border-color);
                    border-radius: 100px;
                    position: relative;
                    transition: background 0.25s ease;
                }

                .anon-toggle input:checked + .toggle-track {
                    background: var(--accent);
                }

                .toggle-thumb {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                    transition: transform 0.25s ease;
                }

                .anon-toggle input:checked + .toggle-track .toggle-thumb {
                    transform: translateX(22px);
                }

                .anon-text {
                    display: flex;
                    flex-direction: column;
                }

                .anon-title {
                    font-weight: 600;
                    color: var(--text-main);
                }

                .anon-desc {
                    font-size: 13px;
                    color: var(--text-muted);
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    padding-top: 24px;
                    border-top: 1px solid var(--border-color);
                }

                @media (max-width: 640px) {
                    .complaint-form-card {
                        padding: 24px;
                        border-radius: var(--radius-lg);
                    }

                    .form-row {
                        grid-template-columns: 1fr;
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .form-actions .btn {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default NewComplaint;
