import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const NebulaCloud = () => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();

    // Create a dense cloud of points
    const count = 3000;
    const [positions, set] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 15 + Math.random() * 10;
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
            meshRef.current.rotation.y = time * 0.05;
            meshRef.current.rotation.z = time * 0.03;

            // Pulse logic
            const s = isAIMode ? 1.2 + Math.sin(time * 0.5) * 0.1 : 1.0;
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
                size={isAIMode ? 0.4 : 0.2}
                color={isAIMode ? "#c4f000" : "#4466ff"}
                transparent
                opacity={0.3}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const NeuralMesh = () => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();

    const count = 50;
    const [positions, set] = useMemo(() => {
        const pos = new Float32Array(count * count * 3);
        let i = 0;
        for (let x = 0; x < count; x++) {
            for (let z = 0; z < count; z++) {
                pos[i++] = (x - count / 2) * 0.8;
                pos[i++] = 0;
                pos[i++] = (z - count / 2) * 0.8;
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

            const dist = Math.sqrt(x * x + z * z);
            const y = Math.sin(dist * 0.3 - time) * (isAIMode ? 2 : 1);

            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef} position={[0, -5, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color={isAIMode ? "#00ffcc" : "#66aaff"}
                transparent
                opacity={0.2}
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
            camera={{ position: [0, 5, 20], fov: 45 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                background: isAIMode ? '#030308' : '#050505'
            }}
        >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color={isAIMode ? "#c4f000" : "#4466ff"} />
            <pointLight position={[-10, -10, -10]} intensity={1} color={isAIMode ? "#00ffcc" : "#ff44ff"} />

            <NebulaCloud />
            <NeuralMesh />

            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} intensity={isAIMode ? 1.5 : 0.8} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => {
    return <BackgroundScene />;
};
