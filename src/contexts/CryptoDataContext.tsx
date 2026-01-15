import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Coin } from '../types';
import { getCryptoData } from './coingeckoService';
import { 
  subscribeToUserData, 
  updateWalletBalance, 
  updateUserBalance, 
  addTransaction
} from '../pages/auth/authService';
import { auth } from '../firebase';

interface CryptoDataContextType {
  coins: Coin[];
  loading: boolean;
  balances: { [key: string]: number }; // coin.id -> balance in USD
  addMinedValue: (coinId: string, valueToAdd: number) => void;
  deductSentValue: (coinId: string, valueToDeduct: number, recipientAddress?: string) => void;
  refreshData: () => Promise<void>;
  addCoinToContext: (coin: Coin) => void; // NEW: Add coin to context
  refreshBalances: () => Promise<void>; // NEW: Refresh balances
  getUserWallets: () => Promise<{[key: string]: any}>; // NEW: Get user wallets
}

const CryptoDataContext = createContext<CryptoDataContextType | undefined>(undefined);

// USOR coin definition
const USOR_COIN: Coin = {
  id: 'usor',
  symbol: 'usor',
  name: 'USOR',
  image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
  current_price: 1.00,
  market_cap: 0,
  market_cap_rank: null,
  fully_diluted_valuation: null,
  total_volume: 0,
  high_24h: 1.00,
  low_24h: 1.00,
  price_change_24h: 0,
  price_change_percentage_24h: 0,
  market_cap_change_24h: 0,
  market_cap_change_percentage_24h: 0,
  circulating_supply: 0,
  total_supply: 0,
  max_supply: null,
  ath: 1.00,
  ath_change_percentage: 0,
  ath_date: new Date().toISOString(),
  atl: 1.00,
  atl_change_percentage: 0,
  atl_date: new Date().toISOString(),
  last_updated: new Date().toISOString(),
  sparkline_in_7d: { price: Array(168).fill(1.00) }
};

export const CryptoDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [user, setUser] = useState<any>(null);

  // Function to manually add a coin to the context
  const addCoinToContext = useCallback((coin: Coin) => {
    setCoins(prevCoins => {
      // Check if coin already exists
      if (prevCoins.some(c => c.id === coin.id)) {
        return prevCoins;
      }
      
      console.log('Adding coin to context:', coin.id, coin.name);
      return [...prevCoins, coin];
    });
    
    // Initialize balance for the new coin
    setBalances(prevBalances => ({
      ...prevBalances,
      [coin.id]: 0
    }));
    
    console.log('Balance initialized for coin:', coin.id);
  }, []);

  // Function to get user wallets
  const getUserWallets = useCallback(async (): Promise<{[key: string]: any}> => {
    if (!user) return {};
    
    try {
      // Import getUserWalletAddresses from authService
      const { getUserWalletAddresses } = await import('../pages/auth/authService');
      const addresses = await getUserWalletAddresses(user.uid);
      return addresses || {};
    } catch (error) {
      console.error('Error getting user wallets:', error);
      return {};
    }
  }, [user]);

  // Function to refresh balances from Firebase
  const refreshBalances = useCallback(async () => {
    if (!user) return;
    
    try {
      console.log('Refreshing balances...');
      
      // Re-fetch user data
      const unsubscribe = subscribeToUserData(user.uid, (userData) => {
        if (userData && userData.wallets) {
          console.log('User wallets data received:', Object.keys(userData.wallets));
          
          const walletBalances: { [key: string]: number } = {};
          
          // Convert crypto balances from Firebase to USD value
          Object.entries(userData.wallets).forEach(([coinId, wallet]: [string, any]) => {
            const coin = coins.find(c => c.id === coinId);
            if (coin && wallet.balance !== undefined) {
              walletBalances[coinId] = wallet.balance * coin.current_price;
            } else {
              walletBalances[coinId] = 0;
            }
          });
          
          console.log('Updated wallet balances:', walletBalances);
          setBalances(walletBalances);
        }
      });
      
      // Cleanup subscription after a short delay
      setTimeout(() => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  }, [user, coins]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCryptoData();
      
      // Add USOR to the coins array if it doesn't already exist
      let allCoins = [...data];
      if (!allCoins.some(c => c.id === 'usor')) {
        allCoins.push(USOR_COIN);
      }
      
      setCoins(allCoins);
      console.log('Coins loaded:', allCoins.length, 'including USOR');

      const currentUser = auth.currentUser;
      if (currentUser) {
        // Subscribe to real-time user wallet data from Firebase
        const unsubscribe = subscribeToUserData(currentUser.uid, (userData) => {
          if (userData && userData.wallets) {
            const walletBalances: { [key: string]: number } = {};
            const userWalletIds = Object.keys(userData.wallets);
            
            console.log('User has wallets for:', userWalletIds);
            
            // Convert crypto balances from Firebase to USD value
            Object.entries(userData.wallets).forEach(([coinId, wallet]: [string, any]) => {
              const coin = allCoins.find(c => c.id === coinId);
              if (coin && wallet.balance !== undefined) {
                walletBalances[coinId] = wallet.balance * coin.current_price;
              } else {
                walletBalances[coinId] = 0;
              }
            });
            
            // Check for any coins in user's wallet that aren't in the coins list
            userWalletIds.forEach(coinId => {
              if (!allCoins.some(c => c.id === coinId)) {
                console.log('Found coin in user wallet not in coins list:', coinId);
                
                // Create a basic coin object for this wallet entry
                const newCoin: Coin = {
                  id: coinId,
                  symbol: coinId,
                  name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
                  image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
                  current_price: 1.00,
                  market_cap: 0,
                  market_cap_rank: null,
                  fully_diluted_valuation: null,
                  total_volume: 0,
                  high_24h: 1.00,
                  low_24h: 1.00,
                  price_change_24h: 0,
                  price_change_percentage_24h: 0,
                  market_cap_change_24h: 0,
                  market_cap_change_percentage_24h: 0,
                  circulating_supply: 0,
                  total_supply: 0,
                  max_supply: null,
                  ath: 1.00,
                  ath_change_percentage: 0,
                  ath_date: new Date().toISOString(),
                  atl: 1.00,
                  atl_change_percentage: 0,
                  atl_date: new Date().toISOString(),
                  last_updated: new Date().toISOString(),
                  sparkline_in_7d: { price: Array(168).fill(1.00) }
                };
                
                // Add this coin to the list
                allCoins.push(newCoin);
                walletBalances[coinId] = (userData.wallets[coinId]?.balance || 0) * newCoin.current_price;
              }
            });
            
            // Update coins list with any new coins found
            if (allCoins.length > coins.length) {
              setCoins(allCoins);
            }
            
            setBalances(walletBalances);
            console.log('Final balances set:', walletBalances);
          }
          setLoading(false);
        });
        
        return unsubscribe;
      } else {
        // No user logged in - set all balances to 0
        const zeroBalances: { [key: string]: number } = {};
        allCoins.forEach(coin => {
          zeroBalances[coin.id] = 0;
        });
        setBalances(zeroBalances);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      
      // Even if API fails, show at least USOR
      setCoins([USOR_COIN]);
      setBalances({ 'usor': 0 });
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get current user
    const currentUser = auth.currentUser;
    setUser(currentUser);

    const unsubscribePromise = fetchData();
    
    return () => {
      // Cleanup subscription if needed
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const addMinedValue = useCallback(async (coinId: string, valueToAdd: number) => {
    if (!user) {
      console.log('No user logged in, cannot add mined value');
      return;
    }
    
    try {
      const coin = coins.find(c => c.id === coinId);
      if (!coin) {
        console.log(`Coin ${coinId} not found`);
        return;
      }
      
      // Convert USD value to crypto amount
      const cryptoAmount = valueToAdd / coin.current_price;
      
      console.log(`Adding mined value: ${cryptoAmount.toFixed(8)} ${coin.symbol} ($${valueToAdd.toFixed(4)})`);
      
      // Update wallet balance in Firebase
      const walletResult = await updateWalletBalance(user.uid, coinId, cryptoAmount);
      if (!walletResult.success) {
        console.error('Failed to update wallet balance:', walletResult.error);
        return;
      }
      
      // Update total balance in Firebase
      const balanceResult = await updateUserBalance(user.uid, valueToAdd);
      if (!balanceResult.success) {
        console.error('Failed to update user balance:', balanceResult.error);
        return;
      }
      
      // Update local state for immediate UI update
      setBalances(prev => ({
        ...prev,
        [coinId]: (prev[coinId] || 0) + valueToAdd
      }));
      
      console.log('Successfully added mined value to balances');
      
    } catch (error) {
      console.error('Error adding mined value:', error);
    }
  }, [user, coins]);

  const deductSentValue = useCallback(async (coinId: string, valueToDeduct: number, recipientAddress?: string) => {
    if (!user) return;
    
    try {
      const coin = coins.find(c => c.id === coinId);
      if (!coin) return;
      
      // Convert USD value to crypto amount
      const cryptoAmount = valueToDeduct / coin.current_price;
      
      // Update wallet balance in Firebase
      const walletResult = await updateWalletBalance(user.uid, coinId, -cryptoAmount);
      
      // Update total balance in Firebase
      const balanceResult = await updateUserBalance(user.uid, -valueToDeduct);
      
      if (walletResult.success && balanceResult.success) {
        // Update local state for immediate UI update
        setBalances(prev => ({
          ...prev,
          [coinId]: Math.max(0, (prev[coinId] || 0) - valueToDeduct)
        }));
        
        // Add transaction to history
        await addTransaction(user.uid, {
          type: 'sent',
          coinId: coinId,
          coinName: coin.name,
          amount: cryptoAmount,
          amountUsd: valueToDeduct,
          currency: coin.symbol.toUpperCase(),
          description: recipientAddress 
            ? `Sent to ${recipientAddress.slice(0, 8)}...${recipientAddress.slice(-6)}`
            : `Sent ${coin.name}`,
          status: 'completed',
          recipientAddress: recipientAddress,
          fee: 0.001
        });
      }
      
    } catch (error) {
      console.error('Error deducting sent value:', error);
    }
  }, [user, coins]);

  const value = { 
    coins, 
    loading, 
    balances, 
    addMinedValue, 
    deductSentValue,
    refreshData,
    addCoinToContext, // NEW
    refreshBalances,  // NEW
    getUserWallets    // NEW
  };

  return (
    <CryptoDataContext.Provider value={value}>
      {children}
    </CryptoDataContext.Provider>
  );
};

export const useCryptoData = () => {
  const context = useContext(CryptoDataContext);
  if (context === undefined) {
    throw new Error('useCryptoData must be used within a CryptoDataProvider');
  }
  return context;
};