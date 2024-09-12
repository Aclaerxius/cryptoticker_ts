"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInput = getUserInput;
function getUserInput() {
    var _a, _b, _c, _d, _e;
    var args = process.argv.slice(2);
    var userInput = {
        sortBy: [],
        limit: 0,
        pairs: [],
        ignoreErrors: false,
        live: 0,
        trend: 0,
    };
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];
        if (arg === "--sortBy") {
            if (i + 2 < args.length) {
                var _f = args[i + 1].split(","), column = _f[0], order = _f[1];
                (_a = userInput.sortBy) === null || _a === void 0 ? void 0 : _a.push({ column: column, order: order });
                i += 1;
            }
        }
        else if (arg === "--limit") {
            if (i + 1 < args.length) {
                userInput.limit = parseInt(args[i + 1], 10);
                i += 1;
            }
        }
        else if (arg === "--pairs") {
            while (i + 1 < args.length && !args[i + 1].startsWith("--")) {
                (_b = userInput.pairs) === null || _b === void 0 ? void 0 : _b.push(args[i + 1]);
                i += 1;
            }
        }
        else if (arg === "--ignoreErrors") {
            userInput.ignoreErrors = true;
        }
        else if (arg === "--live") {
            if (i + 1 < args.length) {
                userInput.live = parseInt(args[i + 1], 10);
                i += 1;
            }
        }
        else if (arg === "--trend") {
            if (i + 1 < args.length) {
                userInput.trend = parseInt(args[i + 1], 10);
                i += 1;
            }
        }
        else if (arg === "--help") {
            console.log("Usage: node src/index.js --sortBy <column>,<order> --limit <number> --pairs <pair1,pair2,...> --ignoreErrors --live <number> --trend <number>");
            process.exit(0);
        }
        else {
            console.log("Unknown argument: ".concat(arg));
            process.exit(1);
        }
    }
    return {
        sortBy: ((_c = userInput.sortBy) === null || _c === void 0 ? void 0 : _c.map(function (arg) { return "".concat(arg.column, ",").concat(arg.order); }).join(",")) ||
            "",
        order: ((_e = (_d = userInput.sortBy) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.order) || "",
    };
}
getUserInput();
