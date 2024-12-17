import TinyQueue from "tinyqueue";

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
  path: { x: number; y: number }[];
};
const closed = new Map<string, number>();
const open = new TinyQueue<Node>([], (a: Node, b: Node) => a.score - b.score);

const tryPush = (
  x: number,
  y: number,
  score: number,
  h: number,
  path: { x: number; y: number }[]
) => {
  const key = `${x},${y},${h}`;
  if (!closed.has(key) || closed.get(key) === score)
    open.push({ x, y, score, h, path: [...path, { x, y }] });
};

const paths = new Set<string>();

tryPush(start[0], start[1], 0, 1, []);
let best = Infinity;
while (open.length) {
  const n: Node = open.pop();
  if (n.x === end[0] && n.y === end[1]) {
    if (n.score > best) break;
    best = n.score;
    n.path.forEach((p) => paths.add(`${p.x},${p.y}`));
  }
  closed.set(`${n.x},${n.y},${n.h}`, n.score);
  const ny = n.y + headings[n.h][1];
  const nx = n.x + headings[n.h][0];
  const cw = (n.h + 1) % 4;
  const ccw = (n.h + 3) % 4;
  if (grid[ny][nx] !== "#") tryPush(nx, ny, n.score + 1, n.h, n.path);
  tryPush(n.x, n.y, n.score + 1000, cw, n.path);
  tryPush(n.x, n.y, n.score + 1000, ccw, n.path);
}

console.log(paths.size);
