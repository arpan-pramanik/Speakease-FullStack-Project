import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'rgba(5, 5, 5, 0.8)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '4rem 5vw',
            marginTop: 'auto',
            color: 'var(--text-color)',
            zIndex: 1
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '3rem'
            }}>
                {/* Branding */}
                <div>
                    <div style={{ display: 'flex', gap: '0.1em', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                        <span>SPEAK</span>
                        <span style={{ color: 'var(--accent-color)' }}>EASE</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        Mastering languages through AI-powered immersion and cinematic learning experiences.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Resources</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><Link to="/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Dashboard</Link></li>
                        <li><Link to="/languages" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Languages</Link></li>
                        <li><Link to="/leaderboard" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Leaderboard</Link></li>
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Community</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Discord</a></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Twitter</a></li>
                        <li><a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>GitHub</a></li>
                    </ul>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto 0',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
            }}>
                <p>© {currentYear} SpeakEase. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};
