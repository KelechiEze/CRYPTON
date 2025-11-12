import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Hash, Lock } from 'lucide-react';
import gsap from 'gsap';

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Animate the container whenever the step changes, providing visual feedback
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, 
                { opacity: 0, scale: 0.98 }, 
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [step]);

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        
        // Simulate sending OTP using front-end logic only
        setSuccess(`An OTP has been sent to ${email}.`);
        setTimeout(() => {
            setStep('otp');
            setSuccess('');
        }, 2000); // Delay allows user to read the message
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Simulate password reset using front-end logic
        setSuccess('Password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
            navigate('/login');
        }, 2000); // Delay for user to read success message
    };

    const emailForm = (
        <>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-300">Forgot Password</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your email to receive an OTP.</p>
            </div>
            {/* Message Display */}
            <div className="mb-4 min-h-[44px]">
                {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center animate-fade-in">{error}</p>}
                {success && <p className="text-green-500 bg-green-500/10 p-3 rounded-lg text-sm text-center animate-fade-in">{success}</p>}
            </div>
            <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30">
                    Send OTP
                </button>
            </form>
            <div className="text-center mt-6">
                <Link to="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Back to Log In
                </Link>
            </div>
        </>
    );

    const otpForm = (
        <>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-300">Enter OTP</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">An OTP was sent to <span className="font-semibold text-gray-800 dark:text-white">{email}</span>.</p>
            </div>
             {/* Message Display */}
             <div className="mb-4 min-h-[44px]">
                {error && <p className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm text-center animate-fade-in">{error}</p>}
                {success && <p className="text-green-500 bg-green-500/10 p-3 rounded-lg text-sm text-center animate-fade-in">{success}</p>}
            </div>
            <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                     <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required 
                        pattern="\d{6}" 
                        title="OTP must be 6 digits" 
                        maxLength={6} 
                        className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-10 pr-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 tracking-[0.3em] text-center" />
                     <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <div className="relative">
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required 
                        className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <div className="relative">
                    <input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required 
                        className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 !mt-6">
                    Reset Password
                </button>
            </form>
             <div className="text-center mt-6">
                <button onClick={() => { setStep('email'); setError(''); setSuccess(''); }} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold inline-flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} />
                    Use a different email
                </button>
            </div>
        </>
    );

  return (
    <div ref={containerRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transition-all duration-500">
      {step === 'email' ? emailForm : otpForm}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;