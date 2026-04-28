import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { IconArrowLeft } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user } = useAuth();
    const { isMuted, toggleMute } = useAudio();
    const navigate = useNavigate();
    
    const [aiLevel, setAiLevel] = useState('MAXIMUM');
    const [notifications, setNotifications] = useState(true);

    const toggleAI = () => {
        setAiLevel(prev => prev === 'MAXIMUM' ? 'STANDARD' : prev === 'STANDARD' ? 'MINIMAL' : 'MAXIMUM');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} /> RETURN
                </button>

                <div style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>SYSTEM CONFIGURATION</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>SETTINGS</h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Profile Readout */}
                    <div className="panel" style={{ padding: '32px' }}>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '24px' }}>OPERATIVE IDENTITY</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>DESIGNATION</div>
                                <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>{user?.name || 'UNKNOWN'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>COMMLINK</div>
                                <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>{user?.email || 'UNAVAILABLE'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 800 }}>CLEARANCE LEVEL</div>
                                <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>LEVEL {user?.level || 1}</div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="panel" style={{ padding: '32px' }}>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '24px' }}>PREFERENCES</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Audio Toggle */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>SYSTEM AUDIO</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Toggle platform sound effects</div>
                                </div>
                                <button onClick={toggleMute} style={{ padding: '8px 24px', background: !isMuted ? 'var(--accent-primary)' : 'transparent', color: !isMuted ? '#000' : 'var(--text-secondary)', border: `1px solid ${!isMuted ? 'var(--accent-primary)' : 'var(--text-secondary)'}`, fontWeight: 800, cursor: 'pointer', transition: 'var(--transition-snappy)' }}>
                                    {!isMuted ? 'ACTIVE' : 'MUTED'}
                                </button>
                            </div>

                            {/* Notifications Toggle */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>PUSH ALERTS</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Receive training reminders</div>
                                </div>
                                <button onClick={() => setNotifications(!notifications)} style={{ padding: '8px 24px', background: notifications ? 'var(--accent-primary)' : 'transparent', color: notifications ? '#000' : 'var(--text-secondary)', border: `1px solid ${notifications ? 'var(--accent-primary)' : 'var(--text-secondary)'}`, fontWeight: 800, cursor: 'pointer', transition: 'var(--transition-snappy)' }}>
                                    {notifications ? 'ENABLED' : 'DISABLED'}
                                </button>
                            </div>

                            {/* AI Intensity */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 800 }}>AI INTENSITY</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Difficulty of AI generated content</div>
                                </div>
                                <button onClick={toggleAI} style={{ padding: '8px 24px', background: 'transparent', color: '#fff', border: '1px solid var(--border-sharp)', fontWeight: 800, cursor: 'pointer', width: '120px' }}>
                                    {aiLevel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
