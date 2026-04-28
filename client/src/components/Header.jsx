import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ProfilePanel } from './ProfilePanel';

export const Header = ({ onToggleMenu }) => {
    const { user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const { scrollY } = useScroll();
    
    // Hide header slightly on scroll down, show on scroll up
    const headerY = useTransform(scrollY, [0, 100], [0, -10]);
    const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);

    return (
        <>
            <motion.header
                style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    y: headerY,
                    opacity: headerOpacity,
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px 4vw',
                    background: 'linear-gradient(to bottom, rgba(17, 17, 18, 0.9), transparent)',
                    pointerEvents: 'none',
                }}
            >
                <div style={{ pointerEvents: 'auto' }}>
                    <Link to={user ? "/dashboard" : "/"} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
                            SpeakEase
                        </span>
                    </Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', pointerEvents: 'auto' }}>
                    {user && (
                        <button 
                            onClick={() => setShowProfile(true)} 
                            className="btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        >
                            <span style={{ color: 'var(--accent-primary)' }}>USR //</span> {user.name}
                        </button>
                    )}
                    <button onClick={onToggleMenu} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        <span>MENU</span>
                    </button>
                </div>
            </motion.header>

            <ProfilePanel isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </>
    );
};