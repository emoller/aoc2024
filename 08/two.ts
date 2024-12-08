const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(""));
const width = res[0].length;
const height = res.length;
const inside = (x: number, y: number) =>
  x >= 0 && x < width && y >= 0 && y < height;

const antinodes: { x: number; y: number }[] = [];
const antennas: { [key: string]: { x: number; y: number }[] } = {};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (/[a-zA-Z0-9]/.test(res[y][x])) {
      if (antennas[res[y][x]]) {
        antennas[res[y][x]].forEach((antenna) => {
          const diffx = antenna.x - x;
          const diffy = antenna.y - y;
          let n = 0;
          while (inside(antenna.x + n * diffx, antenna.y + n * diffy)) {
            antinodes.push({
              x: antenna.x + n * diffx,
              y: antenna.y + n * diffy,
            });
            n++;
          }
          n = 0;
          while (inside(x - n * diffx, y - n * diffy)) {
            antinodes.push({ x: x - n * diffx, y: y - n * diffy });
            n++;
          }
        });
      } else {
        antennas[res[y][x]] = [];
      }
      antennas[res[y][x]].push({ x, y });
    }
  }
}

const unique = Array.from(new Set(antinodes.map((n) => `${n.x},${n.y}`)));

console.log(unique.length);
