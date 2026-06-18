import React, { useRef } from "react";
import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";

export const Storytelling3DGrid = ({ items }: { items: { icon: string; title: string; desc: string; }[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 md:mt-20 perspective-1000">
      {items.map((item, i) => (
        <StoryCard key={i} item={item} index={i} />
      ))}
    </div>
  );
};

const StoryCard = ({ item, index }: { item: any, index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D rotation
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(mouseY, [-0.5, 0.5], ["20deg", "-20deg"]), springConfig);
  const rotateYSpring = useSpring(useTransform(mouseX, [-0.5, 0.5], ["-20deg", "20deg"]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 150, rotateX: 45, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 80 }}
      className="relative w-full h-full perspective-1000"
    >
      <motion.div
        ref={ref}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => {
          const form = document.getElementById("form-diagnostico");
          if (form) form.scrollIntoView({ behavior: "smooth" });
        }}
        className="w-full h-full relative group cursor-pointer"
      >
        {/* Background Glow */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#1478BE]/40 via-purple-500/10 to-red-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-[2rem] blur-2xl" 
          style={{ transform: "translateZ(-80px)" }}
        ></div>
        
        {/* Card Body */}
        <div 
          className="bg-gradient-to-b from-[#111111]/90 to-[#000000]/90 backdrop-blur-xl border border-[#222222] group-hover:border-[#1478BE]/50 rounded-[2rem] p-8 md:p-10 h-full shadow-2xl transition-all duration-500 overflow-hidden relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Animated gradient border line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#1478BE] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" style={{ transform: "translateZ(1px)" }}></div>

          {/* Icon */}
          <div style={{ transform: "translateZ(60px)" }} className="relative w-16 h-16 rounded-2xl bg-black/50 flex items-center justify-center border border-[#333] text-4xl mb-8 group-hover:border-[#1478BE]/50 group-hover:bg-[#1478BE]/10 transition-colors duration-500 shadow-[0_0_0_rgba(0,0,0,0)] group-hover:shadow-[0_0_30px_rgba(20,120,190,0.3)]">
            {item.icon}
          </div>
          
          {/* Content */}
          <h3 style={{ transform: "translateZ(40px)" }} className="font-black tracking-tight text-2xl font-bold mb-4 text-white group-hover:text-[#5bb3f0] transition-colors duration-300">
            {item.title}
          </h3>
          
          <p style={{ transform: "translateZ(20px)" }} className="text-[#aaaaaa] text-base leading-relaxed">
            {item.desc}
          </p>

          {/* Decorative Elements */}
          <div style={{ transform: "translateZ(80px)" }} className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#1478BE]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div style={{ transform: "translateZ(30px)" }} className="mt-8 flex items-center text-sm font-medium text-[#1478BE] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            Descobrir solução <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
