const text: string = Deno.readTextFileSync("input-x.txt");

const grid = text.split("\n").map((r) => r.split(""));
const width = grid[0].length;
const height = grid.length;

type Coords = [number, number][];

const regions: [number, number][] = [];

const flood = (x: number, y: number, id: string, region: Coords) => {
  if (x >= 0 && x < width && y >= 0 && y < height && grid[y][x] === id) {
    grid[y][x] = ".";
    region.push([x, y]);
    flood(x - 1, y, id, region);
    flood(x + 1, y, id, region);
    flood(x, y - 1, id, region);
    flood(x, y + 1, id, region);
  }
};

const findEdge = (region: Coords): number => {
  let maxX = -1;
  let index = -1;
  for (let i = 0; i < region.length; i++) {
    const x = region[i][0];
    if (x > maxX) {
      maxX = x;
      index = i;
    }
  }
  return index;
};

const traceEdge = (region: Coords, index: number): number => {
  const neighbours = new Map<string, number>();
  for (let i = 0; i < region.length; i++)
    neighbours.set(region[i].join(","), i);
  const hasNeighbour = (x: number, y: number): [boolean, number] => [
    neighbours.has([x, y].join(",")),
    neighbours.has([x, y].join(",")) ? neighbours.get([x, y].join(","))! : -1,
  ];
  const dirs = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ]; // S, W, N, E

  let len = 0;
  let dir = 0;
  let idx = index;
  do {
    let found = false;
    for (let j = -1; j <= 1; j++) {
      const d = (dir + j + 4) % 4;
      const [has, i] = hasNeighbour(
        region[idx][0] + dirs[d][0],
        region[idx][1] + dirs[d][1]
      );
      if (has) {
        dir = d;
        idx = i;
        found = true;
        break;
      }
    }
    if (!found) {
      dir = (dir + 1) % 4;
    }
    len++;
    if (len > 10) break;
  } while (idx !== index || dir !== 0);
  return len;
};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] !== ".") {
      const region: [number, number][] = [];
      flood(x, y, grid[y][x], region);
      const length = traceEdge(region, findEdge(region));
      regions.push([region.length, length]);
    }
  }
}

console.log(grid);
console.log(regions);
