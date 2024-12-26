// Initialize token data fetching
async function getTokenData() {
    try {
        const tokenAddress = 'FQ1tyso61AH1tzodyJfSwmzsD3GToybbRNoZxUBz21p8';
        
        // Fetch data from DexScreener API
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        const data = await response.json();
        
        // Get the first pair (usually the main trading pair)
        const mainPair = data.pairs?.[0];
        
        if (mainPair) {
            return {
                price: parseFloat(mainPair.priceUsd) || 0,
                marketCap: parseFloat(mainPair.fdv) || 0,
                liquidity: parseFloat(mainPair.liquidity?.usd) || 0,
                volume24h: parseFloat(mainPair.volume?.h24) || 0
            };
        }
        
        return {
            price: 0,
            marketCap: 0,
            liquidity: 0,
            volume24h: 0
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