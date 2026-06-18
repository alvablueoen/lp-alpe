// @ts-nocheck
import React, { useEffect, useRef } from 'react';

export function GlowingSnowflakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const isMobile = width <= 768;
    const particles: any[] = [];
    const particleCount = isMobile ? 50 : 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 2, // radius increased
        d: Math.random() * particleCount, // density
        speedY: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.8 + 0.4, // increased opacity
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let lastScrollY = window.scrollY;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Efeito Parallax com o scroll
      particles.forEach(p => {
        p.y -= deltaY * (p.r * 0.4); // Flocos maiores se movem mais rápido
      });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.01;

      particles.forEach(p => {
        // Movimento contínuo de queda e oscilação
        p.y += p.speedY;
        p.x += Math.sin(angle + p.d) * 1 + p.speedX;

        // Repulsão com o mouse (interatividade)
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          // Afasta o floco
          p.x -= dx * 0.03;
          p.y -= dy * 0.03;
        }

        // Voltar para a tela se sair (loop infinito)
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -50) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        // Desenhar
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Efeito de Glow Intenso (Reduzido no mobile para não travar)
        ctx.shadowBlur = isMobile ? 5 : 25;
        ctx.shadowColor = 'rgba(91,179,240,1)';
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[0]"
      style={{ willChange: 'transform, opacity' }}
    />
  );
}
