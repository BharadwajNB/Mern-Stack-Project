import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NewComplaint = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        priority: 'Low',
        files: [],
        isAnonymous: false
    });

    const categories = ['Academic', 'Administrative', 'Infrastructure', 'Hostel', 'Library', 'Technical', 'Financial', 'Other'];

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (name === 'file') {
            if (files[0]) {
                setFormData(prev => ({ ...prev, files: [...prev.files, files[0]] }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const removeFile = (idx) => {
        setFormData(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }));
    };

    const nextStep = (e) => {
        if (e) e.preventDefault();
        if (currentStep === 1) {
            if (!formData.title) return setError('Please enter a complaint title');
            if (!formData.category) return setError('Please select a category');
            setError('');
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (!formData.description) return setError('Please provide a description');
            setError('');
            setCurrentStep(3);
        }
    };

    const prevStep = () => {
        setError('');
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('description', formData.description);
            data.append('priority', formData.priority);
            if (formData.files.length > 0) data.append('file', formData.files[0]);
            data.append('isAnonymous', formData.isAnonymous);

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

    const getFileIcon = (name) => {
        const ext = name.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return { icon: 'description', color: 'text-red-500' };
        if (['jpg', 'jpeg', 'png'].includes(ext)) return { icon: 'image', color: 'text-blue-500' };
        if (['xlsx', 'xls', 'csv'].includes(ext)) return { icon: 'table_chart', color: 'text-green-600' };
        return { icon: 'attach_file', color: 'text-[var(--text-muted)]' };
    };

    return (
        <div className="animate-fade-in">
            <div className="min-h-screen">
                    {/* ── HEADER ── */}
                    <header className="mb-6 flex flex-col gap-2">
                        <Link to="/dashboard" className="text-[var(--primary-orange)] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity no-underline">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Dashboard
                        </Link>
                        <div>
                            <h2 className="heading-font text-[40px] font-bold leading-none text-[var(--text-primary)]">
                                Raise a New <span className="text-[var(--primary-orange)]">Complaint</span>
                            </h2>
                            <p className="text-[var(--text-secondary)] text-[14px] leading-tight mt-1 font-normal geist-font">
                                Fill in the details below to submit your issue for review.
                            </p>
                        </div>
                    </header>

                    {/* ── WIZARD CARD ── */}
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <div className="bg-white border-[1.5px] border-[var(--card-border)] rounded-[16px] overflow-hidden shadow-sm">
                            {/* Step Indicator */}
                            <div className="bg-[#fafafa] border-b border-[var(--card-border)] px-8 py-6">
                                <div className="flex items-center justify-between">
                                    {/* Step 1 */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${
                                            currentStep > 1
                                                ? 'bg-[#1c1917] text-white'
                                                : currentStep === 1
                                                ? 'bg-[var(--primary-orange)] text-white'
                                                : 'border-2 border-[var(--card-border)] text-[var(--text-secondary)]'
                                        }`}>
                                            {currentStep > 1
                                                ? <span className="material-symbols-outlined text-[18px]">check</span>
                                                : '1'}
                                        </div>
                                        <span className={`text-[15px] font-medium ${
                                            currentStep === 1 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                        }`}>General Info</span>
                                    </div>
                                    <div className={`step-line ${currentStep > 1 ? 'active' : ''}`}></div>

                                    {/* Step 2 */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${
                                            currentStep > 2
                                                ? 'bg-[#1c1917] text-white'
                                                : currentStep === 2
                                                ? 'bg-[var(--primary-orange)] text-white'
                                                : 'border-2 border-[var(--card-border)] text-[var(--text-secondary)]'
                                        }`}>
                                            {currentStep > 2
                                                ? <span className="material-symbols-outlined text-[18px]">check</span>
                                                : '2'}
                                        </div>
                                        <span className={`text-[15px] font-medium ${
                                            currentStep === 2 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                        }`}>Details</span>
                                    </div>
                                    <div className={`step-line ${currentStep > 2 ? 'active' : ''}`}></div>

                                    {/* Step 3 */}
                                    <div className={`flex items-center gap-3 ${currentStep < 3 ? 'opacity-40' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[14px] ${
                                            currentStep === 3
                                                ? 'bg-[var(--primary-orange)] text-white'
                                                : 'border-2 border-[var(--card-border)] text-[var(--text-secondary)]'
                                        }`}>3</div>
                                        <span className={`text-[15px] font-medium ${
                                            currentStep === 3 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                                        }`}>Evidence</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="mx-8 mt-6 p-3 bg-red-50 text-red-600 text-xs font-medium rounded-[10px] border border-red-100 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">error</span> {error}
                                    </div>
                                )}

                                {/* ═══ STEP 1: General Info ═══ */}
                                {currentStep === 1 && (
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="heading-font text-[18px] font-bold text-[var(--text-primary)]">General Information</h3>
                                            <span className="material-symbols-outlined text-[var(--primary-orange)]">expand_less</span>
                                        </div>

                                        <div className="space-y-5">
                                            {/* Title */}
                                            <div className="space-y-1.5">
                                                <label className="geist-font text-[13px] font-medium text-[#57534e]">Complaint Title</label>
                                                <input type="text" name="title" value={formData.title} onChange={handleChange}
                                                    className="w-full bg-[var(--bg-color)]/30 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[14px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] placeholder:text-[#a8a29e] transition-all outline-none"
                                                    placeholder="e.g., Library AC malfunction"/>
                                                <p className="text-xs text-[#a8a29e] leading-none geist-font">Keep the title short and descriptive.</p>
                                            </div>

                                            {/* Category */}
                                            <div className="space-y-1.5">
                                                <label className="geist-font text-[13px] font-medium text-[#57534e]">Category</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined text-[16px] text-[#a8a29e] absolute left-3 top-1/2 pointer-events-none" style={{transform: 'translateY(-50%)'}}>category</span>
                                                    <select name="category" value={formData.category} onChange={handleChange}
                                                        className="w-full bg-[var(--bg-color)]/30 border border-[var(--card-border)] rounded-xl pl-10 pr-4 py-3 text-[14px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] appearance-none cursor-pointer transition-all outline-none">
                                                        <option value="">Select a category</option>
                                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                    <span className="material-symbols-outlined text-[16px] text-[#a8a29e] absolute right-3 top-1/2 pointer-events-none" style={{transform: 'translateY(-50%)'}}>expand_more</span>
                                                </div>
                                            </div>

                                            {/* Tips Accordion */}
                                            <div className="bg-[#f7f3ee]/50 rounded-xl p-4 border border-[var(--card-border)]/50">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[14px]">💡</span>
                                                    <span className="geist-font text-[13px] font-medium text-[var(--text-primary)]">Tips for a good complaint</span>
                                                    <span className="material-symbols-outlined text-[#a8a29e] ml-auto text-[18px]">expand_more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Collapsed Step 1 header (shown when on step 2 or 3) */}
                                {currentStep > 1 && (
                                    <div className="px-8 py-4 bg-[#fafafa]/50 border-b border-[#f5f0eb]">
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep(1)}>
                                            <h3 className="geist-font text-[15px] font-medium text-[var(--text-secondary)]">
                                                Step 1: General Information
                                            </h3>
                                            <span className="material-symbols-outlined text-[#a8a29e] text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ STEP 2: Description ═══ */}
                                {currentStep === 2 && (
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="heading-font text-[18px] font-bold text-[var(--text-primary)]">Detailed Description</h3>
                                            <span className="material-symbols-outlined text-[var(--primary-orange)]">expand_less</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                            <div className="md:col-span-8 space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="geist-font text-[13px] font-medium text-[#57534e]">Description</label>
                                                    <textarea name="description" value={formData.description} onChange={handleChange}
                                                        className="w-full bg-[var(--bg-color)]/30 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[14px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] placeholder:text-[#a8a29e] transition-all min-h-[220px] resize-none outline-none"
                                                        placeholder="Describe your issue in detail..."/>
                                                    <p className="text-xs text-[#a8a29e] leading-none geist-font">Please be as specific as possible to help us resolve this faster.</p>
                                                </div>
                                            </div>
                                            <div className="md:col-span-4 space-y-6">
                                                {/* Priority */}
                                                <div className="space-y-2">
                                                    <label className="geist-font text-[13px] font-medium text-[#57534e]">Priority Level</label>
                                                    <div className="flex p-1 bg-[#f7f3ee] rounded-xl">
                                                        {['Low', 'Med', 'High'].map(p => {
                                                            const val = p === 'Med' ? 'Medium' : p;
                                                            return (
                                                                <button key={p} type="button"
                                                                    onClick={() => setFormData(prev => ({...prev, priority: val}))}
                                                                    className={`flex-1 text-center py-2 text-[12px] font-medium cursor-pointer rounded-lg transition-all border-none ${
                                                                        formData.priority === val
                                                                        ? 'bg-white text-[var(--primary-orange)] shadow-sm'
                                                                        : 'text-[#78716c] bg-transparent'
                                                                    }`}>{p}</button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                {/* Writing Tips */}
                                                <div className="bg-[#f7f3ee]/50 rounded-xl p-4 border border-[var(--card-border)]/50">
                                                    <p className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2 geist-font">Writing Tips</p>
                                                    <ul className="space-y-3 list-none p-0 m-0">
                                                        {[
                                                            'Be clear and specific about the incident.',
                                                            'Include relevant details like location or time.',
                                                            'Mention any previous attempts to resolve it.'
                                                        ].map((tip, i) => (
                                                            <li key={i} className="flex gap-2 items-start">
                                                                <div className="w-1 h-1 rounded-full bg-[var(--primary-orange)] mt-1.5 flex-shrink-0"></div>
                                                                <p className="text-xs text-[#78716c] leading-tight font-normal geist-font">{tip}</p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Collapsed Step 2 header (shown when on step 3) */}
                                {currentStep === 3 && currentStep > 2 && (
                                    <div className="px-8 py-4 bg-[#fafafa]/50 border-b border-[#f5f0eb]">
                                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setCurrentStep(2)}>
                                            <h3 className="geist-font text-[15px] font-medium text-[var(--text-secondary)]">
                                                Step 1 & 2: Completed
                                            </h3>
                                            <span className="material-symbols-outlined text-[#a8a29e] text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                )}

                                {/* Locked Step 3 (shown when on step 2) */}
                                {currentStep === 2 && (
                                    <div className="px-8 py-5 opacity-40 bg-[#fafafa]">
                                        <div className="flex justify-between items-center">
                                            <h3 className="heading-font text-[16px] font-bold text-[var(--text-primary)]">Step 3: Upload Evidence</h3>
                                            <span className="material-symbols-outlined text-[#a8a29e]">lock</span>
                                        </div>
                                    </div>
                                )}

                                {/* Locked Steps 2 & 3 (shown when on step 1) */}
                                {currentStep === 1 && (
                                    <>
                                        <div className="px-8 py-5 opacity-40 bg-[#fafafa] border-t border-[#f5f0eb]">
                                            <div className="flex justify-between items-center">
                                                <h3 className="heading-font text-[16px] font-bold text-[var(--text-primary)]">Step 2: Detailed Description</h3>
                                                <span className="material-symbols-outlined text-[#a8a29e]">lock</span>
                                            </div>
                                        </div>
                                        <div className="px-8 py-5 opacity-40 bg-[#fafafa] border-t border-[#f5f0eb]">
                                            <div className="flex justify-between items-center">
                                                <h3 className="heading-font text-[16px] font-bold text-[var(--text-primary)]">Step 3: Upload Evidence</h3>
                                                <span className="material-symbols-outlined text-[#a8a29e]">lock</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* ═══ STEP 3: Upload Evidence ═══ */}
                                {currentStep === 3 && (
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="heading-font text-[18px] font-bold text-[var(--text-primary)]">Upload Evidence</h3>
                                            <span className="material-symbols-outlined text-[var(--primary-orange)]">expand_less</span>
                                        </div>
                                        <div className="grid grid-cols-12 gap-6">
                                            {/* Uploaded Files */}
                                            <div className="col-span-6">
                                                <label className="geist-font text-[13px] font-medium text-[#57534e] mb-3 block">Uploaded Files</label>
                                                {formData.files.length > 0 ? (
                                                    <div className="border border-[var(--card-border)] rounded-xl overflow-hidden divide-y divide-[#f5f0eb]">
                                                        {formData.files.map((f, i) => {
                                                            const fi = getFileIcon(f.name);
                                                            return (
                                                                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                                                                    <span className={`material-symbols-outlined text-lg ${fi.color}`}>{fi.icon}</span>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="geist-font text-[13px] font-medium text-[var(--text-primary)] truncate">{f.name}</p>
                                                                        <p className="geist-font text-[11px] text-[var(--text-muted)]">{(f.size / 1024).toFixed(0)} KB</p>
                                                                    </div>
                                                                    <button type="button" onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 transition-colors border-none bg-transparent cursor-pointer">
                                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="border border-[var(--card-border)] rounded-xl p-6 text-center">
                                                        <p className="geist-font text-[13px] text-[var(--text-muted)]">No files uploaded yet</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Drop Zone */}
                                            <div className="col-span-6">
                                                <label className="geist-font text-[13px] font-medium text-[#57534e] mb-3 block">Add New Evidence</label>
                                                <div className="border-2 border-dashed border-[var(--card-border)] rounded-xl p-8 text-center hover:border-[var(--primary-orange)]/50 transition-all cursor-pointer relative group">
                                                    <input type="file" name="file" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                                                    <span className="material-symbols-outlined text-[28px] text-[var(--text-muted)] mb-2 group-hover:text-[var(--primary-orange)] transition-colors block">upload</span>
                                                    <p className="geist-font text-[13px] font-medium text-[var(--text-primary)]">Drag & drop files here</p>
                                                    <p className="geist-font text-[11px] text-[var(--text-muted)] mt-1">or click to upload</p>
                                                    <p className="geist-font text-[11px] text-[var(--text-muted)] mt-3">Support for PNG, JPG, PDF<br/>up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── FOOTER BUTTONS ── */}
                                <div className="p-8 bg-white flex justify-between items-center border-t border-[#f5f0eb]">
                                    <button type="button" onClick={() => navigate('/dashboard')}
                                        className="px-5 py-2.5 rounded-xl border border-[var(--card-border)] text-[#78716c] font-bold text-[13px] uppercase tracking-wider hover:bg-[var(--bg-color)] transition-colors bg-white cursor-pointer">
                                        Cancel
                                    </button>
                                    <div className="flex gap-3">
                                        {currentStep > 1 && (
                                            <button type="button" onClick={prevStep}
                                                className="px-6 py-2.5 rounded-xl border border-[var(--card-border)] text-[#78716c] font-bold text-[13px] uppercase tracking-wider hover:bg-[var(--bg-color)] transition-colors flex items-center gap-2 bg-white cursor-pointer">
                                                <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                                            </button>
                                        )}
                                        <button 
                                            type={currentStep < 3 ? "button" : "submit"}
                                            onClick={currentStep < 3 ? (e) => { e.preventDefault(); nextStep(); } : undefined}
                                            disabled={loading}
                                            className="bg-[var(--primary-orange)] text-white px-8 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wider flex items-center gap-2 hover:brightness-110 transition-all shadow-sm border-none cursor-pointer disabled:opacity-50"
                                        >
                                            {loading ? 'Submitting…' : currentStep < 3 ? 'Next Step' : 'Submit Complaint'}
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ── FOOTER ── */}
                    <footer className="mt-8 text-center">
                        <p className="geist-font text-[11px] text-[#a8a29e] uppercase tracking-[0.1em] font-medium">SERVIO System Security • Managed by University IT</p>
                    </footer>
            </div>
        </div>
    );
};

export default NewComplaint;
