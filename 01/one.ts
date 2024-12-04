const text: string = Deno.readTextFileSync("input.txt");

// Parse into number arrays
let res = text.split("\n").map((r) => r.split(/\s+/).map(Number));

// Transpose and sort the arrays
res = res[0].map((_, i) => res.map((r) => r[i])).map((v) => v.sort());

// Sum the distances
const dists = res[0]
  .map((v, i) => Math.abs(v - res[1][i]))
  .reduce((a, b) => a + b, 0);

console.log(dists);
