import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const NewComplaint = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Academic',
        priority: 'Medium'
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/complaints', formData);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to submit complaint');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">File a Complaint</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded"
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        ></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Category</label>
                            <select
                                className="w-full px-4 py-2 border rounded"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Academic</option>
                                <option>Infrastructure</option>
                                <option>Mess</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Priority</label>
                            <select
                                className="w-full px-4 py-2 border rounded"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                        Submit Complaint
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 mt-2"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewComplaint;
