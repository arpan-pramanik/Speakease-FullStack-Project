import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const containerRef = useRef(null);
    const featuresRef = useRef(null);
    const bentoRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Text Reveal
            gsap.fromTo('.hero-char',
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.05, ease: 'power4.out', delay: 0.5 }
            );

            gsap.fromTo('.hero-sub',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.2 }
            );

            // Parallax Scroll for Hero
            gsap.to('.hero-content', {
                y: 200,
                opacity: 0,
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Features Reveal
            gsap.fromTo('.feature-card',
                { y: 100, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.1, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Bento Box Parallax
            gsap.utils.toArray('.bento-item').forEach((item, i) => {
                gsap.fromTo(item,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: bentoRef.current,
                            start: 'top 75%',
                        },
                        delay: i * 0.1
                    }
                );
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const heroText = "SpeakEase";

    return (
        <div ref={containerRef} style={{ background: 'transparent' }}>
            {/* Hero Section */}
            <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-content" style={{ textAlign: 'center', zIndex: 10, padding: '0 20px', width: '100%' }}>
                    <div style={{ overflow: 'hidden', marginBottom: '20px' }}>
                        <h1 style={{ 
                            fontSize: 'clamp(4rem, 15vw, 15rem)', 
                            fontWeight: 900, 
                            lineHeight: 0.85, 
                            margin: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.06em'
                        }}>
                            {heroText.split('').map((char, i) => (
                                <span key={i} className="hero-char text-accent" style={{ display: 'inline-block' }}>{char}</span>
                            ))}
                        </h1>
                    </div>
                    
                    <div className="hero-sub">
                        <p style={{ 
                            fontSize: 'clamp(1rem, 2vw, 1.5rem)', 
                            color: 'var(--text-primary)', 
                            maxWidth: '800px', 
                            margin: '0 auto 40px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            High-performance language acquisition. Direct, focused, AI-driven.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Link to="/register" className="btn-primary">
                                INIT MODULE
                            </Link>
                            <Link to="/login" className="btn-secondary">
                                SYSTEM LOGIN
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 1 }}
                >
                    <div style={{ width: 2, height: 60, background: 'linear-gradient(to bottom, var(--accent-primary), transparent)' }} />
                </motion.div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} style={{ padding: '120px 4vw', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '80px', color: '#fff', borderLeft: '8px solid var(--accent-primary)', paddingLeft: '24px' }}>
                        CORE<br/>ARCHITECTURE
                    </h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
                        {[
                            { num: '01', title: 'AI Module', desc: 'Real-time conversational practice with the Mistral language model.' },
                            { num: '02', title: 'Lesson Matrix', desc: 'Focused, dynamically generated modules that adapt to your performance data.' },
                            { num: '03', title: 'Global Sync', desc: 'Compete in real-time on global leaderboards and track your execution metrics.' }
                        ].map((feature, i) => (
                            <div key={i} className="feature-card panel" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                                    {feature.num}
                                </div>
                                <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>{feature.title}</h3>
                                <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bento Box Stats */}
            <section ref={bentoRef} style={{ padding: '120px 4vw', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(2, 300px)', gap: '24px' }}>
                        
                        <div className="bento-item panel" style={{ gridColumn: 'span 2', gridRow: 'span 2', padding: '60px', display: 'flex', flexDirection: 'column', justifyItems: 'center', justifyContent: 'center' }}>
                            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', marginBottom: '20px', color: '#fff' }}>DATA<br/>DRIVEN<br/>FLUENCY.</h2>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Over 50,000 active users pushing limits daily.</p>
                            <div style={{ marginTop: 'auto', fontSize: '6rem', fontWeight: 900, color: 'var(--accent-primary)', lineHeight: 1 }}>50K+</div>
                        </div>

                        <div className="bento-item panel" style={{ gridColumn: 'span 1', gridRow: 'span 1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--accent-primary)' }}>
                            <div style={{ color: '#000', fontWeight: 800, textTransform: 'uppercase' }}>SUPPORTED LANGS</div>
                            <div style={{ fontSize: '5rem', fontWeight: 900, color: '#000', lineHeight: 1 }}>10+</div>
                        </div>

                        <div className="bento-item panel" style={{ gridColumn: 'span 1', gridRow: 'span 1', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase' }}>UPTIME</div>
                            <div style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>99%</div>
                        </div>

                        <div className="bento-item panel" style={{ gridColumn: 'span 2', gridRow: 'span 1', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '10px', textTransform: 'uppercase' }}>READY FOR UPLINK?</div>
                                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>BEGIN TRANSMISSION NOW.</div>
                            </div>
                            <Link to="/register" className="btn-primary">DEPLOY</Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '60px 4vw', borderTop: 'var(--border-sharp)', background: 'var(--bg-base)', position: 'relative', zIndex: 10 }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#fff', textTransform: 'uppercase' }}>SpeakEase</span>
                        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>// 2026</span>
                    </div>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Terms of Service</a>
                        <a href="#" style={{ color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase' }}>Contact Engineering</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;