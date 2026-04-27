import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

const NeuralWave = () => {
    const meshRef = useRef();
    const { isAIMode } = useAIMode();

    // Create a grid of points
    const count = 40;
    const [positions, set] = useMemo(() => {
        const pos = new Float32Array(count * count * 3);
        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                pos[i++] = x - count / 2;
                pos[i++] = 0;
                pos[i++] = z - count / 2;
            }
        }
        return [pos, null];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const posAttr = meshRef.current.geometry.attributes.position;

        for (let i = 0; i < count * count; i++) {
            const x = posAttr.getX(i);
            const z = posAttr.getZ(i);

            // Wave logic
            const y = isAIMode
                ? (Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time) * 1.5)
                : (Math.sin(x * 0.3 + time * 0.5) * 0.8);

            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;

        meshRef.current.rotation.y = time * 0.1;
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
                size={isAIMode ? 0.25 : 0.15}
                color={isAIMode ? "#c4f000" : "#4466ff"}
                transparent
                opacity={0.4}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const BackgroundScene = () => {
    const { isAIMode } = useAIMode();

    return (
        <Canvas
            camera={{ position: [0, 10, 20], fov: 45 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                background: isAIMode ? '#030310' : '#050505'
            }}
        >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color={isAIMode ? "#c4f000" : "#ffffff"} />

            <NeuralWave />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={isAIMode ? 2 : 1} />
                <Noise opacity={0.03} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => {
    return <BackgroundScene />;
};
