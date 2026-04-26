import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';

export const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const { playPreloadSound } = useAudio();

    useEffect(() => {
        // Attempt to play the halo opening sound right as the preloader mounts
        playPreloadSound();

        // Simulate initial heavy asset loading before resolving the preloader
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2800);
        return () => clearTimeout(timer);
    }, [playPreloadSound]);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="preloader"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        style={{ display: 'flex', gap: '0.2em' }}
                    >
                        <span>S</span><span>P</span><span>E</span><span>A</span><span>K</span>
                        <span style={{ color: 'var(--accent-color)', marginLeft: '0.2em' }}>E</span>
                        <span style={{ color: 'var(--accent-color)' }}>A</span>
                        <span style={{ color: 'var(--accent-color)' }}>S</span>
                        <span style={{ color: 'var(--accent-color)' }}>E</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
