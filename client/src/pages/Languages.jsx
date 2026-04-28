import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getLanguages } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';

const Languages = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAIMode } = useAIMode();
    const [aiRec, setAiRec] = useState('');
    const [loadingRec, setLoadingRec] = useState(false);

    useEffect(() => {
        getLanguages().then(r => setLanguages(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const getAI = async () => {
        if (!isAIMode || loadingRec) return;
        setLoadingRec(true);
        const langs = languages.map(l => l.languageName).join(', ');
        askGemini(`Pick one from: ${langs}. Brief reason.`, 'Be brief.').then(setAiRec).catch(() => setAiRec('System recommends French for global compatibility.')).finally(() => setLoadingRec(false));
    };

    if (loading) return <div className="preloader">LOADING SYSTEM...</div>;

    return (
        <div className="page-container">
            <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>AVAILABLE PROTOCOLS</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>SELECT LANGUAGE</h1>
                </motion.div>

                {isAIMode && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '40px' }}>
                        {!aiRec ? (
                            <button onClick={getAI} className="btn-secondary">AI RECOMMENDATION</button>
                        ) : (
                            <div className="panel" style={{ padding: '32px', border: '1px solid var(--accent-primary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000', background: 'var(--accent-primary)', padding: '4px 8px' }}>AI DIRECTIVE</span>
                                </div>
                                <p style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 500 }}>{aiRec}</p>
                            </div>
                        )}
                    </motion.div>
                )}

                <div className="grid-layout">
                    {languages.map((lang, i) => (
                        <motion.div key={lang._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <Link to={`/lessons?lang=${lang._id}`} className="panel" style={{ display: 'flex', flexDirection: 'column', padding: '32px', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{lang.languageName}</h2>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', background: 'rgba(210, 255, 0, 0.1)', padding: '4px 8px' }}>{lang.totalLessons || 0} MODS</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>{lang.description}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Languages;