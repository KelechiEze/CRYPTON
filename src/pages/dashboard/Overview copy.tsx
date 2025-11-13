import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Bitcoin, Zap, BarChart, ShieldCheck, Gift, CheckCircle, X } from 'lucide-react';
import gsap from 'gsap';

const Overview: React.FC = () => {
    const overviewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

    useEffect(() => {
        gsap.fromTo(overviewRef.current?.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
        );
    }, []);

    return (
        <div ref={overviewRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} title="Total Balance" value="$12,842.55" change="+2.5%" isPositive={true} />
                <StatCard icon={TrendingUp} title="24h Portfolio Change" value="$312.10" change="+2.5%" isPositive={true} />
                <StatCard icon={Bitcoin} title="Top Gainer" value="Solana" change="+12.8%" isPositive={true} />
                <StatCard icon={Zap} title="Most Traded" value="Ethereum" change="-3.1%" isPositive={false} />
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
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                    <div className="space-y-4">
                        <ActivityItem type="Sent" crypto="Bitcoin" amount="0.005 BTC" value="$340.12" time="2 hours ago" />
                        <ActivityItem type="Received" crypto="Ethereum" amount="0.1 ETH" value="$350.80" time="5 hours ago" />
                        <ActivityItem type="Swapped" crypto="SOL for USDC" amount="10 SOL" value="$1500.00" time="1 day ago" />
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
                </div>
            </div>

            {/* New Referral Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-lg shadow-green-500/20">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3"><Gift size={28} /> Click the button to claim your $50</h2>
                    <p className="text-green-100 mt-1">Get $50 in BTC by Clicking on the Button NOW!</p>
                </div>
                <button 
                    onClick={() => setIsClaimModalOpen(true)}
                    className="bg-white text-green-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
                >
                    Claim $50 worth of Bitcoin
                </button>
            </div>
            {isClaimModalOpen && <ClaimSuccessModal onClose={() => setIsClaimModalOpen(false)} />}
        </div>
    );
};

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

interface ActivityItemProps {
    type: string;
    crypto: string;
    amount: string;
    value: string;
    time: string;
}
const ActivityItem: React.FC<ActivityItemProps> = ({ type, crypto, amount, value, time }) => {
    const isPositive = type === 'Received';
    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
            <div className="flex items-center">
                <div className={`p-2 rounded-full mr-4 ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isPositive ? <ArrowDownRight className="text-green-400" size={20}/> : <ArrowUpRight className="text-red-400" size={20}/>}
                </div>
                <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{type} {crypto}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{time}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">{amount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{value}</p>
            </div>
        </div>
    );
};

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
        
        // Decorative icons animation
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
                {/* Decorative Elements */}
                <Bitcoin className="deco-coin absolute top-4 left-4 text-yellow-400/20 dark:text-yellow-300/10" size={32} />
                <Bitcoin className="deco-coin absolute bottom-12 right-8 text-yellow-400/20 dark:text-yellow-300/10" size={24} style={{ animationDelay: '0.5s' }} />
                <Bitcoin className="deco-coin absolute top-16 right-4 text-yellow-400/20 dark:text-yellow-300/10" size={20} style={{ animationDelay: '1s' }} />

                <div className="relative z-10">
                    <div className="w-20 h-20 bg-green-500/20 dark:bg-green-400/20 rounded-full mx-auto flex items-center justify-center mb-4">
                        <CheckCircle className="text-green-500 dark:text-green-400" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Success!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">You have successfully claimed your $50!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">The Bitcoin will be added to your wallet balance shortly.</p>
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