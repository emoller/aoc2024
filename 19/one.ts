const text: string = Deno.readTextFileSync("input.txt");
const sections = text.split("\n\n");
const towels = sections[0].split(", ");
const designs = sections[1].split("\n");

const memo = new Set<string>();

const exists = (design: string): boolean => {
  if (memo.has(design)) return false;
  for (const towel of towels) {
    if (design === towel) return true;
    if (design.startsWith(towel))
      if (exists(design.slice(towel.length))) return true;
  }
  memo.add(design);
  return false;
};

console.log(designs.filter(exists).length);