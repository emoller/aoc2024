const sections = Deno.readTextFileSync("input.txt").split("\n\n");

type Gate = { op: string; inputs?: string[]; value?: boolean };
const gates = new Map<string, Gate>();

sections[0].split("\n").forEach((line) => {
  const name = line.split(":")[0];
  const value = line.split(":")[1].trim() === "1";
  gates.set(name, {
    op: "CONST",
    value,
  });
});

sections[1].split("\n").forEach((line) => {
  const [input, output] = line.split(" -> ");
  const inputs = input.split(" ");
  gates.set(output, {
    op: inputs[1],
    inputs: [inputs[0], inputs[2]],
  });
});

const allgates = Array.from(gates.keys());
const xs = allgates
  .filter((k) => k.startsWith("x"))
  .sort()
  .reverse();
const ys = allgates
  .filter((k) => k.startsWith("y"))
  .sort()
  .reverse();
const zs = allgates
  .filter((k) => k.startsWith("z"))
  .sort()
  .reverse();

const candidates = ["hnd", "bks", "tdv", "z09", "z16", "z23", "nrn", "tjp"];
const swapMap = new Map<string, string>();

const execute = (gate: string): boolean => {
  const effectiveGate = swapMap.has(gate) ? swapMap.get(gate)! : gate;
  const g = gates.get(effectiveGate)!;
  if (g.op === "CONST") {
    return g.value!;
  } else {
    const left = execute(g.inputs![0]);
    const right = execute(g.inputs![1]);
    return g.op === "AND"
      ? left && right
      : g.op === "OR"
      ? left || right
      : left !== right;
  }
};

const reset = () => {
  gates.forEach((gate) => {
    if (gate.op !== "CONST") {
      gate.value = undefined;
    }
  });
  swapMap.clear();
};

const validate = (): boolean => {
  const x = parseInt(xs.map((k) => (execute(k) ? "1" : "0")).join(""), 2);
  const y = parseInt(ys.map((k) => (execute(k) ? "1" : "0")).join(""), 2);
  const z = parseInt(zs.map((k) => (execute(k) ? "1" : "0")).join(""), 2);

  return z === x + y;
};

const makepairs = (arr: string[]): [string, string][] => {
  const pairs: [string, string][] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
};

const findswaps = () => {
  const pairs = makepairs(candidates);

  const stack: {
    depth: number;
    start: number;
    currentSwaps: [string, string][];
  }[] = [{ depth: 0, start: 0, currentSwaps: [] }];

  while (stack.length > 0) {
    const { depth, start, currentSwaps } = stack.pop()!;

    if (depth === 4) {
      reset();
      for (const [a, b] of currentSwaps) {
        swapMap.set(a, b);
        swapMap.set(b, a);
      }

      const swaps = `${currentSwaps
        .map(([a, b]) => `${a} <-> ${b}`)
        .join(", ")}`;
      //console.log(swaps);
      if (swaps.includes("bks <-> tdv")) continue;
      const isValid = validate();

      if (isValid) {
        console.log(
          `valid: ${currentSwaps.map(([a, b]) => `${a} <-> ${b}`).join(", ")}`
        );
        return;
      }
      continue;
    }

    for (let i = start; i < pairs.length; i++) {
      stack.push({
        depth: depth + 1,
        start: i + 1,
        currentSwaps: [...currentSwaps, pairs[i]],
      });
    }
  }
};

findswaps();

const graphviz = (): string => {
  const graph = ["digraph RippleCarryAdder {"];
  for (const [gateName, gate] of gates.entries()) {
    const effectiveGate = swapMap.has(gateName)
      ? swapMap.get(gateName)!
      : gateName;
    const effectiveGateObj = gates.get(effectiveGate)!;

    graph.push(
      `  "${gateName}" [label="${effectiveGate}\\n(${effectiveGateObj.op})"];`
    );

    if (effectiveGateObj.inputs) {
      for (const input of effectiveGateObj.inputs) {
        const effectiveInput = swapMap.has(input) ? swapMap.get(input)! : input;
        graph.push(`  "${effectiveInput}" -> "${gateName}";`);
      }
    }
  }
  graph.push("}");
  return graph.join("\n");
};

Deno.writeTextFileSync("global_graph_fix.dot", graphviz());

console.log(candidates.sort().join(","));
