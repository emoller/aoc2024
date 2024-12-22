const seeds = Deno.readTextFileSync("input.txt").split("\n").map(BigInt);

const rnd = (s: bigint): bigint => {
  s = (s ^ (s * 64n)) % 16777216n;
  s = ((s / 32n) ^ s) % 16777216n;
  s = (s ^ (s * 2048n)) % 16777216n;
  return s;
};

let sum = 0n;
seeds.forEach((s) => {
  for (let i = 0; i < 2000; i++) {
    s = rnd(s);
  }
  sum += s;
});

console.log(sum);
