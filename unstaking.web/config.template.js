// Configuration Template
// Copy this file and rename to config.js
// Update with your actual contract details

const CONFIG = {
    // ===========================================
    // SMART CONTRACT ADDRESSES
    // ===========================================
    
    // Your staking contract address (REQUIRED)
    // Get this from your contract deployment
    STAKING_CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000',
    
    // Your ERC20 token contract address (REQUIRED)
    // This is the token that users stake/unstake
    TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000',
    
    
    // ===========================================
    // NETWORK CONFIGURATION
    // ===========================================
    
    // Chain ID for your network (REQUIRED)
    // Common values:
    //   1 = Ethereum Mainnet
    //   5 = Goerli Testnet
    //   11155111 = Sepolia Testnet
    //   137 = Polygon Mainnet
    //   80001 = Polygon Mumbai Testnet
    //   56 = Binance Smart Chain
    //   97 = BSC Testnet
    //   42161 = Arbitrum One
    //   421613 = Arbitrum Goerli
    //   10 = Optimism
    //   420 = Optimism Goerli
    CHAIN_ID: 1,
    
    // RPC URL for fallback connection (OPTIONAL)
    // Get free API keys from:
    //   - Alchemy: https://www.alchemy.com
    //   - Infura: https://infura.io
    //   - QuickNode: https://www.quicknode.com
    RPC_URL: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY',
    
    // Block explorer URL for transaction links
    // Common values:
    //   Ethereum: 'https://etherscan.io'
    //   Goerli: 'https://goerli.etherscan.io'
    //   Sepolia: 'https://sepolia.etherscan.io'
    //   Polygon: 'https://polygonscan.com'
    //   BSC: 'https://bscscan.com'
    //   Arbitrum: 'https://arbiscan.io'
    //   Optimism: 'https://optimistic.etherscan.io'
    EXPLORER_URL: 'https://etherscan.io',
    
    
    // ===========================================
    // STAKING PARAMETERS
    // ===========================================
    
    // Unstaking fee as percentage (e.g., 0.5 = 0.5%)
    UNSTAKING_FEE_PERCENT: 0.5,
    
    // Number of days tokens are locked after unstaking
    UNSTAKING_PERIOD_DAYS: 7,
    
    
    // ===========================================
    // TOKEN PRICE API (OPTIONAL)
    // ===========================================
    
    // CoinGecko API token ID (for USD price display)
    // Find your token ID at: https://www.coingecko.com
    // Example: 'ethereum', 'bitcoin', 'matic-network'
    COINGECKO_TOKEN_ID: 'ethereum',
    
    // Alternative: CoinMarketCap API
    // Get free API key at: https://coinmarketcap.com/api/
    CMC_API_KEY: '',
    CMC_TOKEN_ID: '',
    
    
    // ===========================================
    // UI CUSTOMIZATION
    // ===========================================
    
    // Project name displayed in header
    PROJECT_NAME: 'Unstaking Portal',
    
    // Enable/disable features
    SHOW_REWARDS: true,
    SHOW_USD_VALUE: true,
    AUTO_REFRESH_INTERVAL: 30000, // milliseconds (30 seconds)
    
    
    // ===========================================
    // ADVANCED SETTINGS
    // ===========================================
    
    // Gas limit multiplier for safety (1.2 = 20% buffer)
    GAS_LIMIT_MULTIPLIER: 1.2,
    
    // Default gas price multiplier (1.0 = normal, 1.5 = fast)
    GAS_PRICE_MULTIPLIER: 1.0,
    
    // Maximum slippage tolerance for fees (as decimal)
    MAX_SLIPPAGE: 0.01, // 1%
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
