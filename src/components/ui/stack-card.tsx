// @ts-nocheck
import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export function ProcessStackCards() {
    return (
        <div className="w-full flex flex-col items-center mt-10 md:mt-20 px-4" style={container}>
            {processData.map((data, i) => (
                <Card i={i} data={data} key={data.title} />
            ))}
        </div>
    )
}

interface ProcessStep {
    title: string;
    description: string;
    hueA: number;
    hueB: number;
    step: string;
}

interface CardProps {
    data: ProcessStep;
    i: number;
}

function Card({ data, i }: CardProps) {
    const background = `linear-gradient(306deg, ${hue(data.hueA)}, ${hue(data.hueB)})`

    return (
        <motion.div
            className={`w-full max-w-[600px] mb-8 md:mb-12 relative flex justify-center`}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div 
                variants={cardVariants} 
                className="w-full min-h-[250px] md:min-h-[300px] flex flex-col justify-center items-start rounded-3xl p-8 md:p-12 relative overflow-hidden bg-white/5 backdrop-blur-lg md:backdrop-blur-3xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_0_20px_rgba(255,255,255,0.1)] hover:border-white/40 transition-all duration-300 group"
            >
                {/* Frost / Ice gradient background */}
                <div 
                    className="absolute inset-0 opacity-10 md:opacity-20 pointer-events-none mix-blend-screen transition-opacity duration-500 group-hover:opacity-30" 
                    style={{ background }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Subtle Snow Decorations */}
                <div className="absolute -top-4 -right-4 text-white/20 text-6xl md:text-8xl blur-[2px] rotate-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">❄️</div>
                <div className="absolute bottom-10 left-4 text-white/10 text-4xl blur-[1px] -rotate-45 pointer-events-none transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-125">❄️</div>
                <div className="absolute top-1/2 left-1/2 text-white/5 text-9xl blur-[8px] pointer-events-none">❄️</div>
                
                {/* Top decorative line */}
                <div 
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background }}
                />

                <div className="relative z-10 w-full">
                    <span className="font-black tracking-tight text-base md:text-lg font-bold uppercase tracking-[0.2em] block mb-4" style={{ color: hue(data.hueB) }}>
                        Passo {data.step}
                    </span>
                    <h3 className="font-black tracking-tight text-2xl md:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                        {data.title}
                    </h3>
                    <p className="text-[#e2e8f0] text-lg md:text-xl leading-relaxed font-medium drop-shadow-sm">
                        {data.description}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

const cardVariants: Variants = {
    offscreen: {
        y: 100,
        opacity: 0,
        scale: 0.95
    },
    onscreen: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.6,
        },
    },
}

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

const container: React.CSSProperties = {
    maxWidth: 800,
    paddingBottom: 100,
    width: "100%",
}

const processData: ProcessStep[] = [
    {
        step: "01",
        title: "A gente acha o furo",
        description: "Olhamos para o seu negócio e mostramos exatamente por onde você está perdendo vendas e clientes hoje. Sem enrolação.",
        hueA: 195, // Icy Cyan
        hueB: 210, // Deep Alpe Blue
    },
    {
        step: "02",
        title: "A gente traz o cliente",
        description: "Criamos anúncios na internet focados 100% em atrair quem já tem o cartão na mão e quer comprar. Não ligamos para curtidas.",
        hueA: 200,
        hueB: 220,
    },
    {
        step: "03",
        title: "A gente cria o funil",
        description: "Deixamos tudo automático. O cliente clica no anúncio, entende o que você vende e já cai no seu WhatsApp pedindo orçamento.",
        hueA: 210,
        hueB: 230,
    },
    {
        step: "04",
        title: "A gente pisa no acelerador",
        description: "Quando as vendas começam a acontecer todos os dias com lucro, nós aumentamos o investimento de forma segura para multiplicar o seu faturamento.",
        hueA: 190,
        hueB: 215,
    },
]
