import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, submitQuiz, completeLesson } from '../services/api';

const Quiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Exam State
    const [currentQ, setCurrentQ] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [finished, setFinished] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [finalPercentage, setFinalPercentage] = useState(0);
    const [gradedResults, setGradedResults] = useState([]);

    // Matching local UI state
    const [matchColumnA, setMatchColumnA] = useState([]);
    const [matchColumnB, setMatchColumnB] = useState([]);
    const [selectedMatchA, setSelectedMatchA] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try { const res = await getQuiz(id); setQuiz(res.data); }
            catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (!quiz || !quiz.questions[currentQ]) return;
        const q = quiz.questions[currentQ];
        if (q.questionType === 'matching') {
            const pairs = q.options;
            const a = [];
            const b = [];
            pairs.forEach(p => {
                const [en, sp] = p.split(':');
                if (en && sp) { a.push(en); b.push(sp); }
            });
            setMatchColumnA(a.sort(() => Math.random() - 0.5));
            setMatchColumnB(b.sort(() => Math.random() - 0.5));
            setSelectedMatchA(null);
        }
    }, [quiz, currentQ]);

    const handleSelectMCQ = (option) => {
        setUserAnswers(prev => ({ ...prev, [currentQ]: option }));
    };

    const handleFillBlank = (val) => {
        setUserAnswers(prev => ({ ...prev, [currentQ]: val }));
    };

    const handleMatchSelectA = (word) => {
        const currentPairs = userAnswers[currentQ] || [];
        const existingPair = currentPairs.find(p => p.startsWith(word + ':'));
        if (existingPair) {
            setUserAnswers(prev => ({ ...prev, [currentQ]: currentPairs.filter(p => p !== existingPair) }));
            setSelectedMatchA(null);
            return;
        }
        setSelectedMatchA(word);
    };

    const handleMatchSelectB = (wordB) => {
        if (!selectedMatchA) return;
        const currentPairs = userAnswers[currentQ] || [];
        if (currentPairs.some(p => p.endsWith(':' + wordB))) return;

        const newPairs = [...currentPairs, `${selectedMatchA}:${wordB}`];
        setUserAnswers(prev => ({ ...prev, [currentQ]: newPairs }));
        setSelectedMatchA(null);
    };

    const handleNext = () => {
        if (currentQ < quiz.questions.length - 1) {
            setCurrentQ(prev => prev + 1);
        } else {
            submitExam();
        }
    };

    const submitExam = async () => {
        let earnedScore = 0;
        let totalPoints = 0;
        const results = [];

        quiz.questions.forEach((q, idx) => {
            const userAnswer = userAnswers[idx];
            const points = q.points || 10;
            totalPoints += points;
            let isCorrect = false;

            if (q.questionType === 'multiple-choice' || q.questionType === 'true-false') {
                isCorrect = userAnswer === q.correctAnswer;
            } else if (q.questionType === 'fill-blank') {
                isCorrect = userAnswer && userAnswer.trim().toLowerCase() === q.correctAnswer.toLowerCase();
            } else if (q.questionType === 'matching') {
                const attemptPairs = userAnswer || [];
                const correctPairs = q.options;
                const allCorrect = correctPairs.every(p => attemptPairs.includes(p)) && attemptPairs.length === correctPairs.length;
                isCorrect = allCorrect;
            }

            if (isCorrect) earnedScore += points;
            results.push({ question: q, userAnswer, isCorrect });
        });

        const percentage = Math.round((earnedScore / totalPoints) * 100);
        setFinalScore(earnedScore);
        setFinalPercentage(percentage);
        setGradedResults(results);
        setFinished(true);

        try {
            await submitQuiz({ quizId: id, lessonId: quiz.lessonId, score: earnedScore, totalPoints, percentage });
            if (percentage >= 70) {
                await completeLesson(quiz.lessonId);
            }
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="preloader">INITIALIZING TRIAL...</div>;
    if (!quiz) return <div className="page-container"><h2 style={{ color: 'var(--accent-error)' }}>TRIAL NOT FOUND</h2></div>;

    if (finished) {
        const passed = finalPercentage >= 70;
        return (
            <div className="page-container flex-center" style={{ padding: '60px 20px', alignItems: 'flex-start' }}>
                <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="panel" style={{ textAlign: 'center', padding: '60px', marginBottom: '40px', border: `1px solid ${passed ? 'var(--accent-primary)' : 'var(--accent-error)'}`, background: passed ? 'rgba(210, 255, 0, 0.05)' : 'rgba(255, 51, 102, 0.05)' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '16px' }}>{passed ? 'MODULE CLEARED' : 'TRIAL FAILED'}</div>
                        <h1 style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', color: passed ? 'var(--accent-primary)' : 'var(--accent-error)', lineHeight: 1, marginBottom: '24px' }}>{finalPercentage}%</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '40px' }}>
                            SCORE: {finalScore} / {quiz.questions.reduce((a, b) => a + (b.points || 10), 0)}
                        </p>
                        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ padding: '16px 48px' }}>RETURN TO COMMAND</button>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', marginBottom: '24px', letterSpacing: '0.1em' }}>TRIAL LOGS</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {gradedResults.map((res, i) => (
                            <div key={i} className="panel" style={{ padding: '24px', borderLeft: `4px solid ${res.isCorrect ? 'var(--accent-primary)' : 'var(--accent-error)'}` }}>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>QUESTION {i + 1}</div>
                                <h4 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>{res.question.question}</h4>
                                
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 1, minWidth: '200px' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>YOUR INPUT</span>
                                        <div style={{ fontSize: '1.1rem', color: res.isCorrect ? 'var(--accent-primary)' : 'var(--accent-error)', fontWeight: 600, marginTop: '4px' }}>
                                            {Array.isArray(res.userAnswer) ? res.userAnswer.join(', ') : (res.userAnswer || 'NO DATA')}
                                        </div>
                                    </div>
                                    {!res.isCorrect && (
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>TARGET</span>
                                            <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                                                {res.question.correctAnswer}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQ];
    const answer = userAnswers[currentQ];

    return (
        <div className="page-container flex-center">
            <div style={{ width: '100%', maxWidth: '800px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-secondary)', fontWeight: 800 }}>
                    <span>TRIAL ACTIVE</span>
                    <span>{currentQ + 1} / {quiz.questions.length}</span>
                </div>
                
                <div style={{ width: '100%', height: '4px', background: 'var(--bg-surface-elevated)', marginBottom: '40px', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: 'var(--accent-primary)', width: `${((currentQ + 1) / quiz.questions.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '40px', color: '#fff' }}>{question.question}</h2>

                        {['multiple-choice', 'true-false'].includes(question.questionType) && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {question.options.map((opt, i) => {
                                    const isSelected = answer === opt;
                                    return (
                                        <button 
                                            key={i} 
                                            onClick={() => handleSelectMCQ(opt)} 
                                            style={{ 
                                                padding: '24px', textAlign: 'left', 
                                                background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface)', 
                                                color: isSelected ? '#000' : '#fff', 
                                                border: 'var(--border-sharp)',
                                                fontSize: '1.2rem', fontWeight: 600, cursor: 'pointer', transition: 'var(--transition-snappy)' 
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {question.questionType === 'matching' && (
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {matchColumnA.map(w => {
                                        const isPaired = (answer || []).some(p => p.startsWith(w + ':'));
                                        const isSelected = selectedMatchA === w;
                                        return (
                                            <button 
                                                key={w} 
                                                onClick={() => handleMatchSelectA(w)} 
                                                style={{ 
                                                    padding: '24px', 
                                                    background: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)', 
                                                    color: isSelected ? '#000' : '#fff', 
                                                    border: isPaired ? '1px solid var(--accent-primary)' : 'var(--border-sharp)', 
                                                    fontWeight: 800, fontSize: '1.2rem', 
                                                    opacity: isPaired ? 0.3 : 1, cursor: 'pointer' 
                                                }}
                                            >
                                                {w}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {matchColumnB.map(w => {
                                        const isPaired = (answer || []).some(p => p.endsWith(':' + w));
                                        return (
                                            <button 
                                                key={w} 
                                                onClick={() => handleMatchSelectB(w)} 
                                                style={{ 
                                                    padding: '24px', 
                                                    background: 'var(--bg-surface-elevated)', color: '#fff', 
                                                    border: isPaired ? '1px solid var(--accent-primary)' : 'var(--border-sharp)', 
                                                    fontWeight: 800, fontSize: '1.2rem', 
                                                    opacity: isPaired ? 0.3 : 1, cursor: 'pointer' 
                                                }}
                                            >
                                                {w}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {question.questionType === 'fill-blank' && (
                            <div>
                                <input 
                                    value={answer || ''} 
                                    onChange={e => handleFillBlank(e.target.value)} 
                                    placeholder="INPUT ANSWER..." 
                                    style={{ 
                                        width: '100%', padding: '24px', background: 'var(--bg-surface)', 
                                        border: 'var(--border-sharp)', color: '#fff', fontSize: '1.5rem', 
                                        fontWeight: 800, outline: 'none' 
                                    }} 
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button 
                        onClick={handleNext} 
                        className="btn-primary" 
                        style={{ padding: '16px 48px', opacity: answer === undefined ? 0.5 : 1, pointerEvents: answer === undefined ? 'none' : 'auto' }}
                    >
                        {currentQ < quiz.questions.length - 1 ? 'NEXT QUESTION' : 'TRANSMIT LOGS'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
