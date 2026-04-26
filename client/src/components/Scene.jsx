import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const ParticleField = () => {
    const mesh = useRef();

    // Create 1000 random particles
    const [positions, scales] = useMemo(() => {
        const pos = new Float32Array(1000 * 3);
        const scale = new Float32Array(1000);
        for (let i = 0; i < 1000; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
            scale[i] = Math.random();
        }
        return [pos, scale];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (mesh.current) {
            mesh.current.rotation.y = time * 0.05;
            mesh.current.position.y = Math.sin(time * 0.2) * 2;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={1000} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-scale" count={1000} array={scales} itemSize={1} />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#c4f000"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const AmbientEnvironment = () => {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 40]} />
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#c4f000" />
            <directionalLight position={[-10, 0, -5]} intensity={0.5} color="#00ffff" />
            <ParticleField />
        </>
    );
};

export const Scene = () => {
    return (
        <div id="canvas-container">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
                <AmbientEnvironment />
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
                    <Noise opacity={0.025} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};
