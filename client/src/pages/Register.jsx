import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = '555238273851-c8i8tqk5s2tfurji7uii0978lq9qduda.apps.googleusercontent.com';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const googleBtnRef = useRef(null);

    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleGoogleResponse });
            window.google.accounts.id.renderButton(googleBtnRef.current, { theme: 'filled_black', size: 'large', width: '100%' });
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        const success = await googleLogin(response.credential);
        if (success) navigate('/dashboard');
        else setError('GOOGLE AUTH FAILED');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (password.length < 6) { setError('PASSWORD REQUIREMENT: 6+ CHARACTERS'); setLoading(false); return; }
        try {
            const success = await register(name, email, password);
            if (success) navigate('/dashboard');
            else setError('REGISTRATION FAILED');
        } catch { setError('SYSTEM ERROR. TRY AGAIN.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="page-container flex-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: '480px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link to="/" style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>SpeakEase</Link>
                </div>
                
                <div className="panel" style={{ padding: '40px' }}>
                    <h1 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>REQUEST ACCESS</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', fontWeight: 600, textTransform: 'uppercase' }}>ESTABLISH OPERATIVE CREDENTIALS</p>
                    
                    {error && <div style={{ background: 'rgba(255, 51, 102, 0.1)', border: '1px solid var(--accent-error)', color: 'var(--accent-error)', padding: '16px', marginBottom: '24px', fontSize: '0.85rem', fontWeight: 800, textAlign: 'center' }}>{error}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>DESIGNATION</label>
                            <input type="text" placeholder="YOUR ALIAS" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '16px', background: 'var(--bg-base)', border: 'var(--border-sharp)', color: '#fff', fontSize: '1rem', fontWeight: 600, outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>EMAIL</label>
                            <input type="email" placeholder="OPERATIVE@NETWORK.COM" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '16px', background: 'var(--bg-base)', border: 'var(--border-sharp)', color: '#fff', fontSize: '1rem', fontWeight: 600, outline: 'none' }} />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-secondary)' }}>PASSWORD</label>
                            <input type="password" placeholder="MINIMUM 6 CHARACTERS" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '16px', background: 'var(--bg-base)', border: 'var(--border-sharp)', color: '#fff', fontSize: '1rem', fontWeight: 600, outline: 'none' }} />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'ESTABLISHING...' : 'CREATE ACCOUNT'}</button>
                    </form>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '32px 0' }}><div style={{ flex: 1, height: 1, background: 'var(--border-sharp)' }}></div><span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase' }}>EXTERNAL AUTH</span><div style={{ flex: 1, height: 1, background: 'var(--border-sharp)' }}></div></div>
                    <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
                </div>
                
                <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ALREADY REGISTERED? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>SIGN IN</Link></p>
            </motion.div>
        </div>
    );
};

export default Register;