import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { useAIMode } from '../context/AIModeContext';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Float } from '@react-three/drei';
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
        m = m*m ; m = m*m ;
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
        float n = snoise(uv * 2.5 + uTime * 0.05 + ripple);
        n += 0.4 * snoise(uv * 5.0 - uTime * 0.1);
        vec3 color = mix(uBaseColor, uAccentColor, n);
        color += (1.0 - dist) * 0.15 * uInteraction;
        gl_FragColor = vec4(color, 1.0);
    }
`;

const FloatingOrbs = () => {
    const { isAIMode } = useAIMode();
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={2} floatIntensity={2} position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 5]}>
                    <mesh>
                        <torusKnotGeometry args={[0.5, 0.1, 100, 16]} />
                        <meshStandardMaterial color={isAIMode ? "#00ffcc" : "#4477ff"} emissive={isAIMode ? "#00ffcc" : "#4477ff"} emissiveIntensity={2} transparent opacity={0.4} />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

const NeuralVoid = ({ interactionPower }) => {
    const { isAIMode } = useAIMode();
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
        <mesh>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial ref={materialRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent />
        </mesh>
    );
};

const ReactiveController = ({ interactionPower, setInteractionPower }) => {
    useFrame(() => { if (interactionPower > 0) setInteractionPower(prev => Math.max(0, prev - 0.015)); });
    return null;
};

const BackgroundScene = () => {
    const { isAIMode } = useAIMode();
    const [interactionPower, setInteractionPower] = useState(0);
    useEffect(() => {
        const handleAction = () => { setInteractionPower(1.0); };
        window.addEventListener('click', handleAction);
        return () => window.removeEventListener('click', handleAction);
    }, []);

    return (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <ReactiveController interactionPower={interactionPower} setInteractionPower={setInteractionPower} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color={isAIMode ? "#00ffcc" : "#7744ff"} />
            <NeuralVoid interactionPower={interactionPower} />
            <FloatingOrbs />
            <EffectComposer>
                <Bloom luminanceThreshold={0.1} intensity={2.0} mipmapBlur />
                <Noise opacity={0.03} />
                <ChromaticAberration offset={[0.0015, 0.0015]} />
                <Vignette darkness={1.3} offset={0.1} />
            </EffectComposer>
        </Canvas>
    );
};

export const InteractiveBackground = () => <BackgroundScene />;
