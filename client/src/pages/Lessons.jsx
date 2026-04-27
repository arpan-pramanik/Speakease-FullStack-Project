import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { getLessonsByLanguage } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { IconBook, IconXP, IconSword, IconSparkles } from '../components/Icons';

const Lessons = () => {
    const [searchParams] = useSearchParams();
    const langId = searchParams.get('lang');
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const res = await getLessonsByLanguage(langId);
                setLessons(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        if (langId) fetchLessons();
        else setLoading(false);
    }, [langId]);

    if (loading) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--accent-color)' }}>Loading encounters...</h2>
        </motion.div>
    );

    const diffColor = (d) => ({ 'Beginner': 'var(--accent-color)', 'Intermediate': '#f0a000', 'Advanced': '#ff4b4b' }[d] || 'var(--text-muted)');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}
        >
            <div style={{ padding: '5vw' }}>
                <h3 style={{ color: 'var(--accent-color)', fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconBook size={18} color="var(--accent-color)" /> THE ENCOUNTERS
                    {isAIMode && <IconSparkles size={14} color="var(--accent-color)" />}
                </h3>
                <h1 style={{ fontSize: '8vw', lineHeight: 0.85, marginBottom: '3rem' }}>LESSONS</h1>

                {isAIMode && (
                    <p className="glass-card-ai" style={{
                        color: 'var(--accent-color)', fontSize: '0.85rem', marginBottom: '2rem', padding: '0.8rem 1.5rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}>
                        <IconSparkles size={14} color="var(--accent-color)" />
                        AI features active — get explanations, practice exercises, and hints in each lesson
                    </p>
                )}

                {lessons.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>No lessons found. Select a language first.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {lessons.map((lesson, i) => (
                            <motion.div key={lesson._id} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                                <Link to={`/lesson/${lesson._id}`} className="glass-card-interactive" style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '1.5rem 2rem',
                                }}
                                    onMouseEnter={(e) => { e.currentTarget.style.paddingLeft = '2.5rem'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.paddingLeft = '2rem'; }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{lesson.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lesson.description}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexShrink: 0, marginLeft: '1rem' }}>
                                        <span style={{ color: diffColor(lesson.difficulty), fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                                            {lesson.difficulty?.toUpperCase()}
                                        </span>
                                        <span style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', fontWeight: 700 }}>
                                            <IconXP size={14} color="var(--accent-color)" /> {lesson.xpReward || 25}
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Lessons;
