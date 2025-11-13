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
}

const CryptoDataContext = createContext<CryptoDataContextType | undefined>(undefined);

export const CryptoDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const [user, setUser] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCryptoData();
      setCoins(data);

      const currentUser = auth.currentUser;
      if (currentUser) {
        // Subscribe to real-time user wallet data from Firebase
        const unsubscribe = subscribeToUserData(currentUser.uid, (userData) => {
          if (userData && userData.wallets) {
            const walletBalances: { [key: string]: number } = {};
            
            // Convert crypto balances from Firebase to USD value
            Object.entries(userData.wallets).forEach(([coinId, wallet]: [string, any]) => {
              const coin = data.find(c => c.id === coinId);
              if (coin && wallet.balance !== undefined) {
                walletBalances[coinId] = wallet.balance * coin.current_price;
              } else {
                walletBalances[coinId] = 0;
              }
            });
            
            setBalances(walletBalances);
          }
          setLoading(false);
        });
        
        return unsubscribe;
      } else {
        // No user logged in - set all balances to 0
        const zeroBalances: { [key: string]: number } = {};
        data.forEach(coin => {
          zeroBalances[coin.id] = 0;
        });
        setBalances(zeroBalances);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
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
    refreshData 
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