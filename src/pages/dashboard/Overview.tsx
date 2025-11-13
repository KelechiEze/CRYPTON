import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Bitcoin, Zap, BarChart, ShieldCheck, Gift, CheckCircle, X, ArrowUp, ArrowDown, RefreshCw, TrendingUp as TrendingUpIcon } from 'lucide-react';
import gsap from 'gsap';
import { claimBonus, hasClaimedBonus, subscribeToUserData } from '../../pages/auth/authService';
import { auth } from '../../firebase';
import { useCryptoData } from '../../contexts/CryptoDataContext';

interface Transaction {
    id: string;
    type: 'sent' | 'received' | 'swapped' | 'bonus' | 'mined';
    coinId?: string;
    coinName?: string;
    amount?: number;
    amountUsd?: number;
    currency?: string;
    description?: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: any;
    recipientAddress?: string;
}

// Enhanced withdrawal data with realistic user data and crypto transactions
const withdrawalData = [
  { name: 'Alex Chen', amount: 12500, crypto: 'BTC', cryptoAmount: 0.25, type: 'withdrawal' },
  { name: 'Sarah Johnson', amount: 8400, crypto: 'ETH', cryptoAmount: 2.8, type: 'deposit' },
  { name: 'Mike Rodriguez', amount: 15600, crypto: 'SOL', cryptoAmount: 85, type: 'withdrawal' },
  { name: 'Emma Wilson', amount: 9200, crypto: 'BTC', cryptoAmount: 0.18, type: 'deposit' },
  { name: 'James Brown', amount: 11300, crypto: 'ETH', cryptoAmount: 3.7, type: 'withdrawal' },
  { name: 'Lisa Wang', amount: 6700, crypto: 'DOGE', cryptoAmount: 12500, type: 'deposit' },
  { name: 'David Kim', amount: 18900, crypto: 'BTC', cryptoAmount: 0.38, type: 'withdrawal' },
  { name: 'Maria Garcia', amount: 14200, crypto: 'XRP', cryptoAmount: 950, type: 'deposit' },
  { name: 'Kevin Smith', amount: 7800, crypto: 'ETH', cryptoAmount: 2.6, type: 'withdrawal' },
  { name: 'Jennifer Lee', amount: 16500, crypto: 'SOL', cryptoAmount: 90, type: 'deposit' },
  { name: 'Robert Taylor', amount: 10500, crypto: 'BTC', cryptoAmount: 0.21, type: 'withdrawal' },
  { name: 'Amanda Clark', amount: 12800, crypto: 'BNB', cryptoAmount: 420, type: 'deposit' },
  { name: 'Christopher Lee', amount: 9500, crypto: 'LTC', cryptoAmount: 120, type: 'withdrawal' },
  { name: 'Michelle Davis', amount: 11200, crypto: 'XRP', cryptoAmount: 18500, type: 'deposit' },
  { name: 'Daniel Martinez', amount: 14300, crypto: 'BNB', cryptoAmount: 35, type: 'withdrawal' },
  { name: 'Jessica Wilson', amount: 7600, crypto: 'DOGE', cryptoAmount: 52000, type: 'deposit' },
  { name: 'Matthew Thompson', amount: 16800, crypto: 'USDC', cryptoAmount: 12500, type: 'withdrawal' },
  { name: 'Ashley Anderson', amount: 8900, crypto: 'ETH', cryptoAmount: 680, type: 'deposit' },
  { name: 'Joshua Thomas', amount: 13200, crypto: 'SOL', cryptoAmount: 950, type: 'withdrawal' },
  { name: 'Stephanie White', amount: 10100, crypto: 'BTC', cryptoAmount: 820, type: 'deposit' },
  { name: 'Andrew Harris', amount: 15700, crypto: 'XRP', cryptoAmount: 12500, type: 'withdrawal' },
  { name: 'Nicole Martin', amount: 7200, crypto: 'DOGE', cryptoAmount: 1450, type: 'deposit' },
  { name: 'Brian Jackson', amount: 13900, crypto: 'BNB', cryptoAmount: 380, type: 'withdrawal' },
  { name: 'Rebecca Moore', amount: 9800, crypto: 'LTC', cryptoAmount: 420, type: 'deposit' },
  { name: 'Jonathan Taylor', amount: 16400, crypto: 'ETH', cryptoAmount: 2850, type: 'withdrawal' },
  { name: 'Samantha Lee', amount: 8300, crypto: 'USDC', cryptoAmount: 45, type: 'deposit' },
  { name: 'Nicholas Clark', amount: 12100, crypto: 'BTC', cryptoAmount: 12, type: 'withdrawal' },
  { name: 'Megan Lewis', amount: 10700, crypto: 'SOL', cryptoAmount: 65, type: 'deposit' },
  { name: 'Justin Walker', amount: 17900, crypto: 'BNB', cryptoAmount: 3.2, type: 'withdrawal' },
  { name: 'Rachel Hall', amount: 9200, crypto: 'XRP', cryptoAmount: 850, type: 'deposit' },
  { name: 'Brandon Young', amount: 13400, crypto: 'DOGE', cryptoAmount: 4200, type: 'withdrawal' },
  { name: 'Lauren Allen', amount: 8800, crypto: 'LTC', cryptoAmount: 3800, type: 'deposit' },
  { name: 'Patrick King', amount: 15200, crypto: 'ETH', cryptoAmount: 1250, type: 'withdrawal' },
  { name: 'Olivia Wright', amount: 9600, crypto: 'USDC', cryptoAmount: 320, type: 'deposit' },
  { name: 'Samuel Scott', amount: 12800, crypto: 'BTC', cryptoAmount: 8500, type: 'withdrawal' },
  { name: 'Hannah Green', amount: 10400, crypto: 'SOL', cryptoAmount: 2800, type: 'deposit' },
  { name: 'Benjamin Baker', amount: 17300, crypto: 'BNB', cryptoAmount: 12500, type: 'withdrawal' },
  { name: 'Victoria Adams', amount: 7900, crypto: 'XRP', cryptoAmount: 18500, type: 'deposit' },
  { name: 'Kevin Nelson', amount: 14100, crypto: 'DOGE', cryptoAmount: 450, type: 'withdrawal' },
  { name: 'Christina Carter', amount: 11300, crypto: 'LTC', cryptoAmount: 3800, type: 'deposit' },
  { name: 'Jacob Mitchell', amount: 16700, crypto: 'ETH', cryptoAmount: 950, type: 'withdrawal' },
  { name: 'Amanda Perez', amount: 8700, crypto: 'USDC', cryptoAmount: 12500, type: 'deposit' },
  { name: 'Tyler Roberts', amount: 13800, crypto: 'BTC', cryptoAmount: 1800, type: 'withdrawal' },
  { name: 'Brittany Turner', amount: 9900, crypto: 'SOL', cryptoAmount: 220, type: 'deposit' },
  { name: 'Alexander Phillips', amount: 15400, crypto: 'BNB', cryptoAmount: 8500, type: 'withdrawal' },
  { name: 'Kayla Campbell', amount: 8100, crypto: 'XRP', cryptoAmount: 125000, type: 'deposit' },
  { name: 'Nathan Parker', amount: 14600, crypto: 'DOGE', cryptoAmount: 18500, type: 'withdrawal' },
  { name: 'Danielle Evans', amount: 10200, crypto: 'LTC', cryptoAmount: 4200, type: 'deposit' },
  { name: 'Gabriel Edwards', amount: 16100, crypto: 'ETH', cryptoAmount: 12500, type: 'withdrawal' },
  { name: 'Maria Collins', amount: 9300, crypto: 'USDC', cryptoAmount: 8500, type: 'deposit' }
];

// Transaction Item Component for reusability
const TransactionItem: React.FC<{ item: any; index: number }> = ({ item, index }) => (
  <div key={index} className="flex-shrink-0 flex items-center gap-4 px-4 py-3 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
    {/* Transaction Icon */}
    <div className={`p-2 rounded-full ${item.type === 'withdrawal' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
        {item.type === 'withdrawal' ? (
            <ArrowUp className="text-red-500" size={16} />
        ) : (
            <ArrowDown className="text-green-500" size={16} />
        )}
    </div>
    
    {/* Transaction Details */}
    <div className="flex items-center gap-4">
        <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {item.name} {item.type === 'withdrawal' ? 'withdrew' : 'deposited'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                ${item.amount.toLocaleString()}
            </p>
        </div>
    </div>

    {/* Crypto Badge */}
    <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
        <span className="text-white text-xs font-medium">{item.crypto}</span>
    </div>
  </div>
);

const WithdrawalTicker: React.FC = () => {
    return (
        <div className="group relative w-full overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                    <TrendingUpIcon className="text-blue-500" size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Live Transactions</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Real-time user activity</p>
                </div>
            </div>

            {/* Ticker Container */}
            <div className="relative overflow-hidden">
                <div className="flex">
                    {/* First set - visible */}
                    <div className="animate-scroll flex gap-6 flex-none">
                        {withdrawalData.map((item, index) => (
                            <TransactionItem key={`first-${index}`} item={item} index={index} />
                        ))}
                    </div>
                    {/* Second set - for seamless loop */}
                    <div className="animate-scroll flex gap-6 flex-none" style={{ animationDelay: '100s' }}>
                        {withdrawalData.map((item, index) => (
                            <TransactionItem key={`second-${index}`} item={item} index={index} />
                        ))}
                    </div>
                </div>
                
                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/50 dark:from-gray-800/50 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/50 dark:from-gray-800/50 to-transparent pointer-events-none"></div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Live updates</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {withdrawalData.length} transactions today
                </div>
            </div>

            {/* CSS for the scrolling animation */}
            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                .animate-scroll {
                    animation: scroll 160s linear infinite;
                }
                .group:hover .animate-scroll {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

const Overview: React.FC = () => {
    const overviewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const { coins, balances } = useCryptoData();
    
    const [userData, setUserData] = useState({
        balance: 0,
        bitcoinBalance: 0,
        portfolioChange: 0,
        topGainer: 'Bitcoin',
        mostTraded: 'Ethereum',
        transactions: [] as Transaction[]
    });
    const [user, setUser] = useState<any>(null);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    // Calculate total balance from all wallets
    const calculateTotalBalance = () => {
        return Object.values(balances).reduce((total, balance) => total + balance, 0);
    };

    // Calculate Bitcoin balance specifically
    const calculateBitcoinBalance = () => {
        const bitcoin = coins.find(coin => coin.symbol.toLowerCase() === 'btc');
        if (bitcoin && balances[bitcoin.id]) {
            return balances[bitcoin.id] / bitcoin.current_price;
        }
        return userData.bitcoinBalance;
    };

    // Calculate 24h portfolio change based on transactions
    const calculatePortfolioChange = () => {
        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const recentTransactions = userData.transactions.filter(transaction => {
            const transactionDate = transaction.timestamp?.toDate?.() || new Date(transaction.timestamp);
            return transactionDate >= last24Hours && transaction.status === 'completed';
        });

        const totalChange = recentTransactions.reduce((total, transaction) => {
            if (transaction.type === 'received' || transaction.type === 'bonus' || transaction.type === 'mined') {
                return total + (transaction.amountUsd || 0);
            } else if (transaction.type === 'sent') {
                return total - (transaction.amountUsd || 0);
            }
            return total;
        }, 0);

        return totalChange;
    };

    // Calculate 24h activity count
    const calculate24hActivityCount = () => {
        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        return userData.transactions.filter(transaction => {
            const transactionDate = transaction.timestamp?.toDate?.() || new Date(transaction.timestamp);
            return transactionDate >= last24Hours && transaction.status === 'completed';
        }).length;
    };

    // Calculate Bitcoin 24h change
    const calculateBitcoin24hChange = () => {
        const bitcoin = coins.find(coin => coin.symbol.toLowerCase() === 'btc');
        if (!bitcoin) return 0;

        const last24Hours = new Date();
        last24Hours.setHours(last24Hours.getHours() - 24);

        const bitcoinTransactions = userData.transactions.filter(transaction => {
            const transactionDate = transaction.timestamp?.toDate?.() || new Date(transaction.timestamp);
            return transactionDate >= last24Hours && 
                   transaction.status === 'completed' &&
                   (transaction.coinId === bitcoin.id || transaction.currency === 'BTC');
        });

        const btcChange = bitcoinTransactions.reduce((total, transaction) => {
            if (transaction.type === 'received' || transaction.type === 'bonus' || transaction.type === 'mined') {
                return total + (transaction.amount || 0);
            } else if (transaction.type === 'sent') {
                return total - (transaction.amount || 0);
            }
            return total;
        }, 0);

        return btcChange;
    };

    // Calculate percentage change for display
    const calculatePercentageChange = (currentValue: number, changeAmount: number) => {
        if (currentValue === 0 || changeAmount === 0) return '0%';
        
        const percentage = (changeAmount / (currentValue - changeAmount)) * 100;
        return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            const checkBonusClaim = async () => {
                const claimed = await hasClaimedBonus(currentUser.uid);
                setHasClaimed(claimed);
            };
            checkBonusClaim();

            const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
                if (data) {
                    setUserData({
                        balance: calculateTotalBalance(),
                        bitcoinBalance: calculateBitcoinBalance(),
                        portfolioChange: data.portfolioChange || 0,
                        topGainer: data.topGainer || 'Bitcoin',
                        mostTraded: data.mostTraded || 'Ethereum',
                        transactions: data.transactions || []
                    });
                    
                    if (data.hasClaimedWelcomeBonus !== undefined) {
                        setHasClaimed(data.hasClaimedWelcomeBonus);
                    }
                }
            });

            return () => unsubscribe();
        }
    }, [balances, coins]);

    useEffect(() => {
        const totalBalance = calculateTotalBalance();
        const bitcoinBalance = calculateBitcoinBalance();
        
        setUserData(prev => ({
            ...prev,
            balance: totalBalance,
            bitcoinBalance: bitcoinBalance
        }));
    }, [balances, coins]);

    useEffect(() => {
        gsap.fromTo(overviewRef.current?.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
        );
    }, []);

    const handleClaimBonus = async () => {
        if (!user) return;
        
        if (isClaiming) return;
        
        if (hasClaimed) {
            alert('Bonus already claimed! You can only claim the welcome bonus once.');
            return;
        }

        setIsClaiming(true);
        
        try {
            const result = await claimBonus(user.uid);
            
            if (result.success) {
                setHasClaimed(true);
                setIsClaimModalOpen(true);
                
                const newBalance = calculateTotalBalance() + 50;
                setUserData(prev => ({
                    ...prev,
                    balance: newBalance,
                    bitcoinBalance: prev.bitcoinBalance + (50 / 50000)
                }));
            } else {
                alert(`Failed to claim bonus: ${result.error}`);
            }
        } catch (error) {
            console.error('Error claiming bonus:', error);
            alert('Failed to claim bonus. Please try again.');
        } finally {
            setIsClaiming(false);
        }
    };

    // Get recent transactions (last 5)
    const getRecentTransactions = () => {
        if (!userData.transactions || userData.transactions.length === 0) {
            return [];
        }
        
        return userData.transactions
            .sort((a, b) => {
                const timeA = a.timestamp?.toDate?.() || a.timestamp;
                const timeB = b.timestamp?.toDate?.() || b.timestamp;
                return new Date(timeB).getTime() - new Date(timeA).getTime();
            })
            .slice(0, 5);
    };

    const formatAmount = (transaction: Transaction): string => {
        try {
            if (transaction.type === 'bonus') {
                return `$${(transaction.amountUsd || 0).toFixed(2)}`;
            }
            const amount = transaction.amount || 0;
            const currency = transaction.currency || 'USD';
            
            if (amount < 0.001) {
                return `${amount.toFixed(8)} ${currency}`;
            } else if (amount < 1) {
                return `${amount.toFixed(6)} ${currency}`;
            } else {
                return `${amount.toFixed(4)} ${currency}`;
            }
        } catch (error) {
            return '0.000000 USD';
        }
    };

    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'Unknown date';
        
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'sent':
                return <ArrowUp className="text-red-400" size={16} />;
            case 'received':
                return <ArrowDown className="text-green-400" size={16} />;
            case 'mined':
                return <Zap className="text-orange-400" size={16} />;
            case 'bonus':
                return <Gift className="text-purple-400" size={16} />;
            case 'swapped':
                return <RefreshCw className="text-blue-400" size={16} />;
            default:
                return <RefreshCw className="text-gray-400" size={16} />;
        }
    };

    const getTransactionTitle = (transaction: Transaction): string => {
        switch (transaction.type) {
            case 'sent':
                return 'Sent';
            case 'received':
                return 'Received';
            case 'mined':
                return `Mined ${transaction.coinName || 'Crypto'}`;
            case 'bonus':
                return 'Welcome Bonus';
            case 'swapped':
                return 'Swapped';
            default:
                return 'Transaction';
        }
    };

    const getAmountColor = (type: string): string => {
        switch (type) {
            case 'received':
            case 'bonus':
            case 'mined':
                return 'text-green-500 dark:text-green-400';
            case 'sent':
                return 'text-red-500 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-300';
        }
    };

    const getAmountPrefix = (type: string): string => {
        switch (type) {
            case 'received':
            case 'bonus':
            case 'mined':
                return '+';
            case 'sent':
                return '-';
            default:
                return '';
        }
    };

    const recentTransactions = getRecentTransactions();
    
    // Calculate real-time metrics
    const totalBalance = calculateTotalBalance();
    const portfolioChange = calculatePortfolioChange();
    const bitcoinBalance = calculateBitcoinBalance();
    const bitcoinChange = calculateBitcoin24hChange();
    const activityCount = calculate24hActivityCount();
    const totalTransactions = userData.transactions?.length || 0;

    return (
        <div ref={overviewRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome To Paycoin</h1>

            {/* Enhanced Withdrawal Ticker - Added Here */}
            <WithdrawalTicker />

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={DollarSign} 
                    title="Total Balance" 
                    value={`$${totalBalance.toFixed(2)}`}
                    change={calculatePercentageChange(totalBalance, portfolioChange)}
                    isPositive={portfolioChange >= 0}
                />
                <StatCard 
                    icon={TrendingUp} 
                    title="24h Portfolio Change" 
                    value={`$${portfolioChange.toFixed(2)}`}
                    change={calculatePercentageChange(totalBalance, portfolioChange)}
                    isPositive={portfolioChange >= 0}
                />
                <StatCard 
                    icon={Bitcoin} 
                    title="Bitcoin Balance" 
                    value={`${bitcoinBalance.toFixed(6)} BTC`}
                    change={calculatePercentageChange(bitcoinBalance, bitcoinChange)}
                    isPositive={bitcoinChange >= 0}
                />
                <StatCard 
                    icon={Zap} 
                    title="24h Activities" 
                    value={`${activityCount}`}
                    change={`${totalTransactions} total`}
                    isPositive={activityCount > 0}
                />
            </div>

            {/* Enhanced Ad Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-blue-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white">Start Mining Now</h2>
                    <p className="text-blue-100 mt-1">Put your hardware to work and earn crypto rewards.</p>
                </div>
                <button onClick={() => navigate('/dashboard/mine')} className="bg-white text-blue-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105 z-10">
                    Start Mining
                </button>
                <BarChart className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 w-28 h-28 transform rotate-[-15deg]" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        <button 
                            onClick={() => navigate('/dashboard/transactions')}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <RefreshCw className="mx-auto mb-3 text-gray-400" size={32} />
                                <p>No recent activity</p>
                                <p className="text-sm mt-2">Your transactions will appear here</p>
                                <button 
                                    onClick={() => navigate('/dashboard/mine')}
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Start Mining
                                </button>
                            </div>
                        ) : (
                            recentTransactions.map((transaction) => (
                                <div 
                                    key={transaction.id} 
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-colors cursor-pointer"
                                    onClick={() => navigate('/dashboard/transactions')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                                            {getTransactionIcon(transaction.type)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {getTransactionTitle(transaction)}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(transaction.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-mono font-semibold text-sm ${getAmountColor(transaction.type)}`}>
                                            {getAmountPrefix(transaction.type)}{formatAmount(transaction)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {transaction.status === 'completed' ? 'Completed' : 
                                             transaction.status === 'pending' ? 'Pending' : 'Failed'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* New Small Ads Section */}
                <div className="space-y-6">
                    <SmallAdCard 
                        icon={ShieldCheck}
                        title="Upgrade Your Security"
                        description="Enable Two-Factor Authentication for enhanced protection."
                        ctaText="Secure Account"
                        className="from-teal-500 to-cyan-600"
                        onClick={() => navigate('/dashboard/settings')}
                    />
                     <SmallAdCard 
                        icon={Zap}
                        title="Mine Ethereum"
                        description="Join the network and start mining the second-largest cryptocurrency."
                        ctaText="Mine Now"
                        className="from-indigo-500 to-purple-600"
                        onClick={() => navigate('/dashboard/mine')}
                    />
                    <SmallAdCard 
                        icon={BarChart}
                        title="View All Transactions"
                        description="See your complete transaction history and track all your activities."
                        ctaText="View History"
                        className="from-blue-500 to-purple-600"
                        onClick={() => navigate('/dashboard/transactions')}
                    />
                </div>
            </div>

            {/* New Referral Banner */}
            <div className={`p-6 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-lg ${
                hasClaimed 
                    ? 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/20' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20'
            }`}>
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Gift size={28} /> 
                        {hasClaimed ? 'Bonus Already Claimed!' : 'Click the button to claim your $50'}
                    </h2>
                    <p className={`mt-1 ${hasClaimed ? 'text-gray-200' : 'text-green-100'}`}>
                        {hasClaimed 
                            ? 'You have already received your welcome bonus. Check your wallet balance!' 
                            : 'Get $50 in BTC by Clicking on the Button NOW!'
                        }
                    </p>
                </div>
                <button 
                    onClick={handleClaimBonus}
                    disabled={hasClaimed || isClaiming}
                    className={`font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 ${
                        hasClaimed
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : isClaiming
                            ? 'bg-green-400 text-white cursor-wait'
                            : 'bg-white text-green-600 hover:bg-gray-100'
                    }`}
                >
                    {isClaiming 
                        ? 'Claiming...' 
                        : hasClaimed 
                        ? 'Bonus Claimed ✓' 
                        : 'Claim $50 worth of Bitcoin'
                    }
                </button>
            </div>
            {isClaimModalOpen && <ClaimSuccessModal onClose={() => setIsClaimModalOpen(false)} />}
        </div>
    );
};

// The rest of your components remain the same...
interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
}
const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, isPositive }) => (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-5 rounded-xl transition-all duration-300 hover:border-blue-500 hover:-translate-y-1">
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <Icon className="text-gray-400 dark:text-gray-500" size={24}/>
        </div>
        <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
        <div className={`flex items-center text-sm mt-1 ${isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span className="ml-1">{change}</span>
        </div>
    </div>
);

interface SmallAdCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    ctaText: string;
    className?: string;
    onClick?: () => void;
}
const SmallAdCard: React.FC<SmallAdCardProps> = ({ icon: Icon, title, description, ctaText, className, onClick }) => (
    <div className={`p-5 rounded-xl bg-gradient-to-br ${className} text-white shadow-lg flex-1 flex flex-col justify-between`}>
        <div>
            <div className="flex items-center gap-3">
                <Icon size={24} />
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            <p className="text-sm opacity-90 mt-2 mb-4">{description}</p>
        </div>
        <button onClick={onClick} className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg text-sm w-full text-left transition-colors">
            {ctaText}
        </button>
    </div>
);

const ClaimSuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        const backdropElement = backdropRef.current;

        gsap.set([backdropElement, modalElement], { autoAlpha: 1 });

        const tl = gsap.timeline();
        tl.to(backdropElement, { backgroundColor: 'rgba(0, 0, 0, 0.7)', duration: 0.3 })
          .fromTo(modalElement, 
              { scale: 0.8, y: 20 },
              { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }, 
              "-=0.2"
          );
        
        gsap.fromTo(".deco-coin", 
            { y: 10, opacity: 0 },
            { 
                y: -10, 
                opacity: 1, 
                duration: 1, 
                stagger: 0.2, 
                repeat: -1, 
                yoyo: true, 
                ease: 'sine.inOut' 
            }
        );
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({ onComplete: onClose });
        tl.to(modalRef.current, { scale: 0.8, autoAlpha: 0, duration: 0.3, ease: 'power2.in' })
          .to(backdropRef.current, { autoAlpha: 0, duration: 0.3 }, "-=0.2");
    };

    return (
        <div ref={backdropRef} onClick={handleClose} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-700 shadow-2xl relative text-center overflow-hidden"
            >
                <Bitcoin className="deco-coin absolute top-4 left-4 text-yellow-400/20 dark:text-yellow-300/10" size={32} />
                <Bitcoin className="deco-coin absolute bottom-12 right-8 text-yellow-400/20 dark:text-yellow-300/10" size={24} style={{ animationDelay: '0.5s' }} />
                <Bitcoin className="deco-coin absolute top-16 right-4 text-yellow-400/20 dark:text-yellow-300/10" size={20} style={{ animationDelay: '1s' }} />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full mx-auto flex items-center justify-center mb-4">
                        <CheckCircle className="text-green-500 dark:text-green-400" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Success!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">You have successfully claimed your $50!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">$50 has been added to your balance and equivalent BTC to your Bitcoin wallet.</p>
                    <button
                        onClick={handleClose}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-6 transition-transform transform hover:scale-105"
                    >
                        Great!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;