import { useEffect, useState } from 'react';
import { ContainerScroll } from './components/ui/container-scroll-animation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { AlpeChat } from './components/ui/alpe-chat';
import { ProcessStackCards } from './components/ui/stack-card';
import { Storytelling3DGrid } from './components/ui/3d-story-grid';
import { TextEffect } from './components/ui/text-effect';

const Typewriter = ({ words }: { words: string[] }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(70);

  useEffect(() => {
    let timer = setTimeout(() => {
      const i = loopNum % words.length;
      const fullText = words[i];

      setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2500);
        setTypingSpeed(30);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(70);
      } else {
        setTypingSpeed(isDeleting ? 20 : 50);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, words]);

  return (
    <span className="inline">
      {text}
      <span className="animate-[pulse_1s_ease-in-out_infinite] border-r-[4px] border-[#5bb3f0] ml-1 inline-block h-[0.9em] align-middle"></span>
    </span>
  );
};

function FAQItem({ q, a }: { q: string, a: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className={`faq-item ${active ? 'active' : ''} border-b border-[#333333]`}>
      <button className="faq-q w-full text-left bg-transparent border-none text-white py-6 md:py-8 font-black tracking-tight text-lg md:text-xl font-medium cursor-pointer flex justify-between items-center transition-colors hover:text-[#5bb3f0]" onClick={() => setActive(!active)}>
        {q} 
        <motion.span 
          animate={{ rotate: active ? 45 : 0 }} 
          className="text-2xl font-light"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {active && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[#cccccc] pb-8 text-[0.95rem] md:text-base leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpandableBentoCard({ icon, title, desc, extra, className, index }: any) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setExpanded(!expanded)}
      className={`bg-black/60 backdrop-blur-xl border border-[#333333] rounded-2xl p-6 md:p-10 flex flex-col justify-center cursor-pointer transition-colors hover:border-[#1478BE]/50 overflow-hidden shadow-lg ${className}`}
    >
      <motion.span layout className="text-3xl md:text-4xl mb-4 block">{icon}</motion.span>
      <motion.h3 layout className="font-black tracking-tight text-xl md:text-2xl mb-3 text-white">{title}</motion.h3>
      <motion.p layout className="text-[#cccccc] text-[0.95rem] md:text-base leading-relaxed">{desc}</motion.p>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="border-t border-[#333] pt-6"
          >
            <p className="text-[#888] text-sm md:text-base leading-relaxed mb-4">{extra}</p>
            <span className="text-[#1478BE] text-sm font-medium">Toque para fechar ↑</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);
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

  const [isMobile, setIsMobile] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("Verba de Investimento", verbaOption === 'Outro' ? `R$ ${verbaCustom}` : `R$ ${verbaOption}`);
    formData.append("Serviços Desejados", servicos.length > 0 ? servicos.join(", ") : "Nenhum selecionado");
    
    // Web3Forms config
    formData.append("access_key", "939540a5-96e3-431c-91c6-1fca24db41c7"); // <--- AQUI VAI A CHAVE
    formData.append("subject", "Novo Diagnóstico Solicitado - Alpe");
    formData.append("from_name", "Landing Page Alpe");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      if (res.ok) {
        setIsFormSubmitted(true);
      } else {
        alert("Houve um erro ao enviar. Tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    
    handleResize(); // Init

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            <video 
              autoPlay 
              muted 
              playsInline 
              style={{ backgroundColor: 'black' }}
              poster="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
              className="w-full h-full object-cover"
              onEnded={() => setShowIntro(false)}
            >
              <source src="/intro.mp4" type="video/mp4" />
            </video>
            <button 
              onClick={() => setShowIntro(false)}
              className="absolute bottom-10 right-10 z-[101] text-white/50 hover:text-white border border-white/20 hover:border-white/50 px-6 py-2 rounded-full backdrop-blur-md transition-all font-black tracking-tight tracking-widest text-sm uppercase cursor-pointer"
            >
              Pular
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`dark min-h-screen text-white font-sans selection:bg-[#1478BE] ${showIntro ? 'h-screen overflow-hidden' : ''}`}>
        {/* GLOBAL FIXED BACKGROUNDS */}
        <video autoPlay loop muted playsInline poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" className="fixed top-0 left-0 w-full h-full object-cover -z-20 opacity-80 pointer-events-none grayscale-0">
          <source src="/bg2.mp4" type="video/mp4" />
        </video>
      <div className="fixed top-0 left-0 w-full h-full bg-black/10 -z-10 pointer-events-none"></div>
      <div className="noise"></div>

      {/* PAGE CONTENT */}
      <div className="relative z-10">

      <nav id="navbar" className={`fixed top-0 left-0 w-full py-3 md:py-5 z-50 transition-all duration-300 border-b border-transparent ${scrolled ? 'bg-black/80 backdrop-blur-md border-[#222222] py-2 md:py-4' : ''}`}>
        <div className="container flex items-center justify-between">
          <a href="#" className="font-black tracking-tighter text-3xl md:text-4xl text-white">Alpe.</a>
          <a href="#form-diagnostico" className="inline-flex items-center justify-center px-4 py-2 text-xs md:px-5 md:py-2.5 rounded-lg font-medium md:text-sm transition-all bg-white text-black hover:bg-gray-200 hover:-translate-y-0.5 shadow-lg">
            Agendar Diagnóstico
          </a>
        </div>
      </nav>

      {/* HERO SECTION WITH ACETERNITY SCROLL */}
      <section id="hero" className="relative text-center overflow-hidden">
        <div className="pt-20 pb-0">
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(20,120,190,0.4)_0%,transparent_60%)] -top-[100px] md:-top-[200px] left-1/2 -translate-x-1/2 pointer-events-none -z-10 blur-[20px] md:blur-[60px] opacity-40 md:opacity-60"></div>
          
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
                          className="h-24 sm:h-32 md:h-32 lg:h-48 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] md:drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        />
                      </motion.div>
                      <motion.div style={{ y: heroTextY, opacity: heroOpacity }}>
                        <motion.h1 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight font-bold mb-6 md:mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] md:drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] uppercase min-h-[160px] md:min-h-[180px] lg:min-h-[220px]"
                        >
                          <Typewriter words={[
                            "PARE DE DEPENDER DA SORTE PARA AUMENTAR SUAS VENDAS.",
                            "PARE DE DEPENDER DA SORTE PARA AUMENTAR SEUS LUCROS.",
                            "PARE DE DEPENDER DA SORTE PARA AUMENTAR SUAS CONVERSÕES.",
                            "PARE DE DEPENDER DA SORTE PARA AUMENTAR SEUS RESULTADOS."
                          ]} />
                        </motion.h1>
                        <TextEffect 
                          per="word" 
                          preset="blur"
                          delay={0.7}
                          trigger={!showIntro}
                          className="text-[#cccccc] text-lg sm:text-xl md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-light drop-shadow-md md:drop-shadow-lg"
                        >
                          Vender na internet não precisa ser um pesadelo e você não tem dinheiro para queimar com testes. Nós assumimos o controle e colocamos clientes prontos para comprar direto no seu WhatsApp todos os dias.
                        </TextEffect>
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.8, delay: 0.9 }}
                          className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center"
                        >
                          <a href="#form-diagnostico" className="bg-[#1478BE] text-white px-8 md:px-10 py-4 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-[#5bb3f0] transition-colors shadow-[0_0_30px_rgba(20,120,190,0.5)] md:shadow-[0_0_50px_rgba(20,120,190,0.8)] hover:shadow-[0_0_80px_rgba(91,179,240,1)] hover:-translate-y-1 transform duration-200">
                            Agendar Diagnóstico Gratuito
                          </a>
                        </motion.div>
                      </motion.div>
                    </div>
                  }
                >
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{
                    __html: `
                      <video
                        autoplay
                        loop
                        muted
                        playsinline
                        preload="auto"
                        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                        class="mx-auto rounded-[8px] md:rounded-2xl object-cover h-full w-full object-center shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                      >
                        <source src="/grupo2.mp4" type="video/mp4" />
                      </video>
                    `
                  }}
                />
                </ContainerScroll>
              </div>
            </div>
          </div>
      </section>
      {/* FORM SECTION */}
      <section id="form-diagnostico" className="py-20 border-b border-[#222222] relative flex justify-center items-center">
        <div className="container flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-2xl text-center mb-8"
          >
            <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.1em] mb-3 block">Próximo Passo</span>
            <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-semibold leading-tight tracking-tight mb-4">
              {"Solicite seu\nDiagnóstico"}
            </TextEffect>
            <p className="text-[#cccccc] text-[0.95rem] md:text-base leading-relaxed">Preencha o formulário abaixo para agendarmos uma call estratégica e analisarmos a sua operação.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-[#333] rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!isFormSubmitted ? (
                  <form 
                    className="flex flex-col gap-4" 
                    onSubmit={handleSubmit}
                  >
                    <input type="hidden" name="apikey" value="939540a5-96e3-431c-91c6-1fca24db41c7" />
                    <div>
                      <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Seu Nome</label>
                      <input type="text" name="Nome" required placeholder="João Silva" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-all focus:scale-[1.02]" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">WhatsApp</label>
                      <input type="tel" name="WhatsApp" required placeholder="(11) 99999-9999" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-all focus:scale-[1.02]" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Instagram / Link do Negócio</label>
                      <input type="text" name="Instagram" required placeholder="@suaempresa" className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-all focus:scale-[1.02]" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#888] uppercase tracking-wider mb-1.5 block">Qual a sua principal dificuldade?</label>
                      <textarea name="Dificuldade" rows={2} required placeholder="Ex: Recebo cliques mas não converto..." className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:border-[#1478BE] outline-none transition-all focus:scale-[1.02] resize-none"></textarea>
                    </div>
                  <div>
                    <label className="text-[11px] text-[#888] uppercase tracking-wider mb-2 block">Verba de Investimento <span className="text-[#555] lowercase">(opcional)</span></label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {['200', '300', '400', 'Outro'].map(opt => (
                        <motion.button 
                          key={opt}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setVerbaOption(opt)}
                          className={`py-2 px-1 text-[11px] sm:text-[12px] font-medium rounded-xl border transition-all ${verbaOption === opt ? 'bg-[#1478BE] border-[#1478BE] text-white shadow-[0_0_15px_rgba(20,120,190,0.5)]' : 'bg-[#111] border-[#333] text-[#888] hover:border-[#1478BE] hover:text-white'}`}
                        >
                          {opt === 'Outro' ? opt : `R$ ${opt}`}
                        </motion.button>
                      ))}
                    </div>
                    {verbaOption === 'Outro' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="relative mt-2">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888] text-sm">R$</span>
                        <input 
                          type="number" 
                          placeholder="Ex: 5000" 
                          value={verbaCustom}
                          onChange={(e) => setVerbaCustom(e.target.value)}
                          className="w-full bg-[#111] border border-[#1478BE] rounded-xl pl-10 pr-4 py-3 text-[0.9rem] text-white placeholder-[#555] focus:outline-none shadow-[0_0_15px_rgba(20,120,190,0.2)] transition-all focus:scale-[1.02]"
                        />
                      </motion.div>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] text-[#888] uppercase tracking-wider mb-2 block">O que você precisa?</label>
                    <div className="flex flex-wrap gap-2">
                      {['Site / Landing Page', 'Estratégia de Vendas', 'Gestão de Instagram', 'Tráfego Pago', 'Outro'].map(svc => (
                        <motion.button 
                          key={svc}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setServicos(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc])}
                          className={`px-3 py-1.5 text-[11px] font-medium rounded-full border transition-all ${servicos.includes(svc) ? 'bg-[#1478BE] border-[#1478BE] text-white shadow-[0_0_15px_rgba(20,120,190,0.5)]' : 'bg-[#111] border-[#333] text-[#888] hover:border-[#1478BE] hover:text-white'}`}
                        >
                          {svc}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button 
                    type="submit" 
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.97 }}
                    className={`mt-4 w-full py-4 rounded-xl font-bold text-[0.95rem] transition-all bg-[#1478BE] text-white shadow-[0_0_30px_rgba(20,120,190,0.4)] hover:bg-[#5bb3f0] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Diagnóstico Agora'}
                  </motion.button>
                </form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                  >
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="font-black tracking-tight text-3xl font-bold mb-3">Diagnóstico Solicitado!</h3>
                  <p className="text-[#cccccc] text-lg max-w-sm mx-auto">Tudo certo. Nossa equipe de especialistas entrará em contato em breve pelo WhatsApp para agendarmos sua call estratégica.</p>
                </motion.div>
              )}
            </AnimatePresence>
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
            <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">Atendimento 24/7</span>
            <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-semibold leading-tight mb-6 tracking-tight">
              {"Tire suas dúvidas\nagora mesmo."}
            </TextEffect>
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
      <div className="border-y border-[#222222] py-8 overflow-hidden bg-black/30 backdrop-blur-sm cursor-grab active:cursor-grabbing">
        <motion.div 
          drag="x"
          dragConstraints={{ left: -1000, right: 0 }}
          className="flex gap-20 animate-[scroll_30s_linear_infinite] opacity-40 hover:opacity-100 transition-opacity duration-300"
        >
          {Array(12).fill(['ECOMMERCE', 'SAÚDE', 'INFOPRODUTOS', 'CONSTRUTORAS', 'CLÍNICAS', 'B2B']).flat().map((item, i) => (
            <span key={i} className="font-black tracking-tight font-bold text-xl whitespace-nowrap">{item}</span>
          ))}
        </motion.div>
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
            <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">A Realidade Nua e Crua</span>
            <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-semibold leading-tight mb-6 tracking-tight max-w-3xl">
              {"A sua empresa parou no tempo.\nE o seu concorrente agradece."}
            </TextEffect>
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
            <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.15em] mb-4 block font-bold">O Nosso Processo</span>
            <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
              {"Como funciona o nosso\nprocesso na prática."}
            </TextEffect>
            <p className="text-[#cccccc] text-lg leading-relaxed font-light">
              Nossa engenharia foca em achar o seu cliente ideal, criar desejo e facilitar ao máximo o caminho dele até o momento da compra com você.
            </p>
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
            <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block">O Que Entregamos</span>
            <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-semibold leading-tight mb-10 md:mb-16 tracking-tight">
              {"O arsenal completo\npara dominar seu mercado"}
            </TextEffect>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ExpandableBentoCard 
              index={0}
              className="col-span-1 md:col-span-2 row-span-2 bg-gradient-to-b from-black/80 to-[#081a29]/90 border-[rgba(20,120,190,0.5)]"
              icon="📈"
              title="Tráfego Pago que Vende"
              desc="Nós compramos a atenção das pessoas certas no Google, Facebook e Instagram. Você não paga por visualizações, você paga para botar lucro no fim do mês."
              extra="Nossas campanhas são desenhadas com foco exclusivo em conversão. Criamos criativos validados, otimizamos o custo por lead e acompanhamos toda a jornada do seu cliente até a venda final."
            />
            <ExpandableBentoCard 
              index={1}
              icon="⚡"
              title="Páginas para Vender"
              desc="Sites rápidos, bonitos e extremamente persuasivos. Se o cliente clicar, ele vai sentir a necessidade de falar com você."
              extra="Uma Landing Page mal feita pode destruir seu faturamento. Nós construímos páginas Mobile-First com carregamento instantâneo e copy agressiva."
            />
            <ExpandableBentoCard 
              index={2}
              icon="🔍"
              title="Dominação no Google"
              desc="Fazemos o seu negócio ser a primeira e única opção quando seu cliente pesquisar no Google."
              extra="Estar no topo das pesquisas é garantir demanda qualificada diária. Otimizamos seu perfil e rodamos anúncios na rede de pesquisa."
            />
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
          <span className="font-black tracking-tight text-sm md:text-base text-[#5bb3f0] uppercase tracking-[0.1em] mb-4 block text-center">Papo Reto</span>
          <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-semibold leading-tight mb-10 md:mb-16 tracking-tight text-center">
            Dúvidas Comuns
          </TextEffect>
          
          <div className="flex flex-col">
            <FAQItem 
              q="O que vocês fazem exatamente?" 
              a="Nós fazemos o seu telefone tocar usando a internet. Construímos sites que vendem e rodamos anúncios para botar o cliente certo na sua frente todos os dias." 
            />
            <FAQItem 
              q="Quanto tempo até eu ver clientes chegando?" 
              a="Em até 10 dias toda a estrutura estará pronta e rodando. Os contatos de clientes interessados costumam chegar no seu WhatsApp logo nos primeiros dias após o anúncio ser ativado." 
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
          <TextEffect as="h2" preset="blur" per="word" className="font-black tracking-tight text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Pronto para parar de adivinhar e começar a faturar?
          </TextEffect>
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

      {/* MOBILE STICKY CTA */}
      <AnimatePresence>
        {isMobile && scrolled && !isFormSubmitted && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full z-50 p-4 pb-6 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-[#222222] md:hidden shadow-[0_-10px_60px_rgba(20,120,190,0.5)]"
          >
            <motion.a 
              href="#form-diagnostico" 
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-full py-4 rounded-xl font-bold text-[0.95rem] transition-all bg-[#1478BE] text-white shadow-[0_0_40px_rgba(20,120,190,0.8)] animate-pulse"
            >
              Agendar Diagnóstico Gratuito
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      </div>

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
