import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePanel = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => document.body.style.overflow = '';
    }, [isOpen]);

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    const stats = [
        { label: 'STREAK', value: user?.streakDays || 0, unit: 'DAYS' },
        { label: 'TOTAL XP', value: user?.totalXP?.toLocaleString() || '0', unit: 'XP' },
        { label: 'LEVEL', value: user?.level || 1, unit: 'LVL' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 9100
                        }}
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                        className="panel"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            maxWidth: '480px',
                            zIndex: 9101,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            borderRadius: 0,
                            borderLeft: '1px solid var(--accent-primary)',
                            borderTop: 'none',
                            borderBottom: 'none',
                            borderRight: 'none',
                            background: 'var(--bg-base)'
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '24px',
                            borderBottom: '1px solid var(--border-sharp)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg-surface)'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '4px' }}>OPERATIVE PROFILE</div>
                                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>{user?.name || 'UNKNOWN'}</h3>
                            </div>
                            <button onClick={onClose} style={{
                                background: 'transparent',
                                border: '1px solid var(--text-secondary)',
                                width: 40,
                                height: 40,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                                transition: 'var(--transition-snappy)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-error)'; e.currentTarget.style.borderColor = 'var(--accent-error)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--text-secondary)'; }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        {/* Profile Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '8px' }}>CONTACT</div>
                                <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>{user?.email}</div>
                            </div>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
                                {stats.map((stat, i) => (
                                    <div key={stat.label} style={{ padding: '20px 16px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-sharp)', display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>{stat.label}</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Menu Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>SYSTEM OPTIONS</div>
                                {[
                                    { label: 'SETTINGS', path: '/settings' },
                                    { label: 'HELP & SUPPORT', path: '/support' },
                                    { label: 'TERMS OF SERVICE', path: '/terms' },
                                    { label: 'PRIVACY POLICY', path: '/privacy' },
                                ].map((item) => (
                                    <button key={item.label} onClick={() => { onClose(); navigate(item.path); }} style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        background: 'var(--bg-surface)',
                                        border: '1px solid var(--border-sharp)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        color: '#fff',
                                        fontSize: '0.9rem',
                                        fontWeight: 800,
                                        transition: 'var(--transition-snappy)'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#000'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = '#fff'; }}
                                    >
                                        {item.label}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6"/>
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div style={{ padding: '24px', borderTop: '1px solid var(--border-sharp)', background: 'var(--bg-surface)' }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: 'transparent',
                                    border: '1px solid var(--accent-error)',
                                    color: 'var(--accent-error)',
                                    fontSize: '1rem',
                                    fontWeight: 900,
                                    cursor: 'pointer',
                                    transition: 'var(--transition-snappy)',
                                    textTransform: 'uppercase'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-error)'; e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-error)'; }}
                            >
                                TERMINATE SESSION
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};