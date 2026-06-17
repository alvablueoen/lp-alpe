import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type Message = {
  id: number;
  sender: 'alpe' | 'client';
  text: string;
};

const PREDEFINED_QA = [
  {
    question: "Como funciona o serviço?",
    answer: "Nós fazemos um diagnóstico profundo da sua empresa e então criamos uma máquina de atração de clientes usando tráfego pago e páginas de alta conversão."
  },
  {
    question: "Qual é o orçamento mínimo?",
    answer: "Não exigimos um mínimo engessado, mas recomendamos uma verba inicial que permita o algoritmo otimizar as campanhas rapidamente nas primeiras semanas."
  },
  {
    question: "Em quanto tempo vejo resultados?",
    answer: "Colocamos tudo no ar em até 10 dias. Assim que os anúncios rodam, os primeiros leads qualificados costumam chegar logo nas semanas iniciais."
  },
  {
    question: "Atendem o meu nicho?",
    answer: "Com certeza. Nossa engenharia foca em buscar quem já tem interesse no seu serviço (fundo de funil), seja no B2B, serviços, saúde ou e-commerce."
  }
];

export function AlpeChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'alpe', text: 'Olá! Sou a IA da Alpe. Escolha uma das opções abaixo para saber mais sobre como podemos escalar suas vendas.' }
  ]);
  const [availableOptions, setAvailableOptions] = useState(PREDEFINED_QA);
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendOption = (qaIndex: number) => {
    if (questionCount >= 3) return;

    const qa = PREDEFINED_QA[qaIndex];

    // Remove selected option
    setAvailableOptions(prev => prev.filter(opt => opt.question !== qa.question));

    const userMessage: Message = {
      id: Date.now(),
      sender: 'client',
      text: qa.question
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'alpe',
        text: qa.answer
      };
      setMessages(prev => [...prev, botResponse]);
      setQuestionCount(prev => prev + 1);
    }, 1500); // 1.5s typing delay
  };

  return (
    <div className="relative mx-auto border-[#0B1521] bg-[#0B1521] border-[12px] rounded-[3rem] h-[720px] w-[340px] shadow-[0_20px_60px_rgba(20,120,190,0.3)]">
      {/* Notch */}
      <div className="absolute w-[120px] h-[25px] bg-[#0B1521] top-0 rounded-b-3xl left-1/2 -translate-x-1/2 z-20"></div>

      {/* Phone Screen */}
      <div className="relative rounded-[2.25rem] overflow-hidden w-full h-full bg-[#0E1A29] flex flex-col font-sans">

        {/* Centered Smaller Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
          <img src="/mockup-wallpaper.png" alt="Logo" className="max-w-full max-h-full object-contain" />
        </div>

        {/* Header */}
        <div className="bg-[#0B1521]/80 backdrop-blur-md pt-10 pb-4 px-5 border-b border-[#1478BE]/30 flex items-center z-10 shadow-md">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1478BE] to-[#5bb3f0] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(20,120,190,0.5)] mr-3">
            A.
          </div>
          <div>
            <h3 className="font-['Space_Grotesk'] text-[1.1rem] font-bold text-white leading-tight">Atendente Grupo Alpe</h3>
            <div className="flex items-center text-[0.7rem] text-[#5bb3f0] font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5bb3f0] mr-1.5 animate-pulse"></span>
              Online agora
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-hide relative z-10">

          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id}
              className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9rem] leading-relaxed shadow-sm
                  ${msg.sender === 'client'
                    ? 'bg-[#1478BE] text-white rounded-tr-sm'
                    : 'bg-[#222] text-[#eee] border border-[#333] rounded-tl-sm'
                  }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#222] border border-[#333] rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center w-16 h-10">
                <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-[#888] rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Options) */}
        <div className="bg-[#111] border-t border-[#333] p-4 z-10 relative">
          {questionCount < 3 ? (
            <div className="flex flex-wrap gap-2 justify-center pb-1">
              {availableOptions.map((opt) => {
                const globalIndex = PREDEFINED_QA.findIndex(q => q.question === opt.question);
                return (
                  <button
                    key={globalIndex}
                    onClick={() => handleSendOption(globalIndex)}
                    disabled={isTyping}
                    className="bg-[#1A1A1A] hover:bg-[#1478BE] border border-[#444] hover:border-[#1478BE] text-[#ddd] text-[0.7rem] sm:text-[0.75rem] font-medium rounded-full px-3 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {opt.question}
                  </button>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-[#aaa] text-xs mb-3 leading-relaxed">
                Nossa IA identificou que você tem potencial de escala. Vamos conversar pessoalmente?
              </p>
              <a
                href="#form-diagnostico"
                className="block w-full bg-gradient-to-r from-[#1478BE] to-[#5bb3f0] text-white font-medium py-3 rounded-xl text-sm shadow-[0_0_15px_rgba(20,120,190,0.4)] hover:shadow-[0_0_25px_rgba(20,120,190,0.6)] transition-all"
              >
                Agendar Diagnóstico Gratuito
              </a>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
