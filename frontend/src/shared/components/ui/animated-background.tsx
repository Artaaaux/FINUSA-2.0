"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const lines: {
      x: number;
      y: number;
      angle: number;
      speed: number;
      length: number;
      width: number;
      opacity: number;
      hue: number;
    }[] = [];

    const colors = [
      { hue: 217, sat: 80, light: 55 }, // blue
      { hue: 187, sat: 100, light: 50 }, // cyan
      { hue: 262, sat: 90, light: 70 }, // purple
      { hue: 152, sat: 100, light: 50 }, // green
    ];

    const createLine = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      angle: Math.random() * Math.PI * 2,
      speed: 0.08 + Math.random() * 0.12,
      length: 80 + Math.random() * 160,
      width: 0.5 + Math.random() * 1.5,
      opacity: 0.08 + Math.random() * 0.12,
      hue: colors[Math.floor(Math.random() * colors.length)].hue,
    });

    for (let i = 0; i < 35; i++) lines.push(createLine());

    const draw = () => {
      time += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (const l of lines) {
        l.angle += (Math.sin(time + l.x * 0.01) * 0.006 + l.speed * 0.008);
        l.x += Math.cos(l.angle) * l.speed;
        l.y += Math.sin(l.angle) * l.speed;

        if (l.x < -100) l.x = canvas.width + 100;
        if (l.x > canvas.width + 100) l.x = -100;
        if (l.y < -100) l.y = canvas.height + 100;
        if (l.y > canvas.height + 100) l.y = -100;

        const endX = l.x + Math.cos(l.angle) * l.length;
        const endY = l.y + Math.sin(l.angle) * l.length;

        const dx = l.x - centerX;
        const dy = l.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(canvas.width, canvas.height) * 0.7;
        const distFactor = Math.max(0, 1 - dist / maxDist);

        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `hsla(${l.hue}, 80%, 60%, ${l.opacity + distFactor * 0.1})`;
        ctx.lineWidth = l.width + distFactor * 0.8;
        ctx.stroke();
      }

      ctx.beginPath();
      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          const dx = lines[i].x - lines[j].x;
          const dy = lines[i].y - lines[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(lines[i].x, lines[i].y);
            ctx.lineTo(lines[j].x, lines[j].y);
            ctx.strokeStyle = `hsla(${lines[i].hue}, 70%, 55%, ${0.03 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
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
