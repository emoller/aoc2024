const text: string = Deno.readTextFileSync("input.txt");

const res = text.split("\n").map((r) => r.split(" ").map(Number));

const check = (r: number[]) => {
  let diff = r.map((n, i) => (i == 0 ? 0 : n - r[i - 1])).slice(1);
  if (diff[0] < 0) {
    diff = diff.map((e) => e * -1);
  }
  return diff.every((e) => 0 < e && e < 4);
};

let ok = 0;

for (let j = 0; j < res.length; j++) {
  const r = res[j];

  if (check(r)) {
    ok++;
    continue;
  }
  let done = false;
  for (let i = 0; i < r.length && !done; i++) {
    const n = [...r.slice(0, i), ...r.slice(i + 1)];
    if (check(n)) {
      ok++;
      done = true;
    }
  }
}

console.log(ok);
