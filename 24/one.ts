const sections = Deno.readTextFileSync("input.txt").split("\n\n");

enum Op {
  OR,
  AND,
  XOR,
  CONST,
}
type Gate = { op: Operation; inputs?: string[]; value?: boolean };
const gates = new Map<string, Gate>();

sections[0].split("\n").forEach((line) => {
  const name = line.split(":")[0];
  const value = line.split(":")[1].trim() === "1";
  gates.set(name, {
    op: Op.CONST,
    value,
  });
});

sections[1].split("\n").forEach((line) => {
  const [input, output] = line.split(" -> ");
  const inputs = input.split(" ");
  gates.set(output, {
    op: inputs[1] === "AND" ? Op.AND : inputs[1] === "OR" ? Op.OR : Op.XOR,
    inputs: [inputs[0], inputs[2]],
  });
});

const execute = (gate: string): boolean => {
  const g = gates.get(gate)!;
  if (g.op === Op.CONST) {
    return g.value!;
  } else {
    const left = execute(g.inputs![0]);
    const right = execute(g.inputs![1]);
    const result =
      g.op === Op.AND
        ? left && right
        : g.op === Op.OR
        ? left || right
        : left !== right;
    g.value = result;
    return result;
  }
};

let number = 0n;
for (let i = 0n; i < 99n; i++) {
  const key = `z${i.toString().padStart(2, "0")}`;
  const gate = gates.get(key);
  if (!gate) break;
  number = number | ((execute(key) ? 1n : 0n) << i);
}

console.log(number);
