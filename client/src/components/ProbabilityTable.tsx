import type { CalculationResponse, Passive } from "@/hooks/use-breeding";
import { PassiveBadge } from "./PassiveBadge";

interface ProbabilityTableProps {
  probabilities: CalculationResponse['probabilities'];
  allPassives: Passive[];
}

export function ProbabilityTable({ probabilities, allPassives }: ProbabilityTableProps) {
  // Sort by probability desc
  const sorted = [...probabilities].sort((a, b) => b.probability - a.probability);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card/50 shadow-lg">
      <div className="border-b border-border bg-muted/50 px-4 py-3">
        <h4 className="font-display text-lg font-bold">Inheritance Probabilities</h4>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Passives</th>
              <th className="px-4 py-2 text-right font-medium">Chance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sorted.map((row, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  {row.passives.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {row.passives.map((name) => {
                        const passive = allPassives.find(p => p.name === name);
                        if (!passive) return <span key={name} className="text-xs">{name}</span>;
                        return <PassiveBadge key={name} passive={passive} className="text-xs py-0.5" />;
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">No passives</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-primary">
                  {row.probability.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
