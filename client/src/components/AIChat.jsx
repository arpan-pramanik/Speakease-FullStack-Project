import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithGemini } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = `You are SpeakEase AI, a direct, high-performance language learning assistant. Keep responses concise and tactical.`;

export const AIChat = ({ isVisible, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: "SYSTEM LINK ESTABLISHED. STATE YOUR QUERY." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => document.body.style.overflow = '';
    }, [isVisible]);

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
            setMessages(prev => [...prev, { role: 'ai', text: response }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'COMMUNICATION ERROR. RETRY.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ x: '100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    className="panel"
                    style={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        maxWidth: '480px',
                        zIndex: 9500,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px 0 0 16px',
                        borderLeft: '1px solid var(--accent-primary)',
                        borderTop: 'none',
                        borderBottom: 'none',
                        borderRight: 'none'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '24px',
                        borderBottom: '1px solid var(--border-sharp)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg-base)',
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '4px' }}>AI DIRECTIVE</div>
                            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>SpeakEase Insight</h3>
                        </div>
                        <button onClick={onClose} style={{
                            background: 'transparent',
                            border: '1px solid var(--text-secondary)',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            transition: 'var(--transition-snappy)'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-primary)'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--text-secondary)'; }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div style={{
                        padding: '16px 24px',
                        display: 'flex',
                        gap: 12,
                        overflowX: 'auto',
                        borderBottom: '1px solid var(--border-sharp)',
                        background: 'var(--bg-surface)',
                    }}>
                        {[
                            'TRANSLATE',
                            'GRAMMAR CHECK',
                            'VOCABULARY',
                            'PRACTICE DRILL',
                        ].map((prompt, i) => (
                            <button key={i} onClick={() => sendMessage(prompt)} style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid var(--border-sharp)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'var(--transition-snappy)',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; e.currentTarget.style.color = '#000'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px',
                        background: 'var(--bg-base)',
                    }}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                }}
                            >
                                <div style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    color: msg.role === 'ai' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    textAlign: msg.role === 'user' ? 'right' : 'left',
                                }}>
                                    {msg.role === 'ai' ? 'SYSTEM' : 'USER'}
                                </div>
                                <div style={{
                                    padding: '16px 20px',
                                    background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                                    color: msg.role === 'user' ? '#000' : '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    lineHeight: 1.6,
                                    border: msg.role === 'user' ? 'none' : '1px solid var(--border-sharp)',
                                }}>
                                    <ReactMarkdown
                                        components={{
                                            p: ({ node, ...props }) => <p style={{ margin: 0 }} {...props} />,
                                            strong: ({ node, ...props }) => <strong style={{ fontWeight: 800 }} {...props} />,
                                            code: ({ node, ...props }) => <code style={{
                                                background: 'rgba(0,0,0,0.2)',
                                                padding: '2px 6px',
                                                fontFamily: 'monospace',
                                                fontSize: '0.85em',
                                            }} {...props} />,
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ alignSelf: 'flex-start' }}
                            >
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '8px' }}>SYSTEM</div>
                                <div style={{ padding: '16px 20px', background: 'var(--bg-surface-elevated)', color: '#fff', border: '1px solid var(--border-sharp)', display: 'flex', gap: '8px' }}>
                                    <span>PROCESSING</span>
                                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }}>_</motion.span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{
                        padding: '24px',
                        borderTop: '1px solid var(--border-sharp)',
                        background: 'var(--bg-surface)',
                        display: 'flex',
                        gap: '16px',
                    }}>
                        <input
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="INPUT COMMAND..."
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                background: 'var(--bg-base)',
                                border: '1px solid var(--border-sharp)',
                                padding: '16px',
                                color: '#fff',
                                fontSize: '1rem',
                                fontWeight: 600,
                                outline: 'none',
                            }}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} style={{
                            background: input.trim() ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                            color: input.trim() ? '#000' : 'var(--text-secondary)',
                            border: 'none',
                            padding: '0 24px',
                            fontWeight: 800,
                            cursor: input.trim() ? 'pointer' : 'default',
                            transition: 'var(--transition-snappy)',
                        }}>
                            SEND
                        </button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
    );
};