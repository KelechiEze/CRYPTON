import React, { useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import gsap from 'gsap';

const AuthLayout: React.FC = () => {
    const layoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(layoutRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    }, []);

  return (
    <div ref={layoutRef} className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-600/10 dark:bg-blue-600/20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 dark:bg-purple-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      <main className="w-full max-w-md z-10">
        <Outlet />
      </main>
      <style>{`
        .animate-blob {
            animation: blob 7s infinite;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
        @keyframes blob {
            0% {
                transform: translate(0px, 0px) scale(1);
            }
            33% {
                transform: translate(30px, -50px) scale(1.1);
            }
            66% {
                transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
                transform: translate(0px, 0px) scale(1);
            }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;