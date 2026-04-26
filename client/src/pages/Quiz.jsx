import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz } from '../services/api';
import { useAIMode } from '../context/AIModeContext';
import { askGemini } from '../services/gemini';
import { IconCheck, IconX, IconSparkles, IconBrain, IconSword } from '../components/Icons';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAIMode } = useAIMode();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState(null); // For simple MCQ
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const [finalResult, setFinalResult] = useState(null);
    const [aiHint, setAiHint] = useState('');
    const [hintLoading, setHintLoading] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');

    // Specific states for interactive types
    const [formSentence, setFormSentence] = useState([]);
    const [availableBlocks, setAvailableBlocks] = useState([]);

    const [matchColumnA, setMatchColumnA] = useState([]);
    const [matchColumnB, setMatchColumnB] = useState([]);
    const [selectedMatchA, setSelectedMatchA] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);

    const [fillBlankAnswer, setFillBlankAnswer] = useState('');

    // Process new question
    useEffect(() => {
        if (!quiz || !quiz.questions[currentQ]) return;
        const q = quiz.questions[currentQ];

        // Reset states
        setSelected(null);
        setShowResult(false);
        setAiHint('');
        setAiExplanation('');

        if (q.questionType === 'form-sentence') {
            setFormSentence([]);
            // ensure options are shuffled
            setAvailableBlocks([...q.options].sort(() => Math.random() - 0.5));
        } else if (q.questionType === 'matching') {
            const pairs = q.options; // assume ["Dog:Perro", "Cat:Gato"]
            const a = [];
            const b = [];
            pairs.forEach(p => {
                const [en, sp] = p.split(':');
                if (en && sp) { a.push(en); b.push(sp); }
            });
            setMatchColumnA(a.sort(() => Math.random() - 0.5));
            setMatchColumnB(b.sort(() => Math.random() - 0.5));
            setMatchedPairs([]);
            setSelectedMatchA(null);
        } else if (q.questionType === 'fill-blank') {
            if (q.options.length === 0) setFillBlankAnswer('');
        }
    }, [quiz, currentQ]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try { const res = await getQuiz(id); setQuiz(res.data); }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchQuiz();
    }, [id]);

    const handleFormSubmit = async () => {
        if (showResult) return;
        const q = quiz.questions[currentQ];
        const attempt = formSentence.join(' ');
        const isCorrect = attempt === q.correctAnswer;
        processResult(attempt, isCorrect);
    };

    const handleMatchSelectA = (word) => {
        if (showResult) return;
        setSelectedMatchA(word);
    };

    const handleMatchSelectB = (wordB) => {
        if (showResult || !selectedMatchA) return;
        const q = quiz.questions[currentQ];
        const validPairs = q.options; // ["Dog:Perro"]
        const isValid = validPairs.includes(`${selectedMatchA}:${wordB}`);

        if (isValid) {
            const newPairs = [...matchedPairs, selectedMatchA];
            setMatchedPairs(newPairs);
            setSelectedMatchA(null);

            // if all paired, proceed
            if (newPairs.length === matchColumnA.length) {
                processResult('Matches complete', true);
            }
        } else {
            // instant fail or just reset
            setSelectedMatchA(null);
            // Optionally count wrong attempts
            processResult(`${selectedMatchA}:${wordB}`, false);
        }
    };

    const processResult = async (userAttempt, isCorrect) => {
        const question = quiz.questions[currentQ];
        setShowResult(true);
        if (isCorrect) setScore(prev => prev + (question.points || 10));
        setAnswers(prev => [...prev, { question: question.question, selected: userAttempt, correct: question.correctAnswer, isCorrect }]);

        if (isAIMode && !isCorrect) {
            try {
                const exp = await askGemini(
                    `In a language test, question: "${question.question}". User put "${userAttempt}", correct is "${question.correctAnswer}". Why is the user wrong? Be encouraging.`,
                    'Language tutor context.'
                );
                setAiExplanation(exp);
            } catch { setAiExplanation(''); }
        }
    };

    const handleSelectMCQ = (option) => {
        if (showResult) return;
        setSelected(option);
        const isCorrect = option === quiz.questions[currentQ].correctAnswer;
        processResult(option, isCorrect);
    };

    const getAIHint = async () => {
        if (!isAIMode || hintLoading) return;
        setHintLoading(true);
        try {
            const q = quiz.questions[currentQ];
            const hint = await askGemini(
                `Give a subtle hint for this question: "${q.question}". One sentence.`,
                'Helpful hints only.'
            );
            setAiHint(hint);
        } catch { setAiHint('Think about context.'); }
        finally { setHintLoading(false); }
    };

    const handleNext = async () => {
        if (currentQ < quiz.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            const totalPoints = quiz.questions.reduce((acc, q) => acc + (q.points || 10), 0);
            const percentage = Math.round((score / totalPoints) * 100);
            try {
                const res = await submitQuiz({ quizId: id, lessonId: quiz.lessonId, score, totalPoints, percentage });
                setFinalResult(res.data);
            } catch (err) { console.error(err); }
            setFinished(true);
        }
    };

    if (loading) return null;
    if (!quiz) return <div className="page-section"><h2 style={{ color: 'red' }}>Trial not found</h2></div>;

    if (finished) {
        // Render results...
        const totalPoints = quiz.questions.reduce((acc, q) => acc + (q.points || 10), 0);
        const percentage = Math.round((score / totalPoints) * 100);
        const passed = percentage >= 60;
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page-section" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '600px', padding: '3rem' }}>
                    <h3 style={{ color: 'var(--accent-color)', letterSpacing: '0.2em' }}>TRIAL COMPLETE</h3>
                    <h1 style={{ fontSize: '8vw', color: passed ? 'var(--accent-color)' : '#ff4b4b' }}>{percentage}%</h1>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button onClick={() => navigate('/dashboard')} className="interactive" style={{ background: 'var(--text-color)', color: 'var(--bg-color)', padding: '1rem 2rem', borderRadius: '50px', border: 'none', fontWeight: 800 }}>Atlas</button>
                        <button onClick={() => navigate('/progress')} className="interactive" style={{ background: 'transparent', color: 'var(--text-color)', border: '1px solid #333', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 800 }}>Progress</button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const question = quiz.questions[currentQ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-section" style={{ alignItems: 'center', paddingTop: '10vh' }}>
            <div style={{ width: '100%', maxWidth: '700px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                    <span>THE TRIAL</span>
                    <span>{currentQ + 1} / {quiz.questions.length}</span>
                </div>
                {/* Progress bar */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginBottom: '3rem', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: 'var(--accent-color)', width: `${((currentQ + 1) / quiz.questions.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>{question.question}</h2>

                {/* Question Types Router */}
                {['multiple-choice', 'true-false'].includes(question.questionType) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {question.options.map((opt, i) => {
                            let bg = 'rgba(255,255,255,0.03)';
                            let border = 'rgba(255,255,255,0.08)';
                            if (showResult && opt === question.correctAnswer) { bg = 'rgba(196,240,0,0.1)'; border = 'var(--accent-color)'; }
                            else if (showResult && selected === opt) { bg = 'rgba(255,75,75,0.1)'; border = '#ff4b4b'; }
                            return (
                                <button key={i} onClick={() => handleSelectMCQ(opt)} disabled={showResult} className="interactive" style={{ padding: '1.2rem', textAlign: 'left', background: bg, border: `1px solid ${border}`, borderRadius: '15px', color: 'var(--text-color)', cursor: showResult ? 'default' : 'pointer' }}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                )}

                {question.questionType === 'form-sentence' && (
                    <div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', minHeight: '60px', padding: '1rem', borderBottom: '2px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
                            {formSentence.map((w, i) => (
                                <motion.button key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="interactive" onClick={() => !showResult && (setFormSentence(prev => prev.filter((_, idx) => idx !== i)), setAvailableBlocks(prev => [...prev, w]))} style={{ padding: '0.8rem 1.5rem', background: 'var(--text-color)', color: 'var(--bg-color)', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
                                    {w}
                                </motion.button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                            {availableBlocks.map((w, i) => (
                                <motion.button key={i} className="interactive" onClick={() => !showResult && (setAvailableBlocks(prev => prev.filter((_, idx) => idx !== i)), setFormSentence(prev => [...prev, w]))} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-color)', border: 'none', borderRadius: '10px' }}>
                                    {w}
                                </motion.button>
                            ))}
                        </div>
                        {!showResult && <button className="interactive" onClick={handleFormSubmit} style={{ width: '100%', padding: '1rem', background: 'var(--accent-color)', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', textTransform: 'uppercase' }}>Check</button>}
                    </div>
                )}

                {question.questionType === 'matching' && (
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {matchColumnA.map(w => (
                                <button key={w} onClick={() => handleMatchSelectA(w)} disabled={matchedPairs.includes(w) || showResult} className="interactive" style={{ padding: '1rem', background: selectedMatchA === w ? 'var(--accent-color)' : (matchedPairs.includes(w) ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)'), color: selectedMatchA === w ? '#000' : 'var(--text-color)', border: 'none', borderRadius: '10px', opacity: matchedPairs.includes(w) ? 0.3 : 1 }}>{w}</button>
                            ))}
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {matchColumnB.map(w => {
                                // visually pair them or just keep them active
                                const isPaired = question.options.some(opt => {
                                    const [a, b] = opt.split(':');
                                    return b === w && matchedPairs.includes(a);
                                });
                                return (
                                    <button key={w} onClick={() => handleMatchSelectB(w)} disabled={isPaired || showResult} className="interactive" style={{ padding: '1rem', background: isPaired ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', color: 'var(--text-color)', border: 'none', borderRadius: '10px', opacity: isPaired ? 0.3 : 1 }}>{w}</button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {question.questionType === 'fill-blank' && (
                    <div>
                        <input className="interactive" disabled={showResult} value={fillBlankAnswer} onChange={e => setFillBlankAnswer(e.target.value)} placeholder="Type answer here..." style={{ width: '100%', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px', color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }} />
                        {!showResult && <button className="interactive" onClick={() => processResult(fillBlankAnswer, fillBlankAnswer.toLowerCase() === question.correctAnswer.toLowerCase())} style={{ width: '100%', padding: '1rem', background: 'var(--accent-color)', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', textTransform: 'uppercase' }}>Check</button>}
                    </div>
                )}

                {showResult && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            {answers[answers.length - 1]?.isCorrect ? <IconCheck size={24} color="var(--accent-color)" /> : <IconX size={24} color="#ff4b4b" />}
                            <h3 style={{ color: answers[answers.length - 1]?.isCorrect ? 'var(--accent-color)' : '#ff4b4b' }}>
                                {answers[answers.length - 1]?.isCorrect ? 'Correct!' : `Correct Answer: ${question.correctAnswer}`}
                            </h3>
                        </div>
                        {aiExplanation && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{aiExplanation}</p>}
                        <button className="interactive" onClick={handleNext} style={{ width: '100%', padding: '1rem', background: 'var(--text-color)', color: 'var(--bg-color)', border: 'none', borderRadius: '50px', fontWeight: 800, textTransform: 'uppercase' }}>Continue</button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default Quiz;
