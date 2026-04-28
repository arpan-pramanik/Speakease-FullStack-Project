import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconArrowLeft } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const Support = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} /> RETURN
                </button>

                <div style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>COMMAND CENTER</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>HELP & SUPPORT</h1>
                </div>

                <div className="panel" style={{ padding: '24px', marginBottom: '32px', border: '1px solid #00ff00', background: 'rgba(0, 255, 0, 0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00ff00', boxShadow: '0 0 10px #00ff00' }} />
                    <span style={{ color: '#00ff00', fontWeight: 900, letterSpacing: '0.1em' }}>SYSTEM STATUS: ALL SYSTEMS NOMINAL</span>
                </div>

                <div className="panel" style={{ padding: '40px' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 900, marginBottom: '24px' }}>SUBMIT OPERATIVE TICKET</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>INCIDENT TYPE</label>
                            <select style={{ width: '100%', padding: '16px', background: 'var(--bg-base)', border: '1px solid var(--border-sharp)', color: '#fff', fontSize: '1rem', outline: 'none' }}>
                                <option>BUG REPORT</option>
                                <option>ACCOUNT ISSUE</option>
                                <option>TRAINING MODULE ERROR</option>
                                <option>GENERAL INQUIRY</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>DESCRIPTION</label>
                            <textarea rows="5" required placeholder="Detail the anomaly..." style={{ width: '100%', padding: '16px', background: 'var(--bg-base)', border: '1px solid var(--border-sharp)', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'vertical' }} />
                        </div>
                        <button type="submit" disabled={status !== 'idle'} className={status === 'success' ? 'btn-secondary' : 'btn-primary'} style={{ width: '100%', padding: '20px', borderColor: status === 'success' ? '#00ff00' : 'var(--accent-primary)', color: status === 'success' ? '#00ff00' : '#000' }}>
                            {status === 'idle' ? 'TRANSMIT TICKET' : status === 'submitting' ? 'TRANSMITTING...' : 'TICKET RECEIVED'}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default Support;
