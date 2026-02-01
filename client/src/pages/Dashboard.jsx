import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import FacultyDashboard from '../components/FacultyDashboard';
import AdminDashboard from '../components/AdminDashboard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="page">
            <Navbar />
            <main className="container">
                {user?.role === 'student' && <StudentDashboard />}
                {user?.role === 'faculty' && <FacultyDashboard />}
                {user?.role === 'admin' && <AdminDashboard />}
            </main>
        </div>
    );
};

export default Dashboard;
