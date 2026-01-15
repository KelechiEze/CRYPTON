import { Coin } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h';

export const getCryptoData = async (): Promise<Coin[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let data: Coin[] = await response.json();
    
    // Always include USOR in the data
    const usorCoin: Coin = {
      id: 'usor',
      symbol: 'usor',
      name: 'USOR',
      image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
      current_price: 1.00,
      price_change_percentage_24h: 0,
      total_volume: 0,
      market_cap: 0,
      market_cap_rank: null,
      fully_diluted_valuation: null,
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
    };
    
    // Add USOR if not already in the list
    if (!data.some(coin => coin.id === 'usor')) {
      data.push(usorCoin);
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch crypto data:", error);
    // Return mock data on failure including USOR
    return [
        { 
          id: 'bitcoin', 
          symbol: 'btc', 
          name: 'Bitcoin', 
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', 
          current_price: 68000, 
          price_change_percentage_24h: -1.5, 
          total_volume: 30000000000, 
          market_cap: 1300000000000,
          market_cap_rank: 1,
          fully_diluted_valuation: 1420000000000,
          high_24h: 69000,
          low_24h: 67000,
          price_change_24h: -1020,
          market_cap_change_24h: -19500000000,
          market_cap_change_percentage_24h: -1.48,
          circulating_supply: 19628125,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: 73738,
          ath_change_percentage: -7.78,
          ath_date: '2024-03-14T07:10:36.069Z',
          atl: 67.81,
          atl_change_percentage: 100200.23,
          atl_date: '2013-07-06T00:00:00.000Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(68000) }
        },
        { 
          id: 'ethereum', 
          symbol: 'eth', 
          name: 'Ethereum', 
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', 
          current_price: 3500, 
          price_change_percentage_24h: 2.1, 
          total_volume: 20000000000, 
          market_cap: 420000000000,
          market_cap_rank: 2,
          fully_diluted_valuation: 420000000000,
          high_24h: 3550,
          low_24h: 3450,
          price_change_24h: 73.5,
          market_cap_change_24h: 8820000000,
          market_cap_change_percentage_24h: 2.14,
          circulating_supply: 120000000,
          total_supply: 120000000,
          max_supply: null,
          ath: 4878,
          ath_change_percentage: -28.26,
          ath_date: '2021-11-10T14:24:19.604Z',
          atl: 0.432979,
          atl_change_percentage: 808100.23,
          atl_date: '2015-10-20T00:00:00.000Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(3500) }
        },
        { 
          id: 'solana', 
          symbol: 'sol', 
          name: 'Solana', 
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', 
          current_price: 150, 
          price_change_percentage_24h: 5.8, 
          total_volume: 2000000000, 
          market_cap: 70000000000,
          market_cap_rank: 5,
          fully_diluted_valuation: 85000000000,
          high_24h: 155,
          low_24h: 142,
          price_change_24h: 8.7,
          market_cap_change_24h: 4060000000,
          market_cap_change_percentage_24h: 5.8,
          circulating_supply: 466666666,
          total_supply: 511616946,
          max_supply: null,
          ath: 259.96,
          ath_change_percentage: -42.32,
          ath_date: '2021-11-06T21:54:35.825Z',
          atl: 0.500801,
          atl_change_percentage: 29860.03,
          atl_date: '2020-05-11T19:35:23.449Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(150) }
        },
        { 
          id: 'dogecoin', 
          symbol: 'doge', 
          name: 'Dogecoin', 
          image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', 
          current_price: 0.15, 
          price_change_percentage_24h: -0.5, 
          total_volume: 1000000000, 
          market_cap: 21000000000,
          market_cap_rank: 10,
          fully_diluted_valuation: 21000000000,
          high_24h: 0.152,
          low_24h: 0.148,
          price_change_24h: -0.00075,
          market_cap_change_24h: -105000000,
          market_cap_change_percentage_24h: -0.5,
          circulating_supply: 140000000000,
          total_supply: 140000000000,
          max_supply: null,
          ath: 0.731578,
          ath_change_percentage: -79.49,
          ath_date: '2021-05-08T05:08:23.458Z',
          atl: 0.0000869,
          atl_change_percentage: 172570.12,
          atl_date: '2015-05-06T00:00:00.000Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(0.15) }
        },
        { 
          id: 'cardano', 
          symbol: 'ada', 
          name: 'Cardano', 
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', 
          current_price: 0.45, 
          price_change_percentage_24h: 1.2, 
          total_volume: 500000000, 
          market_cap: 16000000000,
          market_cap_rank: 9,
          fully_diluted_valuation: 20200000000,
          high_24h: 0.46,
          low_24h: 0.44,
          price_change_24h: 0.0054,
          market_cap_change_24h: 192000000,
          market_cap_change_percentage_24h: 1.21,
          circulating_supply: 35500000000,
          total_supply: 45000000000,
          max_supply: 45000000000,
          ath: 3.09,
          ath_change_percentage: -85.43,
          ath_date: '2021-09-02T06:00:10.474Z',
          atl: 0.01925275,
          atl_change_percentage: 2236.79,
          atl_date: '2020-03-13T02:22:55.044Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(0.45) }
        },
        { 
          id: 'ripple', 
          symbol: 'xrp', 
          name: 'XRP', 
          image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', 
          current_price: 0.52, 
          price_change_percentage_24h: -2.0, 
          total_volume: 1200000000, 
          market_cap: 28000000000,
          market_cap_rank: 6,
          fully_diluted_valuation: 52000000000,
          high_24h: 0.53,
          low_24h: 0.51,
          price_change_24h: -0.0104,
          market_cap_change_24h: -560000000,
          market_cap_change_percentage_24h: -1.96,
          circulating_supply: 54000000000,
          total_supply: 99989142054,
          max_supply: 100000000000,
          ath: 3.40,
          ath_change_percentage: -84.71,
          ath_date: '2018-01-07T00:00:00.000Z',
          atl: 0.00268621,
          atl_change_percentage: 19257.18,
          atl_date: '2014-05-22T00:00:00.000Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(0.52) }
        },
        { 
          id: 'chainlink', 
          symbol: 'link', 
          name: 'Chainlink', 
          image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', 
          current_price: 14.50, 
          price_change_percentage_24h: 3.5, 
          total_volume: 400000000, 
          market_cap: 8500000000,
          market_cap_rank: 14,
          fully_diluted_valuation: 14500000000,
          high_24h: 14.80,
          low_24h: 14.00,
          price_change_24h: 0.5075,
          market_cap_change_24h: 297500000,
          market_cap_change_percentage_24h: 3.5,
          circulating_supply: 587099971,
          total_supply: 1000000000,
          max_supply: 1000000000,
          ath: 52.70,
          ath_change_percentage: -72.48,
          ath_date: '2021-05-10T00:13:57.214Z',
          atl: 0.148973,
          atl_change_percentage: 9634.12,
          atl_date: '2017-11-29T00:00:00.000Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(14.50) }
        },
        { 
          id: 'avalanche-2', 
          symbol: 'avax', 
          name: 'Avalanche', 
          image: 'https://assets.coingecko.com/coins/images/12559/large/avalanche-avax-logo.png', 
          current_price: 35.00, 
          price_change_percentage_24h: 7.1, 
          total_volume: 600000000, 
          market_cap: 13000000000,
          market_cap_rank: 12,
          fully_diluted_valuation: 25200000000,
          high_24h: 36.50,
          low_24h: 33.00,
          price_change_24h: 2.485,
          market_cap_change_24h: 923000000,
          market_cap_change_percentage_24h: 7.1,
          circulating_supply: 371347000,
          total_supply: 436000000,
          max_supply: 720000000,
          ath: 144.96,
          ath_change_percentage: -75.86,
          ath_date: '2021-11-21T14:18:56.538Z',
          atl: 2.80,
          atl_change_percentage: 1149.64,
          atl_date: '2020-12-31T13:15:21.540Z',
          last_updated: new Date().toISOString(),
          sparkline_in_7d: { price: Array(168).fill(35.00) }
        },
        { 
          id: 'usor', 
          symbol: 'usor', 
          name: 'USOR', 
          image: 'https://cryptologos.cc/logos/tether-usdt-logo.png', 
          current_price: 1.00, 
          price_change_percentage_24h: 0, 
          total_volume: 0, 
          market_cap: 0,
          market_cap_rank: null,
          fully_diluted_valuation: null,
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
        }
    ];
  }
};

// Helper function to search for crypto assets
export const searchCryptoAssets = async (query: string): Promise<Coin[]> => {
  try {
    // Fetch all coins (increase per_page for better search results)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    let data: Coin[] = await response.json();
    
    // Filter based on query (case-insensitive)
    const filtered = data.filter(asset =>
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(query.toLowerCase())
    );
    
    // Always include USOR if query matches
    if (query.toLowerCase().includes('usor')) {
      const usorCoin: Coin = {
        id: 'usor',
        symbol: 'usor',
        name: 'USOR',
        image: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
        current_price: 1.00,
        price_change_percentage_24h: 0,
        total_volume: 0,
        market_cap: 0,
        market_cap_rank: null,
        fully_diluted_valuation: null,
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
      };
      
      if (!filtered.some(coin => coin.id === 'usor')) {
        filtered.push(usorCoin);
      }
    }
    
    return filtered;
  } catch (error) {
    console.error("Failed to search crypto data:", error);
    
    // Return a filtered subset of the mock data
    const mockData = await getCryptoData();
    return mockData.filter(asset =>
      asset.name.toLowerCase().includes(query.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(query.toLowerCase())
    );
  }
};