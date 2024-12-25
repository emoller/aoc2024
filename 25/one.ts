const raw = Deno.readTextFileSync("input.txt").split("\n\n");
const rawlocks = raw.filter((s) => s[0] === "#");
const rawkeys = raw.filter((s) => s[0] === ".");

const encode = (raw: string[], c: string): number[] => {
  const codes: number[] = [];
  for (const r of raw) {
    const lines = r.split("\n");
    const len = lines[0].length;
    let code = 0;
    for (let i = 0; i < len; i++) {
      const pos = Math.pow(10, len - i - 1);
      for (const line of lines) {
        if (line[i] === c) {
          code += pos;
        } else break;
      }
    }
    codes.push(code);
  }
  return codes;
};

const matches = (lock: number, key: number): boolean => {
  while (lock > 0 && key > 0) {
    const l = lock % 10;
    const k = key % 10;
    if (k < l) return false;
    lock = Math.floor(lock / 10);
    key = Math.floor(key / 10);
  }
  return true;
};

const locks = encode(rawlocks, "#");
const keys = encode(rawkeys, ".");

const pairs: [number, number][] = [];
for (const lock of locks) {
  for (const key of keys) {
    if (matches(lock, key)) {
      pairs.push([lock, key]);
    }
  }
}

console.log(pairs.length);
