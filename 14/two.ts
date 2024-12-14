const text: string = Deno.readTextFileSync("input.txt");

type Robot = { x: number; y: number; vx: number; vy: number };

const robots = text.split("\n").flatMap((line) => {
  const regexp = /p=(-*\d+),(-*\d+) v=(-*\d+),(-*\d+)/g;
  const matches: Robot[] = [];
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

const draw = (robots: Robot[]) => {
  const img: string[] = [];
  for (let y = 0; y < height; y++) img.push(" ".repeat(width));

  for (const robot of robots) {
    img[robot.y] =
      img[robot.y].substring(0, robot.x) +
      "#" +
      img[robot.y].substring(robot.x + 1);
  }

  console.log(img.join("\n"));
};

const hasSpan = (robots: Robot[], y: number, n: number) => {
  const row: number[] = robots
    .filter((r) => r.y === y)
    .map((r) => r.x)
    .sort();
  if (row.length === 0) return false;
  let span = 0;
  let last = -100;
  for (let i = 0; i < row.length; i++) {
    if (row[i] === last + 1) {
      span++;
      last++;
      if (span === n) return true;
    } else {
      last = row[i];
      span = 1;
    }
  }
  return false;
};

let found = false;
let foundAt = 0;
for (let i = 0; !found; i++) {
  for (const robot of robots) {
    robot.x = (robot.x + robot.vx + width) % width;
    robot.y = (robot.y + robot.vy + height) % height;
  }

  for (let y = 0; y < height; y++) {
    if (
      hasSpan(robots, y, 3) &&
      hasSpan(robots, y + 1, 5) &&
      hasSpan(robots, y + 2, 7) &&
      hasSpan(robots, y + 3, 9)
    ) {
      found = true;
      foundAt = i + 1;
      break;
    }
  }
}
draw(robots);
console.log(foundAt);
