import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
    const containerRef = useRef(null);
    const title1Ref = useRef(null);
    const title2Ref = useRef(null);
    const descRef = useRef(null);
    const actionRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Pinning the main title sequence
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                    pin: true,
                }
            });

            // Sequence animations
            tl.to(title1Ref.current, { y: '-100vh', opacity: 0, duration: 1, ease: 'power1.inOut' })
                .fromTo(title2Ref.current, { y: '100vh', opacity: 0 }, { y: '0vh', opacity: 1, duration: 1, ease: 'power1.inOut' }, "<0.5")
                .fromTo(descRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, ">-0.5")
                .fromTo(actionRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "<0.2");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{ overflow: 'hidden' }}
        >
            <div
                ref={containerRef}
                style={{
                    height: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                {/* First title layer */}
                <h1
                    ref={title1Ref}
                    style={{
                        position: 'absolute',
                        fontSize: '12vw',
                        fontWeight: 900,
                        lineHeight: 0.8,
                        textAlign: 'center',
                        color: 'var(--text-color)',
                        mixBlendMode: 'difference',
                        zIndex: 10
                    }}
                >
                    SPEAKEASE
                </h1>

                {/* Second title layer */}
                <div
                    ref={title2Ref}
                    style={{
                        position: 'absolute',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10
                    }}
                >
                    <h1
                        style={{
                            fontSize: '10vw',
                            fontWeight: 900,
                            lineHeight: 0.8,
                            textAlign: 'center',
                            color: 'var(--accent-color)',
                        }}
                    >
                        LANGUAGE
                    </h1>
                    <p
                        ref={descRef}
                        style={{
                            marginTop: '2rem',
                            maxWidth: '400px',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            color: 'var(--text-color)',
                            fontWeight: 300,
                            mixBlendMode: 'difference'
                        }}
                    >
                        Learn languages through immersive lessons and AI-powered practice.
                    </p>
                    <div ref={actionRef} style={{ marginTop: '3rem' }} className="interactive">
                        <Link
                            to="/login"
                            style={{
                                fontFamily: 'var(--font-display)',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                                fontSize: '1rem',
                                letterSpacing: '0.2em',
                                padding: '1.5rem 3rem',
                                border: '1px solid var(--accent-color)',
                                borderRadius: '50px',
                                color: 'var(--bg-color)',
                                backgroundColor: 'var(--accent-color)',
                                transition: 'all 0.4s cubic-bezier(0.76, 0, 0.24, 1)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = 'var(--accent-color)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--accent-color)';
                                e.currentTarget.style.color = 'var(--bg-color)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            Start Learning
                        </Link>
                    </div>
                </div>
            </div>

            {/* Spacer to allow scrolling through the pinned animation */}
            <div style={{ height: '300vh', pointerEvents: 'none' }}></div>

        </motion.div>
    );
};

export default Landing;
