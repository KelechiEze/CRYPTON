import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Globe, Eye, EyeOff, Wallet, BrainCircuit, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { signUp } from './authService';

interface SignupProps {
    onSignup: () => void;
}

// Only 10 countries for faster development
const countries = [
  "United States",
  "United Kingdom", 
  "Canada",
  "Australia",
  "Germany",
  "France", 
  "Japan",
  "Brazil",
  "India",
  "South Africa"
];

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalStep, setModalStep] = useState<'none' | 'connect' | 'creating' | 'connecting'>('none');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(formRef.current, 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long!');
            setLoading(false);
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.country) {
            setError('Please fill in all required fields!');
            setLoading(false);
            return;
        }

        setModalStep('connect');
        setLoading(false);
    };

    const handleSignup = async (connectAI: boolean = false) => {
        try {
            const result = await signUp(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                country: formData.country,
                aiTrading: { connected: connectAI, active: false }
            });

            if (result.success) {
                setModalStep('creating');
                // Simulate wallet creation process
                setTimeout(() => {
                    setModalStep('connecting');
                    // Simulate AI connection process
                    setTimeout(() => {
                        onSignup();
                        navigate('/dashboard');
                    }, 2000);
                }, 2000);
            } else {
                setError(`Signup failed: ${result.error}`);
                setModalStep('none');
            }
        } catch (error: any) {
            setError(`Signup failed: ${error.message}`);
            setModalStep('none');
        }
    };

    return (
        <>
            <div ref={formRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-300">Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-400">Join the future of finance today.</p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="relative w-1/2">
                            <input 
                                type="text" 
                                name="firstName"
                                placeholder="First Name" 
                                required 
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        </div>
                        <div className="relative w-1/2">
                            <input 
                                type="text" 
                                name="lastName"
                                placeholder="Last Name" 
                                required 
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                            />
                            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        </div>
                    </div>
                    <div className="relative">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address" 
                            required 
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    </div>
                    <div className="relative">
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number" 
                            required 
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    </div>
                    <div className="relative">
                        <select 
                            name="country"
                            required 
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                        >
                            <option value="" disabled>Select Country</option>
                            {countries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                    </div>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            name="password"
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            name="confirmPassword"
                            placeholder="Confirm Password" 
                            required 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                        Log In
                    </Link>
                </p>
            </div>
            {modalStep !== 'none' && (
                <SignupModal
                    step={modalStep}
                    setStep={setModalStep}
                    onFinalize={onSignup}
                    onSignup={handleSignup}
                />
            )}
        </>
    );
};

interface SignupModalProps {
    step: 'connect' | 'creating' | 'connecting';
    setStep: React.Dispatch<React.SetStateAction<'none' | 'connect' | 'creating' | 'connecting'>>;
    onFinalize: () => void;
    onSignup: (connectAI: boolean) => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ step, setStep, onFinalize, onSignup }) => {
    const backdropRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.to(backdropRef.current, { opacity: 1, duration: 0.3 });
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    }, [step]);
    
    useEffect(() => {
        if (step === 'creating') {
            const timer = setTimeout(() => {
                setStep('connecting');
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (step === 'connecting') {
            const timer = setTimeout(() => {
                gsap.to([modalRef.current, backdropRef.current], { opacity: 0, duration: 0.3, onComplete: onFinalize });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [step, setStep, onFinalize]);

    const handleNoThanks = () => {
        gsap.to([modalRef.current, backdropRef.current], { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                onSignup(false);
            }
        });
    };
    
    const handleYes = () => {
        gsap.to(modalRef.current, { 
            opacity: 0, 
            scale: 0.9, 
            duration: 0.2, 
            onComplete: () => {
                onSignup(true);
                setStep('creating');
            }
        });
    };

    let content;
    switch (step) {
        case 'connect':
            content = (
                <>
                    <Wallet size={48} className="text-blue-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect to AI Trading?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Connect your wallet with our AI trading services for automated portfolio management.</p>
                    <div className="flex gap-4">
                        <button onClick={handleNoThanks} className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg transition-colors">
                            No, Thanks
                        </button>
                        <button onClick={handleYes} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Yes, Connect
                        </button>
                    </div>
                </>
            );
            break;
        case 'creating':
            content = (
                <div className="flex flex-col items-center">
                    <Loader2 size={48} className="text-blue-500 mx-auto mb-4 animate-spin" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Creating Account...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Setting up your secure dashboard and wallet.</p>
                </div>
            );
            break;
        case 'connecting':
            content = (
                <div className="flex flex-col items-center">
                    <BrainCircuit size={48} className="text-purple-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Finalizing Setup...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Your account is almost ready!</p>
                </div>
            );
            break;
    }

    return (
        <div ref={backdropRef} className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 opacity-0">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md text-center border border-gray-200 dark:border-gray-700 shadow-2xl">
                {content}
            </div>
        </div>
    );
};

export default Signup;