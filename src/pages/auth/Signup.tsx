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
    const phoneInputRef = useRef<HTMLInputElement>(null);
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
    const [phoneError, setPhoneError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        gsap.fromTo(formRef.current, 
            { opacity: 0, scale: 0.95 }, 
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
        );
    }, []);

    const validatePhoneNumber = (phone: string): boolean => {
        // Remove any non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');
        
        // Check if it's a valid length (typically 10-15 digits for international numbers)
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    };

    const formatPhoneNumber = (value: string): string => {
        // Remove all non-digit characters
        const cleanValue = value.replace(/\D/g, '');
        
        // Limit to 15 digits maximum
        const limitedValue = cleanValue.slice(0, 15);
        
        // Format with spaces for readability (optional)
        if (limitedValue.length <= 3) {
            return limitedValue;
        } else if (limitedValue.length <= 6) {
            return `${limitedValue.slice(0, 3)} ${limitedValue.slice(3)}`;
        } else if (limitedValue.length <= 10) {
            return `${limitedValue.slice(0, 3)} ${limitedValue.slice(3, 6)} ${limitedValue.slice(6)}`;
        } else {
            return `${limitedValue.slice(0, 3)} ${limitedValue.slice(3, 6)} ${limitedValue.slice(6, 10)} ${limitedValue.slice(10)}`;
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formattedValue = formatPhoneNumber(rawValue);
        
        setFormData({
            ...formData,
            phone: formattedValue
        });

        // Validate phone number in real-time
        const cleanPhone = formattedValue.replace(/\D/g, '');
        if (cleanPhone.length > 0) {
            if (cleanPhone.length < 10) {
                setPhoneError('Phone number must be at least 10 digits');
            } else if (cleanPhone.length > 15) {
                setPhoneError('Phone number cannot exceed 15 digits');
            } else {
                setPhoneError('');
            }
        } else {
            setPhoneError('');
        }
        
        setError(''); // Clear general error when user types
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow only numbers, backspace, delete, tab, arrow keys, and navigation keys
        const allowedKeys = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'Backspace', 'Delete', 'Tab', 
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];
        
        if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text');
        // If pasted data contains non-digits, prevent the paste
        if (/\D/.test(pasteData)) {
            e.preventDefault();
        }
    };

    // Clear phone number completely
    const clearPhoneNumber = () => {
        setFormData({
            ...formData,
            phone: ''
        });
        setPhoneError('');
        // Focus back on the input after clearing
        setTimeout(() => {
            if (phoneInputRef.current) {
                phoneInputRef.current.focus();
            }
        }, 0);
    };

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
        
        // Phone number validation
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (!validatePhoneNumber(formData.phone)) {
            setError('Please enter a valid phone number (10-15 digits)');
            setLoading(false);
            return;
        }

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

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.country) {
            setError('Please fill in all required fields!');
            setLoading(false);
            return;
        }

        setModalStep('connect');
        setLoading(false);
    };

    const handleSignup = async (connectAI: boolean = false) => {
        try {
            // Clean phone number before sending (remove formatting spaces)
            const cleanPhone = formData.phone.replace(/\D/g, '');
            
            const result = await signUp(formData.email, formData.password, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: cleanPhone, // Send cleaned phone number
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
                            ref={phoneInputRef}
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number (10-15 digits)" 
                            required 
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            onKeyDown={handlePhoneKeyDown}
                            onPaste={handlePhonePaste}
                            pattern="[0-9\s]*"
                            inputMode="numeric"
                            className={`w-full bg-gray-100 dark:bg-gray-900/70 border ${
                                phoneError ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } rounded-lg py-3 pl-4 pr-20 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`} 
                        />
                        <Phone className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                        {formData.phone && (
                            <button
                                type="button"
                                onClick={clearPhoneNumber}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                                aria-label="Clear phone number"
                            >
                                ×
                            </button>
                        )}
                        {phoneError && (
                            <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{phoneError}</p>
                        )}
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
                        disabled={loading || !!phoneError}
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