const text: string = Deno.readTextFileSync("input.txt");
const grid = text.split("\n");
const width = grid[0].length;
const height = grid.length;

const inside = (v: [number, number]) =>
  v[0] >= 0 && v[0] < width && v[1] >= 0 && v[1] < height;

const getNeighbours = (v: [number, number]): [number, number][] => {
  const neighbours: [number, number][] = [];
  for (const d of [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ]) {
    neighbours.push([v[0] + d[0], v[1] + d[1]]);
  }
  return neighbours;
};

const visited = new Set();

const getFencePrice = (p: [number, number]): number => {
  let area = 0;

  const edges = new Set();
  let count = 0;

  const val = grid[p[0]][p[1]];

  const queue = [p];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = current.join(",");

    if (visited.has(key)) continue;
    visited.add(key);

    area += 1;

    const neighbors = getNeighbours(current);
    for (let n = 0; n < neighbors.length; n++) {
      const neighbor = neighbors[n];
      if (!inside(neighbor) || grid[neighbor[0]][neighbor[1]] !== val) {
        count++;

        edges.add(`${n},${neighbor[0]},${neighbor[1]}`);

        for (const n2 of getNeighbours(neighbor)) {
          if (edges.has(`${n},${n2[0]},${n2[1]}`)) {
            count--;
          }
        }
      } else {
        queue.push(neighbor);
      }
    }
  }

  return area * count;
};

let sum = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!visited.has(`${x},${y}`)) {
      sum += getFencePrice([x, y]);
    }
  }
}

console.log(sum);
