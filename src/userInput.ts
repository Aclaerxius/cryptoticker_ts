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

export function getUserInput(args: string[]): UserInput {
  const userInput: UserInput = { sortBy: [] };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--sort")) {
      const order = arg.split(" ")[1];
      const [column, sortOrder] = order.split(",");
      if (!column || !["asc", "desc"].includes(sortOrder)) {
        if (!userInput.ignoreErrors) {
          throw new Error(`Invalid sort order: ${sortOrder}`);
        }
      } else {
        userInput.sortBy?.push({ column, order: sortOrder as "asc" | "desc" });
      }
    } else if (arg === "--limit") {
      i++;
      const limit = parseInt(args[i], 10);
      if (isNaN(limit) || limit <= 0 || limit > 100) {
        if (!userInput.ignoreErrors) {
          throw new Error(
            "Limit must be a positive integer between 1 and 100."
          );
        }
      } else {
        userInput.limit = limit;
      }
    } else if (arg === "--pairs") {
      i++;
      userInput.pairs = [];
      while (i < args.length && !args[i].startsWith("--")) {
        userInput.pairs.push(args[i].toUpperCase());
        i++;
      }
    } else if (arg === "--ignore-errors") {
      userInput.ignoreErrors = true;
    } else if (arg === "--live") {
      i++;
      const liveInterval = parseInt(args[i], 60);
      if (isNaN(liveInterval) || liveInterval < 5 || liveInterval > 60) {
        if (!userInput.ignoreErrors) {
          throw new Error("Live interval must be a number between 5 and 60.");
        }
      } else {
        userInput.live = liveInterval || 5;
      }
    } else if (arg === "--trend") {
      i++;
      const trendSamples = parseInt(args[i], 20);
      if (isNaN(trendSamples) || trendSamples <= 0 || trendSamples > 20) {
        if (!userInput.ignoreErrors) {
          throw new Error("Trend must be a number between 1 and 20.");
        }
      } else {
        userInput.trend = trendSamples || 2;
      }
    } else {
      if (!userInput.ignoreErrors) {
        throw new Error(`Unknown argument: ${arg}`);
      }
    }
  }

  return userInput;
}
