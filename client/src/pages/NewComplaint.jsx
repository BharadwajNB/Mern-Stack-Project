import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import FileUpload from '../components/FileUpload';

const NewComplaint = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        isAnonymous: false
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Academic', 'Infrastructure', 'Mess', 'Hostel', 'Library', 'Other'];
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

            navigate('/');
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
                <div className="page-header">
                    <h1>File New Complaint</h1>
                    <p>Describe your issue and we'll route it to the right department</p>
                </div>

                <div className="form-card card">
                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Brief summary of your complaint"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    {priorities.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Provide detailed information about your complaint..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Attachments</label>
                            <FileUpload onFilesChange={setFiles} maxFiles={5} />
                        </div>

                        <div className="anonymous-toggle">
                            <label className="toggle-label">
                                <span
                                    className={`toggle ${formData.isAnonymous ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                                />
                                <span className="toggle-text">
                                    <span className="toggle-icon">🎭</span>
                                    Submit Anonymously
                                </span>
                            </label>
                            {formData.isAnonymous && (
                                <p className="anonymous-hint">
                                    Your identity will be hidden from faculty and admins
                                </p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit Complaint'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <style>{`
                .page {
                    min-height: 100vh;
                }

                .page-header {
                    padding: 2rem 0;
                }

                .page-header h1 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.75rem;
                    color: var(--color-text-primary);
                }

                .page-header p {
                    margin: 0;
                    color: var(--color-text-secondary);
                }

                .form-card {
                    max-width: 700px;
                    margin-bottom: 2rem;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .alert-error {
                    background: #fee2e2;
                    color: #991b1b;
                    padding: 0.75rem 1rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1rem;
                    font-size: 0.875rem;
                }

                .anonymous-toggle {
                    background: var(--color-bg-secondary);
                    padding: 1rem;
                    border-radius: var(--radius-md);
                    margin-bottom: 1.5rem;
                }

                .toggle-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                }

                .toggle-text {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                    color: var(--color-text-primary);
                }

                .toggle-icon {
                    font-size: 1.25rem;
                }

                .anonymous-hint {
                    margin: 0.5rem 0 0 3.75rem;
                    font-size: 0.75rem;
                    color: var(--color-text-muted);
                }

                .form-actions {
                    display: flex;
                    gap: 0.75rem;
                    justify-content: flex-end;
                    padding-top: 1rem;
                    border-top: 1px solid var(--color-border);
                }

                @media (max-width: 640px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default NewComplaint;
