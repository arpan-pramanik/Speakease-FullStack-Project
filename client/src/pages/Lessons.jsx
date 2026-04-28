import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { getLessonsByLanguage, createLesson, createQuiz } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { useAuth } from '../context/AuthContext';
import { askGemini } from '../services/gemini';

const Lessons = () => {
    const [searchParams] = useSearchParams();
    const langId = searchParams.get('lang');
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();
    const { user } = useAuth();

    useEffect(() => {
        const fetchLessons = async (targetLangId) => {
            try {
                const res = await getLessonsByLanguage(targetLangId);
                setLessons(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const targetLangId = langId || user?.selectedLanguage?._id;
        if (targetLangId) fetchLessons(targetLangId);
        else setLoading(false);
    }, [langId, user]);



    if (loading) {
        return <div className="preloader">LOADING MODULES...</div>;
    }

    const getDifficultyStyle = (difficulty) => {
        const styles = {
            'Beginner': { color: 'var(--accent-primary)', bg: 'rgba(210, 255, 0, 0.1)' },
            'Intermediate': { color: '#00ffff', bg: 'rgba(0, 255, 255, 0.1)' },
            'Advanced': { color: '#ff3366', bg: 'rgba(255, 51, 102, 0.1)' },
        };
        return styles[difficulty] || { color: 'var(--text-secondary)', bg: 'var(--bg-surface-elevated)' };
    };

    return (
        <div className="page-container">
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}
                >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>MODULES</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>TRAINING<br/>CURRICULUM</h1>
                </motion.div>



                {lessons.length === 0 ? (
                    <div className="panel" style={{ padding: '60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 800 }}>
                            {!user?.selectedLanguage ? "NO TARGET LANGUAGE SELECTED." : "NO MODULES FOUND. AWAITING DATA."}
                        </p>
                        {!user?.selectedLanguage && (
                            <Link to="/languages" className="btn-primary" style={{ padding: '16px 32px' }}>
                                SELECT LANGUAGE
                            </Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {lessons.map((lesson, i) => {
                            const diff = getDifficultyStyle(lesson.difficulty);
                            return (
                                <motion.div
                                    key={lesson._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                >
                                    <Link 
                                        to={`/lesson/${lesson._id}`}
                                        className="panel"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '32px',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>
                                                    {lesson.title}
                                                </h3>
                                                <span style={{ background: diff.bg, color: diff.color, padding: '4px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                                                    {lesson.difficulty}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
                                                {lesson.description}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: '32px' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}>
                                                +{lesson.xpReward || 25} XP
                                            </span>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5">
                                                <path d="M5 12h14M12 5l7 7-7 7"/>
                                            </svg>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lessons;