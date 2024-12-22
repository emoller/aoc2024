const seeds = Deno.readTextFileSync("input.txt").split("\n").map(BigInt);

const rnd = (s: bigint): bigint => {
  s = (s ^ (s * 64n)) % 16777216n;
  s = ((s / 32n) ^ s) % 16777216n;
  s = (s ^ (s * 2048n)) % 16777216n;
  return s;
};

const bananas = new Map<string, number[]>();

seeds.forEach((s) => {
  const closed = new Set<string>();
  const diffs: number[] = [];

  for (let i = 0; i < 2000; i++) {
    const next = rnd(s);
    diffs.push(Number((next % 10n) - (s % 10n)));
    s = next;

    if (diffs.length === 4) {
      const key = diffs.join(",");
      if (!closed.has(key)) {
        if (!bananas.has(key)) bananas.set(key, []);
        bananas.get(key)!.push(Number(next % 10n));
        closed.add(key);
      }
      diffs.shift();
    }
  }
});

let best = -1;
for (const range of bananas.values()) {
  best = Math.max(
    best,
    range.reduce((a, b) => a + b)
  );
}

console.log(best);
