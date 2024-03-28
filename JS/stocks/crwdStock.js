document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'UC0QNSHWIEDSCA4F';
    const symbol = 'CRWD';
    const elementId = 'CRWD';

    fetchAndDisplayStockData(apiKey, symbol, elementId);

    // Refresh data every 10 minutes
    setInterval(() => fetchAndDisplayStockData(apiKey, symbol, elementId), 60000 * 10);

    // Set a timeout to change the text if 'Loading...' is still present after 7 seconds
    setTimeout(() => {
        const stockDataElement = document.getElementById(elementId);
        if (stockDataElement.innerText === 'Loading...') {
            stockDataElement.innerText = 'Cannot access stock data.';
        }
    }, 7000); // 7000 milliseconds = 7 seconds
});