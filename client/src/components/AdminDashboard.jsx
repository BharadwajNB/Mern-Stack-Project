import FacultyDashboard from './FacultyDashboard';

const AdminDashboard = () => {
    // For now, Admin sees same view as Faculty (Management view)
    // In future, add User Management here.
    return (
        <div>
            <div className="bg-indigo-100 p-4 rounded mb-6 border-l-4 border-indigo-600">
                <h2 className="text-xl font-bold text-indigo-800">Admin Panel</h2>
                <p className="text-indigo-600">You have full access to all complaints.</p>
            </div>
            <FacultyDashboard />
        </div>
    );
};

export default AdminDashboard;
