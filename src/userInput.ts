interface SortArgs {
  column: string;
  order: string;
}

export interface UserInput {
  sortBy?: SortArgs[];
  limit?: number;
  pairs?: string[];
  ignoreErrors?: boolean;
  live?: number;
  trend?: number;
}

export function getUserInput(): { sortBy: string; order: string } {
  const args = process.argv.slice(2);
  const userInput: UserInput = {
    sortBy: [],
    limit: 0,
    pairs: [],
    ignoreErrors: false,
    live: 0,
    trend: 0,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--sortBy") {
      if (i + 2 < args.length) {
        const [column, order] = args[i + 1].split(",");
        userInput.sortBy?.push({ column, order });
        i += 1;
      }
    } else if (arg === "--limit") {
      if (i + 1 < args.length) {
        userInput.limit = parseInt(args[i + 1], 10);
        i += 1;
      }
    } else if (arg === "--pairs") {
      while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        userInput.pairs?.push(args[i + 1]);
        i += 1;
      }
    } else if (arg === "--ignoreErrors") {
      userInput.ignoreErrors = true;
    } else if (arg === "--live") {
      if (i + 1 < args.length) {
        userInput.live = parseInt(args[i + 1], 10);
        i += 1;
      }
    } else if (arg === "--trend") {
      if (i + 1 < args.length) {
        userInput.trend = parseInt(args[i + 1], 10);
        i += 1;
      }
    } else if (arg === "--help") {
      console.log(
        "Usage: node src/index.js --sortBy <column>,<order> --limit <number> --pairs <pair1,pair2,...> --ignoreErrors --live <number> --trend <number>"
      );
      process.exit(0);
    } else {
      console.log(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  return {
    sortBy:
      userInput.sortBy?.map((arg) => `${arg.column},${arg.order}`).join(",") ||
      "",
    order: userInput.sortBy?.[0]?.order || "",
  };
}

getUserInput();
