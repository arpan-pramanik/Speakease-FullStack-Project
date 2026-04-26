import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = '555238273851-c8i8tqk5s2tfurji7uii0978lq9qduda.apps.googleusercontent.com';

const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    color: 'var(--text-color)',
    padding: '0.8rem 0',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.3s'
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, googleLogin } = useAuth();
    const navigate = useNavigate();
    const googleBtnRef = useRef(null);

    useEffect(() => {
        if (window.google && GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse
            });
            window.google.accounts.id.renderButton(
                googleBtnRef.current,
                { theme: 'filled_black', size: 'large', shape: 'pill', width: '100%', text: 'signup_with' }
            );
        }
    }, []);

    const handleGoogleResponse = async (response) => {
        const success = await googleLogin(response.credential);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Google authentication failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await register(name, email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Registration failed. Try different credentials.');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="page-section"
            style={{ alignItems: 'center', justifyContent: 'center' }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '3rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                }}
                className="interactive"
            >
                <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>FORGE KEY</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>Create your entity for the experience.</p>

                {error && (
                    <div style={{ color: '#ff4b4b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <input
                        type="text"
                        placeholder="Designation (Name)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-color)'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-color)'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                    />
                    <input
                        type="password"
                        placeholder="Passphrase (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                        onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent-color)'}
                        onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.2)'}
                    />

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            background: 'var(--text-color)',
                            color: 'var(--bg-color)',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '50px',
                            fontFamily: 'var(--font-display)',
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            cursor: 'pointer',
                            letterSpacing: '0.1em',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--accent-color)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--text-color)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    >
                        Materialize
                    </button>
                </form>

                {/* Divider */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0 1.5rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }}></div>
                </div>

                {/* Google Sign-Up */}
                <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>

                {GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE' && (
                    <button
                        onClick={() => setError('Google OAuth requires a valid Client ID. Set GOOGLE_CLIENT_ID in the code.')}
                        style={{
                            width: '100%',
                            padding: '0.85rem',
                            borderRadius: '50px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: 'transparent',
                            color: 'var(--text-color)',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>
                )}

                <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Already known?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-color)' }}>
                        Enter The Portal
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;
