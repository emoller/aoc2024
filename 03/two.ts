const text: String = Deno.readTextFileSync("input.txt");

const enables: [number, boolean][] = [];
for (const match of text.matchAll(/(do|don't)\(\)/g)) {
  enables.push([match.index!, match[1] === "do"]);
}

let enabled = true;
let sum = 0;
for (const match of text.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
  if (enables.length && match.index! >= enables[0][0]) {
    enabled = enables[0][1];
    enables.shift();
  }
  if (enabled) sum += Number(match[1]) * Number(match[2]);
}

console.log(sum);
