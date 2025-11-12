import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { CryptoDataProvider } from '../../contexts/CryptoDataContext';

interface DashboardLayoutProps {
  handleLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ handleLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(layoutRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
  }, []);

  return (
    <div ref={layoutRef} className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} handleLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-blue-600 dark:text-blue-300">KRYPTORN</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-100/90 dark:bg-gray-900/90">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10 -z-10"></div>
            <CryptoDataProvider>
                <Outlet />
            </CryptoDataProvider>
        </main>
      </div>
      <style>{`
        .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(107, 114, 128, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(107, 114, 128, 0.3) 1px, transparent 1px);
        }
        .dark .bg-grid-pattern {
             background-image: linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px);
        }
        
        .bg-grid-pattern {
            background-size: 2rem 2rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;