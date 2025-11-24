import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import gsap from 'gsap';
import { AlertCircle, Clock, Download, RefreshCw, Wallet } from 'lucide-react';

const Mine: React.FC = () => {
    const { t } = useLanguage();
    const pageRef = useRef<HTMLDivElement>(null);

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

    return (
        <div ref={pageRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.cryptoMining || 'Crypto Mining'}</h1>
            
            {/* Suspension Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 rounded-xl text-white text-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <AlertCircle size={48} className="text-white animate-pulse" />
                        <Clock size={48} className="text-white" />
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">
                            {t.miningSuspended || 'Mining Temporarily Suspended'}
                        </h2>
                        
                        <p className="text-orange-100 text-lg max-w-2xl mx-auto leading-relaxed">
                            {t.miningSuspendedDescription || 
                                'Our mining platform is currently undergoing scheduled maintenance and application updates to enhance your mining experience. We are working diligently to bring it back online with improved features and performance.'}
                        </p>

                        {/* Important Notice for Withdrawals */}
                        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mt-4">
                            <div className="flex items-start gap-3">
                                <Wallet className="w-5 h-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                                <div className="text-left">
                                    <p className="text-yellow-200 font-semibold text-sm">
                                        Important Notice for Withdrawals:
                                    </p>
                                    <p className="text-yellow-100 text-sm mt-1">
                                        Users who want to withdraw their mined funds need to make a deposit first. 
                                        We recommend making deposits to your Bitcoin wallet for faster processing 
                                        and better compatibility with our withdrawal system.
                                    </p>
                                    <button
                                        onClick={handleMakeDeposit}
                                        className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Wallet size={14} />
                                        Make Bitcoin Deposit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-2xl w-full">
                        <h3 className="text-xl font-bold mb-4 text-white">
                            {t.expectedReturn || 'Expected Return'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="space-y-2">
                                <RefreshCw size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">System Updates</p>
                                <p className="text-white font-bold">In Progress</p>
                            </div>
                            <div className="space-y-2">
                                <Download size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">New Features</p>
                                <p className="text-white font-bold">Coming Soon</p>
                            </div>
                            <div className="space-y-2">
                                <Clock size={32} className="mx-auto text-orange-200" />
                                <p className="text-orange-100 text-sm">Estimated Time</p>
                                <p className="text-white font-bold">24-48 Hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-orange-200 text-sm">
                            {t.thankYouForPatience || 
                                'Thank you for your patience and understanding. We appreciate you being part of our mining community.'}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <RefreshCw size={20} />
                                {t.checkAgain || 'Check Again'}
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

            {/* Withdrawal Information Section */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-4">
                    💰 Withdrawal Information
                </h3>
                <div className="space-y-3 text-purple-600 dark:text-purple-300 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Deposit Requirement:</strong> To withdraw your mined funds, you must first make a deposit of $50 into your account.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Recommended Currency:</strong> Bitcoin (BTC) deposits are preferred for faster processing and better exchange rates.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Processing Time:</strong> Withdrawals are typically processed within 24-48 hours after deposit verification.
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p>
                            <strong>Minimum Deposit:</strong> Check the wallet section for current minimum deposit requirements.
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleMakeDeposit}
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <Wallet size={16} />
                    Make Deposit to Withdraw Funds
                </button>
            </div>

            {/* What to Expect Section */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-4">
                    {t.whatToExpect || 'What to Expect When Mining Returns'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-600 dark:text-blue-300">
                    <div className="space-y-2">
                        <p className="font-semibold">✨ {t.improvedPerformance || 'Improved Performance'}</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            {t.improvedPerformanceDesc || 'Faster mining algorithms and better efficiency'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">🔧 {t.enhancedFeatures || 'Enhanced Features'}</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            {t.enhancedFeaturesDesc || 'New mining modes and advanced statistics'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">📊 {t.betterAnalytics || 'Better Analytics'}</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            {t.betterAnalyticsDesc || 'Detailed mining reports and performance tracking'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="font-semibold">⚡ {t.fasterPayouts || 'Faster Payouts'}</p>
                        <p className="text-blue-500 dark:text-blue-400">
                            {t.fasterPayoutsDesc || 'Improved transaction processing and faster rewards'}
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
                    <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-yellow-700 dark:text-yellow-400 font-medium">
                                {t.miningEngine || 'Mining Engine'}
                            </span>
                        </div>
                        <span className="text-yellow-600 dark:text-yellow-500 font-bold">
                            {t.underMaintenance || 'Under Maintenance'}
                        </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 dark:text-green-400 font-medium">
                                {t.userAccounts || 'User Accounts'}
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
                                Withdrawal System
                            </span>
                        </div>
                        <span className="text-green-600 dark:text-green-500 font-bold">
                            Operational (With Deposit)
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