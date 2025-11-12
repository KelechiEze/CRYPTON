import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Coin } from '../types';
import { getCryptoData } from './coingeckoService';

interface CryptoDataContextType {
  coins: Coin[];
  loading: boolean;
  balances: { [key: string]: number }; // coin.id -> balance in USD
  addMinedValue: (coinId: string, valueToAdd: number) => void;
  deductSentValue: (coinId: string, valueToDeduct: number) => void;
}

const CryptoDataContext = createContext<CryptoDataContextType | undefined>(undefined);

export const CryptoDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [balances, setBalances] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getCryptoData();
      setCoins(data);

      // Initialize balances only once when coins are fetched
      setBalances(prevBalances => {
        const newBalances = { ...prevBalances };
        let updated = false;
        data.forEach(coin => {
          if (newBalances[coin.id] === undefined) {
            newBalances[coin.id] = 1000.00; // Start each with $1000
            updated = true;
          }
        });
        return updated ? newBalances : prevBalances;
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  const addMinedValue = useCallback((coinId: string, valueToAdd: number) => {
    setBalances(prevBalances => ({
      ...prevBalances,
      [coinId]: (prevBalances[coinId] || 0) + valueToAdd,
    }));
  }, []);

  const deductSentValue = useCallback((coinId: string, valueToDeduct: number) => {
    setBalances(prevBalances => ({
      ...prevBalances,
      [coinId]: (prevBalances[coinId] || 0) - valueToDeduct,
    }));
  }, []);

  const value = { coins, loading, balances, addMinedValue, deductSentValue };

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