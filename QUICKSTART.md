# 🚀 Quick Start Guide

Get your unstaking portal running in 5 minutes!

## Step 1: Install MetaMask (2 minutes)

1. Go to [metamask.io](https://metamask.io)
2. Click "Download" for your browser
3. Install the extension
4. Create or import wallet
5. **Save your seed phrase securely!**

## Step 2: Configure Your Contract (2 minutes)

Open `script.js` and find the `CONFIG` object at the top:

```javascript
const CONFIG = {
    STAKING_CONTRACT_ADDRESS: 'YOUR_CONTRACT_HERE',  // ← Update this
    TOKEN_ADDRESS: 'YOUR_TOKEN_HERE',                // ← Update this
    CHAIN_ID: 1,                                     // ← Change if not Ethereum Mainnet
    // ... rest of config
};
```

### Where to Find These Addresses?

**Contract Addresses:**
- Check your deployment transaction
- Ask your contract developer
- Look at the project documentation

**Chain IDs:**
- Ethereum Mainnet: `1`
- Goerli Testnet: `5`
- Polygon: `137`
- BSC: `56`

## Step 3: Update Contract ABI (1 minute)

Find your contract ABI:

### Option A: From Etherscan
1. Go to Etherscan.io
2. Search your contract address
3. Click "Contract" tab
4. Copy the ABI
5. Replace `STAKING_ABI` in `script.js`

### Option B: From Your Files
1. Find `artifacts/contracts/YourContract.sol/YourContract.json`
2. Copy the `abi` array
3. Replace `STAKING_ABI` in `script.js`

## Step 4: Test It! (30 seconds)

### Run Locally:

**Windows:**
```powershell
# Navigate to folder
cd c:\Users\pc\OneDrive\Desktop\unstaking.web

# Open in browser
Start-Process index.html
```

**Mac/Linux:**
```bash
# Navigate to folder
cd ~/Desktop/unstaking.web

# Open in browser
open index.html
# or
xdg-open index.html
```

### Or Use Local Server:
```bash
# Python (simplest)
python -m http.server 8000

# Then open: http://localhost:8000
```

## Step 5: Connect & Test

1. **Click "Connect Wallet"** in the page
2. **Approve connection** in MetaMask popup
3. **Check your balances** appear
4. **Try unstaking** a small test amount

## ✅ Success Checklist

- [ ] MetaMask installed and wallet created
- [ ] Contract addresses updated in `CONFIG`
- [ ] Correct chain ID set
- [ ] Contract ABI updated
- [ ] Page opens in browser
- [ ] Wallet connects successfully
- [ ] Balances load correctly
- [ ] Can submit test transaction

## 🐛 Quick Troubleshooting

### "Please install MetaMask"
→ Install MetaMask extension and refresh page

### "Wrong network" 
→ Click MetaMask → Select correct network → Refresh

### "Failed to connect wallet"
→ Check console (F12) for errors → Verify contract address

### Balances show 0.0000
→ Make sure you have staked tokens in the contract

### Transaction fails
→ Ensure you have ETH for gas fees

## 📚 Next Steps

### Customize Appearance
Edit `styles.css` to match your brand:
```css
:root {
    --primary-color: #your-color;
    --success-color: #your-color;
}
```

### Add Token Price
Update `fetchTokenPrice()` in `script.js`:
```javascript
async function fetchTokenPrice() {
    const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=YOUR-TOKEN&vs_currencies=usd'
    );
    const data = await response.json();
    state.tokenPrice = data['YOUR-TOKEN'].usd;
}
```

### Deploy Online
Upload files to:
- GitHub Pages (free)
- Netlify (free)
- Vercel (free)
- Your own hosting

## 🔐 Security Reminders

- ✅ **Test on testnet first** (Goerli, Sepolia)
- ✅ **Verify contract addresses** independently
- ✅ **Start with small amounts**
- ✅ **Never share private keys**
- ✅ **Always review transactions** before confirming

## 💡 Pro Tips

1. **Test Mode**: Change `CHAIN_ID` to `5` (Goerli) for free testing
2. **Gas Savings**: Unstake during low-traffic hours (weekends/nights)
3. **Price Tracking**: Integrate CoinGecko API for live prices
4. **Multiple Tokens**: Clone and modify for different tokens
5. **Mobile**: Works perfectly on mobile browsers with MetaMask app

## 🎯 Common Use Cases

### Testing on Goerli:
```javascript
const CONFIG = {
    CHAIN_ID: 5,
    EXPLORER_URL: 'https://goerli.etherscan.io',
    // ... rest
};
```

### Using Polygon:
```javascript
const CONFIG = {
    CHAIN_ID: 137,
    EXPLORER_URL: 'https://polygonscan.com',
    RPC_URL: 'https://polygon-rpc.com',
    // ... rest
};
```

### Different Lock Period:
```javascript
const CONFIG = {
    UNSTAKING_PERIOD_DAYS: 14, // 14 days instead of 7
    // ... rest
};
```

## 📞 Need Help?

1. **Check README.md** for detailed documentation
2. **Review console logs** (Press F12)
3. **Verify all addresses** are correct
4. **Test with small amounts** first
5. **Join your project's Discord/Telegram** for support

## 🎉 You're Ready!

Your unstaking portal is now fully operational! 

Start by testing with small amounts, then scale up once everything works smoothly.

Happy unstaking! 🚀

---

**Remember**: Always Do Your Own Research (DYOR) and never invest more than you can afford to lose.
