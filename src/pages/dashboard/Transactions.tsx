import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, X, Copy } from 'lucide-react';
import gsap from 'gsap';

interface Transaction {
    id: number;
    type: 'Sent' | 'Received' | 'Swapped';
    crypto: string;
    amount: string;
    value: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Failed';
    transactionHash: string;
    fromAddress: string;
    toAddress: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, type: 'Sent', crypto: 'Bitcoin', amount: '0.005 BTC', value: '$340.12', date: '2023-10-27 14:30', status: 'Completed', transactionHash: '0xabc...123', fromAddress: 'you.eth', toAddress: 'friend.eth' },
  { id: 2, type: 'Received', crypto: 'Ethereum', amount: '0.1 ETH', value: '$350.80', date: '2023-10-27 09:15', status: 'Completed', transactionHash: '0xdef...456', fromAddress: 'exchange.eth', toAddress: 'you.eth' },
  { id: 3, type: 'Swapped', crypto: 'SOL to USDC', amount: '10 SOL', value: '$1500.00', date: '2023-10-26 18:00', status: 'Completed', transactionHash: '0xghi...789', fromAddress: 'you.eth', toAddress: 'you.eth' },
  { id: 4, type: 'Received', crypto: 'Dogecoin', amount: '1000 DOGE', value: '$150.00', date: '2023-10-25 11:45', status: 'Completed', transactionHash: '0xjkl...012', fromAddress: 'faucet.doge', toAddress: 'you.eth' },
  { id: 5, type: 'Sent', crypto: 'Ethereum', amount: '0.02 ETH', value: '$70.00', date: '2023-10-24 20:05', status: 'Pending', transactionHash: '0xmno...345', fromAddress: 'you.eth', toAddress: 'service.eth' },
  { id: 6, type: 'Received', crypto: 'Bitcoin', amount: '0.001 BTC', value: '$68.00', date: '2023-10-23 12:00', status: 'Failed', transactionHash: '0xpqr...678', fromAddress: 'unknown.btc', toAddress: 'you.eth' },
];


const Transactions: React.FC = () => {
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(tableRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
    }, []);

    const handleRowClick = (tx: Transaction) => {
        setSelectedTx(tx);
    };

    const handleCloseModal = () => {
        setSelectedTx(null);
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Completed': return 'bg-green-500/20 text-green-400';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'Failed': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };
    
    const getIcon = (type: string) => {
        switch (type) {
            case 'Sent': return <ArrowUpRight className="text-red-400" size={20}/>;
            case 'Received': return <ArrowDownRight className="text-green-400" size={20}/>;
            case 'Swapped': return <RefreshCw className="text-blue-400" size={20}/>;
            default: return null;
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transaction History</h1>

            <div ref={tableRef} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6">
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
                            {mockTransactions.map(tx => (
                                <tr key={tx.id} onClick={() => handleRowClick(tx)} className="block md:table-row mb-4 last:mb-0 md:mb-0 rounded-lg p-4 md:p-0 shadow-lg md:shadow-none bg-white/60 dark:bg-gray-800/60 md:bg-transparent dark:md:bg-transparent md:border-b md:border-gray-200 dark:md:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Type</span>
                                        <div className="flex items-center gap-3">
                                            {getIcon(tx.type)}
                                            <span>{tx.type}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:font-semibold border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Asset</span>
                                        <span>{tx.crypto}</span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Amount</span>
                                        <span>{tx.amount}</span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-right font-mono text-gray-600 dark:text-gray-300 border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Value</span>
                                        <span>{tx.value}</span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/50 md:border-b-0">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Date</span>
                                        <span>{tx.date}</span>
                                    </td>
                                    <td className="py-2 md:p-4 flex justify-between items-center md:table-cell md:text-center">
                                        <span className="font-semibold text-sm text-gray-500 dark:text-gray-400 md:hidden">Status</span>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Maybe show a small toast/feedback later
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <X size={24} />
                </button>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-2 rounded-full ${transaction.type === 'Received' ? 'bg-green-500/20' : transaction.type === 'Sent' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                        {getIcon(transaction.type)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
                </div>
                
                <div className="space-y-4">
                    <DetailRow label="Type" value={transaction.type} />
                    <DetailRow label="Asset" value={transaction.crypto} />
                    <DetailRow label="Amount" value={`${transaction.amount} (${transaction.value})`} />
                    <DetailRow label="Date" value={transaction.date} />
                    <DetailRow label="Status">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                            {transaction.status}
                        </span>
                    </DetailRow>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <DetailRow label="From" value={transaction.fromAddress} isAddress />
                    <DetailRow label="To" value={transaction.toAddress} isAddress />
                    <DetailRow label="Transaction Hash" value={transaction.transactionHash} isAddress />
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
        <p className="text-gray-500 dark:text-gray-400">{label}</p>
        {children ? <div className="text-right">{children}</div> : (
            <div className={`flex items-center gap-2 ${isAddress ? 'font-mono text-sm' : 'font-semibold'}`}>
                <span>{value}</span>
                {isAddress && (
                    <button onClick={() => navigator.clipboard.writeText(value || '')} className="text-gray-400 hover:text-blue-500 transition-colors">
                        <Copy size={14} />
                    </button>
                )}
            </div>
        )}
    </div>
);


export default Transactions;