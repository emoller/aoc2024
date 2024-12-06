const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(""));
const width = res[0].length;
const height = res.length;
const headings_chars = "^>v<";
const headings = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
let heading = 0;
let y = 0;
let x = 0;
let found = false;
for (y = 0; y < height && !found; y++) {
  for (x = 0; x < width; x++) {
    if (headings_chars.includes(res[y][x])) {
      heading = headings_chars.indexOf(res[y][x]);
      found = true;
      y--;
      break;
    }
  }
}

while (x >= 0 && x < width && y >= 0 && y < height) {
  res[y][x] = "X";
  const nx = x + headings[heading][0];
  const ny = y + headings[heading][1];
  if (nx < 0 || nx >= width || ny < 0 || ny >= height) break;
  if (res[ny][nx] === "#") {
    heading = (heading + 1) % 4;
  } else {
    x = nx;
    y = ny;
  }
}

const sum = res.reduce(
  (acc, row) => acc + row.reduce((acc, col) => acc + (col === "X" ? 1 : 0), 0),
  0
);
console.log(sum);
