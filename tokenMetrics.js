// Initialize Solana connection
let connection;
try {
    connection = new window.solanaWeb3.Connection(
        'https://api.mainnet-beta.solana.com',
        'confirmed'
    );
} catch (error) {
    console.error('Error initializing Solana connection:', error);
}

async function getTokenData() {
    try {
        if (!window.solanaWeb3) {
            console.error('Solana Web3 not loaded');
            return null;
        }
        
        // Replace with your actual token mint address
        const tokenMintAddress = new window.solanaWeb3.PublicKey('YOUR_TOKEN_ADDRESS_HERE');
        
        // Get token supply info
        const tokenSupply = await connection.getTokenSupply(tokenMintAddress);
        console.log("Token supply:", tokenSupply);

        // For now, return mock data until we integrate Raydium API
        return {
            price: 0.000001,
            marketCap: 100000,
            liquidity: 50000,
            volume24h: 25000
        };
        
    } catch (error) {
        console.error('Error in getTokenData:', error);
        return {
            price: 0,
            marketCap: 0,
            liquidity: 0,
            volume24h: 0
        };
    }
}

function displayMetrics(tokenData) {
    try {
        const metricsSection = document.querySelector('.metrics-grid');
        if (!metricsSection) {
            console.error('Metrics section not found');
            return;
        }

        metricsSection.innerHTML = `
            <div class="metric-item">
                <h3>Price</h3>
                <p class="glow-text">$${Number(tokenData.price).toFixed(7)}</p>
            </div>
            <div class="metric-item">
                <h3>Market Cap</h3>
                <p class="glow-text">$${Number(tokenData.marketCap).toLocaleString()}</p>
            </div>
            <div class="metric-item">
                <h3>Liquidity</h3>
                <p class="glow-text">$${Number(tokenData.liquidity).toLocaleString()}</p>
            </div>
            <div class="metric-item">
                <h3>24h Volume</h3>
                <p class="glow-text">$${Number(tokenData.volume24h).toLocaleString()}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error in displayMetrics:', error);
    }
}

async function updateMetrics() {
    try {
        const tokenData = await getTokenData();
        if (tokenData) {
            displayMetrics(tokenData);
        }
    } catch (error) {
        console.error('Error in updateMetrics:', error);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing metrics...');
    updateMetrics();
});

// Update every 30 seconds
setInterval(updateMetrics, 30000);
