const text: string = Deno.readTextFileSync("input.txt");
const machines = text.split("\n\n").map((machine) =>
  machine.split("\n").flatMap((line) => {
    const regexp = /X[+=]?(\d+),\s*Y[+=]?(\d+)/g;
    const matches: [number, number][] = [];
    let match;
    while ((match = regexp.exec(line)) !== null) {
      matches.push([Number(match[1]), Number(match[2])]);
    }
    return matches;
  })
);

// A * x + B * y = C
// D * x + E * y = F

// x = (B * F − E * C) / (B * D − E * A)
// y = (C − A * x) / B
const cost = machines.reduce((a, m) => {
  const [A, D] = m[0];
  const [B, E] = m[1];
  const [C, F] = m[2];

  const denom = B * D - E * A;
  const nomA = B * F - E * C;

  if (denom === 0 || nomA % denom) return a + 0;

  const x = nomA / denom;

  if ((C - A * x) % B) return a + 0;
  const y = (C - A * x) / B;

  return a + x * 3 + y;
}, 0);

console.log(cost);
