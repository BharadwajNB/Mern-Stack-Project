import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            sessionStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data) {
            sessionStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
