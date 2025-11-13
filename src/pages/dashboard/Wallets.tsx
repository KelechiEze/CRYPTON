import React, { useState, useEffect, useRef } from 'react';
import { Coin } from '../../types';
import { ArrowUpRight, ArrowDownRight, Send, Download, X, CopyCheck, CheckCircle, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { useCryptoData } from '../../contexts/CryptoDataContext';
import { auth } from '../../firebase';
import { getUserWalletAddresses, updateUserWalletAddress, generateNewWalletAddress, isAdminUser } from '../../pages/auth/authService';

const Wallets: React.FC = () => {
    const { coins, loading, balances, deductSentValue } = useCryptoData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'Send' | 'Receive' | 'WithdrawalInfo' | null>(null);
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'copy' as 'copy' | 'send' });
    const [walletAddresses, setWalletAddresses] = useState<{[key: string]: string}>({});
    const [user, setUser] = useState<any>(null);
    const [isGeneratingAddress, setIsGeneratingAddress] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    const walletRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        
        if (currentUser) {
            const fetchUserData = async () => {
                try {
                    const addresses = await getUserWalletAddresses(currentUser.uid);
                    setWalletAddresses(addresses || {});
                    
                    // Check if user is admin
                    const adminStatus = await isAdminUser(currentUser.uid);
                    setIsAdmin(adminStatus);
                    
                    // Fetch user data to check withdrawal conditions
                    const userDoc = await getUserData(currentUser.uid);
                    setUserData(userDoc);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    showTempNotification('Error loading wallet data', 'copy');
                }
            };
            fetchUserData();
        }
    }, []);

    useEffect(() => {
        if (!loading && walletRef.current) {
            gsap.fromTo(walletRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading]);

    // Check if user can withdraw
    const canWithdraw = (): boolean => {
        if (isAdmin) return true;
        
        if (!userData) return false;
        
        // Check if user has minimum balance of $6000
        const hasMinimumBalance = userData.balance >= 6000;
        
        // Check if user has made any deposits (received, bonus, mined transactions)
        const hasDeposits = userData.transactions && userData.transactions.some((tx: any) => 
            ['received', 'bonus', 'mined', 'deposit'].includes(tx.type)
        );
        
        return hasMinimumBalance || hasDeposits;
    };

    // Get withdrawal eligibility message
    const getWithdrawalEligibility = (): { canWithdraw: boolean; message: string } => {
        if (isAdmin) {
            return { canWithdraw: true, message: 'Admin privileges enabled' };
        }
        
        if (!userData) {
            return { canWithdraw: false, message: 'Loading user data...' };
        }
        
        const hasMinimumBalance = userData.balance >= 6000;
        const hasDeposits = userData.transactions && userData.transactions.some((tx: any) => 
            ['received', 'bonus', 'mined', 'deposit'].includes(tx.type)
        );
        
        if (hasMinimumBalance) {
            return { canWithdraw: true, message: 'Minimum balance requirement met ($6000+)' };
        }
        
        if (hasDeposits) {
            return { canWithdraw: true, message: 'Deposit history verified' };
        }
        
        return { 
            canWithdraw: false, 
            message: 'Requires $6000 minimum balance or deposit history. Contact customer care for guidance.' 
        };
    };
    
    const showTempNotification = (message: string, type: 'copy' | 'send') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type });
        }, 2500);
    };

    const handleSend = (coin: Coin) => {
        const eligibility = getWithdrawalEligibility();
        
        if (!eligibility.canWithdraw && !isAdmin) {
            setSelectedCoin(coin);
            setModalType('WithdrawalInfo');
            setModalOpen(true);
            return;
        }
        
        setSelectedCoin(coin);
        setModalType('Send');
        setModalOpen(true);
    };

    const handleReceive = async (coin: Coin) => {
        setSelectedCoin(coin);
        setModalType('Receive');
        
        // Generate or fetch address for this coin if it doesn't exist
        if (!walletAddresses[coin.id] && user) {
            setIsGeneratingAddress(true);
            try {
                const newAddress = await generateNewWalletAddress(user.uid, coin.id);
                setWalletAddresses(prev => ({
                    ...prev,
                    [coin.id]: newAddress
                }));
                showTempNotification(`New ${coin.name} address generated!`, 'copy');
            } catch (error) {
                console.error('Error generating wallet address:', error);
                showTempNotification('Error generating wallet address', 'copy');
            } finally {
                setIsGeneratingAddress(false);
            }
        }
        
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCoin(null);
        setModalType(null);
        setIsGeneratingAddress(false);
    };

    const handleConfirmSend = async (coinId: string, amount: number, price: number, recipientAddress: string) => {
        const amountUsd = amount * price;
        await deductSentValue(coinId, amountUsd, recipientAddress);
        closeModal();
        showTempNotification('Sent Successfully!', 'send');
    };

    const handleCopy = (coinId: string) => {
        const address = walletAddresses[coinId];
        if (address) {
            navigator.clipboard.writeText(address);
            showTempNotification('Address Copied!', 'copy');
        } else {
            showTempNotification('No address found for this coin', 'copy');
        }
    };

    const handleContactSupport = () => {
        window.open('https://t.me/your-support-channel', '_blank');
    };

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400">Loading your assets...</div>;
    }

    const eligibility = getWithdrawalEligibility();

    return (
        <div ref={walletRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Wallets</h1>
            
            {/* Withdrawal Eligibility Banner */}
            {!isAdmin && (
                <div className={`p-4 rounded-xl border ${
                    eligibility.canWithdraw 
                        ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                                eligibility.canWithdraw ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="text-sm font-medium">{eligibility.message}</span>
                        </div>
                        {!eligibility.canWithdraw && (
                          <button
                            disabled
                            onClick={handleContactSupport}
                            className="flex items-center gap-2 bg-yellow-500 text-white font-semibold py-1 px-3 rounded-lg text-sm 
                                        opacity-50 cursor-not-allowed"
                            >
                            <MessageCircle size={14} />
                            Contact Support
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
                <div>
                    <table className="w-full">
                        <thead className="hidden md:table-header-group border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="text-left p-4 font-semibold text-gray-500 dark:text-gray-400">Asset</th>
                                <th className="text-right p-4 font-semibold text-gray-500 dark:text-gray-400">Price</th>
                                <th className="text-right p-4 font-semibold text-gray-500 dark:text-gray-400">24h Change</th>
                                <th className="text-right p-4 font-semibold text-gray-500 dark:text-gray-400">Balance</th>
                                <th className="text-center p-4 font-semibold text-gray-500 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {coins.map(coin => (
                                <tr key={coin.id} className="block md:table-row mb-4 last:mb-0 md:mb-0 rounded-lg p-4 md:p-0 shadow-lg md:shadow-none bg-white/60 dark:bg-gray-800/60 md:bg-transparent dark:md:bg-transparent md:border-b md:border-gray-200 dark:md:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-0 pb-3 md:p-4 flex items-center md:table-cell border-b border-gray-200 dark:border-gray-700 md:border-0">
                                        <img src={coin.image} alt={coin.name} className="w-10 h-10 mr-4"/>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{coin.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</p>
                                        </div>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Price</span>
                                        <span>${coin.current_price.toLocaleString()}</span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">24h Change</span>
                                        <span className={`flex justify-end items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                            {coin.price_change_percentage_24h >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            {coin.price_change_percentage_24h.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Balance</span>
                                        <div className="text-right">
                                            <p>{balances[coin.id] ? (balances[coin.id] / coin.current_price).toFixed(6) : '0.00'} {coin.symbol.toUpperCase()}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">${balances[coin.id]?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                                        </div>
                                    </td>
                                    <td className="pt-4 md:p-4 md:table-cell">
                                        <div className="flex justify-end md:justify-center items-center gap-2">
                                            <button 
                                                onClick={() => handleSend(coin)} 
                                                disabled={!balances[coin.id] || balances[coin.id] <= 0}
                                                className={`flex items-center gap-2 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm ${
                                                    !balances[coin.id] || balances[coin.id] <= 0
                                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                        : eligibility.canWithdraw || isAdmin
                                                        ? 'bg-blue-600/50 hover:bg-blue-600 text-white'
                                                        : 'bg-yellow-500/50 hover:bg-yellow-500 text-white'
                                                }`}
                                            >
                                                <Send size={14}/> 
                                                {eligibility.canWithdraw || isAdmin ? 'Withdraw' : 'Request Withdrawal'}
                                            </button>
                                            <button 
                                                onClick={() => handleReceive(coin)} 
                                                disabled={isGeneratingAddress}
                                                className={`flex items-center gap-2 font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm ${
                                                    isGeneratingAddress
                                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                                        : 'bg-green-600/50 hover:bg-green-600 text-white'
                                                }`}
                                            >
                                                <Download size={14}/> 
                                                {isGeneratingAddress ? 'Generating...' : 'Receive'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-purple-500/20">
                <div>
                    <h2 className="text-2xl font-bold text-white">Explore DeFi Opportunities</h2>
                    <p className="text-purple-100">Discover new tokens and high-yield farms in our ecosystem.</p>
                </div>
                <button className="bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105">
                    Explore Now
                </button>
            </div>
            
            {isModalOpen && selectedCoin && (
                <TransactionModal
                    type={modalType!}
                    coin={selectedCoin}
                    onClose={closeModal}
                    balance={balances[selectedCoin.id] || 0}
                    onConfirmSend={handleConfirmSend}
                    onCopy={() => handleCopy(selectedCoin.id)}
                    walletAddress={walletAddresses[selectedCoin.id] || ''}
                    isGeneratingAddress={isGeneratingAddress}
                    canWithdraw={eligibility.canWithdraw || isAdmin}
                    onContactSupport={handleContactSupport}
                />
            )}
            {notification.show && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

// Update TransactionModalProps interface
interface TransactionModalProps {
    type: 'Send' | 'Receive' | 'WithdrawalInfo';
    coin: Coin;
    balance: number;
    onClose: () => void;
    onConfirmSend: (coinId: string, amount: number, price: number, recipientAddress: string) => void;
    onCopy: () => void;
    walletAddress: string;
    isGeneratingAddress?: boolean;
    canWithdraw?: boolean;
    onContactSupport?: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
    type, 
    coin, 
    balance, 
    onClose, 
    onConfirmSend, 
    onCopy, 
    walletAddress,
    isGeneratingAddress = false,
    canWithdraw = false,
    onContactSupport
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [amountUsd, setAmountUsd] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    }, []);

    const handleSubmit = () => {
        if (type === 'Receive') {
            if (walletAddress) {
                onCopy();
                onClose();
            }
            return;
        }

        if (type === 'Send') {
            const numericAmountUsd = parseFloat(amountUsd);
            
            if (!address.trim()) {
                setError('Recipient address cannot be empty.');
                return;
            }
            if (isNaN(numericAmountUsd) || numericAmountUsd <= 0) {
                setError('Please enter a valid positive amount.');
                return;
            }
            if (numericAmountUsd > balance) {
                setError('Insufficient funds for this transaction.');
                return;
            }
            
            setError('');
            const cryptoAmount = numericAmountUsd / coin.current_price;
            onConfirmSend(coin.id, cryptoAmount, coin.current_price, address);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-4 mb-6">
                    <img src={coin.image} alt={coin.name} className="w-12 h-12"/>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {type === 'WithdrawalInfo' ? 'Withdrawal Requirements' : `${type} ${coin.name} (${coin.symbol.toUpperCase()})`}
                    </h2>
                </div>
                
                {type === 'Send' && canWithdraw && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">Recipient Address</label>
                            <input 
                                type="text" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                                placeholder={`Enter ${coin.symbol.toUpperCase()} address`} 
                                className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="amount-usd" className="text-sm text-gray-500 dark:text-gray-400">Amount (USD)</label>
                                <span className="text-xs text-gray-400 dark:text-gray-500">Balance: ${balance.toFixed(2)}</span>
                            </div>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">$</span>
                                <input 
                                    id="amount-usd" 
                                    type="number" 
                                    value={amountUsd} 
                                    onChange={(e) => setAmountUsd(e.target.value)} 
                                    placeholder="0.00" 
                                    className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-7 pr-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {parseFloat(amountUsd) > 0 && coin.current_price > 0 && (
                                <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    ≈ {(parseFloat(amountUsd) / coin.current_price).toFixed(8)} {coin.symbol.toUpperCase()}
                                </p>
                            )}
                        </div>
                        {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}
                        <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg !mt-6 transition-transform transform hover:scale-105">
                            Confirm Send
                        </button>
                    </div>
                )}

                {type === 'WithdrawalInfo' && (
                    <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full mx-auto flex items-center justify-center mb-4">
                            <MessageCircle className="text-yellow-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Withdrawal Requirements</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            To enable withdrawals, you need to meet one of the following conditions:
                        </p>
                        <div className="text-left space-y-2 bg-yellow-500/10 p-4 rounded-lg">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">• Maintain a minimum balance of $6,000 USD if you are a miner</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">• Make a deposit into your wallet</p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            If you need assistance or have questions about our withdrawal policy, please contact our customer care team in the chat below.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={onClose}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors"
                            >
                                Close
                            </button>
                           <button 
                                disabled
                                onClick={onContactSupport}
                                className="flex-1 bg-yellow-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 
                                            opacity-50 cursor-not-allowed"
                                >
                                <MessageCircle size={16} />
                                Contact Support
                                </button>
                        </div>
                    </div>
                )}

                {type === 'Receive' && (
                    <div className="space-y-4 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Share your address to receive {coin.name}.</p>
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm break-all">
                            {isGeneratingAddress ? (
                                <div className="flex items-center justify-center gap-2 text-gray-500">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    Generating address...
                                </div>
                            ) : walletAddress ? (
                                walletAddress
                            ) : (
                                'No address available'
                            )}
                        </div>
                         <button 
                            onClick={handleSubmit} 
                            disabled={!walletAddress || isGeneratingAddress}
                            className={`w-full font-bold py-3 rounded-lg mt-4 transition-transform transform hover:scale-105 ${
                                walletAddress && !isGeneratingAddress
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                        >
                            {isGeneratingAddress ? 'Generating...' : 'Copy Address'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Rest of the code remains the same...
interface NotificationProps {
    message: string;
    type: 'copy' | 'send';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(notifRef.current, 
            { opacity: 0, y: 50, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
    }, []);

    const iconElement = type === 'copy' ? <CopyCheck size={24} className="text-blue-500 dark:text-blue-400" /> : <CheckCircle size={24} className="text-green-500 dark:text-green-400" />;

    return (
        <div ref={notifRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
                {iconElement}
                <span className="font-semibold">{message}</span>
            </div>
        </div>
    );
};

export default Wallets;