import { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

export const getCryptoData = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: Coin[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch crypto data:", error);
    // Return mock data on failure to prevent app crash
    return [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 68000, price_change_percentage_24h: -1.5, total_volume: 30000000000, market_cap: 1300000000000 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3500, price_change_percentage_24h: 2.1, total_volume: 20000000000, market_cap: 420000000000 },
        { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 150, price_change_percentage_24h: 5.8, total_volume: 2000000000, market_cap: 70000000000 },
        { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.15, price_change_percentage_24h: -0.5, total_volume: 1000000000, market_cap: 21000000000 },
        { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.45, price_change_percentage_24h: 1.2, total_volume: 500000000, market_cap: 16000000000 },
        { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.52, price_change_percentage_24h: -2.0, total_volume: 1200000000, market_cap: 28000000000 },
        { id: 'chainlink', symbol: 'link', name: 'Chainlink', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', current_price: 14.50, price_change_percentage_24h: 3.5, total_volume: 400000000, market_cap: 8500000000 },
        { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', image: 'https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png', current_price: 35.00, price_change_percentage_24h: 7.1, total_volume: 600000000, market_cap: 13000000000 },
    ];
  }
};