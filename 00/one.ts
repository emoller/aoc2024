const text: String = Deno.readTextFileSync("input.txt");

let res = text.split("\n").map((r) => r.split(" ").map(Number));

console.log(res);
