import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';
import { IconGlobe, IconXP, IconBrain, IconSparkles, IconTrophy } from '../components/Icons';

const Dashboard = () => {
    const { user } = useAuth();
    const { isAIMode } = useAIMode();
    const [aiTip, setAiTip] = useState('');
    const [loadingTip, setLoadingTip] = useState(false);

    useEffect(() => {
        if (isAIMode && !aiTip) {
            setLoadingTip(true);
            askGemini(
                `Give me a short, motivating language learning tip in 1-2 sentences. Be creative and fun.`,
                'You are a language learning motivational assistant. Keep it very brief.'
            ).then(tip => setAiTip(tip)).catch(() => setAiTip('Keep learning daily — consistency beats intensity!')).finally(() => setLoadingTip(false));
        }
    }, [isAIMode]);

    const cards = [
        { title: 'Languages', desc: 'Choose a language to learn.', path: '/languages', icon: <IconGlobe size={28} color="var(--accent-color)" /> },
        { title: 'Progress', desc: 'View your learning statistics.', path: '/progress', icon: <IconXP size={28} color="var(--accent-color)" /> },
        { title: 'Leaderboard', desc: 'Compete with the community.', path: '/leaderboard', icon: <IconTrophy size={28} color="var(--accent-color)" /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section"
            style={{ justifyContent: 'center' }}
        >
            <div style={{ padding: '5vw' }}>
                <h3 style={{ color: 'var(--accent-color)', fontSize: '1.2rem', letterSpacing: '0.2em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAIMode && <IconSparkles size={20} color="var(--accent-color)" />}
                    USER: {user?.name?.toUpperCase() || 'STUDENT'}
                </h3>
                <h1 style={{ fontSize: '10vw', lineHeight: 0.85, marginBottom: '2rem', color: 'var(--text-color)' }}>
                    DASHBOARD
                </h1>

                {/* AI Tip Card */}
                {isAIMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card-ai"
                        style={{
                            padding: '1.5rem 2rem', marginBottom: '3rem',
                            display: 'flex', gap: '1rem', alignItems: 'flex-start'
                        }}
                    >
                        <IconBrain size={24} color="var(--accent-color)" />
                        <div>
                            <h4 style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>AI INSIGHT</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                {loadingTip ? 'Generating insight...' : aiTip}
                            </p>
                        </div>
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {cards.map((card, i) => (
                        <motion.div key={card.title} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                            <Link to={card.path} className="glass-card-interactive" style={{
                                display: 'block', padding: '2rem',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <div style={{ marginBottom: '1rem' }}>{card.icon}</div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.title}</h2>
                                <p style={{ color: 'var(--text-muted)' }}>{card.desc}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
