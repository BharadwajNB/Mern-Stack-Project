import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="animate-fade-in h-full">
            {user?.role === 'student' && <StudentDashboard />}
            {user?.role === 'admin' && <AdminDashboard />}
        </div>
    );
};

export default Dashboard;
