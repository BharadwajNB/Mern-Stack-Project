import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // Default
        department: 'General'
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Role</label>
                        <select
                            name="role"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            value={formData.role}
                        >
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    {/* Show Department only if not student? Or just let everyone pick? Student usually has Dept too. */}
                    <div>
                        <label className="block mb-1 font-medium">Department</label>
                        <select
                            name="department"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={handleChange}
                            value={formData.department}
                        >
                            <option value="General">General</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Mechanical">Mechanical</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600">
                        Register
                    </button>
                </form>
                <div className="text-center">
                    <p>Already have an account? <Link to="/login" className="text-green-500">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
