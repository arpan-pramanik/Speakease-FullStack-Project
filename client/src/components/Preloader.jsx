import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsComplete(true), 300); // Hold at 100% briefly
                    return 100;
                }
                return prev + Math.floor(Math.random() * 15) + 5; // Fast random jumps
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ 
                        y: '-100%', 
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Sharp bezier curve exit
                    }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: '#050505',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>
                        {/* Status Text */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '0.1em' }}>
                                INITIALIZING SYSTEM
                            </span>
                            <span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 900 }}>
                                {progress > 100 ? 100 : progress}%
                            </span>
                        </div>
                        
                        {/* Progress Bar Container */}
                        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
                            {/* Animated Fill Bar */}
                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    background: 'var(--accent-primary)',
                                    boxShadow: '0 0 10px var(--accent-primary)'
                                }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};