import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, completeLesson, getQuizzesByLesson } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';
import { IconArrowLeft, IconSpeaker, IconBrain, IconCheck, IconSword } from '../components/Icons';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAIMode } = useAIMode();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [masteredCards, setMasteredCards] = useState(new Set());
    const [quizId, setQuizId] = useState(null);
    const [aiExplanation, setAiExplanation] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiSentences, setAiSentences] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLesson(id);
                setLesson(res.data);
                const quizRes = await getQuizzesByLesson(id);
                if (quizRes.data?.length > 0) setQuizId(quizRes.data[0]._id);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    const handleComplete = async () => {
        try { await completeLesson(id); setCompleted(true); } catch (err) { console.error(err); }
    };

    const speakWord = (text, code) => {
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = code ? code.toLowerCase() : 'en-US';
            utter.rate = 0.8;
            speechSynthesis.speak(utter);
        }
    };

    const getAIExplanation = async (word, translation) => {
        if (!isAIMode) return;
        setAiLoading(true);
        setAiExplanation('');
        setAiSentences('');
        try {
            const langName = lesson?.languageId?.languageName || 'this language';
            const result = await askGemini(
                `For the ${langName} word "${word}" (meaning "${translation}"), give me:
1. A cultural note
2. Two example sentences
3. A memory trick
Keep it concise.`,
                'You are a direct language coach. Be extremely concise.'
            );
            setAiExplanation(result);
        } catch { setAiExplanation('AI EXPLANATION UNAVAILABLE.'); }
        finally { setAiLoading(false); }
    };

    const getAIPractice = async () => {
        if (!isAIMode || !lesson) return;
        setAiLoading(true);
        setAiSentences('');
        try {
            const content = lesson.content || {};
            const vocab = content.vocabulary || lesson.vocabulary || [];
            const words = vocab.map(v => v.word).join(', ');
            const result = await askGemini(
                `Create a short practice exercise (3 fill-in-the-blank sentences) using: ${words}. Include answers.`,
                'Be direct and concise.'
            );
            setAiSentences(result);
        } catch { setAiSentences('GENERATION FAILED.'); }
        finally { setAiLoading(false); }
    };

    if (loading) return <div className="preloader">LOADING CONTENT...</div>;
    if (!lesson) return <div className="page-container"><h2 style={{ color: 'var(--accent-error)' }}>MODULE NOT FOUND</h2></div>;

    const content = lesson.content || {};
    const vocab = content.vocabulary || lesson.vocabulary || [];
    const grammar = content.grammarNotes || lesson.grammarNotes || [];
    const currentVocab = vocab[currentCard];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
            <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} /> ABORT
                </button>

                <div style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>ACTIVE MODULE</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff', textTransform: 'uppercase' }}>{lesson.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '1.2rem', fontWeight: 500 }}>{lesson.description}</p>
                </div>

                {vocab.length > 0 && (
                    <div style={{ marginBottom: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.1em' }}>
                                VOCABULARY DATABASE
                            </h3>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#fff' }}>{masteredCards.size} / {vocab.length} MASTERED</span>
                        </div>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '8px', background: 'var(--bg-base)', marginBottom: '32px', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${(masteredCards.size / vocab.length) * 100}%` }} 
                                style={{ height: '100%', background: 'var(--accent-primary)' }} 
                            />
                        </div>
                        <motion.div
                            key={currentCard}
                            onClick={() => setFlipped(!flipped)}
                            className="panel"
                            style={{
                                minHeight: '300px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', padding: '40px', textAlign: 'center'
                            }}
                        >
                            {!flipped ? (
                                <>
                                    <span style={{ fontSize: '4rem', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>{currentVocab?.word}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em' }}>CLICK TO DECODE</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '8px' }}>{currentVocab?.translation}</span>
                                    {currentVocab?.pronunciation && (
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px' }}>/{currentVocab.pronunciation}/</span>
                                    )}
                                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                        <button onClick={(e) => { e.stopPropagation(); speakWord(currentVocab?.word, lesson?.languageId?.code); }} className="btn-secondary" style={{ padding: '8px 24px' }}>
                                            <IconSpeaker size={16} /> PRONOUNCE
                                        </button>
                                        {isAIMode && (
                                            <button onClick={(e) => { e.stopPropagation(); getAIExplanation(currentVocab?.word, currentVocab?.translation); }} className="btn-secondary" style={{ padding: '8px 24px', borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)' }}>
                                                <IconBrain size={16} /> AI ANALYZE
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>

                        {isAIMode && aiExplanation && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel" style={{ marginTop: '24px', padding: '32px', border: '1px solid var(--accent-primary)' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000', background: 'var(--accent-primary)', padding: '4px 8px', display: 'inline-block', marginBottom: '16px' }}>AI REPORT</div>
                                <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
                                    <ReactMarkdown components={{ p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '12px' }} {...props} />, strong: ({ node, ...props }) => <strong style={{ color: 'var(--accent-primary)' }} {...props} /> }}>
                                        {aiExplanation}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            <button 
                                onClick={() => { 
                                    setFlipped(false); 
                                    setAiExplanation(''); 
                                    setCurrentCard((prev) => (prev + 1) % vocab.length); 
                                }} 
                                className="btn-secondary" 
                                style={{ flex: 1, borderColor: '#ff3366', color: '#ff3366' }}
                            >
                                NEEDS WORK
                            </button>
                            <button 
                                onClick={() => { 
                                    const newSet = new Set(masteredCards);
                                    newSet.add(currentCard);
                                    setMasteredCards(newSet);
                                    setFlipped(false); 
                                    setAiExplanation('');
                                    if (newSet.size < vocab.length) {
                                        let next = (currentCard + 1) % vocab.length;
                                        while(newSet.has(next) && newSet.size < vocab.length) {
                                            next = (next + 1) % vocab.length;
                                        }
                                        setCurrentCard(next);
                                    }
                                }} 
                                className="btn-primary" 
                                style={{ flex: 1 }}
                            >
                                GOT IT
                            </button>
                        </div>
                    </div>
                )}

                {grammar.length > 0 && (
                    <div style={{ marginBottom: '60px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.1em', marginBottom: '24px' }}>SYNTAX LOGIC</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {grammar.map((note, i) => (
                                <div key={i} className="panel" style={{ padding: '32px' }}>
                                    <h4 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, marginBottom: '12px' }}>{note.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>{note.explanation}</p>
                                    {note.example && <p style={{ color: 'var(--accent-primary)', marginTop: '16px', fontWeight: 600 }}>EXAMPLE: {note.example}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isAIMode && (
                    <div style={{ marginBottom: '60px' }}>
                        <button onClick={getAIPractice} disabled={aiLoading} className="btn-secondary" style={{ borderColor: 'var(--accent-primary)', color: 'var(--accent-primary)', width: '100%' }}>
                            {aiLoading ? 'GENERATING...' : 'GENERATE AI DRILL'}
                        </button>
                        {aiSentences && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="panel" style={{ marginTop: '24px', padding: '32px', border: '1px solid var(--accent-primary)' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#000', background: 'var(--accent-primary)', padding: '4px 8px', display: 'inline-block', marginBottom: '16px' }}>AI DRILL</div>
                                <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>
                                    <ReactMarkdown components={{ p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '12px' }} {...props} />, strong: ({ node, ...props }) => <strong style={{ color: 'var(--accent-primary)' }} {...props} /> }}>
                                        {aiSentences}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', flexDirection: 'column' }}>
                    {completed && (
                        <div className="panel" style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', border: '1px solid var(--accent-primary)', background: 'rgba(210, 255, 0, 0.1)' }}>
                            <IconCheck size={24} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900 }}>MODULE CLEARED +{lesson.xpReward || 25} XP</span>
                        </div>
                    )}
                    
                    {!completed ? (
                        quizId ? (
                            <button 
                                onClick={() => navigate(`/quiz/${quizId}`)} 
                                disabled={masteredCards.size < vocab.length}
                                className={masteredCards.size < vocab.length ? "btn-secondary" : "btn-primary"} 
                                style={{ flex: 1, opacity: masteredCards.size < vocab.length ? 0.3 : 1, padding: '24px' }}
                            >
                                <IconSword size={20} /> {masteredCards.size < vocab.length ? 'MASTER ALL CARDS TO UNLOCK TRIAL' : 'INITIATE TRIAL'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleComplete} 
                                disabled={masteredCards.size < vocab.length}
                                className={masteredCards.size < vocab.length ? "btn-secondary" : "btn-primary"} 
                                style={{ flex: 1, opacity: masteredCards.size < vocab.length ? 0.3 : 1, padding: '24px' }}
                            >
                                <IconCheck size={20} /> {masteredCards.size < vocab.length ? 'MASTER ALL CARDS TO COMPLETE' : 'MARK COMPLETE'}
                            </button>
                        )
                    ) : (
                        quizId && (
                            <button onClick={() => navigate(`/quiz/${quizId}`)} className="btn-secondary" style={{ flex: 1, borderColor: '#fff', color: '#fff', padding: '24px' }}>
                                <IconSword size={20} /> RETAKE TRIAL
                            </button>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LessonDetail;
