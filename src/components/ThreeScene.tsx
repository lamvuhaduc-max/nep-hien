'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // ---- Scene / Camera ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 60;

    // ---- Soft circular particle texture ----
    const cv = document.createElement('canvas');
    cv.width = 64; cv.height = 64;
    const ctx = cv.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,   'rgba(255,255,255,1)');
    grad.addColorStop(0.35,'rgba(255,255,255,0.75)');
    grad.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(cv);

    // ---- Main particles ----
    const COUNT  = 280;
    const pos    = new Float32Array(COUNT * 3);
    const col    = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const phase  = new Float32Array(COUNT);

    const GOLD  = new THREE.Color('#c9a86a');
    const BONE  = new THREE.Color('#f5efe0');
    const TERRA = new THREE.Color('#c0562c');
    const TERRA2= new THREE.Color('#e07040');
    const DIM   = new THREE.Color('#7a5840');

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 240;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 130;

      const r = Math.random();
      const c = r < 0.14 ? TERRA : r < 0.22 ? TERRA2 : r < 0.30 ? GOLD : r < 0.60 ? BONE : DIM;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      speeds[i] = 0.15 + Math.random() * 0.55;
      phase[i]  = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.4,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ---- Ambient glow orbs ----
    const ORB = 8;
    const oPos = new Float32Array(ORB * 3);
    const oCol = new Float32Array(ORB * 3);
    for (let i = 0; i < ORB; i++) {
      oPos[i * 3]     = (Math.random() - 0.5) * 200;
      oPos[i * 3 + 1] = (Math.random() - 0.5) * 140;
      oPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      const c = Math.random() < 0.45 ? GOLD : BONE;
      oCol[i * 3] = c.r; oCol[i * 3 + 1] = c.g; oCol[i * 3 + 2] = c.b;
    }
    const orbGeo = new THREE.BufferGeometry();
    orbGeo.setAttribute('position', new THREE.BufferAttribute(oPos, 3));
    orbGeo.setAttribute('color',    new THREE.BufferAttribute(oCol, 3));
    const orbMat = new THREE.PointsMaterial({
      size: 5,
      map: tex,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(orbGeo, orbMat));

    // ---- Mouse parallax ----
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth  - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMouse);

    // ---- Resize ----
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ---- Animation (capped at 30fps) ----
    let raf: number;
    const clock = new THREE.Clock();
    const initPos = pos.slice();
    const INTERVAL = 1000 / 30;
    let lastTime = 0;

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      if (now - lastTime < INTERVAL) return;
      lastTime = now;

      const t = clock.getElapsedTime();
      const attr = geo.attributes.position as THREE.BufferAttribute;
      const arr  = attr.array as Float32Array;

      for (let i = 0; i < COUNT; i++) {
        const sp = speeds[i], ph = phase[i];
        arr[i * 3]     = initPos[i * 3]     + Math.cos(t * sp * 0.4 + ph) * 1.4;
        arr[i * 3 + 1] = initPos[i * 3 + 1] + Math.sin(t * sp * 0.6 + ph) * 1.8;
        arr[i * 3 + 2] = initPos[i * 3 + 2] + Math.sin(t * sp * 0.3 + ph * 1.3) * 0.8;
      }
      attr.needsUpdate = true;

      // Slow global rotation
      particles.rotation.y = t * 0.008;
      particles.rotation.x = Math.sin(t * 0.004) * 0.06;

      // Smooth camera parallax
      camera.position.x += (mx * 16 - camera.position.x) * 0.025;
      camera.position.y += (-my * 10 - camera.position.y) * 0.025;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      geo.dispose(); mat.dispose();
      orbGeo.dispose(); orbMat.dispose();
      tex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden="true"
    />
  );
}
