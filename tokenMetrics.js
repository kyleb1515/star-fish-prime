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
        
        const tokenMintAddress = 'dfpRGT9zgxUgi2sHP3Mj6geZhFDfJJxaRqbWDFFysmD';
        
        // Get price data from Raydium
        const priceResponse = await fetch(`https://api.raydium.io/v2/main/price?token_list=[${tokenMintAddress}]`);
        const priceData = await priceResponse.json();
        
        // Get pool data
        const poolsResponse = await fetch(`https://api.raydium.io/v2/main/pools?token_list=[${tokenMintAddress}]`);
        const poolData = await poolsResponse.json();
        
        // Get token supply (from your existing RPC connection)
        const tokenSupply = await connection.getTokenSupply(new window.solanaWeb3.PublicKey(tokenMintAddress));
        
        const price = priceData[tokenMintAddress]?.price || 0;
        const supply = tokenSupply.value.uiAmount;
        const marketCap = price * supply;
        
        return {
            price: price,
            marketCap: marketCap,
            liquidity: poolData[tokenMintAddress]?.liquidity || 0,
            volume24h: poolData[tokenMintAddress]?.volume24h || 0
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
