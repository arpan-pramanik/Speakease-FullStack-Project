import { motion } from 'framer-motion';
import { IconArrowLeft } from '../components/Icons';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page-container">
            <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <IconArrowLeft size={16} /> RETURN
                </button>

                <div style={{ marginBottom: '40px', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 800, letterSpacing: '0.1em' }}>SYSTEM DIRECTIVE 01</span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#fff' }}>TERMS OF SERVICE</h1>
                </div>

                <div className="panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>1. ACCEPTANCE OF DIRECTIVES</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            By accessing the SpeakEase training platform, operatives agree to be bound by these System Directives. 
                            Failure to comply will result in immediate termination of clearance and access to all training modules.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>2. OPERATIVE CONDUCT</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            Operatives are expected to maintain a continuous training streak. AI-assisted modules are provided for personal advancement. 
                            Unauthorized distribution or reverse-engineering of the proprietary neural learning algorithm is strictly prohibited.
                        </p>
                    </section>

                    <section>
                        <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>3. SYSTEM MODIFICATIONS</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
                            Command reserves the right to modify, suspend, or terminate the platform or any operative's access at any time without prior notice. 
                            XP and ranks are digital assets with no real-world value.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default Terms;
