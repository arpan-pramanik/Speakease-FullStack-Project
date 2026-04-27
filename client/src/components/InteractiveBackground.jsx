import { useEffect, useRef } from 'react';
import { useAIMode } from '../context/AIModeContext';

// Subtle floating particles for normal mode + Glitterdust for AI mode
export const InteractiveBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const { isAIMode } = useAIMode();
    const isAIModeRef = useRef(isAIMode);
    const animFrameRef = useRef(null);

    useEffect(() => { isAIModeRef.current = isAIMode; }, [isAIMode]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        const particles = [];
        const PARTICLE_COUNT = 120;

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() * 60 + 200; // blue-purple range default
                this.life = Math.random() * 200 + 100;
                this.maxLife = this.life;
            }
            update() {
                const ai = isAIModeRef.current;
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;
                const dx = mx - this.x;
                const dy = my - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Mouse interaction
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    if (ai) {
                        // AI mode: particles attract to cursor with sparkle
                        this.x += dx * force * 0.02;
                        this.y += dy * force * 0.02;
                        this.opacity = Math.min(1, this.opacity + force * 0.05);
                    } else {
                        // Normal mode: gentle repel
                        this.x -= dx * force * 0.008;
                        this.y -= dy * force * 0.008;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;

                if (this.life <= 0 || this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) {
                    this.reset();
                }
            }
            draw(ctx) {
                const ai = isAIModeRef.current;
                const lifeRatio = this.life / this.maxLife;

                if (ai) {
                    // Glitterdust: gold/cyan sparkles
                    const glitterHue = (Date.now() * 0.05 + this.x * 0.5) % 360;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = `hsla(${glitterHue}, 100%, 70%, ${this.opacity * lifeRatio})`;
                    ctx.fillStyle = `hsla(${glitterHue}, 100%, 80%, ${this.opacity * lifeRatio})`;
                    ctx.beginPath();
                    // Star shape for glitter
                    const s = this.size * 2;
                    for (let i = 0; i < 4; i++) {
                        const angle = (i / 4) * Math.PI * 2 + Date.now() * 0.003;
                        ctx.lineTo(this.x + Math.cos(angle) * s, this.y + Math.sin(angle) * s);
                        ctx.lineTo(this.x + Math.cos(angle + Math.PI / 4) * s * 0.4, this.y + Math.sin(angle + Math.PI / 4) * s * 0.4);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else {
                    // Normal: subtle circles with blue/purple hue
                    ctx.fillStyle = `hsla(${this.hue}, 40%, 70%, ${this.opacity * lifeRatio * 0.4})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        const handleResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        const handleMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouse);

        const animate = () => {
            const ai = isAIModeRef.current;
            ctx.clearRect(0, 0, w, h);

            // Dynamic background gradients (energy fields)
            const time = Date.now() * 0.001;
            const bgGradient = ctx.createRadialGradient(
                w / 2 + Math.cos(time * 0.5) * w / 4,
                h / 2 + Math.sin(time * 0.3) * h / 4,
                0,
                w / 2, h / 2, w
            );

            if (ai) {
                bgGradient.addColorStop(0, 'rgba(196, 240, 0, 0.08)');
                bgGradient.addColorStop(0.5, 'rgba(0, 255, 200, 0.04)');
                bgGradient.addColorStop(1, 'rgba(5, 5, 20, 1)');
            } else {
                bgGradient.addColorStop(0, 'rgba(40, 60, 120, 0.12)');
                bgGradient.addColorStop(0.5, 'rgba(20, 30, 60, 0.06)');
                bgGradient.addColorStop(1, 'rgba(5, 5, 5, 1)');
            }

            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, w, h);

            // Draw connection lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const opacity = (1 - dist / 120) * 0.1;
                        if (ai) {
                            ctx.strokeStyle = `rgba(196, 240, 0, ${opacity * 2.5})`;
                        } else {
                            ctx.strokeStyle = `rgba(100, 130, 255, ${opacity * 1.5})`;
                        }
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Interactive mouse glow
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            if (mx > 0 && my > 0) {
                const mouseGrad = ctx.createRadialGradient(mx, my, 0, mx, my, ai ? 300 : 200);
                if (ai) {
                    mouseGrad.addColorStop(0, 'rgba(196, 240, 0, 0.1)');
                    mouseGrad.addColorStop(0.5, 'rgba(0, 255, 200, 0.05)');
                    mouseGrad.addColorStop(1, 'transparent');
                } else {
                    mouseGrad.addColorStop(0, 'rgba(100, 150, 255, 0.08)');
                    mouseGrad.addColorStop(1, 'transparent');
                }
                ctx.fillStyle = mouseGrad;
                ctx.fillRect(0, 0, w, h);
            }

            particles.forEach(p => { p.update(); p.draw(ctx); });
            animFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouse);
            cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: 0, pointerEvents: 'none',
            }}
        />
    );
};
