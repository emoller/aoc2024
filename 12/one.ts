const text: string = Deno.readTextFileSync("input.txt");

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

const getExternal = (region: Coords): Coords => {
  let minX = region[0][0];
  let maxX = region[0][0];
  let minY = region[0][1];
  let maxY = region[0][1];

  region.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  minX--;
  maxX++;
  minY--;
  maxY++;

  const regionSet = new Set(region.map(([x, y]) => `${x},${y}`));
  const visited = new Set<string>();
  const external: Coords = [];

  const floodFill = (x: number, y: number) => {
    const key = `${x},${y}`;
    if (visited.has(key) || x < minX || x > maxX || y < minY || y > maxY)
      return;

    visited.add(key);
    if (regionSet.has(key)) external.push([x, y]);

    floodFill(x, y + 1);
    floodFill(x - 1, y);
    floodFill(x, y - 1);
    floodFill(x + 1, y);
  };

  floodFill(minX, minY);

  return external;
};

const countEdges = (region: Coords): number => {
  const neighbours = new Map<string, number>();
  for (let i = 0; i < region.length; i++)
    neighbours.set(region[i].join(","), i);
  const dirs = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];

  let perimeter = 0;

  for (const [x, y] of region) {
    for (const [dx, dy] of dirs) {
      const neighbor = [x + dx, y + dy].join(",");
      if (!neighbours.has(neighbor)) {
        perimeter++;
      }
    }
  }

  return perimeter;
};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] !== ".") {
      const region: [number, number][] = [];
      flood(x, y, grid[y][x], region);
      const external = getExternal(region);
      const length = countEdges(external);
      regions.push([region.length, length]);
    }
  }
}

console.log(regions.reduce((a, v) => a + v[0] * v[1], 0));
