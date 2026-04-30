import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Noise, Vignette, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const SpeedLines = () => {
    const linesRef = useRef();
    const count = 300;

    const [positions, scales] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const scale = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            // Distribute lines mostly at the edges, keeping center somewhat clear
            const r = 5 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            pos[i * 3] = r * Math.cos(theta); // x
            pos[i * 3 + 1] = r * Math.sin(theta); // y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // z (depth)
            
            scale[i] = Math.random() * 0.5 + 0.1;
        }
        return [pos, scale];
    }, [count]);

    useFrame((state, delta) => {
        if (!linesRef.current) return;
        
        const posAttr = linesRef.current.geometry.attributes.position;
        const speed = 60 * delta; // Extremely fast movement towards camera

        for (let i = 0; i < count; i++) {
            posAttr.array[i * 3 + 2] += speed;
            if (posAttr.array[i * 3 + 2] > 20) {
                posAttr.array[i * 3 + 2] = -50 - Math.random() * 50; // Reset far back
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <instancedMesh ref={linesRef} args={[null, null, count]}>
            <cylinderGeometry args={[0.02, 0.02, 4, 3]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
            <instancedBufferAttribute attach="geometry-attributes-position" args={[positions, 3]} />
            <instancedBufferAttribute attach="geometry-attributes-scale" args={[scales, 1]} />
        </instancedMesh>
    );
};

const AmbientEnvironment = () => {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 40]} />
            
            {/* Minimalist central glow */}
            <pointLight position={[0, 0, -10]} intensity={2} color="#D2FF00" distance={30} />
            <ambientLight intensity={0.1} />
            
            <SpeedLines />
        </>
    );
};

export const Scene = () => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', background: '#050505' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <AmbientEnvironment />
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                    <Noise opacity={0.25} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};
