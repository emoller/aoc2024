const codes = Deno.readTextFileSync("input.txt").split("\n");

/*
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+  
*/

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

/*
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+
*/
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

// Get the shortest numpadmove if this is the final path
const final = (path: string): string => {
  let res = "";
  let last = "A";
  for (const p of path) {
    const dirs = directional(last, p);
    res += dirs[0] + "A";
    last = p;
  }
  return res;
};

const explore = (path: string, start: number, tfrm: string): string => {
  if (start === path.length) return final(tfrm);
  const last = start === 0 ? "A" : path[start - 1];
  const next = path[start];
  const dirs = directional(last, next);
  let shortest: string | undefined = undefined;
  for (const dir of dirs) {
    const res = explore(path, start + 1, tfrm + dir + "A");
    if (shortest === undefined || res.length < shortest.length) {
      shortest = res;
    }
  }
  return shortest!;
};

const getshortest = (from: string, to: string): string => {
  const paths = numpadmoves.get(`${from},${to}`)?.split("|") ?? [];

  let shortest: string | undefined = undefined;
  for (const path of paths) {
    const res = explore(path, 0, "");
    if (shortest === undefined || res.length < shortest.length) {
      shortest = res;
    }
  }
  return shortest!;
};

let sum = 0;
for (const code of codes) {
  let last = "A";
  let str = "";
  for (const c of code) {
    str += getshortest(last, c);
    last = c;
  }

  sum += Number(/\d+/.exec(code)![0]) * str.length;
}
console.log(sum);
