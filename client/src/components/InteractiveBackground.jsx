import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const NebulaCloud = ({ interactionPower }) => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();

    const count = 4000;
    const [positions, set] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 18 + Math.random() * 12;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
        }
        return [pos, null];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.03;
            meshRef.current.rotation.z = time * 0.02;

            // Interaction reaction
            const s = (isAIMode ? 1.3 : 1.0) + interactionPower * 0.2 + Math.sin(time * 0.5) * 0.05;
            meshRef.current.scale.set(s, s, s);
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={isAIMode ? 0.45 : 0.25}
                color={isAIMode ? "#c4f000" : "#4477ff"}
                transparent
                opacity={0.35 + interactionPower * 0.3}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const NeuralMesh = ({ interactionPower }) => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();

    const count = 60;
    const [positions] = useMemo(() => {
        const pos = new Float32Array(count * count * 3);
        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                pos[i++] = (x - count / 2) * 0.7;
                pos[i++] = 0;
                pos[i++] = (z - count / 2) * 0.7;
            }
        }
        return [pos];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const posAttr = meshRef.current.geometry.attributes.position;

        for (let i = 0; i < count * count; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);

            const dist = Math.sqrt(x * x + z * z);
            const wave = Math.sin(dist * 0.25 - time * 1.5) + Math.cos(x * 0.2 + time);
            const y = wave * (isAIMode ? 3 : 1.5) * (1 + interactionPower);

            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} position={[0, -10, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.12}
                color={isAIMode ? "#00ffcc" : "#66aaff"}
                transparent
                opacity={0.25 + interactionPower * 0.2}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const Scene = () => {
    const { isAIMode } = useAIMode();
    const [interactionPower, setInteractionPower] = useState(0);

    useEffect(() => {
        const handleAction = () => {
            setInteractionPower(1.0);
            setTimeout(() => setInteractionPower(0), 1000);
        };

        const handleScroll = () => {
            setInteractionPower(prev => Math.min(prev + 0.1, 0.5));
            setTimeout(() => setInteractionPower(0), 500);
        };

        window.addEventListener('click', handleAction);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('click', handleAction);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Lerp interaction power down
    useFrame(() => {
        if (interactionPower > 0) {
            setInteractionPower(prev => Math.max(0, prev - 0.02));
        }
    });

    return (
        <Canvas
            camera={{ position: [0, 8, 25], fov: 45 }}
            style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                zIndex: 0, pointerEvents: 'none',
                background: isAIMode ? '#030308' : '#050505'
            }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[15, 15, 15]} intensity={2} color={isAIMode ? "#c4f000" : "#4499ff"} />
            <pointLight position={[-15, -15, -15]} intensity={1.5} color={isAIMode ? "#00ffcc" : "#ff44ff"} />
            <pointLight position={[0, 0, 20]} intensity={interactionPower * 5} color="white" />

            <NebulaCloud interactionPower={interactionPower} />
            <NeuralMesh interactionPower={interactionPower} />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} intensity={1.5 + interactionPower * 2} />
                <Noise opacity={0.03} />
                <Vignette darkness={1.1} offset={0.1} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => {
    return <Scene />;
};
