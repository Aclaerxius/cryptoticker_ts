import axios from "axios";

export interface BinanceDataModel {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
  weightedAvgPrice: number;
  prevClosePrice: number;
  lastPrice: number;
  lastQty: number;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  volume: number;
  quoteVolume: number;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceData {
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  numberOfTrades: number;
  trend: number;
}

function convertToNumber(data: BinanceDataModel[]): BinanceData[] {
  return data.map((item) => ({
    symbol: item.symbol,
    price: item.lastPrice,
    priceChange: item.priceChangePercent,
    volume: item.quoteVolume,
    numberOfTrades: item.lastId,
    trend: item.priceChangePercent,
  }));
}

const baseURL = "https://api2.binance.com";

export async function requestManager(): Promise<BinanceData[]> {
  try {
    const response = await axios.get(`${baseURL}/api/v3/ticker/24hr`);
    return convertToNumber(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
