import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Globe, Eye, EyeOff, Wallet, BrainCircuit, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface SignupProps {
    onSignup: () => void;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalStep, setModalStep] = useState<'none' | 'connect' | 'creating' | 'connecting'>('none');

    useEffect(() => {
        gsap.fromTo(formRef.current, 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setModalStep('connect');
    };

  return (
    <>
        <div ref={formRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-500 dark:text-blue-300">Create Account</h2>
            <p className="text-gray-600 dark:text-gray-400">Join the future of finance today.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
                <div className="relative w-1/2">
                    <input type="text" placeholder="First Name" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
                <div className="relative w-1/2">
                    <input type="text" placeholder="Last Name" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                </div>
            </div>
            <div className="relative">
            <input type="email" placeholder="Email Address" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <div className="relative">
            <input type="tel" placeholder="Phone Number" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <div className="relative">
                <select required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none">
                    <option value="" disabled selected>Select Country</option>
                    {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
                <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
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
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" required className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-4 pr-10 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-600/30">
            Sign Up
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
            />
        )}
    </>
  );
};

interface SignupModalProps {
    step: 'connect' | 'creating' | 'connecting';
    setStep: React.Dispatch<React.SetStateAction<'none' | 'connect' | 'creating' | 'connecting'>>;
    onFinalize: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ step, setStep, onFinalize }) => {
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
            }, 15000);
            return () => clearTimeout(timer);
        }
        if (step === 'connecting') {
            const timer = setTimeout(() => {
                gsap.to([modalRef.current, backdropRef.current], { opacity: 0, duration: 0.3, onComplete: onFinalize });
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [step, setStep, onFinalize]);

    const handleNoThanks = () => {
        gsap.to([modalRef.current, backdropRef.current], { opacity: 0, duration: 0.3, onComplete: onFinalize });
    };
    
    const handleYes = () => {
        gsap.to(modalRef.current, { opacity: 0, scale: 0.9, duration: 0.2, onComplete: () => setStep('creating') });
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Creating User Wallet...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Please wait while we set up your secure, decentralized wallet.</p>
                </div>
            );
            break;
        case 'connecting':
            content = (
                <div className="flex flex-col items-center">
                    <BrainCircuit size={48} className="text-purple-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connecting to AI...</h2>
                    <p className="text-gray-600 dark:text-gray-400">Finalizing connection to our advanced trading algorithms.</p>
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