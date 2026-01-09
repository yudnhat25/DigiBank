
import { MarketData, ChartData } from '../types';
import { BINANCE_REST_API } from '../constants';

export const fetchMarketPrices = async (symbols: string[]): Promise<MarketData[]> => {
  try {
    // Optimization: Fetch all 24h tickers in one request and filter locally
    // This is much more efficient than 100+ individual requests
    const response = await fetch(`${BINANCE_REST_API}/ticker/24hr`);
    const allData = await response.json();
    
    // Create a set for O(1) lookup
    const symbolSet = new Set(symbols);
    
    return allData
      .filter((item: any) => symbolSet.has(item.symbol))
      .map((data: any) => ({
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        change24h: parseFloat(data.priceChangePercent),
        high24h: parseFloat(data.highPrice),
        low24h: parseFloat(data.lowPrice),
      }));
  } catch (error) {
    console.error("Error fetching market prices:", error);
    return [];
  }
};

export const fetchOHLCData = async (symbol: string): Promise<ChartData[]> => {
  try {
    const response = await fetch(`${BINANCE_REST_API}/klines?symbol=${symbol}&interval=1h&limit=50`);
    const data = await response.json();
    return data.map((d: any) => ({
      time: new Date(d[0]).toISOString().split('T')[0],
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));
  } catch (error) {
    console.error("Error fetching OHLC data:", error);
    return [];
  }
};
