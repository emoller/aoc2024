import TinyQueue from "https://esm.sh/tinyqueue@3.0.0";

const raw = Deno.readTextFileSync("input.txt");
const map = raw.split("\n");
const S = raw.indexOf("S");
const E = raw.indexOf("E");
const sx = S % (map[0].length + 1);
const sy = Math.floor(S / (map[0].length + 1));
const ex = E % (map[0].length + 1);
const ey = Math.floor(E / (map[0].length + 1));
const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const closed = new Map<string, number>();
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[0].length; x++) {
    if (map[y][x] === "#") {
      closed.set(`${x},${y}`, 1000000000);
    }
  }
}

type Node = { x: number; y: number; cost: number; path: [number, number][] };

const open = new TinyQueue<Node>([], (a, b) => a.cost - b.cost);
let path: [number, number][] | undefined = undefined;
open.push({ x: ex, y: ey, cost: 0, path: [[ex, ey]] });
while (open.length > 0) {
  const curr = open.pop()!;
  if (curr.x === sx && curr.y === sy && path === undefined) {
    path = curr.path;
  }
  closed.set(`${curr.x},${curr.y}`, curr.cost);
  for (const [dx, dy] of dirs) {
    const nx = curr.x + dx;
    const ny = curr.y + dy;
    if (!closed.has(`${nx},${ny}`)) {
      open.push({
        x: nx,
        y: ny,
        cost: curr.cost + 1,
        path: [...curr.path, [nx, ny]],
      });
    }
  }
}

let num = 0;

const candidates: [number, number][] = [];
for (let y = -20; y <= 20; y++) {
  for (let x = -20; x <= 20; x++) {
    if (Math.abs(x) + Math.abs(y) <= 20) {
      candidates.push([x, y]);
    }
  }
}

path = path!.reverse();
for (let i = 0; i < path.length; i++) {
  const [x, y] = path[i];
  const ps = closed.get(`${x},${y}`)!;
  for (const [dx, dy] of candidates) {
    const nx = x + dx;
    const ny = y + dy;
    if (closed.has(`${nx},${ny}`)) {
      const s = closed.get(`${nx},${ny}`)!;
      const diff = s - ps + Math.abs(dx) + Math.abs(dy);
      if (diff <= -100) {
        num++;
      }
    }
  }
}

console.log(num);
