const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(" ").map(Number));

console.log(res);
