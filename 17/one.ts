const text: string = Deno.readTextFileSync("input.txt");

const match =
  /Register A: (\d+)\s*Register B: (\d+)\s*Register C: (\d+)\s*Program: ([\d,]+)/.exec(
    text
  )!;
let A = Number(match[1]);
let B = Number(match[2]);
let C = Number(match[3]);
const program = match[4].split(",").map(Number);

console.log(`A: ${A}\nB: ${B}\nC: ${C}\n${program}`);

const combo = (op: number) => (op === 4 ? A : op === 5 ? B : op === 6 ? C : op);

let out = "";

for (let ip = 0; ip < program.length; ) {
  const opcode = program[ip];
  const lit = program[ip + 1];
  const com = combo(lit);
  switch (opcode) {
    case 0:
      A = Math.trunc(A / Math.pow(2, com));
      break;
    case 1:
      B = B ^ lit;
      break;
    case 2:
      B = com % 8;
      break;
    case 3:
      if (A !== 0) {
        ip = lit;
        continue;
      }
      break;
    case 4:
      B = B ^ C;
      break;
    case 5:
      out += `${com % 8},`;
      break;
    case 6:
      B = Math.trunc(A / Math.pow(2, com));
      break;
    case 7:
      C = Math.trunc(A / Math.pow(2, com));
      break;
  }
  ip += 2;
}

console.log(out.slice(0, -1));
