const text: string = Deno.readTextFileSync("input.txt");

const match =
  /Register A: (\d+)\s*Register B: (\d+)\s*Register C: (\d+)\s*Program: ([\d,]+)/.exec(
    text
  )!;
const Bx = BigInt(match[2]);
const Cx = BigInt(match[3]);
const program = match[4].split(",").map(BigInt);

const run = (Ax: bigint): bigint[] => {
  let A = Ax;
  let B = Bx;
  let C = Cx;

  const combo = (op: bigint) =>
    op === 4n ? A : op === 5n ? B : op === 6n ? C : op;

  const out: bigint[] = [];

  for (let ip = 0; ip < program.length; ) {
    const opcode = program[ip];
    const lit = program[ip + 1];
    const com = combo(lit);

    switch (opcode) {
      case 0n:
        A = A / 2n ** com;
        break;
      case 1n:
        B = B ^ lit;
        break;
      case 2n:
        B = com % 8n;
        break;
      case 3n:
        if (A !== 0n) {
          ip = Number(lit);
          continue;
        }
        break;
      case 4n:
        B = B ^ C;
        break;
      case 5n:
        out.push(com % 8n);
        break;
      case 6n:
        B = A / 2n ** com;
        break;
      case 7n:
        C = A / 2n ** com;
        break;
    }
    ip += 2;
  }
  return out;
};

const findA = (nextVal = 0n, i = program.length - 1): bigint => {
  if (i < 0) return nextVal;
  for (let aVal = nextVal << 3n; aVal < (nextVal << 3n) + 8n; aVal++) {
    const out = run(aVal);
    if (out[0] === program[i]) {
      const finalVal = findA(aVal, i - 1);
      if (finalVal >= 0) return finalVal;
    }
  }
  return -1n;
};

const a = findA();
console.log(a);
