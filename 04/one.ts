const text: string = Deno.readTextFileSync("input.txt");
const res = text.split("\n").map((r) => r.split(""));

const headings = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
];
const word = "XMAS";

const w = res[0].length;
const h = res.length;

let count = 0;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (res[y][x] == word[0]) {
      headings.forEach(([dx, dy], _i) => {
        let found = true;
        for (let j = 1; j < word.length; j++) {
          const nx = x + dx * j;
          const ny = y + dy * j;
          if (
            nx < 0 ||
            nx >= w ||
            ny < 0 ||
            ny >= h ||
            res[ny][nx] != word[j]
          ) {
            found = false;
            break;
          }
        }
        if (found) {
          count++;
        }
      });
    }
  }
}

console.log(count);
