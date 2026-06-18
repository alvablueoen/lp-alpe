"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [1.1, 1.3] : [1.05, 1];
  };

  const rotateDesktop = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const rotateMobile = useTransform(scrollYProgress, [0, 1], [2, 0]);
  const rotate = isMobile ? rotateMobile : rotateDesktop;
  
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[45rem] sm:h-[50rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="max-w-6xl mt-0 md:-mt-12 mx-auto w-[105%] md:w-full relative drop-shadow-[0_40px_100px_rgba(20,120,190,0.3)]"
    >
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-[20px] md:rounded-[30px]">
        <img src="/mockup-pedra.jpg" alt="Macbook Mockup na Pedra" className="absolute inset-0 w-full h-full object-cover" />

        <div 
          className="absolute z-10 flex items-center justify-center overflow-hidden mix-blend-multiply"
          style={{
            top: "24.7%",
            left: "34.2%",
            width: "40.8%",
            height: "44.3%",
            transformOrigin: "center",
            transform: "perspective(1000px) rotateY(8deg) rotateX(14deg) rotateZ(-11deg) skewY(1deg)",
            borderRadius: "5px"
          }}
        >
          <div className="w-[105%] h-[105%] bg-white">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
