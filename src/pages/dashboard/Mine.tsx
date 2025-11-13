import React, { useState, useEffect, useRef } from 'react';
import { useCryptoData } from '../../contexts/CryptoDataContext';
import { Coin } from '../../types';
import { Pickaxe, Zap } from 'lucide-react';
import gsap from 'gsap';
import { auth } from '../../firebase';
import { addTransaction } from '../../pages/auth/authService';

const Mine: React.FC = () => {
    const { coins, loading, addMinedValue } = useCryptoData();
    const [miningStatus, setMiningStatus] = useState<{ [key: string]: boolean }>({});
    const [minedAmounts, setMinedAmounts] = useState<{ [key: string]: number }>({});
    const [hashRates, setHashRates] = useState<{ [key: string]: number }>({});
    const [miningSessions, setMiningSessions] = useState<{ [key: string]: { startTime: Date, totalAmount: number } }>({});
    
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
                description: `Mined ${coin.name}`,
                status: 'completed',
                timestamp: new Date()
            });
            
            console.log(`Recorded mining session: ${sessionData.totalAmount.toFixed(8)} ${coin.symbol}`);
        } catch (error) {
            console.error('Error recording mining session:', error);
        }
    };

    const handleToggleMining = (coin: Coin) => {
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
    }, [miningSessions, coins, user]);

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

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400">Loading mining rigs...</div>;
    }

    return (
        <div ref={pageRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crypto Mining</h1>
            <p className="text-gray-500 dark:text-gray-400">
                Start mining assets to increase your wallet balance. Mining is simulated and only active while you are on this page.
            </p>

            {/* Total Mining Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">Active Miners</p>
                        <p className="text-2xl font-bold">
                            {getActiveMinersCount()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">Total Mined Value</p>
                        <p className="text-2xl font-bold">
                            ${calculateTotalMinedValue().toFixed(4)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-blue-100 text-sm">Total Coins Mined</p>
                        <p className="text-2xl font-bold">
                            {getTotalCoinsMinedCount()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coins.map(coin => {
                    const isMining = miningStatus[coin.id];
                    const minedAmount = minedAmounts[coin.id] || 0;
                    const minedValueUSD = minedAmount * coin.current_price;

                    return (
                        <div key={coin.id} className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 ${
                            isMining 
                                ? 'shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 border-blue-500' 
                                : 'border-gray-200 dark:border-gray-700 hover:-translate-y-1'
                        }`}>
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
                                        : 'text-gray-400 dark:text-gray-500'
                                }`} />
                            </div>
                            
                            <div className="space-y-3 my-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Hash Rate</span>
                                    <span className={`font-mono text-lg font-semibold ${
                                        isMining 
                                            ? 'text-green-500 animate-pulse' 
                                            : 'text-gray-600 dark:text-gray-300'
                                    }`}>
                                        {(hashRates[coin.id] || 0).toFixed(2)} MH/s
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mined ({coin.symbol.toUpperCase()})</span>
                                    <span className="font-mono text-lg font-semibold text-gray-600 dark:text-gray-300">
                                        {minedAmount.toFixed(8)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mined Value</span>
                                    <span className="font-mono text-lg font-semibold text-green-500/90 dark:text-green-400/90">
                                        ${minedValueUSD.toFixed(4)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                                    <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                                        ${coin.current_price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleMining(coin)}
                                disabled={!user}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white ${
                                    isMining 
                                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' 
                                        : user
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                        : 'bg-gray-400 cursor-not-allowed shadow-gray-400/20'
                                }`}
                            >
                                <Zap size={16} />
                                {!user 
                                    ? 'Login to Mine' 
                                    : isMining 
                                    ? 'Stop Mining' 
                                    : 'Start Mining'
                                }
                            </button>

                            {!user && (
                                <p className="text-xs text-red-500 dark:text-red-400 text-center mt-2">
                                    Please log in to start mining
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mining Instructions */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-yellow-700 dark:text-yellow-400 mb-2">How Mining Works</h3>
                <ul className="text-yellow-600 dark:text-yellow-300 text-sm space-y-1">
                    <li>• Mining is simulated and only works while you're on this page</li>
                    <li>• Each mining session adds crypto directly to your wallet</li>
                    <li>• Mined amounts are added to both your specific wallet and total balance</li>
                    <li>• Mining transactions are recorded in your transaction history</li>
                    <li>• You can mine multiple cryptocurrencies simultaneously</li>
                    <li>• Transactions are auto-saved every 30 seconds for active mining sessions</li>
                </ul>
            </div>
        </div>
    );
};

export default Mine;