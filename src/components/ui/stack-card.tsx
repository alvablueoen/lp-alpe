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
            className={`card-container-${i} w-full max-w-[500px] mb-[-120px] md:mb-[-150px] relative pt-5 flex justify-center overflow-visible`}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ amount: 0.6 }}
        >
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ ...splash, background }} />
            
            <motion.div 
                variants={cardVariants} 
                className="w-full h-[350px] md:h-[400px] flex flex-col justify-center items-start rounded-3xl p-8 md:p-12 relative overflow-hidden bg-black/60 backdrop-blur-xl border border-[#333] shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                style={{ transformOrigin: "10% 60%" }}
            >
                {/* Background glow based on hues */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ background }}
                />
                
                {/* Top decorative line */}
                <div 
                    className="absolute top-0 left-0 w-full h-1"
                    style={{ background }}
                />

                <div className="relative z-10 w-full">
                    <span className="font-['Space_Grotesk'] text-xs md:text-sm font-bold uppercase tracking-widest block mb-4" style={{ color: hue(data.hueB) }}>
                        Passo {data.step}
                    </span>
                    <h3 className="font-['Space_Grotesk'] text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                        {data.title}
                    </h3>
                    <p className="text-[#cccccc] text-base md:text-lg leading-relaxed">
                        {data.description}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}

const cardVariants: Variants = {
    offscreen: {
        y: 300,
        opacity: 0,
        rotate: 0,
    },
    onscreen: {
        y: 50,
        opacity: 1,
        rotate: -2, // Slight rotation for the stack effect, reduced from -10 to be more readable
        transition: {
            type: "spring",
            bounce: 0.3,
            duration: 0.8,
        },
    },
}

const hue = (h: number) => `hsl(${h}, 100%, 50%)`

const container: React.CSSProperties = {
    maxWidth: 600,
    paddingBottom: 200,
    width: "100%",
}

const splash: React.CSSProperties = {
    clipPath: `path("M 0 303.5 C 0 292.454 8.995 285.101 20 283.5 L 460 219.5 C 470.085 218.033 480 228.454 480 239.5 L 500 430 C 500 441.046 491.046 450 480 450 L 20 450 C 8.954 450 0 441.046 0 430 Z")`,
}

const processData: ProcessStep[] = [
    {
        step: "01",
        title: "A gente acha o furo",
        description: "Olhamos para o seu negócio e mostramos exatamente por onde você está perdendo vendas e clientes hoje. Sem enrolação.",
        hueA: 340,
        hueB: 10,
    },
    {
        step: "02",
        title: "A gente traz o cliente",
        description: "Criamos anúncios na internet focados 100% em atrair quem já tem o cartão na mão e quer comprar. Não ligamos para curtidas.",
        hueA: 205,
        hueB: 245,
    },
    {
        step: "03",
        title: "A gente cria o funil",
        description: "Deixamos tudo automático. O cliente clica no anúncio, entende o que você vende e já cai no seu WhatsApp pedindo orçamento.",
        hueA: 260,
        hueB: 290,
    },
    {
        step: "04",
        title: "A gente pisa no acelerador",
        description: "Quando a máquina começa a dar lucro, a gente aumenta o investimento nos anúncios para multiplicar o seu faturamento rápido.",
        hueA: 100,
        hueB: 140,
    },
]
