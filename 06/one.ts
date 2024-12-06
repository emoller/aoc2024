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

const findStart = (
  grid: string[][],
  headings_chars: string
): [number, number, number] => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (headings_chars.includes(grid[y][x])) {
        return [x, y, headings_chars.indexOf(grid[y][x])];
      }
    }
  }
  return [0, 0, 0];
};

let [x, y, heading] = findStart(res, headings_chars);

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

const sum = res.flat().reduce((a, c) => a + (c === "X" ? 1 : 0), 0);
console.log(sum);
