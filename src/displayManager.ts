import { requestManager } from "./requestManager";
import { getUserInput } from "./userInput";
import Table from "tty-table";

declare module "tty-table" {
  export default class Table {
    constructor(options: { head: string[]; colWidths: number[] });
    push(row: (string | number)[]): void;
    toString(): string;
  }
}

function calculateTrend(prices: number[]): number {
  if (prices.length < 2) return 0;
  const n = prices.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = prices.reduce((a, b) => a + b, 0);
  const sumXY = prices.reduce((acc, price, index) => acc + price * index, 0);
  const sumX2 = prices.reduce((acc, _, index) => acc + index * index, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return Math.min(Math.max(slope * 100, -100), 100);
}

export async function displayData() {
  const binanceData = await requestManager();
  const sortingFlags = getUserInput(process.argv);

  console.log("Sorting Flags:", sortingFlags);
  const sortBy = sortingFlags.sortBy?.[0];
  console.log("Sort By:", sortBy);

  const order = sortBy?.order === "asc" ? 1 : -1;

  binanceData.sort((a, b) => {
    if (sortBy?.column === "symbol") {
      return order * a.symbol.localeCompare(b.symbol);
    } else if (sortBy?.column === "price") {
      return order * (a.price - b.price);
    } else if (sortBy?.column === "priceChange") {
      return order * (a.priceChange - b.priceChange);
    } else if (sortBy?.column === "volume") {
      return order * (a.volume - b.volume);
    } else if (sortBy?.column === "numberOfTrades") {
      return order * (a.numberOfTrades - b.numberOfTrades);
    } else if (sortBy?.column === "trend") {
      return order * a.trend.localeCompare(b.trend);
    } else {
      return 0;
    }
  });

  const trendResults: { [key: string]: number[] } = {};

  binanceData.forEach((data) => {
    if (!trendResults[data.symbol]) {
      trendResults[data.symbol] = [];
    }
    trendResults[data.symbol].push(data.price);
  });

  const trends: { [key: string]: number } = {};
  for (const symbol in trendResults) {
    trends[symbol] = calculateTrend(trendResults[symbol]);
  }

  const table = new Table({
    head: [
      "Symbol",
      "Price",
      "Price Change",
      "Volume",
      "Number of Trades",
      "Trend",
    ],
    colWidths: [20, 20, 20, 20, 20, 20],
  });

  binanceData.forEach((data) => {
    const priceChangeColor = data.priceChange > 0 ? "\x1b[32m" : "\x1b[31m";
    const resetColor = "\x1b[0m";

    let trendColor = "\x1b[37m";
    const trendValue = trends[data.symbol] || 0;
    if (trendValue > 0) {
      trendColor = `\x1b[38;2;${255 - trendValue * 2.55};255;${255 - trendValue * 2.55}m`;
    } else if (trendValue < 0) {
      trendColor = `\x1b[38;2;${255 + trendValue * 2.55};0;0m`;
    }

    table.push([
      data.symbol,
      data.price,
      `${priceChangeColor}${data.priceChange}%${resetColor}`,
      data.volume,
      data.numberOfTrades,
      `${trendColor}${trendValue.toFixed(2)}%${resetColor}`,
    ]);
  });

  console.log(table.toString());
}

displayData().catch(console.error);
