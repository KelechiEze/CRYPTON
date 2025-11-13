import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, X, Copy } from 'lucide-react';
import gsap from 'gsap';
import { subscribeToUserData } from '../../pages/auth/authService';
import { auth } from '../../firebase';

interface Transaction {
    id: string;
    type: 'sent' | 'received' | 'swapped' | 'bonus' | 'mined';
    coinId?: string;
    amount?: number;
    amountUsd?: number;
    currency?: string;
    description?: string;
    status: 'completed' | 'pending' | 'failed';
    timestamp: any;
    transactionHash?: string;
    fromAddress?: string;
    toAddress?: string;
    recipientAddress?: string;
    fee?: number;
}

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get current user
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            // Subscribe to real-time user data for transactions
            const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
                if (data && data.transactions && Array.isArray(data.transactions)) {
                    // Convert Firebase transactions to our format with safe data access
                    const userTransactions: Transaction[] = data.transactions.map((tx: any) => ({
                        id: tx.id || 'unknown',
                        type: tx.type || 'unknown',
                        coinId: tx.coinId,
                        amount: typeof tx.amount === 'number' ? tx.amount : 0,
                        amountUsd: typeof tx.amountUsd === 'number' ? tx.amountUsd : 0,
                        currency: tx.currency || 'USD',
                        description: tx.description || 'Transaction',
                        status: tx.status || 'completed',
                        timestamp: tx.timestamp,
                        transactionHash: tx.transactionHash,
                        fromAddress: tx.fromAddress,
                        toAddress: tx.toAddress,
                        recipientAddress: tx.recipientAddress,
                        fee: typeof tx.fee === 'number' ? tx.fee : 0
                    }));
                    
                    // Sort by timestamp descending (newest first)
                    userTransactions.sort((a, b) => {
                        const timeA = a.timestamp?.toDate?.() || a.timestamp;
                        const timeB = b.timestamp?.toDate?.() || b.timestamp;
                        return new Date(timeB).getTime() - new Date(timeA).getTime();
                    });
                    setTransactions(userTransactions);
                } else {
                    setTransactions([]);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
            setTransactions([]);
        }
    }, []);

    useEffect(() => {
        if (!loading && tableRef.current) {
            gsap.fromTo(tableRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
        }
    }, [loading]);

    const handleRowClick = (tx: Transaction) => {
        setSelectedTx(tx);
    };

    const handleCloseModal = () => {
        setSelectedTx(null);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-500/20 text-green-400';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'failed': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    
    const getDisplayType = (type: string): string => {
        switch (type) {
            case 'sent': return 'Sent';
            case 'received': return 'Received';
            case 'swapped': return 'Swapped';
            case 'bonus': return 'Bonus';
            case 'mined': return 'Mined';
            default: return 'Transaction';
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'sent': return <ArrowUpRight className="text-red-400" size={20}/>;
            case 'received': return <ArrowDownRight className="text-green-400" size={20}/>;
            case 'swapped': return <RefreshCw className="text-blue-400" size={20}/>;
            case 'bonus': return <ArrowDownRight className="text-purple-400" size={20}/>;
            case 'mined': return <RefreshCw className="text-orange-400" size={20}/>;
            default: return <RefreshCw className="text-gray-400" size={20}/>;
        }
    };

    const formatAmount = (tx: Transaction): string => {
        try {
            if (tx.type === 'bonus') {
                return `$${(tx.amountUsd || 0).toFixed(2)} USD`;
            }
            const amount = tx.amount || 0;
            const currency = tx.currency || 'USD';
            return `${amount.toFixed(6)} ${currency}`;
        } catch (error) {
            return '0.000000 USD';
        }
    };

    const formatValue = (tx: Transaction): string => {
        try {
            const amountUsd = tx.amountUsd || 0;
            return `$${amountUsd.toFixed(2)}`;
        } catch (error) {
            return '$0.00';
        }
    };

    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'Unknown date';
        
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getDisplayCrypto = (tx: Transaction): string => {
        if (tx.type === 'bonus') {
            return 'Welcome Bonus';
        }
        if (tx.type === 'mined') {
            const coinName = tx.coinId ? tx.coinId.charAt(0).toUpperCase() + tx.coinId.slice(1) : 'Crypto';
            return `${coinName} Mining`;
        }
        return tx.coinId ? tx.coinId.charAt(0).toUpperCase() + tx.coinId.slice(1) : 'Crypto';
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Loading transactions...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>

            <div ref={tableRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">No transactions yet</p>
                        <p className="text-sm">Your transaction history will appear here</p>
                    </div>
                ) : (
                    <div>
                        <table className="w-full">
                            <thead className="hidden md:table-header-group border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-500 dark:text-gray-400">Type</th>
                                    <th className="text-left p-4 font-semibold text-gray-500 dark:text-gray-400">Asset</th>
                                    <th className="text-right p-4 font-semibold text-gray-500 dark:text-gray-400">Amount</th>
                                    <th className="text-right p-4 font-semibold text-gray-500 dark:text-gray-400">Value</th>
                                    <th className="text-left p-4 font-semibold text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="text-center p-4 font-semibold text-gray-500 dark:text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="block md:table-row-group">
                                {transactions.map(tx => (
                                    <tr key={tx.id} onClick={() => handleRowClick(tx)} className="block md:table-row mb-4 last:mb-0 md:mb-0 rounded-lg p-4 md:p-0 shadow-lg md:shadow-none bg-white/60 dark:bg-gray-800/60 md:bg-transparent dark:md:bg-transparent md:border-b md:border-gray-200 dark:md:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Type</span>
                                            <div className="flex items-center gap-3">
                                                {getIcon(tx.type)}
                                                <span>{getDisplayType(tx.type)}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:font-semibold border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Asset</span>
                                            <span>{getDisplayCrypto(tx)}</span>
                                        </td>
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Amount</span>
                                            <span>{formatAmount(tx)}</span>
                                        </td>
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono text-gray-600 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Value</span>
                                            <span>{formatValue(tx)}</span>
                                        </td>
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Date</span>
                                            <span>{formatDate(tx.timestamp)}</span>
                                        </td>
                                        <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-center">
                                            <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Status</span>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(tx.status)}`}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {selectedTx && <TransactionDetailModal transaction={selectedTx} onClose={handleCloseModal} getStatusClass={getStatusClass} getIcon={getIcon} />}
        </div>
    );
};

interface TransactionDetailModalProps {
    transaction: Transaction;
    onClose: () => void;
    getStatusClass: (status: string) => string;
    getIcon: (type: string) => React.ReactNode;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, onClose, getStatusClass, getIcon }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
    }, []);

    const handleCopy = (text: string = '') => {
        navigator.clipboard.writeText(text);
        // You can add a toast notification here if needed
    };

    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'Unknown date';
        
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            if (isNaN(date.getTime())) return 'Invalid date';
            
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    const getDisplayType = (type: string): string => {
        switch (type) {
            case 'sent': return 'Sent';
            case 'received': return 'Received';
            case 'swapped': return 'Swapped';
            case 'bonus': return 'Bonus';
            case 'mined': return 'Mined';
            default: return 'Transaction';
        }
    };

    const getDisplayCrypto = (tx: Transaction): string => {
        if (tx.type === 'bonus') {
            return 'Welcome Bonus';
        }
        if (tx.type === 'mined') {
            const coinName = tx.coinId ? tx.coinId.charAt(0).toUpperCase() + tx.coinId.slice(1) : 'Crypto';
            return `${coinName} Mining`;
        }
        return tx.coinId ? tx.coinId.charAt(0).toUpperCase() + tx.coinId.slice(1) : 'Crypto';
    };

    const formatAmount = (tx: Transaction): string => {
        try {
            if (tx.type === 'bonus') {
                return `$${(tx.amountUsd || 0).toFixed(2)} USD`;
            }
            const amount = tx.amount || 0;
            const currency = tx.currency || 'USD';
            return `${amount.toFixed(6)} ${currency}`;
        } catch (error) {
            return '0.000000 USD';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-full ${
                        transaction.type === 'received' || transaction.type === 'bonus' ? 'bg-green-500/20' : 
                        transaction.type === 'sent' ? 'bg-red-500/20' : 
                        'bg-blue-500/20'
                    }`}>
                        {getIcon(transaction.type)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
                </div>
                
                <div className="space-y-4">
                    <DetailRow label="Type" value={getDisplayType(transaction.type)} />
                    <DetailRow label="Asset" value={getDisplayCrypto(transaction)} />
                    <DetailRow label="Amount" value={formatAmount(transaction)} />
                    <DetailRow label="Value" value={`$${(transaction.amountUsd || 0).toFixed(2)}`} />
                    <DetailRow label="Description" value={transaction.description || 'Transaction'} />
                    <DetailRow label="Date" value={formatDate(transaction.timestamp)} />
                    <DetailRow label="Status">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                    </DetailRow>
                    
                    {(transaction.recipientAddress || transaction.fromAddress) && (
                        <>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            {transaction.recipientAddress && (
                                <DetailRow label="Recipient Address" value={transaction.recipientAddress} isAddress />
                            )}
                            {transaction.fromAddress && (
                                <DetailRow label="From Address" value={transaction.fromAddress} isAddress />
                            )}
                        </>
                    )}
                    
                    {transaction.fee && transaction.fee > 0 && (
                        <DetailRow label="Transaction Fee" value={`${transaction.fee} ${transaction.currency || 'USD'}`} />
                    )}
                </div>
            </div>
        </div>
    );
};

interface DetailRowProps {
    label: string;
    value?: string;
    children?: React.ReactNode;
    isAddress?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, children, isAddress }) => (
    <div className="flex justify-between items-start">
        <p className="text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        {children ? (
            <div className="text-right">{children}</div>
        ) : (
            <div className={`flex items-center gap-2 ${isAddress ? 'font-mono text-sm max-w-[200px] truncate' : 'font-semibold text-right'}`}>
                <span title={isAddress ? value : undefined}>{value || 'N/A'}</span>
                {isAddress && value && (
                    <button 
                        onClick={() => navigator.clipboard.writeText(value)} 
                        className="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0"
                    >
                        <Copy size={14} />
                    </button>
                )}
            </div>
        )}
    </div>
);

export default Transactions;