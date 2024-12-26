// Initialize Solana connection
let connection;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if web3 library is loaded
        if (typeof solanaWeb3 === 'undefined') {
            console.error('Solana Web3 library not loaded');
            return;
        }

        // Using a different RPC endpoint
        connection = new solanaWeb3.Connection(
            'https://solana-mainnet.g.alchemy.com/v2/demo',  // Alternative public endpoint
            'confirmed'
        );
        
        // Start updating metrics
        updateMetrics();
        
    } catch (error) {
        console.error('Error initializing Solana connection:', error);
    }
});

async function getTokenData() {
    try {
        const tokenMintAddress = new solanaWeb3.PublicKey('FQ1tyso61AH1tzodyJfSwmzsD3GToybbRNoZxUBz21p8');
        
        // Get token supply info
        const tokenSupply = await connection.getTokenSupply(tokenMintAddress);
        console.log("Token supply:", tokenSupply);

        // Get Raydium price data
        const priceResponse = await fetch(`https://api.raydium.io/v2/main/price?token_list=[${tokenMintAddress}]`);
        const priceData = await priceResponse.json();
        
        return {
            price: priceData[tokenMintAddress]?.price || 0,
            marketCap: tokenSupply ? tokenSupply.value.uiAmount * (priceData[tokenMintAddress]?.price || 0) : 0,
            liquidity: priceData[tokenMintAddress]?.liquidity || 0,
            volume24h: priceData[tokenMintAddress]?.volume24h || 0
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

// Update every 30 seconds
setInterval(updateMetrics, 30000);