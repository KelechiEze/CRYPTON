// src/services/assetSearchService.ts
import { Coin } from '../../types';

// Mock API search function - replace with your actual API
export const searchCryptoAssets = async (query: string): Promise<Coin[]> => {
    try {
        // For demo purposes, return a static list based on query
        // In production, replace with actual API call
        const allAssets: Coin[] = [
            {
                id: 'bitcoin',
                name: 'Bitcoin',
                symbol: 'btc',
                image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                current_price: 50000,
                price_change_percentage_24h: 2.5,
                market_cap: 1000000000000,
                market_cap_rank: 1,
                fully_diluted_valuation: null,
                total_volume: 30000000000,
                high_24h: 51000,
                low_24h: 49000,
                price_change_24h: 1250,
                market_cap_change_24h: 25000000000,
                market_cap_change_percentage_24h: 2.5,
                circulating_supply: 19000000,
                total_supply: 21000000,
                max_supply: 21000000,
                ath: 69000,
                ath_change_percentage: -27.5,
                ath_date: new Date('2021-11-10').toISOString(),
                atl: 67.81,
                atl_change_percentage: 73600,
                atl_date: new Date('2013-07-06').toISOString(),
                last_updated: new Date().toISOString(),
                sparkline_in_7d: { price: Array(168).fill(50000) }
            },
            {
                id: 'ethereum',
                name: 'Ethereum',
                symbol: 'eth',
                image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                current_price: 3500,
                price_change_percentage_24h: 1.8,
                market_cap: 420000000000,
                market_cap_rank: 2,
                fully_diluted_valuation: null,
                total_volume: 15000000000,
                high_24h: 3600,
                low_24h: 3400,
                price_change_24h: 63,
                market_cap_change_24h: 7560000000,
                market_cap_change_percentage_24h: 1.8,
                circulating_supply: 120000000,
                total_supply: null,
                max_supply: null,
                ath: 4800,
                ath_change_percentage: -27.1,
                ath_date: new Date('2021-11-10').toISOString(),
                atl: 0.432979,
                atl_change_percentage: 808000,
                atl_date: new Date('2015-10-20').toISOString(),
                last_updated: new Date().toISOString(),
                sparkline_in_7d: { price: Array(168).fill(3500) }
            },
            {
                id: 'usor',
                name: 'USOR',
                symbol: 'usor',
                image: 'https://cryptologos.cc/logos/tether-usdt-logo.png', // Placeholder
                current_price: 1.00,
                price_change_percentage_24h: 0,
                market_cap: 0,
                market_cap_rank: null,
                fully_diluted_valuation: null,
                total_volume: 0,
                high_24h: 1.00,
                low_24h: 1.00,
                price_change_24h: 0,
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
            },
            // Add more assets as needed
            {
                id: 'solana',
                name: 'Solana',
                symbol: 'sol',
                image: 'https://cryptologos.cc/logos/solana-sol-logo.png',
                current_price: 180,
                price_change_percentage_24h: 5.2,
                market_cap: 75000000000,
                market_cap_rank: 5,
                fully_diluted_valuation: null,
                total_volume: 3000000000,
                high_24h: 185,
                low_24h: 175,
                price_change_24h: 9,
                market_cap_change_24h: 3900000000,
                market_cap_change_percentage_24h: 5.2,
                circulating_supply: 416000000,
                total_supply: 511000000,
                max_supply: null,
                ath: 260,
                ath_change_percentage: -30.8,
                ath_date: new Date('2021-11-06').toISOString(),
                atl: 0.500801,
                atl_change_percentage: 35800,
                atl_date: new Date('2020-05-11').toISOString(),
                last_updated: new Date().toISOString(),
                sparkline_in_7d: { price: Array(168).fill(180) }
            }
        ];

        // Filter based on query
        const filtered = allAssets.filter(asset =>
            asset.name.toLowerCase().includes(query.toLowerCase()) ||
            asset.symbol.toLowerCase().includes(query.toLowerCase())
        );

        return filtered;
    } catch (error) {
        console.error('Error searching crypto assets:', error);
        return [];
    }
};

// Add asset to user's wallets in Firebase
export const addAssetToUserWallets = async (userId: string, coin: Coin) => {
    try {
        // Import Firebase functions
        const { doc, updateDoc, arrayUnion } = await import('firebase/firestore');
        const { db } = await import('../../firebase');
        
        const userRef = doc(db, 'users', userId);
        
        // Update the user's wallets with the new asset
        await updateDoc(userRef, {
            [`wallets.${coin.id}`]: {
                balance: 0,
                address: '',
                updatedAt: new Date()
            },
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error adding asset to wallet:', error);
        throw error;
    }
};