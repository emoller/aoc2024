import TinyQueue from "https://esm.sh/tinyqueue@3.0.0";

const text: string = Deno.readTextFileSync("input.txt");
const sIndex = text.indexOf("S");
const eIndex = text.indexOf("E");
const grid = text.split("\n").map((line) => line.split(""));
const width = grid[0].length;
const headings = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const start = [sIndex % (width + 1), Math.floor(sIndex / (width + 1))];
const end = [eIndex % (width + 1), Math.floor(eIndex / (width + 1))];

type Node = {
  x: number;
  y: number;
  h: number;
  score: number;
};
const closed = new Set<string>();
const open = new TinyQueue<Node>([], (a: Node, b: Node) => a.score - b.score);

const tryPush = (x: number, y: number, score: number, h: number) => {
  if (!closed.has(`${x},${y},${h}`)) open.push({ x, y, score, h });
};

tryPush(start[0], start[1], 0, 1);

while (open.length) {
  const n = open.pop()!;
  if (n.x === end[0] && n.y === end[1]) {
    console.log(n.score);
    break;
  }
  closed.add(`${n.x},${n.y},${n.h}`);
  const ny = n.y + headings[n.h][1];
  const nx = n.x + headings[n.h][0];
  const cw = (n.h + 1) % 4;
  const ccw = (n.h + 3) % 4;
  if (grid[ny][nx] !== "#") tryPush(nx, ny, n.score + 1, n.h);
  tryPush(n.x, n.y, n.score + 1000, cw);
  tryPush(n.x, n.y, n.score + 1000, ccw);
}
