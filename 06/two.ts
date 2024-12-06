const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(""));
const width = res[0].length;
const height = res.length;
const headings_chars = "^>v<";
const headings = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
let start_heading = 0;
let start_y = 0;
let start_x = 0;
let found = false;
for (start_y = 0; start_y < height && !found; start_y++) {
  for (start_x = 0; start_x < width; start_x++) {
    if (headings_chars.includes(res[start_y][start_x])) {
      start_heading = headings_chars.indexOf(res[start_y][start_x]);
      found = true;
      start_y--;
      break;
    }
  }
}

let num_loops = 0;

for (let test_y = 0; test_y < height; test_y++) {
  for (let test_x = 0; test_x < width; test_x++) {
    if (res[test_y][test_x] !== ".") continue;

    const path = new Set<string>();

    let x = start_x;
    let y = start_y;
    let heading = start_heading;

    while (x >= 0 && x < width && y >= 0 && y < height) {
      const curr = headings_chars[heading] + "," + x + "," + y;
      if (path.has(curr)) {
        num_loops++;
        console.log("Loop at", test_x, test_y);
        break;
      }
      path.add(curr);

      const nx = x + headings[heading][0];
      const ny = y + headings[heading][1];
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) break;
      if (res[ny][nx] === "#" || (ny == test_y && nx == test_x)) {
        heading = (heading + 1) % 4;
      } else {
        x = nx;
        y = ny;
      }
    }
  }
}

console.log(num_loops);
