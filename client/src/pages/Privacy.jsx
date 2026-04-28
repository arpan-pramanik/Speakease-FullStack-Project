import { motion } from 'framer-motion';
import { IconArrowLeft } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} /> RETURN
                </button>

                <div style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>SYSTEM DIRECTIVE 02</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>PRIVACY POLICY</h1>
                </div>

                <div className="panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>1. DATA ACQUISITION</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            The platform monitors operative progress, language selection, and module performance to dynamically generate AI content. 
                            We collect basic operative credentials (name, email) upon registration to establish your identity.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>2. NEURAL PROCESSING</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            AI assistance requires transmitting queried vocabulary to secure external neural networks. 
                            No personally identifiable operative data is transmitted during these API exchanges.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>3. DATA SECURITY PROTOCOLS</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            All operative records are heavily encrypted and stored within secure databases. 
                            You have the right to request full termination of your account and permanent deletion of your training records at any time.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Privacy;
