import { useBuilds, type Build } from "@/hooks/use-builds";
import { usePals } from "@/hooks/use-breeding";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sword, Home, Bike } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BuildsPageProps {
  category: 'combat' | 'base' | 'mount';
}

const categoryConfig = {
  combat: {
    title: "Combat Builds",
    description: "Optimize your Pals for maximum damage and survivability in battles.",
    icon: Sword,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  base: {
    title: "Base Builds",
    description: "Best passive combinations for efficient base workers.",
    icon: Home,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  mount: {
    title: "Mount Builds",
    description: "Speed and stamina optimized builds for traveling.",
    icon: Bike,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
};

function getTierColor(passiveName: string): string {
  const tier3 = ["Legend", "Lucky", "Ferocious", "Artisan", "Swift", "Flame Emperor", "Spirit Emperor", "Lord of Lightning", "Lord of the Sea", "Ice Emperor", "Earth Emperor", "Lord of the Underworld", "Divine Dragon", "Celestial Emperor"];
  const tier2 = ["Musclehead", "Burly Body", "Runner", "Work Slave", "Workaholic", "Diet Lover"];
  const tier1 = ["Brave", "Serious", "Nimble", "Hard Skin", "Hooligan", "Dainty Eater", "Positive Thinker"];
  
  if (tier3.includes(passiveName)) return "bg-amber-500/20 text-amber-300 border-amber-500/50";
  if (tier2.includes(passiveName)) return "bg-slate-400/20 text-slate-300 border-slate-400/50";
  if (tier1.includes(passiveName)) return "bg-orange-700/20 text-orange-400 border-orange-700/50";
  return "bg-muted text-muted-foreground";
}

function BuildCard({ build, pals }: { build: Build; pals: { name: string; image: string }[] }) {
  const recommendedPalImages = build.recommendedPals
    .map(name => pals.find(p => p.name === name))
    .filter(Boolean);

  return (
    <Card className="hover-elevate border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-display">{build.name}</CardTitle>
        <CardDescription>{build.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Recommended Passives</h4>
          <div className="flex flex-wrap gap-2">
            {build.passives.map((passive) => (
              <Badge 
                key={passive} 
                variant="outline" 
                className={`${getTierColor(passive)} border`}
              >
                {passive}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Best Pals</h4>
          <div className="flex flex-wrap gap-2">
            {recommendedPalImages.map((pal) => (
              <div 
                key={pal!.name} 
                className="flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={pal!.image} alt={pal!.name} />
                  <AvatarFallback className="text-xs">{pal!.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{pal!.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BuildsPage({ category }: BuildsPageProps) {
  const { data: builds = [], isLoading: isLoadingBuilds } = useBuilds(category);
  const { data: pals = [], isLoading: isLoadingPals } = usePals();
  
  const config = categoryConfig[category];
  const Icon = config.icon;

  if (isLoadingBuilds || isLoadingPals) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className={`mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${config.bgColor}`}>
          <Icon className={`h-8 w-8 ${config.color}`} />
        </div>
        <h2 className="mb-2 font-display text-3xl font-bold sm:text-4xl">
          {config.title}
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {config.description}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {builds.map((build) => (
          <BuildCard 
            key={build.name} 
            build={build} 
            pals={pals.map(p => ({ name: p.name, image: p.image }))} 
          />
        ))}
      </div>
    </div>
  );
}
