import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const NewComplaint = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
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

    const categories = ['Academic', 'Administrative', 'Infrastructure', 'Hostel', 'Library', 'Technical', 'Financial', 'Other'];
    const priorities = ['Low', 'Medium', 'High'];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            files.forEach(file => data.append('attachments', file));

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

    const nextStep = () => {
        if (step === 1 && !formData.title) return setError('Title is required');
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content bg-[var(--bg-app)]">
                <div className="max-w-[1000px] mx-auto">
                    {/* Header/Stepper */}
                    <div className="mb-10 text-center">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Raise New Complaint</h2>
                        <div className="flex items-center justify-center gap-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step === s ? 'bg-[var(--primary)] text-white shadow-md' : 
                                        step > s ? 'bg-green-500 text-white' : 'bg-white border border-[var(--border-subtle)] text-[var(--text-muted)]'
                                    }`}>
                                        {step > s ? '✓' : s}
                                    </div>
                                    <span className={`text-xs font-semibold ${step === s ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                        {s === 1 ? 'General Info' : s === 2 ? 'Details' : 'Evidence'}
                                    </span>
                                    {s < 3 && <div className="w-12 h-[1px] bg-[var(--border-subtle)]"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Form Card */}
                        <div className="lg:col-span-2 bg-white border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 shadow-sm">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                                        {step === 1 ? 'General Information' : step === 2 ? 'Complaint Details' : 'Supporting Evidence'}
                                    </h3>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Please provide accurate information for faster resolution.</p>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-1">Step {step} of 3</span>
                            </div>

                            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-100 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span> {error}
                            </div>}

                            <form onSubmit={(e) => e.preventDefault()}>
                                {step === 1 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Subject Title</label>
                                            <input 
                                                type="text" name="title" value={formData.title} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-sm transition-all"
                                                placeholder="e.g., Library noise violation in Silent Zone B"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Grievance Category</label>
                                            <select 
                                                name="category" value={formData.category} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-sm transition-all appearance-none"
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Detailed Description</label>
                                            <textarea 
                                                name="description" value={formData.description} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-sm transition-all min-h-[160px]"
                                                placeholder="Please explain the situation in detail..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Priority Level</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {priorities.map(p => (
                                                    <button
                                                        key={p} type="button"
                                                        onClick={() => setFormData(prev => ({...prev, priority: p}))}
                                                        className={`py-3 rounded-[var(--radius-md)] text-xs font-bold transition-all border ${
                                                            formData.priority === p 
                                                            ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                                                            : 'bg-white text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--primary)]'
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 animate-fade-in text-center">
                                        <div className="border-2 border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-12 bg-gray-50 hover:bg-blue-50/50 hover:border-[var(--primary)] transition-all cursor-pointer relative group">
                                            <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                            <span className="material-symbols-outlined text-[var(--text-muted)] text-4xl mb-4 group-hover:text-[var(--primary)] transition-colors">cloud_upload</span>
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">Click to upload or drag and drop</p>
                                            <p className="text-xs text-[var(--text-muted)] mt-1">PDF, PNG, JPG (Max 5MB each)</p>
                                        </div>
                                        {files.length > 0 && (
                                            <div className="text-left bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1d4ed8] mb-2">Attached Files</p>
                                                <ul className="space-y-1">
                                                    {files.map((f, i) => (
                                                        <li key={i} className="text-xs text-[#1e3a8a] flex items-center justify-between">
                                                            <span>{f.name}</span>
                                                            <span className="text-[10px] opacity-60">{(f.size/1024).toFixed(1)} KB</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100 text-left">
                                            <input type="checkbox" name="isAnonymous" checked={formData.isAnonymous} onChange={handleChange} className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]" />
                                            <div>
                                                <p className="text-xs font-bold text-amber-900">Submit Anonymously</p>
                                                <p className="text-[10px] text-amber-700">Your details will be hidden from the resolving authority.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex justify-between items-center">
                                    <button 
                                        type="button" onClick={step === 1 ? () => navigate('/dashboard') : prevStep}
                                        className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {step === 1 ? 'Cancel' : '← Previous Step'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={step === 3 ? handleSubmit : nextStep}
                                        disabled={loading}
                                        className="bg-[var(--text-primary)] text-white px-8 py-3 rounded-[var(--radius-md)] text-sm font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : step === 3 ? 'Finalize & Submit' : 'Continue to Next Step'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Helper Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-zinc-900 text-white p-6 rounded-[var(--radius-lg)] shadow-lg">
                                <h4 className="flex items-center gap-2 text-sm font-bold mb-4">
                                    <span className="material-symbols-outlined text-[var(--primary)] text-lg">lightbulb</span>
                                    Writing tips
                                </h4>
                                <ul className="space-y-3">
                                    <li className="text-[11px] leading-relaxed text-zinc-400">
                                        <strong className="text-zinc-200 block mb-0.5">Be Specific</strong>
                                        Mention exact dates, times, and locations where the incident occurred.
                                    </li>
                                    <li className="text-[11px] leading-relaxed text-zinc-400">
                                        <strong className="text-zinc-200 block mb-0.5">Keep it Objective</strong>
                                        Stick to the facts and avoid emotional language for faster processing.
                                    </li>
                                    <li className="text-[11px] leading-relaxed text-zinc-400">
                                        <strong className="text-zinc-200 block mb-0.5">Attach Evidence</strong>
                                        Photos or screenshots significantly speed up the verification process.
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="p-6 border border-[var(--border-subtle)] rounded-[var(--radius-lg)] bg-white text-center">
                                <p className="text-[11px] text-[var(--text-muted)] font-medium">Resolution Time</p>
                                <p className="text-lg font-bold text-[var(--text-primary)] mt-1">~48 Hours</p>
                                <p className="text-[10px] text-[var(--text-secondary)] mt-2">Expected average for <strong>{formData.category}</strong> category.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NewComplaint;

