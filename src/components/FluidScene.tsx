import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shader for fluid-like effect
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;

    // Fluid motion - visible flowing effect
    float noise1 = snoise(vec3(uv * 3.0, uTime * 0.2));
    float noise2 = snoise(vec3(uv * 5.0 + 100.0, uTime * 0.15));
    float noise3 = snoise(vec3(uv * 2.0 + 200.0, uTime * 0.25));

    float combined = (noise1 + noise2 * 0.7 + noise3 * 0.4) / 2.1;

    // Colors with visible contrast
    vec3 bgColor = vec3(0.039, 0.039, 0.039);   // #0A0A0A
    vec3 midColor = vec3(0.15, 0.14, 0.12);     // Warm dark gray
    vec3 accentColor = vec3(1.0, 0.72, 0.0);    // #FFB800

    // Visible fluid waves
    vec3 color = mix(bgColor, midColor, combined * 0.6 + 0.5);

    // Strong amber highlights at peaks (25%)
    float highlight = smoothstep(0.1, 0.5, combined);
    color = mix(color, accentColor, highlight * 0.25);

    // Amber glow layer
    float glow = smoothstep(0.3, 0.7, combined);
    color += accentColor * glow * 0.1;

    // Subtle radial gradient toward center
    float centerDist = length(uv - 0.5);
    color += accentColor * smoothstep(0.6, 0.0, centerDist) * 0.08;

    // Soft vignette
    float vignette = 1.0 - smoothstep(0.5, 1.5, centerDist * 1.2);
    color *= vignette * 0.1 + 0.9;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function FluidMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    []
  );

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = (Date.now() - startTime.current) / 1000;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uniforms]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function FluidScene() {
  const [shouldRender, setShouldRender] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for desktop viewport
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateShouldRender = () => {
      setShouldRender(mediaQuery.matches && !motionQuery.matches);
    };

    setReducedMotion(motionQuery.matches);
    updateShouldRender();

    mediaQuery.addEventListener('change', updateShouldRender);
    motionQuery.addEventListener('change', (e) => {
      setReducedMotion(e.matches);
      updateShouldRender();
    });

    return () => {
      mediaQuery.removeEventListener('change', updateShouldRender);
    };
  }, []);

  if (!shouldRender || reducedMotion) {
    // Static gradient fallback
    return (
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 50%, #0A0A0A 100%)',
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ background: '#0A0A0A' }}
        gl={{ antialias: true, alpha: false }}
      >
        <FluidMesh />
      </Canvas>
    </div>
  );
}
