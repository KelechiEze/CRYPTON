import React, { useState, useEffect, useRef } from 'react';
import { useCryptoData } from '../../contexts/CryptoDataContext';
import { Coin } from '../../types';
import { Pickaxe, Zap } from 'lucide-react';
import gsap from 'gsap';

const Mine: React.FC = () => {
    const { coins, loading, addMinedValue } = useCryptoData();
    const [miningStatus, setMiningStatus] = useState<{ [key: string]: boolean }>({});
    const [minedAmounts, setMinedAmounts] = useState<{ [key: string]: number }>({});
    const [hashRates, setHashRates] = useState<{ [key: string]: number }>({});
    
    const intervalsRef = useRef<{ [key: string]: number }>({});
    const pageRef = useRef<HTMLDivElement>(null);

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

    const handleToggleMining = (coin: Coin) => {
        const isCurrentlyMining = miningStatus[coin.id];
        setMiningStatus(prev => ({ ...prev, [coin.id]: !isCurrentlyMining }));

        if (!isCurrentlyMining) {
            // Start mining
            intervalsRef.current[coin.id] = window.setInterval(() => {
                const minedValueUSD = Math.random() * 0.005; // Simulate small mined amount in USD
                addMinedValue(coin.id, minedValueUSD);

                const minedAmountCrypto = minedValueUSD / coin.current_price;
                setMinedAmounts(prev => ({
                    ...prev,
                    [coin.id]: (prev[coin.id] || 0) + minedAmountCrypto,
                }));

                setHashRates(prev => ({
                    ...prev,
                    [coin.id]: Math.random() * 50 + 100, // Simulate fluctuating hash rate
                }));
            }, 2000); // Mine every 2 seconds
        } else {
            // Stop mining
            clearInterval(intervalsRef.current[coin.id]);
            delete intervalsRef.current[coin.id];
        }
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {coins.map(coin => {
                    const isMining = miningStatus[coin.id];
                    return (
                        <div key={coin.id} className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-5 transition-all duration-300 ${isMining ? 'shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 border-blue-500' : 'hover:-translate-y-1'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                                    <div>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">{coin.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                                    </div>
                                </div>
                                <Pickaxe className={`transition-colors duration-300 ${isMining ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
                            </div>
                            
                            <div className="space-y-3 my-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Hash Rate</span>
                                    <span className={`font-mono text-lg font-semibold ${isMining ? 'text-green-500 animate-pulse' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {(hashRates[coin.id] || 0).toFixed(2)} MH/s
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mined ({coin.symbol.toUpperCase()})</span>
                                    <span className="font-mono text-lg font-semibold text-gray-600 dark:text-gray-300">
                                        {(minedAmounts[coin.id] || 0).toFixed(8)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mined Value</span>
                                    <span className="font-mono text-lg font-semibold text-green-500/90 dark:text-green-400/90">
                                        ${((minedAmounts[coin.id] || 0) * coin.current_price).toFixed(4)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggleMining(coin)}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-white ${isMining ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20' : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'}`}
                            >
                                <Zap size={16} />
                                {isMining ? 'Stop Mining' : 'Start Mining'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Mine;