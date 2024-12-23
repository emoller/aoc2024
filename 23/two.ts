const connections = Deno.readTextFileSync("input.txt")
  .split("\n")
  .map((line) => line.split("-"));

const graph = new Map<string, string[]>();

connections.forEach(([from, to]) => {
  if (!graph.has(from)) graph.set(from, []);
  if (!graph.has(to)) graph.set(to, []);
  graph.get(from)!.push(to);
  graph.get(to)!.push(from);
});

const clique = (): string[] => {
  let largest: string[] = [];
  const memo = new Map<string, string[]>();

  const visit = (current: string[], candidates: string[]): string[] => {
    const key = `${current.sort().join(",")}:${candidates.sort().join(",")}`;
    if (memo.has(key)) return memo.get(key)!;

    if (candidates.length === 0) {
      if (current.length > largest.length) {
        largest = [...current];
      }
      memo.set(key, current);
      return current;
    }

    for (const node of candidates) {
      const next = [...current, node];
      const nextcandidates = candidates.filter(
        (candidate) =>
          candidate !== node &&
          graph.get(node)!.includes(candidate) &&
          current.every((member) => graph.get(candidate)!.includes(member))
      );
      const result = visit(next, nextcandidates);
      if (result.length > largest.length) {
        largest = [...result];
      }
    }

    memo.set(key, largest);
    return largest;
  };

  const allNodes = Array.from(graph.keys());
  visit([], allNodes);
  return largest;
};

console.log(clique().sort().join(","));
