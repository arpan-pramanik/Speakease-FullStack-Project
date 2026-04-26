import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProgress } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';
import { IconXP, IconFire, IconAward, IconCheck, IconStar, IconSparkles, IconBrain } from '../components/Icons';

const Progress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            try { const res = await getProgress(); setProgress(res.data); }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProgress();
    }, []);

    const getAIAnalysis = async () => {
        if (!isAIMode || analysisLoading || !progress) return;
        setAnalysisLoading(true);
        try {
            const data = {
                totalXP: progress.totalXP || 0,
                streak: progress.streakDays || 0,
                lessonsCompleted: progress.completedLessons?.length || 0,
                quizzes: progress.quizScores?.length || 0,
                avgScore: progress.quizScores?.length ? Math.round(progress.quizScores.reduce((a, q) => a + (q.percentage || 0), 0) / progress.quizScores.length) : 0,
                badges: progress.badges?.length || 0,
            };
            const result = await askGemini(
                `Analyze this learner's progress and give personalized advice in 3-4 sentences:
XP: ${data.totalXP}, Streak: ${data.streak} days, Lessons: ${data.lessonsCompleted}, Quizzes: ${data.quizzes}, Avg quiz score: ${data.avgScore}%, Badges: ${data.badges}.
Be encouraging but also suggest areas for improvement.`,
                'You are a language learning coach. Be concise, encouraging, and data-driven.'
            );
            setAiAnalysis(result);
        } catch { setAiAnalysis('Keep up the great work! Consistency is key to language mastery.'); }
        finally { setAnalysisLoading(false); }
    };

    if (loading) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--accent-color)' }}>Syncing resonance...</h2>
        </motion.div>
    );

    const stats = [
        { label: 'TOTAL XP', value: progress?.totalXP || 0, icon: <IconXP size={22} color="var(--accent-color)" /> },
        { label: 'STREAK', value: `${progress?.streakDays || 0} days`, icon: <IconFire size={22} color="#ff6b35" /> },
        { label: 'LESSONS', value: progress?.completedLessons?.length || 0, icon: <IconCheck size={22} color="var(--accent-color)" /> },
        { label: 'QUIZZES', value: progress?.quizScores?.length || 0, icon: <IconStar size={22} color="#f0a000" /> },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}
        >
            <div style={{ padding: '5vw' }}>
                <h3 style={{ color: 'var(--accent-color)', fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isAIMode && <IconSparkles size={16} color="var(--accent-color)" />}
                    YOUR RESONANCE
                </h3>
                <h1 style={{ fontSize: '8vw', lineHeight: 0.85, marginBottom: '3rem' }}>PROGRESS</h1>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <motion.div key={stat.label} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                            style={{
                                padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '15px', textAlign: 'center'
                            }}>
                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{stat.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.15em' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Analysis */}
                {isAIMode && (
                    <div style={{ marginBottom: '3rem' }}>
                        {!aiAnalysis ? (
                            <button onClick={getAIAnalysis} disabled={analysisLoading} style={{
                                background: 'rgba(196,240,0,0.08)', border: '1px solid rgba(196,240,0,0.2)',
                                color: 'var(--accent-color)', padding: '0.8rem 2rem', borderRadius: '50px',
                                cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                <IconBrain size={16} color="var(--accent-color)" />
                                {analysisLoading ? 'Analyzing...' : 'Get AI Learning Analysis'}
                            </button>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                                padding: '1.5rem', background: 'rgba(196,240,0,0.03)',
                                border: '1px solid rgba(196,240,0,0.1)', borderRadius: '15px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <IconSparkles size={14} color="var(--accent-color)" />
                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>AI LEARNING ANALYSIS</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{aiAnalysis}</p>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Badges */}
                {progress?.badges?.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconAward size={16} color="var(--accent-color)" /> ACHIEVEMENTS
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {progress.badges.map((badge, i) => (
                                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring' }}
                                    style={{
                                        padding: '1rem 1.5rem', background: 'rgba(196,240,0,0.05)',
                                        border: '1px solid rgba(196,240,0,0.15)', borderRadius: '15px',
                                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'
                                    }}>
                                    <IconAward size={28} color="var(--accent-color)" />
                                    <span style={{ color: 'var(--text-color)', fontWeight: 700, fontSize: '0.9rem' }}>{badge.name}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{badge.description}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Lessons */}
                {progress?.completedLessons?.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconCheck size={16} color="var(--accent-color)" /> COMPLETED LESSONS
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {progress.completedLessons.map((cl, i) => (
                                <div key={i} style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{cl.lessonId?.title || `Lesson ${i + 1}`}</span>
                                    <span style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <IconXP size={14} color="var(--accent-color)" /> +{cl.xpEarned || 0} XP
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quiz Scores */}
                {progress?.quizScores?.length > 0 && (
                    <div>
                        <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IconStar size={16} color="#f0a000" /> QUIZ SCORES
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {progress.quizScores.map((qs, i) => (
                                <div key={i} style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{qs.lessonId?.title || `Quiz ${i + 1}`}</span>
                                    <span style={{ color: qs.passed ? 'var(--accent-color)' : '#ff4b4b', fontWeight: 700 }}>
                                        {qs.percentage || 0}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Progress;
