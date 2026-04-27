import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const GlitterDust = ({ interactionPower }) => {
    const meshRef = useRef();
    const count = 1500;

    const [positions, speeds] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
            spd[i] = 0.02 + Math.random() * 0.05;
        }
        return [pos, spd];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const posAttr = meshRef.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            const y = posAttr.getY(i);
            // Floating movement
            posAttr.setY(i, y + speeds[i] * (1 + interactionPower * 2));
            if (y > 25) posAttr.setY(i, -25);

            // Subtle sway
            const x = posAttr.getX(i);
            posAttr.setX(i, x + Math.sin(time + i) * 0.01);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#ffffff"
                transparent
                opacity={0.15 + interactionPower * 0.2}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
};

const EliteNebula = ({ interactionPower }) => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();
    const count = 5000;

    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 20 + Math.random() * 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return [pos];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = time * 0.02;
        meshRef.current.rotation.z = time * 0.01;
        const s = (isAIMode ? 1.4 : 1.1) + interactionPower * 0.3;
        meshRef.current.scale.set(s, s, s);
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial
                size={isAIMode ? 0.35 : 0.2}
                color={isAIMode ? "#c4f000" : "#4477ff"}
                transparent
                opacity={0.3 + interactionPower * 0.4}
                blending={THREE.AdditiveBlending}
                sizeAttenuation
            />
        </points>
    );
};

const ReactiveController = ({ interactionPower, setInteractionPower }) => {
    useFrame(() => {
        if (interactionPower > 0) {
            setInteractionPower(prev => Math.max(0, prev - 0.015));
        }
    });
    return null;
};

const BackgroundScene = () => {
    const { isAIMode } = useAIMode();
    const [interactionPower, setInteractionPower] = useState(0);

    useEffect(() => {
        const handleAction = () => {
            setInteractionPower(1.0);
        };
        const handleScroll = () => {
            setInteractionPower(prev => Math.min(prev + 0.15, 0.6));
        };
        window.addEventListener('click', handleAction);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('click', handleAction);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 5, 30], fov: 45 }}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 0, pointerEvents: 'none', background: isAIMode ? '#020205' : '#040408'
            }}
        >
            <ReactiveController interactionPower={interactionPower} setInteractionPower={setInteractionPower} />

            <ambientLight intensity={0.3} />
            <pointLight position={[20, 20, 20]} intensity={3} color={isAIMode ? "#c4f000" : "#7744ff"} />
            <pointLight position={[-20, -20, -20]} intensity={2} color={isAIMode ? "#00ffcc" : "#ff44aa"} />
            <pointLight position={[0, 0, 10]} intensity={interactionPower * 10} color="#ffffff" />

            <EliteNebula interactionPower={interactionPower} />
            <GlitterDust interactionPower={interactionPower} />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.2} intensity={1.5 + interactionPower * 3} mipmapBlur />
                <Noise opacity={0.03} />
                <Vignette offset={0.1} darkness={1.2} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => {
    return <BackgroundScene />;
};
