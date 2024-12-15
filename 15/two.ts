const text: string = Deno.readTextFileSync("input.txt");

const sections = text.split("\n\n");
const instructions = sections[1].replace(/[\n]+/g, "");
const grid = sections[0]
  .split("\n")
  .map((line) =>
    line
      .replaceAll(".", "..")
      .replaceAll("#", "##")
      .replaceAll("O", "[]")
      .replaceAll("@", "@.")
      .split("")
  );
const width = grid[0].length;
const height = grid.length;
const headings_chars = "^>v<";
const headings = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

let ry = 0;
let rx = 0;
for (; ; ry++) {
  rx = grid[ry].findIndex((c) => c === "@");
  if (rx !== -1) {
    break;
  }
}

const canMove = (x: number, y: number, h: number): boolean => {
  if (h === 0 || h === 2) {
    const ny = y + (h === 0 ? -1 : 1);
    const next = grid[ny][x];
    if (next === "#") {
      return false;
    } else if (next === "[") {
      return canMoveBox(x, ny, h);
    } else if (next === "]") {
      return canMoveBox(x - 1, ny, h);
    }
  } else if (h === 3) {
    const left = grid[y][x - 1];
    if (left === "#") {
      return false;
    } else if (left === "]") {
      return canMoveBox(x - 2, y, h);
    }
  } else if (h === 1) {
    const right = grid[y][x + 1];
    if (right === "#") {
      return false;
    } else if (right === "[") {
      return canMoveBox(x + 1, y, h);
    }
  }
  return true;
};

const canMoveBox = (x: number, y: number, h: number): boolean => {
  if (h === 0 || h === 2) {
    const ny = y + (h === 0 ? -1 : 1);
    const left = grid[ny][x];
    const right = grid[ny][x + 1];
    if (left === "#" || right === "#") {
      return false;
    } else if (left === "[" && right === "]") {
      return canMoveBox(x, ny, h);
    } else if (left === "]" && right === "[") {
      return canMoveBox(x - 1, ny, h) && canMoveBox(x + 1, ny, h);
    } else if (left === "]") {
      return canMoveBox(x - 1, ny, h);
    } else if (right === "[") {
      return canMoveBox(x + 1, ny, h);
    }
  } else if (h === 3) {
    const left = grid[y][x - 1];
    if (left === "#") {
      return false;
    } else if (left === "]") {
      return canMoveBox(x - 2, y, h);
    }
  } else if (h === 1) {
    const right = grid[y][x + 2];
    if (right === "#") {
      return false;
    } else if (right === "[") {
      return canMoveBox(x + 2, y, h);
    }
  }
  return true;
};

const doMove = (x: number, y: number, h: number) => {
  if (h === 0 || h === 2) {
    const ny = y + (h === 0 ? -1 : 1);
    const next = grid[ny][x];
    if (next === "[") {
      doMoveBox(x, ny, h);
    } else if (next === "]") {
      doMoveBox(x - 1, ny, h);
    }
  } else if (h === 3) {
    const left = grid[y][x - 1];
    if (left === "]") {
      doMoveBox(x - 2, y, h);
    }
  } else if (h === 1) {
    const right = grid[y][x + 1];
    if (right === "[") {
      doMoveBox(x + 1, y, h);
    }
  }
  grid[y][x] = ".";
  grid[y + headings[h][1]][x + headings[h][0]] = "@";
};

const doMoveBox = (x: number, y: number, h: number) => {
  if (h === 0 || h === 2) {
    const ny = y + (h === 0 ? -1 : 1);
    const left = grid[ny][x];
    const right = grid[ny][x + 1];
    if (left === "[" && right === "]") {
      doMoveBox(x, ny, h);
    } else if (left === "]" && right === "[") {
      doMoveBox(x - 1, ny, h);
      doMoveBox(x + 1, ny, h);
    } else if (left === "]") {
      doMoveBox(x - 1, ny, h);
    } else if (right === "[") {
      doMoveBox(x + 1, ny, h);
    }
  } else if (h === 3) {
    const left = grid[y][x - 1];
    if (left === "]") {
      doMoveBox(x - 2, y, h);
    }
  } else if (h === 1) {
    const right = grid[y][x + 2];
    if (right === "[") {
      doMoveBox(x + 2, y, h);
    }
  }
  grid[y][x] = ".";
  grid[y][x + 1] = ".";
  grid[y + headings[h][1]][x + headings[h][0]] = "[";
  grid[y + headings[h][1]][x + headings[h][0] + 1] = "]";
};

//let step = 0;

// function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

for (const instr of instructions) {
  // await sleep(25);
  // console.log(`step ${step} ${instr}`);
  // step++;
  // const tmp = Array.from(grid);
  // tmp[ry][rx] = instr;
  // console.log(tmp.map((line) => line.join("")).join("\n"));
  const heading = headings_chars.indexOf(instr);
  if (canMove(rx, ry, heading)) {
    doMove(rx, ry, heading);
    rx += headings[heading][0];
    ry += headings[heading][1];
  }
}

let sum = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (grid[y][x] == "[") {
      sum += y * 100 + x;
    }
  }
}

//console.log(grid.map((line) => line.join("")).join("\n"));
console.log(sum);
