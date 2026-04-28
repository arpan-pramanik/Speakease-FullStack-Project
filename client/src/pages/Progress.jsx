import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProgress } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await getProgress();
                setProgress(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProgress();
    }, []);

    const getAIAnalysis = async () => {
        if (!isAIMode || loadingAnalysis || !progress) return;
        setLoadingAnalysis(true);
        try {
            const result = await askGemini(
                `Analyze this progress: XP: ${progress.totalXP || 0}, Streak: ${progress.streakDays || 0}, Lessons: ${progress.completedLessons?.length || 0}, Quizzes: ${progress.quizScores?.length || 0}. Give advice.`,
                'You are a high-performance coach. Be direct and intense.'
            );
            setAiAnalysis(result);
        } catch {
            setAiAnalysis('MAINTAIN CURRENT TRAJECTORY.');
        } finally {
            setLoadingAnalysis(false);
        }
    };

    if (loading) {
        return <div className="preloader">LOADING METRICS...</div>;
    }

    const stats = [
        { label: 'TOTAL XP', value: progress?.totalXP || 0, color: 'var(--accent-primary)' },
        { label: 'STREAK', value: `${progress?.streakDays || 0} D`, color: '#fff' },
        { label: 'MODULES', value: progress?.completedLessons?.length || 0, color: '#fff' },
        { label: 'TRIALS', value: progress?.quizScores?.length || 0, color: '#fff' },
    ];

    return (
        <div className="page-container">
            <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}
                >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>PERFORMANCE METRICS</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>USER PROGRESS</h1>
                </motion.div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="panel"
                            style={{ padding: '32px', textAlign: 'left', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px' }}>{stat.label}</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Analysis */}
                {isAIMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginBottom: '40px' }}
                    >
                        {!aiAnalysis ? (
                            <button onClick={getAIAnalysis} className="btn-secondary">
                                {loadingAnalysis ? 'ANALYZING...' : 'REQUEST AI ANALYSIS'}
                            </button>
                        ) : (
                            <div className="panel" style={{ padding: '32px', border: '1px solid var(--accent-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000', background: 'var(--accent-primary)', padding: '4px 8px' }}>AI ANALYSIS</span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 500, lineHeight: 1.6 }}>{aiAnalysis}</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Badges */}
                {progress?.badges?.length > 0 && (
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#fff' }}>ACHIEVEMENTS</h2>
                        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                            {progress.badges.map((badge, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="panel"
                                    style={{ padding: '24px', minWidth: '200px' }}
                                >
                                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '8px', textTransform: 'uppercase' }}>{badge.name}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{badge.description}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Lessons */}
                {progress?.completedLessons?.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: '#fff' }}>COMPLETED MODULES</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {progress.completedLessons.map((cl, i) => (
                                <div key={i} className="panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{cl.lessonId?.title || `MODULE ${i + 1}`}</span>
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 900, fontSize: '1.2rem' }}>+{cl.xpEarned || 0} XP</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Progress;