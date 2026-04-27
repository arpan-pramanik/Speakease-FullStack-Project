import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IconLogout, IconFire, IconXP, IconAward, IconX } from './Icons';

export const ProfilePanel = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/login');
    };

    const stats = [
        { label: 'Current Streak', value: '7 Days', icon: <IconFire color="#ff4b4b" /> },
        { label: 'Total XP', value: '12,450', icon: <IconXP color="var(--accent-color)" /> },
        { label: 'Rank', value: 'Global #42', icon: <IconAward color="#ffd700" /> },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(5px)',
                            zIndex: 9100
                        }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '400px',
                            background: 'rgba(10, 10, 15, 0.95)',
                            backdropFilter: 'blur(30px)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                            padding: '3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            zIndex: 9101,
                            boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '30px', left: '30px',
                                background: 'none', border: 'none', color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}
                        >
                            <IconX size={24} />
                        </button>

                        {/* Top Profile Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, var(--accent-color), #00ffcc)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#050505',
                                    fontSize: '2.5rem',
                                    fontWeight: 900,
                                    marginBottom: '1.5rem',
                                    boxShadow: '0 0 30px rgba(196, 240, 0, 0.2)'
                                }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{user?.name}</h2>
                            <p style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700 }}>
                                Proficiency: Intermediate
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        padding: '1.5rem',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {stat.icon}
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</span>
                                    </div>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stat.value}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Logout Section */}
                        <div style={{ marginTop: 'auto' }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '1.2rem',
                                    borderRadius: '50px',
                                    background: 'rgba(255, 75, 75, 0.1)',
                                    color: '#ff4b4b',
                                    border: '1px solid rgba(255, 75, 75, 0.2)',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.8rem',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#ff4b4b';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 75, 75, 0.1)';
                                    e.currentTarget.style.color = '#ff4b4b';
                                }}
                            >
                                <IconLogout size={20} />
                                SIGN OUT SESSION
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
