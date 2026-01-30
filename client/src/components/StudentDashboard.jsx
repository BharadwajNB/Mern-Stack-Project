import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await api.get('/complaints');
                setComplaints(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComplaints();
    }, []);

    return (
        <div>
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">My Complaints</h2>
                <Link to="/complaint/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    + New Complaint
                </Link>
            </div>

            <div className="grid gap-4">
                {complaints.map((c) => (
                    <div key={c._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-lg">{c.title}</h3>
                            <span className={`px-2 py-1 rounded text-sm ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                    c.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                }`}>
                                {c.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">{c.description}</p>
                        <div className="mt-4 text-sm text-gray-500 flex justify-between">
                            <span>Category: {c.category}</span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {complaints.length === 0 && <p className="text-gray-500">No complaints found.</p>}
            </div>
        </div>
    );
};

export default StudentDashboard;
