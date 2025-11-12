import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import gsap from 'gsap';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const formRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(formRef.current, 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, []);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

  return (
    <div ref={formRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-300">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400">Securely log in to your account.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input type="email" placeholder="Email Address" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <div className="relative">
          <input type="password" placeholder="Password" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"/>
                <span className="ml-2">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot Password?
            </Link>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30">
          Log In
        </button>
      </form>
      <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;