import { useEffect, useState } from 'react';
import api from '../api/axios';

const FacultyDashboard = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/complaints');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/complaints/${id}`, { status: newStatus });
            fetchComplaints(); // Refresh
        } catch (err) {
            alert('Failed to update status');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Department Complaints</h2>
            <div className="grid gap-4">
                {complaints.map((c) => (
                    <div key={c._id} className="bg-white p-4 rounded shadow border-l-4 border-purple-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{c.title}</h3>
                                <p className="text-sm text-gray-500">By: {c.student?.name || 'Unknown'}</p>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={c.status}
                                    onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                                    className="border rounded p-1 text-sm"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-gray-600 mt-2">{c.description}</p>
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                            <span>Category: {c.category}</span>
                            <span>Priority: {c.priority}</span>
                        </div>
                    </div>
                ))}
                {complaints.length === 0 && <p className="text-gray-500">No complaints to show.</p>}
            </div>
        </div>
    );
};

export default FacultyDashboard;
