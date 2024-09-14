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
  trend: string;
}

function convertToNumber(data: BinanceDataModel[]): BinanceData[] {
  return data.map((item) => ({
    symbol: item.symbol,
    price: parseFloat(item.lastPrice.toString()),
    priceChange: parseFloat(item.priceChangePercent.toString()),
    volume: parseFloat(item.quoteVolume.toString()),
    numberOfTrades: parseInt(item.lastId.toString(), 10),
    trend: parseFloat(item.priceChangePercent.toString()) > 0 ? "Up" : "Down",
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
