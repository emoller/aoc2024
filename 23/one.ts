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

const triples = (names: string[]): string[] => {
  const res = new Set<string>();
  for (const name of names) {
    const neighbors = graph.get(name) || [];
    for (const neighbor1 of neighbors) {
      const neighborsOfNeighbor1 = graph.get(neighbor1) || [];
      for (const neighbor2 of neighborsOfNeighbor1) {
        if (neighbor2 === name) continue;
        if (neighbors.includes(neighbor2)) {
          const triangle = [name, neighbor1, neighbor2].sort().join(",");
          res.add(triangle);
        }
      }
    }
  }
  return Array.from(res);
};

const names = Array.from(graph.keys());
const trips = triples(names.filter((name) => name[0] === "t")).length;
console.log(trips);
