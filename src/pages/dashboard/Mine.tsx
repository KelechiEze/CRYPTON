import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import gsap from 'gsap';
import { AlertCircle, Clock, Download, RefreshCw, Wallet, Unlock, X } from 'lucide-react';

const Mine: React.FC = () => {
    const { t } = useLanguage();
    const pageRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (pageRef.current) {
            gsap.fromTo(pageRef.current.children, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, []);

    const handleContactSupport = () => {
        // Open Tawk.to widget
        if (window.Tawk_API) {
            window.Tawk_API.maximize();
        } else {
            console.log('Tawk.to widget not loaded');
            // Fallback: open support page or show message
            alert('Please contact support through the chat widget on the website.');
        }
    };

    const handleMakeDeposit = () => {
        // Navigate to wallets page for deposit
        window.location.href = '/dashboard/wallets';
    };

    const handleUnlockMining = () => {
        handleMakeDeposit();
    };

    const handleRestoreFunds = () => {
        handleMakeDeposit();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalDeposit = () => {
        closeModal();
        handleMakeDeposit();
    };

    return (
        <div ref={pageRef} className="space-y-8">
            {/* Deposit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Wallet className="w-5 h-5" />
                                Make Deposit
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Unlock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-blue-800 dark:text-blue-300 font-semibold text-sm">
                                            Unlock Your Mining Access
                                        </p>
                                        <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
                                            Make a minimum deposit of $50 to restore your mining capabilities and access your frozen funds immediately.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Instant restoration of frozen funds</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Immediate mining access restoration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>No data or progress loss</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Bitcoin deposits recommended for speed</span>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleModalDeposit}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Wallet size={16} />
                                    Make Deposit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.cryptoMining || 'Crypto Mining'}</h1>
            
            {/* Suspension Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-xl text-white text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <AlertCircle size={48} className="text-white animate-pulse" />
                        <Unlock size={48} className="text-white" />
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">
                            {t.miningSuspended || 'Mining Access Suspended'}
                        </h2>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto">
                            <p className="text-orange-100 text-lg leading-relaxed mb-4">
                                {t.miningSuspendedDescription || 
                                    'Your mining operations have been temporarily suspended because you have not yet made the required deposit. This is part of our security measures to ensure account verification and prevent fraudulent activities.'}
                            </p>

                            {/* Critical Information */}
                            <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-left">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-red-200 font-semibold text-sm mb-2">
                                            Important Account Notice:
                                        </p>
                                        <div className="space-y-2 text-red-100 text-sm">
                                            <p>• All mined funds are currently frozen and will be temporarily deducted from your account balance</p>
                                            <p>• Your mining progress and earnings are safely preserved in our system</p>
                                            <p>• Funds will be immediately restored and mining access reinstated once deposit is made</p>
                                            <p>• No data or earnings will be lost during this suspension period</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deposit Requirement */}
                        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mt-4">
                            <div className="flex items-start gap-3">
                                <Wallet className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                                <div className="text-left">
                                    <p className="text-yellow-200 font-semibold text-sm">
                                        Required Action to Restore Mining:
                                    </p>
                                    <p className="text-yellow-100 text-sm mt-1">
                                        To unlock your mining capabilities and restore your frozen funds, please make a minimum deposit of $50. 
                                        We recommend using Bitcoin (BTC) for faster processing and immediate restoration of your account.
                                    </p>
                                    <button
                                        onClick={handleUnlockMining}
                                        className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Wallet size={14} />
                                        Make Deposit to Restore Mining
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4 text-white">
                            {t.accountStatus || 'Account Status Overview'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="space-y-2">
                                <Unlock size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">Mining Access</p>
                                <p className="text-white font-bold">Suspended</p>
                            </div>
                            <div className="space-y-2">
                                <Wallet size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">Funds Status</p>
                                <p className="text-white font-bold">Frozen</p>
                            </div>
                            <div className="space-y-2">
                                <Download size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">Restoration</p>
                                <p className="text-white font-bold">Instant</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-orange-200 text-sm">
                            {t.thankYouForPatience || 
                                'We appreciate your understanding as we maintain the highest security standards for all our users. Your funds and mining progress are completely safe.'}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleUnlockMining}
                                className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <Unlock size={20} />
                                {t.unlockMining || 'Unlock Mining'}
                            </button>
                            
                            <button
                                onClick={handleContactSupport}
                                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <AlertCircle size={20} />
                                {t.contactSupport || 'Contact Support'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Funds Restoration Information */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4">
                    🔄 Funds Restoration Process
                </h3>
                <div className="space-y-3 text-green-600 dark:text-green-300 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Immediate Restoration:</strong> Once your deposit is confirmed, all frozen funds will be automatically and immediately restored to your account.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Mining Resumes Instantly:</strong> Your mining operations will restart automatically as soon as your deposit is verified.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>No Data Loss:</strong> All your mining progress, statistics, and accumulated earnings are preserved and will be fully restored.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Bonus Consideration:</strong> We appreciate your cooperation and may consider bonus rewards for your understanding during this process.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleRestoreFunds}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Unlock size={16} />
                    Restore My Funds & Mining Access
                </button>
            </div>

            {/* Security Explanation */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">
                    🛡️ Why This Security Measure Exists
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600 dark:text-blue-300">
                    <div className="space-y-2">
                        <p className="font-semibold">✨ Account Verification</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            Ensures all users are legitimate and committed to our platform
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">🔧 Fraud Prevention</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            Protects our community from fraudulent activities and abuse
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">📊 Platform Sustainability</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            Maintains the quality and longevity of our mining services
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">⚡ Fair Resource Distribution</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            Ensures mining resources are allocated to verified users
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Status Updates */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {t.systemStatus || 'System Status Updates'}
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-700 dark:text-red-400 font-medium">
                                {t.miningEngine || 'Mining Engine'}
                            </span>
                        </div>
                        <span className="text-red-600 dark:text-red-500 font-bold">
                            Suspended (Deposit Required)
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                                Account Funds
                            </span>
                        </div>
                        <span className="text-yellow-600 dark:text-yellow-500 font-bold">
                            Frozen (Pending Deposit)
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-400 font-medium">
                                {t.walletServices || 'Wallet Services'}
                            </span>
                        </div>
                        <span className="text-green-600 dark:text-green-500 font-bold">
                            {t.operational || 'Operational'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-400 font-medium">
                                Deposit Processing
                            </span>
                        </div>
                        <span className="text-green-600 dark:text-green-500 font-bold">
                            Immediate Restoration
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add TypeScript declaration for Tawk.to
declare global {
    interface Window {
        Tawk_API?: {
            maximize: () => void;
            minimize: () => void;
            toggle: () => void;
            showWidget: () => void;
            hideWidget: () => void;
        };
    }
}

export default Mine;