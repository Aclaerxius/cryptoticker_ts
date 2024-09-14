import { requestManager } from "./requestManager";
import { getUserInput } from "./userInput";
import TtyTable, { Header } from "tty-table";

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

  class RowData {
    symbol: string;
    price: number;
    priceChange: string;
    volume: number;
    numberOfTrades: number;
    trend: string;
  }

  const headers: Header[] = [
    {
      alias: "Symbol",
      value: "symbol",
    },
    {
      alias: "Price",
      value: "price",
    },
    {
      alias: "Price Change",
      value: "priceChange",
    },
    {
      alias: "Volume",
      value: "volume",
    },
    {
      alias: "Number of Trades",
      value: "numberOfTrades",
    },
    {
      alias: "Trend",
      value: "trend",
    },
  ];

  const rowsData: RowData[] = [];

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

    const rowData: RowData = {
      symbol: data.symbol,
      price: data.price,
      priceChange: `${priceChangeColor}${data.priceChange}%${resetColor}`,
      volume: data.volume,
      numberOfTrades: data.numberOfTrades,
      trend: `${trendColor}${trendValue.toFixed(2)}%${resetColor}`,
    };

    if (rowsData.length < 10) {
      rowsData.push(rowData);
    }
  });

  const table = TtyTable(headers, rowsData, {
    compact: true,
  });

  const renderedTable = table.render();
  console.log(renderedTable);

  // console.log(table.toString());
}

// displayData().catch(console.error);
