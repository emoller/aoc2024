const text: string = Deno.readTextFileSync("input.txt");

const sections = text.split("\n\n");
const instructions = sections[1].replace(/[\n]+/g, "");
const grid = sections[0].split("\n").map((line) => line.split(""));
const width = grid[0].length;
const height = grid.length;
const headings_chars = "^>v<";
const headings = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const idx = sections[0].indexOf("@");
let rx = idx % (width + 1);
let ry = Math.floor(idx / (width + 1));
grid[ry][rx] = ".";

for (const instr of instructions) {
  const [dx, dy] = headings[headings_chars.indexOf(instr)];
  let tgt = grid[ry + dy][rx + dx];
  if (tgt == "#") {
    continue;
  } else if (tgt == ".") {
    rx += dx;
    ry += dy;
  } else if (tgt == "O") {
    let l = 1;
    while (tgt != "#" && tgt != ".") {
      l++;
      tgt = grid[ry + dy * l][rx + dx * l];
    }
    if (tgt == "#") {
      continue;
    } else {
      grid[ry + dy * l][rx + dx * l] = "O";
      grid[ry + dy * 1][rx + dx * 1] = ".";
      rx += dx;
      ry += dy;
    }
  }
}

let sum = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] == "O") {
      sum += y * 100 + x;
    }
  }
}

//console.log(grid.map((line) => line.join("")).join("\n"));
console.log(sum);
