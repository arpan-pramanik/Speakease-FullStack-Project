import { useEffect, useRef } from 'react';
import { useAIMode } from '../context/AIModeContext';

// Full-screen wave transition effect when toggling AI mode
export const WaveTransition = () => {
    const canvasRef = useRef(null);
    const { isTransitioning, isAIMode } = useAIMode();

    useEffect(() => {
        if (!isTransitioning) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const w = canvas.width = window.innerWidth;
        const h = canvas.height = window.innerHeight;
        let frame = 0;
        const totalFrames = 80;
        let animId;

        const animate = () => {
            frame++;
            const progress = frame / totalFrames;
            ctx.clearRect(0, 0, w, h);

            // Wave sweep from center
            const maxRadius = Math.sqrt(w * w + h * h);
            const radius = progress * maxRadius * 1.2;

            // Draw expanding ring of particles
            const ringParticles = 200;
            for (let i = 0; i < ringParticles; i++) {
                const angle = (i / ringParticles) * Math.PI * 2;
                const spread = (Math.random() - 0.5) * 60;
                const r = radius + spread;
                const px = w / 2 + Math.cos(angle) * r;
                const py = h / 2 + Math.sin(angle) * r;
                const size = Math.random() * 4 + 1;
                const alpha = Math.max(0, 1 - Math.abs(progress - 0.5) * 2) * 0.8;

                if (isAIMode) {
                    // Going INTO AI mode: golden sparkle wave
                    const hue = (angle * 30 + frame * 5) % 360;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${alpha})`;
                    ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${alpha})`;
                } else {
                    // Going OUT of AI mode: cool blue dissolve
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `rgba(100, 130, 220, ${alpha})`;
                    ctx.fillStyle = `rgba(180, 200, 255, ${alpha})`;
                }

                ctx.beginPath();
                ctx.arc(px, py, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Central flash
            if (progress < 0.3) {
                const flashAlpha = (1 - progress / 0.3) * 0.15;
                const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radius * 0.5);
                if (isAIMode) {
                    grad.addColorStop(0, `rgba(196, 240, 0, ${flashAlpha})`);
                } else {
                    grad.addColorStop(0, `rgba(100, 150, 255, ${flashAlpha})`);
                }
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, w, h);
            }

            if (frame < totalFrames) {
                animId = requestAnimationFrame(animate);
            }
        };

        animate();
        return () => cancelAnimationFrame(animId);
    }, [isTransitioning, isAIMode]);

    if (!isTransitioning) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', inset: 0,
                width: '100vw', height: '100vh',
                zIndex: 9998, pointerEvents: 'none',
            }}
        />
    );
};
