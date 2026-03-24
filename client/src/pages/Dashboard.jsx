import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import FacultyDashboard from '../components/FacultyDashboard';
import AdminDashboard from '../components/AdminDashboard';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {user?.role === 'student' && <StudentDashboard />}
                {user?.role === 'faculty' && <FacultyDashboard />}
                {user?.role === 'admin' && <AdminDashboard />}
            </main>
        </div>
    );
};

export default Dashboard;
