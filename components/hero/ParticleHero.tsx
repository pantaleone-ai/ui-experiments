"use client";

import React, { useRef, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";

export default function ParticleHero() {
  return (
    <div className="relative w-full h-screen bg-zinc-950 overflow-hidden font-sans selection:bg-white selection:text-zinc-950">
      {/* 1. The Particle Canvas */}
      <ParticleCanvas />

      {/* 2. Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-20 mix-blend-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 3. Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur-md">
            Skal Ventures Clone
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Build the future.
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl tracking-tight leading-relaxed max-w-lg mx-auto">
            A high-performance particle system built with Framer Motion's
            animation loop and HTML5 Canvas.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-full bg-white text-black font-semibold tracking-tight hover:scale-105 transition-transform active:scale-95">
              Start Building
            </button>
            <button className="px-8 py-3 rounded-full bg-white/10 text-white font-semibold tracking-tight border border-white/10 hover:bg-white/20 transition-colors active:scale-95">
              Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- The Particle Engine ---

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track inputs
  const mouse = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  
  const particles = useRef<Particle[]>([]);

  // Configuration
  const Z_SPEED = 1.0; // Slower, dreamier movement (was 2.0)
  const DEPTH = 2000;
  const FOV = 800;
  const STEER_SENSITIVITY = 0.05;

  // Richer palette with deeper colors
  const COLORS = [
    { r: 255, g: 255, b: 255 }, // White
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 255, b: 255 },
    { r: 200, g: 230, b: 255 }, // Light Ice Blue
    { r: 100, g: 180, b: 255 }, // Deep Sky Blue (New)
    { r: 255, g: 220, b: 180 }, // Soft Amber
    { r: 255, g: 160, b: 100 }, // Deep Orange (New)
  ];

  // Initialize Particles
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Center the "mouse" by default so movement is straight on load
      mouse.current = { x: canvas.width / 2, y: canvas.height / 2 };
      
      // Responsive particle count: Reduce count on mobile for performance/aesthetics
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 400 : 800;
      
      initParticles(canvas.width, canvas.height, count);
    };

    const initParticles = (width: number, height: number, count: number) => {
      particles.current = [];
      for (let i = 0; i < count; i++) {
        const colorProfile = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        particles.current.push({
          x: (Math.random() - 0.5) * width * 4, 
          y: (Math.random() - 0.5) * height * 4,
          z: Math.random() * DEPTH,
          // Increased size diversity: 0.5 to 3.5
          sizeBase: Math.random() * 3 + 0.5, 
          color: colorProfile,
          alpha: Math.random(),
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    resize();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // The Animation Loop
  useAnimationFrame((time, delta) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // 1. Calculate Camera Steering
    // We want the stars to shift opposite to the mouse to simulate looking around
    const targetOffsetX = (mouse.current.x - centerX) * 0.5;
    const targetOffsetY = (mouse.current.y - centerY) * 0.5;

    cameraOffset.current.x += (targetOffsetX - cameraOffset.current.x) * STEER_SENSITIVITY;
    cameraOffset.current.y += (targetOffsetY - cameraOffset.current.y) * STEER_SENSITIVITY;

    // 2. Update and Draw Particles
    particles.current.forEach((p) => {
      p.z -= Z_SPEED;

      if (p.z <= 0) {
        p.z = DEPTH;
        p.x = (Math.random() - 0.5) * width * 4;
        p.y = (Math.random() - 0.5) * height * 4;
        p.alpha = 0; 
      }

      const k = FOV / p.z;
      const x2d = (p.x - cameraOffset.current.x) * k + centerX;
      const y2d = (p.y - cameraOffset.current.y) * k + centerY;

      // Size scales with proximity
      // We scale the random base size by the perspective factor
      const size = Math.max(0, p.sizeBase * k * 0.5);

      // Alpha fading logic
      const zNorm = p.z / DEPTH;
      let targetAlpha = 1;
      if (zNorm > 0.9) targetAlpha = (1 - zNorm) * 10;
      else if (zNorm < 0.2) targetAlpha = zNorm * 5;
      
      p.alpha += (targetAlpha - p.alpha) * 0.1;

      // Only draw if within screen bounds (optimization)
      if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        
        const { r, g, b } = p.color;
        // The alpha is combined with the particle's fade logic
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }
    });
  });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-zinc-950">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

type Particle = {
  x: number;
  y: number;
  z: number;
  sizeBase: number;
  color: { r: number; g: number; b: number };
  alpha: number;
};
