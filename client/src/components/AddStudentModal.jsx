import { useState } from 'react';

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    section: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', email: '', studentId: '', section: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
      <div className="w-[480px] bg-white rounded-[12px] p-[20px] shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="heading-font text-[20px] font-bold text-[var(--text-primary)]">Add New Student</h2>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-[var(--text-muted)] hover:text-[var(--text-primary)] border-none bg-transparent cursor-pointer"
          >
            close
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-4 gap-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="h-[40px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none" 
              placeholder="Full name" 
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Email</label>
            <input 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="h-[40px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none" 
              placeholder="Email address" 
              type="email"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Student ID</label>
            <input 
              required
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="h-[40px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none" 
              placeholder="ID Number" 
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="geist-font text-[12px] font-semibold text-[var(--text-secondary)]">Section</label>
            <select 
              required
              value={formData.section}
              onChange={(e) => setFormData({...formData, section: e.target.value})}
              className="h-[40px] px-3 bg-[#FAFAFA] border border-[#E6E0D9] rounded-[8px] text-[13px] geist-font focus:ring-[var(--primary-orange)] focus:border-[var(--primary-orange)] outline-none"
            >
              <option value="">Select Section</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
            </select>
          </div>
          
          <div className="col-span-2 mt-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="h-[38px] px-5 geist-font text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="h-[38px] px-6 bg-[var(--primary-orange)] text-white geist-font text-[13px] font-bold rounded-[8px] hover:brightness-110 transition-all shadow-sm border-none cursor-pointer"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
