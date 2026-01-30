import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import FacultyDashboard from '../components/FacultyDashboard';
import AdminDashboard from '../components/AdminDashboard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">AMSD Complaint System</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.name} ({user?.role})</span>
                    <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">
                        Logout
                    </button>
                </div>
            </nav>

            <main className="p-8">
                {user?.role === 'student' && <StudentDashboard />}
                {user?.role === 'faculty' && <FacultyDashboard />}
                {user?.role === 'admin' && <AdminDashboard />}
            </main>
        </div>
    );
};

export default Dashboard;
