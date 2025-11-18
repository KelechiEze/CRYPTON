import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Preloader: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cube = cubeRef.current;
    if (cube) {
        gsap.set(cube, { rotationX: -20, rotationY: -30 });
        gsap.to(cube, {
            rotationY: 330,
            rotationX: -40,
            duration: 4,
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true
        });
    }

    gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 1,
        delay: 3.5,
        ease: 'power1.inOut'
    })

  }, []);

  return (
    <div ref={preloaderRef} className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 perspective-1000">
        <div ref={cubeRef} className="relative w-40 h-40 md:w-52 md:h-52 transform-style-3d">
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform translate-z-20 md:translate-z-26"></div>
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform rotate-y-90 translate-x-20 md:translate-x-26 translate-z-20 md:translate-z-26"></div>
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform rotate-y-180 translate-z-20 md:translate-z-26"></div>
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform rotate-y-270 translate-x-neg-20 md:translate-x-neg-26 translate-z-20 md:translate-z-26"></div>
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform rotate-x-90 translate-y-20 md:translate-y-26 translate-z-20 md:translate-z-26"></div>
            <div className="absolute w-full h-full bg-blue-900/40 border border-blue-400 transform rotate-x-270 translate-y-neg-20 md:translate-y-neg-26 translate-z-20 md:translate-z-26"></div>
        </div>
        <h1 className="text-3xl font-bold text-blue-300 mt-12 tracking-widest animate-pulse">PAYCOIN</h1>
        <p className="text-blue-400 mt-2">LET'S START TRADING & MINING TODAY</p>
         <style>{`
            .perspective-1000 { perspective: 1000px; }
            .transform-style-3d { transform-style: preserve-3d; }
            .translate-z-20 { transform: translateZ(2.5rem); }
            .translate-x-20 { transform: rotateY(90deg) translateX(2.5rem); transform-origin: center right; }
            .translate-x-neg-20 { transform: rotateY(-90deg) translateX(-2.5rem); transform-origin: center left; }
            .translate-y-20 { transform: rotateX(90deg) translateY(2.5rem); transform-origin: top center; }
            .translate-y-neg-20 { transform: rotateX(-90deg) translateY(-2.5rem); transform-origin: bottom center; }
            
            @media (min-width: 768px) {
                .md\\:translate-z-26 { transform: translateZ(3.25rem); }
                .md\\:translate-x-26 { transform: rotateY(90deg) translateX(3.25rem); }
                .md\\:translate-x-neg-26 { transform: rotateY(-90deg) translateX(-3.25rem); }
                .md\\:translate-y-26 { transform: rotateX(90deg) translateY(3.25rem); }
                .md\\:translate-y-neg-26 { transform: rotateX(-90deg) translateY(-3.25rem); }
            }
        `}</style>
    </div>
  );
};

export default Preloader;