import { G, Test } from "test.ts";

function greeter(person: string) {
  return "Hello, " + person;
}

const user = "Alex";
const test = new Test();
console.log(test.t, G);
console.log(greeter(user));
