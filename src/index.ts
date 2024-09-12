"use strict";
import { requestManager } from "./requestManager";
import { displayData } from "./displayManager";
import Table from "tty-table";

async function main() {
  const binanceData = await requestManager();
  displayData(binanceData);
  const table = Table;
  //console.log(displayData);
  console.table(table);
}

main().catch(console.error);
