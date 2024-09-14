"use strict";
//import { requestManager } from "./requestManager";
import { displayData } from "./displayManager";

async function main() {
  //const binanceData = await requestManager();
  //
  displayData();
  // console.table(displayData);
}

main().catch(console.error);
