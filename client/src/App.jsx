import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import ComplaintHistory from './pages/ComplaintHistory';
import Profile from './pages/Profile';
import AdminStudents from './pages/AdminStudents';
import AdminExports from './pages/AdminExports';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Private Routes wrapped in MainLayout */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaint/new" element={<NewComplaint />} />
        <Route path="/complaint/:id" element={<ComplaintDetail />} />
        <Route path="/history" element={<ComplaintHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/exports" element={<AdminExports />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
