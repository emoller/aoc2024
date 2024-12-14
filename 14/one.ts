const text: string = Deno.readTextFileSync("input.txt");
const robots = text.split("\n").flatMap((line) => {
  const regexp = /p=(-*\d+),(-*\d+) v=(-*\d+),(-*\d+)/g;
  const matches: { x: number; y: number; vx: number; vy: number }[] = [];
  let match;
  while ((match = regexp.exec(line)) !== null) {
    matches.push({
      x: Number(match[1]),
      y: Number(match[2]),
      vx: Number(match[3]),
      vy: Number(match[4]),
    });
  }
  return matches;
});

const width = 101;
const height = 103;
const fhv = Math.floor(width / 2);
const chv = Math.ceil(width / 2);
const fhh = Math.floor(height / 2);
const chh = Math.ceil(height / 2);
const quadrants = [
  [0, fhv, 0, fhh],
  [chv, width, 0, fhh],
  [chv, width, chh, height],
  [0, fhv, chh, height],
];

const inside = (
  x: number,
  y: number,
  left: number,
  right: number,
  top: number,
  bottom: number
) => x >= left && x < right && y >= top && y < bottom;

for (let i = 0; i < 100; i++) {
  for (const robot of robots) {
    robot.x = (robot.x + robot.vx + width) % width;
    robot.y = (robot.y + robot.vy + height) % height;
  }
}

const numbers: number[] = [];
quadrants.forEach(([left, right, top, bottom]) => {
  numbers.push(
    robots.reduce(
      (a, r) => a + (inside(r.x, r.y, left, right, top, bottom) ? 1 : 0),
      0
    )
  );
});

console.log(numbers.reduce((a, b) => a * b));
