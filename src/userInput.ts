interface SortArgs {
  column: string;
  order: "asc" | "desc";
}

export interface UserInput {
  sortBy?: SortArgs[];
  limit?: number;
  pairs?: string[];
  ignoreErrors?: boolean;
  live?: number;
  trend?: number;
}

export class UserInputParser {
  userInput: UserInput;
  argsUserInput: string[][];

  constructor() {
    this.userInput = {};
    this.argsUserInput = [];
  }

  getUserInput(args: string[]): UserInput {
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.length > 1 && (arg.startsWith("-") || arg.startsWith("--"))) {
        this.argsUserInput.push([]);
        this.argsUserInput[this.argsUserInput.length - 1].push(arg);
      } else {
        if (this.argsUserInput.length > 0) {
          this.argsUserInput[this.argsUserInput.length - 1].push(arg);
        }
      }
    }

    this.processArgs();
    return this.userInput;
  }

  processArgs() {
    const sortArgs: string[] = [];
    const seenFlags = new Set<string>();

    for (const args of this.argsUserInput) {
      const flag = args[0];
      if (flag !== "--sort" && seenFlags.has(flag)) {
        throw new Error(`Duplicate parameter: ${flag}`);
      }
      seenFlags.add(flag);

      if (flag === "--sort") {
        sortArgs.push(...args.slice(1));
      } else if (flag === "--limit") {
        this.handleLimit(args[1]);
      } else if (flag === "--pairs") {
        this.handlePairs(args.slice(1));
      } else if (flag === "--ignore-errors") {
        this.userInput.ignoreErrors = true;
      } else if (flag === "--live") {
        this.handleLive(args[1]);
      } else if (flag === "--trend") {
        this.handleTrend(args[1]);
      } else {
        throw new Error(`Invalid parameter: ${flag}`);
      }
    }

    if (sortArgs.length > 0) {
      this.handleSort(sortArgs);
    }

    if (this.userInput.pairs && this.userInput.limit) {
      this.userInput.pairs = this.userInput.pairs.slice(
        0,
        this.userInput.limit
      );
    }
  }

  handleSort(sortArgs: string[]) {
    const sortCriteria: SortArgs[] = [];
    for (let i = 0; i < sortArgs.length; i += 2) {
      const column = sortArgs[i];
      const order = sortArgs[i + 1];

      if (!column || (order !== "asc" && order !== "desc")) {
        throw new Error(`Invalid sort parameter: ${column} ${order}`);
      }

      sortCriteria.push({ column, order });
    }

    this.userInput.sortBy = sortCriteria;
  }

  handleLimit(limitArg: string) {
    const limit = parseInt(limitArg, 10);
    if (isNaN(limit) || limit <= 0 || limit >= 10) {
      throw new Error(
        "Invalid limit value. Must be a positive integer between 1 and 10."
      );
    }
    this.userInput.limit = limit;
  }

  handlePairs(pairArgs: string[]) {
    if (pairArgs.length === 0) {
      this.userInput.pairs = [];
      return;
    }

    const filteredPairs = pairArgs.map((pair) => pair.toUpperCase());
    this.userInput.pairs = filteredPairs;
  }

  handleLive(value: string) {
    const live = parseInt(value, 10);
    if (isNaN(live) || live < 5 || live > 60) {
      throw new Error(
        "Invalid live interval. Must be a positive integer between 5 and 60."
      );
    }
    this.userInput.live = live;
  }

  handleTrend(trendArg: string) {
    const trend = parseInt(trendArg, 10);
    if (isNaN(trend) || trend <= 1 || trend >= 20) {
      throw new Error(
        "Invalid trend value. Must be a positive integer between 2 and 20."
      );
    }
    this.userInput.trend = trend;
  }
}
