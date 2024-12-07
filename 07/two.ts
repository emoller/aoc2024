const text: string = Deno.readTextFileSync("input.txt");

const res = text
  .split("\n")
  .map((r) => r.replaceAll(":", "").split(" ").map(Number));

const check = (a: number[]): boolean => {
  const target = a[0];
  const left: { sum: number; pos: number }[] = [{ sum: a[1], pos: 2 }];
  while (left.length) {
    const { sum, pos } = left.shift()!;
    if (sum === target && pos === a.length) return true;
    if (pos >= a.length || sum > target) continue;
    left.push({ sum: sum + a[pos], pos: pos + 1 });
    left.push({ sum: sum * a[pos], pos: pos + 1 });
    left.push({
      sum: sum * Math.pow(10, Math.floor(Math.log10(a[pos])) + 1) + a[pos],
      pos: pos + 1,
    });
  }
  return false;
};

const calibration = res.filter(check).reduce((a, b) => a + b[0], 0);

console.log(calibration);
