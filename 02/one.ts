const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(" ").map(Number));
const diff = res.map((r) =>
  r.map((n, i) => (i == 0 ? 0 : n - r[i - 1])).slice(1)
);

diff.forEach((a, i) => {
  if (a[0] < 0) {
    diff[i] = a.map((e) => e * -1);
  }
});

const ok = diff.filter((n) => n.every((e) => 0 < e && e < 4)).length;

console.log(ok);
