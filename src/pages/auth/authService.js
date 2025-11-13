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

// Sign Up Function - OPTIMIZED FOR NEW DASHBOARD
export const signUp = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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
      
      // Wallets with zero balances
      wallets: {
        bitcoin: { 
          balance: 0, 
          address: '' 
        },
        ethereum: { 
          balance: 0, 
          address: '' 
        },
        solana: {
          balance: 0,
          address: ''
        },
        usdc: {
          balance: 0,
          address: ''
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

// Claim Bonus Function (for $50 claim) - UPDATED WITH PROTECTION
export const claimBonus = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // First check if bonus was already claimed
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    if (userData.hasClaimedWelcomeBonus) {
      return { success: false, error: 'Bonus already claimed' };
    }
    
    // Add $50 to total balance
    // Add equivalent BTC (assuming $50,000 BTC price = 0.001 BTC)
    const btcAmount = 50 / 50000;
    
    await updateDoc(userRef, {
      balance: increment(50),
      'wallets.bitcoin.balance': increment(btcAmount),
      hasClaimedWelcomeBonus: true,
      updatedAt: new Date()
    });
    
    // Add transaction record
    await addTransaction(userId, {
      type: 'bonus',
      amount: 50,
      currency: 'USD',
      description: 'Welcome Bonus Claimed',
      status: 'completed'
    });
    
    return { success: true };
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