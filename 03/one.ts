const text: String = Deno.readTextFileSync("input.txt");

let sum = 0;
for (const match of text.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
  sum += Number(match[1]) * Number(match[2]);
}

console.log(sum);
