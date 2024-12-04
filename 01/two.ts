const text: string = Deno.readTextFileSync("input.txt");

// Parse into number arrays
const res = text.split("\n").map((r) => r.split(/\s+/).map(Number));

// Build a count of each number in the second column
let count = {};
res.forEach((r) => (count[r[1]] = (count[r[1]] || 0) + 1));

// Sum the products of the first column and the counts
const sum = res.reduce((a, b) => a + b[0] * (count[b[0]] || 0), 0);

console.log(sum);
