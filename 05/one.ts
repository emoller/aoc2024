const text: string = Deno.readTextFileSync("input.txt");
const res = text.split("\n\n");
const rules = res[0].split("\n").map((rule) => rule.split("|").map(Number));
const updates = res[1].split("\n").map((u) => u.split(",").map(Number));

let sum = 0;

for (let i = 0; i < updates.length; i++) {
  const update = updates[i];
  let valid = true;
  for (let j = 0; j < update.length && valid; j++) {
    for (let k = 0; k < rules.length && valid; k++) {
      const rule = rules[k];
      if (rule[0] == update[j]) {
        for (let l = j; l >= 0; l--) {
          if (update[l] == rule[1]) {
            valid = false;
            break;
          }
        }
      }
    }
  }
  if (valid) {
    sum += update[Math.floor(update.length / 2)];
  }
}

console.log(sum);
