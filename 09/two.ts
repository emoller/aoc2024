const text: string = Deno.readTextFileSync("input.txt");
const res = text.split("").map(Number);

type Block = { id: number; pos: number; len: number };

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

// const getString = (blocks: Block[]): string => {
//   let str = "";
//   for (let i = 0; i < blocks.length; i++) {
//     const num = blocks[i].pos - str.length;
//     if (num > 0) str += ".".repeat(num);
//     str += blocks[i].id.toString(16).repeat(blocks[i].len);
//   }
//   return str;
// };

const findFreeBlock = (blocks: Block[], b: Block): [number, number] => {
  for (let i = 0; i < blocks.length - 1; i++) {
    const end = blocks[i].pos + blocks[i].len;
    const flen = blocks[i + 1].pos - end;
    if (flen >= b.len) {
      return [end + b.len > b.pos ? b.pos : end, i];
    }
  }
  const end = blocks[blocks.length - 1].pos + blocks[blocks.length - 1].len;
  return [end + b.len > b.pos ? b.pos : end, blocks.length - 1];
};

const insert = (blocks: Block[], block: Block) => {
  const [pos, idx] = findFreeBlock(blocks, block);
  blocks.splice(idx + 1, 0, { id: block.id, pos, len: block.len });
};

const blocks: Block[] = generate(res);
// console.log(getString(blocks));

let blockId = blocks[blocks.length - 1].id;
while (blockId > 0) {
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].id === blockId) {
      const block = blocks.splice(i, 1)[0];
      insert(blocks, block);
      break;
    }
  }
  blockId--;
  // console.log(getString(blocks));
}

let sum = 0;
for (let i = 0; i < blocks.length; i++) {
  for (let j = 0; j < blocks[i].len; j++) {
    sum += (blocks[i].pos + j) * blocks[i].id;
  }
}

// console.log(getString(blocks));
console.log(sum);
