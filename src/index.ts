"use strict";
//import { requestManager } from "./requestManager";
import { DisplayManager } from "./displayManager";

async function main() {
  //const binanceData = await requestManager();
  //
  const displayManager = new DisplayManager();
  displayManager.displayData();
  // console.table(displayData);
}

main().catch(console.error);
