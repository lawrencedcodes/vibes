// Stock Market Simulator - Backend Server (Node.js)
// Fetches real stock data from Alpha Vantage

// --- Dependencies ---
const express = require("express"); // Web server framework
const axios = require("axios"); // For making HTTP requests to Alpha Vantage
const cors = require("cors"); // To allow requests from the frontend browser

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3000; // Port to run the server on
const ALPHA_VANTAGE_API_KEY = "************"; // !! REPLACE WITH YOUR ACTUAL KEY !!

// --- Middleware ---
// Enable CORS for all origins (for development purposes)
// For production, configure CORS more restrictively: app.use(cors({ origin: 'YOUR_FRONTEND_URL' }));
app.use(cors());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// --- API Endpoint ---

/**
 * GET /api/stock/:ticker
 * Fetches the latest quote for a given stock ticker from Alpha Vantage.
 * :ticker - The stock symbol (e.g., AAPL, GOOGL)
 */
app.get("/api/stock/:ticker", async (req, res) => {
  const ticker = req.params.ticker.toUpperCase(); // Get ticker from URL parameter

  if (!ticker) {
    return res
      .status(400)
      .json({ error: "Stock ticker parameter is required." });
  }

  if (ALPHA_VANTAGE_API_KEY === "YOUR_ALPHA_VANTAGE_API_KEY") {
    console.error("Alpha Vantage API Key not set!");
    // Send back a simulated price if API key is missing, so frontend doesn't completely break
    // NOTE: This is for demonstration. In production, you'd likely want a proper error.
    const simulatedPrice = (Math.random() * 500 + 10).toFixed(2); // Random price between 10 and 510
    console.log(
      `API Key missing, returning simulated price for ${ticker}: ${simulatedPrice}`
    );
    return res.json({ ticker: ticker, price: parseFloat(simulatedPrice) });
    // Or return a proper error:
    // return res.status(500).json({ error: 'Server configuration error: API key missing.' });
  }

  // Construct the Alpha Vantage API URL for Global Quote
  const alphaVantageUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    // Make the request to Alpha Vantage
    console.log(`Fetching data for ${ticker} from Alpha Vantage...`);
    const response = await axios.get(alphaVantageUrl);
    const data = response.data;

    // Check for API errors or empty data
    if (data["Error Message"]) {
      console.error(
        `Alpha Vantage API Error for ${ticker}:`,
        data["Error Message"]
      );
      return res.status(404).json({
        error: `Could not retrieve data for ticker ${ticker}. API Error: ${data["Error Message"]}`,
      });
    }

    const globalQuote = data["Global Quote"];

    if (!globalQuote || Object.keys(globalQuote).length === 0) {
      // Handle cases where the API returns success but no quote data (e.g., invalid ticker not caught by API error)
      console.warn(
        `No 'Global Quote' data returned for ${ticker}. Response:`,
        data
      );
      // Check for rate limiting note
      if (data["Note"]) {
        console.warn("Alpha Vantage Note:", data["Note"]);
        return res.status(429).json({
          error: `Rate limit likely exceeded for ticker ${ticker}. Note: ${data["Note"]}`,
        });
      }
      return res.status(404).json({
        error: `No quote data found for ticker ${ticker}. It might be invalid.`,
      });
    }

    // Extract the price (field '05. price')
    const priceString = globalQuote["05. price"];
    if (priceString === undefined || priceString === null) {
      console.error(
        `Could not find '05. price' in Alpha Vantage response for ${ticker}:`,
        globalQuote
      );
      return res.status(500).json({
        error: `Could not parse price from API response for ${ticker}.`,
      });
    }

    const price = parseFloat(priceString);

    if (isNaN(price)) {
      console.error(
        `Parsed price is NaN for ${ticker}. Original string: '${priceString}'`
      );
      return res
        .status(500)
        .json({ error: `Could not convert price to number for ${ticker}.` });
    }

    console.log(`Successfully fetched price for ${ticker}: ${price}`);

    // Send the successful response back to the frontend
    res.json({
      ticker: ticker,
      price: price,
    });
  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error.message);
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error Response Data:", error.response.data);
      console.error("Error Response Status:", error.response.status);
      res.status(error.response.status).json({
        error: `API request failed for ${ticker} with status ${error.response.status}`,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error Request:", error.request);
      res.status(503).json({
        error: `No response received from Alpha Vantage for ${ticker}.`,
      }); // Service Unavailable
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", error.message);
      res.status(500).json({
        error: `Failed to fetch data for ${ticker}. ${error.message}`,
      });
    }
  }
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Stock Simulator Backend running on http://localhost:${PORT}`);
  if (ALPHA_VANTAGE_API_KEY === "YOUR_ALPHA_VANTAGE_API_KEY") {
    console.warn(
      "Warning: Alpha Vantage API Key is not set. Using simulated prices."
    );
  } else {
    console.log("Alpha Vantage API Key is set.");
  }
});
