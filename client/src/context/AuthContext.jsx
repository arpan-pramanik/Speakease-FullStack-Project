import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, registerUser, loginUser, googleAuth } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = localStorage.getItem('speakease_token');
            if (!token) {
                setLoading(false);
                return;
            }
            const { data } = await getMe();
            setUser(data);
        } catch (error) {
            localStorage.removeItem('speakease_token');
            localStorage.removeItem('speakease_user');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await loginUser({ email, password });
            localStorage.setItem('speakease_token', data.token);
            localStorage.setItem('speakease_user', JSON.stringify(data.user));
            setUser(data.user);
            return true;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await registerUser({ name, email, password });
            localStorage.setItem('speakease_token', data.token);
            localStorage.setItem('speakease_user', JSON.stringify(data.user));
            setUser(data.user);
            return true;
        } catch (error) {
            console.error('Register error:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const googleLogin = async (credential) => {
        try {
            const { data } = await googleAuth(credential);
            localStorage.setItem('speakease_token', data.token);
            localStorage.setItem('speakease_user', JSON.stringify(data.user));
            setUser(data.user);
            return true;
        } catch (error) {
            console.error('Google login error:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('speakease_token');
        localStorage.removeItem('speakease_user');
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        localStorage.setItem('speakease_user', JSON.stringify({ ...user, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};
