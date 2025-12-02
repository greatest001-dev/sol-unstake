# Unstaking Withdrawal Portal

A professional, fully-functional Web3 application for unstaking and withdrawing tokens from smart contracts with real blockchain integration.

## 🚀 Features

- ✅ **MetaMask Integration** - Connect with MetaMask or any Web3 wallet
- 🔗 **Real Blockchain Connectivity** - Interact with smart contracts on Ethereum
- 💰 **Live Balance Display** - Real-time staked, rewards, and available balances
- 📊 **Gas Fee Estimation** - Accurate gas cost calculations
- 🔐 **Secure Transactions** - All transactions require wallet confirmation
- ⏱️ **Withdrawal Lock Period** - 7-day unstaking period tracking
- 📋 **Transaction History** - View all pending withdrawals
- 🎯 **Claim Functionality** - Withdraw unlocked tokens to your wallet
- 📱 **Responsive Design** - Works perfectly on all devices
- 🌙 **Modern UI** - Professional dark theme with smooth animations

## 📋 Prerequisites

- Web browser with MetaMask extension installed
- MetaMask or compatible Web3 wallet
- ETH for gas fees
- Staked tokens in the contract

## 🛠️ Setup Instructions

### 1. Install MetaMask

If you don't have MetaMask installed:
1. Visit [metamask.io](https://metamask.io)
2. Download and install the browser extension
3. Create a new wallet or import existing one
4. Save your seed phrase securely

### 2. Configure Smart Contract

Open `script.js` and update the `CONFIG` object with your contract details:

```javascript
const CONFIG = {
    // Your staking contract address
    STAKING_CONTRACT_ADDRESS: '0xYourStakingContractAddress',
    
    // Your token contract address
    TOKEN_ADDRESS: '0xYourTokenAddress',
    
    // Network Chain ID
    // 1 = Ethereum Mainnet
    // 5 = Goerli Testnet
    // 11155111 = Sepolia Testnet
    // 137 = Polygon Mainnet
    // 80001 = Polygon Mumbai
    CHAIN_ID: 1,
    
    // RPC URL (get free key from Alchemy or Infura)
    RPC_URL: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY',
    
    // Block explorer URL
    EXPLORER_URL: 'https://etherscan.io',
    
    // Unstaking fee percentage
    UNSTAKING_FEE_PERCENT: 0.5,
    
    // Unstaking lock period in days
    UNSTAKING_PERIOD_DAYS: 7
};
```

### 3. Update Smart Contract ABI

Replace the simplified ABIs in `script.js` with your actual contract ABIs:

```javascript
const STAKING_ABI = [
    // Add your full staking contract ABI here
    // Get it from your contract deployment or Etherscan
];

const ERC20_ABI = [
    // Add your token contract ABI here
];
```

**Required Staking Contract Functions:**
- `unstake(uint256 amount)` - Initiate unstaking
- `withdraw(uint256 withdrawalId)` - Claim unlocked tokens
- `getStakedBalance(address account)` - Get user's staked amount
- `getPendingRewards(address account)` - Get accumulated rewards
- `getWithdrawals(address account)` - Get pending withdrawals array

### 4. Get RPC Provider (Optional but Recommended)

For better reliability, use a dedicated RPC provider:

**Alchemy:**
1. Go to [alchemy.com](https://www.alchemy.com)
2. Create free account
3. Create new app
4. Copy API key and update `RPC_URL`

**Infura:**
1. Go to [infura.io](https://infura.io)
2. Create free account
3. Create new project
4. Copy endpoint URL and update `RPC_URL`

### 5. Configure Token Price API (Optional)

To show real-time USD values, update the `fetchTokenPrice()` function:

```javascript
async function fetchTokenPrice() {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=your-token-id&vs_currencies=usd'
        );
        const data = await response.json();
        state.tokenPrice = data['your-token-id'].usd;
    } catch (error) {
        console.error('Error fetching token price:', error);
    }
}
```

## 🚀 Running the Application

### Method 1: Direct File Open
1. Navigate to the project folder
2. Double-click `index.html`
3. Your default browser will open the page

### Method 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## 📖 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve connection in MetaMask
- Ensure you're on the correct network

### 2. Unstake Tokens
- Enter amount or click "MAX" for maximum
- Review fees and gas estimation
- Click "Unstake Tokens"
- Confirm transaction in MetaMask
- Wait for confirmation

### 3. Claim Withdrawals
- Wait for 7-day lock period to complete
- View pending withdrawals section
- Click "Claim" when ready
- Confirm transaction in MetaMask
- Tokens will be sent to your wallet

## 🔧 Customization

### Change Theme Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* Add more custom colors */
}
```

### Modify Unstaking Period
Update in `script.js`:
```javascript
const CONFIG = {
    UNSTAKING_PERIOD_DAYS: 14, // Change to your desired days
};
```

### Change Network
Update `CHAIN_ID` in CONFIG:
```javascript
CHAIN_ID: 137, // Switch to Polygon
```

## 🔐 Security Notes

- Never share your private keys or seed phrase
- Always verify contract addresses before transactions
- Test on testnet first before using mainnet
- Review all transaction details in MetaMask before confirming
- Keep your MetaMask extension updated
- Be cautious of phishing attempts

## 🐛 Troubleshooting

### "Please install MetaMask" Error
- Install MetaMask extension from [metamask.io](https://metamask.io)
- Refresh the page after installation

### Wrong Network Error
- Open MetaMask
- Click network dropdown
- Select correct network (or add custom network)

### Transaction Failed
- Ensure sufficient ETH for gas fees
- Check if you have enough tokens to unstake
- Verify contract addresses are correct
- Try increasing gas price in MetaMask

### Balances Not Loading
- Check console for errors (F12)
- Verify contract addresses and ABIs
- Ensure wallet is connected
- Check RPC provider is working

### Contract Function Not Found
- Verify you're using the correct ABI
- Check function names match your contract
- Ensure contract is deployed to selected network

## 📝 Contract Requirements

Your staking contract should implement these functions:

```solidity
// Unstake tokens with lock period
function unstake(uint256 amount) external;

// Withdraw unlocked tokens
function withdraw(uint256 withdrawalId) external;

// Get user's staked balance
function getStakedBalance(address account) external view returns (uint256);

// Get pending rewards
function getPendingRewards(address account) external view returns (uint256);

// Get user's withdrawals
function getWithdrawals(address account) external view returns (
    Withdrawal[] memory
);

struct Withdrawal {
    uint256 amount;
    uint256 timestamp;
    uint256 unlockTime;
    bool claimed;
}
```

## 🌐 Supported Networks

- Ethereum Mainnet (Chain ID: 1)
- Goerli Testnet (Chain ID: 5)
- Sepolia Testnet (Chain ID: 11155111)
- Polygon Mainnet (Chain ID: 137)
- Polygon Mumbai (Chain ID: 80001)
- Binance Smart Chain (Chain ID: 56)
- Arbitrum One (Chain ID: 42161)
- Optimism (Chain ID: 10)

## 📦 File Structure

```
unstaking.web/
├── index.html          # Main HTML structure
├── styles.css          # Styling and theme
├── script.js           # Web3 logic and functionality
├── README.md           # This file
├── css                 # Old CSS file (can be deleted)
├── httml               # Old HTML file (can be deleted)
└── jss                 # Old JS file (can be deleted)
```

## 🔄 Updates and Maintenance

To update balances in real-time:
- Balances auto-refresh every 30 seconds when wallet is connected
- Manual refresh: disconnect and reconnect wallet
- Check console (F12) for any errors

## 📞 Support

For issues or questions:
1. Check console for error messages (F12)
2. Verify all configuration settings
3. Test on testnet first
4. Review transaction details in block explorer

## 📜 License

This project is open source and available for personal and commercial use.

## ⚠️ Disclaimer

This is a frontend interface for interacting with smart contracts. Always:
- Verify contract addresses independently
- Test with small amounts first
- Understand the risks of DeFi
- Never invest more than you can afford to lose
- Do your own research (DYOR)

---

Built with ❤️ for the Web3 community
