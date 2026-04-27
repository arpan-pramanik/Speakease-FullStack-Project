import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { IconLogout, IconUser, IconMenu } from './Icons';
import { ProfilePanel } from './ProfilePanel';
import { useState } from 'react';

export const Header = ({ onToggleMenu }) => {
    const { user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    if (!user) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    padding: '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 9000,
                    background: 'rgba(5, 5, 5, 0.4)',
                    backdropFilter: 'blur(15px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}
            >
                {/* Section 1: Logo (Left) */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }} className="interactive">
                        <div style={{ display: 'flex', gap: '0.15em', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
                            <span style={{ color: 'var(--text-color)' }}>SPEAK</span>
                            <span style={{ color: 'var(--accent-color)' }}>EASE</span>
                        </div>
                    </Link>
                </div>

                {/* Section 2: Menu Trigger (Center) */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onToggleMenu}
                        style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50px',
                            padding: '0.6rem 1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                        className="interactive"
                    >
                        <IconMenu size={16} color="var(--accent-color)" />
                        MENU
                    </button>
                </div>

                {/* Section 3: Profile (Right) */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.2rem' }}>
                    <div
                        onClick={() => setShowProfile(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            padding: '0.5rem 1rem',
                            borderRadius: '50px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        className="interactive"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <span style={{ color: 'var(--text-color)', fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                            <span style={{ color: 'var(--accent-color)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>LVL 12</span>
                        </div>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent-color), #00ffcc)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#050505',
                                fontWeight: 800,
                                fontSize: '1rem',
                                boxShadow: '0 0 15px rgba(196, 240, 0, 0.3)'
                            }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Profile Panel Overlay */}
            <ProfilePanel
                isOpen={showProfile}
                onClose={() => setShowProfile(false)}
            />
        </>
    );
};
