import { motion } from "framer-motion";
import { clsx } from "clsx";
import type { Pal } from "@/hooks/use-breeding";

interface PalCardProps {
  pal: Pal | null;
  className?: string;
  label?: string;
}

export function PalCard({ pal, className, label }: PalCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        "relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/50",
        className
      )}
    >
      {/* Label Badge */}
      {label && (
        <div className="absolute top-2 left-2 z-10 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-muted-foreground backdrop-blur-sm uppercase tracking-wider">
          {label}
        </div>
      )}

      {pal ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-full max-w-[180px] overflow-hidden rounded-full border-4 border-border bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner">
            <img 
              src={pal.image} 
              alt={pal.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1632516643720-e7f5d7d6ecc9?w=400&h=400&fit=crop"; 
              }}
            />
            {pal.isRare && (
              <div className="absolute inset-0 rounded-full ring-2 ring-primary/50 animate-pulse" />
            )}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold font-display text-foreground">{pal.name}</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {pal.types.map((type) => (
                <span 
                  key={type}
                  className={clsx(
                    "px-2 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wide",
                    getTypeColor(type)
                  )}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Power: <span className="text-foreground font-mono">{pal.breedingPower}</span>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 text-muted-foreground">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
            <span className="text-4xl">?</span>
          </div>
          <span className="font-medium">Select a Pal</span>
        </div>
      )}
    </motion.div>
  );
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'fire': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'water': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    case 'grass': return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'electric': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'ice': return 'bg-cyan-300/20 text-cyan-200 border border-cyan-300/30';
    case 'ground': return 'bg-amber-700/20 text-amber-600 border border-amber-700/30';
    case 'dark': return 'bg-purple-900/40 text-purple-400 border border-purple-500/30';
    case 'dragon': return 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30';
    case 'neutral': return 'bg-stone-500/20 text-stone-300 border border-stone-500/30';
    default: return 'bg-muted text-muted-foreground';
  }
}
