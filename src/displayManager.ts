import { BinanceData, requestManager } from "./requestManager";
import { UserInputParser } from "./userInput";
import TtyTable, { Header } from "tty-table";
import clc from "cli-color";

export class DisplayManager {
  async displayData() {
    const binanceData = await requestManager();
    const userInputParser = new UserInputParser();
    const userInput = userInputParser.getUserInput(process.argv);
    console.log("Sorting Flags:", userInput);

    const sortBy = userInput.sortBy;
    console.log("Sort By:", sortBy);

    if (sortBy && sortBy.length > 0) {
      binanceData.sort((a, b) => {
        for (const { column, order } of sortBy) {
          const orderMultiplier = order === "asc" ? 1 : -1;
          let comparison = 0;

          if (column === "symbol") {
            comparison = a.symbol.localeCompare(b.symbol);
          }
          if (column === "price") {
            comparison = a.price - b.price;
          }
          if (column === "priceChange") {
            comparison = a.priceChange - b.priceChange;
          }
          if (column === "volume") {
            comparison = a.volume - b.volume;
          }
          if (column === "numberOfTrades") {
            comparison = a.numberOfTrades - b.numberOfTrades;
          }
          if (column === "trend") {
            comparison = a.trend - b.trend;
          }

          if (comparison !== 0) {
            return orderMultiplier * comparison;
          }

          break;
        }

        return 0;
      });
    }

    const trendResults: { [key: string]: number[] } = {};
    binanceData.forEach((data) => {
      if (!trendResults[data.symbol]) {
        trendResults[data.symbol] = [];
      }
      trendResults[data.symbol].push(data.price);
    });

    const trends: { [key: string]: number } = {};
    for (const symbol in trendResults) {
      trends[symbol] = this.calculateTrend(trendResults[symbol]);
    }

    interface RowData {
      symbol: string;
      price: string;
      priceChange: string;
      volume: string;
      numberOfTrades: string;
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

    for (const data of binanceData) {
      const priceChangeColor =
        data.priceChange > 0
          ? clc.green(data.priceChange)
          : clc.red(data.priceChange);

      let trendColor = clc.white(data.trend);
      if (data.trend > 0) {
        trendColor = clc.green(data.trend);
      } else if (data.trend < 0) {
        trendColor = clc.red(data.trend);
      }

      const rowData: RowData = {
        symbol: data.symbol,
        price: data.price.toString(),
        priceChange: priceChangeColor,
        volume: data.volume.toString(),
        numberOfTrades: data.numberOfTrades.toString(),
        trend: trendColor,
      };

      rowsData.push(rowData);

      if (userInput.limit && rowsData.length === userInput.limit) {
        break;
      }
    }

    const table = TtyTable(headers, rowsData, {
      compact: true,
    });

    const renderedTable = table.render();
    console.log(renderedTable);
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;
    const n = prices.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = prices.reduce((a, b) => a + b, 0);
    const sumXY = prices.reduce((acc, price, index) => acc + price * index, 0);
    const sumX2 = prices.reduce((acc, _, index) => acc + index * index, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return Math.min(Math.max(slope * 100, -100), 100);
  }
}
