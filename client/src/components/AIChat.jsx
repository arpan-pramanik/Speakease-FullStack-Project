import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '../services/gemini';
import { useAuth } from '../context/AuthContext';
import { IconSparkles, IconSend, IconX } from './Icons';

const SYSTEM_PROMPT = `You are SpeakEase AI, a friendly and knowledgeable language learning assistant. You help users learn languages by:
- Teaching vocabulary, grammar, and pronunciation
- Having conversations in the target language
- Explaining cultural context
- Giving practice exercises
- Correcting mistakes gently
Keep responses concise (2-3 sentences max). Be encouraging. If the user speaks in a foreign language, respond in that language with an English translation.`;

export const AIChat = ({ isVisible, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hey there! I'm SpeakEase AI. Ask me anything about languages, or let's have a conversation!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMsg = { role: 'user', text: text.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = newMessages.filter(m => m.role !== 'system').map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                text: m.text
            }));
            const response = await chatWithGemini(chatHistory, SYSTEM_PROMPT);
            const aiMsg = { role: 'ai', text: response };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I had trouble connecting. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                    style={{
                        position: 'fixed',
                        top: 0, right: 0, bottom: 0,
                        width: '420px', maxWidth: '100vw',
                        background: 'rgba(8, 8, 15, 0.98)',
                        backdropFilter: 'blur(30px)',
                        borderLeft: '1px solid rgba(196, 240, 0, 0.15)',
                        zIndex: 9500,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid rgba(196, 240, 0, 0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div>
                            <h3 style={{ color: 'var(--accent-color)', fontSize: '0.9rem', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <IconSparkles size={16} color="var(--accent-color)" /> SPEAKEASE AI
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                                Language learning assistant
                            </p>
                        </div>
                        <button onClick={onClose} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
                            display: 'flex', alignItems: 'center'
                        }}>
                            <IconX size={18} color="var(--text-muted)" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.8rem',
                    }}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '0.8rem 1rem',
                                    borderRadius: msg.role === 'user' ? '15px 15px 5px 15px' : '15px 15px 15px 5px',
                                    background: msg.role === 'user'
                                        ? 'rgba(196, 240, 0, 0.15)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${msg.role === 'user' ? 'rgba(196, 240, 0, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.5,
                                    color: 'var(--text-color)'
                                }}
                            >
                                {msg.text}
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    alignSelf: 'flex-start', padding: '0.8rem 1rem',
                                    background: 'rgba(255,255,255,0.05)', borderRadius: '15px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}
                            >
                                <IconSparkles size={14} color="var(--accent-color)" /> Thinking...
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} style={{
                        padding: '1rem', borderTop: '1px solid rgba(196, 240, 0, 0.1)',
                        display: 'flex', gap: '0.5rem', alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '25px', padding: '0.7rem 1rem',
                                color: 'var(--text-color)', fontSize: '0.9rem',
                                fontFamily: 'var(--font-body)', outline: 'none',
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--accent-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} style={{
                            background: 'var(--accent-color)', border: 'none', borderRadius: '50%',
                            width: '42px', height: '42px', cursor: 'pointer', flexShrink: 0,
                            opacity: input.trim() ? 1 : 0.4, transition: 'opacity 0.3s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <IconSend size={16} color="var(--bg-color)" />
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
