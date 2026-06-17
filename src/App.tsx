import React, { useEffect, useState, useRef } from 'react';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { GlowingSnowflakes } from './components/ui/glowing-snowflakes';
import { AlpeChat } from './components/ui/alpe-chat';
import { ProcessStackCards } from './components/ui/stack-card';
import { Storytelling3DGrid } from './components/ui/3d-story-grid';


function FAQItem({ q, a }: { q: string, a: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className={`faq-item ${active ? 'active' : ''}`}>
      <button className="faq-q" onClick={() => setActive(!active)}>
        {q} <span className="faq-icon">+</span>
      </button>
      <div className="faq-a" style={{ maxHeight: active ? '200px' : '0px' }}>
        <p>{a}</p>
      </div>
    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introProgress, setIntroProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [verbaOption, setVerbaOption] = useState('200');
  const [verbaCustom, setVerbaCustom] = useState('');
  const [servicos, setServicos] = useState<string[]>([]);

  // Storytelling Scroll Logic
  const { scrollYProgress } = useScroll();
  const logoScale = useTransform(scrollYProgress, [0, 0.05], [1.5, 0.8]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.2]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center cursor-pointer"
            onClick={() => setShowIntro(false)}
          >
            <video 
              autoPlay 
              muted 
              playsInline 
              onTimeUpdate={(e) => {
                const target = e.target as HTMLVideoElement;
                setIntroProgress((target.currentTime / target.duration) * 100);
              }}
              onEnded={() => setShowIntro(false)}
              className="w-full h-full object-cover md:object-contain bg-black"
            >
              <source src="/intro.mp4" type="video/mp4" />
            </video>
            
            {/* PROGRESS BAR */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
              <div 
                className="h-full bg-[#1478BE] transition-all duration-100 ease-linear" 
                style={{ width: `${introProgress}%` }}
              ></div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-light tracking-widest animate-pulse">
              Clique para pular
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`dark min-h-screen text-white font-sans selection:bg-[#1478BE] ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
        {/* GLOBAL FIXED BACKGROUNDS */}
      <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-full h-full object-cover -z-20 opacity-30 pointer-events-none grayscale-[50%]">
        <source src="/bg2.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 -z-10 pointer-events-none"></div>
      <div className="noise"></div>
      <GlowingSnowflakes />

      <nav id="navbar" className={`fixed top-0 left-0 w-full py-3 md:py-5 z-50 transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-black/80 backdrop-blur-md border-[#222222] py-2 md:py-4' : ''}`}>
        <div className="container flex items-center justify-between">
          <a href="#" className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold text-white tracking-tight">Alpe.</a>
          <a href="#form-diagnostico" className="inline-flex items-center justify-center px-4 py-2 text-xs md:px-5 md:py-2.5 rounded-lg font-medium md:text-sm transition-all bg-white text-black hover:bg-gray-200 hover:-translate-y-0.5 shadow-lg">
            Agendar Diagnóstico
          </a>
        </div>
      </nav>

      {/* HERO SECTION WITH ACETERNITY SCROLL */}
      <section id="hero" className="relative text-center overflow-hidden pt-20 pb-0">
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(20,120,190,0.4)_0%,transparent_60%)] -top-[100px] md:-top-[200px] left-1/2 -translate-x-1/2 pointer-events-none -z-10 blur-[40px] md:blur-[60px] opacity-60"></div>
        
        <div className="container relative z-10 pt-4 md:pt-10">
          <div className="flex flex-col overflow-hidden">
            <ContainerScroll
              titleComponent={
                <div className="mb-6 md:mb-10 pt-10 md:pt-20">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ scale: logoScale, opacity: logoOpacity }}
                    className="flex justify-center mb-8 md:mb-16 origin-center"
                  >
                    <img 
                      src="/logo-white.png" 
                      alt="Grupo Alpe" 
                      className="h-32 md:h-48 lg:h-56 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    />
                  </motion.div>
                  <motion.div style={{ y: heroTextY, opacity: heroOpacity }}>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mt-1 leading-[1.2] md:leading-[1.1] text-white mb-4 md:mb-6 font-['Space_Grotesk'] tracking-tight px-2">
                      Pare de perder dinheiro com<br className="hidden md:block" /> marketing amador.
                    </h1>
                    <p className="text-sm md:text-lg text-[#cccccc] max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
                      Existe um problema invisível na sua operação drenando o seu caixa agora mesmo. Nós localizamos o vazamento e implementamos a engenharia de tráfego e conversão definitiva para você escalar.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center px-4">
                      <a href="#form-diagnostico" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 md:px-7 md:py-3.5 rounded-lg font-medium text-sm md:text-[0.95rem] transition-all bg-[#1478BE] text-white shadow-[0_0_20px_rgba(20,120,190,0.4)] hover:bg-[#5bb3f0] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(20,120,190,0.4)]">Agendar Diagnóstico Gratuito</a>
                      <a href="#metodo" className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 md:px-7 md:py-3.5 rounded-lg font-medium text-sm md:text-[0.95rem] transition-all bg-black/50 backdrop-blur-md border border-[#444444] text-white hover:bg-black/80 hover:border-[#666666]">Entender a Metodologia</a>
                    </div>
                  </motion.div>
                </div>
              }
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="mx-auto rounded-2xl object-cover h-full w-full object-center"
              >
                <source src="/grupo2.mp4" type="video/mp4" />
              </video>
            </ContainerScroll>
          </div>
        </div>
      </section>

            {/* FORM SECTION (MOVED TO TOP) */}
      <section id="form-diagnostico" className="py-20 border-b border-[#222222] relative flex justify-center items-center">
        <div className="container flex flex-col items-center justify-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl text-center mb-8"
          >
            <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.1em] mb-3 block">Próximo Passo</span>
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold leading-tight tracking-tight mb-4">Solicite seu<br/>Diagnóstico</h2>
            <p className="text-[#cccccc] text-[0.95rem] md:text-base leading-relaxed">Preencha o formulário abaixo para agendarmos uma call estratégica e analisarmos a sua operação.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-[#333] rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          >
            <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert('Formulário enviado com sucesso!'); }}>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Seu Nome</label>
                  <input type="text" required placeholder="João Silva" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">WhatsApp</label>
                  <input type="tel" required placeholder="(11) 99999-9999" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Instagram / Link do Negócio</label>
                  <input type="text" required placeholder="@suaempresa" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Qual a sua principal dificuldade?</label>
                  <textarea rows={2} required placeholder="Ex: Recebo cliques mas não converto..." className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-colors resize-none"></textarea>
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-2 block">Verba de Investimento <span className="text-[#555] lowercase">(opcional)</span></label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {['200', '300', '400', 'Outro'].map(opt => (
                      <button 
                        key={opt}
                        type="button"
                        onClick={() => setVerbaOption(opt)}
                        className={`py-2 px-1 text-[11px] sm:text-[12px] font-medium rounded-xl border transition-all ${verbaOption === opt ? 'bg-[#1478BE] border-[#1478BE] text-white shadow-[0_0_15px_rgba(20,120,190,0.5)]' : 'bg-[#111] border-[#333] text-[#888] hover:border-[#1478BE] hover:text-white'}`}
                      >
                        {opt === 'Outro' ? opt : `R$ ${opt}`}
                      </button>
                    ))}
                  </div>
                  {verbaOption === 'Outro' && (
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] text-sm">R$</span>
                      <input 
                        type="number" 
                        placeholder="Ex: 5000" 
                        value={verbaCustom}
                        onChange={(e) => setVerbaCustom(e.target.value)}
                        className="w-full bg-[#111] border border-[#1478BE] rounded-xl pl-10 pr-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:outline-none shadow-[0_0_15px_rgba(20,120,190,0.2)] transition-all"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-[#888] uppercase tracking-wider mb-2 block">O que você precisa?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Site / Landing Page', 'Estratégia de Vendas', 'Gestão de Instagram', 'Tráfego Pago', 'Outro'].map(svc => (
                      <button 
                        key={svc}
                        type="button"
                        onClick={() => setServicos(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc])}
                        className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${servicos.includes(svc) ? 'bg-[#1478BE] border-[#1478BE] text-white shadow-[0_0_15px_rgba(20,120,190,0.5)]' : 'bg-[#111] border-[#333] text-[#888] hover:border-[#1478BE] hover:text-white'}`}
                      >
                        {svc}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button type="submit" className="mt-4 w-full py-4 rounded-xl font-bold text-[0.95rem] transition-all bg-[#1478BE] text-white shadow-[0_0_30px_rgba(20,120,190,0.4)] hover:bg-[#5bb3f0] cursor-pointer hover:-translate-y-1">
                  Solicitar Diagnóstico Agora
                </button>
              </form>
          </motion.div>
        </div>
      </section>

      {/* AI CHAT MOCKUP SECTION */}
      <section id="chat-ia" className="py-20 border-b border-[#222222] relative flex flex-col justify-center items-center overflow-hidden">
        <div className="container flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">Atendimento 24/7</span>
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold leading-tight mb-6 tracking-tight">Tire suas dúvidas<br/>agora mesmo.</h2>
            <p className="text-[#cccccc] text-[0.95rem] md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
              Desenvolvemos assistentes virtuais inteligentes que conversam com seus clientes, quebram objeções e fecham vendas de forma automática enquanto você dorme.
            </p>
            <p className="text-[#888] text-sm flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Teste na prática conversando com a nossa IA ao lado.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 150, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex-1 w-full flex justify-center lg:justify-end"
          >
            <AlpeChat />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-[#222222] py-8 overflow-hidden bg-black/30 backdrop-blur-sm">
        <div className="flex gap-20 animate-[scroll_30s_linear_infinite] opacity-40 grayscale">
          {Array(12).fill(['ECOMMERCE', 'SAÚDE', 'INFOPRODUTOS', 'CONSTRUTORAS', 'CLÍNICAS', 'B2B']).flat().map((item, i) => (
            <span key={i} className="font-['Space_Grotesk'] font-bold text-xl whitespace-nowrap">{item}</span>
          ))}
        </div>
      </div>

      {/* THE BOTTLENECK */}
      <section id="problema" className="py-20 md:py-32 border-b border-[#222222] relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">A Realidade Nua e Crua</span>
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold leading-tight mb-6 tracking-tight max-w-3xl">A sua empresa parou no tempo.<br/>E o seu concorrente agradece.</h2>
          </motion.div>
          
          <Storytelling3DGrid 
            items={[
              { icon: '💸', title: 'Queimando Dinheiro', desc: 'Você gasta com anúncios que não trazem retorno. Paga caro por cliques de pessoas curiosas que nunca vão comprar de você.' },
              { icon: '👻', title: 'Invisível na Internet', desc: 'Quando alguém pesquisa pelo seu serviço no Google, quem aparece é o seu concorrente. Você está perdendo vendas de graça.' },
              { icon: '📉', title: 'Site Amador e Lento', desc: 'Até entra gente no seu site, mas ele é confuso, feio ou lento. O cliente desiste de falar com você e vai embora.' }
            ]} 
          />
        </div>
      </section>

      {/* METHODOLOGY (STACK CARDS) */}
      <section id="metodo" className="py-24 md:py-32 border-b border-[#222222] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1478BE]/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="container relative z-10 flex flex-col items-center">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.15em] mb-4 block font-bold">O Nosso Processo</span>
            <h2 className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">Como construímos a sua<br/>máquina de vendas.</h2>
            <p className="text-lg text-[#cccccc]">Sem termos técnicos difíceis e sem focar em "curtidas". Um método bruto e previsível focado em injetar lucro no seu caixa.</p>
          </div>

          <ProcessStackCards />
        </div>
      </section>

      {/* SOLUTIONS BENTO */}
      <section id="solucoes" className="py-20 md:py-32 border-b border-[#222222] relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">O Que Entregamos</span>
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold leading-tight mb-10 md:mb-16 tracking-tight">O arsenal completo<br/>para dominar seu mercado</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-b from-black/80 to-[#081a29]/90 backdrop-blur-xl border border-[rgba(20,120,190,0.5)] rounded-2xl p-6 md:p-10 flex flex-col justify-center shadow-lg"
            >
              <span className="text-3xl md:text-4xl mb-4 md:mb-5 block">📈</span>
              <h3 className="font-['Space_Grotesk'] text-2xl md:text-3xl mb-3 md:mb-4">Tráfego Pago que Vende</h3>
              <p className="text-[#cccccc] text-sm md:text-lg max-w-md mb-6 leading-relaxed">Nós compramos a atenção das pessoas certas no Google, Facebook e Instagram. Você não paga por "visualizações", você paga para botar lucro no fim do mês.</p>
              <a href="#form-diagnostico" className="text-[#5bb3f0] text-sm md:text-base font-medium hover:underline">Saber mais →</a>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-black/60 backdrop-blur-xl border border-[#333333] rounded-2xl p-10 flex flex-col justify-center"
            >
              <span className="text-2xl mb-4 block">⚡</span>
              <h3 className="font-['Space_Grotesk'] text-xl mb-3">Páginas Feitas Para Vender</h3>
              <p className="text-[#cccccc]">Sites rápidos, bonitos e extremamente persuasivos. Se o cliente clicar, ele vai sentir a necessidade de falar com você.</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-black/60 backdrop-blur-xl border border-[#333333] rounded-2xl p-10 flex flex-col justify-center"
            >
              <span className="text-2xl mb-4 block">🔍</span>
              <h3 className="font-['Space_Grotesk'] text-xl mb-3">Dominação no Google</h3>
              <p className="text-[#cccccc]">Fazemos o seu negócio ser a primeira e única opção quando seu cliente pesquisar no Google.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32 border-b border-[#222222] relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="container max-w-3xl bg-black/50 backdrop-blur-xl border border-[#333333] rounded-3xl p-6 md:p-12 shadow-xl"
        >
          <span className="font-['Space_Grotesk'] text-[0.75rem] md:text-[0.85rem] text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block text-center">Papo Reto</span>
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-semibold leading-tight mb-10 md:mb-16 tracking-tight text-center">Dúvidas Comuns</h2>
          
          <div className="flex flex-col">
            <FAQItem 
              q="O que vocês fazem exatamente?" 
              a="Nós fazemos o seu telefone tocar usando a internet. Construímos sites que vendem e rodamos anúncios para botar o cliente certo na sua frente todos os dias." 
            />
            <FAQItem 
              q="Quanto tempo demora pra ver resultado?" 
              a="Em até 10 dias sua nova máquina de vendas está pronta e no ar. Os resultados (leads e contatos) costumam aparecer logo nas primeiras semanas com os anúncios rodando." 
            />
            <FAQItem 
              q="Qual a diferença de vocês pra uma agência comum?" 
              a="A agência comum quer fazer posts bonitinhos pra você ganhar curtidas. Nós não ligamos pra curtidas. Nosso único objetivo é aumentar o seu faturamento e atrair clientes de verdade." 
            />
          </div>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section id="cta" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1478BE]/10 z-0"></div>
        <div className="container relative z-10 text-center">
          <h2 className="font-['Space_Grotesk'] text-3xl md:text-5xl font-bold mb-6 tracking-tight">Pronto para parar de adivinhar e começar a faturar?</h2>
          <p className="text-xl text-[#cccccc] mb-10 max-w-2xl mx-auto">
            Agende uma análise gratuita da sua operação e descubra exatamente onde você está perdendo dinheiro.
          </p>
          <a href="#form-diagnostico" className="inline-block px-10 py-5 bg-[#1478BE] text-white font-bold rounded-lg text-lg shadow-[0_0_30px_rgba(20,120,190,0.5)] hover:bg-[#5bb3f0] hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(20,120,190,0.7)] transition-all">
            Quero meu Diagnóstico Gratuito
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-[#222222] text-[#888888] bg-black/60 backdrop-blur-sm text-sm">
        <p>© 2026 Alpe Marketing. Estratégia e Performance.</p>
      </footer>

      {/* ANIMATION KEYFRAMES */}
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .faq-item { border-bottom: 1px solid #333333; }
        .faq-q { width: 100%; text-align: left; background: none; border: none; color: #fff; padding: 32px 0; font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: color 0.2s; }
        .faq-q:hover { color: #5bb3f0; }
        .faq-icon { font-size: 1.5rem; font-weight: 300; transition: transform 0.3s; }
        .faq-a { overflow: hidden; transition: max-height 0.4s ease; }
        .faq-a p { color: #cccccc; padding-bottom: 32px; font-size: 1rem; }
        .faq-item.active .faq-icon { transform: rotate(45deg); }
      `}</style>
    </div>
    </>
  );
}

export default App;
