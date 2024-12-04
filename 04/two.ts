const text: string = Deno.readTextFileSync("input.txt");
const res = text.split("\n").map((r) => r.split(""));

const headings = [
  [-1, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
];
const word = "MAS";

const w = res[0].length;
const h = res.length;

const check = (x: number, y: number, heading: number, v: string): boolean => {
  const nx = x + headings[heading][0];
  const ny = y + headings[heading][1];
  return !(nx < 0 || nx >= w || ny < 0 || ny >= h || res[ny][nx] != v);
};

let count = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (res[y][x] == word[1]) {
      if (
        ((check(x, y, 0, word[0]) && check(x, y, 1, word[2])) ||
          (check(x, y, 0, word[2]) && check(x, y, 1, word[0]))) &&
        ((check(x, y, 2, word[0]) && check(x, y, 3, word[2])) ||
          (check(x, y, 2, word[2]) && check(x, y, 3, word[0])))
      ) {
        count++;
      }
    }
  }
}

console.log(count);
