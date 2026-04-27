import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAudio } from './context/AudioContext';

// Architecture Components
import { Preloader } from './components/Preloader';
import { LenisScroll } from './components/LenisScroll';
import { Navigation } from './components/Navigation';
import { InteractiveBackground } from './components/InteractiveBackground';
import { WaveTransition } from './components/WaveTransition';
import { Header } from './components/Header';

// Sequences (Pages)
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

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/languages" element={<Languages />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/lesson/:id" element={<LessonDetail />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </AnimatePresence>
    );
};

export default function App() {
    const { playClickSound, playHoverSound } = useAudio();

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
            <InteractiveBackground />
            <WaveTransition />
            <Header />
            <Navigation />

            <div id="dom-container">
                <LenisScroll>
                    <AnimatedRoutes />
                </LenisScroll>
            </div>
        </>
    );
}
