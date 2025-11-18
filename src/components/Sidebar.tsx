import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, User, Settings, ArrowLeftRight, LogOut, X, Pickaxe, Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const navItems = [
  { icon: LayoutDashboard, key: 'overview', path: '/dashboard/overview' },
  { icon: Wallet, key: 'wallets', path: '/dashboard/wallets' },
  { icon: ArrowLeftRight, key: 'transactions', path: '/dashboard/transactions' },
  { icon: Pickaxe, key: 'mine', path: '/dashboard/mine' },
  { icon: User, key: 'profile', path: '/dashboard/profile' },
  { icon: Settings, key: 'settings', path: '/dashboard/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  setIsOpen, 
  handleLogout 
}) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { currentLanguage, setCurrentLanguage, t, languages } = useLanguage();

  const linkClasses = "flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors duration-200";
  const activeLinkClasses = "bg-blue-500/10 dark:bg-blue-600/30 text-blue-600 dark:text-blue-300 border-l-4 border-blue-500 dark:border-blue-400 font-semibold";

  const handleLanguageSelect = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setIsLanguageOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`fixed lg:relative top-0 left-0 h-full w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col z-40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-300 tracking-wider">PAYCOIN</h1>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <item.icon className="mr-4" size={20} />
              <span>{t[item.key as keyof typeof t]}</span>
            </NavLink>
          ))}
        </nav>

        {/* Language Selector */}
        <div className="mb-4">
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className={`${linkClasses} w-full justify-between`}
          >
            <div className="flex items-center">
              <Globe className="mr-4" size={20} />
              <span>{t.language}</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Language Dropdown */}
          {isLanguageOpen && (
            <div className="mt-2 ml-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              {Object.entries(languages).map(([code, language]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageSelect(code)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    currentLanguage === code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{language.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{language.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{language.nativeName}</div>
                    </div>
                  </div>
                  {currentLanguage === code && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div>
          <button onClick={handleLogout} className={`${linkClasses} w-full`}>
            <LogOut className="mr-4" size={20} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;