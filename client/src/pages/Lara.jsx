import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { chatWithGemini, speakText, listenForSpeech, stopSpeechRecognition } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import { useAIMode } from '../context/AIModeContext';
import { IconSparkles, IconMic, IconX } from '../components/Icons';

const SYSTEM_PROMPT = `You are Lara, a friendly and knowledgeable language tutor inside the SpeakEase platform.
You keep your responses conversational, very concise (1-2 short sentences max), and natural because they will be spoken aloud via TTS.
If the user speaks a foreign language, respond naturally and offer gentle corrections or continuations.`;

const Lara = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hey! I'm Lara. Tell me what language you want to practice, or just say hello!" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [interimText, setInterimText] = useState('');
    const { user } = useAuth();
    const { isAIMode } = useAIMode();
    const navigate = useNavigate();

    // Kick out if not in AI mode or not logged in
    useEffect(() => {
        if (!user || !isAIMode) {
            navigate('/dashboard');
        }
    }, [user, isAIMode, navigate]);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 1 && !isSpeaking) {
            setIsSpeaking(true);
            speakText(messages[0].text).then(() => setIsSpeaking(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMsg = { role: 'user', text: text.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const chatHistory = newMessages.filter(m => m.role !== 'system').map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                text: m.text
            }));
            const response = await chatWithGemini(chatHistory, SYSTEM_PROMPT);
            const aiMsg = { role: 'ai', text: response };
            setMessages(prev => [...prev, aiMsg]);

            // Auto-speak AI responses
            setIsSpeaking(true);
            await speakText(response);
            setIsSpeaking(false);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'I had trouble connecting to the network. Try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoiceInput = async () => {
        if (isListening) {
            stopSpeechRecognition();
            return;
        }
        setIsListening(true);
        setInterimText('');
        try {
            const transcript = await listenForSpeech('en-US', (text) => setInterimText(text));
            if (transcript) {
                setInterimText('');
                await sendMessage(transcript);
            }
        } catch (err) {
            console.error('Voice input error:', err);
            setInterimText('');
        } finally {
            setIsListening(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="page-section"
            style={{ justifyContent: 'center', alignItems: 'center', position: 'relative' }}
        >
            {/* Close Button */}
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    position: 'absolute', top: '40px', left: '40px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    width: '50px', height: '50px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 100, transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
                <IconX size={24} color="var(--text-color)" />
            </button>

            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', width: '100%', maxWidth: '800px',
                padding: '2rem', textAlign: 'center', gap: '4vh'
            }}>

                {/* Branding / Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <IconSparkles size={24} color="var(--accent-color)" />
                        <h1 style={{ fontSize: '2rem', color: 'var(--accent-color)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Lara</h1>
                    </div>
                    <div style={{
                        padding: '0.5rem 1.5rem', borderRadius: '50px',
                        background: 'rgba(196, 240, 0, 0.05)', border: '1px solid rgba(196, 240, 0, 0.15)',
                        color: 'var(--text-muted)', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}>
                        {isListening ? 'Listening via Microphone...' : isLoading ? 'Processing Syntax...' : isSpeaking ? 'Transmitting Audio...' : 'Awaiting Input'}
                    </div>
                </div>

                {/* Subtitle / Active Text Overlay */}
                <div style={{ minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={isListening ? 'interim' : messages.length}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            style={{
                                fontSize: '1.8rem', color: isListening ? '#ff4b4b' : 'var(--text-color)',
                                lineHeight: 1.4, maxWidth: '90%', margin: 0,
                                fontFamily: 'var(--font-display)', fontWeight: 300,
                                fontStyle: isListening ? 'italic' : 'normal'
                            }}
                        >
                            {isListening ? (interimText || "Listening...") : (isLoading ? "Thinking..." : messages[messages.length - 1].text)}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Animated Visualizer Waves */}
                <div style={{ display: 'flex', gap: '8px', height: '60px', alignItems: 'center', marginBottom: '2vh' }}>
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                height: (isListening || isSpeaking || isLoading) ? ['20%', '100%', '40%', '80%', '20%'] : '10%',
                                backgroundColor: isListening ? '#ff4b4b' : (isSpeaking ? '#00ffcc' : (isLoading ? 'var(--accent-color)' : 'rgba(255,255,255,0.2)'))
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 0.8 + (i * 0.15),
                                ease: "easeInOut",
                                delay: i * 0.1
                            }}
                            style={{ width: '6px', borderRadius: '4px', background: 'rgba(255,255,255,0.2)' }}
                        />
                    ))}
                </div>

                {/* The Core Button */}
                <div style={{ position: 'relative', marginTop: '2vh' }}>
                    <motion.button
                        onClick={handleVoiceInput}
                        disabled={isListening || isLoading || isSpeaking}
                        animate={{
                            scale: isListening ? [1, 1.15, 1] : isLoading || isSpeaking ? [1, 1.05, 1] : 1,
                        }}
                        transition={{ repeat: isListening || isLoading || isSpeaking ? Infinity : 0, duration: isListening ? 1.5 : 2 }}
                        style={{
                            width: '160px', height: '160px', borderRadius: '50%',
                            background: isListening ? 'rgba(255, 75, 75, 0.15)' : (isSpeaking ? 'rgba(0, 255, 204, 0.15)' : 'rgba(196, 240, 0, 0.05)'),
                            border: `2px solid ${isListening ? '#ff4b4b' : (isSpeaking ? '#00ffcc' : 'rgba(196, 240, 0, 0.2)')}`,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: isListening ? '0 0 60px rgba(255, 75, 75, 0.2)' : (isSpeaking ? '0 0 60px rgba(0, 255, 204, 0.2)' : '0 0 30px rgba(196, 240, 0, 0.05)'),
                            outline: 'none', zIndex: 10, transition: 'background 0.5s, border-color 0.5s'
                        }}
                        onMouseEnter={(e) => {
                            if (!isListening && !isSpeaking && !isLoading) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.borderColor = 'var(--accent-color)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isListening && !isSpeaking && !isLoading) {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'rgba(196, 240, 0, 0.2)';
                            }
                        }}
                    >
                        <IconMic size={56} color={isListening ? '#ff4b4b' : (isSpeaking ? '#00ffcc' : 'var(--accent-color)')} />
                    </motion.button>

                    {/* Concentric rings while active */}
                    {(isListening || isSpeaking) && (
                        <motion.div
                            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                border: `2px solid ${isListening ? '#ff4b4b' : '#00ffcc'}`, zIndex: 1
                            }}
                        />
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default Lara;
