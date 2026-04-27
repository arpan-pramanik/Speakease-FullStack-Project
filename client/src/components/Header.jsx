import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { IconLogout, IconUser, IconMenu } from './Icons';
import { ProfilePanel } from './ProfilePanel';
import { useState } from 'react';

export const Header = ({ onToggleMenu }) => {
    const { user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);

    if (!user) return null;

    return (
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
                background: 'rgba(5, 5, 5, 0.2)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}
        >
            {/* Logo */}
            <Link to="/dashboard" style={{ textDecoration: 'none' }} className="interactive">
                <div style={{ display: 'flex', gap: '0.15em', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>
                    <span style={{ color: 'var(--text-color)' }}>SPEAK</span>
                    <span style={{ color: 'var(--accent-color)' }}>EASE</span>
                </div>
            </Link>

            {/* Profile & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ color: 'var(--text-color)', fontSize: '0.9rem', fontWeight: 600 }}>{user.name}</span>
                    <span style={{ color: 'var(--accent-color)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Student</span>
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
                        color: 'var(--bg-color)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 0 15px rgba(196, 240, 0, 0.3)'
                    }}
                >
                    {user.name?.charAt(0).toUpperCase()}
                </div>

                <button
                    onClick={handleLogout}
                    title="Logout"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ff4b4b'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    className="interactive"
                >
                    <IconLogout size={20} />
                </button>
            </div>
        </motion.header>
    );
};
