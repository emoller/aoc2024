import TinyQueue from "https://esm.sh/tinyqueue@3.0.0";

const text: string = Deno.readTextFileSync("input.txt");
const lines = text.split("\n");
const width = 71;
const height = 71;
let ram = 1;
let found = true;

while (found) {
  const closed = new Set<string>();
  lines.map((line, i) => {
    if (i < ram) closed.add(line);
  });
  const headings = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  type Node = { x: number; y: number; cost: number; path: [number, number][] };
  const open = new TinyQueue<Node>([], (a, b) => a.cost - b.cost);
  open.push({ x: 0, y: 0, cost: 0, path: [[0, 0]] });
  const target = [width - 1, height - 1];

  found = false;
  while (open.length > 0) {
    const current = open.pop()!;
    if (current.x === target[0] && current.y === target[1]) {
      found = true;
      break;
    }
    for (const heading of headings) {
      const x = current.x + heading[0];
      const y = current.y + heading[1];
      if (x < 0 || y < 0 || x >= width || y >= height) {
        continue;
      }
      if (closed.has(`${x},${y}`)) {
        continue;
      }
      closed.add(`${x},${y}`);
      open.push({
        x,
        y,
        cost: current.cost + 1,
        path: [...current.path, [x, y]],
      });
    }
  }
  if (found) ram++;
}

console.log(lines[ram - 1]);
