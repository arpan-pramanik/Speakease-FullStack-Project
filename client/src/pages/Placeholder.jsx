import { motion } from 'framer-motion';

const PlaceholderPage = ({ title }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.8 } }}
        className="page-section"
        style={{ justifyContent: 'center', alignItems: 'center' }}
    >
        <h1 style={{ fontSize: '8vw', color: 'var(--accent-color)' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Node undergoing reconstruction...</p>
    </motion.div>
);

export default PlaceholderPage;
