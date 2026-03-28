import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../api/axios';

const AdminExports = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [section, setSection] = useState('All Sections');
    const [status, setStatus] = useState('All Status');
    const [isDownloading, setIsDownloading] = useState(false);

    const handleGenerateReport = async () => {
        try {
            setIsDownloading(true);
            const response = await api.get('/exports/complaints', {
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    section,
                    status
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `complaints_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to generate report');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleQuickExport = async (type) => {
        try {
            setIsDownloading(true);
            const endpoint = type === 'issues' ? '/exports/issues' : '/exports/complaints';
            const response = await api.get(endpoint, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Quick export error:', error);
            alert('Failed to export data');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="animate-fade-in p-8 h-full overflow-y-auto">
            <header className="mb-10">
                <h1 className="heading-font text-[28px] font-bold text-[var(--text-primary)] leading-tight">Exports</h1>
                <p className="geist-font text-[14px] text-[var(--text-secondary)] mt-1">Download complaint insights and reports for academic review</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                <section>
                    <h2 className="heading-font text-[18px] font-bold text-[var(--text-primary)] mb-6">Custom Export</h2>
                    <div className="bg-white border border-[var(--card-border)] rounded-[12px] p-6 shadow-sm">
                        <form className="flex flex-col gap-5 max-w-[480px]">
                            <div className="flex flex-col gap-2">
                                <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Date Range</label>
                                <div className="flex gap-2 items-center">
                                    <div className="relative flex-1">
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            selectsStart
                                            startDate={startDate}
                                            endDate={endDate}
                                            className="w-full h-[42px] pl-10 pr-4 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none"
                                        />
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[18px]">calendar_today</span>
                                    </div>
                                    <span className="text-[var(--text-muted)]">to</span>
                                    <div className="relative flex-1">
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            selectsEnd
                                            startDate={startDate}
                                            endDate={endDate}
                                            minDate={startDate}
                                            className="w-full h-[42px] pl-10 pr-4 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none"
                                        />
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[18px]">calendar_today</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Section</label>
                                <select 
                                    value={section}
                                    onChange={(e) => setSection(e.target.value)}
                                    className="h-[42px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none"
                                >
                                    <option>All Sections</option>
                                    <option>Section A</option>
                                    <option>Section B</option>
                                    <option>Section C</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Status</label>
                                <select 
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="h-[42px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none"
                                >
                                    <option>All Status</option>
                                    <option>Resolved</option>
                                    <option>Pending</option>
                                    <option>In Progress</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleGenerateReport}
                                disabled={isDownloading}
                                className="mt-2 w-[240px] h-[44px] bg-[var(--primary-orange)] text-white heading-font text-[14px] font-bold rounded-[8px] hover:brightness-110 transition-all shadow-sm border-none cursor-pointer disabled:opacity-50" 
                                type="button"
                            >
                                {isDownloading ? 'Generating...' : 'Generate Report'}
                            </button>
                        </form>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-2">
                        <p className="geist-font text-[12px] text-[var(--text-muted)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">info</span>
                            Exports will be downloaded as CSV files
                        </p>
                        <p className="geist-font text-[12px] text-[var(--text-muted)] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">analytics</span>
                            Data includes complaint trends for HOD review
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="heading-font text-[18px] font-bold text-[var(--text-primary)] mb-6">Quick Exports</h2>
                    <div className="flex flex-col gap-3">
                        {[
                            { title: 'Most Reported Issues', subtitle: 'Top complaint categories', type: 'issues' },
                            { title: 'Student Complaint Logs', subtitle: 'All complaints with student data', type: 'logs' },
                            { title: 'Resolution Performance', subtitle: 'Avg resolution time & trends', type: 'performance' }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-[var(--card-border)] rounded-[12px] p-4 flex flex-col gap-3 shadow-sm hover:border-[var(--primary-orange)] transition-colors group">
                                <div>
                                    <h3 className="heading-font text-[14px] font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-orange)] transition-colors">{item.title}</h3>
                                    <p className="geist-font text-[12px] text-[var(--text-secondary)] mt-0.5">{item.subtitle}</p>
                                </div>
                                <button 
                                    onClick={() => handleQuickExport(item.type)}
                                    disabled={isDownloading}
                                    className="flex items-center justify-center gap-2 w-full h-[36px] border border-[#E6E0D9] bg-white hover:bg-gray-50 text-[var(--text-primary)] text-[13px] font-medium rounded-[8px] transition-all cursor-pointer border-solid"
                                >
                                    <span className="material-symbols-outlined text-[18px]">download</span>
                                    Export CSV
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminExports;
