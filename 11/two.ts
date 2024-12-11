const text: string = Deno.readTextFileSync("input.txt");

const stones = text.split(" ").map(Number);

const numDigs = (n: number): number => Math.floor(Math.log10(n)) + 1;

const cache = new Map<string, number>();

const evolve = (stone: number, depth: number): number => {
  if (depth === 0) {
    return 1;
  } else {
    const key = `${stone},${depth}`;
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    let result: number;
    if (stone === 0) {
      result = evolve(1, depth - 1);
    } else if (numDigs(stone) % 2 === 0) {
      const cut = Math.pow(10, numDigs(stone) / 2);
      const left = Math.floor(stone / cut);
      const right = stone % cut;
      result = evolve(left, depth - 1) + evolve(right, depth - 1);
    } else {
      result = evolve(stone * 2024, depth - 1);
    }
    cache.set(key, result);
    return result;
  }
};

console.log(stones.reduce((acc, stone) => acc + evolve(stone, 75), 0));
