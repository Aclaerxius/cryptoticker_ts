"use strict";
import { getUserInput } from "./userInput";
import { requestManager } from "./requestManager";

async function main() {
  const userInput = await getUserInput();
  const binanceData = await requestManager();
  console.log(userInput);
  console.log(binanceData);
}

main();
