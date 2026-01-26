export function calculateChances(parentA, parentB, passives) {
  const slots = 4;
  const inheritChance = 0.5;
  const randomChance = 0.35;
  const emptyChance = 0.15;

  const combined = [...parentA, ...parentB];
  const unique = [...new Set(combined)];

  const results = {};

  unique.forEach(p => {
    const count = combined.filter(x => x === p).length;
    const base = passives.find(x => x.name === p)?.weight || 0;
    const boosted = base * (count === 2 ? 1.5 : 1);
    results[p] = ((boosted / unique.reduce((s,u)=>{
      const c = combined.filter(x=>x===u).length;
      const b = passives.find(x=>x.name===u)?.weight||0;
      return s + (b * (c===2?1.5:1));
    },0)) * inheritChance * slots * 100).toFixed(1);
  });

  return results;
}