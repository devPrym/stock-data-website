// Include these functions at the top of your script.js file
function cacheData(key, data) {
    const item = {
        data: data,
        expiry: new Date().getTime() + 3600000, // Cache for 1 hour
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getCachedData(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date().getTime();
    if (now > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.data;
}

// This is the correct version of fetchAndDisplayStockData that includes caching logic
async function fetchAndDisplayStockData(apiKey, symbol, elementId) {
    const cacheKey = `${symbol}_data`; // Unique key for localStorage
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
        console.log('Using cached data');
        displayStockData(cachedData, elementId);
        return; // Use cached data and exit the function early
    }

    const functionType = 'TIME_SERIES_DAILY';
    const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data); // This will show you the full response from the API
        // Rest of your code to handle the data
    } catch (error) {
        console.error('Failed to fetch data:', error);
        document.getElementById(elementId).innerText = 'Failed to load data.';
    }
    
    
}

function displayStockData(data, elementId) {
    // Make sure 'Time Series (Daily)' data exists before proceeding
    if (!data['Time Series (Daily)']) {
        console.error('Time Series (Daily) data not found:', data);
        document.getElementById(elementId).innerText = 'Time Series (Daily) data not found.';
        return;
    }

    const metaData = data['Meta Data'];
    const timeSeries = data['Time Series (Daily)'];
    const latestDate = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestDate];
    const now = new Date();
    const lastUpdated = now.toLocaleString();

    const content = `
        <h2>${metaData['2. Symbol']} on ${latestDate}</h2>
        <p>Open: ${latestData['1. open']}</p>
        <p>High: ${latestData['2. high']}</p>
        <p>Low: ${latestData['3. low']}</p>
        <p>Close: ${latestData['4. close']}</p>
        <p>Volume: ${latestData['5. volume']}</p>
        <p>Last updated at: ${lastUpdated}</p>
    `;
    
    document.getElementById(elementId).innerHTML = content;
}



