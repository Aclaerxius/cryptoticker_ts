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

interface BinanceData {
  symbol: string;
  price: number;
  priceChange: number;
  volume: number;
  numberOfTrades: number;
  trend: string;
}

export async function displayData(binanceData: BinanceData[]) {
  binanceData = await requestManager();

  const sortingFlags = getUserInput();

  binanceData.sort((a, b) => {
    if (sortingFlags.sortBy === "symbol") {
      return sortingFlags.order === "asc"
        ? a.symbol.localeCompare(b.symbol)
        : b.symbol.localeCompare(a.symbol);
    }

    if (sortingFlags.sortBy === "price") {
      return sortingFlags.order === "asc"
        ? a.price - b.price
        : b.price - a.price;
    }

    if (sortingFlags.sortBy === "priceChange") {
      return sortingFlags.order === "asc"
        ? a.priceChange - b.priceChange
        : b.priceChange - a.priceChange;
    }

    if (sortingFlags.sortBy === "volume") {
      return sortingFlags.order === "asc"
        ? a.volume - b.volume
        : b.volume - a.volume;
    }

    if (sortingFlags.sortBy === "numberOfTrades") {
      return sortingFlags.order === "asc"
        ? a.numberOfTrades - b.numberOfTrades
        : b.numberOfTrades - a.numberOfTrades;
    }

    if (sortingFlags.sortBy === "trend") {
      return sortingFlags.order === "asc"
        ? a.trend.localeCompare(b.trend)
        : b.trend.localeCompare(a.trend);
    }

    return 0;
  });

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

  binanceData.forEach((data: BinanceData) => {
    table.push([
      data.symbol,
      data.price,
      data.priceChange,
      data.volume,
      data.numberOfTrades,
      data.trend,
    ]);
  });

  return table;
}

displayData([]).catch(console.error);
