const text: string = Deno.readTextFileSync("input.txt");
const sections = text.split("\n\n");
const towels = sections[0].split(", ");
const designs = sections[1].split("\n");

const memo = new Map<string, number>();

const exists = (design: string): number => {
  if (memo.has(design)) return memo.get(design)!;
  let alts = 0;
  for (const towel of towels) {
    if (design === towel) alts++;
    if (design.startsWith(towel)) alts += exists(design.slice(towel.length));
  }
  memo.set(design, alts);
  return alts;
};

console.log(designs.reduce((a, b) => a + exists(b), 0));
