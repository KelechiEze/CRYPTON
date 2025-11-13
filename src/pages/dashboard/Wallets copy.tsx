import React, { useState, useEffect, useRef } from 'react';
import { Coin } from '../../types';
import { ArrowUpRight, ArrowDownRight, Send, Download, X, CopyCheck, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { useCryptoData } from '../../contexts/CryptoDataContext';

const Wallets: React.FC = () => {
    const { coins, loading, balances, deductSentValue } = useCryptoData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'Send' | 'Receive' | null>(null);
    const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'copy' as 'copy' | 'send' });

    const walletRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && walletRef.current) {
            gsap.fromTo(walletRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
            );
        }
    }, [loading]);
    
    const showTempNotification = (message: string, type: 'copy' | 'send') => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: '', type });
        }, 2500);
    };

    const handleSend = (coin: Coin) => {
        setSelectedCoin(coin);
        setModalType('Send');
        setModalOpen(true);
    };

    const handleReceive = (coin: Coin) => {
        setSelectedCoin(coin);
        setModalType('Receive');
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCoin(null);
        setModalType(null);
    };

    const handleConfirmSend = (coinId: string, amount: number, price: number) => {
        const amountUsd = amount * price;
        deductSentValue(coinId, amountUsd);
        closeModal();
        showTempNotification('Sent Successfully!', 'send');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText("0x123Abc456Def789Ghi012Jkl345Mno678Pqr");
        showTempNotification('Address Copied!', 'copy');
    };

    if (loading) {
        return <div className="text-center text-gray-500 dark:text-gray-400">Loading your assets...</div>;
    }

    return (
        <div ref={walletRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Wallets</h1>
            
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
                                            <p className="text-sm text-gray-500 dark:text-gray-400">${balances[coin.id]?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        </div>
                                    </td>
                                    <td className="pt-4 md:p-4 md:table-cell">
                                        <div className="flex justify-end md:justify-center items-center gap-2">
                                            <button onClick={() => handleSend(coin)} className="flex items-center gap-2 bg-blue-600/50 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm">
                                                <Send size={14}/> Send
                                            </button>
                                            <button onClick={() => handleReceive(coin)} className="flex items-center gap-2 bg-green-600/50 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm">
                                                <Download size={14}/> Receive
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
                    onCopy={handleCopy}
                />
            )}
            {notification.show && <Notification message={notification.message} type={notification.type} />}
        </div>
    );
};

interface TransactionModalProps {
    type: 'Send' | 'Receive';
    coin: Coin;
    balance: number;
    onClose: () => void;
    onConfirmSend: (coinId: string, amount: number, price: number) => void;
    onCopy: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ type, coin, balance, onClose, onConfirmSend, onCopy }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const [amountUsd, setAmountUsd] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    }, []);

    const handleSubmit = () => {
        if (type === 'Receive') {
            onCopy();
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
            onConfirmSend(coin.id, cryptoAmount, coin.current_price);
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{type} {coin.name} ({coin.symbol.toUpperCase()})</h2>
                </div>
                
                {type === 'Send' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500 dark:text-gray-400">Recipient Address</label>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={`Enter ${coin.symbol.toUpperCase()} address`} className="w-full mt-1 bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="amount-usd" className="text-sm text-gray-500 dark:text-gray-400">Amount (USD)</label>
                                <span className="text-xs text-gray-400 dark:text-gray-500">Balance: ${balance.toFixed(2)}</span>
                            </div>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">$</span>
                                <input id="amount-usd" type="number" value={amountUsd} onChange={(e) => setAmountUsd(e.target.value)} placeholder="0.00" className="w-full bg-gray-100 dark:bg-gray-900/70 border border-gray-300 dark:border-gray-700 rounded-lg py-3 pl-7 pr-4 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
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

                {type === 'Receive' && (
                    <div className="space-y-4 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Share your address to receive {coin.name}.</p>
                        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm break-all">
                            0x123Abc456Def789Ghi012Jkl345Mno678Pqr
                        </div>
                         <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4 transition-transform transform hover:scale-105">
                            Copy Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}


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