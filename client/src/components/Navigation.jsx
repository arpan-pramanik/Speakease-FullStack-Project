import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { useAudio } from '../context/AudioContext';
import { AIChat } from './AIChat';
import { IconSparkles, IconVolumeOn, IconVolumeOff } from './Icons';

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isAIMode, toggleAIMode, isTransitioning, transitionDirection } = useAIMode();
    const { isSoundOn, toggleSound } = useAudio();

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuVariants = {
        closed: { y: '-100%', opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
        open: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
    };

    const navLinks = user ? [
        { title: 'The Atlas', path: '/dashboard' },
        { title: 'Languages', path: '/languages' },
        { title: 'Resonance', path: '/progress' },
        { title: 'Network', path: '/leaderboard' },
    ] : [
        { title: 'Home', path: '/' },
        { title: 'The Portal', path: '/login' },
    ];

    return (
        <>
            {/* Menu Button */}
            <button
                onClick={toggleMenu}
                style={{
                    position: 'fixed', top: '40px', right: '40px',
                    zIndex: 9000, background: 'none',
                    color: 'var(--text-color)', border: 'none',
                    fontFamily: 'var(--font-display)', fontSize: '1rem',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', mixBlendMode: 'difference'
                }}
                className="interactive"
            >
                {isOpen ? 'Close' : 'Menu'}
            </button>

            {/* Sound Toggle Button */}
            <button
                onClick={toggleSound}
                style={{
                    position: 'fixed', bottom: '30px', left: '30px',
                    zIndex: 9000, background: 'none',
                    color: 'var(--text-color)', border: 'none',
                    cursor: 'pointer', mixBlendMode: 'difference',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '10px', opacity: 0.6,
                    transition: 'opacity 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                className="interactive"
            >
                {isSoundOn ? <IconVolumeOn size={24} /> : <IconVolumeOff size={24} />}
            </button>

            {/* Text Chat Shortcut Button */}
            {isAIMode && user && !showChat && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => { setShowChat(true); isOpen && toggleMenu(); }}
                    style={{
                        position: 'fixed', bottom: '30px', right: '30px',
                        zIndex: 9001, width: '60px', height: '60px',
                        borderRadius: '50%', border: '2px solid var(--accent-color)',
                        background: 'rgba(196, 240, 0, 0.1)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer', fontSize: '1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(196, 240, 0, 0.2)',
                        animation: 'pulse 2s infinite'
                    }}
                    className="interactive"
                >
                    <IconSparkles size={24} color="var(--accent-color)" />
                </motion.button>
            )}

            {/* AI Text Chat Panel */}
            <AIChat isVisible={showChat && isAIMode} onClose={() => setShowChat(false)} />

            {/* Fullscreen Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{
                            position: 'fixed', inset: 0,
                            background: isAIMode
                                ? 'rgba(5, 5, 15, 0.97)'
                                : 'rgba(5, 5, 5, 0.95)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 8999,
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center',
                            gap: '4vh'
                        }}
                        className="interactive"
                    >
                        {/* AI Mode Toggle */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                                    marginBottom: '3vh', padding: '1.2rem 2.5rem',
                                    background: isAIMode
                                        ? 'rgba(196, 240, 0, 0.08)'
                                        : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${isAIMode ? 'rgba(196, 240, 0, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    borderRadius: '60px',
                                    transition: 'all 0.5s'
                                }}
                            >
                                <span style={{
                                    color: isAIMode ? 'var(--accent-color)' : 'var(--text-muted)',
                                    fontFamily: 'var(--font-display)', fontSize: '0.85rem',
                                    letterSpacing: '0.15em', textTransform: 'uppercase',
                                    fontWeight: 700, transition: 'color 0.3s'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {isAIMode && !isTransitioning && <IconSparkles size={14} color="var(--accent-color)" />}
                                        {isTransitioning ? (
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                style={{ color: 'var(--accent-color)' }}
                                            >
                                                {transitionDirection === 'to_traditional'
                                                    ? 'SWITCHING BACK TO TRADITIONAL...'
                                                    : 'BOOTING UP INTO AI MODE...'}
                                            </motion.span>
                                        ) : (
                                            isAIMode ? 'AI MODE' : 'TRADITIONAL'
                                        )}
                                    </span>
                                </span>

                                {/* Toggle Switch */}
                                <button
                                    onClick={toggleAIMode}
                                    disabled={isTransitioning}
                                    style={{
                                        width: '70px', height: '36px',
                                        borderRadius: '18px', border: 'none',
                                        background: isAIMode
                                            ? 'linear-gradient(135deg, #c4f000, #00ffcc)'
                                            : 'rgba(255, 255, 255, 0.15)',
                                        cursor: isTransitioning ? 'wait' : 'pointer',
                                        position: 'relative',
                                        transition: 'background 0.5s',
                                        outline: 'none',
                                        boxShadow: isAIMode ? '0 0 25px rgba(196, 240, 0, 0.4)' : 'none'
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            x: isAIMode ? 34 : 0,
                                            rotate: isAIMode ? 360 : 0,
                                        }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        style={{
                                            width: '28px', height: '28px',
                                            borderRadius: '50%',
                                            background: isAIMode ? '#050505' : '#fff',
                                            position: 'absolute', top: '4px', left: '4px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem',
                                            boxShadow: isAIMode
                                                ? '0 0 10px rgba(196, 240, 0, 0.5)'
                                                : '0 2px 6px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        {isAIMode ? '✦' : '○'}
                                    </motion.div>
                                </button>
                            </motion.div>
                        )}

                        {/* Nav Links */}
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <Link
                                    to={link.path}
                                    onClick={toggleMenu}
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '6vw', fontWeight: 800,
                                        textTransform: 'uppercase',
                                        color: 'var(--text-color)',
                                        textDecoration: 'none',
                                        lineHeight: 0.9,
                                        WebkitTextStroke: '1px transparent',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = 'var(--accent-color)';
                                        e.currentTarget.style.transform = 'scale(1.05) skewX(-5deg)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--text-color)';
                                        e.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    {link.title}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Talk to Lara shortcut in menu */}
                        {isAIMode && user && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + navLinks.length * 0.1, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <button
                                    onClick={() => { toggleMenu(); navigate('/lara'); }}
                                    style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '6vw', fontWeight: 800,
                                        textTransform: 'uppercase',
                                        color: 'var(--accent-color)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', lineHeight: 0.9,
                                        transition: 'all 0.3s',
                                        textShadow: '0 0 30px rgba(196, 240, 0, 0.3)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05) skewX(-5deg)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <IconSparkles size={32} color="var(--accent-color)" /> TALK TO LARA
                                    </span>
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
