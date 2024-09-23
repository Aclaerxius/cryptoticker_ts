import { BinanceData, requestManager } from "./requestManager";
import { UserInputParser } from "./userInput";
import TtyTable, { Header } from "tty-table";
import clc from "cli-color";

interface RowData {
  symbol: string;
  price: string;
  priceChange: string;
  volume: string;
  numberOfTrades: string;
  trend: string;
}

export class DisplayManager {
  private pastValues: { [key: string]: number[] } = {};

  async displayData() {
    const userInputParser = new UserInputParser();
    const userInput = userInputParser.getUserInput(process.argv);
    console.log("Sorting Flags:", userInput);

    const sortBy = userInput.sortBy;
    console.log("Sort By:", sortBy);

    const headers: Header[] = [
      { alias: "Symbol", value: "symbol" },
      { alias: "Price", value: "price" },
      { alias: "Price Change", value: "priceChange" },
      { alias: "Volume", value: "volume" },
      { alias: "Number of Trades", value: "numberOfTrades" },
      { alias: "Trend", value: "trend" },
    ];

    while (true) {
      const binanceData = await requestManager();

      if (sortBy && sortBy.length > 0) {
        this.sortFlags(binanceData, sortBy);
      }

      const trends: { [key: string]: number } = {};
      for (const data of binanceData) {
        if (!this.pastValues[data.symbol]) {
          this.pastValues[data.symbol] = [];
        }
        this.pastValues[data.symbol].push(data.price);

        if (
          userInput.trend !== undefined &&
          this.pastValues[data.symbol].length >= userInput.trend
        ) {
          trends[data.symbol] = this.calculateAverage(
            this.pastValues[data.symbol]
          );
        } else {
          trends[data.symbol] = 0;
        }
      }

      const rowsData: RowData[] = [];
      for (const data of binanceData) {
        const priceChangeColor =
          data.priceChange > 0
            ? clc.green(data.priceChange)
            : clc.red(data.priceChange);
        const trendColor =
          trends[data.symbol] > 0
            ? clc.green(trends[data.symbol])
            : clc.red(trends[data.symbol]);

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

      process.stdout.write(clc.reset);
      const table = TtyTable(headers, rowsData, { compact: true });
      const renderedTable = table.render();
      console.log(renderedTable);

      if (userInput.limit) {
        const limitInSeconds = userInput.limit * 1000;
        await new Promise((resolve) => setTimeout(resolve, limitInSeconds));
      }
    }
  }

  sortFlags(
    data: BinanceData[],
    sortBy: { column: string; order: "asc" | "desc" }[],
    n: number = data.length
  ) {
    if (n === 1) return;

    for (let i = 0; i < n - 1; i++) {
      for (const { column, order } of sortBy) {
        const orderMultiplier = order === "asc" ? 1 : -1;
        let comparison = 0;

        if (column === "symbol") {
          comparison = data[i].symbol.localeCompare(data[i + 1].symbol);
        } else if (column === "price") {
          comparison = data[i].price - data[i + 1].price;
        } else if (column === "priceChange") {
          comparison = data[i].priceChange - data[i + 1].priceChange;
        } else if (column === "volume") {
          comparison = data[i].volume - data[i + 1].volume;
        } else if (column === "numberOfTrades") {
          comparison = data[i].numberOfTrades - data[i + 1].numberOfTrades;
        } else if (column === "trend") {
          comparison = data[i].trend - data[i + 1].trend;
        }

        if (comparison === 0) {
          continue;
        }

        if (comparison * orderMultiplier > 0) {
          [data[i], data[i + 1]] = [data[i + 1], data[i]];
        }
      }
    }

    this.sortFlags(data, sortBy, n - 1);
  }

  private calculateAverage(prices: number[]): number {
    if (prices.length === 0) return 0;
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }
}
