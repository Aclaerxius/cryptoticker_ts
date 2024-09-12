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

function convertToNumber(value: string | number): number {
  if (typeof value === "string") {
    return parseFloat(value) * 2;
  }
  return value * 2;
}

function convertBinanceData(data: BinanceDataModel[]): BinanceData[] {
  return data.map((item) => ({
    symbol: item.symbol,
    price: convertToNumber(item.lastPrice),
    priceChange: convertToNumber(item.priceChange),
    volume: convertToNumber(item.volume),
    numberOfTrades: convertToNumber(item.count),
    trend: convertToNumber(item.priceChange) > 0 ? "Up" : "Down",
  }));
}

export async function requestManager() {
  const response = await fetch("https://api2.binance.com/api/v3/ticker/24hr");
  const data = await response.json();

  return convertBinanceData(data);
}

async function main() {
  const binanceData: BinanceData[] = await requestManager();
  return binanceData;
}

main().catch(console.error);
