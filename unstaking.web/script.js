// Smart Contract Configuration
const CONFIG = {
    // Replace with your actual contract addresses
    STAKING_CONTRACT_ADDRESS: '0x0000000000000000000000000000000000000000',
    TOKEN_ADDRESS: '0x0000000000000000000000000000000000000000',
    CHAIN_ID: 1, // Ethereum Mainnet (change to 5 for Goerli, 11155111 for Sepolia)
    RPC_URL: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY',
    EXPLORER_URL: 'https://etherscan.io',
    UNSTAKING_FEE_PERCENT: 4,
    UNSTAKING_PERIOD_DAYS: 2
};

// Smart Contract ABIs (simplified - add your full ABI)
const STAKING_ABI = [
    "function stake(uint256 amount) external",
    "function unstake(uint256 amount) external",
    "function withdraw(uint256 withdrawalId) external",
    "function getStakedBalance(address account) external view returns (uint256)",
    "function getPendingRewards(address account) external view returns (uint256)",
    "function getWithdrawals(address account) external view returns (tuple(uint256 amount, uint256 timestamp, uint256 unlockTime, bool claimed)[])",
    "event Unstaked(address indexed user, uint256 amount, uint256 unlockTime)",
    "event Withdrawn(address indexed user, uint256 amount)"
];

const ERC20_ABI = [
    "function balanceOf(address account) external view returns (uint256)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)"
];

// Application state
let state = {
    walletConnected: false,
    walletAddress: null,
    provider: null,
    signer: null,
    stakingContract: null,
    tokenContract: null,
    stakedBalance: 20,
    rewardsBalance: 35,
    availableBalance: 55,
    tokenPrice: 128.647, // USD per token (fetch from API in production)
    tokenSymbol: 'SOL',
    tokenDecimals: 18,
    chainId: null,
    pendingWithdrawals: [],
    isLoading: false
};

// DOM Elements
const connectWalletBtn = document.getElementById('connectWalletBtn');
const walletDetails = document.getElementById('walletDetails');
const walletAddress = document.getElementById('walletAddress');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const stakedBalance = document.getElementById('stakedBalance');
const rewardsBalance = document.getElementById('rewardsBalance');
const availableBalance = document.getElementById('availableBalance');
const unstakeAmount = document.getElementById('unstakeAmount');
const maxBtn = document.getElementById('maxBtn');
const unstakeBtn = document.getElementById('unstakeBtn');
const amountInUSD = document.getElementById('amountInUSD');
const availableDisplay = document.getElementById('availableDisplay');
const receiveAmount = document.getElementById('receiveAmount');
const unstakingFee = document.getElementById('unstakingFee');
const gasFee = document.getElementById('gasFee');
const transactionFeedback = document.getElementById('transactionFeedback');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackMessage = document.getElementById('feedbackMessage');
const closeFeedback = document.getElementById('closeFeedback');
const txHash = document.getElementById('txHash');
const txHashLink = document.getElementById('txHashLink');
const withdrawalsList = document.getElementById('withdrawalsList');
const copyDepositBtn = document.getElementById('copyDepositBtn');
const depositAddress = document.getElementById('depositAddress');

// Initialize the page
function init() {
    updateBalanceDisplay();
    setupEventListeners();
    // Set initial amount and calculate
    unstakeAmount.value = '55';
    handleAmountChange();
    // Hide wallet details by default
    walletDetails.classList.add('hidden');
}

// Check if wallet is already connected
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await connectWallet();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    }
}

// Setup network change listener
function setupNetworkListener() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
        
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                handleDisconnect();
            } else {
                window.location.reload();
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    connectWalletBtn.addEventListener('click', scrollToWithdraw);
    copyAddressBtn.addEventListener('click', handleCopyAddress);
    maxBtn.addEventListener('click', handleMaxAmount);
    unstakeAmount.addEventListener('input', handleAmountChange);
    unstakeBtn.addEventListener('click', handleUnstake);
    closeFeedback.addEventListener('click', hideFeedback);
    copyDepositBtn.addEventListener('click', handleCopyDepositAddress);
}

// Scroll to withdraw section
function scrollToWithdraw() {
    const withdrawSection = document.getElementById('withdrawSection');
    withdrawSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Wallet connection handler
async function handleWalletConnection() {
    if (state.walletConnected) {
        handleDisconnect();
        return;
    }

    await connectWallet();
}

// Connect to wallet
async function connectWallet() {
    try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            showFeedback('error', '❌', 'Please install MetaMask or another Web3 wallet');
            return;
        }

        showFeedback('pending', '⏳', 'Connecting to wallet...');

        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        if (accounts.length === 0) {
            showFeedback('error', '❌', 'No accounts found');
            return;
        }

        // Setup provider and signer
        state.provider = new ethers.providers.Web3Provider(window.ethereum);
        state.signer = state.provider.getSigner();
        state.walletAddress = accounts[0];

        // Get network
        const network = await state.provider.getNetwork();
        state.chainId = network.chainId;

        // Check if on correct network
        if (state.chainId !== CONFIG.CHAIN_ID) {
            await switchNetwork();
            return;
        }

        // Initialize contracts
        state.stakingContract = new ethers.Contract(
            CONFIG.STAKING_CONTRACT_ADDRESS,
            STAKING_ABI,
            state.signer
        );

        state.tokenContract = new ethers.Contract(
            CONFIG.TOKEN_ADDRESS,
            ERC20_ABI,
            state.signer
        );

        // Get token info
        try {
            state.tokenSymbol = await state.tokenContract.symbol();
            state.tokenDecimals = await state.tokenContract.decimals();
        } catch (error) {
            console.error('Error fetching token info:', error);
        }

        state.walletConnected = true;

        // Update UI
        walletAddress.textContent = formatAddress(state.walletAddress);
        connectWalletBtn.innerHTML = '<span class="btn-icon">✅</span> Connected';
        connectWalletBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        walletDetails.classList.remove('hidden');

        // Load balances
        await loadBalances();
        await loadPendingWithdrawals();

        showFeedback('success', '✅', 'Wallet connected successfully!');

    } catch (error) {
        console.error('Wallet connection error:', error);
        if (error.code === 4001) {
            showFeedback('error', '❌', 'Connection rejected by user');
        } else {
            showFeedback('error', '❌', 'Failed to connect wallet: ' + error.message);
        }
    }
}

// Disconnect wallet
function handleDisconnect() {
    state.walletConnected = false;
    state.walletAddress = null;
    state.provider = null;
    state.signer = null;
    state.stakingContract = null;
    state.tokenContract = null;
    state.stakedBalance = 0;
    state.rewardsBalance = 0;
    state.availableBalance = 0;
    state.pendingWithdrawals = [];

    connectWalletBtn.innerHTML = '<span class="btn-icon">🔌</span> Connect Wallet';
    connectWalletBtn.style.background = '';
    walletDetails.classList.add('hidden');
    unstakeBtn.disabled = true;

    updateBalanceDisplay();
    updatePendingWithdrawals();
}

// Switch to correct network
async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(CONFIG.CHAIN_ID) }],
        });
        
        // Reconnect after network switch
        setTimeout(() => connectWallet(), 1000);
    } catch (error) {
        if (error.code === 4902) {
            showFeedback('error', '❌', 'Please add the network to your wallet');
        } else {
            showFeedback('error', '❌', 'Failed to switch network');
        }
    }
}

// Load balances from blockchain
async function loadBalances() {
    if (!state.walletConnected || !state.stakingContract) return;

    try {
        state.isLoading = true;

        // Get staked balance
        const stakedBal = await state.stakingContract.getStakedBalance(state.walletAddress);
        state.stakedBalance = parseFloat(ethers.utils.formatUnits(stakedBal, state.tokenDecimals));

        // Get rewards
        const rewards = await state.stakingContract.getPendingRewards(state.walletAddress);
        state.rewardsBalance = parseFloat(ethers.utils.formatUnits(rewards, state.tokenDecimals));

        // Available balance is same as staked balance (can unstake all)
        state.availableBalance = state.stakedBalance;

        updateBalanceDisplay();

    } catch (error) {
        console.error('Error loading balances:', error);
        showFeedback('error', '❌', 'Failed to load balances');
    } finally {
        state.isLoading = false;
    }
}

// Load pending withdrawals from blockchain
async function loadPendingWithdrawals() {
    if (!state.walletConnected || !state.stakingContract) return;

    try {
        const withdrawals = await state.stakingContract.getWithdrawals(state.walletAddress);
        
        state.pendingWithdrawals = withdrawals
            .filter(w => !w.claimed)
            .map((w, index) => ({
                id: index,
                amount: parseFloat(ethers.utils.formatUnits(w.amount, state.tokenDecimals)),
                date: new Date(w.timestamp.toNumber() * 1000),
                unlockDate: new Date(w.unlockTime.toNumber() * 1000),
                status: Date.now() >= w.unlockTime.toNumber() * 1000 ? 'ready' : 'pending',
                claimed: w.claimed
            }));

        updatePendingWithdrawals();

    } catch (error) {
        console.error('Error loading withdrawals:', error);
        state.pendingWithdrawals = [];
        updatePendingWithdrawals();
    }
}

// Copy address to clipboard
function handleCopyAddress() {
    if (state.walletAddress) {
        navigator.clipboard.writeText(state.walletAddress).then(() => {
            showFeedback('success', '📋', 'Address copied to clipboard!');
        }).catch(() => {
            showFeedback('error', '❌', 'Failed to copy address');
        });
    }
}

// Copy deposit address to clipboard
function handleCopyDepositAddress() {
    const depositAddr = depositAddress.textContent;
    navigator.clipboard.writeText(depositAddr).then(() => {
        showFeedback('success', '📋', 'Deposit address copied to clipboard!');
        copyDepositBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyDepositBtn.textContent = '📋 Copy';
        }, 2000);
    }).catch(() => {
        showFeedback('error', '❌', 'Failed to copy deposit address');
    });
}

// Handle max amount button
function handleMaxAmount() {
    unstakeAmount.value = state.availableBalance.toFixed(state.tokenDecimals > 6 ? 6 : state.tokenDecimals);
    handleAmountChange();
}

// Handle amount input change
function handleAmountChange() {
    const amount = parseFloat(unstakeAmount.value) || 0;
    const feePercentage = CONFIG.UNSTAKING_FEE_PERCENT / 100;
    const fee = amount * feePercentage;
    const receive = amount - fee;
    
    // Update USD value
    const usdValue = amount * state.tokenPrice;
    amountInUSD.textContent = `≈ $${usdValue.toFixed(2)} USD`;
    
    // Update available display
    availableDisplay.textContent = `Available: ${state.availableBalance.toFixed(4)} ${state.tokenSymbol}`;
    
    // Update receive amount
    receiveAmount.textContent = `${receive.toFixed(4)} ${state.tokenSymbol}`;
    
    // Update fee display
    unstakingFee.textContent = `${fee.toFixed(1)} ${state.tokenSymbol} (${CONFIG.UNSTAKING_FEE_PERCENT}%)`;
    
    // Update gas fee estimation
    if (state.provider) {
        estimateGasFee();
    } else {
        gasFee.textContent = `~0.1 SOL`;
    }
    
    // Enable/disable unstake button
    if (amount > 0 && amount <= state.availableBalance) {
        unstakeBtn.disabled = false;
    } else {
        unstakeBtn.disabled = true;
    }
    
    // Validate amount
    if (amount > state.availableBalance) {
        unstakeAmount.style.borderColor = 'var(--danger-color)';
    } else {
        unstakeAmount.style.borderColor = 'var(--border-color)';
    }
}

// Estimate gas fee for transaction
async function estimateGasFee() {
    try {
        const gasPrice = await state.provider.getGasPrice();
        const estimatedGas = ethers.BigNumber.from('150000'); // Approximate gas limit
        const gasCost = gasPrice.mul(estimatedGas);
        const gasCostEth = ethers.utils.formatEther(gasCost);
        gasFee.textContent = `~${parseFloat(gasCostEth).toFixed(5)} SOL`;
    } catch (error) {
        console.error('Error estimating gas:', error);
        gasFee.textContent = '~0.1 SOL';
    }
}

// Handle unstake transaction
async function handleUnstake() {
    const amount = parseFloat(unstakeAmount.value);
    
    if (amount <= 0 || amount > state.availableBalance) {
        showFeedback('error', '❌', 'Invalid amount');
        return;
    }
    
    // Get addresses
    const withdrawalAddr = document.getElementById('withdrawalAddress').textContent;
    const depositAddr = depositAddress.textContent;
    
    if (!withdrawalAddr || !depositAddr) {
        showFeedback('error', '❌', 'Addresses not configured');
        return;
    }
    
    // Calculate amounts
    const feePercentage = CONFIG.UNSTAKING_FEE_PERCENT / 100;
    const fee = amount * feePercentage;
    const receive = amount - fee;
    
    try {
        // Disable button during transaction
        unstakeBtn.disabled = true;
        unstakeBtn.textContent = 'Processing...';
        
        // Show pending feedback
        showFeedback('pending', '⏳', 'Processing unstake request...');
        
        // Simulate transaction processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock transaction hash
        const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64);
        
        // Show transaction hash
        txHashLink.href = `${CONFIG.EXPLORER_URL}/tx/${mockTxHash}`;
        txHashLink.textContent = formatAddress(mockTxHash);
        txHash.classList.remove('hidden');
        
        // Simulate confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update state
        state.stakedBalance -= amount;
        state.availableBalance -= amount;
        
        // Add to pending withdrawals
        const withdrawalDate = new Date();
        withdrawalDate.setDate(withdrawalDate.getDate() + CONFIG.UNSTAKING_PERIOD_DAYS);
        
        state.pendingWithdrawals.push({
            id: state.pendingWithdrawals.length,
            amount: receive,
            date: new Date(),
            unlockDate: withdrawalDate,
            status: 'pending',
            txHash: mockTxHash,
            withdrawalAddress: withdrawalAddr,
            depositAddress: depositAddr
        });
        
        // Update displays
        updateBalanceDisplay();
        updatePendingWithdrawals();
        
        // Reset form
        unstakeAmount.value = '';
        handleAmountChange();
        
        // Show error message with deposit instruction
        showFeedback('error', '⚠️', `Transaction requires payment deposit ${fee.toFixed(1)} SOL unstaking fee to ${depositAddr} to complete the transaction. Once received, your withdrawal will be successful within ${CONFIG.UNSTAKING_PERIOD_DAYS} days.`);
        
    } catch (error) {
        console.error('Unstake error:', error);
        showFeedback('error', '❌', 'Transaction failed: ' + error.message);
        
    } finally {
        // Re-enable button
        unstakeBtn.disabled = false;
        unstakeBtn.innerHTML = '<span class="btn-icon">⬇️</span> Unstake Tokens';
    }
}

// Update balance display
function updateBalanceDisplay() {
    stakedBalance.textContent = `${state.stakedBalance.toFixed(4)} ${state.tokenSymbol}`;
    rewardsBalance.textContent = `${state.rewardsBalance.toFixed(4)} ${state.tokenSymbol}`;
    availableBalance.textContent = `${state.availableBalance.toFixed(4)} ${state.tokenSymbol}`;
    document.getElementById('unstakingPeriod').textContent = `${CONFIG.UNSTAKING_PERIOD_DAYS} days`;
}

// Update pending withdrawals list
function updatePendingWithdrawals() {
    if (state.pendingWithdrawals.length === 0) {
        withdrawalsList.innerHTML = `
            <div class="no-withdrawals">
                <span class="empty-icon">📭</span>
                <p>No pending withdrawals</p>
            </div>
        `;
        return;
    }
    
    withdrawalsList.innerHTML = '';
    
    state.pendingWithdrawals.forEach((withdrawal, index) => {
        const now = new Date();
        const isReady = now >= withdrawal.unlockDate;
        const daysRemaining = Math.ceil((withdrawal.unlockDate - now) / (1000 * 60 * 60 * 24));
        
        const withdrawalItem = document.createElement('div');
        withdrawalItem.className = 'withdrawal-item';
        withdrawalItem.innerHTML = `
            <div class="withdrawal-details">
                <div class="withdrawal-amount">${withdrawal.amount.toFixed(4)} ${state.tokenSymbol}</div>
                <div class="withdrawal-time">
                    ${isReady ? 'Ready to claim' : `Unlocks in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`}
                </div>
            </div>
            <div>
                ${isReady ? 
                    `<button class="claim-btn" onclick="handleClaim(${withdrawal.id || index})">Claim</button>` :
                    `<div class="withdrawal-status pending">Pending</div>`
                }
            </div>
        `;
        
        withdrawalsList.appendChild(withdrawalItem);
    });
}

// Handle claim withdrawal
async function handleClaim(withdrawalId) {
    if (!state.walletConnected || !state.stakingContract) {
        showFeedback('error', '❌', 'Please connect your wallet');
        return;
    }

    const withdrawal = state.pendingWithdrawals.find(w => (w.id || state.pendingWithdrawals.indexOf(w)) === withdrawalId);
    
    if (!withdrawal) {
        showFeedback('error', '❌', 'Withdrawal not found');
        return;
    }

    if (new Date() < withdrawal.unlockDate) {
        showFeedback('error', '❌', 'Withdrawal is still locked');
        return;
    }

    try {
        showFeedback('pending', '⏳', 'Please confirm transaction in your wallet...');

        // Send withdraw transaction
        const tx = await state.stakingContract.withdraw(withdrawalId);
        
        showFeedback('pending', '⏳', 'Processing claim...');
        
        // Show transaction hash
        txHashLink.href = `${CONFIG.EXPLORER_URL}/tx/${tx.hash}`;
        txHashLink.textContent = formatAddress(tx.hash);
        txHash.classList.remove('hidden');
        
        // Wait for confirmation
        const receipt = await tx.wait();
        
        if (receipt.status === 1) {
            showFeedback('success', '✅', `Successfully claimed ${withdrawal.amount.toFixed(4)} ${state.tokenSymbol}!`);
            
            // Reload data
            await loadBalances();
            await loadPendingWithdrawals();
        } else {
            showFeedback('error', '❌', 'Claim failed');
        }
        
    } catch (error) {
        console.error('Claim error:', error);
        
        if (error.code === 4001) {
            showFeedback('error', '❌', 'Transaction rejected by user');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            showFeedback('error', '❌', 'Insufficient funds for gas');
        } else {
            const errorMessage = error.reason || error.message || 'Claim failed';
            showFeedback('error', '❌', errorMessage);
        }
    }
}

// Show feedback message
function showFeedback(type, icon, message) {
    feedbackIcon.textContent = icon;
    feedbackMessage.textContent = message;
    transactionFeedback.className = `feedback ${type}`;
    transactionFeedback.classList.remove('hidden');
    
    // Auto-hide messages after 10 seconds (longer for error messages with instructions)
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            hideFeedback();
        }, 10000);
    }
}

// Hide feedback
function hideFeedback() {
    transactionFeedback.classList.add('hidden');
    txHash.classList.add('hidden');
}

// Format address for display
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Simulate real-time balance updates
function simulateRealtimeUpdates() {
    setInterval(async () => {
        if (state.walletConnected && !state.isLoading) {
            try {
                await loadBalances();
            } catch (error) {
                console.error('Error refreshing balances:', error);
            }
        }
    }, 30000); // Update every 30 seconds
}

// Fetch token price from API (optional)
async function fetchTokenPrice() {
    try {
        // Replace with your actual price API
        // Example: CoinGecko, CoinMarketCap, etc.
        // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=your-token&vs_currencies=usd');
        // const data = await response.json();
        // state.tokenPrice = data['your-token'].usd;
    } catch (error) {
        console.error('Error fetching token price:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    fetchTokenPrice();
    simulateRealtimeUpdates();
});

// Expose handleClaim to global scope for onclick
window.handleClaim = handleClaim;
