import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BuildsPage from "@/pages/Builds";
import ReverseCalculator from "@/pages/ReverseCalculator";
import ChainBreeding from "@/pages/ChainBreeding";
import { Dna, Sword, Home as HomeIcon, Bike, Search, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Breeding", icon: Dna },
  { path: "/reverse", label: "Reverse", icon: Search },
  { path: "/chain", label: "Chain", icon: GitBranch },
  { path: "/builds/combat", label: "Combat", icon: Sword },
  { path: "/builds/base", label: "Base", icon: HomeIcon },
  { path: "/builds/mount", label: "Mount", icon: Bike },
];

function Navigation() {
  const [location] = useLocation();
  
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <Dna className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            PalWorld Companion
          </span>
        </div>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/reverse" component={ReverseCalculator} />
      <Route path="/chain" component={ChainBreeding} />
      <Route path="/builds/combat">
        {() => <BuildsPage category="combat" />}
      </Route>
      <Route path="/builds/base">
        {() => <BuildsPage category="base" />}
      </Route>
      <Route path="/builds/mount">
        {() => <BuildsPage category="mount" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
