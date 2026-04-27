import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getLesson, completeLesson, getQuizzesByLesson } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini, speakText } from '../services/gemini';
import { IconArrowLeft, IconSpeaker, IconSparkles, IconBrain, IconCheck, IconSword } from '../components/Icons';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAIMode } = useAIMode();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [completed, setCompleted] = useState(false);
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

    const speakWord = (text, lang = 'es') => {
        if ('speechSynthesis' in window) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = lang;
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
1. A cultural/etymological note (1 sentence)
2. Two more example sentences using this word with translations
3. A memory trick to remember it
Keep it concise.`,
                'You are a language learning expert. Be concise and helpful.'
            );
            setAiExplanation(result);
        } catch { setAiExplanation('AI explanation unavailable right now.'); }
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
                `Create a short practice exercise (3 fill-in-the-blank sentences) using these words: ${words}. Include the answers at the end.`,
                'You are a language teacher creating practice exercises. Be concise.'
            );
            setAiSentences(result);
        } catch { setAiSentences('Could not generate practice sentences.'); }
        finally { setAiLoading(false); }
    };

    if (loading) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ color: 'var(--accent-color)', fontSize: '2rem' }}>Loading encounter...</h2>
            </motion.div>
        );
    }

    if (!lesson) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ color: '#ff4b4b', fontSize: '2rem' }}>Encounter not found</h2>
            </motion.div>
        );
    }

    const content = lesson.content || {};
    const vocab = content.vocabulary || lesson.vocabulary || [];
    const grammar = content.grammarNotes || lesson.grammarNotes || [];
    const currentVocab = vocab[currentCard];

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
            className="page-section" style={{ justifyContent: 'flex-start', paddingTop: '8vh' }}
        >
            <div style={{ padding: '5vw', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <span onClick={() => navigate(-1)} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.15em', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} color="var(--text-muted)" /> BACK
                </span>

                {isAIMode && <IconSparkles size={16} color="var(--accent-color)" />}
                LESSON CONTENT
            </h3>
            <h1 style={{ fontSize: '4vw', lineHeight: 1, marginBottom: '1rem' }}>{lesson.title}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1rem' }}>{lesson.description}</p>

            {/* Vocabulary Flashcards */}
            {vocab.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        VOCABULARY — {currentCard + 1} / {vocab.length}
                    </h3>
                    <motion.div
                        key={currentCard}
                        onClick={() => setFlipped(!flipped)}
                        style={{
                            width: '100%', minHeight: '250px',
                            background: isAIMode ? 'rgba(196,240,0,0.02)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isAIMode && flipped ? 'rgba(196,240,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '20px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', padding: '2rem', transition: 'all 0.4s',
                            boxShadow: flipped ? (isAIMode ? '0 0 40px rgba(196,240,0,0.1)' : '0 0 30px rgba(100,130,220,0.1)') : 'none',
                        }}
                    >
                        {!flipped ? (
                            <>
                                <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>{currentVocab?.word}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TAP TO REVEAL</span>
                            </>
                        ) : (
                            <>
                                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>{currentVocab?.translation}</span>
                                {currentVocab?.pronunciation && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1rem' }}>/{currentVocab.pronunciation}/</span>
                                )}
                                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); speakWord(currentVocab?.word); }}
                                        style={{
                                            background: 'rgba(196,240,0,0.15)', border: '1px solid var(--accent-color)',
                                            color: 'var(--accent-color)', padding: '0.5rem 1.5rem', borderRadius: '50px',
                                            cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        }}
                                    >
                                        <IconSpeaker size={16} color="var(--accent-color)" /> Pronounce
                                    </button>
                                    {isAIMode && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); getAIExplanation(currentVocab?.word, currentVocab?.translation); }}
                                            style={{
                                                background: 'rgba(196,240,0,0.08)', border: '1px solid rgba(196,240,0,0.3)',
                                                color: 'var(--accent-color)', padding: '0.5rem 1.5rem', borderRadius: '50px',
                                                cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                            }}
                                        >
                                            <IconBrain size={16} color="var(--accent-color)" /> AI Explain
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* AI Explanation Panel */}
                    {isAIMode && aiExplanation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                            marginTop: '1rem', padding: '1.5rem', background: 'rgba(196,240,0,0.03)',
                            border: '1px solid rgba(196,240,0,0.1)', borderRadius: '15px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <IconSparkles size={14} color="var(--accent-color)" />
                                <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>AI EXPLANATION</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.6rem' }} {...props} />,
                                        strong: ({ node, ...props }) => <strong style={{ color: 'var(--accent-color)' }} {...props} />,
                                    }}
                                >
                                    {aiExplanation}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); setAiExplanation(''); }}
                            disabled={currentCard === 0}
                            style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                color: currentCard === 0 ? 'rgba(255,255,255,0.2)' : 'var(--text-color)',
                                padding: '0.7rem 2rem', borderRadius: '50px', cursor: currentCard === 0 ? 'default' : 'pointer',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => { setCurrentCard(Math.min(vocab.length - 1, currentCard + 1)); setFlipped(false); setAiExplanation(''); }}
                            disabled={currentCard === vocab.length - 1}
                            style={{
                                background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                                color: currentCard === vocab.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--text-color)',
                                padding: '0.7rem 2rem', borderRadius: '50px', cursor: currentCard === vocab.length - 1 ? 'default' : 'pointer',
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Grammar Notes */}
            {grammar.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.15em', fontSize: '0.9rem', marginBottom: '1.5rem' }}>GRAMMAR NOTES</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {grammar.map((note, i) => (
                            <div key={i} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '15px' }}>
                                <h4 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{note.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{note.explanation}</p>
                                {note.example && <p style={{ color: 'var(--text-color)', marginTop: '0.5rem', fontStyle: 'italic' }}>Example: {note.example}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Practice Sentences */}
            {isAIMode && (
                <div style={{ marginBottom: '3rem' }}>
                    <button
                        onClick={getAIPractice} disabled={aiLoading}
                        style={{
                            background: 'rgba(196,240,0,0.08)', border: '1px solid rgba(196,240,0,0.2)',
                            color: 'var(--accent-color)', padding: '0.8rem 2rem', borderRadius: '50px',
                            cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}
                    >
                        <IconBrain size={16} color="var(--accent-color)" />
                        {aiLoading ? 'Generating...' : 'Generate AI Practice Exercise'}
                    </button>
                    {aiSentences && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
                            marginTop: '1rem', padding: '1.5rem', background: 'rgba(196,240,0,0.03)',
                            border: '1px solid rgba(196,240,0,0.1)', borderRadius: '15px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <IconSparkles size={14} color="var(--accent-color)" />
                                <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>AI PRACTICE</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <ReactMarkdown
                                    components={{
                                        p: ({ node, ...props }) => <p style={{ margin: 0, marginBottom: '0.6rem' }} {...props} />,
                                        strong: ({ node, ...props }) => <strong style={{ color: 'var(--accent-color)' }} {...props} />,
                                        ol: ({ node, ...props }) => <ol style={{ paddingLeft: '1.2rem', margin: '0.6rem 0' }} {...props} />,
                                        li: ({ node, ...props }) => <li style={{ marginBottom: '0.4rem' }} {...props} />,
                                    }}
                                >
                                    {aiSentences}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {!completed ? (
                    <button onClick={handleComplete} style={{
                        background: 'var(--accent-color)', color: 'var(--bg-color)', border: 'none',
                        padding: '1rem 3rem', borderRadius: '50px', fontFamily: 'var(--font-display)',
                        textTransform: 'uppercase', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.1em',
                        fontSize: '1rem', transition: 'transform 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <IconCheck size={18} color="var(--bg-color)" /> Complete Lesson
                    </button>
                ) : (
                    <div style={{ color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IconCheck size={22} color="var(--accent-color)" /> Lesson Completed! +{lesson.xpReward || 25} XP
                    </div>
                )}
                {quizId && (
                    <button onClick={() => navigate(`/quiz/${quizId}`)} style={{
                        background: 'transparent', color: 'var(--text-color)', border: '1px solid rgba(255,255,255,0.2)',
                        padding: '1rem 3rem', borderRadius: '50px', fontFamily: 'var(--font-display)', textTransform: 'uppercase',
                        fontWeight: 800, cursor: 'pointer', letterSpacing: '0.1em', fontSize: '1rem', transition: 'all 0.3s',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                    }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-color)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-color)'; }}
                    >
                        <IconSword size={18} /> Take the Trial
                    </button>
                )}
            </div>
        </div>
        </motion.div >
    );
};

export default LessonDetail;
