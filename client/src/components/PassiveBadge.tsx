import { clsx } from "clsx";
import type { Passive } from "@/hooks/use-breeding";
import { X } from "lucide-react";

interface PassiveBadgeProps {
  passive: Passive;
  onRemove?: () => void;
  className?: string;
}

export function PassiveBadge({ passive, onRemove, className }: PassiveBadgeProps) {
  const tierClass = getTierClass(passive.tier);

  return (
    <div 
      className={clsx(
        "flex items-center gap-2 rounded-md border px-2 py-1 text-sm font-medium transition-all",
        tierClass,
        className
      )}
    >
      <span>{passive.name}</span>
      {onRemove && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-1 rounded-full p-0.5 hover:bg-black/20 focus:outline-none"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function getTierClass(tier: number | null): string {
  if (tier === null) return "bg-muted text-muted-foreground border-border";
  if (tier >= 3) return "tier-rainbow"; // Legend, etc.
  if (tier === 2) return "tier-gold";   // Gold traits
  if (tier === 1) return "tier-silver"; // Silver traits
  if (tier < 0) return "tier-red";      // Negative traits
  return "bg-secondary/10 text-secondary-foreground border-secondary/20";
}
