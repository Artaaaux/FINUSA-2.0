"use client";

import { useEffect, useRef } from "react";

export function PremiumBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let anim: number;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const orbs = [
      { x: 0.2, y: 0.15, r: 0.5, dx: 0.0003, dy: 0.0002, color: [37, 99, 235] },
      { x: 0.8, y: 0.25, r: 0.4, dx: -0.0002, dy: 0.0004, color: [167, 139, 250] },
      { x: 0.5, y: 0.7, r: 0.45, dx: 0.0004, dy: -0.0003, color: [0, 217, 255] },
      { x: 0.75, y: 0.8, r: 0.35, dx: -0.0003, dy: -0.0002, color: [16, 185, 129] },
      { x: 0.3, y: 0.5, r: 0.3, dx: 0.0002, dy: 0.0003, color: [99, 102, 241] },
    ];

    const curveColors = [
      { hue: 217, sat: 80, light: 60 },
      { hue: 187, sat: 100, light: 55 },
      { hue: 262, sat: 90, light: 70 },
      { hue: 152, sat: 100, light: 55 },
    ];

    const curves = Array.from({ length: 10 }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.006,
      amp: 30 + Math.random() * 50,
      freq: 0.002 + Math.random() * 0.003,
      yBase: Math.random() * 100,
      color: curveColors[Math.floor(Math.random() * curveColors.length)],
      opacity: 0.06 + Math.random() * 0.06,
      width: 0.6 + Math.random() * 0.8,
    }));

    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const o of orbs) {
        const cx = canvas.width * (o.x + Math.sin(t * o.dx * 100) * 0.05);
        const cy = canvas.height * (o.y + Math.cos(t * o.dy * 100) * 0.05);
        const radius = Math.min(canvas.width, canvas.height) * o.r * (0.9 + 0.1 * Math.sin(t + o.x * 10));

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, 0.035)`);
        grad.addColorStop(0.5, `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, 0.02)`);
        grad.addColorStop(1, `rgba(${o.color[0]}, ${o.color[1]}, ${o.color[2]}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const c of curves) {
        const yOffset = canvas.height * (c.yBase / 100);
        const shift = t * c.speed * 100;

        ctx.beginPath();
        ctx.moveTo(0, yOffset + Math.sin(t * c.freq * 100 + c.phase) * c.amp);

        for (let x = 0; x <= canvas.width; x += 4) {
          const y = yOffset
            + Math.sin(x * c.freq + shift + c.phase) * c.amp
            + Math.sin(x * c.freq * 2.5 + shift * 1.5 + c.phase * 2) * c.amp * 0.3;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `hsla(${c.color.hue}, ${c.color.sat}%, ${c.color.light}%, ${c.opacity})`;
        ctx.lineWidth = c.width;
        ctx.stroke();
      }

      anim = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
