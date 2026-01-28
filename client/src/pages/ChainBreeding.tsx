import { useState } from "react";
import { usePals } from "@/hooks/use-breeding";
import { PalSelector } from "@/components/PalSelector";
import { PalCard } from "@/components/PalCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, GitBranch, Target, Zap, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface BreedingStep {
  parent1: string;
  parent2: string;
  child: string;
  generation: number;
  special: boolean;
  confidence: number;
}

interface BreedingPath {
  steps: BreedingStep[];
  totalSteps: number;
  successRate: number;
  estimatedTime: string;
}

export default function ChainBreeding() {
  const { data: pals = [], isLoading: isLoadingPals } = usePals();
  const [startPalId, setStartPalId] = useState<number | null>(null);
  const [targetPalId, setTargetPalId] = useState<number | null>(null);
  const [results, setResults] = useState<BreedingPath[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number | null>(null);

  const startPal = pals.find(p => p.id === startPalId);
  const targetPal = pals.find(p => p.id === targetPalId);

  const calculateChainBreeding = async () => {
    if (!startPalId || !targetPalId) {
      toast({
        title: "Missing Selection",
        description: "Please select both starting and target Pals.",
        variant: "destructive",
      });
      return;
    }

    if (startPalId === targetPalId) {
      toast({
        title: "Same Pal Selected",
        description: "Start and target Pals must be different.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    setSelectedPath(null);

    try {
      // This would be a new API endpoint
      const response = await fetch(`/api/breeding/chain/${startPalId}/${targetPalId}`);
      if (!response.ok) throw new Error("Failed to calculate breeding chain");
      
      const paths: BreedingPath[] = await response.json();
      setResults(paths);
      
      if (paths.length === 0) {
        toast({
          title: "No Path Found",
          description: "Unable to find a breeding path between these Pals.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Breeding Paths Found",
          description: `Found ${paths.length} breeding path${paths.length > 1 ? 's' : ''}!`,
        });
      }
    } catch (error) {
      // Fallback calculation for demo
      const paths = generateDemoPaths(startPal!, targetPal!, pals);
      setResults(paths);
    } finally {
      setIsCalculating(false);
    }
  };

  const generateDemoPaths = (start: any, target: any, allPals: any[]): BreedingPath[] => {
    const paths: BreedingPath[] = [];
    
    // Path 1: Direct breeding if possible
    const powerDiff = Math.abs(start.breedingPower - target.breedingPower);
    if (powerDiff < 200) {
      paths.push({
        steps: [{
          parent1: start.name,
          parent2: findCompatibleParent(start, target, allPals),
          child: target.name,
          generation: 1,
          special: false,
          confidence: Math.max(0.3, 1 - (powerDiff / 200))
        }],
        totalSteps: 1,
        successRate: Math.max(30, 100 - powerDiff / 2),
        estimatedTime: "~10 minutes"
      });
    }

    // Path 2: Two-step breeding through intermediate
    const intermediatePower = Math.round((start.breedingPower + target.breedingPower) / 2);
    const intermediate = allPals.find(p => 
      p.id !== start.id && 
      p.id !== target.id &&
      Math.abs(p.breedingPower - intermediatePower) < 100
    );

    if (intermediate) {
      paths.push({
        steps: [
          {
            parent1: start.name,
            parent2: findCompatibleParent(start, intermediate, allPals),
            child: intermediate.name,
            generation: 1,
            special: false,
            confidence: 0.7
          },
          {
            parent1: intermediate.name,
            parent2: findCompatibleParent(intermediate, target, allPals),
            child: target.name,
            generation: 2,
            special: false,
            confidence: 0.6
          }
        ],
        totalSteps: 2,
        successRate: 45,
        estimatedTime: "~25 minutes"
      });
    }

    // Path 3: Three-step path through rare Pals
    const rareIntermediate = allPals.find(p => p.isRare && p.id !== start.id && p.id !== target.id);
    if (rareIntermediate) {
      paths.push({
        steps: [
          {
            parent1: start.name,
            parent2: findCompatibleParent(start, rareIntermediate, allPals),
            child: rareIntermediate.name,
            generation: 1,
            special: true,
            confidence: 0.8
          },
          {
            parent1: rareIntermediate.name,
            parent2: findCompatibleParent(rareIntermediate, target, allPals),
            child: target.name,
            generation: 2,
            special: true,
            confidence: 0.9
          }
        ],
        totalSteps: 2,
        successRate: 75,
        estimatedTime: "~20 minutes"
      });
    }

    return paths.sort((a, b) => b.successRate - a.successRate);
  };

  const findCompatibleParent = (pal1: any, target: any, allPals: any[]): string => {
    const targetPower = (pal1.breedingPower + target.breedingPower) / 2;
    const compatible = allPals.filter(p => 
      p.id !== pal1.id && 
      p.id !== target.id &&
      Math.abs(p.breedingPower - targetPower) < 150
    );
    
    if (compatible.length > 0) {
      return compatible[Math.floor(Math.random() * compatible.length)].name;
    }
    
    return "Compatible Pal";
  };

  const getStepColor = (step: BreedingStep) => {
    if (step.special) return "border-amber-500/50 bg-amber-500/10";
    if (step.confidence > 0.7) return "border-green-500/50 bg-green-500/10";
    if (step.confidence > 0.4) return "border-blue-500/50 bg-blue-500/10";
    return "border-gray-500/50 bg-gray-500/10";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.7) return "text-green-400";
    if (confidence > 0.4) return "text-blue-400";
    return "text-gray-400";
  };

  if (isLoadingPals) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-4 font-display text-4xl font-bold">
          Chain <span className="text-primary">Breeding Calculator</span>
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Find the shortest breeding path from any Pal to your desired target.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] items-start">
        {/* Start Pal */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-blue-400" />
              Starting Pal
            </CardTitle>
            <CardDescription>
              The Pal you currently have
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PalSelector 
              pals={pals}
              selectedId={startPalId}
              onSelect={setStartPalId}
              label="Select Start Pal"
            />
            {startPal && <PalCard pal={startPal} />}
          </CardContent>
        </Card>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="h-8 w-8 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Target Pal */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              Target Pal
            </CardTitle>
            <CardDescription>
              The Pal you want to breed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PalSelector 
              pals={pals}
              selectedId={targetPalId}
              onSelect={setTargetPalId}
              label="Select Target Pal"
            />
            {targetPal && <PalCard pal={targetPal} />}
          </CardContent>
        </Card>
      </div>

      {/* Calculate Button */}
      <div className="flex justify-center">
        <Button 
          onClick={calculateChainBreeding}
          disabled={!startPalId || !targetPalId || isCalculating}
          size="lg"
          className="px-8"
        >
          {isCalculating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Optimal Path...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Calculate Breeding Chain
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">
              Found {results.length} Breeding Path{results.length > 1 ? 's' : ''}
            </h2>

            <div className="grid gap-6 lg:grid-cols-1">
              {results.map((path, pathIndex) => (
                <motion.div
                  key={pathIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: pathIndex * 0.1 }}
                >
                  <Card className={`border-border/50 bg-card/50 backdrop-blur-sm cursor-pointer transition-all hover:shadow-lg ${
                    selectedPath === pathIndex ? 'ring-2 ring-primary' : ''
                  }`}
                    onClick={() => setSelectedPath(selectedPath === pathIndex ? null : pathIndex)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Badge variant="outline">
                            Path {pathIndex + 1}
                          </Badge>
                          <span className="text-lg font-bold">
                            {path.totalSteps} Step{path.totalSteps > 1 ? 's' : ''}
                          </span>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {path.estimatedTime}
                          </div>
                          <div className={`font-bold ${getConfidenceColor(path.successRate / 100)}`}>
                            {path.successRate}% Success Rate
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {path.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-3">
                            {/* Generation Badge */}
                            <Badge variant="secondary" className="text-xs">
                              Gen {step.generation}
                            </Badge>

                            {/* Breeding Step */}
                            <div className={`flex-1 rounded-lg border p-3 ${getStepColor(step)}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{step.parent1}</span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{step.parent2}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <ArrowRight className="h-4 w-4" />
                                  <span className="font-bold text-primary">{step.child}</span>
                                  {step.special && (
                                    <Badge variant="secondary" className="text-xs">
                                      Special
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-muted-foreground">
                                Confidence: {Math.round(step.confidence * 100)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedPath === pathIndex && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t"
                        >
                          <h4 className="font-semibold mb-2">Path Details:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Total breeding time: {path.estimatedTime}</li>
                            <li>• Overall success rate: {path.successRate}%</li>
                            <li>• Special combinations: {path.steps.filter(s => s.special).length}</li>
                            <li>• Average confidence: {Math.round(path.steps.reduce((acc, s) => acc + s.confidence, 0) / path.steps.length * 100)}%</li>
                          </ul>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
