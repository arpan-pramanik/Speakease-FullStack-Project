import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getLanguages } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';
import { IconGlobe, IconSparkles, IconBrain, IconBook } from '../components/Icons';

const Languages = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();
    const [aiRec, setAiRec] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        const fetchLanguages = async () => {
            try { const res = await getLanguages(); setLanguages(res.data); }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchLanguages();
    }, []);

    const getAIRecommendation = async () => {
        if (!isAIMode || aiLoading) return;
        setAiLoading(true);
        try {
            const langs = languages.map(l => l.languageName).join(', ');
            const result = await askGemini(
                `A user wants to learn a language. Available options: ${langs}. Give a personalized recommendation in 2-3 sentences comparing the options, considering ease of learning, career prospects, and cultural richness. Be fun and engaging.`,
                'You are a language learning advisor.'
            );
            setAiRec(result);
        } catch { setAiRec('All languages are great choices! Pick the one that excites you most.'); }
        finally { setAiLoading(false); }
    };

    if (loading) return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--accent-color)' }}>Discovering languages...</h2>
        </motion.div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}
        >
            <div style={{ padding: '5vw' }}>
                <h3 style={{ color: 'var(--accent-color)', fontSize: '1rem', letterSpacing: '0.2em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconGlobe size={18} color="var(--accent-color)" /> CHOOSE YOUR REALM
                </h3>
                <h1 style={{ fontSize: '8vw', lineHeight: 0.85, marginBottom: '3rem' }}>LANGUAGES</h1>

                {/* AI Recommendation */}
                {isAIMode && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        {!aiRec ? (
                            <button onClick={getAIRecommendation} disabled={aiLoading} style={{
                                background: 'rgba(196,240,0,0.08)', border: '1px solid rgba(196,240,0,0.2)',
                                color: 'var(--accent-color)', padding: '0.8rem 2rem', borderRadius: '50px',
                                cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}>
                                <IconBrain size={16} color="var(--accent-color)" />
                                {aiLoading ? 'Analyzing...' : 'Get AI Language Recommendation'}
                            </button>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                                padding: '1.5rem', background: 'rgba(196,240,0,0.03)',
                                border: '1px solid rgba(196,240,0,0.1)', borderRadius: '15px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <IconSparkles size={14} color="var(--accent-color)" />
                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>AI RECOMMENDATION</span>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{aiRec}</p>
                            </motion.div>
                        )}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {languages.map((lang, i) => (
                        <motion.div key={lang._id} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}>
                            <Link to={`/lessons?lang=${lang._id}`} className="glass-card-interactive" style={{
                                display: 'block', padding: '2rem',
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2.5rem' }}>{lang.icon}</span>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>{lang.languageName}</h2>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <IconBook size={14} color="var(--text-muted)" /> {lang.totalLessons || 0} lessons
                                        </span>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{lang.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Languages;
