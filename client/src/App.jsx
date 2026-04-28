import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudio } from './context/AudioContext';
import { useAuth } from './context/AuthContext';

import { Preloader } from './components/Preloader';
import { Scene } from './components/Scene';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Languages from './pages/Languages';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const location = { current: null };

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;
    return children;
};

const AnimatedRoutes = () => {
    const loc = useLocation();
    React.useEffect(() => {
        location.current = loc.pathname;
    }, [loc]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={loc.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{ minHeight: '100vh' }}
            >
                <Routes location={loc}>
                    <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/languages" element={<ProtectedRoute><Languages /></ProtectedRoute>} />
                    <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
                    <Route path="/lesson/:id" element={<ProtectedRoute><LessonDetail /></ProtectedRoute>} />
                    <Route path="/quiz/:id" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                    
                    {/* System Pages */}
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                    <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
                    <Route path="/privacy" element={<ProtectedRoute><Privacy /></ProtectedRoute>} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

export default function App() {
    const { playClickSound, playHoverSound } = useAudio();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive')) {
                playClickSound();
            }
        };
        const handleHover = (e) => {
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive')) {
                playHoverSound();
            }
        };

        document.addEventListener('click', handleClick);
        document.addEventListener('mouseover', handleHover);

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('mouseover', handleHover);
        };
    }, [playClickSound, playHoverSound]);

    return (
        <>
            <Preloader />
            <Scene />
            <Header onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
            <Navigation isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
            <AnimatedRoutes />
        </>
    );
}