import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { useAudio } from '../context/AudioContext';
import { AIChat } from './AIChat';
import gsap from 'gsap';

export const Navigation = ({ isOpen, onToggle }) => {
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isAIMode, toggleAIMode } = useAIMode();
    const { isSoundOn, toggleSound } = useAudio();
    const navRef = useRef(null);

    const navItems = user ? [
        { title: 'Dashboard', path: '/dashboard', num: '01' },
        { title: 'Languages', path: '/languages', num: '02' },
        { title: 'Progress', path: '/progress', num: '03' },
        { title: 'Leaderboard', path: '/leaderboard', num: '04' },
    ] : [
        { title: 'Home', path: '/', num: '01' },
        { title: 'Login', path: '/login', num: '02' },
    ];

    const handleLogout = async () => { await logout(); navigate('/'); };

    useEffect(() => {
        if (isOpen && navRef.current) {
            gsap.fromTo('.nav-link-anim', 
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power4.out', delay: 0.2 }
            );
        }
    }, [isOpen]);

    return (
        <>
            {/* Sound Toggle Floating Button */}
            <button 
                onClick={toggleSound} 
                className="panel"
                style={{ position: 'fixed', bottom: 32, left: 32, zIndex: 900, width: 56, height: 56, borderRadius: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSoundOn ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
                {isSoundOn ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>}
            </button>

            {/* AI Chat Button */}
            {isAIMode && user && !showChat && (
                <button 
                    onClick={() => { setShowChat(true); isOpen && onToggle(); }} 
                    className="btn-primary"
                    style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 901, width: 56, height: 56, padding: 0, borderRadius: '12px' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </button>
            )}

            <AIChat isVisible={showChat && isAIMode} onClose={() => setShowChat(false)} />

            {/* Fullscreen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        ref={navRef}
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        style={{ position: 'fixed', inset: 0, background: 'var(--bg-base)', zIndex: 2000, display: 'flex', flexDirection: 'column', padding: '120px 4vw' }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '30vw', background: 'var(--bg-surface)', borderRight: 'var(--border-sharp)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.05em', marginBottom: 'auto' }}>SpeakEase</span>
                            
                            <div style={{ marginTop: 'auto' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>System Status</div>
                                {user && (
                                    <div className="panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ color: isAIMode ? 'var(--accent-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>AI SYS // {isAIMode ? 'ON' : 'OFF'}</span>
                                        <button onClick={toggleAIMode} style={{ width: 48, height: 24, background: isAIMode ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)', border: 'none', position: 'relative', cursor: 'pointer' }}>
                                            <motion.div animate={{ x: isAIMode ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500 }} style={{ width: 24, height: 24, background: isAIMode ? '#000' : 'var(--text-secondary)', position: 'absolute', top: 0, left: 0 }} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button onClick={onToggle} className="btn-secondary" style={{ position: 'absolute', top: 24, right: '4vw' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            CLOSE
                        </button>

                        <div style={{ marginLeft: '35vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '2vh' }}>
                            {navItems.map((item) => (
                                <div key={item.title} style={{ overflow: 'hidden' }}>
                                    <div className="nav-link-anim" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '1rem' }}>{item.num}</span>
                                        <Link 
                                            to={item.path} 
                                            onClick={onToggle} 
                                            style={{ 
                                                fontSize: 'clamp(3rem, 7vw, 6rem)', 
                                                fontWeight: 900, 
                                                fontFamily: 'var(--font-display)', 
                                                color: 'var(--text-primary)', 
                                                textTransform: 'uppercase',
                                                letterSpacing: '-0.04em',
                                                display: 'block',
                                                lineHeight: 1
                                            }} 
                                            onMouseEnter={(e) => {
                                                gsap.to(e.currentTarget, { color: 'var(--accent-primary)', x: 20, duration: 0.3 });
                                            }} 
                                            onMouseLeave={(e) => {
                                                gsap.to(e.currentTarget, { color: 'var(--text-primary)', x: 0, duration: 0.3 });
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {user && (
                            <div style={{ position: 'absolute', bottom: 40, right: '4vw', display: 'flex', gap: '24px' }}>
                                <button onClick={() => { handleLogout(); onToggle(); }} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '0.85rem' }}>SIGN OUT</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};