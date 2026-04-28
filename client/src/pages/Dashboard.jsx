import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';

const Dashboard = () => {
    const { user } = useAuth();
    const { isAIMode } = useAIMode();
    const [aiTip, setAiTip] = useState('');
    const [loadingTip, setLoadingTip] = useState(false);

    useEffect(() => {
        if (isAIMode && !aiTip) {
            setLoadingTip(true);
            askGemini('Provide a direct, one-sentence language acquisition strategy.', 'Be direct, no fluff.').then(setAiTip).catch(() => setAiTip('MAINTAIN CONSISTENCY IN ALL MODULES.')).finally(() => setLoadingTip(false));
        }
    }, [isAIMode]);

    const quickActions = [
        { title: 'MODULES', desc: 'SELECT TARGET', path: '/languages', icon: 'M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6zM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2zM14 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z' },
        { title: 'METRICS', desc: 'VIEW PERFORMANCE', path: '/progress', icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
        { title: 'RANKINGS', desc: 'GLOBAL STANDINGS', path: '/leaderboard', icon: 'M12 2l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z' },
    ];

    const stats = [
        { label: 'STREAK', value: user?.streakDays || 0, unit: 'DAYS' },
        { label: 'TOTAL XP', value: user?.totalXP || 0, unit: 'XP' },
        { label: 'CLEARANCE', value: user?.level || 1, unit: 'LVL' },
    ];

    const logs = [
        { time: '08:45', action: 'SYSTEM LOGIN', status: 'SUCCESS' },
        { time: 'YESTERDAY', action: 'SPANISH MODULE 1', status: 'CLEARED' },
    ];

    return (
        <div className="page-container">
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>OPERATIVE LOGGED IN</span>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', marginTop: '4px' }}>{user?.name?.toUpperCase() || 'UNKNOWN'}</h1>
                    </div>
                </motion.div>

                {/* AI Insight (if active) */}
                {isAIMode && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '24px', padding: '16px 24px', borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-surface)' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.1em', marginBottom: '4px' }}>AI DIRECTIVE</div>
                        <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>{loadingTip ? 'ANALYZING...' : aiTip}</p>
                    </motion.div>
                )}

                {/* PRIMARY ACTION ZONE */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: '24px' }}>
                    <Link to="/lessons" style={{ 
                        display: 'block',
                        background: 'var(--accent-primary)',
                        padding: '40px',
                        textDecoration: 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'transform var(--transition-snappy)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: '#000', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '8px' }}>TARGET LOCKED: {user?.selectedLanguage?.name?.toUpperCase() || 'AWAITING SELECTION'}</div>
                                <h2 style={{ color: '#000', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, margin: 0, lineHeight: 1 }}>INITIATE TRAINING</h2>
                            </div>
                            <div style={{ background: '#000', color: 'var(--accent-primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>
                        </div>
                        {/* Background structural lines */}
                        <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '40%', height: '200%', background: 'rgba(0,0,0,0.05)', transform: 'rotate(15deg)', zIndex: 1 }} />
                    </Link>
                </motion.div>

                {/* MAJOR OPTIONS NAVIGATION */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
                    {quickActions.map((action, i) => (
                        <motion.div key={action.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                            <Link to={action.path} className="panel" style={{ display: 'flex', flexDirection: 'column', padding: '32px', height: '100%', background: 'var(--bg-surface-elevated)' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" style={{ marginBottom: '24px' }}>
                                    <path d={action.icon} />
                                </svg>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>{action.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{action.desc}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* SECONDARY READOUTS (Stats & Logs) */}
                <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 900, marginBottom: '24px', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-sharp)', paddingBottom: '12px' }}>SYSTEM READOUT</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>
                    
                    {/* Stats */}
                    <div style={{ gridColumn: 'span 8', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                        {stats.map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>{stat.label}</div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                                    {stat.value}<span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginLeft: '6px' }}>{stat.unit}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Logs */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="panel" style={{ gridColumn: 'span 4', padding: '24px' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '16px' }}>RECENT LOGS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {logs.map((log, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'var(--accent-primary)', fontSize: '0.65rem', fontWeight: 800 }}>{log.time}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 800 }}>{log.status}</span>
                                    </div>
                                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{log.action}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;