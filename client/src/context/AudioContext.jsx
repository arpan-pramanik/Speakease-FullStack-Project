import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within AudioProvider');
    return context;
};

export const AudioProvider = ({ children }) => {
    const [isSoundOn, setIsSoundOn] = useState(false);
    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);

    useEffect(() => {
        const pref = localStorage.getItem('speakease_sound');
        if (pref === 'true') {
            setIsSoundOn(true);
        }
    }, []);

    const initAudio = () => {
        if (audioCtxRef.current) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);
        masterGainRef.current = master;
    };

    const playClickSound = () => {
        if (!isSoundOn) return;
        if (!audioCtxRef.current) initAudio();

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Soft, glassy metallic plonk
        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    };

    const playHoverSound = () => {
        if (!isSoundOn) return;
        if (!audioCtxRef.current) initAudio();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') return; // Do not force resume on hover

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Very short, quiet tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    };

    const playPreloadSound = () => {
        if (!isSoundOn) return;
        if (!audioCtxRef.current) initAudio();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Majestic soft rising sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.5);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 2.1);
    };

    const toggleSound = () => {
        setIsSoundOn(prev => {
            const next = !prev;
            localStorage.setItem('speakease_sound', next.toString());
            return next;
        });
    };
    return (
        <AudioContext.Provider value={{ isSoundOn, toggleSound, playClickSound, playHoverSound, playPreloadSound }}>
            {children}
        </AudioContext.Provider>
    );
};
