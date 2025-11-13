import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Bitcoin, Zap, BarChart, ShieldCheck, Gift, CheckCircle, X } from 'lucide-react';
import gsap from 'gsap';
import { claimBonus, hasClaimedBonus, subscribeToUserData } from '../../pages/auth/authService';
import { auth } from '../../firebase';

const Overview: React.FC = () => {
    const overviewRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        balance: 0,
        bitcoinBalance: 0,
        portfolioChange: 0,
        topGainer: 'Bitcoin',
        mostTraded: 'Ethereum'
    });
    const [user, setUser] = useState<any>(null);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        // Get current user
        const currentUser = auth.currentUser;
        setUser(currentUser);

        if (currentUser) {
            // Check if user has already claimed bonus
            const checkBonusClaim = async () => {
                const claimed = await hasClaimedBonus(currentUser.uid);
                setHasClaimed(claimed);
            };
            checkBonusClaim();

            // Subscribe to real-time user data
            const unsubscribe = subscribeToUserData(currentUser.uid, (data) => {
                if (data) {
                    setUserData({
                        balance: data.balance || 0,
                        bitcoinBalance: data.wallets?.bitcoin?.balance || 0,
                        portfolioChange: data.portfolioChange || 0,
                        topGainer: data.topGainer || 'Bitcoin',
                        mostTraded: data.mostTraded || 'Ethereum'
                    });
                }
            });

            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        gsap.fromTo(overviewRef.current?.children, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
        );
    }, []);

    const handleClaimBonus = async () => {
        if (!user) return;
        
        // Prevent multiple clicks
        if (isClaiming) return;
        
        // Check if already claimed
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
            } else {
                alert('Failed to claim bonus. Please try again.');
            }
        } catch (error) {
            console.error('Error claiming bonus:', error);
            alert('Failed to claim bonus. Please try again.');
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div ref={overviewRef} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome To paycoin</h1>

            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={DollarSign} 
                    title="Total Balance" 
                    value={`$${userData.balance.toFixed(2)}`} 
                    change="+0%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={TrendingUp} 
                    title="24h Portfolio Change" 
                    value={`$${userData.portfolioChange.toFixed(2)}`} 
                    change="+0%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={Bitcoin} 
                    title="Top Gainer" 
                    value={userData.topGainer} 
                    change="+0%" 
                    isPositive={true} 
                />
                <StatCard 
                    icon={Zap} 
                    title="Most Traded" 
                    value={userData.mostTraded} 
                    change="0%" 
                    isPositive={true} 
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
                {/* Recent Activity - Empty for new users */}
                <div className="lg:col-span-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
                    <div className="space-y-4">
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No recent activity</p>
                            <p className="text-sm mt-2">Your transactions will appear here</p>
                        </div>
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