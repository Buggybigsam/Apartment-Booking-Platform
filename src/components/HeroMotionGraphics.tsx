'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Sparkles, ShieldCheck, MapPin, Calendar, ArrowRight, Compass, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroMotionGraphics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCityNode, setActiveCityNode] = useState<string>('New York');
  const { setFilters } = useApp();

  const cities = [
    { name: 'New York', count: '142 listings', color: '#10B981', x: 0.25, y: 0.35 },
    { name: 'Paris', count: '98 listings', color: '#6366F1', x: 0.50, y: 0.45 },
    { name: 'Tokyo', count: '115 listings', color: '#F59E0B', x: 0.78, y: 0.38 },
    { name: 'Miami', count: '84 listings', color: '#EC4899', x: 0.32, y: 0.70 },
    { name: 'London', count: '106 listings', color: '#3B82F6', x: 0.62, y: 0.25 },
  ];

  // Canvas particle & node motion loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate background floating particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw background grid lines (cyber city grid pattern)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating particles and connect close nodes
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // Draw City Nodes with radial pulse glow
      cities.forEach((city) => {
        const nx = city.x * width;
        const ny = city.y * height;
        const isActive = city.name === activeCityNode;

        // Mouse Parallax reaction offset
        const dx = (mouseX - width / 2) * 0.03;
        const dy = (mouseY - height / 2) * 0.03;
        const nodeX = nx + dx;
        const nodeY = ny + dy;

        // Glowing aura pulse
        const pulse = Math.sin(time * 3 + nx) * 6 + (isActive ? 18 : 10);

        // Outer glow gradient
        const grad = ctx.createRadialGradient(nodeX, nodeY, 0, nodeX, nodeY, pulse * 2.5);
        grad.addColorStop(0, city.color + (isActive ? '88' : '33'));
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, pulse * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Connection beam from cursor if close
        const cursorDist = Math.hypot(mouseX - nodeX, mouseY - nodeY);
        if (cursorDist < 180) {
          ctx.strokeStyle = city.color + '66';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(nodeX, nodeY);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Inner solid core node
        ctx.fillStyle = city.color;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isActive ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = isActive ? 2.5 : 1.5;
        ctx.stroke();

        // City Label with Pill Background
        ctx.font = `${isActive ? '600 13px' : '500 11px'} Inter, sans-serif`;
        const labelText = `${city.name.toUpperCase()}`;
        const textWidth = ctx.measureText(labelText).width;

        // Label Card background
        ctx.fillStyle = isActive ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.75)';
        ctx.strokeStyle = isActive ? city.color : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;

        const padX = 10;
        const padY = 5;
        const rectX = nodeX - textWidth / 2 - padX;
        const rectY = nodeY - 32;

        ctx.beginPath();
        ctx.roundRect(rectX, rectY, textWidth + padX * 2, 22, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)';
        ctx.fillText(labelText, rectX + padX, rectY + 15);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeCityNode]);

  const selectCity = (cityName: string) => {
    setActiveCityNode(cityName);
    setFilters((prev) => ({ ...prev, location: cityName }));
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl my-4">
      {/* Background Motion Graphics Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
      />

      {/* Radial Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12 items-center min-h-[580px]">
        {/* Left Column: Hero Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase shadow-inner"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Next-Gen Verified Apartment Booking Platform MVP</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300"
          >
            Find & Book Stays with Guaranteed Availability.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-slate-300 max-w-xl font-normal leading-relaxed"
          >
            Connecting renters directly with property hosts through verified listings, real-time availability calendars, and zero double-booking overlap protection.
          </motion.p>

          {/* Interactive City Selector Chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-2.5 pt-2"
          >
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Interactive Spatial City Explorer:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c.name}
                  onClick={() => selectCity(c.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center gap-1.5 border ${
                    activeCityNode === c.name
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-105'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded-md">
                    {c.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Feature Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Admin Verified</p>
                <p className="text-[11px] text-slate-400">Moderated listings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Live Calendar</p>
                <p className="text-[11px] text-slate-400">Zero double-booking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Instant Request</p>
                <p className="text-[11px] text-slate-400">Auto email alerts</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Floating Motion Graphics 3D Card Stack */}
        <div className="lg:col-span-5 relative min-h-[380px] flex items-center justify-center">
          {/* Card 1: Main Highlight Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -6, rotate: 1 }}
            className="w-full max-w-sm rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-4 shadow-2xl shadow-emerald-500/10 space-y-3 relative z-20"
          >
            <div className="relative h-44 rounded-xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                alt="Modern Penthouse"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Verified Active
              </div>
              <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-bold text-white border border-slate-700">
                $350 <span className="text-xs font-normal text-slate-300">/ night</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white text-base">The Modern Minimalist Loft</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                SoHo, New York · 2 Beds · 2 Baths
              </p>
            </div>

            {/* Simulated Live Availability Grid Pill */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Aug Availability
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[11px]">
                8 Dates Open
              </span>
            </div>
          </motion.div>

          {/* Card 2: Floating Secondary Floating Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: -20 }}
            animate={{ opacity: 0.9, x: 20, y: -40 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -top-4 -right-2 hidden sm:flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 shadow-xl z-10 w-64 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&q=80"
                alt="Paris"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Canal Saint-Martin</p>
              <p className="text-[11px] text-emerald-400 font-medium">Paris · $280/night</p>
            </div>
          </motion.div>

          {/* Card 3: Floating Status Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 40 }}
            animate={{ opacity: 1, x: -20, y: 50 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute -bottom-2 -left-2 flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 shadow-xl z-30 pointer-events-none"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Real-time Sync</p>
              <p className="text-[10px] text-emerald-300">No phantom bookings</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
