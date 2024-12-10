const text: string = Deno.readTextFileSync("input.txt");

const grid = text.split("\n").map((r) => r.split(""));
const width = grid[0].length;
const height = grid.length;

const inside = (x: number, y: number) =>
  x >= 0 && x < width && y >= 0 && y < height;

const getTrailCount = (x: number, y: number): number => {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  type Node = { x: number; y: number; v: number };
  const queue: Node[] = [{ x, y, v: 0 }];
  const nines = new Set<string>();
  while (queue.length > 0) {
    const { x, y, v } = queue.shift()!;
    if (v === 9) {
      nines.add(`${x},${y}`);
      continue;
    }
    dirs.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (inside(nx, ny) && grid[ny][nx] === (v + 1).toString()) {
        queue.push({ x: nx, y: ny, v: v + 1 });
      }
    });
  }
  return nines.size;
};

let sum = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] === "0") {
      sum += getTrailCount(x, y);
    }
  }
}

console.log(sum);
