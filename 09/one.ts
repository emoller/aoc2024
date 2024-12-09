const text: string = Deno.readTextFileSync("input.txt");
const res = text.split("").map(Number);

type Block = { id: number; pos: number; len: number };

const compact = (blocks: Block[]): boolean =>
  blocks.reduce((a, b) => a + b.len, 0) ===
  blocks[blocks.length - 1].pos + blocks[blocks.length - 1].len;

const generate = (res: number[]): Block[] => {
  const b: Block[] = [];
  let free = false;
  let id = 0;
  let pos = 0;
  while (res.length > 0) {
    const p = res.shift()!;
    if (!free) {
      b.push({ id, pos, len: p });
      id++;
    }
    pos += p;
    free = !free;
  }
  return b;
};

let freeCache = 0;

const findFreeBlock = (blocks: Block[]): [number, number, number] => {
  for (let i = freeCache; i < blocks.length - 1; i++) {
    const end = blocks[i].pos + blocks[i].len;
    const flen = blocks[i + 1].pos - end;
    if (flen > 0) {
      freeCache = i;
      return [end, flen, i];
    }
  }
  return [
    blocks[blocks.length - 1].pos + blocks[blocks.length - 1].len,
    1000,
    blocks.length - 1,
  ];
};

const insert = (blocks: Block[], block: Block) => {
  while (block.len > 0) {
    const [pos, len, idx] = findFreeBlock(blocks);
    const slen = Math.min(len, block.len);
    blocks.splice(idx + 1, 0, { id: block.id, pos, len: slen });
    block.len -= slen;
  }
};

const blocks: Block[] = generate(res);

while (!compact(blocks)) {
  const block = blocks.pop()!;
  insert(blocks, block);
}

let sum = 0;
for (let i = 0; i < blocks.length; i++) {
  for (let j = 0; j < blocks[i].len; j++) {
    sum += (blocks[i].pos + j) * blocks[i].id;
  }
}

console.log(sum);
