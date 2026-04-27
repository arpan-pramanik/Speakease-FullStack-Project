import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

extend({ ShaderMaterial: THREE.ShaderMaterial });

// --- GLSL SHADERS ---
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uInteraction;
    uniform vec3 uBaseColor;
    uniform vec3 uAccentColor;
    varying vec2 vUv;

    // Simplex noise helper
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = vUv;
        vec2 mouse = uMouse * 0.5 + 0.5;
        
        float dist = distance(uv, mouse);
        float ripple = sin(dist * 10.0 - uTime * 2.0) * 0.02 * uInteraction;
        
        float n = snoise(uv * 3.0 + uTime * 0.1 + ripple);
        n += 0.5 * snoise(uv * 6.0 - uTime * 0.2);
        
        vec3 color = mix(uBaseColor, uAccentColor, n);
        color += (1.0 - dist) * 0.1 * uInteraction; // Glow on interaction
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

const NeuralVoid = ({ interactionPower }) => {
    const { isAIMode } = useAIMode();
    const meshRef = useRef();
    const materialRef = useRef();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uInteraction: { value: 0 },
        uBaseColor: { value: new THREE.Color("#010103") },
        uAccentColor: { value: new THREE.Color(isAIMode ? "#00ffcc" : "#4477ff") }
    }), []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            uniforms.uMouse.value.x = (e.clientX / window.innerWidth) * 2 - 1;
            uniforms.uMouse.value.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
        uniforms.uInteraction.value = THREE.MathUtils.lerp(uniforms.uInteraction.value, interactionPower, 0.1);
        uniforms.uAccentColor.value.lerp(new THREE.Color(isAIMode ? "#00ffcc" : "#4477ff"), 0.05);
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
};

const GlitterDust = ({ interactionPower }) => {
    const meshRef = useRef();
    const count = 2000;
    const [positions, speeds] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
            spd[i] = 0.01 + Math.random() * 0.03;
        }
        return [pos, spd];
    }, []);

    useFrame((state) => {
        const posAttr = meshRef.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            let y = posAttr.getY(i);
            y += speeds[i] * (1 + interactionPower * 3);
            if (y > 30) y = -30;
            posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.2} blending={THREE.AdditiveBlending} sizeAttenuation />
        </points>
    );
};

const BackgroundScene = () => {
    const { isAIMode } = useAIMode();
    const [interactionPower, setInteractionPower] = useState(0);

    useEffect(() => {
        const handleAction = () => { setInteractionPower(1.0); setTimeout(() => setInteractionPower(0), 1200); };
        window.addEventListener('click', handleAction);
        return () => window.removeEventListener('click', handleAction);
    }, []);

    return (
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <NeuralVoid interactionPower={interactionPower} />
            <GlitterDust interactionPower={interactionPower} />
            <EffectComposer>
                <Bloom luminanceThreshold={0} intensity={1.5} mipmapBlur />
                <Noise opacity={0.04} />
                <ChromaticAberration offset={[0.001, 0.001]} />
                <Vignette darkness={1.2} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => <BackgroundScene />;
