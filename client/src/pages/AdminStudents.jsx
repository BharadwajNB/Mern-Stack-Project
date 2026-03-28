import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import AddStudentModal from '../components/AddStudentModal';

const AdminStudents = () => {
  const [groupedStudents, setGroupedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/admin/students');
      setGroupedStudents(res.data);
      // Expand all sections by default
      const initialExpanded = Object.keys(res.data).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setExpandedSections(initialExpanded);
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddStudent = async (formData) => {
    try {
      await api.post('/admin/student', formData);
      setIsModalOpen(false);
      fetchStudents();
      showToast('Student added & credentials generated');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding student');
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await api.post('/admin/bulk-upload', formData);
      showToast(res.data.message);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Bulk upload error');
    } finally {
      setLoading(false);
      e.target.value = ''; // Reset file input
    }
  };

  const showToast = (txt) => {
    setMessage(txt);
    setTimeout(() => setMessage(null), 3000);
  };

  const filteredGroups = Object.keys(groupedStudents).reduce((acc, section) => {
    const filtered = groupedStudents[section].filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.studentId?.toLowerCase().includes(search.toLowerCase())
    );
    if (filtered.length > 0) acc[section] = filtered;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <header className="flex justify-between items-end mb-8 pt-2">
        <div className="flex flex-col">
          <h1 className="heading-font text-[28px] font-bold text-[var(--text-primary)] leading-none tracking-tight">Students</h1>
          <p className="geist-font text-[14px] text-[var(--text-secondary)] mt-1.5 opacity-80">Manage students, assign sections, and generate login credentials</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            className="hidden" 
            accept=".csv"
          />
          <button 
            onClick={() => fileInputRef.current.click()}
            className="h-[36px] px-4 border border-[#E6E0D9] bg-white text-[var(--text-primary)] geist-font text-[13px] font-medium rounded-[8px] hover:bg-gray-50 transition-all border-solid cursor-pointer"
          >
            Bulk Upload
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-[36px] px-4 bg-[var(--primary-orange)] text-white geist-font text-[13px] font-medium rounded-[8px] hover:brightness-110 transition-all border-none cursor-pointer"
          >
            Add Student
          </button>
        </div>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[18px]">search</span>
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[280px] h-[36px] pl-10 pr-4 bg-white border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none" 
            placeholder="Search by name or ID" 
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {loading ? (
          <div className="py-20 text-center geist-font text-[var(--text-muted)] text-sm italic">Loading student database...</div>
        ) : Object.keys(filteredGroups).length === 0 ? (
          <div className="py-20 text-center geist-font text-[var(--text-muted)] text-sm italic">No students found.</div>
        ) : (
          Object.keys(filteredGroups).map(section => (
            <div key={section} className="bg-white border-[0.5px] border-[var(--card-border)] rounded-[12px] overflow-hidden mb-4 shadow-sm">
              <div 
                onClick={() => toggleSection(section)}
                className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-[var(--text-secondary)] transition-transform duration-200 ${expandedSections[section] ? 'rotate-0' : '-rotate-90'}`}>
                    keyboard_arrow_down
                  </span>
                  <h2 className="heading-font text-[16px] font-bold text-[var(--text-primary)] capitalize">
                    {section} <span className="ml-2 heading-font text-[14px] font-normal text-[var(--text-muted)]">({filteredGroups[section].length} Students)</span>
                  </h2>
                </div>
              </div>

              {expandedSections[section] && (
                <div className="border-t border-[var(--card-border)] overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left bg-[#FAFAFA] border-b border-[var(--card-border)] text-[var(--text-muted)]">
                        <th className="px-5 py-3 w-[40px]"><input className="rounded" type="checkbox" /></th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold">Student Name</th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold w-[120px]">Student ID</th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold w-[100px]">Section</th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold w-[120px]">Status</th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold">Credentials</th>
                        <th className="px-4 py-3 geist-font text-[11px] uppercase tracking-wider font-semibold text-right w-[100px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--card-border)]">
                      {filteredGroups[section].map(student => (
                        <tr key={student._id} className="bg-white hover:bg-[#FAF9F7] transition-colors group/row">
                          <td className="px-5 py-3"><input className="rounded" type="checkbox" /></td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="heading-font text-[13px] font-bold text-[var(--text-primary)]">{student.name}</span>
                              <span className="geist-font text-[12px] text-[var(--text-secondary)]">{student.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 geist-mono text-[11px] font-medium text-[var(--text-secondary)]">#{student.studentId || student._id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3 geist-font text-[13px] text-[var(--text-secondary)]">{student.section}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold geist-font uppercase ${
                              student.status === 'Active' ? 'bg-[#EAF4EC] text-[#2E7D4F]' : 'bg-[#FCECEA] text-[#9B2B2B]'
                            }`}>{student.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1">
                              <span className="geist-mono text-[11px] font-medium text-[var(--text-primary)] hover:text-[var(--primary-orange)] transition-colors cursor-pointer">{student.email.split('@')[0]}</span>
                              <button className="text-[11px] text-[var(--primary-orange)] font-semibold text-left border-none bg-transparent cursor-pointer p-0 hover:underline">Reset Password</button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[18px] text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text-primary)] transition-colors">edit</span>
                              <span className="material-symbols-outlined text-[18px] text-[#9B2B2B] cursor-pointer hover:brightness-125 transition-all">delete</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddStudent} 
      />

      {message && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-[#141414] text-white px-4 py-3 rounded-lg shadow-xl z-50 animate-bounce-up">
          <span className="material-symbols-outlined text-[#4ADE80]">check_circle</span>
          <span className="geist-font text-[13px] font-medium">{message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
