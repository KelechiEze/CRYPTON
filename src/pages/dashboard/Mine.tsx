import React, { useState, useEffect, useRef } from 'react';
import { useCryptoData } from '../../contexts/CryptoDataContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Coin } from '../../types';
import { Pickaxe, Zap, Wallet, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { auth } from '../../firebase';
import { addTransaction } from '../../pages/auth/authService';
import { useNavigate } from 'react-router-dom';

const Mine: React.FC = () => {
    const { coins, loading, addMinedValue, balances } = useCryptoData();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [miningStatus, setMiningStatus] = useState<{ [key: string]: boolean }>({});
    const [minedAmounts, setMinedAmounts] = useState<{ [key: string]: number }>({});
    const [hashRates, setHashRates] = useState<{ [key: string]: number }>({});
    const [miningSessions, setMiningSessions] = useState<{ [key: string]: { startTime: Date, totalAmount: number } }>({});
    const [showDepositWarning, setShowDepositWarning] = useState<{ [key: string]: boolean }>({});
    
    const intervalsRef = useRef<{ [key: string]: number }>({});
    const pageRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
    }, []);

    useEffect(() => {
        if (!loading && pageRef.current) {
            gsap.fromTo(pageRef.current.children, 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading]);

    // Cleanup intervals on component unmount
    useEffect(() => {
        const intervals = intervalsRef.current;
        return () => {
            Object.values(intervals).forEach(clearInterval);
        };
    }, []);

    // Check if user has balance for a specific coin
    const hasBalanceForCoin = (coinId: string) => {
        return balances[coinId] > 0;
    };

    const recordMiningSession = async (coin: Coin, sessionData: { startTime: Date, totalAmount: number }) => {
        if (!user || sessionData.totalAmount < 0.000001) return;
        
        try {
            const totalMinedValueForCoin = sessionData.totalAmount * coin.current_price;
            
            await addTransaction(user.uid, {
                type: 'mined',
                coinId: coin.id,
                coinName: coin.name,
                amount: sessionData.totalAmount,
                amountUsd: totalMinedValueForCoin,
                currency: coin.symbol.toUpperCase(),
                description: `${t.mined} ${coin.name}`,
                status: 'completed',
                timestamp: new Date()
            });
            
            console.log(`Recorded mining session: ${sessionData.totalAmount.toFixed(8)} ${coin.symbol}`);
        } catch (error) {
            console.error('Error recording mining session:', error);
        }
    };

    const handleToggleMining = (coin: Coin) => {
        // Check if user has balance for this coin
        if (!hasBalanceForCoin(coin.id)) {
            setShowDepositWarning(prev => ({ ...prev, [coin.id]: true }));
            
            // Auto-hide warning after 5 seconds
            setTimeout(() => {
                setShowDepositWarning(prev => ({ ...prev, [coin.id]: false }));
            }, 5000);
            return;
        }

        const isCurrentlyMining = miningStatus[coin.id];
        setMiningStatus(prev => ({ ...prev, [coin.id]: !isCurrentlyMining }));

        if (!isCurrentlyMining) {
            // Start mining
            const sessionStartTime = new Date();
            let sessionTotalAmount = 0;
            
            setMiningSessions(prev => ({ 
                ...prev, 
                [coin.id]: { 
                    startTime: sessionStartTime, 
                    totalAmount: 0 
                } 
            }));
            
            intervalsRef.current[coin.id] = window.setInterval(() => {
                const minedValueUSD = Math.random() * 0.01 + 0.001; // 0.001 - 0.011 USD
                const minedAmountCrypto = minedValueUSD / coin.current_price;
                sessionTotalAmount += minedAmountCrypto;

                // Update local state
                setMinedAmounts(prev => ({
                    ...prev,
                    [coin.id]: (prev[coin.id] || 0) + minedAmountCrypto,
                }));

                setMiningSessions(prev => ({
                    ...prev,
                    [coin.id]: {
                        ...prev[coin.id],
                        totalAmount: sessionTotalAmount
                    }
                }));

                setHashRates(prev => ({
                    ...prev,
                    [coin.id]: Math.random() * 50 + 100,
                }));

                // Update Firebase and local context
                addMinedValue(coin.id, minedValueUSD);

            }, 2000); // Mine every 2 seconds
        } else {
            // Stop mining - record the session
            clearInterval(intervalsRef.current[coin.id]);
            delete intervalsRef.current[coin.id];
            
            // Record mining session
            const sessionData = miningSessions[coin.id];
            if (sessionData && sessionData.totalAmount >= 0.000001) {
                recordMiningSession(coin, sessionData);
            }
            
            // Clear session data
            setMiningSessions(prev => {
                const newSessions = { ...prev };
                delete newSessions[coin.id];
                return newSessions;
            });
        }
    };

    const handleNavigateToWallet = (coin?: Coin) => {
        if (coin) {
            navigate('/dashboard/wallets', { state: { scrollToCoin: coin.id } });
        } else {
            navigate('/dashboard/wallets');
        }
    };

    // Auto-save mining sessions every 30 seconds for active miners
    useEffect(() => {
        const autoSaveInterval = setInterval(() => {
            Object.entries(miningSessions).forEach(([coinId, sessionData]) => {
                if (sessionData.totalAmount >= 0.000001) {
                    const coin = coins.find(c => c.id === coinId);
                    if (coin) {
                        recordMiningSession(coin, sessionData);
                        // Reset session total after saving
                        setMiningSessions(prev => ({
                            ...prev,
                            [coinId]: { ...sessionData, totalAmount: 0 }
                        }));
                    }
                }
            });
        }, 30000); // Auto-save every 30 seconds

        return () => clearInterval(autoSaveInterval);
    }, [miningSessions, coins, user, t]);

    // Calculate total mined value across all coins
    const calculateTotalMinedValue = () => {
        return coins.reduce((total, coin) => {
            const minedAmount = minedAmounts[coin.id] || 0;
            return total + (minedAmount * coin.current_price);
        }, 0);
    };

    const getActiveMinersCount = () => {
        return Object.values(miningStatus).filter(status => status).length;
    };

    const getTotalCoinsMinedCount = () => {
        return Object.keys(minedAmounts).filter(coinId => minedAmounts[coinId] > 0).length;
    };

    const getCoinsWithBalanceCount = () => {
        return coins.filter(coin => hasBalanceForCoin(coin.id)).length;
    };

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400">{t.loadingMiningRigs || 'Loading mining rigs...'}</div>;
    }

    return (
        <div ref={pageRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.cryptoMining || 'Crypto Mining'}</h1>
            <p className="text-gray-500 dark:text-gray-400">
                {t.miningDescription || 'Start mining assets to increase your wallet balance. Mining is simulated and only active while you are on this page. For Faster Mining, Reach out to our customer care for guidance'}
            </p>

            {/* Total Mining Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">{t.activeMiners || 'Active Miners'}</p>
                        <p className="text-2xl font-bold">
                            {getActiveMinersCount()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">{t.totalMinedValue || 'Total Mined Value'}</p>
                        <p className="text-2xl font-bold">
                            ${calculateTotalMinedValue().toFixed(4)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">{t.totalCoinsMined || 'Total Coins Mined'}</p>
                        <p className="text-2xl font-bold">
                            {getTotalCoinsMinedCount()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">{t.walletsReady || 'Wallets Ready'}</p>
                        <p className="text-2xl font-bold">
                            {getCoinsWithBalanceCount()}/{coins.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Deposit Required Banner */}
            {getCoinsWithBalanceCount() === 0 && (
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <AlertCircle size={32} className="text-white" />
                            <div>
                                <h3 className="text-xl font-bold">{t.depositRequired || 'Deposit Required'}</h3>
                                <p className="text-orange-100">
                                    {t.depositRequiredDescription || 'You need to make a deposit into your wallet before you can start mining. Click the button below to fund your wallet.'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleNavigateToWallet()}
                            className="bg-white text-orange-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                            <Wallet size={20} />
                            {t.fundWallet || 'Fund Wallet'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coins.map(coin => {
                    const isMining = miningStatus[coin.id];
                    const minedAmount = minedAmounts[coin.id] || 0;
                    const minedValueUSD = minedAmount * coin.current_price;
                    const hasBalance = hasBalanceForCoin(coin.id);
                    const showWarning = showDepositWarning[coin.id];

                    return (
                        <div key={coin.id} className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 ${
                            isMining 
                                ? 'shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 border-blue-500' 
                                : hasBalance
                                ? 'border-gray-200 dark:border-gray-700 hover:-translate-y-1'
                                : 'border-gray-300 dark:border-gray-600 opacity-80'
                        }`}>
                            {/* Wallet Balance Status */}
                            <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${
                                hasBalance 
                                    ? 'bg-green-500/10 border border-green-500/20' 
                                    : 'bg-orange-500/10 border border-orange-500/20'
                            }`}>
                                <div className="flex items-center gap-2">
                                    <Wallet size={16} className={hasBalance ? 'text-green-500' : 'text-orange-500'} />
                                    <span className={`text-sm font-medium ${hasBalance ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
                                        {hasBalance 
                                            ? t.walletFunded || 'Wallet Funded' 
                                            : t.depositRequired || 'Deposit Required'
                                        }
                                    </span>
                                </div>
                                {hasBalance && (
                                    <div className="text-right">
                                        <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                                            ${balances[coin.id].toFixed(2)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">{coin.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                                <Pickaxe className={`transition-colors duration-300 ${
                                    isMining 
                                        ? 'text-blue-500 animate-pulse' 
                                        : hasBalance
                                        ? 'text-gray-400 dark:text-gray-500'
                                        : 'text-orange-400 dark:text-orange-500'
                                }`} />
                            </div>
                            
                            <div className="space-y-3 my-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t.hashRate || 'Hash Rate'}</span>
                                    <span className={`font-mono text-lg font-semibold ${
                                        isMining 
                                            ? 'text-green-500 animate-pulse' 
                                            : 'text-gray-600 dark:text-gray-300'
                                    }`}>
                                        {(hashRates[coin.id] || 0).toFixed(2)} MH/s
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t.mined || 'Mined'} ({coin.symbol.toUpperCase()})</span>
                                    <span className="font-mono text-lg font-semibold text-gray-600 dark:text-gray-300">
                                        {minedAmount.toFixed(8)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t.minedValue || 'Mined Value'}</span>
                                    <span className="font-mono text-lg font-semibold text-green-500/90 dark:text-green-400/90">
                                        ${minedValueUSD.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{t.price || 'Price'}</span>
                                    <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                                        ${coin.current_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Deposit Warning Message */}
                            {showWarning && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={16} className="text-red-500" />
                                        <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                                            {t.depositRequiredToMine || 'You need to make a deposit into this wallet before you can mine'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleNavigateToWallet(coin)}
                                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Wallet size={14} />
                                        {t.depositNow || 'Deposit Now'}
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => handleToggleMining(coin)}
                                disabled={!user || !hasBalance}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all duration-300 transform ${
                                    hasBalance ? 'hover:scale-105' : ''
                                } text-white ${
                                    isMining 
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                                        : hasBalance && user
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                        : !user
                                        ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/20'
                                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                }`}
                            >
                                <Zap size={16} />
                                {!user 
                                    ? t.loginToMine || 'Login to Mine'
                                    : !hasBalance
                                    ? t.depositRequired || 'Deposit Required'
                                    : isMining 
                                    ? t.stopMining || 'Stop Mining'
                                    : t.startMining || 'Start Mining'
                                }
                            </button>

                            {!user && (
                                <p className="text-xs text-red-500 dark:text-red-400 text-center mt-2">
                                    {t.pleaseLoginToMine || 'Please log in to start mining'}
                                </p>
                            )}

                            {user && !hasBalance && (
                                <button
                                    onClick={() => handleNavigateToWallet(coin)}
                                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <Wallet size={14} />
                                    {t.fundWallet || 'Fund Wallet'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mining Instructions */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-2">{t.howMiningWorks || 'How Mining Works'}</h3>
                <ul className="text-yellow-600 dark:text-yellow-300 text-sm space-y-1">
                    <li>• {t.miningInstruction1 || 'You need to have funds in your wallet to start mining'}</li>
                    <li>• {t.miningInstruction2 || 'Make a deposit into the specific coin wallet you want to mine'}</li>
                    <li>• {t.miningInstruction3 || 'Mining is simulated and only works while you are on this page'}</li>
                    <li>• {t.miningInstruction4 || 'Each mining session adds crypto directly to your wallet'}</li>
                    <li>• {t.miningInstruction5 || 'Mined amounts are added to both your specific wallet and total balance'}</li>
                    <li>• {t.miningInstruction6 || 'You can mine multiple cryptocurrencies simultaneously'}</li>
                    <li>• {t.miningInstruction7 || 'Transactions are auto-saved every 30 seconds for active mining sessions'}</li>
                </ul>
            </div>
        </div>
    );
};

export default Mine;