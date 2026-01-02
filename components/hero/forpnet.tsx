"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAnimationFrame } from "framer-motion";
import { CheckCircle2 } from "lucide-react"; 

// --- MOCKED DATA FOR PREVIEW ---
// In your real app, keep importing this from "@/features/home/data/skills"
const SKILLS = [
  { name: "AI Integration", description: "Building agentic workflows and LLM applications." },
  { name: "Full Stack", description: "React, Next.js, Node.js, and cloud infrastructure." },
  { name: "Automation", description: "Streamlining business processes with custom software." },
];

function HeroContent() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 divide-y divide-dashed divide-zinc-700">
      <p className="text-zinc-100 px-4 text-2xl font-semibold tracking-tight sm:text-left sm:text-3xl hidden sm:block pb-2">
        HELLO
      </p>
      <h1 className="text-white px-4 text-[32px] font-semibold tracking-tight sm:text-[40px] sm:text-left py-2">
        <span className="sm:hidden">Hey Hey </span>
        We Create the Future
      </h1>

      <p className="text-zinc-400 px-4 text-lg/8 text-left py-4">
        We help forward-thinking leaders architect the future through AI, automation, agentic workflows, and proprietary digital platforms.
      </p>

      <ul
        className="text-zinc-200 space-y-2 divide-y divide-dashed divide-zinc-700"
        aria-label="Skills and qualifications"
      >
        {SKILLS.map((item, index) => (
          <li
            key={item.name || index}
            className="relative py-2 pl-11 last:mb-0"
          >
            <CheckCircle2
              aria-hidden="true"
              className="absolute left-4 size-5 text-zinc-500 top-1/2 -translate-y-1/2"
            />
            <div className="flex flex-row gap-x-1">
              {item.name && (
                <span className="font-semibold text-zinc-100">
                  {item.name}:
                </span>
              )}
              <span className="text-zinc-400">{item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// --- MAIN COMPONENT ---

export default function Hero() {
  // In your real app, use: const { resolvedTheme } = useTheme();
  const isDark = true; // Forcing dark mode for this preview

  return (
    <div className="relative mx-auto max-w-5xl lg:p-8 bg-zinc-950 overflow-hidden rounded-2xl min-h-[600px] flex items-center">
      
      {/* --- 1. Background Particles & Noise --- */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas />
        <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay">
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
      </div>

      {/* --- 2. Main Content --- */}
      <div className="relative z-10 w-full flex flex-col lg:grid lg:grid-cols-2 lg:gap-x-6">
        
        {/* Image Section (Mocked for Preview) */}
        <div className="w-full lg:col-span-1 mb-8 lg:mb-0">
           {/* Placeholder for your Next/Image */}
          <div className="relative h-full w-full flex items-center justify-center min-h-[300px] bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed">
            <span className="text-zinc-500 text-sm">Profile Image Placeholder</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-1 lg:flex lg:items-center lg:border-l lg:border-dashed lg:border-zinc-800">
          <HeroContent />
        </div>
      </div>
    </div>
  );
}

// --- THE PARTICLE ENGINE (Copy this to your codebase) ---

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track inputs
  const mouse = useRef({ x: 0, y: 0 });
  const cameraOffset = useRef({ x: 0, y: 0 });
  
  const particles = useRef<Particle[]>([]);

  // Configuration
  const Z_SPEED = 1.0; 
  const DEPTH = 2000;
  const FOV = 800;
  const STEER_SENSITIVITY = 0.05;

  const COLORS = [
    { r: 255, g: 255, b: 255 }, // White
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 255, b: 255 },
    { r: 200, g: 230, b: 255 }, // Light Ice Blue
    { r: 100, g: 180, b: 255 }, // Deep Sky Blue
    { r: 255, g: 220, b: 180 }, // Soft Amber
    { r: 255, g: 160, b: 100 }, // Deep Orange
  ];

  // Initialize Particles
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const resize = () => {
      // Use container dimensions instead of window to fit the specific hero section
      if (!containerRef.current || !canvasRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      // Ensure we have valid dimensions
      if (width === 0 || height === 0) return;

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      mouse.current = { x: width / 2, y: height / 2 };
      
      const isMobile = width < 768;
      const count = isMobile ? 400 : 800;
      
      initParticles(width, height, count);
    };

    const initParticles = (width: number, height: number, count: number) => {
      particles.current = [];
      for (let i = 0; i < count; i++) {
        const colorProfile = COLORS[Math.floor(Math.random() * COLORS.length)];
        particles.current.push({
          x: (Math.random() - 0.5) * width * 4, 
          y: (Math.random() - 0.5) * height * 4,
          z: Math.random() * DEPTH,
          sizeBase: Math.random() * 3 + 0.5, 
          color: colorProfile,
          alpha: Math.random(),
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.current = {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
        };
      }
    };

    // Attach listeners
    window.addEventListener("resize", resize);
    // Use container for mouse events to be more specific if possible, 
    // but window is safer for broad strokes
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    
    // Initial resize
    resize();

    // ResizeObserver is often better for specific divs changing size
    const resizeObserver = new ResizeObserver(() => resize());
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      resizeObserver.disconnect();
    };
  }, []);

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

    const targetOffsetX = (mouse.current.x - centerX) * 0.5;
    const targetOffsetY = (mouse.current.y - centerY) * 0.5;

    cameraOffset.current.x += (targetOffsetX - cameraOffset.current.x) * STEER_SENSITIVITY;
    cameraOffset.current.y += (targetOffsetY - cameraOffset.current.y) * STEER_SENSITIVITY;

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
      const size = Math.max(0, p.sizeBase * k * 0.5);

      const zNorm = p.z / DEPTH;
      let targetAlpha = 1;
      if (zNorm > 0.9) targetAlpha = (1 - zNorm) * 10;
      else if (zNorm < 0.2) targetAlpha = zNorm * 5;
      
      p.alpha += (targetAlpha - p.alpha) * 0.1;

      if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        const { r, g, b } = p.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      }
    });
  });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
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
