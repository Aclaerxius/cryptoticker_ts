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

export async function requestManager() {
  const response = await fetch("https://api2.binance.com/api/v3/ticker/24hr");
  const data = await response.json();

  return data;
}

async function main() {
  const binanceData: BinanceDataModel[] = await requestManager();
  console.log(binanceData);
}

main().catch(console.error);
