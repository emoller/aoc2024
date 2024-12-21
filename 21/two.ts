const codes = Deno.readTextFileSync("input.txt").split("\n");
const numpadmoves = new Map<string, string>();

const combos = (
  xf: number,
  yf: number,
  xt: number,
  yt: number,
  combo: string
): string => {
  if (xf === 0 && yf === 3) return "";
  if (xf === xt && yf === yt) {
    return combo + "A|";
  }
  let c = "";
  if (xf < xt) {
    c += combos(xf + 1, yf, xt, yt, combo + ">");
  } else if (xf > xt) {
    c += combos(xf - 1, yf, xt, yt, combo + "<");
  }
  if (yf < yt) {
    c += combos(xf, yf + 1, xt, yt, combo + "v");
  } else if (yf > yt) {
    c += combos(xf, yf - 1, xt, yt, combo + "^");
  }
  return c;
};

const getcombo = (from: string, to: string): string => {
  const [fcol, frow] =
    from === "A"
      ? [2, 3]
      : from === "0"
      ? [1, 3]
      : [(Number(from) - 1) % 3, 2 - Math.floor((Number(from) - 1) / 3)];
  const [tcol, trow] =
    to === "A"
      ? [2, 3]
      : to === "0"
      ? [1, 3]
      : [(Number(to) - 1) % 3, 2 - Math.floor((Number(to) - 1) / 3)];
  return combos(fcol, frow, tcol, trow, "").slice(0, -1);
};

const pad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A"];
for (const f of pad)
  for (const t of pad)
    if (f !== t) numpadmoves.set(`${f},${t}`, getcombo(f, t));

const moves = new Map<string, string>([
  ["<^", ">^"],
  ["<A", ">>^|>^>"],
  ["<v", ">"],
  ["<>", ">>"],
  ["v^", "^"],
  ["vA", ">^|^>"],
  ["v<", "<"],
  ["v>", ">"],
  [">^", "<^|^<"],
  [">A", "^"],
  [">v", "<"],
  ["><", "<<"],
  ["^<", "v<"],
  ["^A", ">"],
  ["^v", "v"],
  ["^>", "v>|>v"],
  ["A<", "v<<|<v<"],
  ["A^", "<"],
  ["Av", "v<|<v"],
  ["A>", "v"],
]);
const directional = (from: string, to: string): string[] => {
  return (moves.get(from + to) ?? "").split("|");
};

const memo = new Map<string, number>();

const expandr = (path: string, depth: number): number => {
  if (depth === 0) return path.length;

  const key = `${path},${depth}`;
  if (memo.has(key)) return memo.get(key)!;

  let res = 0;
  for (let i = 0; i < path.length; i++) {
    const d = directional(i === 0 ? "A" : path[i - 1], path[i]);
    let low = expandr(d[0] + "A", depth - 1);
    for (let j = 1; j < d.length; j++) {
      const tmp = expandr(d[j] + "A", depth - 1);
      if (tmp < low) low = tmp;
    }
    res += low;
  }

  memo.set(key, res);
  return res;
};

const getshortest = (from: string, to: string): number => {
  const paths = numpadmoves.get(`${from},${to}`)?.split("|") ?? [];

  let shortest = -1;
  for (const path of paths) {
    let len = 0;
    const tmp = expandr(path, 25);
    len += tmp;

    if (shortest === -1 || len < shortest) {
      shortest = len;
    }
  }
  return shortest;
};

let sum = 0;
for (const code of codes) {
  let last = "A";
  let len = 0;
  for (const c of code) {
    len += getshortest(last, c);
    last = c;
  }

  sum += Number(/\d+/.exec(code)![0]) * len;
}
console.log(sum);
