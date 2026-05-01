"use client";

import { useEffect, useRef } from "react";

/**
 * Rotating3DBall Component
 * A standalone, high-performance 3D wireframe ball built with Three.js.
 */
export function Rotating3DBall({ isRevealed = false }: { isRevealed?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Load Three.js from CDN
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE || !canvasRef.current) return;

      // 1. Scene Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true, 
        antialias: true 
      });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 2. The 3D Ball (Icosahedron)
      const geometry = new THREE.IcosahedronGeometry(1.5, 1);
      
      const material = new THREE.MeshPhongMaterial({
        color: isRevealed ? 0x83c5be : 0x333333, // Match theme if revealed
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        emissive: isRevealed ? 0x83c5be : 0x000000,
        emissiveIntensity: isRevealed ? 0.5 : 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 3. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const pointLight = new THREE.PointLight(isRevealed ? 0x83c5be : 0xffffff, 2);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      camera.position.z = 5;

      // 4. Animation Loop
      let clock = new THREE.Clock();
      
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Rotation logic
        mesh.rotation.y = elapsedTime * 0.4;
        mesh.rotation.x = elapsedTime * 0.2;

        // Subtle pulsing effect when "isRevealed" is true
        if (isRevealed) {
          const scale = 1.2 + Math.sin(elapsedTime * 2) * 0.15;
          mesh.scale.set(scale, scale, scale);
        }

        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };

      animate();

      // Handle Window Resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    };
  }, [isRevealed]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 dark:opacity-20"
    />
  );
}
